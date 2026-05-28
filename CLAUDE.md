# CLAUDE.md

This file provides guidance to Claude when working with code in this repository.

## Project Overview

A concert/event tracking and visualization app. Monorepo with pnpm workspaces containing two packages:

- **@ttis/api** - GraphQL backend (GraphQL Yoga, Pothos, Prisma, PostgreSQL)
- **@ttis/ui** - Next.js 16 frontend (React 19, Apollo Client, Tailwind CSS v4, shadcn/ui)

See `docs/ARCHITECTURE.md` for the full target architecture and ADR log.
See `docs/STATUS.md` for current implementation state and active blockers.

## Approach Before Action

- For Docker/infra changes, propose the approach (e.g., Dockerfile edit vs compose.yml env_file) BEFORE editing files
- Don't install system tools (brew/apt) without explicit approval
- If a fix path gets long (>2 failed attempts), stop and summarize alternatives before continuing
- Always verify the installed version of a package and check current docs before writing.
- This repo is still in "v0" mode--nothing is in production yet.
- Work with the user like a pair programmer: working through the sections/checklists under `docs/modules/*` in order, creating a plan for each section and consulting with the user before work starts and after each section is complete.
- Remember: the ultimate goal of this repo is to _teach_ the user about all of the individual pieces of the infrastructure. So, cranking out a bunch of code as quickly as possible isn't as valuable here vs. working in smaller chunks and explaining the WHY behind them.

## AWS Cost Guardrails

**Goal:** Run this project in AWS as close to $0/month as possible. The user is learning cloud infra on a personal budget — unexpected charges are not acceptable.

**Authorization required before implementing any AWS change that could incur charges.** This includes, but is not limited to:

- Provisioning or scaling any resource outside the AWS Free Tier (e.g., non-`t4g.micro`/`t3.micro` compute, RDS instance classes above free tier, Aurora, NAT Gateways, ALB/NLB, ElastiCache, OpenSearch, Fargate tasks beyond free tier).
- Enabling paid services or features (CloudWatch custom metrics/dashboards beyond free tier, GuardDuty, Config, WAF, Secrets Manager secrets, KMS CMKs beyond AWS-managed, VPC endpoints, Route 53 hosted zones).
- Data-transfer-heavy designs (cross-AZ traffic, NAT egress, CloudFront beyond free tier, inter-region replication).
- Storage that accrues cost (EBS volumes beyond free tier, S3 classes other than Standard within free-tier limits, snapshots retained long-term).
- Raising account-level limits, reserved capacity purchases, Savings Plans, or anything that commits spend.
- Running `terraform apply`, `aws ... create/update/put`, CDK deploy, SAM deploy, or any other command that mutates live AWS state, when the change touches resources in the categories above.

**Before proposing or applying such a change, you must:**

1. Call it out explicitly: name the resource, the expected monthly cost (or "free tier eligible — with these limits…"), and the conditions under which it would start billing.
2. Offer a free-tier-compatible alternative when one exists (e.g., SQLite/Neon/Supabase free tier instead of RDS; single-AZ public subnet instead of NAT; GitHub Actions instead of CodeBuild).
3. Wait for the user to authorize the specific change. Prior approval for one resource is not blanket approval for the category.

`terraform plan`, `aws ... describe/list/get`, and other read-only or dry-run commands do **not** require authorization and should be used freely to inform proposals.

## Public Repo: Secret Hygiene

**This repository is public by design** (intended as a portfolio/learning artifact). Every commit is visible to the world and indexed by GitHub search, scrapers, and credential-scanning bots within minutes of being pushed. The project's AWS account is the user's personal account — anything that enables exploitation of it is a personal-financial risk, not just a hygiene issue.

**Never commit the following, under any circumstances:**

- AWS credentials of any kind: access key IDs (`AKIA...`, `ASIA...`), secret access keys, session tokens, SSO refresh tokens, EC2 instance metadata responses, `~/.aws/credentials` contents.
- API keys, OAuth client secrets, JWT signing keys, database passwords, private keys (`-----BEGIN ...PRIVATE KEY-----`), webhook signing secrets, or any other credential material.
- `.env`, `.env.local`, `*.tfvars`, kubeconfigs with embedded tokens, Terraform state files (which contain resolved secret values).
- Personal data: home address, phone number, government IDs.
- Internal URLs, hostnames, or paths that suggest non-public infrastructure (e.g., a private dashboard URL).

**Treat as low-sensitivity but minimize new exposure:**

- AWS account ID (`478335820689`). Already in committed files since phase 3a (`backend.tf`, `bootstrap/README.md`, module-03 notes). AWS classifies this as not-a-secret, but it's a useful targeting input for attackers and we shouldn't add it to net-new files unless required (e.g., backend config). When a placeholder works (e.g., docs prose), prefer `<account-id>`.
- The user's email address. Already in every commit's author metadata, so additional refs in repo files don't materially change exposure — but don't introduce new ones in code or docs.

**Enforcement and verification:**

- The `.gitignore` files in `terraform/` and project root are the primary defense. New sensitive-by-class file types (e.g., a new `*.pem` convention) require a `.gitignore` update in the same commit.
- Before any `git commit`, scan the staged diff for the patterns above. `git diff --staged | grep -iE 'AKIA|ASIA|aws_secret|password|token|sk_|api_key|BEGIN.*PRIVATE'` is a useful sanity check.
- If a secret is committed, even briefly, it must be considered compromised. Rotate it immediately (revoke the IAM credential, regenerate the API key) — a force-push to remove the commit does **not** unleak it from caches, mirrors, or scraper databases.

**For long-lived secrets the project legitimately needs (DB passwords, third-party API keys):**

