# Engineering workflow

Keep the Vue frontend in `frontend/` and the Express backend in `backend/`. Use strict TypeScript throughout. Use `PascalCase` for types and `camelCase` for functions and values. Name functions for their behavior and keep helpers private to their module until another module needs them. Follow the project glossary for household terms. [Domain docs](../agents/domain.md) · [V1 spec](https://github.com/AlessandroRoic/GroceryAgent/issues/1) · [TypeScript strict mode](https://www.typescriptlang.org/tsconfig/strict.html)

## Issue branches

Before starting a new issue, create a dedicated branch from the latest remote default branch. Name it `<type>/<issue-number>-<short-kebab-case-slug>`, for example `feat/5-sqlite-migrations` or `docs/3-engineering-standards`. Keep commits and the PR for that issue on its dedicated branch. Resume the existing branch when continuing work on the same issue.

## Scope and file limits

Make each PR one independently reviewable and revertible change. Link one primary GroceryAgent issue in the PR template. Read its **Story points** field to determine the file limit. The [issue-tracker guide](../agents/issue-tracker.md#story-points) explains how to set and verify the estimate.

| Story points | Maximum changed files per PR |
| ------------ | ---------------------------: |
| `1`          |                           10 |
| `2`          |                           20 |
| `3`          |                           30 |
| `5`          |                           50 |

Count the files in the PR diff against its target branch, including additions, edits, deletions, tests, docs, generated files, and lockfiles. Count a rename once. CI blocks a PR with a missing or invalid primary issue, a missing or ambiguous estimate, or a file count above the cap. It reports the estimate, count, and limit. Refresh the required size check when the diff, issue reference, or estimate changes, including field changes made without pushing a commit. If the PR exceeds the cap, split the work or use one of the following options:

- **Scope changed.** Update the primary issue’s Story points field with the maintainer’s agreement. Re-run the failed PR size job to read the new estimate and apply its usual cap.
- **Size exception.** For a specific diff the repository owner accepts, copy the entire `/approve-pr-size <full head SHA>` line from the failed check into a standalone PR comment, then re-run the failed job. CI records the approval link in its output. A new commit requires a fresh approval. For example, this lets the owner accept 53 files on a 5-point issue while keeping the usual limit at 50.

## Commit messages

Use Conventional Commits for each commit. Write a type, an optional scope, and a short description, for example `feat(api): add health endpoint` or `docs: clarify local setup`. For a breaking change, add `!` before the colon or a `BREAKING CHANGE:` footer. The Husky commit-msg hook checks the message locally, and PR CI checks the commits introduced by the branch using the same commitlint preset.

## Required checks

Scaffolding wires up the following checks using the same commands locally and in CI.

- Formatting verification, linting, strict TypeScript checks, and a production build.
- Unit tests, Vue component tests, API and SQLite integration tests, and automated browser tests. API tests verify the shared HTTP contract and that manual edits and approved drafts apply the same grocery rules.
- The Vue component line limit defined in the [frontend guide](frontend.md).

The local pre-commit hook blocks a commit when any of those checks fails. CI requires them and the PR size check to pass before merge. Use isolated test data and controlled external responses so the required checks run without provider credentials.

## Browser tests and acceptance

- Run the real Vue and Express app with a fresh file-backed SQLite database per test. Substitute controlled responses at the external AI and web research boundaries. Use representative receipt images and include ambiguous receipt entries. Run live integration smoke checks separately.
- Cover the main workflows at phone width as features land. Verify weekly overrides affect the correct week, recipes can be reused, inventory checks and dates survive reload, and shopping review and receipt drafts update inventory only after the applicable review or approval. Verify a preview leaves household data unchanged and receipt reconciliation avoids double counting.
- For a bug fix, reproduce the reported behavior and verify the observable result through the affected workflow. Use the closest test level that exercises that behavior.
- For a new or materially changed household workflow, agree on a realistic trial scenario in its issue. After automated checks pass, have the maintainer try it and record their acceptance on the issue. PRs may land along the way. Keep feature acceptance pending until the trial is confirmed. Routine changes use automated checks and normal review.

## Review and merge

1. Open work in progress as a draft and fill in the [PR template](../../.github/pull_request_template.md). Keep the primary issue open while further PRs or a hands-on trial are pending.
2. Run an independent agent review for every PR, including fixes and docs. Have the reviewer check the diff against the linked issue and the applicable engineering standards, including file placement, naming, and ownership of any changed contract. Use [Conventional Comments](https://conventionalcomments.org/) in human and agent reviews. Label the intent, such as `issue`, `suggestion`, `question`, or `nitpick`. Mark feedback as blocking or non-blocking where it affects readiness. Describe the impact and resolution for blockers.
3. Fix blocking findings, record remaining non-blocking feedback in the PR, and rerun the checks and independent review after substantive fixes. Mark the PR ready for the maintainer once the review is clear of blockers and required checks pass.
4. The maintainer reviews the final diff and CI results and merges the PR manually. Agents leave the merge to the maintainer. A GitHub approval is available when the maintainer is eligible to submit one. [GitHub review rules](https://docs.github.com/en/pull-requests/how-tos/review-pull-requests/approving-a-pull-request-with-required-reviews)

See [open GroceryAgent PRs](https://github.com/AlessandroRoic/GroceryAgent/pulls) or run `gh pr list --state open` from the checkout. Drafts are still in progress. PRs marked ready are awaiting the maintainer's review.

### Hosted second review

Enable the [cubic GitHub App](https://github.com/apps/cubic-dev-ai) for GroceryAgent alone on its free public-repository plan. Keep its check optional in GitHub branch rules. The [repository configuration](../../cubic.yaml) requests one review when a PR is ready and skips drafts. cubic reads that file only from the default branch, so a configuration change applies after it merges; until then, cubic uses its dashboard settings.

After pushing fixes, comment `@cubic-dev-ai incremental review` to review only the new changes, or `@cubic-dev-ai review this PR` for a full pass. Agents ask the maintainer before requesting a cubic review or posting a challenge.

To challenge a finding, reply in its thread and mention `@cubic-dev-ai`. Ask for the failing input or the repository rule that applies. The author decides whether to apply the suggestion or resolve the thread. cubic cannot push commits here: automatic fixes, fixes requested in PR comments, and fix buttons are all disabled.

If cubic reaches a free usage limit or is unavailable, install [CodeRabbit](https://github.com/apps/coderabbitai) for GroceryAgent when first needed. While the repository has fewer than ten stars, trigger each review manually with `@coderabbitai review` on the PR. Reply to its inline findings for clarification and apply any fixes yourself. If both services are unavailable, proceed with the independent review and required checks above. [CodeRabbit review triggers](https://kb.coderabbit.ai/articles/8856795235-how-do-i-activate-coderabbit-pro-for-my-open-source-project)

### Local agents

The repository ships rules for the coding agents used here. [OpenCode](../../opencode.jsonc) denies secret and credential paths, blocks files outside the checkout, and asks before commits, pushes, PR or issue changes, and review requests. [Codex](../../.codex/config.toml) runs in the `workspace-write` sandbox with on-request approvals, no network, and [command rules](../../.codex/rules/default.rules) that prompt for the same actions. Codex loads project configuration only for trusted projects, and both tools accept command-line overrides, so treat the rules as accident prevention rather than a boundary. Keep real secrets outside the checkout; that is the part no agent setting can weaken.
