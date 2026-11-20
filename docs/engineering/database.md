# SQLite standards

## Persistence

- Keep connection setup and versioned migrations under `backend/src/db/`. Keep queries with their feature in persistence files such as `receiptDraft.repository.ts`.
- Use `snake_case` for tables and columns, bind query parameters, and enable foreign key enforcement on every connection. Use database constraints for invariants such as required values, valid references, and uniqueness. [SQLite foreign keys](https://sqlite.org/foreignkeys.html)
- Apply multi-record updates and record the approval or completed shopping review in one transaction. Make repeat submissions safe so a receipt draft can add the same purchases at most once. Finish external AI and web research requests before opening a write transaction. [SQLite transactions](https://sqlite.org/lang_transaction.html)
- Configure the SQLite file path. The deployment ticket verifies persistent storage, backups, and data surviving a redeploy. [V1 spec](https://github.com/AlessandroRoic/GroceryAgent/issues/1)

## Migrations and tests

- Add ordered migrations for schema changes. Once a migration has run on a shared database, make further changes in a new migration.
- Prefer changes that let the previous app version run after a code revert. For destructive or incompatible migrations, describe the impact and recovery steps in the PR before merge. If recovery depends on a backup, verify that it restores. [SQLite backup documentation](https://sqlite.org/backup.html)
- Use a temporary file-backed SQLite database in persistence tests. Verify that migrations initialize an empty database. For schema changes, verify that migrations upgrade representative existing data. Test transaction rollback and repeated submissions where they protect household data. Use the same setup locally and in CI.

## Technical vocabulary

- **Migration** is a versioned change that brings an existing database to the next expected schema.
- **Transaction** is one unit of database work that commits together or rolls back together.
- **Repository** is the feature's TypeScript module for reading or writing its stored records.
