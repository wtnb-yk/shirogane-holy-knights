# Shared Route53 Hosted Zone
# This resource is shared between all environments
data "aws_route53_zone" "main" {
  name = "noe-room.com"
}

# Output the zone ID for use in environment-specific configurations
output "route53_zone_id" {
  value       = data.aws_route53_zone.main.zone_id
  description = "The ID of the shared Route53 hosted zone"
}

output "route53_zone_name" {
  value       = data.aws_route53_zone.main.name
  description = "The name of the shared Route53 hosted zone"
}