# ADR-0013: Use the Community VPC Module Over a Hand-Rolled VPC

Date: 2026-04-22

Status: Accepted

## Context

Module 03 requires Terraform for the VPC + subnets + security groups that EKS (3c) and RDS (3d) sit inside. An EKS-ready VPC requires roughly 30+ resources: the VPC itself, internet gateway, three tiers of subnets across multiple AZs, NAT gateway(s), elastic IP(s), route tables, route table associations, route entries, and a database subnet group.

Two implementation options:

1. **Hand-roll** every resource — `aws_vpc`, `aws_internet_gateway`, 9× `aws_subnet`, NAT EIP + gateway, route tables, route_table_associations, etc. Roughly 150-200 lines of HCL.
2. **Use `terraform-aws-modules/vpc/aws`** — the de-facto community module, ~30 lines of HCL in the caller, with the same underlying resources hidden behind named variables.

The project's stated goal is to teach the user about each piece of infrastructure. A naive read favors hand-rolling: more code, more direct exposure to each resource. A closer read complicates that:

- The community module is what 90%+ of production EKS shops actually run. Skill in reading and configuring it is more transferable than skill in reading hand-rolled VPC HCL.
- The module's variable names (`single_nat_gateway`, `public_subnet_tags`, `enable_dns_hostnames`, `create_database_subnet_group`) are the design decisions, named — which is arguably more pedagogical than 200 lines of resource blocks where the design decisions are encoded only by what's present and absent.
- Hand-rolled VPC HCL is mostly identical-everywhere boilerplate. The learning-per-line ratio is low.

## Decision

Use `terraform-aws-modules/vpc/aws` pinned at `~> 6.0` (latest at decision time: v6.6.1, requires `hashicorp/aws >= 6.28`). The module call lives in `terraform/vpc.tf`.

The WHY behind each variable is documented inline in the module call's adjacent comments and in `terraform/README.md`. Architectural decisions that warrant ADR weight (single-NAT, bursty-by-design) get their own ADRs (0014, 0012).

## Consequences

- **Less code to read, write, and maintain.** ~30 lines vs. ~200.
- **Module upgrade discipline required.** Pinning to `~> 6.0` allows minor and patch updates without explicit action. Major version bumps (6.x → 7.x) are deliberate. The 5.x → 6.x rewrite (mid-2025) renamed several variables; future major bumps may do the same.
- **Locked to the module's variable surface.** If we ever need behavior the module doesn't expose, the path is to override individual resources via `module.vpc.<resource>` references or fork the module — both reasonable but heavier than editing local HCL.
- **Dependency-graph entry.** The module is a Hashicorp-published community module backed by the AWS-IA team. Supply-chain risk is non-zero but matches industry practice.
- **Pedagogically: the named variables are the curriculum.** Reading the module call teaches what an EKS-ready VPC requires (3 AZs, public/private/database tiers, NAT, DNS support, subnet role tags) more clearly than scanning 200 lines of resource blocks for the same information.
