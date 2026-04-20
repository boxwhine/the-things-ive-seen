# ADR-0011: Use AWS ECR as the Single Container Registry

Date: 2026-04-20

Status: Accepted

## Context

Module 02 originally targeted GitHub Container Registry (ghcr.io) for Docker image publishing. The production architecture targets AWS EKS (Module 03+), which integrates natively with ECR via IAM roles for service accounts — EKS nodes can pull images from ECR without explicit credentials or `imagePullSecret` configuration.

Using ghcr.io would require:

- Configuring Kubernetes `imagePullSecrets` in every namespace/service account
- Managing a separate credential rotation lifecycle
- Paying cross-network egress on every pod scale-up
- A mid-project registry migration when moving to production

The project is on the AWS Free Tier, which provides 500MB of private ECR storage for 12 months.

## Decision

Use AWS ECR as the single container registry for all environments. Two private repositories (`ttis-api`, `ttis-ui`) store images tagged with git SHA and `latest`.

Authentication from GitHub Actions uses OIDC federation — the workflow requests a JWT from GitHub's identity provider and exchanges it with AWS STS for temporary credentials. No long-lived AWS access keys are stored as GitHub secrets.

Lifecycle policies enforce storage hygiene:

- Untagged images expire after 1 day
- Only the last 5 tagged images are retained per repository

## Consequences

- **Simpler Kubernetes config:** EKS nodes pull from ECR via IAM — no `imagePullSecret` plumbing.
- **No credential rotation:** OIDC tokens are short-lived and generated per workflow run. The AWS account ID is stored as a GitHub secret (not a variable) to keep it masked in public Actions logs.
- **Free Tier discipline:** Lifecycle policies are mandatory. Without them, SHA-tagged images accumulate and exceed 500MB within a few merges.
- **One-time setup required:** OIDC provider, IAM role, and ECR repositories must be created before the CI publish job will succeed. Setup is scripted in `scripts/setup-ecr-repos.sh` and `scripts/setup-github-oidc.sh`.
- **Vendor coupling:** Images are in AWS-specific infrastructure. Acceptable given the project is fully committed to AWS for compute (EKS), database (RDS), and DNS (Route53).
