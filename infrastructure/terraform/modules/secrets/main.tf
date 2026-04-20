# YouTube Data API key
resource "aws_secretsmanager_secret" "youtube_api" {
  name        = "/${var.project_name}/youtube-api-key"
  description = "YouTube Data API key for ${var.project_name}"

  lifecycle {
    ignore_changes = [name]
  }
}

# Vercel Deploy Hook URL
resource "aws_secretsmanager_secret" "deploy_hook" {
  name        = "/${var.project_name}/vercel-deploy-hook"
  description = "Vercel Deploy Hook URL for ${var.project_name}"

  lifecycle {
    ignore_changes = [name]
  }
}
