import { isIP } from "node:net";
import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vitest/config";

const host = process.env["HOST"] ?? "127.0.0.1";
const proxyHost = host === "0.0.0.0" ? "127.0.0.1" : host === "::" ? "::1" : host;
const proxyAuthority = isIP(proxyHost) === 6 ? `[${proxyHost}]` : proxyHost;

export default defineConfig({
  plugins: [vue()],
  envDir: false,
  server: {
    host: "127.0.0.1",
    port: 5173,
    strictPort: true,
    proxy: {
      "^/health(?:\\?|$)": {
        target: `http://${proxyAuthority}:${process.env["PORT"] ?? "3000"}`,
      },
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
  },
});
