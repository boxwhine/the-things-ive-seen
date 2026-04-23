output "state_bucket_name" {
  description = "Name of the S3 bucket storing Terraform remote state for the main config"
  value       = aws_s3_bucket.state.id
}

output "state_bucket_arn" {
  description = "ARN of the state bucket"
  value       = aws_s3_bucket.state.arn
}

output "state_bucket_region" {
  description = "Region the state bucket lives in; must match the backend block in ../terraform/backend.tf"
  value       = aws_s3_bucket.state.region
}

output "budget_name" {
  description = "Name of the monthly cost budget. Inspect at https://console.aws.amazon.com/billing/home#/budgets"
  value       = aws_budgets_budget.monthly.name
}

output "alert_email" {
  description = "Email currently subscribed to budget + anomaly alerts. Confirm AWS Budget verification email landed in this inbox."
  value       = var.alert_email
}
