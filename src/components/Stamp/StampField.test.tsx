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

  it("calls onClick with the link value when clicked", async () => {
    const onClick = vi.fn();
    render(
      <StampField icon="star" accessibilityText="Favorite" link={{ onClick, value: "FAVORITE" }} />
    );
    await userEvent.click(screen.getByRole("button", { name: "Favorite" }));
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onClick).toHaveBeenCalledWith("FAVORITE");
  });

  it("calls onClick instead of saveInto when the link has both", async () => {
    const onClick = vi.fn();
    const saveInto = vi.fn();
    render(
      <StampField
        icon="star"
        accessibilityText="Favorite"
        link={{ onClick, saveInto, value: "FAVORITE" }}
      />
    );
    await userEvent.click(screen.getByRole("button", { name: "Favorite" }));
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onClick).toHaveBeenCalledWith("FAVORITE");
    expect(saveInto).not.toHaveBeenCalled();
  });

  it("rejects a function as the link at the type level", () => {
    // Issue #187: link used to be `any`, so a callback compiled but did nothing.
    // tsc -b checks this file, so the typecheck fails if this stops being a type error.
    // @ts-expect-error -- link takes a SAILDynamicLink object, not a function
    const element = <StampField icon="star" accessibilityText="Favorite" link={() => {}} />;
    expect(element).toBeDefined();
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

// Default content color follows background contrast (#189)
describe("StampField - default content color", () => {
  const stamp = (backgroundColor: string) => {
    render(<StampField icon="star" accessibilityText="Favorite" backgroundColor={backgroundColor as never} />);
    return screen.getByRole("img", { name: "Favorite" });
  };

  it("uses dark content on light palette and hex backgrounds", () => {
    expect(stamp("ORANGE_300")).toHaveClass("text-gray-900");
  });

  it("uses dark content on a light hex background", () => {
    expect(stamp("#FFB74D")).toHaveClass("text-gray-900");
  });

  it("keeps white content on dark palette backgrounds", () => {
    expect(stamp("VIOLET_800")).toHaveClass("text-white");
  });

  it("keeps white content on semantic backgrounds", () => {
    expect(stamp("ACCENT")).toHaveClass("text-white");
  });
});
