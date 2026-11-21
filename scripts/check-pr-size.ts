import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

const base = process.env["PR_BASE_SHA"] ?? process.argv[2];
if (!base || !/^[a-f\d]{40}$/i.test(base)) {
  throw new Error("Provide the base commit SHA as PR_BASE_SHA or the first argument.");
}
const config: unknown = JSON.parse(
  readFileSync(new URL("../.github/pr-size.json", import.meta.url), "utf8"),
);
const points = process.env["STORY_POINTS"] ?? process.argv[3];
if (!points || !config || typeof config !== "object" || !Object.hasOwn(config, points)) {
  throw new Error(
    "Set one supported estimate in the linked issue: Story points must be 1, 2, 3, or 5.",
  );
}
const limit: unknown = Reflect.get(config, points);
if (typeof limit !== "number" || !Number.isSafeInteger(limit) || limit <= 0) {
  throw new Error("Invalid file allowance in .github/pr-size.json.");
}
const files = execFileSync("git", ["diff", "--name-only", "-z", `${base}...HEAD`], {
  encoding: "utf8",
})
  .split("\0")
  .filter(Boolean);
console.info(
  `${files.length}/${limit} (${points} story points) changed files (including docs, generated files, and lockfiles).`,
);
if (files.length > limit) {
  console.error("Split the change into smaller pull requests.");
  process.exitCode = 1;
}
