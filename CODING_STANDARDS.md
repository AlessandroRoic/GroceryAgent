# Coding standards

## Dependencies and tooling

For every part of this project, choose the latest stable compatible runtime, language, library, and tooling releases available when adding or upgrading them. Check the publisher's registry and official documentation; include major updates. Prefer current native tooling where it supports the required behavior. Use preview builds only when the maintainer explicitly approves them and record the reason and migration plan.

Pin direct dependencies exactly and commit `pnpm-lock.yaml`; installs and CI use `pnpm install --frozen-lockfile`. A reproducible lockfile preserves a reviewed set of current versions. Run `pnpm outdated` before dependency work, upgrade to the latest stable release (including majors), and run `pnpm run check`. Keep `.node-version`, `engines`, Node type definitions, `packageManager`, and CI pnpm installation aligned. Dependabot checks npm dependencies and GitHub Actions daily; review and merge passing updates. Check Node and pnpm releases during upgrades as well.

The initial verified toolchain uses Node's native TypeScript execution, the TypeScript 7 native Go compiler, Rust-based Oxlint and Oxfmt, and the stable Go type-aware lint backend. Revisit the Rust type-aware backend once stable; its current npm latest tag is a beta. No transpiler or bundler is needed for this backend.

## Structure and Express

- Keep HTTP application construction in `src/server/app.ts` and process startup in `src/server/server.ts`. Importing the app must not open a port. `no-restricted-imports` limits Express default imports to the app composition root.
- Keep domain rules in framework-independent TypeScript modules under `src/domain/` when those rules exist. HTTP handlers translate inputs and results; future manual edits and approved agent proposals call the same domain behavior.
- Use ESM, explicit `node:` imports for Node built-ins, `.ts` extensions for local imports, and type-only imports. Use native erasable TypeScript; the build rewrites local extensions to `.js`.
- Treat incoming JSON, query values, parameters, and external responses as untrusted input. Narrow `unknown` with runtime validation before domain calls. Specify request/response types on new handlers; TypeScript types alone do not validate HTTP data.
- Use async handlers for I/O and let Express 5 forward rejected promises to centralized error middleware when error-producing workflows are introduced. Return controlled error responses without exposing stack traces or secrets. A single process owns signal handling and connection shutdown.
- Install Helmet at the composition root and disable `X-Powered-By`. Keep health responses uncached. Add explicit validation, request-body limits, error middleware, and authentication with the routes that need them. Keep proxy trust explicit at deployment and terminate production TLS at the host/proxy.

## Enforced checks

| Standard                                                                                                                      | Enforcement                                                                               |
| ----------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| Strict types, checked indexed access, exact optional properties, exhaustive returns, unused symbols, native-compatible syntax | `tsconfig.json` and `pnpm run typecheck`                                                  |
| Correctness, suspicious constructs, performance rules, import cycles                                                          | Oxlint category and plugin rules                                                          |
| Type imports; safe assignments, calls, returns and promises; no explicit `any` or non-null assertions                         | Oxlint with type-aware linting                                                            |
| Braces, strict equality, `const`, no dynamic evaluation, no synchronous Node APIs in server code                              | Explicit Oxlint rules                                                                     |
| Logging belongs at the process boundary                                                                                       | `no-console` with a server-entry override                                                 |
| Double quotes, semicolons, two spaces, trailing commas, 100-column formatting                                                 | Oxfmt; EditorConfig and Git normalize text files                                          |
| Live HTTP health response and security headers, validated startup configuration, process shutdown                             | Node integration tests                                                                    |
| Small PRs                                                                                                                     | `.github/pr-size.json` and CI; all changed files count, including deletions and lockfiles |

Link one issue using `Closes #number` in the PR description. CI reads its `**Story points**` estimate. The file limits are 10 for 1 point, 20 for 2 points, 30 for 3 points, and 50 for 5 points. A missing or unsupported estimate fails the check.

## Testing and review

Test expected behavior through public interfaces. Use deterministic unit tests for domain rules, HTTP integration tests for server contracts, and browser tests for important user workflows once the frontend exists. Substitute controlled responses at external AI and web research boundaries. Avoid mocks of internal helpers. Keep tests near the code they exercise and use ephemeral ports so tests can run concurrently.

During implementation, run type checking and the affected test file regularly. Before review, run the complete `pnpm run check`. Keep feature-specific acceptance scenarios with their issues; major user workflows require the household manager's hands-on confirmation. Review PRs against their issue and these standards; record durable architectural trade-offs in ADRs when resolved.

Git hooks provide local feedback; CI provides repeatable checks even when local hooks are bypassed. Rules such as input validity, domain boundaries, and secret handling still require review and behavioral tests. Automated checks are not a claim that these review responsibilities can all be linted.

## References

- [Express security guidance](https://expressjs.com/en/advanced/best-practice-security/)
- [Express error handling](https://expressjs.com/en/guide/error-handling.html)
- [Oxlint type-aware rules](https://oxc.rs/docs/guide/usage/linter/type-aware)
- [TypeScript native compiler](https://github.com/microsoft/typescript-go)
