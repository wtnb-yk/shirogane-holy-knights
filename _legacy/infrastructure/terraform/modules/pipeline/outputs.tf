output "pipeline_name" {
  description = "CodePipeline name"
  value       = aws_codepipeline.main.name
}

output "pipeline_arn" {
  description = "CodePipeline ARN"
  value       = aws_codepipeline.main.arn
}

output "github_connection_arn" {
  description = "GitHub CodeStar connection ARN"
  value       = aws_codestarconnections_connection.github.arn
}

output "migration_security_group_id" {
  description = "Migration CodeBuild security group ID"
  value       = aws_security_group.codebuild_migration.id
}

output "artifacts_bucket_name" {
  description = "Pipeline artifacts S3 bucket name"
  value       = aws_s3_bucket.pipeline_artifacts.bucket
}