- AWS Secrets Manager or Kubernetes Secrets at runtime. Reference by ARN/name in code; never inline the value.
- For Terraform variables that hold secrets, use environment variables (`TF_VAR_*`) or a gitignored `terraform.tfvars`. Never put the literal value in any committed `.tf` file.
- For local development, `.env.local` (gitignored) with `.env.example` (committed, placeholder values only) as the documented template.

## Use Task Agents for multi-issue debugging

When a session has multiple independent bugs or tasks that can be run in parallel, use a separate Task agent to investigate each one in parallel in its own scope, then report findings before making any fixes.

## Common Commands

### Development

```bash
pnpm dev                   # Start DB in Docker + run API and UI locally with hot reload
pnpm dev:api               # Run API dev server only (assumes DB is running)
pnpm dev:ui                # Run UI dev server only
pnpm dev:infra             # Start just the DB + Adminer containers
pnpm dev:infra:down        # Stop the DB + Adminer containers
```

### Production (local testing)

```bash
pnpm prod                  # Build and run full stack in Docker (DB, API, UI, Adminer)
pnpm prod:down             # Stop the production stack
```

### Testing

```bash
pnpm test                  # Run tests across all packages (Vitest)
pnpm --filter @ttis/api test # Run tests in a specific package
```

### Linting

```bash
pnpm lint                  # Lint all packages
pnpm --filter @ttis/api lint # Lint a specific package
```

### Type Checking

```bash
pnpm types                 # Type-check all packages
```

### Formatting

```bash
pnpm format                # Run oxfmt across the whole tree
```

### Building

```bash
pnpm build                 # Build all packages
```

### Data Scripts

```bash
pnpm parse-csv             # Parse source CSV data (data/scripts/parse-csv.ts)
```

### Package-Specific

**API (`packages/api`):**

```bash
pnpm --filter @ttis/api dev    # tsx with hot reload
pnpm --filter @ttis/api build  # Generate Prisma client + compile TypeScript
pnpm --filter @ttis/api start  # Run compiled production build
```

**UI (`packages/ui`):**

```bash
pnpm --filter @ttis/ui dev     # Next.js dev server
pnpm --filter @ttis/ui build   # Production build
```

### Adding Dependencies

```bash
pnpm --filter @ttis/api add <dep>   # Add dep to API package
pnpm --filter @ttis/ui add <dep>    # Add dep to UI package
```

## Architecture

### Data Flow

UI (Apollo Client) → GraphQL API (GraphQL Yoga + Pothos) → Prisma ORM → PostgreSQL

### API Package (`packages/api`)

- **src/schema/** - Pothos schema builders (builder.ts, event.ts, venue.ts, genre.ts, index.ts)
- **src/db/** - Prisma client instance (prisma.ts)
- **src/config.ts** - Environment/config loading
- **src/index.ts** - GraphQL Yoga server entry point
- **prisma/** - Prisma schema, migrations, generated client

### UI Package (`packages/ui/src`)

- **app/** - Next.js App Router pages (home, about, events, venues)
- **components/** - React components and shadcn/ui primitives
- **graphql/** - Apollo queries and mutations
- **lib/** - Shared utilities (e.g., shadcn `cn` helper)

### Key Patterns

- Pothos schema builders with Prisma plugin generate the GraphQL schema automatically
- Apollo Client queries/mutations are defined in separate files under `ui/src/graphql/`
- Environment config via `.env` files

## Development URLs

- GraphQL endpoint (GraphiQL UI): http://localhost:4000/graphql
- UI: http://localhost:3000
- Adminer (DB GUI): http://localhost:8080

## Git Workflow

- **Never commit directly to `main`.** Always ensure you are on a feature branch before committing changes.
- If currently on `main`, create a new branch before making any commits.

## Stack Conventions

- Prisma 7 config syntax (not legacy seed config)
- ESM imports require explicit `.js` extensions
- Next.js standalone output requires manual static file copying
- Turborepo: ensure `prisma generate` is declared as a task dependency

## Documentation Maintenance

When committing changes, always review whether project documentation needs updates to reflect the work done. Documentation updates should be included in the same commit as the code changes they describe.

- **`docs/STATUS.md`** — Keep module progress, "What Is Working", and "Active Blockers" sections current. When work changes the state of a feature or resolves a blocker, update this file.
- **`docs/modules/*.md`** — When work completes acceptance criteria items or changes their scope, update the relevant module file's checklists and notes. **Keep the "Notes & Discoveries" section high-level — a few bullets capturing genuine discoveries, gotchas, or decisions made during implementation. It is not a line-by-line changelog.** Push detailed reasoning into ADRs (`docs/adr/`) and operational details into the relevant `README.md`. The git log itself is the changelog of record. A good Notes entry teaches a future agent something they couldn't derive from the code, ADRs, or commit history; if a bullet doesn't pass that bar, it doesn't belong.
- **`docs/ARCHITECTURE.md`** — If a change introduces or revises an architectural decision, add or update the appropriate ADR entry.
- **`README.md` files** — When adding, removing, or renaming npm scripts, CLI commands, or setup steps, update any README that documents them to keep instructions accurate.

Verify checklist items against actual code/config before marking complete.

## Document Styling Preferences

When editing or creating Markdown documents in this repo:

- Do not use horizontal rules (`---`) before section headers. Let headings stand on their own.
- Use `<br/>` for line breaks inside Mermaid node labels, not `\n`.
- Diagrams should use Mermaid (` ```mermaid `) rather than ASCII art.
- After creating or editing any `*.md` file, run `pnpm format` (or `pnpm exec oxfmt <file>`) to ensure consistent formatting.
