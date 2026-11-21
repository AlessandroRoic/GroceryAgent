import express from "express";
import type { Express } from "express";
import helmet from "helmet";

export function createApp(): Express {
  const app = express();
  app.disable("x-powered-by");
  app.use(helmet());
  app.get<Record<string, never>, { status: "ok" }, unknown, Record<string, never>>(
    "/health",
    (_request, response) => {
      response.set("Cache-Control", "no-store").json({ status: "ok" });
    },
  );
  return app;
}
