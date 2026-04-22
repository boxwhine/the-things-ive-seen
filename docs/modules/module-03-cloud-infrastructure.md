# Module 03: Cloud Infrastructure & Terraform

**Status:** 🟡 In Progress

**Start Date:** 2026-04-21

**End Date:** —

## Goal

Provision all cloud infrastructure via Terraform and deploy the application to AWS EKS. The app should be accessible at a real URL with a managed PostgreSQL database (RDS), proper secrets management, and DNS configured via Route53.

## Acceptance Criteria

### Setup

- [x] Set up AWS account (or use existing)
- [x] Install AWS CLI and configure credentials
- [x] Install Terraform
- [x] Complete a basic Terraform tutorial (provision an S3 bucket, then destroy it)

### Infrastructure

- [ ] Write Terraform for VPC, subnets, and security groups
- [ ] Provision an EKS cluster via Terraform
- [ ] Document any issues or surprises encountered

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

### Networking & DNS

- [ ] Set up Route53 domain (or use a free subdomain)
- [ ] Install nginx-ingress controller via Helm
- [ ] Configure ingress rules for all services
- [ ] Verify app is accessible via a real URL

## Related ADRs

_None yet. Add links here as decisions are made during this module._

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
