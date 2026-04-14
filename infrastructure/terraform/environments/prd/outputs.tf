# Maintenance site outputs
output "maintenance_site_bucket_name" {
  description = "S3 bucket hosting the maintenance site HTML"
  value       = module.maintenance_site.bucket_name
}

output "maintenance_site_cloudfront_distribution_id" {
  description = "CloudFront distribution id for the maintenance site (use for invalidation)"
  value       = module.maintenance_site.cloudfront_distribution_id
}

output "maintenance_site_cloudfront_domain_name" {
  description = "CloudFront domain of the maintenance site"
  value       = module.maintenance_site.cloudfront_domain_name
}

output "maintenance_site_url" {
  description = "Public URL of the maintenance site"
  value       = module.maintenance_site.site_url
}

# Shared images CDN outputs (retained for the future renewal)
output "cdn_s3_bucket_name" {
  description = "Name of the CDN S3 bucket (shared)"
  value       = aws_s3_bucket.images.id
}

output "cdn_s3_bucket_arn" {
  description = "ARN of the CDN S3 bucket (shared)"
  value       = aws_s3_bucket.images.arn
}

output "cdn_cloudfront_url" {
  description = "CloudFront distribution URL (shared)"
  value       = "https://${aws_cloudfront_distribution.images.domain_name}"
}

output "cdn_cloudfront_domain" {
  description = "CloudFront distribution domain name (shared)"
  value       = aws_cloudfront_distribution.images.domain_name
}
