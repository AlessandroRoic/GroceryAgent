# Backend standards

## Express and domain code

- Group code by feature. Use separate files for HTTP routes, application workflows, domain rules, and persistence. For example, `receiptDraft.routes.ts` delegates to `approveReceiptDraft.ts`, which can call a pure rule such as `calculateReceiptCorrections.ts`.
- Routes parse input using the [shared contract](contracts.md), call a workflow, and return a response. Workflows coordinate domain rules, storage, and external integrations. Keep grocery rules in deterministic TypeScript modules with explicit inputs. Keep Express, SQLite, and external AI and web research calls at the boundaries.
- Route manual edits and approved AI drafts through the same domain rules. Treat AI output as untrusted input. Validate it before preview and validate the proposed changes against current state before applying them. Require explicit approval before changing household data based on a draft. Manual workflows must work without AI credentials.
- Set explicit size limits for JSON requests and receipt uploads. Use a shared Express error handler to return typed, client-safe errors. Keep secrets, receipt contents, and stack traces out of client responses. Keep provider secrets and raw receipt contents out of routine logs. Set upload limits in the receipt feature ticket. [Express security](https://expressjs.com/en/advanced/best-practice-security/) · [Express error handling](https://expressjs.com/en/guide/error-handling/) · [Node.js security](https://nodejs.org/learn/getting-started/security-best-practices)

## Server setup

Construct the Express app separately from the entry point that opens the port and handles shutdown. Keep logging at the process boundary and use asynchronous I/O in handlers. Use explicit `node:` imports for built-ins and `.ts` extensions for local imports so Node can execute the source and TypeScript can rewrite the extensions during the build.

Install Helmet when constructing the app, disable `X-Powered-By`, and send uncached health responses. Specify request and response types on new handlers, validate incoming data at runtime, and let Express 5 forward rejected handler promises to shared error middleware.

## Backend tests

- Unit-test observable inputs and outputs of deterministic rules. Cover routine defaults, weekly override scope, hard exclusions, locked meals, and shopping review and receipt corrections that could double count a purchase. Exercise boundary cases, including invalid input the rule is responsible for handling.
- Test the API with malformed requests, invalid drafts, and a valid draft applied after approval. Show that creating or previewing a draft leaves household data unchanged and that manual edits and approved drafts enforce the same grocery rules. Use the [database guide](database.md) when a test exercises persistence.

## Technical vocabulary

- **Workflow** coordinates one application operation, such as approving a receipt draft, using domain rules and the necessary inputs and outputs.
- **Domain rule** is deterministic grocery behavior shared across backend workflows.

Add new backend-specific terms here when they need a definition. Use the root glossary for household terms and the contracts guide for shared data terms. [Domain docs](../agents/domain.md) · [API contracts](contracts.md)
