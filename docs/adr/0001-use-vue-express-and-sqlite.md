# Use Vue, Express, and SQLite for v1

GroceryAgent v1 serves one household from a single cloud deployment. We chose Vue with TypeScript for the frontend because the maintainer knows Vue and can review it, and Express with TypeScript for the backend so both sides use a familiar language and the server can keep grocery rules in testable TypeScript modules. We chose SQLite because one server can store the household's data in a file without operating a separate database service.

## Consequences

- Keep the frontend and backend in one repository and deploy them as one application. The household can reach it from a phone away from home with the home computer off.
- The host must support a persistent volume and backups. Configure the SQLite file path and verify that data survives a redeploy. Choose the hosting provider in the deployment ticket.
- Revisit SQLite if the app needs multiple server instances or the chosen host cannot provide persistent storage. Managed PostgreSQL is the alternative we considered for those cases.

Product scope and deployment requirements are recorded in [the v1 spec](https://github.com/AlessandroRoic/GroceryAgent/issues/1).
