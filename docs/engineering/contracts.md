# API contracts

- Define request, response, and error schemas once in `shared/contracts/`. Derive TypeScript types from the runtime schemas and import them on both sides of the HTTP boundary. The scaffolding ticket chooses the schema library.
- Treat unvalidated input as `unknown` and narrow it at the boundary. Express validates incoming request data. The Vue API module validates received response data, including error responses. Check emitted responses against the contract in API tests.
- Define a separate SQLite row or Vue form type when it represents a different shape or state. Map it at the boundary. Keep the contract focused on exchanged data, with grocery rules owned by the server and persistence details owned by SQLite code.

## Shared technical vocabulary

- **API contract** is the set of request, response, and error shapes the frontend and backend exchange over HTTP.
- **Runtime schema** describes and validates one of those shapes and supplies its TypeScript type.

Use the root glossary for the meaning of household data, such as a receipt draft. [Domain docs](../agents/domain.md)
