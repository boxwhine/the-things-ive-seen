# Terraform Bootstrap

Creates the S3 bucket that stores remote state for the main Terraform configuration in `../terraform/`.

## Why a separate config

Terraform's remote state backend must exist _before_ `terraform apply` can write state to it. You can't use remote state to manage the bucket that _is_ the remote state — its own state file would be stored in itself. This config solves the chicken-and-egg problem by using **local state** (a `terraform.tfstate` file on disk) to create the state bucket, then the main config uses that bucket for remote state.

## When to run

Once, ever. Re-run only if:

- You need to rotate to a new state bucket (a real migration, not a routine operation).
- The state bucket is accidentally deleted and you need to recreate it (then follow a state-file recovery procedure).

## How to run

```bash
export AWS_PROFILE=ttis
terraform -chdir=terraform/bootstrap init
terraform -chdir=terraform/bootstrap plan
terraform -chdir=terraform/bootstrap apply
```

Record the `state_bucket_name` output — the main config's `backend.tf` hardcodes it (backend config cannot reference variables).

## Do not `terraform destroy` this

Destroying this config deletes the bucket that holds the main config's state. If you ever actually need to tear everything down:

1. First `terraform -chdir=terraform destroy` the main config (which uses this bucket for state).
2. Then empty the state bucket (versioned buckets require removing all object versions).
3. Only then `terraform -chdir=terraform/bootstrap destroy`.

## Hardening applied

- **Versioning enabled** — every state write creates a new object version; prior states remain recoverable.
- **Server-side encryption (AES256)** with bucket key — defense in depth even though the bucket is private.
- **Public access block** — all four flags (`block_public_acls`, `block_public_policy`, `ignore_public_acls`, `restrict_public_buckets`) set to true. Belt and suspenders: blocks public ACLs and public policies at the bucket level, independent of object-level settings.

## State of this config

`terraform.tfstate` lives on disk in this directory and is gitignored. Losing it is not catastrophic (you can `terraform import` the bucket back into state), but avoid it.
