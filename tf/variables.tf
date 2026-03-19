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