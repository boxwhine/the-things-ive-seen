variable "alert_email" {
  description = "Email address that receives Budget and Cost Anomaly Detection alerts. Set in terraform.tfvars (gitignored)."
  type        = string
}

variable "monthly_budget_usd" {
  description = "Monthly AWS spend ceiling in USD. Alerts fire at 80%, 100%, and forecasted-100%."
  type        = number
  default     = 5
}

variable "anomaly_threshold_usd" {
  description = "Single-anomaly threshold in USD. Cost Anomaly Detection emails when an unexpected spend spike exceeds this."
  type        = number
  default     = 3
}
