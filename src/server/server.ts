import { once } from "node:events";
import { createApp } from "./app.ts";

const rawPort = process.env["PORT"] ?? "3000";
const port = Number(rawPort);
if (!/^\d+$/.test(rawPort) || !Number.isInteger(port) || port > 65535) {
  throw new Error("PORT must be an integer between 0 and 65535");
}
const host = process.env["HOST"] ?? "127.0.0.1";
const server = createApp().listen(port, host);
await once(server, "listening");
const address = server.address();
if (address && typeof address === "object") {
  console.info(`Listening on http://${host}:${address.port}`);
}

function shutdown(): void {
  const deadline = setTimeout(() => {
    server.closeAllConnections();
    process.exitCode = 1;
  }, 10_000);
  deadline.unref();
  server.close((error) => {
    clearTimeout(deadline);
    if (error) {
      console.error(error);
      process.exitCode = 1;
    }
  });
}

process.once("SIGINT", shutdown);
process.once("SIGTERM", shutdown);
