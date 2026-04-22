variable "aws_region" {
  description = "AWS region for all resources in this configuration"
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Short project identifier; used in resource names and tags"
  type        = string
  default     = "ttis"
}

variable "environment" {
  description = "Deployment environment; used in tags and resource names"
  type        = string
  default     = "prod"
}
