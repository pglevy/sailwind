import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Home } from "lucide-react";
import { RecordView } from "./RecordView";
import type { RecordAction } from "./RecordView";
import type { SiteNavPage } from "../SiteNav";
import { ButtonWidget } from "../Button/ButtonWidget";

const pages: SiteNavPage[] = [{ label: "Home", icon: Home, isSelected: true }];

const actions = (n: number): RecordAction[] =>
  Array.from({ length: n }, (_, i) => ({ label: `Action ${i + 1}` }));

const renderRecordView = (actionCount: number) =>
  render(<RecordView pages={pages} recordTitle="REC-001" recordActions={actions(actionCount)} />);

// ─── "More actions" overflow trigger (#185) ─────────────────────────────────

describe("RecordView - More actions trigger", () => {
  it("is a real button that carries the menu-trigger ARIA", () => {
    renderRecordView(5);
    const trigger = screen.getByRole("button", { name: "More actions" });

    expect(trigger.tagName).toBe("BUTTON");
    expect(trigger).toHaveAttribute("type", "button");
    expect(trigger).toHaveAttribute("aria-haspopup", "menu");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger).toHaveAttribute("title", "More actions");
    expect(trigger.parentElement).not.toHaveAttribute("aria-expanded");
    expect(trigger.querySelector("button")).toBeNull();

    const popupTriggers = Array.from(document.querySelectorAll("[aria-haspopup]"));
    expect(popupTriggers).toHaveLength(1);
    for (const el of popupTriggers) {
      expect(el.tagName).toBe("BUTTON");
    }
  });

  it("renders exactly like an icon-only OUTLINE / ACCENT / SMALL ButtonWidget", () => {
    renderRecordView(5);
    const trigger = screen.getByRole("button", { name: "More actions" });

    const { container } = render(
      <ButtonWidget
        icon="ellipsis"
        style="OUTLINE"
        color="ACCENT"
        size="SMALL"
        accessibilityText="More actions"
        tooltip="More actions"
      />
    );
    const reference = container.querySelector("button") as HTMLButtonElement;

    expect(trigger.className).toBe(reference.className);
    expect(trigger.innerHTML).toBe(reference.innerHTML);
  });

  it("is not rendered with three or fewer actions", () => {
    renderRecordView(3);
    expect(screen.queryByRole("button", { name: "More actions" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Action 3" })).toBeInTheDocument();
  });
});
