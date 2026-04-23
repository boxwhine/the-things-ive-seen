# ADR-0014: Single Managed NAT Gateway

Date: 2026-04-22

Status: Accepted

## Context

EKS worker nodes will run in private subnets (3c) and need outbound internet access for: pulling container images from ECR (until VPC endpoints land), reaching AWS service APIs not exposed via endpoints, and Module 04+ external integrations (Google OAuth, Spotify, Setlist.fm).

NAT options for outbound traffic:

1. **One managed NAT GW per AZ** — production-default for HA. ~$99/mo always-on at three AZs. Each AZ is independently fault-tolerant; loss of one AZ doesn't break egress in the others.
2. **Single shared managed NAT GW** — ~$33/mo always-on. All AZs route through one NAT in one AZ. Loss of that AZ severs egress for the entire VPC.
3. **NAT instance (`fck-nat` t4g.nano)** — ~$3/mo always-on. Self-managed; single AZ; lower throughput cap (irrelevant at this load); requires more operational knowledge.
4. **No NAT, public worker nodes** — $0/mo. Workers get public IPs in public subnets, gated by security groups. Real-world common at small scale, but doesn't model the production-default architecture.

The bursty-by-design constraint (ADR-0012) changes the cost calculation: at ~16 hr/month runtime, managed NAT runs ~$0.72/mo. The cost gap between managed and instance/none narrows from "20-40× difference at 24/7" to "rounding error at burst usage."

## Decision

Use a single managed NAT gateway. `enable_nat_gateway = true`, `single_nat_gateway = true`, `one_nat_gateway_per_az = false`.

## Consequences

- **Cost at burst usage:** ~$0.72/mo for the gateway plus $0.045/GB processed (negligible at this load). The Budget alert at $5/mo (ADR-0012) catches "left it running" incidents within ~30 hours, capping the always-on cost exposure to ~$33/mo plus the rest of the stack.
- **AZ resilience:** loss of the AZ hosting the NAT gateway severs all egress. Acceptable given session-scoped runtime; production at scale would revisit per-AZ NAT.
- **Production-realistic surface area:** the architecture matches what most production EKS shops run for non-mission-critical workloads. Future hardening (per-AZ NAT) is a one-variable flip in the module call.
- **EIP discipline:** the module creates and manages the NAT's elastic IP. `terraform destroy` reclaims it. Manually-deleted NAT gateways orphan EIPs, which then cost ~$3.65/mo each — a real "left it running" pattern caught by the cost guardrails.
- **Egress identity:** the NAT's public IP (`nat_public_ips` output) is the stable outbound identity for any future allowlist-based integration. Surfacing it as an output reduces the chance of needing to re-derive it later.
- **Alternatives revisited only on signal:** drop to `fck-nat` if always-on cost ever becomes a concern; switch to per-AZ NAT if real users and an SLA appear.
