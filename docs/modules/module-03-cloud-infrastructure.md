# Module 03: Cloud Infrastructure & Terraform

**Status:** ⬜ Not Started

**Start Date:** —

**End Date:** —

## Goal

Provision all cloud infrastructure via Terraform and deploy the application to AWS EKS. The app should be accessible at a real URL with a managed PostgreSQL database (RDS), proper secrets management, and DNS configured via Route53.

## Acceptance Criteria

### Setup

- [ ] Set up AWS account (or use existing)
- [ ] Install AWS CLI and configure credentials
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
