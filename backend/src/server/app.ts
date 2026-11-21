import express from "express";
import type { Express } from "express";
import helmet from "helmet";
import type { HealthResponse } from "@grocery-agent/contracts";

export function createApp(frontendDirectory?: string): Express {
  const app = express();
  app.disable("x-powered-by");
  app.use(helmet());
  app.get<Record<string, never>, HealthResponse, unknown, Record<string, never>>(
    "/health",
    (_request, response) => {
      response.set("Cache-Control", "no-store").json({ status: "ok" });
    },
  );
  if (frontendDirectory !== undefined) {
    app.use(express.static(frontendDirectory));
  }
  return app;
}
