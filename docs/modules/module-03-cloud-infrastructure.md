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
- [ ] Install Terraform
- [ ] Complete a basic Terraform tutorial (provision an S3 bucket, then destroy it)

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

> Capture decisions made on the fly, unexpected findings, or context that doesn't warrant a full ADR. Append entries as you go.

### 2026-04-21 — AWS account and CLI already configured from Module 02

- The AWS account and local AWS CLI setup were prerequisites for Module 02's ECR publish work — `scripts/setup-ecr-repos.sh` and `scripts/setup-github-oidc.sh` both require an AWS CLI configured with admin access. Those prerequisites spilled into this module's "Setup" checklist and were completed during Module 02.
