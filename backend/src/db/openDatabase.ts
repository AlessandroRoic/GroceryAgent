import { DatabaseSync } from "node:sqlite";

const migrations = [
  {
    version: 1,
    sql: "CREATE TABLE schema_migrations (version INTEGER PRIMARY KEY)",
  },
];

export function openDatabase(path: string): DatabaseSync {
  if (!path.trim()) {
    throw new Error("DATABASE_PATH must name a SQLite file");
  }
  const database = new DatabaseSync(path, { enableForeignKeyConstraints: true, timeout: 5000 });
  try {
    if (!database.location()) {
      throw new Error("DATABASE_PATH must name a SQLite file");
    }
    database.exec("BEGIN IMMEDIATE");
    const hasHistory = database
      .prepare("SELECT 1 FROM sqlite_schema WHERE type = 'table' AND name = 'schema_migrations'")
      .get();
    const applied = hasHistory
      ? new Set(
          database
            .prepare("SELECT version FROM schema_migrations")
            .all()
            .map((row) => row["version"]),
        )
      : new Set<number>();
    for (const migration of migrations) {
      if (applied.has(migration.version)) {
        continue;
      }
      database.exec(migration.sql);
      database.prepare("INSERT INTO schema_migrations (version) VALUES (?)").run(migration.version);
    }
    database.exec("COMMIT");
    return database;
  } catch (error) {
    // Closing the connection rolls back any uncommitted migration.
    database.close();
    throw error;
  }
}
