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

- The AWS account and local AWS CLI setup were prerequisites for Module 02's ECR publish work — `scripts/setup-ecr-repos.sh` and `scripts/setup-github-oidc.sh` both require an AWS CLI configured with admin access. Those prerequisites spilled into this module's "Setup" checklist and were completed during Module 02.

### 2026-04-22 — Terraform installed via tfenv; S3 tutorial complete

- **Terraform install path:** `tfenv` over `brew install terraform`. Reason: `tfenv` is version-managed (reads `.terraform-version`), matching the `.nvmrc` pattern already used for Node. Installed Terraform `1.14.9`; AWS provider `6.41.0` pulled in by the tutorial.
- **Non-obvious lesson — Identity Center account instance vs. organization instance:** first attempt enabled IAM Identity Center as an **account instance**. Account instances are purpose-built for AWS-managed application identities (Amazon Q, QuickSight) and do **not** support permission sets or AWS account federation — so the "Permission sets" and "AWS accounts" navigation items were missing entirely. Fix: deleted the account instance, created an AWS Organization (single-account org, this account is the management account), re-enabled Identity Center (auto-detected the org and provisioned as an Organization instance), then created the `AdminAccess` permission set and assigned a user. Takeaway: for any use case involving `aws configure sso` against an AWS account, you need an Organization instance. Account instances only cover SaaS-style app identity.
- **Local AWS profile:** named profile `ttis` via `aws configure sso`, session name `ttis`. Used `AWS_PROFILE=ttis` per-command rather than exporting globally, to scope blast radius when multiple AWS accounts are configured on the same machine.
- **Module 02 continuity confirmed:** `aws sts get-caller-identity --profile ttis` returned the same account ID that owns the `ttis-api` / `ttis-ui` ECR repos and the `github-actions-ecr-push` OIDC role from Module 02. So Module 03 continues in the same account with no reconciliation work.
- **Tutorial artifact:** ran the full `init → plan → apply → destroy` loop against a single `aws_s3_bucket` resource from a throwaway scratch dir (`~/scratch/tf-tutorial/`), not committed to the repo. Three-way verification on teardown (grep against `aws s3 ls`, `aws s3api head-bucket` → 404, `terraform state list` empty) confirmed the bucket was actually gone on both AWS and local-state sides.
- **Conventions to carry into the Infrastructure section:** pin `required_version` in the `terraform` block and `~> N.0` on the AWS provider; commit `.terraform.lock.hcl`, ignore `.terraform/`, `*.tfstate*`, `*.tfvars`; plan with `-out=tfplan` for anything non-trivial; `terraform fmt -recursive` before commits; run with `AWS_PROFILE=ttis` scoped per-invocation.

### 2026-04-22 — Infrastructure phase 3a: remote state backend + terraform/ skeleton

