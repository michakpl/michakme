---
title: "Simple Astro blog on Bunny.net, with Terraform and buddy.works CI"
date: "2026-03-30"
excerpt: "Some notes on the deployment of this blog, done in Astro, and deployed to Bunny.net with Terraform and buddy.works CI."
---

In the past, I always used WordPress to host my personal blog on this domain. And it worked fine, but it was overkill for the simple content I wanted to publish, and I wanted to have more control over the content and the way it is published. So I decided to switch to a static site generator, and I chose Astro for that. It is a great tool for building static sites, and it has a lot of features that make it easy to use.

I decided to go with European solutions for infrastructure, as much as possible, and I chose [Bunny.net](https://bunny.net?ref=319r9tte5h) for that. Additionally, to store Terraform state, I use Scaleway Object Storage and Buddy.Works for CI.

In the **versions.tf** file, I specify the required Terraform version and the provider to Bunny.net. You can notice the skipping of validations for the backend. The reason behind it is that I store Terraform state in the Scaleway Object Storage, not AWS S3. However, both are compatible and Scaleway does not have their own backend to use.

## Terraform

```hcl
terraform {
  required_version = ">= 1.14"

  required_providers {
    bunnynet = {
      source  = "BunnyWay/bunnynet"
      version = "~> 0.13.0"
    }
  }

  backend "s3" {
    key = "terraform.tfstate"

    skip_credentials_validation = true
    skip_region_validation      = true
    skip_requesting_account_id  = true
    skip_metadata_api_check     = true
  }
}

provider "bunnynet" {
  api_key = var.bunny_api_key
}
```

**variables.tf** contains all the variables that are used in the Terraform code. I think descriptions are enough, so I won't go into details here.

```hcl
variable "bunny_api_key" {
  description = "Bunny.net API key"
  type        = string
  sensitive   = true
}

variable "project_name" {
  description = "Project name"
  type        = string
}

variable "custom_hostname" {
  description = "Custom hostname for the website"
  type        = string
}

variable "storage_region" {
  description = "Storage region for Bunny.net storage zone"
  type        = string
  default     = "DE"
}

variable "monthly_bandwidth_limit_gb" {
  description = "Monthly bandwidth limit for Bunny.net storage zone in GB"
  type        = number
  default     = 50
}
```

In **outputs.tf** I added a few outputs, I don't use them in the code anywhere yet, but they are useful for debugging.

```hcl
output "cdn_domain" {
  description = "The CDN domain for the pull zone"
  value       = bunnynet_pullzone.blog.cdn_domain
}

output "storage_hostname" {
  description = "The hostname for the storage zone"
  value       = bunnynet_storage_zone.blog.hostname
}

output "storage_zone_name" {
  description = "The name of the storage zone"
  value       = bunnynet_storage_zone.blog.name
}

output "storage_password" {
  description = "The password for the storage zone"
  value       = bunnynet_storage_zone.blog.password
  sensitive   = true
}

output "pullzone_id" {
  description = "The ID of the pull zone"
  value       = bunnynet_storage_zone.blog.id
}

output "custom_hostname_ssl_status" {
  description = "Whether SSL is enabled for the custom hostname"
  value       = bunnynet_pullzone_hostname.blog.tls_enabled
}
```

And now last but not least, I added the **main.tf** file. It contains the Terraform code for storage, pull zone, custom hostname and security policy.

```hcl
resource "bunnynet_storage_zone" "blog" {
  name      = var.project_name
  region    = var.storage_region
  zone_tier = "Standard"

  replication_regions = ["UK"] // I want to replicate to UK for redundancy
}

resource "bunnynet_pullzone" "blog" {
  name = var.project_name

  origin {
    type        = "StorageZone"
    storagezone = bunnynet_storage_zone.blog.id
  }

  routing {
    tier  = "Standard"
    zones = ["EU", "US"] // I want to route to EU and US for redundancy
  }

  cache_expiration_time         = 2592000
  cache_expiration_time_browser = 86400
  cache_errors                  = false // I don't want to cache error responses
  cache_stale                   = ["updating"] // I want to prioritize serving of content, while updating cache with fresh content

  sort_querystring = true // Actually I don't expect to have a lot of query parameters, but I want to make sure that they are sorted to optimize caching

  limit_bandwidth = var.monthly_bandwidth_limit_gb * 1024 * 1024 * 1024 // Limit bandwidth to the specified monthly limit in GB
  
  block_post_requests = true // Securing the pull zone by blocking POST requests

  block_no_referer = false // Allow requests from clients that don't send referer header, as it is common for some browsers, and I don't want to block them from accessing the content
}

resource "bunnynet_pullzone_hostname" "blog" {
  name        = var.custom_hostname
  pullzone    = bunnynet_pullzone.blog.id
  tls_enabled = true // Enable TLS for the blog
  force_ssl   = true // Force SSL connection for the blog
}

resource "bunnynet_pullzone_shield" "blog_shield" {
  pullzone = bunnynet_pullzone.blog.id

  ddos {
    level = "Medium" // Medium DDoS protection
  }

  waf {
    enabled = true // Enable WAF rules to protect the blog

    allowed_http_methods = ["GET", "HEAD"] // Allow only GET and HEAD requests to additionally protect the blog from malicious requests
  }
}
```

## Buddy Works CI
I use [Buddy Works](https://buddy.works) for CI, and it's maybe not so simple to set up, as there is no much ready-to-use documentation, especially for other less popular services like Bunny.net. But almost everything I do afterhours is for fun, and it was a great adventure to make it work.

I decided to divide my CI into two pipelines: One for Pull Requests to just validate the Terraform plan and the second for the main branch to deploy the blog.

Below is the **buddy.yaml** file for both pipelines.

```yaml
- pipeline: "Terraform Plan"
  events:
    - type: "PUSH"
      refs:
        - "refs/pull/*"
  actions:
    - action: "terraform init & plan"
      type: "BUILD"
      docker_image_name: "hashicorp/terraform"
      docker_image_tag: "1.14.7"
      working_directory: "/buddy/michakme/tf" # Path in Buddy Works is usually in format /buddy/repository_name
      reset_entrypoint: true # This is needed to reset the entrypoint to the default one, to execute the commands in the working directory
      execute_commands: # All variables are set in Buddy Works as environment variables, and they are injected into the build environment during execution
        - terraform init
          -backend-config="bucket=$TF_BACKEND_CONFIG_BUCKET"
          -backend-config="region=$TF_BACKEND_CONFIG_REGION"
          -backend-config="endpoints={s3=\"$TF_BACKEND_CONFIG_ENDPOINT\"}"
          -backend-config="access_key=$SCW_ACCESS_KEY"
          -backend-config="secret_key=$SCW_ACCESS_SECRET"
        - terraform plan
- pipeline: "Plan, Build and Deploy"
  events:
    - type: "PUSH"
      refs:
        - "refs/heads/main"
  actions:
    - action: "terraform init & plan"
      type: "BUILD"
      docker_image_name: "hashicorp/terraform"
      docker_image_tag: "1.14.7"
      working_directory: "/buddy/michakme/tf"
      reset_entrypoint: true
      execute_commands:
        - terraform init
          -backend-config="bucket=$TF_BACKEND_CONFIG_BUCKET"
          -backend-config="region=$TF_BACKEND_CONFIG_REGION"
          -backend-config="endpoints={s3=\"$TF_BACKEND_CONFIG_ENDPOINT\"}"
          -backend-config="access_key=$SCW_ACCESS_KEY"
          -backend-config="secret_key=$SCW_ACCESS_SECRET"
        - terraform plan
    - action: "wait for plan approval"
      type: "WAIT_FOR_APPLY" # This action waits for approval from the user before proceeding to the next action
      trigger_time: "ON_EVERY_EXECUTION"
      comment: "Do you want to apply the plan?"
    - action: "terraform apply"
      type: "BUILD"
      docker_image_name: "hashicorp/terraform"
      docker_image_tag: "1.14.7"
      working_directory: "/buddy/michakme/tf"
      reset_entrypoint: true
      execute_commands:
        - terraform apply -auto-approve
    - action: "install dependencies and build"
      type: "BUILD"
      docker_image_name: "node"
      docker_image_tag: "25-alpine"
      working_directory: "/buddy/michakme"
      execute_commands:
        - npm install -g pnpm@latest-10 # In the Node.js 25 image there is no more corepack that was usually recommended to install pnpm
        - pnpm install
        - pnpm run build
    - action: "wait for deploy approval"
      type: "WAIT_FOR_APPLY"
      trigger_time: "ON_EVERY_EXECUTION"
      comment: "Do you want to deploy?"
    - action: "deploy"
      type: "TRANSFER" # Deploy to Bunny.net is possible through FRP or API, in this case I decided to use the FTP transfer
      input_type: "BUILD_ARTIFACTS" # The build artifacts we built in the previous step
      local_path: "/dist" # In the transfer local path is relative to the /boddy/repository_name, so in this case it is /buddy/michakme/dist
      remote_path: "/" # This is the path in the Bunny.net storage, usually it is /
      deployment_excludes: # I do not expect to have any sensitive files in the repository, but I want to make sure that even if they are there, they are not deployed to the Bunny.net storage, so I exclude them from the deployment
        - "buddy.yaml"
        - ".git"
        - ".env*"
      targets:
        - target: "production"
          type: "FTP"
          secure: false # Bunny.net FTP server does not support SSL,
          host: $FTP_HOST
          port: $FTP_PORT
          auth:
            username: $FTP_USERNAME
            password: $FTP_PASSWORD
    - action: "purge cache" # Purge the cache after deployment to make sure that the new content is served immediately. This is done with the Bunny.net API call
      type: "HTTP"
      notification_url: "https://api.bunny.net/pullzone/$PULLZONE_ID/purgeCache"
      method_url: "POST"
      headers:
        - name: "AccessKey"
          value: $TF_VAR_bunny_api_key
        - name: "Content-Type"
          value: "application/json"
```

And that's all folks! I hope this blog post will be useful for someone who wants to set up a similar infrastructure for their blog or website. If you have any questions or suggestions, feel free to reach out to me on [**Mastodon**](https://mastodon.social/@michakpl) or [**GitHub**](https://github.com/michakpl).