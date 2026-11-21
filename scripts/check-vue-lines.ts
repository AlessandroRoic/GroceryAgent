import { glob, readFile } from "node:fs/promises";

const maxLines = 500;
const components = glob("frontend/**/*.vue", {
  exclude: ["**/node_modules", "**/dist", "**/coverage"],
});

for await (const file of components) {
  const source = await readFile(file, "utf8");
  const lineCount = source.replace(/\r?\n$/, "").split("\n").length;
  if (lineCount > maxLines) {
    console.error(`${file} has ${lineCount} lines. Vue components are limited to ${maxLines}.`);
    process.exitCode = 1;
  }
}
