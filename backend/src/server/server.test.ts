import assert from "node:assert/strict";
import { execFile, spawn } from "node:child_process";
import { once } from "node:events";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { DatabaseSync } from "node:sqlite";
import { createInterface } from "node:readline";
import { test, type TestContext } from "node:test";
import { promisify } from "node:util";

async function startAndStopServer(context: TestContext, databasePath: string): Promise<void> {
  const child = spawn(process.execPath, ["backend/src/server/server.ts"], {
    env: { ...process.env, HOST: "127.0.0.1", PORT: "0", DATABASE_PATH: databasePath },
    stdio: ["ignore", "pipe", "pipe"],
  });
  context.after(() => {
    child.kill();
  });
  const exited = once(child, "exit");
  const lines = createInterface({ input: child.stdout });
  context.after(() => {
    lines.close();
  });
  const lineEvent: unknown[] = await once(lines, "line");
  const [line] = lineEvent;
  assert.equal(typeof line, "string");
  const match = /Listening on http:\/\/127\.0\.0\.1:(\d+)/.exec(String(line));
  assert.ok(match?.[1], "startup reports the actual listening port");
  const response = await fetch(`http://127.0.0.1:${match[1]}/health`);
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { status: "ok" });
  child.kill("SIGTERM");
  const exitEvent: unknown[] = await exited;
  const [code, signal] = exitEvent;
  if (process.platform === "win32") {
    assert.equal(signal, "SIGTERM");
  } else {
    assert.equal(code, 0);
    assert.equal(signal, null);
  }
}

await test(
  "server initializes the configured database and preserves it on restart",
  { timeout: 15_000 },
  async (context) => {
    const directory = await mkdtemp(join(tmpdir(), "grocery-agent-"));
    context.after(() => rm(directory, { recursive: true, force: true }));
    const path = join(directory, "household.sqlite");
    await startAndStopServer(context, path);
    {
      using db = new DatabaseSync(path);
      assert.ok(db.prepare("SELECT version FROM schema_migrations WHERE version = 1").get());
      db.exec(
        "CREATE TABLE restart_probe (value TEXT); INSERT INTO restart_probe VALUES ('saved')",
      );
    }
    await startAndStopServer(context, path);
    using db = new DatabaseSync(path, { readOnly: true });
    assert.equal(db.prepare("SELECT value FROM restart_probe").get()?.["value"], "saved");
    assert.equal(
      db.prepare("SELECT count(*) AS count FROM schema_migrations WHERE version = 1").get()?.[
        "count"
      ],
      1,
    );
  },
);

await test(
  "invalid PORT values stop startup with an actionable error",
  { timeout: 10_000 },
  async (context) => {
    await Promise.all(
      ["abc", "3000oops", "-1", "65536", "1.5", ""].map(async (port) => {
        const child = spawn(process.execPath, ["backend/src/server/server.ts"], {
          env: { ...process.env, PORT: port },
          stdio: ["ignore", "ignore", "pipe"],
        });
        context.after(() => {
          child.kill();
        });
        let stderr = "";
        child.stderr.setEncoding("utf8").on("data", (chunk: string) => {
          stderr += chunk;
        });
        const closeEvent: unknown[] = await once(child, "close");
        const [code] = closeEvent;
        assert.notEqual(code, 0, `PORT=${port} must fail startup`);
        assert.match(stderr, /PORT must be an integer between 0 and 65535/);
      }),
    );
  },
);

await test("startup rejects a SQLite URI without a backing file", async () => {
  await assert.rejects(
    promisify(execFile)(process.execPath, ["backend/src/server/server.ts"], {
      env: { ...process.env, PORT: "0", DATABASE_PATH: "file::memory:?cache=shared" },
      timeout: 5000,
    }),
    { code: 1, stderr: /DATABASE_PATH must name a SQLite file/ },
  );
});
