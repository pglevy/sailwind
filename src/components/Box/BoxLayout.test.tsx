import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, afterEach } from "vitest";
import { BoxLayout, type BoxLabelSize, type BoxShape } from "./BoxLayout";

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
  const cases: Array<[BoxLabelSize, number]> = [
    ["LARGE_PLUS", 1],
    ["LARGE", 1],
    ["MEDIUM_PLUS", 2],
    ["MEDIUM", 3],
    ["SMALL", 4],
    ["EXTRA_SMALL", 5],
  ];

  cases.forEach(([labelSize, level]) => {
    it(`labelSize="${labelSize}" defaults to an H${level} heading`, () => {
      render(<BoxLayout label="Title" labelSize={labelSize} />);
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

describe("BoxLayout - collapsed content has zero rendered height", () => {
  it("renders the content wrapper's direct grid child with min-h-0, not a nested descendant", () => {
    // min-h-0 must be the direct grid child of the grid-rows-[0fr] wrapper —
    // a grid item's default min-height:auto otherwise blocks the row from
    // shrinking below its content's intrinsic size, leaving a visible sliver
    // of cut-off text when collapsed (the bug this guards against).
    const { container } = render(
      <BoxLayout label="Section" isCollapsible={true} isInitiallyCollapsed={true}>
        <p>This content is collapsed by default. Click the header to expand it.</p>
      </BoxLayout>
    );
    const button = screen.getByRole("button", { name: /section/i });
    const contentId = button.getAttribute("aria-controls");
    const wrapper = container.querySelector(`#${contentId}`) as HTMLElement;
    const directChild = wrapper.firstElementChild as HTMLElement;
    expect(directChild.className.split(" ")).toContain("min-h-0");
  });

  it("does not render the collapsed text visibly (jsdom has no real layout, so this checks the grid-rows-[0fr] class and inert, which together settle to 0 height in a real browser)", () => {
    const { container } = render(
      <BoxLayout label="Section" isCollapsible={true} isInitiallyCollapsed={true}>
        <p>This content is collapsed by default. Click the header to expand it.</p>
      </BoxLayout>
    );
    const button = screen.getByRole("button", { name: /section/i });
    const contentId = button.getAttribute("aria-controls");
    const wrapper = container.querySelector(`#${contentId}`) as HTMLElement;
    expect(wrapper.className).toContain("grid-rows-[0fr]");
    expect(wrapper.hasAttribute("inert")).toBe(true);
  });
});

describe("BoxLayout - header corner radius matches outer shape", () => {
  const cases: Array<[BoxShape, string]> = [
    ["SQUARED", "rounded-t-none"],
    ["SEMI_ROUNDED", "rounded-t-sm"],
    ["ROUNDED", "rounded-t-md"],
  ];

  cases.forEach(([shape, expectedClass]) => {
    it(`shape="${shape}" gives the header row ${expectedClass}, matching the outer shape's radius`, () => {
      const { container } = render(<BoxLayout label="Section" shape={shape} />);
      const root = container.firstChild as HTMLElement;
      const header = root.firstElementChild as HTMLElement;
      expect(header.className).toContain(expectedClass);
    });
  });

  it("does not rely on overflow-hidden on the outer container (would clip content that must render outside the box, e.g. an open dropdown menu)", () => {
    const { container } = render(<BoxLayout label="Section" shape="ROUNDED" />);
    const root = container.firstChild as HTMLElement;
    expect(root.className.split(" ")).not.toContain("overflow-hidden");
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
    expect(root.className).toContain("border-sky-200");
    const heading = screen.getByRole("heading");
    expect(heading.className).toContain("text-sky-900");
  });

  it("style=ERROR with default borderColor applies the ERROR border/label classes", () => {
    const { container } = render(<BoxLayout label="Error Box" style="ERROR" />);
    const root = container.firstChild as HTMLElement;
    expect(root.className).toContain("border-red-200");
    const heading = screen.getByRole("heading");
    expect(heading.className).toContain("text-red-900");
  });

  it.each([
    ["ACCENT", "border-blue-200"],
    ["SUCCESS", "border-green-200"],
    ["WARN", "border-yellow-400"],
  ] as const)("style=%s with default borderColor applies %s", (style, borderClass) => {
    const { container } = render(<BoxLayout label="Styled Box" style={style} />);
    const root = container.firstChild as HTMLElement;
    expect(root.className).toContain(borderClass);
    expect(root.className).not.toContain("border-gray-300");
  });

  it("a hex style keeps the STANDARD border", () => {
    const { container } = render(<BoxLayout label="Hex Box" style="#4B2E83" />);
    const root = container.firstChild as HTMLElement;
    expect(root.className).toContain("border-gray-300");
  });

  it("an explicit non-default borderColor alongside style=INFO is NOT overridden", () => {
    const { container } = render(
      <BoxLayout label="Info Box" style="INFO" borderColor="WARN" />
    );
    const root = container.firstChild as HTMLElement;
    expect(root.className).toContain("border-yellow-400");
    expect(root.className).not.toContain("border-sky-200");
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

describe("BoxLayout - toggle accessible name", () => {
  it("names the button and heading with the label only, and keeps that name stable across toggles", async () => {
    const user = userEvent.setup();
    render(
      <BoxLayout label="Section" isCollapsible={true} isInitiallyCollapsed={true}>
        <p>Body</p>
      </BoxLayout>
    );
    const button = screen.getByRole("button", { name: "Section" });
    expect(button).toHaveAttribute("aria-expanded", "false");
    expect(screen.getByRole("heading", { name: "Section" })).toBeInTheDocument();

    await user.click(button);
    expect(screen.getByRole("button", { name: "Section" })).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("heading", { name: "Section" })).toBeInTheDocument();
    expect(screen.queryByText("Expand")).not.toBeInTheDocument();
    expect(screen.queryByText("Collapse")).not.toBeInTheDocument();
  });

  it("with no label, renders the toggle without a heading and names it with fixed default text", async () => {
    const user = userEvent.setup();
    render(
      <BoxLayout isCollapsible={true} isInitiallyCollapsed={true}>
        <p>Body</p>
      </BoxLayout>
    );
    expect(screen.queryByRole("heading")).not.toBeInTheDocument();
    const button = screen.getByRole("button", { name: "Show or hide content" });
    expect(button).toHaveAttribute("aria-expanded", "false");

    await user.click(button);
    expect(screen.getByRole("button", { name: "Show or hide content" })).toHaveAttribute("aria-expanded", "true");
  });

  it("with no label, uses accessibilityText as the toggle button's name", () => {
    render(
      <BoxLayout isCollapsible={true} accessibilityText="Billing details">
        <p>Body</p>
      </BoxLayout>
    );
    expect(screen.getByRole("button")).toHaveAccessibleName("Billing details");
  });

  it("with a label, appends accessibilityText to the button and heading name, and keeps it stable across toggles", async () => {
    const user = userEvent.setup();
    render(
      <BoxLayout label="Section" isCollapsible={true} accessibilityText="Extra context">
        <p>Body</p>
      </BoxLayout>
    );
    // jsdom's name computation (dom-accessibility-api) trims each child
    // element's text, so it drops the sr-only span's leading space and
    // reports "SectionExtra context". Real browsers keep the space; the
    // textContent check below proves it's in the DOM.
    const name = /^Section ?Extra context$/;
    const button = screen.getByRole("button", { name });
    expect(button.textContent).toBe("Section Extra context");
    expect(button).toHaveAttribute("aria-expanded", "true");
    expect(button).not.toHaveAttribute("aria-describedby");
    expect(button).not.toHaveAccessibleDescription();

    const heading = screen.getByRole("heading", { name });
    expect(heading.querySelector(".sr-only")?.textContent).toContain("Extra context");
    expect(screen.getByText("Section")).toBeVisible();

    await user.click(button);
    expect(screen.getByRole("button", { name })).toHaveAttribute("aria-expanded", "false");
    expect(screen.getByRole("heading", { name })).toBeInTheDocument();
  });
});

describe("BoxLayout - collapsed header corner radius", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("gives a settled-collapsed header full rounding so its bottom corners match the outer shape", () => {
    const { container } = render(
      <BoxLayout label="Section" shape="ROUNDED" isCollapsible={true} isInitiallyCollapsed={true}>
        <p>Body</p>
      </BoxLayout>
    );
    const header = (container.firstChild as HTMLElement).firstElementChild as HTMLElement;
    expect(header.className.split(" ")).toContain("rounded-md");
    expect(header.className.split(" ")).not.toContain("rounded-t-md");
  });

  it("keeps full rounding with showBorder=false and showShadow", () => {
    const { container } = render(
      <BoxLayout
        label="Section"
        shape="ROUNDED"
        showBorder={false}
        showShadow={true}
        isCollapsible={true}
        isInitiallyCollapsed={true}
      >
        <p>Body</p>
      </BoxLayout>
    );
    const header = (container.firstChild as HTMLElement).firstElementChild as HTMLElement;
    expect(header.className.split(" ")).toContain("rounded-md");
  });

  it("waits for the close transition to end before switching to full rounding, and drops it immediately on open", () => {
    vi.useFakeTimers();
    const { container } = render(
      <BoxLayout label="Section" shape="ROUNDED" isCollapsible={true}>
        <p>Body</p>
      </BoxLayout>
    );
    const header = (container.firstChild as HTMLElement).firstElementChild as HTMLElement;
    const button = screen.getByRole("button", { name: "Section" });
    expect(header.className.split(" ")).toContain("rounded-t-md");

    // Fire the click directly (not via userEvent) to avoid its internal
    // timers while fake timers are active.
    act(() => {
      button.click();
    });
    expect(header.className.split(" ")).toContain("rounded-t-md");

    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(header.className.split(" ")).toContain("rounded-md");
    expect(header.className.split(" ")).not.toContain("rounded-t-md");

    act(() => {
      button.click();
    });
    expect(header.className.split(" ")).toContain("rounded-t-md");
    expect(header.className.split(" ")).not.toContain("rounded-md");
  });
});

describe("BoxLayout - emits no empty or undefined class tokens", () => {
  const shapes = ["SQUARED", "SEMI_ROUNDED", "ROUNDED"] as const;
  const states: Array<[string, { isCollapsible?: boolean; isInitiallyCollapsed?: boolean }]> = [
    ["collapsible, open", { isCollapsible: true }],
    ["collapsible, settled closed", { isCollapsible: true, isInitiallyCollapsed: true }],
    ["not collapsible", {}],
  ];
  const cases = shapes.flatMap((shape) =>
    states.map(([state, props]) => ({ shape, state, props }))
  );

  it.each(cases)("shape=$shape, $state: no element gets an \"undefined\" or empty class token", ({ shape, props }) => {
    const { container } = render(
      <BoxLayout label="Section" shape={shape} {...props}>
        <p>Body</p>
      </BoxLayout>
    );
    // getAttribute, not className: the chevron is an SVG, whose className
    // is an SVGAnimatedString object rather than a string.
    const classAttrs = Array.from(container.querySelectorAll("[class]")).map(
      (el) => el.getAttribute("class") ?? ""
    );
    for (const cls of classAttrs) {
      const tokens = cls.split(" ");
      expect(tokens).not.toContain("undefined");
      // Array.join turns an unfiltered undefined entry into "", which shows
      // up as a trailing or doubled space, i.e. an empty token.
      expect(tokens).not.toContain("");
    }
  });
});

describe("BoxLayout - height in stretching parents", () => {
  it("adds h-fit to a collapsible box (open), so a grid or flex row can't stretch it", () => {
    const { container } = render(
      <BoxLayout label="Section" isCollapsible={true}>
        <p>Body</p>
      </BoxLayout>
    );
    expect((container.firstChild as HTMLElement).className.split(" ")).toContain("h-fit");
  });

  it("adds h-fit to a collapsible box that starts collapsed", () => {
    const { container } = render(
      <BoxLayout label="Section" isCollapsible={true} isInitiallyCollapsed={true}>
        <p>Body</p>
      </BoxLayout>
    );
    expect((container.firstChild as HTMLElement).className.split(" ")).toContain("h-fit");
  });

  it("leaves a non-collapsible box at the default stretch, like CardLayout", () => {
    const { container } = render(<BoxLayout label="Section">Body</BoxLayout>);
    expect((container.firstChild as HTMLElement).className.split(" ")).not.toContain("h-fit");
  });
});

describe("BoxLayout - header click target", () => {
  it("puts the header padding on the toggle button, not the row, when collapsible", () => {
    const { container } = render(
      <BoxLayout label="Section" isCollapsible={true}>
        <p>Body</p>
      </BoxLayout>
    );
    const header = (container.firstChild as HTMLElement).firstElementChild as HTMLElement;
    const headerClasses = header.className.split(" ");
    expect(headerClasses).not.toContain("px-3");
    expect(headerClasses).not.toContain("py-2");

    const buttonClasses = screen.getByRole("button", { name: "Section" }).className.split(" ");
    expect(buttonClasses).toEqual(
      expect.arrayContaining(["px-3", "py-2", "w-full", "text-start", "focus-visible:ring-inset"])
    );
  });

  it("keeps the header padding on the row when not collapsible", () => {
    const { container } = render(<BoxLayout label="Section">Body</BoxLayout>);
    const header = (container.firstChild as HTMLElement).firstElementChild as HTMLElement;
    expect(header.className.split(" ")).toEqual(expect.arrayContaining(["px-3", "py-2"]));
  });
});
