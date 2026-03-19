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