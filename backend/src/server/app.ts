import express from "express";
import type { ErrorRequestHandler, Express } from "express";
import helmet from "helmet";
import type { HealthResponse } from "@grocery-agent/contracts";
import type { ApiErrorResponse } from "@grocery-agent/contracts/error-response";

export function createApp(frontendDirectory?: string, reportApiError?: () => void): Express {
  const app = express();
  app.disable("x-powered-by");
  app.use(helmet());
  app.get<Record<string, never>, HealthResponse, unknown, Record<string, never>>(
    "/health",
    (_request, response) => {
      response.set("Cache-Control", "no-store").json({ status: "ok" });
    },
  );
  const sendApiError: ErrorRequestHandler<
    Record<string, never>,
    ApiErrorResponse,
    unknown,
    Record<string, never>
  > = (error: unknown, _request, response, next) => {
    if (response.headersSent) {
      next(error);
      return;
    }
    reportApiError?.();
    response.status(500).json({ message: "Internal server error" });
  };
  app.use(sendApiError);
  if (frontendDirectory !== undefined) {
    app.set("env", "production");
    app.use(express.static(frontendDirectory));
  }
  return app;
}