- **Split layout:** `terraform/bootstrap/` (local state, one-shot) creates the S3 state bucket; `terraform/` (remote state in that bucket) is where VPC/EKS will land in 3b/3c. This solves the chicken-and-egg: the backend must exist before `terraform apply` can write state to it.
- **State locking — `use_lockfile = true` over DynamoDB.** Terraform 1.11 (March 2025) added S3-native state locking via conditional writes, eliminating the need for a separate DynamoDB table. One less resource to provision, bill, and IAM. DynamoDB is still the dominant pattern in existing tutorials/codebases, so it's worth recognizing both.
- **Backend config can't use variables.** `terraform/backend.tf` hardcodes the bucket name (`ttis-tf-state-478335820689`). Backends initialize before variables are parsed — this is the one spot in Terraform where hardcoding is correct. The workaround for multi-env setups is `-backend-config=env.hcl` at `init` time.
- **State key is flat (`terraform.tfstate`), not module-prefixed.** Initial instinct was `module-03/terraform.tfstate`, namespacing by learning module. Corrected before committing: modules in this project are a learning progression, not deployment boundaries — later modules (Auth, Service Extraction, Observability) all deploy into the same VPC/EKS and need to reference those resources without cross-state lookups. Standard reasons to split state are by _environment_ (`env/prod/` vs `env/staging/`) or _layer_ (network vs compute), not by learning cadence. Flat key is simpler and matches the single-environment scope. Migration cost while state was empty: trivial — `aws s3api delete-objects` on the old prefix + `terraform init -reconfigure`. If resources had existed, the path is `terraform init -migrate-state` which copies state between backends.
- **State bucket hardening:** versioning (state recovery), AES256 SSE with bucket key enabled (defense in depth), and a 4-flag `aws_s3_bucket_public_access_block`. AWS provider v6 also now blocks SSE-C by default on the bucket.
- **`default_tags` on the AWS provider** in `terraform/providers.tf` applies `Project`/`ManagedBy`/`Module`/`Environment` to every taggable resource created by that provider — saves per-resource tagging in every file we write next.
- **Verification of backend end-to-end:** `terraform state pull` confirms read path; `terraform apply` with zero resources writes a header-only state object (181 bytes) to `s3://ttis-tf-state-478335820689/terraform.tfstate`, confirming write path.
- **Gotcha worth noting for 3b/3c:** the main config's state will grow fast once VPC + EKS land. Plan with `-out=tfplan` and review before apply is going to matter much more than it did for the empty skeleton.

### 2026-04-22 — Infrastructure phase 3b: VPC + subnets + default-SG lockdown + cost guardrails

- **Bursty-by-design committed as a project-wide pattern** ([ADR-0012](../adr/0012-bursty-by-design-infra.md)). Cost analysis: full stack at always-on ~$140-170/mo (EKS control plane is the floor at $73/mo) vs ~$3.50/mo at ~16 hr/month of active sessions. Bursty was the only path that preserves the EKS learning goal without a real monthly bill out of pocket.
- **Cost guardrails landed in `terraform/bootstrap/`**, not the main config — they need to keep watching when the main config is destroyed. AWS Budget at $5/mo with email alerts at 80%/100%/forecasted-100%; AWS Cost Anomaly Detection (free) with $3 single-anomaly email subscription. Catches "left it running" within ~30 hours at the cap.
- **Direct email subscribers, no SNS topic.** Both Budgets and Cost Anomaly Detection support email subscribers natively. SNS adds a layer only useful for Slack/PagerDuty/Lambda fan-out. Skipped for now; will add when the email channel proves insufficient.
- **Cost Anomaly Detection import gotcha:** AWS auto-creates a `Default-Services-Monitor` (DIMENSIONAL+SERVICE) the first time Cost Explorer is used, and only allows one such monitor per account. First `terraform apply` failed on `Limit exceeded on dimensional spend monitor creation`. Fix: `terraform import aws_ce_anomaly_monitor.service <arn>` to bring the existing monitor into state, then re-apply renamed it from `Default-Services-Monitor` to `ttis-service-anomaly-monitor` via in-place `UpdateAnomalyMonitor`.
- **`Module = "03"` tag stripped** from `terraform/providers.tf` `default_tags` and `terraform/bootstrap/main.tf` `common_tags`. Cloud infra shouldn't carry our learning-module label — modules are a docs/teaching boundary, not a deployment boundary (same logic as the flat state-key decision in 3a). Bootstrap re-apply on the state bucket cleared its `Module` tag in-place.
- **VPC built via the community module** ([ADR-0013](../adr/0013-terraform-vpc-community-module.md)): `terraform-aws-modules/vpc/aws ~> 6.0` (latest at decision: v6.6.1, requires `hashicorp/aws >= 6.28`). 3 AZs (`us-east-1a/b/c`), three subnet tiers per AZ at /20, single managed NAT GW. 31 resources created in one apply.
- **Subnet CIDR layout:** private `10.0.0.0/20`, `10.0.16.0/20`, `10.0.32.0/20`; public `10.0.48.0/20`, `10.0.64.0/20`, `10.0.80.0/20`; database `10.0.96.0/20`, `10.0.112.0/20`, `10.0.128.0/20`. /20 = 4,091 usable IPs each — comfortable headroom even for high-pod-density workloads. AWS reserves 5 IPs per subnet; the VPC CNI assigns 1 IP per pod from the subnet, so the headroom matters more than it looks.
- **Subnet role tags:** `kubernetes.io/role/elb=1` on public, `kubernetes.io/role/internal-elb=1` on private. The cluster-name-keyed `kubernetes.io/cluster/<name>=shared` tag is no longer required for AWS LB Controller ≥ 2.4 and is deferred to 3c when the cluster name exists (avoids hard-coding a future name).
- **Single NAT decision** ([ADR-0014](../adr/0014-single-managed-nat-gateway.md)): bursty usage made the cost gap between managed-NAT (~$0.72/mo) and per-AZ NAT (~$2.16/mo) immaterial; managed NAT is the production-realistic default. Per-AZ NAT is a one-variable flip if real users ever appear.
- **Default SG lockdown** via `aws_default_security_group` with no rules (CIS AWS Benchmark 4.3). Adopting the resource without ingress/egress blocks strips the auto-created rules. Resource-specific SGs (cluster, node, RDS) live with their owning resources in 3c/3d.
- **RDS-vs-SQLite decision recorded** ([ADR-0015](../adr/0015-rds-over-sqlite-for-data-store.md)) even though RDS doesn't land until 3d. SQLite would force single-replica API forever (RWO PVC) and break rolling deploys — wrong fit for a project teaching distributed/stateful k8s patterns. Cost difference at burst usage is rounding error (~$2/mo), or $0 if AWS account is in its first 12 months on Free Tier.
- **Provider drift to capture for the lock file:** `init -upgrade` pulled `hashicorp/aws v6.42.0` (was v6.41.0); `.terraform.lock.hcl` updated in both `terraform/` and `terraform/bootstrap/`.
- **NAT GW provisioning time:** ~1m55s for the gateway itself. Worth knowing — at session start that's the long pole in the apply.

