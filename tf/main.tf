resource "bunnynet_storage_zone" "blog" {
  name      = var.project_name
  region    = var.storage_region
  zone_tier = "Standard"

  replication_regions = ["UK"]
}

resource "bunnynet_pullzone" "blog" {
  name = var.project_name

  origin {
    type        = "StorageZone"
    storagezone = bunnynet_storage_zone.blog.id
  }

  routing {
    tier  = "Standard"
    zones = ["EU", "US"]
  }

  cache_expiration_time         = 2592000
  cache_expiration_time_browser = 86400
  cache_errors                  = false
  cache_stale                   = ["updating"]

  sort_querystring = true

  limit_bandwidth = var.monthly_bandwidth_limit_gb * 1024 * 1024 * 1024

  block_post_requests = true

  allow_referers = [
    "https://${var.custom_hostname}",
    "https://www.${var.custom_hostname}"
  ]

  block_no_referer = false
}

resource "bunnynet_pullzone_hostname" "blog" {
  name        = var.custom_hostname
  pullzone    = bunnynet_pullzone.blog.id
  tls_enabled = true
  force_ssl   = true
}

resource "bunnynet_pullzone_shield" "blog_shield" {
  pullzone = bunnynet_pullzone.blog.id

  ddos {
    level = "Medium"
  }

  waf {
    enabled = true

    allowed_http_methods = ["GET", "HEAD"]
  }
}