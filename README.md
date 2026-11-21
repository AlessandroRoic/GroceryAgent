# GroceryAgent

One household's weekly planning, shopping, and inventory app. Vue and Express have separate packages in one pnpm workspace. Express initializes SQLite before serving requests.

## Run locally

Install the Node version in `.node-version`, then run these commands from the repository root.

```sh
npm install --global pnpm@12.21.0
pnpm install --frozen-lockfile
pnpm dev
```

Open <http://127.0.0.1:5173> to see the Vue page display the Express health response. To work in separate terminals, run `pnpm dev:backend` and `pnpm dev:frontend`. Express also serves the health endpoint directly at <http://127.0.0.1:3000/health>.

Copy `.env.example` to `.env` to change `HOST`, `PORT`, or `DATABASE_PATH`. SQLite defaults to `grocery.sqlite` in the working directory. For persistent storage, set `DATABASE_PATH` to a file in an existing writable directory. Each startup applies pending migrations in version order. Express binds to loopback by default. Set `HOST=0.0.0.0` for containers or access from other devices. A fixed port is required for the Vite proxy. For Express alone, port `0` requests an available port, reported at startup. Stop with Ctrl+C.

Run `pnpm build` and then `pnpm start:built` to serve the compiled Vue app and API together from Express at <http://127.0.0.1:3000>. `pnpm start` runs the backend TypeScript source without watch mode. Both entry points honor `.env`. Linux handles SIGINT and SIGTERM with a ten-second drain deadline. Windows follows its process termination semantics.

## Develop

Install Chromium once with `pnpm exec playwright install --only-shell chromium`. On Linux, use `pnpm exec playwright install --with-deps --only-shell chromium` if the system libraries are missing.

Run `pnpm run check` to verify formatting, linting, types, tests, both builds, and the browser smoke test. To run the smoke test on its own, use `pnpm build` followed by `pnpm run test:browser`. The browser test starts the built app with a temporary SQLite database.

Run a backend test with `node --test backend/src/server/app.test.ts`. Run frontend component tests with `pnpm --filter @grocery-agent/frontend test`. Use `pnpm run format` and `pnpm run lint:fix` to apply fixes.

`pnpm install --frozen-lockfile` installs Git hooks. Commits format staged files and then run the checks. Pushes and CI run the same checks. CI also enforces the file limit using the Story points field on the primary issue linked in the PR.

The temporary status page and component test live together in `frontend/src/health/`. Replace the smoke test's page assertion when the first grocery workflow lands. Reuse its app startup and database fixture.
