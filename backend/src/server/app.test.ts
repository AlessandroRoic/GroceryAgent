import assert from "node:assert/strict";
import { once } from "node:events";
import { test } from "node:test";
import type { Express } from "express";
import { healthResponseSchema } from "@grocery-agent/contracts";
import { apiErrorResponseSchema } from "@grocery-agent/contracts/error-response";
import { createApp } from "./app.ts";

async function withServer(app: Express, run: (baseUrl: string) => Promise<void>): Promise<void> {
  const server = app.listen(0, "127.0.0.1");
  try {
    await once(server, "listening");
    const address = server.address();
    assert.ok(address && typeof address === "object");
    await run(`http://127.0.0.1:${address.port}`);
  } finally {
    await new Promise<void>((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  }
}

await test("GET /health reports that the backend is running", async () => {
  await withServer(createApp(), async (baseUrl) => {
    const response = await fetch(`${baseUrl}/health`);
    assert.equal(response.status, 200);
    assert.match(response.headers.get("content-type") ?? "", /application\/json/);
    const body: unknown = await response.json();
    assert.deepEqual(healthResponseSchema.parse(body), { status: "ok" });
  });
});

await test("HTTP responses apply the Express security baseline", async () => {
  await withServer(createApp(), async (baseUrl) => {
    const response = await fetch(`${baseUrl}/health`);
    await response.body?.cancel();
    assert.equal(response.headers.get("x-powered-by"), null);
    assert.equal(response.headers.get("x-content-type-options"), "nosniff");
    assert.equal(response.headers.get("cache-control"), "no-store");
  });
});

await test("a failed health request returns a client-safe API error", async () => {
  const app = createApp();
  app.set("json replacer", () => {
    app.disable("json replacer");
    throw new Error("Internal diagnostic that must stay private");
  });

  await withServer(app, async (baseUrl) => {
    const response = await fetch(`${baseUrl}/health`);
    assert.equal(response.status, 500);
    assert.match(response.headers.get("content-type") ?? "", /application\/json/);
    const body: unknown = await response.json();
    assert.deepEqual(apiErrorResponseSchema.parse(body), { message: "Internal server error" });
  });
});
