import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, afterEach } from "vitest";
import { BoxLayout } from "./BoxLayout";

describe("BoxLayout - visibility", () => {
  it("returns null when showWhen is false", () => {
    const { container } = render(
      <BoxLayout showWhen={false} label="Hidden">
        <p>Content</p>
      </BoxLayout>
    );
    expect(container.innerHTML).toBe("");
  });

  it("renders when showWhen is true (default)", () => {
    const { container } = render(
      <BoxLayout label="Visible">
        <p>Content</p>
      </BoxLayout>
    );
    expect(container.innerHTML).not.toBe("");
  });
});

describe("BoxLayout - default rendering", () => {
  it("renders the label in the default labelHeadingTag (EXTRA_SMALL -> H5)", () => {
    render(<BoxLayout label="Account Details" />);
    expect(screen.getByRole("heading", { level: 5, name: "Account Details" })).toBeInTheDocument();
  });

  it("applies default showBorder/showShadow/shape/padding/margin/borderWeight/labelFontWeight classes", () => {
    const { container } = render(<BoxLayout label="Defaults">Content</BoxLayout>);
    const root = container.firstChild as HTMLElement;
    expect(root.className).toContain("border"); // showBorder=true, borderWeight=THIN -> 'border'
    expect(root.className).not.toContain("shadow-md"); // showShadow=false
    expect(root.className).toContain("rounded-none"); // shape=SQUARED
    expect(root.className).toContain("border-gray-300"); // borderColor=STANDARD
  });

  it("does not render a header row when there is no label and the box is not collapsible", () => {
    const { container } = render(<BoxLayout>Content only</BoxLayout>);
    expect(screen.queryByRole("heading")).not.toBeInTheDocument();
    expect(container.textContent).toContain("Content only");
  });
});

describe("BoxLayout - labelHeadingTag default-by-labelSize mapping", () => {
  const cases: Array<[string, number]> = [
    ["LARGE_PLUS", 1],
    ["LARGE", 1],
    ["MEDIUM_PLUS", 2],
    ["MEDIUM", 3],
    ["SMALL", 4],
    ["EXTRA_SMALL", 5],
  ];

  cases.forEach(([labelSize, level]) => {
    it(`labelSize="${labelSize}" defaults to an H${level} heading`, () => {
      render(<BoxLayout label="Title" labelSize={labelSize as any} />);
      expect(screen.getByRole("heading", { level })).toBeInTheDocument();
    });
  });

  it("an explicit labelHeadingTag overrides the computed default", () => {
    render(<BoxLayout label="Title" labelSize="EXTRA_SMALL" labelHeadingTag="H2" />);
    expect(screen.getByRole("heading", { level: 2 })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { level: 5 })).not.toBeInTheDocument();
  });
});

describe("BoxLayout - isCollapsible interaction", () => {
  it("has aria-expanded=false when isInitiallyCollapsed is true", () => {
    render(
      <BoxLayout label="Section" isCollapsible={true} isInitiallyCollapsed={true}>
        <p>Body</p>
      </BoxLayout>
    );
    expect(screen.getByRole("button", { name: /section/i })).toHaveAttribute("aria-expanded", "false");
  });

  it("has aria-expanded=true by default", () => {
    render(
      <BoxLayout label="Section" isCollapsible={true}>
        <p>Body</p>
      </BoxLayout>
    );
    expect(screen.getByRole("button", { name: /section/i })).toHaveAttribute("aria-expanded", "true");
  });

  it("aria-controls on the button matches the content wrapper's id", () => {
    const { container } = render(
      <BoxLayout label="Section" isCollapsible={true}>
        <p>Body</p>
      </BoxLayout>
    );
    const button = screen.getByRole("button", { name: /section/i });
    const contentId = button.getAttribute("aria-controls");
    expect(contentId).toBeTruthy();
    expect(container.querySelector(`#${contentId}`)).toBeInTheDocument();
  });

  it("clicking toggles aria-expanded and shows/hides children text", async () => {
    const user = userEvent.setup();
    render(
      <BoxLayout label="Section" isCollapsible={true} isInitiallyCollapsed={true}>
        <p>Secret body text</p>
      </BoxLayout>
    );
    const button = screen.getByRole("button", { name: /section/i });
    expect(button).toHaveAttribute("aria-expanded", "false");
    await user.click(button);
    expect(button).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("Secret body text")).toBeInTheDocument();
    await user.click(button);
    expect(button).toHaveAttribute("aria-expanded", "false");
  });
});

describe("BoxLayout - isCollapsible=false", () => {
  it("renders no button and shows children regardless of isInitiallyCollapsed", () => {
    render(
      <BoxLayout label="Section" isCollapsible={false} isInitiallyCollapsed={true}>
        <p>Always visible</p>
      </BoxLayout>
    );
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(screen.getByText("Always visible")).toBeInTheDocument();
  });
});

