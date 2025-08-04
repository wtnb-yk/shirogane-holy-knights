# Shared GitHub Personal Access Token
# This SSM parameter is shared between all environments

# Create a shared SSM parameter for GitHub token if it doesn't exist
resource "aws_ssm_parameter" "github_token" {
  name        = "/shirogane-holy-knights/shared/github-token"
  description = "GitHub Personal Access Token for Amplify deployments (shared across environments)"
  type        = "SecureString"
  value       = "dummy-value-to-be-updated-manually" # This should be updated manually after creation
  
  lifecycle {
    ignore_changes = [value]
  }

  tags = {
    Purpose   = "GitHub Integration"
    Shared    = "true"
    ManagedBy = "Terraform"
  }
}

# Output for use in environment-specific configurations
output "github_token_parameter_name" {
  value       = aws_ssm_parameter.github_token.name
  description = "The name of the shared GitHub token SSM parameter"
}

output "github_token_parameter_arn" {
  value       = aws_ssm_parameter.github_token.arn
  description = "The ARN of the shared GitHub token SSM parameter"
}