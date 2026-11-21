import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: ".",
  outputDir: "../test-results",
  use: { viewport: { width: 390, height: 844 } },
});
