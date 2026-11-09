import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { FieldLabel } from "./FieldLabel";
import { LocaleProvider } from "../../i18n";

// Required and help indicators (#185)

describe("FieldLabel - required indicator", () => {
  it("hides the asterisk and announces the required text instead", () => {
    render(<FieldLabel label="Name" required htmlFor="n" />);
    const asterisk = screen.getByText("*");
    expect(asterisk).toHaveAttribute("aria-hidden", "true");
    expect(screen.getByText("required")).toHaveClass("sr-only");
  });

  it("includes the required text in the label's text content", () => {
    render(<FieldLabel label="Name" required htmlFor="n" />);
    expect(screen.getByText("Name", { exact: false }).closest("label")).toHaveTextContent("required");
  });

  it("localizes the required text", () => {
    render(
      <LocaleProvider locale="es">
        <FieldLabel label="Nombre" required />
      </LocaleProvider>
    );
    expect(screen.getByText("obligatorio")).toHaveClass("sr-only");
  });

  it("renders no indicator when not required", () => {
    render(<FieldLabel label="Name" />);
    expect(screen.queryByText("*")).not.toBeInTheDocument();
  });
});

describe("FieldLabel - help icon", () => {
  const tooltip = "Use your legal name";

  it("is an img named 'help' and described by the tooltip text", () => {
    render(<FieldLabel label="Name" helpTooltip={tooltip} />);
    const icon = screen.getByRole("img", { name: "help" });
    expect(icon).toHaveAttribute("title", tooltip);
    expect(icon).toHaveAccessibleDescription(tooltip);
    expect(icon.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
  });

  it("is not rendered without helpTooltip", () => {
    render(<FieldLabel label="Name" />);
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });
});
