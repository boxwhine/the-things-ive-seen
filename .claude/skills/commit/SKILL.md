---
name: commit
description: Commit staged changes
---

1. Review `git status` and `git diff --staged`. Do not include any unstaged changes without asking permission.
1. Verify `@docs/STATUS.md` and relevant module README (`@docs/modules/*`) are updated for the change, if necessary
1. Create a new branch, if needed (never `main`)
1. Commit. Wait for `lint-staged` pre-commit checks to complete successfully, propose a conventional commit message, and wait for approval.
