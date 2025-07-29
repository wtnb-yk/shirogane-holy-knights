# Amplify App
resource "aws_amplify_app" "main" {
  name = "${var.project_name}-${var.environment}"
  
  # Next.js 14+ SSR requires WEB_COMPUTE platform
  platform = "WEB_COMPUTE"

  # GitHub連携
  repository   = var.github_repository
  access_token = var.github_access_token

  # Let Amplify use the amplify.yml file in the frontend directory

  # Environment variables
  environment_variables = var.environment_variables

  # SSRアプリケーション用のログ有効化
  enable_auto_branch_creation = false
  enable_basic_auth = false
  enable_branch_auto_build = true
  enable_branch_auto_deletion = false

  # Next.js SSR routing - let server handle all requests
  custom_rule {
    source = "/<*>"
    status = "200"
    target = "/<*>"
  }
}

# Amplify Branch
resource "aws_amplify_branch" "main" {
  app_id      = aws_amplify_app.main.id
  branch_name = "main"

  framework = "Next.js - SSR"
  stage     = var.environment == "prod" ? "PRODUCTION" : "DEVELOPMENT"

  enable_auto_build = true
}

# Amplify Domain Association (optional)
resource "aws_amplify_domain_association" "main" {
  count = var.custom_domain != "" ? 1 : 0

  app_id      = aws_amplify_app.main.id
  domain_name = var.custom_domain

  sub_domain {
    branch_name = aws_amplify_branch.main.branch_name
    prefix      = var.environment == "prod" ? "" : var.environment
  }
}

# Amplify Webhook (for manual deployments)
resource "aws_amplify_webhook" "main" {
  app_id      = aws_amplify_app.main.id
  branch_name = aws_amplify_branch.main.branch_name
  description = "Webhook for manual deployments"
}