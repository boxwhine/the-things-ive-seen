# Terraform — Main Configuration

This is the main Terraform config for the project's cloud infrastructure. It currently provisions the VPC; EKS, RDS, and IAM land in subsequent module phases.

State is stored remotely in S3 (`ttis-tf-state-478335820689`) with native locking. Bootstrap of the state bucket lives in [`bootstrap/`](./bootstrap/README.md) — that's a one-shot config you don't normally touch.

## How to run

All commands assume `AWS_PROFILE=ttis` is exported or prepended per-command.

```bash
# First time on a new machine
terraform -chdir=terraform init

# Standard apply loop
terraform -chdir=terraform fmt -recursive
terraform -chdir=terraform plan -out=tfplan
terraform -chdir=terraform apply tfplan

# Tear down (releases NAT GW + EIP, leaves the state bucket and guardrails)
terraform -chdir=terraform destroy
```

The main config is **destroy-recreate by design** — see [ADR-0012](../docs/adr/0012-bursty-by-design-infra.md). The bootstrap config is one-shot; do not destroy it casually (see [`bootstrap/README.md`](./bootstrap/README.md)).

## File layout

| File           | What's in it                                                                        |
| -------------- | ----------------------------------------------------------------------------------- |
| `versions.tf`  | Terraform + AWS provider version pins                                               |
| `providers.tf` | AWS provider config + `default_tags` applied to every taggable resource             |
| `variables.tf` | `aws_region`, `project_name`, `environment`                                         |
| `backend.tf`   | S3 remote state config (bucket name hardcoded — backends can't reference variables) |
| `vpc.tf`       | VPC + 9 subnets across 3 AZs + single managed NAT GW (community module call)        |
| `security.tf`  | Default SG lockdown (CIS 4.3) — strips rules from the auto-created VPC default SG   |
| `outputs.tf`   | Handoffs consumed by EKS (3c) and RDS (3d): VPC ID, subnet IDs, NAT IPs, AZ list    |

## Cost cheat sheet

| Resource                                    | Per-hour rate | At 16 hr/mo (est. session usage) |
| ------------------------------------------- | ------------- | -------------------------------- |
| VPC, subnets, IGW, route tables, default SG | $0            | $0                               |
| NAT Gateway                                 | $0.045        | ~$0.72                           |
| NAT data processing                         | $0.045/GB     | ~$0 (low egress)                 |
| Elastic IP (attached to NAT)                | $0            | $0 (only orphaned EIPs cost)     |
| **3b total**                                |               | **~$0.72/mo**                    |

If `aws s3 ls` ever shows the NAT EIP detached or you see >$0.50/day in Cost Explorer for >2 days, something's left running — start with `aws ec2 describe-nat-gateways` and the EKS console.

## Architecture decisions live in ADRs, not here

This README is operator-focused. The reasoning behind the architecture is in the ADR log:

- **Why is this destroy-recreate, not always-on?** [ADR-0012 — Bursty-by-Design Cloud Infrastructure](../docs/adr/0012-bursty-by-design-infra.md)
- **Why use the community VPC module instead of hand-rolling?** [ADR-0013](../docs/adr/0013-terraform-vpc-community-module.md)
- **Why a single NAT GW and not one per AZ?** [ADR-0014](../docs/adr/0014-single-managed-nat-gateway.md)
- **Why RDS instead of SQLite for the data store?** [ADR-0015](../docs/adr/0015-rds-over-sqlite-for-data-store.md)

## Always-on guardrails (live in `bootstrap/`, not here)

- **AWS Budget** at $5/mo with alerts at 80%/100%/forecasted-100% → email
- **Cost Anomaly Detection** with $3 single-anomaly threshold → email

These are intentionally outside this config so they keep watching when the main config is destroyed. See [`bootstrap/README.md`](./bootstrap/README.md).

## Deferred

| Item                                             | Where it goes                                                                       |
| ------------------------------------------------ | ----------------------------------------------------------------------------------- |
| `kubernetes.io/cluster/<name>=shared` subnet tag | 3c — added once cluster name exists; AWS LB Controller ≥ 2.4 doesn't need it anyway |
| VPC flow logs                                    | Module 07 (Logging & Tracing)                                                       |
| VPC endpoints for S3/ECR/STS                     | Indefinite — would reduce NAT data processing but cost more than NAT at our scale   |
| Secondary CIDR for high pod density              | Future-self escape hatch — VPC CNI custom-networking + 100.64.0.0/16 secondary      |

## Coming next

- **3c (EKS):** cluster + managed node group + IRSA OIDC provider + AWS LB Controller + a `Makefile` with `make session-start` / `make session-end` lifecycle commands.
- **3d (RDS):** PostgreSQL instance + RDS security group + Secrets Manager wiring + `final_snapshot_identifier` so data persists across destroys.
