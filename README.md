# GroceryAgent

One household's weekly planning, shopping, and inventory app. This first scaffold provides the Express backend; Vue, SQLite, and grocery workflows are separate foundation tickets.

## Run locally

Install the Node version in `.node-version` and npm from `package.json`:

```sh
npm install --global npm@12.2.3
npm ci
npm run dev
```

Open <http://127.0.0.1:3000/health>. It returns HTTP 200 and `{"status":"ok"}`. No database or AI credentials are needed. Copy `.env.example` to `.env` to change `HOST` or `PORT`. The server binds to loopback by default; set `HOST=0.0.0.0` for containers or access from other devices. Port `0` requests an available port, reported at startup. Stop with Ctrl+C.

`npm start` runs the TypeScript source without watch mode. For compiled deployment, run `npm run build` then `npm run start:built`. Both entry points honor `.env`. Linux handles SIGINT/SIGTERM with a ten-second drain deadline; Windows process termination follows Windows semantics.

## Develop

Run `npm run check` before pushing. It checks formatting, lint rules, types, tests, and compilation. Run a single test with `node --test src/server/app.test.ts`. `npm run format` applies formatting and `npm run lint:fix` applies lint fixes.

`npm ci` installs Git hooks: commits format and lint staged files and check project types; pushes run the complete checks. CI runs the same checks on Linux and Windows and enforces the PR file limit. Repository administrators can require the `Checks (ubuntu-latest)`, `Checks (windows-latest)`, and `PR size` checks in branch protection.

Read [the coding standards](CODING_STANDARDS.md) before changing code or dependencies. The PR size limit is a provisional implementation default; maintainer review of the broader standards remains tracked in [#3](https://github.com/AlessandroRoic/GroceryAgent/issues/3). Browser smoke tests will be added with Vue in #6/#7.
