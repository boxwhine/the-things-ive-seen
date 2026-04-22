---
name: commit-pr
description: Commit staged changes, push branch, open PR, and update status docs
model: sonnet
effort: medium
---

Prerequisite: Do everything in `/commit` skill

If no PR currently exists for this branch...

1. Run `gh pr create`
1. Report PR number and URL
1. Open the PR in web browser

If a PR _already_ exists for this branch and there are new changes...

1. Run `/commit` skill first
1. Push up commit(s) to remote branch
1. Update the PR description, if necessary
1. Open the PR in web browser
