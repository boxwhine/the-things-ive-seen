# Module 03: Cloud Infrastructure & Terraform

**Status:** 🟡 In Progress

**Start Date:** 2026-04-21

**End Date:** —

## Goal

Provision all cloud infrastructure via Terraform and deploy the application to AWS EKS with a managed PostgreSQL database (RDS) and proper secrets management. The app should be deployed to EKS and reachable from within the VPC (e.g., via `kubectl port-forward`). Public exposure (Route53, ingress, DNS) is deferred to Module 04 so it coincides with authentication landing — see the 2026-04-22 "Scope reorder" Notes entry below.

The cluster is **bursty by design** ([ADR-0012](../adr/0012-bursty-by-design-infra.md)) — created at the start of an active session and destroyed at the end, not run continuously. Cost guardrails (Budget + Cost Anomaly Detection) and a session-lifecycle harness (`make session-start` / `make session-end`, lands in 3c) make that workflow safe.

## Acceptance Criteria

### Setup

- [x] Set up AWS account (or use existing)
- [x] Install AWS CLI and configure credentials
- [x] Install Terraform
- [x] Complete a basic Terraform tutorial (provision an S3 bucket, then destroy it)

### Cost Guardrails

- [x] AWS Budget at $5/mo with email alerts at 80%/100%/forecasted-100% (lives in `terraform/bootstrap/`)
- [x] AWS Cost Anomaly Detection with $3 single-anomaly email subscription (lives in `terraform/bootstrap/`)
- [ ] `make session-start` / `make session-end` lifecycle harness (lands with 3c)
- [ ] RDS final-snapshot persistence so data survives destroy/recreate (lands with 3d)

### Infrastructure

- [x] Write Terraform for VPC, subnets, and security groups
- [ ] Provision an EKS cluster via Terraform
- [x] Document any issues or surprises encountered

### Deploy to Cloud

- [ ] Connect kubectl to EKS cluster
- [ ] Configure ECR as container registry for production images
- [ ] Deploy the application to cloud Kubernetes
- [ ] Troubleshoot connectivity issues (expected)

### Database & Secrets

- [ ] Provision RDS (PostgreSQL 16) via Terraform
- [ ] Configure application to connect to RDS
- [ ] Set up secrets management (Kubernetes Secrets or AWS Secrets Manager)
- [ ] Run database migrations against cloud DB

## Related ADRs

- [ADR-0012 — Bursty-by-Design Cloud Infrastructure](../adr/0012-bursty-by-design-infra.md)
- [ADR-0013 — Use the Community VPC Module Over a Hand-Rolled VPC](../adr/0013-terraform-vpc-community-module.md)
- [ADR-0014 — Single Managed NAT Gateway](../adr/0014-single-managed-nat-gateway.md)
- [ADR-0015 — Use RDS PostgreSQL Over SQLite for the Application Data Store](../adr/0015-rds-over-sqlite-for-data-store.md)

## Notes & Discoveries

<!-- Capture decisions made on the fly, unexpected findings, or context that doesn't warrant a full ADR. Append entries as you go. -->

### 2026-04-21 — AWS account and CLI already configured from Module 02

- AWS account + CLI were prerequisites for Module 02's ECR work (`scripts/setup-ecr-repos.sh`, `scripts/setup-github-oidc.sh`); both checklist items got completed there.

### 2026-04-22 — Terraform installed via tfenv; S3 tutorial complete

- Terraform via `tfenv` (version-managed, mirrors `.nvmrc`). Installed 1.14.9; AWS provider 6.41.0.
- **IAM Identity Center gotcha — account instance vs organization instance.** First attempt enabled it as an **account instance**, which only supports AWS-managed app identities (Amazon Q, QuickSight) — no permission sets, no account federation, navigation items literally missing. Fix: created a single-account AWS Organization (this account = management account), re-enabled Identity Center (auto-provisioned as Organization instance), created `AdminAccess` permission set. Anything involving `aws configure sso` requires an Organization instance.
- AWS profile `ttis` via `aws configure sso`. Used `AWS_PROFILE=ttis` per-command (scoped blast radius across multiple accounts on the machine), not exported globally. Same account as Module 02's ECR/OIDC work.
- Tutorial ran `init→plan→apply→destroy` on a single S3 bucket from `~/scratch/tf-tutorial/` (not committed). Three-way teardown verification (CLI `ls`, `head-bucket`, `terraform state list`) confirmed clean.
- **Conventions to carry forward:** pin `required_version` + `~> N.0` on AWS provider; commit `.terraform.lock.hcl`; gitignore `.terraform/`, `*.tfstate*`, `*.tfvars`; `-out=tfplan` for non-trivial plans; `terraform fmt -recursive` before commits; `AWS_PROFILE=ttis` per-invocation.

