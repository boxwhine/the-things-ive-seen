# ADR-0012: Bursty-by-Design Cloud Infrastructure

Date: 2026-04-22

Status: Accepted

## Context

Cloud infrastructure for this project (EKS, RDS, NAT GW, NLB) carries a non-trivial 24/7 cost — roughly $140-170/mo at always-on, dominated by the EKS control plane ($73/mo flat). The application has zero users; nothing in the project's roadmap requires a continuously-running cluster. The cost would be paid out of pocket by a single learner-developer.

At the same time, dropping EKS entirely would undermine the project's secondary purpose (learning and demonstrating production engineering practice). Modules 5-10 (service extraction, observability, alerting, GitOps, chaos) are largely k8s-native and require a real cluster to exercise meaningfully.

Two non-options were rejected early:

- **Always-on EKS:** $140+/mo for zero traffic is wasteful and demotivating for a self-funded project.
- **Drop k8s, pivot to ECS Fargate:** would invalidate Modules 5-10 as currently scoped.

## Decision

Treat the cloud cluster as **ephemeral by design**. Apply infrastructure at the start of each active development or demo session; destroy at the end. Estimated runtime: ~16 hours/month. Estimated cost at that runtime: ~$3.50/mo all-in.

Ephemerality becomes a cross-cutting design requirement, not just a practice:

1. **Everything in IaC.** All infrastructure is reproducible from terraform. There is no "manually-installed thing" that wouldn't survive a destroy/recreate cycle.
2. **Cluster-internal config in GitOps.** Helm charts, manifests, and CRDs are declared in the repo so they re-install automatically when the cluster comes back. This dovetails with Module 09 (ArgoCD).
3. **Stateful resources persist via snapshot.** RDS is destroyed between sessions but `final_snapshot_identifier` preserves data; next session restores from snapshot.
4. **Always-on guardrails outside the destroyable layer.** Cost monitoring (Budget + Cost Anomaly Detection) lives in the bootstrap config and keeps watching even when the main config is destroyed.
5. **Lifecycle harness.** A `Makefile` (lands in 3c) provides `make session-start` / `make session-end` to reduce the chance of forgetting either step.

## Consequences

- **Cost:** ~$3.50/mo at burst usage vs. ~$140-170/mo always-on. The Budget alert at $5/mo catches "left it running" incidents within ~30 hours.
- **Friction:** Each session begins with ~15 minutes of `terraform apply` before active work can start. Acceptable given the cost differential.
- **Demo overhead:** Impromptu demos require ~20 min of advance notice. For interview demos, the cluster is spun up the night before.
- **Observability state loss:** Prometheus/Loki/Tempo data resets between sessions unless explicitly backed by S3-compatible storage. To be addressed in Modules 6-7.
- **Operational discipline as a learning outcome:** the destroy-recreate workflow is itself a cost-management pattern used in real cost-controlled production environments. The `Makefile` harness, RDS snapshot strategy, and Budget guardrails become teachable artifacts in their own right.
- **Failure mode:** forgetting `terraform destroy` and not noticing the alert email leads to a real but bounded bill. Worst case at 30 days idle: ~$140. Acceptable insurance cost for a habit-forming guardrail.