### 2026-04-22 — Scope reorder: Networking & DNS moved to Module 04

- **Trigger:** a security review during Phase 3b planning. The app has no authentication (`packages/api/src/index.ts` has no auth middleware; `addEvent`/`addVenue`/`addGenre` mutations accept anonymous writes), introspection is on, and there's no CORS / rate limit / query depth protection. Module 03 as originally written would have finished with the app at a real URL — i.e., unauthenticated mutations reachable from the public internet before Module 04's auth lands.
- **Decision:** keep all of Module 03's _infrastructure_ work (VPC, EKS, ECR wiring, RDS, secrets) but move the final "Networking & DNS" section (Route53 + nginx-ingress + ingress rules + public URL verification) to Module 04. Module 03's new "done" state is "app deployed to EKS, reachable via `kubectl port-forward`," not "app at https://...". The first time anything public points at this app, auth will already gate it.
- **Alternative rejected:** infra-layer auth stopgap (basic auth annotation on ingress, Cloudflare Access in front of the ALB, or IP allowlist). Rejected because Module 04 is next — building throwaway auth to bridge one module's gap is more work than just resequencing.
- **Items also injected into Module 04:** alongside the moved Networking & DNS section, a new "Pre-Exposure API Hardening" section was added (CORS, introspection-off-in-prod, query depth limit, query complexity limit, structured error handling). These are all concerns whose _only_ reason to exist is that the app is about to become publicly reachable, so Module 04 is the right home.
- **Production-hardening debt to revisit later:** single-NAT tradeoff (cost vs AZ resilience), VPC flow logs (deferred to Module 07), VPC endpoints for S3/ECR (deferred).
