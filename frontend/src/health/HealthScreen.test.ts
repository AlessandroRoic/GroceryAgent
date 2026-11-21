import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/vue";
import { expect, test, vi } from "vitest";
import HealthScreen from "./HealthScreen.vue";

test("shows an error when the server health response is invalid", async () => {
  vi.stubGlobal("fetch", async () => Response.json({ status: "wrong" }));
  try {
    render(HealthScreen);
    expect(await screen.findByRole("alert")).toHaveTextContent("Could not check server health.");
  } finally {
    vi.unstubAllGlobals();
  }
});
