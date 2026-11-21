import { expect } from "@playwright/test";
import { test } from "./appFixture.ts";

test("the built app displays the Express health response", async ({ page, appUrl }) => {
  await page.goto(appUrl);
  await expect(page.getByRole("status")).toHaveText("Server status: ok");
});
