# Module 09: GitOps & Advanced Deployment

**Status:** ⬜ Not Started

**Start Date:** —

**End Date:** —

## Goal

Implement GitOps-driven deployments with ArgoCD, canary rollout strategies, and Terraform-in-CI for infrastructure changes. Harden the pipeline with container image scanning, dependency vulnerability checks, and automated rollback on failed health checks.

## Acceptance Criteria

### ArgoCD & GitOps

- [ ] Install ArgoCD in the Kubernetes cluster
- [ ] Configure ArgoCD to watch the repo for Kubernetes manifest changes
- [ ] Deploy to a staging environment first via ArgoCD
- [ ] Verify staging deployment works end-to-end before wiring production

### Canary Deployments

- [ ] Implement canary deployment strategy (route a small % of traffic to new version)
- [ ] Configure Kubernetes rolling update parameters properly
- [ ] Add automated smoke tests that run post-deployment
- [ ] Practice rolling back a bad deployment

### Terraform in CI

- [ ] Add Terraform plan step to CI pipeline (runs on every PR)
- [ ] Add Terraform apply step (runs on merge to main)
- [ ] Implement Terraform state locking
- [ ] Establish branching convention: main = production

### Security & Hardening

- [ ] Add container image scanning (Trivy or similar) to CI pipeline
- [ ] Add dependency vulnerability scanning
- [ ] Configure automatic rollback on failed liveness/readiness probes post-deploy
- [ ] Document the full GitOps pipeline end-to-end

## Related ADRs

_None yet. Add links here as decisions are made during this module._

## Notes & Discoveries

> Capture decisions made on the fly, unexpected findings, or context that doesn't warrant a full ADR. Append entries as you go.