### 2026-04-22 — Infrastructure phase 3a: remote state backend + terraform/ skeleton

- **Split layout:** `bootstrap/` (local state, one-shot) creates the S3 state bucket; `terraform/` (remote state) is everything else. Solves the chicken-and-egg: backend must exist before remote state can write to it.
- **`use_lockfile = true` over DynamoDB.** Terraform 1.11+ added S3-native state locking via conditional writes — no DynamoDB table needed. DynamoDB is still the dominant pattern in older tutorials/codebases, so worth recognizing both.
- **Backend config can't reference variables** (it initializes before variables parse) — `backend.tf` hardcodes the bucket name. Multi-env workaround would be `-backend-config=env.hcl` at `init` time.
- **State key is flat (`terraform.tfstate`), not module-prefixed.** Tempting to namespace by learning module; wrong because modules aren't deployment boundaries here — later modules deploy into the same VPC/EKS and need cross-resource references without cross-state lookups. Standard reasons to split state are environment or layer, not learning cadence.
- Bucket hardening: versioning, AES256 SSE w/ bucket key, 4-flag public-access block. AWS provider v6 also blocks SSE-C on the bucket by default.
- `default_tags` on the AWS provider saves per-resource tagging in every file we write next.

### 2026-04-22 — Infrastructure phase 3b: VPC + subnets + default-SG lockdown + cost guardrails

- See ADRs 0012-0015 for the durable decisions: bursty-by-design pattern, VPC module choice, single-NAT, RDS-vs-SQLite.
- **Cost guardrails belong in `bootstrap/`, not main** — they need to outlive `terraform destroy`. Budget at $5/mo + Cost Anomaly Detection (free), both with direct email subscribers (no SNS — single recipient doesn't need fan-out).
- **Cost Anomaly Detection import gotcha:** AWS auto-creates a `Default-Services-Monitor` (DIMENSIONAL+SERVICE) on first Cost Explorer use; only one such monitor allowed per account. First apply hit `Limit exceeded`. Fix: `terraform import aws_ce_anomaly_monitor.service <arn>`, then re-apply renamed it via in-place `UpdateAnomalyMonitor`.
- **`Module = "03"` tag stripped** from `providers.tf` and `bootstrap/main.tf` — cloud infra shouldn't carry our learning-module label (same logic as the flat state-key in 3a).
- VPC: 3 AZs, three /20 subnet tiers per AZ (private/public/database) = 9 subnets, single managed NAT. 31 resources in one apply. Subnet CIDR layout: private `10.0.{0,16,32}.0/20`, public `10.0.{48,64,80}.0/20`, database `10.0.{96,112,128}.0/20`. /20 = 4,091 usable IPs each (AWS reserves 5/subnet; CNI assigns 1 IP per pod, so headroom matters).
- Subnet role tags: `kubernetes.io/role/elb=1` public, `kubernetes.io/role/internal-elb=1` private. Cluster-keyed `kubernetes.io/cluster/<name>=shared` deferred to 3c — AWS LB Controller ≥ 2.4 doesn't require it, and we'd otherwise be hard-coding a future name.
- Default SG locked down via `aws_default_security_group` with no rules (CIS 4.3). Resource-specific SGs (cluster, node, RDS) live with their owning resources in 3c/3d.
- **NAT GW provisioning time: ~1m55s** — long pole at session start. Total apply ~2-3 min; total destroy ~1-2 min.

### 2026-04-22 — Scope reorder: Networking & DNS moved to Module 04

- **Trigger:** security review during 3b planning revealed the app has no auth (`packages/api/src/index.ts` has no middleware; mutations accept anon writes), introspection is on, no CORS/rate-limit/depth-limit. Module 03 as written would have ended with unauthenticated mutations on the public internet.
- **Decision:** keep all 03 infra work; move "Networking & DNS" (Route53 + nginx-ingress + public URL) to Module 04. New 03 done-state: "deployed to EKS, reachable via `kubectl port-forward`."
- **Rejected alternative:** infra-layer auth stopgap (basic-auth ingress annotation, Cloudflare Access, IP allowlist). Module 04 is next; throwaway auth to bridge one module isn't worth it.
- **Also injected into Module 04:** "Pre-Exposure API Hardening" section (CORS, introspection-off-in-prod, query depth/complexity limits, structured errors).
- **Production-hardening debt deferred:** VPC flow logs (→ M07), VPC endpoints for S3/ECR (indefinite). Single-NAT tradeoff now captured in [ADR-0014](../adr/0014-single-managed-nat-gateway.md).
