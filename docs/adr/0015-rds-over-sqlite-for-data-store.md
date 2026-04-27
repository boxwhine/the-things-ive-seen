# ADR-0015: Use RDS PostgreSQL Over SQLite for the Application Data Store

Date: 2026-04-22

Status: Accepted

## Context

The application currently runs against PostgreSQL 16 (ADR-0009), in-cluster on local k3d. Module 03 plans to provision RDS PostgreSQL (3d) as the production data store. With cost discipline now a first-class concern (ADR-0012), it's worth documenting why RDS — rather than the obvious lower-cost alternative, SQLite — is the right call for this project.

Cost at burst usage (~16 hr/month):

| Option                              | Compute             | Storage          | Total     |
| ----------------------------------- | ------------------- | ---------------- | --------- |
| RDS db.t4g.micro                    | ~$0.26/mo (16 hr)   | ~$2.00/mo (20GB) | ~$2.26/mo |
| In-cluster Postgres on EBS PV       | $0 (on cluster EC2) | ~$0.10/mo        | ~$0.10/mo |
| SQLite on EBS PV                    | $0                  | ~$0.10/mo        | ~$0.10/mo |
| SQLite + Litestream (S3 WAL stream) | $0                  | ~$0.50/mo        | ~$0.50/mo |

If the AWS account is within its first 12 months, RDS is also covered by the Free Tier (750 hr/mo of db.t4g.micro + 20GB storage), making it $0 for the duration of this project.

The cost-only argument favors SQLite. Other considerations don't.

## Decision

Use RDS PostgreSQL. Provisioned via Terraform in 3d, restored from `final_snapshot_identifier` between sessions to preserve data through the bursty destroy/recreate cycle.

## Consequences

- **Cost is a non-issue at burst usage.** ~$2.26/mo or $0 on Free Tier; the difference vs. SQLite is rounding error.
- **Multi-replica API works correctly.** SQLite's single-writer constraint would force the API deployment to one replica forever, with `accessModes: ReadWriteOnce` on the PVC, which breaks rolling deploys (you can't have two pods alive simultaneously holding the same volume). Production-realistic k8s patterns require multi-replica with shared external state — RDS provides that, SQLite cannot.
- **The lessons match the project goal.** RDS teaches managed-database operations: subnet groups, parameter groups, security groups, snapshot lifecycle, IAM-based connection auth, secret management. These are explicit acceptance criteria in Modules 03 and 04.
- **Bursty workflow requires snapshot persistence.** `final_snapshot_identifier` on `aws_db_instance` captures state at destroy; next session restores from snapshot. Snapshot storage runs ~$1.90/mo for 20GB while the DB instance itself is destroyed. Lifecycle-managed snapshot pruning prevents indefinite accumulation.
- **SQLite + Litestream is real production tech, just for a different project.** Litestream is excellent for embedded/edge/single-writer workloads; this app is being built specifically to learn distributed/stateful k8s patterns where SQLite is the wrong fit.
- **In-cluster Postgres rejected** because it doesn't teach the managed-DB lesson and adds StatefulSet/PVC complexity that doesn't track to anything we'd run in real production.
