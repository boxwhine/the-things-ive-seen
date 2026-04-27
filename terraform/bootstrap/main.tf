provider "aws" {
  region = "us-east-1"
}

data "aws_caller_identity" "current" {}

locals {
  state_bucket_name = "ttis-tf-state-${data.aws_caller_identity.current.account_id}"
  common_tags = {
    Project   = "the-things-ive-seen"
    ManagedBy = "terraform"
    Component = "tf-state-backend"
  }
}

resource "aws_s3_bucket" "state" {
  bucket = local.state_bucket_name

  tags = local.common_tags
}

resource "aws_s3_bucket_versioning" "state" {
  bucket = aws_s3_bucket.state.id

  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "state" {
  bucket = aws_s3_bucket.state.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
    bucket_key_enabled = true
  }
}

resource "aws_s3_bucket_public_access_block" "state" {
  bucket = aws_s3_bucket.state.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# Primary cost guardrail. Catches "oops, I left the cluster running" within ~30 hours
# at the $5/mo cap. See ADR-0012 for the bursty-by-design rationale this defends.
resource "aws_budgets_budget" "monthly" {
  name         = "ttis-monthly-cap"
  budget_type  = "COST"
  limit_amount = tostring(var.monthly_budget_usd)
  limit_unit   = "USD"
  time_unit    = "MONTHLY"

  notification {
    comparison_operator        = "GREATER_THAN"
    threshold                  = 80
    threshold_type             = "PERCENTAGE"
    notification_type          = "ACTUAL"
    subscriber_email_addresses = [var.alert_email]
  }

  notification {
    comparison_operator        = "GREATER_THAN"
    threshold                  = 100
    threshold_type             = "PERCENTAGE"
    notification_type          = "ACTUAL"
    subscriber_email_addresses = [var.alert_email]
  }

  notification {
    comparison_operator        = "GREATER_THAN"
    threshold                  = 100
    threshold_type             = "PERCENTAGE"
    notification_type          = "FORECASTED"
    subscriber_email_addresses = [var.alert_email]
  }
}

# Secondary guardrail (free). Catches single-day spikes the monthly budget
# might smooth out, e.g., a one-shot expensive resource someone forgot to destroy.
resource "aws_ce_anomaly_monitor" "service" {
  name              = "ttis-service-anomaly-monitor"
  monitor_type      = "DIMENSIONAL"
  monitor_dimension = "SERVICE"
}

resource "aws_ce_anomaly_subscription" "email" {
  name      = "ttis-anomaly-email"
  frequency = "DAILY"

  monitor_arn_list = [aws_ce_anomaly_monitor.service.arn]

  subscriber {
    type    = "EMAIL"
    address = var.alert_email
  }

  threshold_expression {
    dimension {
      key           = "ANOMALY_TOTAL_IMPACT_ABSOLUTE"
      values        = [tostring(var.anomaly_threshold_usd)]
      match_options = ["GREATER_THAN_OR_EQUAL"]
    }
  }
}
