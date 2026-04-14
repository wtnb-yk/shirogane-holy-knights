variable "environment" {
  description = "Environment name (e.g., prd)"
  type        = string
}

variable "project_name" {
  description = "Project name used as resource prefix"
  type        = string
}

variable "domain_name" {
  description = "Primary domain name for the maintenance site (apex, e.g., noe-room.com)"
  type        = string
}

variable "include_www" {
  description = "Whether to also serve www.<domain_name> via the same distribution"
  type        = bool
  default     = true
}

variable "hosted_zone_id" {
  description = "Route53 hosted zone id for domain_name"
  type        = string
}

variable "price_class" {
  description = "CloudFront price class"
  type        = string
  default     = "PriceClass_200"
}

variable "default_ttl_seconds" {
  description = "CloudFront default TTL for cached objects"
  type        = number
  default     = 3600
}

variable "tags" {
  description = "Extra tags"
  type        = map(string)
  default     = {}
}
