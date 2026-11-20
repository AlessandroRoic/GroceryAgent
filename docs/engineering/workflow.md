# Engineering workflow

Keep the Vue frontend in `frontend/` and the Express backend in `backend/`. Use strict TypeScript throughout. Use `PascalCase` for types and `camelCase` for functions and values. Name functions for their behavior and keep helpers private to their module until another module needs them. Follow the project glossary for household terms. [Domain docs](../agents/domain.md) · [V1 spec](https://github.com/AlessandroRoic/GroceryAgent/issues/1) · [TypeScript strict mode](https://www.typescriptlang.org/tsconfig/strict.html)

## Scope and file limits

Make each PR one independently reviewable and revertible change. Link one primary GroceryAgent issue in the PR template. The issue carries exactly one story-point label.

| Issue label | Maximum changed files per PR |
| --- | ---: |
| `points:1` | 10 |
| `points:2` | 20 |
| `points:3` | 30 |
| `points:5` | 50 |

Count the files in the PR diff against its target branch, including additions, edits, deletions, tests, docs, generated files, and lockfiles. Count a rename once. CI blocks a PR with a missing or invalid primary issue, a missing or ambiguous estimate, or a file count above the cap. It reports the estimate, count, and limit. Refresh the required size check when the diff, issue reference, or estimate changes, including label changes made without pushing a commit. If the PR exceeds the cap, split the work under the same issue. Re-estimate with the maintainer when the issue's scope warrants it.

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
