output "app_id" {
  description = "Amplify app ID"
  value       = aws_amplify_app.main.id
}

output "app_url" {
  description = "Default Amplify app URL"
  value       = "https://${aws_amplify_branch.main.branch_name}.${aws_amplify_app.main.id}.amplifyapp.com"
}

output "custom_domain_url" {
  description = "Custom domain URL if configured"
  value       = var.custom_domain != "" ? "https://${var.environment == "prd" ? "www." : "${var.environment}."}${var.custom_domain}" : ""
}

output "webhook_url" {
  description = "Webhook URL for manual deployments"
  value       = aws_amplify_webhook.main.url
}