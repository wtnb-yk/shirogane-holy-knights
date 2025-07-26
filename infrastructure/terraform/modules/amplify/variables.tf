variable "environment" {
  description = "Environment name"
  type        = string
}

variable "project_name" {
  description = "Project name"
  type        = string
}

variable "github_repository" {
  description = "GitHub repository URL"
  type        = string
}

variable "github_branch" {
  description = "GitHub branch to deploy"
  type        = string
  default     = "main"
}

variable "github_access_token" {
  description = "GitHub personal access token"
  type        = string
  sensitive   = true
}

variable "build_spec" {
  description = "Build specification for Amplify"
  type        = string
}

variable "environment_variables" {
  description = "Environment variables for the Amplify app"
  type        = map(string)
  default     = {}
}

variable "enable_auto_build" {
  description = "Enable automatic build on git push"
  type        = bool
  default     = true
}

variable "custom_domain" {
  description = "Custom domain for the app (optional)"
  type        = string
  default     = ""
}