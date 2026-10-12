import { render } from "@testing-library/react";
import { page, userEvent } from "vitest/browser";
import { describe, it, expect } from "vitest";
import { BoxLayout } from "./BoxLayout";

// Runs under Vitest's real-Chromium browser mode (the "browser" project in
// vitest.config.ts), not jsdom. storybook/test's own userEvent.tab() — even
// running inside the real-Chromium Storybook/Vitest tier — is a JS-simulated
// port of @testing-library/user-event that computes the next focus target in
// JS and calls .focus() directly, bypassing the browser's native
// `inert`-aware focus engine; it doesn't honor `inert` either, in or out of
// jsdom. vitest/browser's userEvent.tab() dispatches a real Tab keypress
// through the Playwright provider, which does honor `inert`. This file (not
// Box.stories.tsx) carries that assertion because `vitest/browser` can only
// be imported inside Vitest's own browser-mode runtime — a static import of
// it at module scope breaks every story in a file Storybook's plain dev
// server loads as part of its normal module graph.
describe("BoxLayout - collapsed content is skipped by native Tab navigation", () => {
  it("moves focus from the header button past collapsed, inert content to the next element", async () => {
    render(
      <div>
        <BoxLayout
          label="Collapsed Section"
          isCollapsible={true}
          isInitiallyCollapsed={true}
          padding="STANDARD"
        >
          <button type="button">Inside collapsed content</button>
        </BoxLayout>
        <button type="button">Sibling button after box</button>
      </div>
    );

    const headerButton = page.getByRole("button", { name: "Collapsed Section" });
    await headerButton.element().focus();
    await expect.element(headerButton).toHaveFocus();

    await userEvent.tab();

    const siblingButton = page.getByRole("button", { name: "Sibling button after box" });
    await expect.element(siblingButton).toHaveFocus();
  });
});