describe("BoxLayout - inert attribute on collapsed content", () => {
  it("sets inert on the content wrapper when collapsed", () => {
    const { container } = render(
      <BoxLayout label="Section" isCollapsible={true} isInitiallyCollapsed={true}>
        <p>Body</p>
      </BoxLayout>
    );
    const button = screen.getByRole("button", { name: /section/i });
    const contentId = button.getAttribute("aria-controls");
    const wrapper = container.querySelector(`#${contentId}`) as HTMLElement;
    expect(wrapper.hasAttribute("inert")).toBe(true);
  });

  it("removes inert after clicking the header to open", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <BoxLayout label="Section" isCollapsible={true} isInitiallyCollapsed={true}>
        <p>Body</p>
      </BoxLayout>
    );
    const button = screen.getByRole("button", { name: /section/i });
    const contentId = button.getAttribute("aria-controls");
    const wrapper = container.querySelector(`#${contentId}`) as HTMLElement;
    expect(wrapper.hasAttribute("inert")).toBe(true);
    await user.click(button);
    expect(wrapper.hasAttribute("inert")).toBe(false);
  });

  it("never sets inert on the non-collapsible branch's content wrapper", () => {
    const { container } = render(
      <BoxLayout label="Section" isCollapsible={false}>
        <p>Body</p>
      </BoxLayout>
    );
    const contentWrapper = container.querySelector('[id$="-content"]') as HTMLElement;
    expect(contentWrapper.hasAttribute("inert")).toBe(false);
  });
});

describe("BoxLayout - overflow-hidden scoping", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("has overflow-hidden while collapsed, during the open transition, and not once settled open", () => {
    vi.useFakeTimers();
    const { container } = render(
      <BoxLayout label="Section" isCollapsible={true} isInitiallyCollapsed={true}>
        <p>Body</p>
      </BoxLayout>
    );
    const contentWrapper = container.querySelector('[id$="-content"]') as HTMLElement;
    expect(contentWrapper.className).toContain("overflow-hidden");

    const button = screen.getByRole("button", { name: /section/i });
    // Click triggers both setIsOpen and setIsAnimating synchronously via React's
    // event handler; fire the click directly (rather than via userEvent) to
    // avoid its internal timers while fake timers are active.
    act(() => {
      button.click();
    });
    expect(contentWrapper.className).toContain("overflow-hidden");

    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(contentWrapper.className).not.toContain("overflow-hidden");
  });
});

describe("BoxLayout - style/borderColor override rules", () => {
  it("style=INFO with default borderColor applies the INFO border/label classes", () => {
    const { container } = render(<BoxLayout label="Info Box" style="INFO" />);
    const root = container.firstChild as HTMLElement;
    expect(root.className).toContain("border-sky-300");
    const heading = screen.getByRole("heading");
    expect(heading.className).toContain("text-sky-900");
  });

  it("style=ERROR with default borderColor applies the ERROR border/label classes", () => {
    const { container } = render(<BoxLayout label="Error Box" style="ERROR" />);
    const root = container.firstChild as HTMLElement;
    expect(root.className).toContain("border-red-300");
    const heading = screen.getByRole("heading");
    expect(heading.className).toContain("text-red-900");
  });

  it("an explicit non-default borderColor alongside style=INFO is NOT overridden", () => {
    const { container } = render(
      <BoxLayout label="Info Box" style="INFO" borderColor="WARN" />
    );
    const root = container.firstChild as HTMLElement;
    expect(root.className).toContain("border-yellow-400");
    expect(root.className).not.toContain("border-sky-300");
  });
});

describe("BoxLayout - hex and palette color resolution", () => {
  it("resolves a hex style via inline background style and a contrast-computed label color", () => {
    const { container } = render(<BoxLayout label="Hex Box" style="#4B2E83" />);
    const root = container.firstChild as HTMLElement;
    const headerRow = root.firstElementChild as HTMLElement;
    expect(headerRow.style.backgroundColor).toBe("rgb(75, 46, 131)");
    const heading = screen.getByRole("heading");
    expect(heading.style.color).toBeTruthy();
  });

  it("resolves a hex borderColor via inline border style", () => {
    const { container } = render(<BoxLayout label="Hex Border" borderColor="#4B2E83" />);
    const root = container.firstChild as HTMLElement;
    expect(root.style.borderColor).toBe("rgb(75, 46, 131)");
  });

  it("resolves a palette token style via a resolved class, not the STANDARD default", () => {
    const { container } = render(<BoxLayout label="Palette Box" style="TEAL_700" />);
    const root = container.firstChild as HTMLElement;
    const headerRow = root.firstElementChild as HTMLElement;
    expect(headerRow.className).not.toContain("bg-gray-100");
    expect(headerRow.className).toMatch(/bg-/);
  });

  it("resolves a palette token borderColor via a resolved class, not the STANDARD default", () => {
    const { container } = render(<BoxLayout label="Palette Border" borderColor="TEAL_700" />);
    const root = container.firstChild as HTMLElement;
    expect(root.className).not.toContain("border-gray-300");
    expect(root.className).toMatch(/border-/);
  });
});

describe("BoxLayout - accessibilityText", () => {
  it("renders accessibilityText as additional sr-only text without altering the visible label", () => {
    const { container } = render(
      <BoxLayout label="Section" accessibilityText="Extra context for screen readers" />
    );
    expect(screen.getByText("Section")).toBeInTheDocument();
    const srOnly = container.querySelector(".sr-only");
    expect(srOnly?.textContent).toContain("Extra context for screen readers");
  });
});

describe("BoxLayout - i18n", () => {
  it("renders the English default expand/collapse sr-only text with no LocaleProvider", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <BoxLayout label="Section" isCollapsible={true} isInitiallyCollapsed={true}>
        <p>Body</p>
      </BoxLayout>
    );
    const srOnlySpans = Array.from(container.querySelectorAll(".sr-only"));
    expect(srOnlySpans.some((el) => el.textContent?.trim() === "Expand")).toBe(true);

    const button = screen.getByRole("button", { name: /section/i });
    await user.click(button);
    const srOnlySpansAfter = Array.from(container.querySelectorAll(".sr-only"));
    expect(srOnlySpansAfter.some((el) => el.textContent?.trim() === "Collapse")).toBe(true);
  });
});
