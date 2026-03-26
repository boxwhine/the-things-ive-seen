# Module Index

Each module defines the goal, acceptance criteria, and implementation checklist for one phase of the production-hardening roadmap. Notes and in-flight discoveries are captured inline at the bottom of each module file.

For the high-level status snapshot, see [STATUS.md](../STATUS.md). For architecture decisions made during or after a module, see [docs/adr/](../adr/README.md).

## Modules

| Module                                    | Focus                                | Status         | Start Date | End Date |
| ----------------------------------------- | ------------------------------------ | -------------- | ---------- | -------- |
| [01](./module-01-containerization.md)     | Containerization & Local Kubernetes  | 🟡 In Progress | 2026-03-03 |          |
| [02](./module-02-cicd.md)                 | Build System & CI/CD Foundation      | ⬜ Not Started |            |          |
| [03](./module-03-cloud-infrastructure.md) | Cloud Infrastructure & Terraform     | ⬜ Not Started |            |          |
| [04](./module-04-auth.md)                 | Authentication & Authorization       | ⬜ Not Started |            |          |
| [05](./module-05-service-extraction.md)   | Service Extraction & Message Queue   | ⬜ Not Started |            |          |
| [06](./module-06-metrics-dashboards.md)   | Observability — Metrics & Dashboards | ⬜ Not Started |            |          |
| [07](./module-07-logging-tracing.md)      | Observability — Logging & Tracing    | ⬜ Not Started |            |          |
| [08](./module-08-alerting.md)             | Alerting & Incident Response         | ⬜ Not Started |            |          |
| [09](./module-09-gitops.md)               | GitOps & Advanced Deployment         | ⬜ Not Started |            |          |
| [10](./module-10-chaos.md)                | Chaos Engineering & Polish           | ⬜ Not Started |            |          |
