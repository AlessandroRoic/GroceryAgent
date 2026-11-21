# Shared coding standards

These rules apply across GroceryAgent. Follow the [backend guide](backend.md) for Express and the [frontend guide](frontend.md) for Vue.

## TypeScript and formatting

Use strict TypeScript and ES modules. Use type-only imports for types and narrow external data from `unknown` before using it. Handle rejected promises and keep imports free of cycles.

The [TypeScript configuration](../../tsconfig.json) checks indexed access, optional properties, return paths, and unused symbols. [Oxlint](../../.oxlintrc.json) enforces type safety and checks for common errors, including unhandled promises. [Oxfmt](../../.oxfmtrc.json) defines formatting. Run `pnpm run format` to apply it.

## Dependencies and tooling

Choose the latest stable compatible release when adding or updating a runtime, language, library, or tool. Check the publisher's registry and documentation for major releases too. Prefer native tools where they support the project's needs. Use preview builds only with maintainer approval and record the reason and migration plan.

Pin direct dependencies exactly, commit `pnpm-lock.yaml`, and use `pnpm install --frozen-lockfile` for reproducible installs. Check `pnpm outdated` before dependency work. Keep the Node version, engine constraints, Node types, pnpm version, and CI setup aligned when upgrading. Review the daily Dependabot updates for packages and GitHub Actions.

## Verification

Test behavior through public interfaces and keep tests near the code they exercise. During development, run the affected test and type check. Before review, run `pnpm run check` for formatting, linting, type checking, tests, and the production build. Follow the [engineering workflow](workflow.md) for PR size limits, review, and acceptance.
