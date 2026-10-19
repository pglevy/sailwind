import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { TabsField } from "./TabsField";
import type { TabItem } from "./TabsField";

const navTabs: TabItem[] = [
  { value: "a", label: "Alpha" },
  { value: "b", label: "Beta" },
  { value: "c", label: "Gamma" },
];

const contentTabs: TabItem[] = navTabs.map((tab) => ({
  ...tab,
  content: <p>{tab.label} panel</p>,
}));

// ─── aria-controls (#185) ────────────────────────────────────────────────────

describe("TabsField - aria-controls", () => {
  it.each(["UNDERLINE", "PILL"] as const)(
    "omits aria-controls in navigationOnly mode (%s)",
    (variant) => {
      render(<TabsField tabs={contentTabs} navigationOnly variant={variant} />);
      expect(screen.queryByRole("tabpanel")).not.toBeInTheDocument();
      const tabs = screen.getAllByRole("tab");
      expect(tabs).toHaveLength(3);
      for (const tab of tabs) {
        expect(tab).not.toHaveAttribute("aria-controls");
      }
    }
  );

  it("omits aria-controls when no tab has content", () => {
    render(<TabsField tabs={navTabs} />);
    expect(screen.queryByRole("tabpanel")).not.toBeInTheDocument();
    for (const tab of screen.getAllByRole("tab")) {
      expect(tab).not.toHaveAttribute("aria-controls");
    }
  });

  it("points aria-controls at the rendered panel when tabs have content", () => {
    render(<TabsField tabs={contentTabs} />);
    const selected = screen.getByRole("tab", { selected: true });
    expect(selected).toHaveAttribute("aria-controls", screen.getByRole("tabpanel").id);
  });
});

describe("TabsField - navigation-only keyboard", () => {
  it("keeps roving focus and arrow-key selection", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<TabsField tabs={navTabs} navigationOnly onValueChange={onValueChange} />);
    const alpha = screen.getByRole("tab", { name: "Alpha" });
    const beta = screen.getByRole("tab", { name: "Beta" });

    await user.tab();
    expect(alpha).toHaveFocus();

    await user.keyboard("{ArrowRight}");
    expect(beta).toHaveFocus();
    expect(beta).toHaveAttribute("aria-selected", "true");
    expect(onValueChange).toHaveBeenCalledWith("b");
  });
});
