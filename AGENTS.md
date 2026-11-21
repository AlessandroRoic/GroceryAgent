## Agent skills

### Issue tracker

Issues live in GitHub Issues for AlessandroRoic/GroceryAgent.
Before reading, creating, or estimating an issue, read the [issue-tracker guide](docs/agents/issue-tracker.md). Use the primary issue’s native **Story points** field as the source of its estimate.

### Triage labels

Use the five default triage labels.
Before triaging issues, read `docs/agents/triage-labels.md`.

### Domain docs

This repo uses a single-context layout.
Before exploring domain concepts or architecture, read `docs/agents/domain.md`.

## Engineering standards

- [Shared coding standards](docs/engineering/coding-standards.md) — read before changing or reviewing code, tests, dependencies, or tooling.
- [Engineering workflow](docs/engineering/workflow.md) — read before implementing, testing, or reviewing a change, or preparing a pull request.
- [Frontend](docs/engineering/frontend.md) — read before changing or reviewing Vue code or component tests.
- [Backend](docs/engineering/backend.md) — read before changing or reviewing Express, server workflows, or backend tests.
- [Database](docs/engineering/database.md) — read before changing or reviewing SQLite queries, migrations, or persistence tests.
- [API contracts](docs/engineering/contracts.md) — read before changing or reviewing the HTTP interface between Vue and Express.

## Secrets and protected files

Never read or edit `.env`, `.env.*` other than `.env.example`, or key and credential files. Use `.env.example` to document configuration, and keep real secrets outside the checkout.

The project [OpenCode configuration](opencode.jsonc) denies these paths and blocks access outside the repository. The [Codex configuration](.codex/config.toml) runs in the `workspace-write` sandbox, which limits writes and disables network access (including for project scripts), with on-request approvals and [command rules](.codex/rules/default.rules) that prompt before commits, pushes, and GitHub changes. Codex still reads files inside the workspace, so keeping secrets outside the checkout is what protects them. OpenCode file permissions apply to its file tools. Shell commands and project scripts run with the access granted to their process. Do not weaken them.
