import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { createInterface } from "node:readline";
import { test } from "node:test";

await test(
  "the entry point serves HTTP on its configured host and port and shuts down",
  { timeout: 10_000 },
  async (context) => {
    const child = spawn(process.execPath, ["src/server/server.ts"], {
      env: { ...process.env, HOST: "127.0.0.1", PORT: "0" },
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
  },
);

await test(
  "invalid PORT values stop startup with an actionable error",
  { timeout: 10_000 },
  async (context) => {
    await Promise.all(
      ["abc", "3000oops", "-1", "65536", "1.5", ""].map(async (port) => {
        const child = spawn(process.execPath, ["src/server/server.ts"], {
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
        const exitEvent: unknown[] = await once(child, "exit");
        const [code] = exitEvent;
        assert.notEqual(code, 0, `PORT=${port} must fail startup`);
        assert.match(stderr, /PORT must be an integer between 0 and 65535/);
      }),
    );
  },
);
