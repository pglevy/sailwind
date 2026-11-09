import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ButtonWidget } from "./ButtonWidget";

describe("ButtonWidget - palette SOLID text color (#189)", () => {
  it("uses black text on light palette shades", () => {
    render(<ButtonWidget label="Go" style="SOLID" color="ORANGE_300" />);
    const button = screen.getByRole("button", { name: "Go" });
    expect(button).toHaveClass("text-black");
    expect(button).not.toHaveClass("text-white");
  });

  it("uses white text on dark palette shades", () => {
    render(<ButtonWidget label="Go" style="SOLID" color="VIOLET_800" />);
    const button = screen.getByRole("button", { name: "Go" });
    expect(button).toHaveClass("text-white");
    expect(button).not.toHaveClass("text-black");
  });

  it("keeps OUTLINE palette buttons unchanged", () => {
    render(<ButtonWidget label="Go" style="OUTLINE" color="ORANGE_300" />);
    expect(screen.getByRole("button", { name: "Go" })).not.toHaveClass("text-black");
  });
});
