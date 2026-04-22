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
