import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ToggleField } from "./ToggleField";
import { LocaleProvider } from "../../i18n";

const tooltip = "Automatically save changes every 30 seconds";

// ─── Help icon and required indicator (#185) ─────────────────────────────────

describe("ToggleField - help icon", () => {
  it("is an img named 'help' and described by the tooltip text", () => {
    render(<ToggleField choiceLabel="Auto-save" helpTooltip={tooltip} />);
    const icon = screen.getByRole("img", { name: "help" });

    expect(icon).toHaveAttribute("title", tooltip);
    expect(icon).toHaveAccessibleDescription(tooltip);
    expect(icon.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
  });

  it("is not rendered without helpTooltip", () => {
    render(<ToggleField choiceLabel="Auto-save" />);
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("localizes the help and required labels", () => {
    render(
      <LocaleProvider locale="es">
        <ToggleField choiceLabel="Auto-save" helpTooltip={tooltip} required />
      </LocaleProvider>
    );
    expect(screen.getByRole("img", { name: "ayuda" })).toBeInTheDocument();
    expect(screen.getByLabelText("obligatorio")).toHaveTextContent("*");
  });
});
