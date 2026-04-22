output "bucket_name" {
  description = "S3 bucket name"
  value       = aws_s3_bucket.data.bucket
}

output "bucket_arn" {
  description = "S3 bucket ARN"
  value       = aws_s3_bucket.data.arn
}

output "events_table_name" {
  description = "DynamoDB events table name"
  value       = aws_dynamodb_table.events.name
}

output "events_table_arn" {
  description = "DynamoDB events table ARN"
  value       = aws_dynamodb_table.events.arn
}

output "vercel_access_key_id" {
  description = "Vercel IAM user access key ID"
  value       = aws_iam_access_key.vercel.id
  sensitive   = true
}

output "vercel_secret_access_key" {
  description = "Vercel IAM user secret access key"
  value       = aws_iam_access_key.vercel.secret
  sensitive   = true
}
