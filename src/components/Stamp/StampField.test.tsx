import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { StampField } from "./StampField";

describe("StampField - link", () => {
  it("renders as an image, not a button, when there is no link", () => {
    render(<StampField icon="star" accessibilityText="Favorite" />);
    expect(screen.getByRole("img", { name: "Favorite" })).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("calls saveInto with the link value when clicked", async () => {
    const saveInto = vi.fn();
    render(
      <StampField icon="star" accessibilityText="Favorite" link={{ value: "FAVORITE", saveInto }} />
    );
    await userEvent.click(screen.getByRole("button", { name: "Favorite" }));
    expect(saveInto).toHaveBeenCalledTimes(1);
    expect(saveInto).toHaveBeenCalledWith("FAVORITE");
  });

  it.each([
    ["Enter", "{Enter}"],
    ["Space", " "],
  ])("calls saveInto with the link value on %s", async (_name, keys) => {
    const saveInto = vi.fn();
    render(
      <StampField icon="star" accessibilityText="Favorite" link={{ value: "FAVORITE", saveInto }} />
    );
    screen.getByRole("button", { name: "Favorite" }).focus();
    await userEvent.keyboard(keys);
    expect(saveInto).toHaveBeenCalledTimes(1);
    expect(saveInto).toHaveBeenCalledWith("FAVORITE");
  });

  it("calls onClick when clicked", async () => {
    const onClick = vi.fn();
    render(<StampField icon="star" accessibilityText="Favorite" link={{ onClick }} />);
    await userEvent.click(screen.getByRole("button", { name: "Favorite" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("is not interactive when the link has showWhen false", async () => {
    const saveInto = vi.fn();
    render(
      <StampField
        icon="star"
        accessibilityText="Favorite"
        link={{ value: "FAVORITE", saveInto, showWhen: false }}
      />
    );
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    const stamp = screen.getByRole("img", { name: "Favorite" });
    expect(stamp).not.toHaveAttribute("tabindex");
    expect(stamp.className).not.toContain("cursor-pointer");
    await userEvent.click(stamp);
    expect(saveInto).not.toHaveBeenCalled();
  });
});
