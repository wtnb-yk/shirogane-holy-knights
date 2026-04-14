output "bucket_name" {
  description = "S3 bucket that hosts the maintenance site content"
  value       = aws_s3_bucket.site.bucket
}

output "bucket_arn" {
  description = "ARN of the maintenance site S3 bucket"
  value       = aws_s3_bucket.site.arn
}

output "cloudfront_distribution_id" {
  description = "CloudFront distribution id (use for cache invalidation)"
  value       = aws_cloudfront_distribution.site.id
}

output "cloudfront_domain_name" {
  description = "CloudFront distribution domain name"
  value       = aws_cloudfront_distribution.site.domain_name
}

output "site_url" {
  description = "Primary URL of the maintenance site"
  value       = "https://${var.domain_name}"
}
