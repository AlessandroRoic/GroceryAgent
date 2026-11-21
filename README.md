# GroceryAgent

One household's weekly planning, shopping, and inventory app. The Express backend initializes SQLite before serving requests.

## Run locally

Install the Node version in `.node-version` and pnpm from `package.json`:

```sh
npm install --global pnpm@12.21.0
pnpm install --frozen-lockfile
pnpm run dev
```

Open <http://127.0.0.1:3000/health>. It returns HTTP 200 and `{"status":"ok"}`. Copy `.env.example` to `.env` to change `HOST`, `PORT`, or `DATABASE_PATH`. SQLite defaults to `grocery.sqlite` in the working directory. For persistent storage, set `DATABASE_PATH` to a file in an existing writable directory. Each startup applies pending migrations in version order. The server binds to loopback by default; set `HOST=0.0.0.0` for containers or access from other devices. Port `0` requests an available port, reported at startup. Stop with Ctrl+C.

`pnpm start` runs the TypeScript source without watch mode. For compiled deployment, run `pnpm run build` then `pnpm run start:built`. Both entry points honor `.env`. Linux handles SIGINT/SIGTERM with a ten-second drain deadline; Windows process termination follows Windows semantics.

## Develop

Run `pnpm run check` before pushing. It checks formatting, lint rules, types, tests, and compilation. Run a single test with `node --test backend/src/server/app.test.ts`. `pnpm run format` applies formatting and `pnpm run lint:fix` applies lint fixes.

`pnpm install --frozen-lockfile` installs Git hooks: commits format and lint staged files and check project types; pushes run the complete checks. CI runs the same checks on Linux and Windows and enforces the PR file limit. Repository administrators can require the `Checks (ubuntu-latest)`, `Checks (windows-latest)`, and `PR size` checks in branch protection.

Read [the shared coding standards](docs/engineering/coding-standards.md) before changing code or dependencies. Enter the issue number under Primary issue in the PR template. CI reads its Story points field to determine the file limit. Browser smoke tests will be added with Vue in #6/#7.
