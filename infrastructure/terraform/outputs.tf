output "s3_bucket_name" {
  description = "S3 bucket name for danin-log.db"
  value       = module.data_storage.bucket_name
}

output "vercel_access_key_id" {
  description = "AWS access key ID for Vercel prebuild (S3 read-only)"
  value       = module.data_storage.vercel_access_key_id
  sensitive   = true
}

output "vercel_secret_access_key" {
  description = "AWS secret access key for Vercel prebuild (S3 read-only)"
  value       = module.data_storage.vercel_secret_access_key
  sensitive   = true
}

output "lambda_function_name" {
  description = "Lambda function name"
  value       = module.data_pipeline.lambda_function_name
}

output "lambda_log_group" {
  description = "CloudWatch Logs group for Lambda"
  value       = module.data_pipeline.log_group_name
}
