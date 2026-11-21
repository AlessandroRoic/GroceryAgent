import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

const base = process.env["PR_BASE_SHA"] ?? process.argv[2];
if (!base || !/^[a-f\d]{40}$/i.test(base)) {
  throw new Error("Provide the base commit SHA as PR_BASE_SHA or the first argument.");
}
const config: unknown = JSON.parse(
  readFileSync(new URL("../.github/pr-size.json", import.meta.url), "utf8"),
);
if (
  typeof config !== "object" ||
  config === null ||
  !("maxFiles" in config) ||
  typeof config.maxFiles !== "number" ||
  !Number.isInteger(config.maxFiles) ||
  config.maxFiles < 1
) {
  throw new Error(".github/pr-size.json must contain a positive integer maxFiles.");
}
const files = execFileSync("git", ["diff", "--name-only", "-z", `${base}...HEAD`], {
  encoding: "utf8",
})
  .split("\0")
  .filter(Boolean);
console.info(
  `${files.length}/${config.maxFiles} changed files (including docs, generated files, and lockfiles).`,
);
if (files.length > config.maxFiles) {
  console.error("Split the change into smaller pull requests.");
  process.exitCode = 1;
}
