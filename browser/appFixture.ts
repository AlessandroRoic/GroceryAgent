import { spawn } from "node:child_process";
import { once } from "node:events";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createInterface } from "node:readline";
import { test as base } from "@playwright/test";

export const test = base.extend<{ appUrl: string }>({
  // oxlint-disable-next-line no-empty-pattern -- Playwright requires fixture destructuring.
  appUrl: async ({}, use) => {
    const directory = await mkdtemp(join(tmpdir(), "grocery-agent-browser-"));
    try {
      const server = spawn(
        process.execPath,
        ["backend/dist/server/server.js", "--serve-frontend"],
        {
          env: {
            ...process.env,
            HOST: "127.0.0.1",
            PORT: "0",
            DATABASE_PATH: join(directory, "household.sqlite"),
          },
          stdio: ["ignore", "pipe", "pipe"],
        },
      );
      const closed = new Promise<void>((resolve) => server.once("close", () => resolve()));
      const stdout = createInterface({ input: server.stdout });
      let stderr = "";
      server.stderr.setEncoding("utf8").on("data", (chunk: string) => {
        stderr += chunk;
      });

      const startupDeadline = setTimeout(() => stdout.close(), 10_000);
      try {
        await once(server, "spawn");
        for await (const line of stdout) {
          const url = /^Listening on (http:\/\/127\.0\.0\.1:\d+)$/.exec(line)?.[1];
          if (url !== undefined) {
            clearTimeout(startupDeadline);
            await use(url);
            return;
          }
        }
      } finally {
        clearTimeout(startupDeadline);
        stdout.close();
        server.kill();
        await closed;
      }
      throw new Error(`The app did not report a listening URL. ${stderr}`);
    } finally {
      await rm(directory, { recursive: true, force: true });
    }
  },
});
