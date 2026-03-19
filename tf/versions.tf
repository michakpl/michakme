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