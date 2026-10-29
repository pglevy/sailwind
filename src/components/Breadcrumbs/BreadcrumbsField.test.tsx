import { useState } from "react";
import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";
import { BreadcrumbsField, type BreadcrumbItem } from "./BreadcrumbsField";
import { LocaleProvider } from "../../i18n";

// No right-to-left locale ships yet (LocaleProvider falls back to en-us), so
// the reading direction is mocked to exercise the RTL branch.
const localeState = vi.hoisted(() => ({ direction: "LTR" as "LTR" | "RTL" }));
vi.mock("../../i18n", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../../i18n")>();
  return {
    ...actual,
    useLocale: () => ({ locale: "en-us", direction: localeState.direction }),
  };
});

afterEach(() => {
  localeState.direction = "LTR";
});

const trail = [
  { text: "Home", link: "/home" },
  { text: "Documents", link: "/documents" },
  { text: "Travel Policy" },
];

// Separators are aria-hidden, so query them directly from the DOM
const getSeparators = (container: HTMLElement) =>
  container.querySelectorAll('li > [aria-hidden="true"]');

describe("BreadcrumbsField - structure and accessibility", () => {
  it("renders a navigation landmark named 'Breadcrumbs' by default", () => {
    render(<BreadcrumbsField items={trail} />);
    expect(screen.getByRole("navigation", { name: "Breadcrumbs" })).toBeInTheDocument();
  });

  it("uses accessibilityText as the navigation name when provided", () => {
    render(<BreadcrumbsField items={trail} accessibilityText="Folder path" />);
    expect(screen.getByRole("navigation", { name: "Folder path" })).toBeInTheDocument();
  });

  it("merges className onto the navigation root alongside the margin classes", () => {
    render(<BreadcrumbsField items={trail} className="custom-class mb-10" />);
    const nav = screen.getByRole("navigation");
    expect(nav).toHaveClass("custom-class");
    // mergeClasses lets the override win over the default marginBelow (mb-4)
    expect(nav).toHaveClass("mb-10");
    expect(nav).not.toHaveClass("mb-4");
  });

  it("resolves the default label through LocaleProvider", () => {
    // The Spanish bundle has no breadcrumbs.label entry yet, so an "es" locale
    // falls back to the English default rather than a translation.
    render(
      <LocaleProvider locale="es">
        <BreadcrumbsField items={trail} />
      </LocaleProvider>
    );
    expect(screen.getByRole("navigation", { name: "Breadcrumbs" })).toBeInTheDocument();
  });

  it("prefers accessibilityText over the localized label", () => {
    render(
      <LocaleProvider locale="es">
        <BreadcrumbsField items={trail} accessibilityText="Ruta de carpetas" />
      </LocaleProvider>
    );
    expect(screen.getByRole("navigation", { name: "Ruta de carpetas" })).toBeInTheDocument();
  });

  it("renders an ordered list with one item per level", () => {
    render(<BreadcrumbsField items={trail} />);
    const list = screen.getByRole("list");
    expect(list.tagName).toBe("OL");
    // getByRole("list") also matches without the attribute in jsdom, so check it directly
    expect(list).toHaveAttribute("role", "list");
    expect(within(list).getAllByRole("listitem")).toHaveLength(3);
  });

  it("marks the last item as the current page and does not make it a link", () => {
    render(
      <BreadcrumbsField
        items={[{ text: "Home", link: "/home" }, { text: "Current", link: "/current" }]}
      />
    );
    const current = screen.getByText("Current");
    expect(current).toHaveAttribute("aria-current", "page");
    expect(current.closest("a")).toBeNull();
    expect(screen.getAllByRole("link")).toHaveLength(1);
  });

  it("only sets aria-current on the last item", () => {
    const { container } = render(<BreadcrumbsField items={trail} />);
    expect(container.querySelectorAll('[aria-current]')).toHaveLength(1);
  });
});

describe("BreadcrumbsField - links", () => {
  it("renders string links as anchors with that href", () => {
    render(<BreadcrumbsField items={trail} />);
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("href", "/home");
    expect(screen.getByRole("link", { name: "Documents" })).toHaveAttribute("href", "/documents");
  });

  it("calls function links on click", async () => {
    const onHome = vi.fn();
    render(<BreadcrumbsField items={[{ text: "Home", link: onHome }, { text: "Current" }]} />);
    await userEvent.click(screen.getByRole("link", { name: "Home" }));
    expect(onHome).toHaveBeenCalledTimes(1);
  });

  it("calls function links from the keyboard", async () => {
    const onHome = vi.fn();
    render(<BreadcrumbsField items={[{ text: "Home", link: onHome }, { text: "Current" }]} />);
    await userEvent.tab();
    expect(screen.getByRole("link", { name: "Home" })).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    expect(onHome).toHaveBeenCalledTimes(1);
  });

  it("ignores Cmd/Ctrl/Shift/Alt-click on function links so the browser handles them", () => {
    const onHome = vi.fn();
    render(<BreadcrumbsField items={[{ text: "Home", link: onHome }, { text: "Current" }]} />);
    const home = screen.getByRole("link", { name: "Home" });
    for (const modifier of ["metaKey", "ctrlKey", "shiftKey", "altKey"] as const) {
      // fireEvent returns false when preventDefault was called
      expect(fireEvent.click(home, { [modifier]: true })).toBe(true);
    }
    expect(onHome).not.toHaveBeenCalled();
  });

  it("ignores middle-click on function links", () => {
    const onHome = vi.fn();
    render(<BreadcrumbsField items={[{ text: "Home", link: onHome }, { text: "Current" }]} />);
    expect(fireEvent.click(screen.getByRole("link", { name: "Home" }), { button: 1 })).toBe(true);
    expect(onHome).not.toHaveBeenCalled();
  });

  it("prevents default and calls the function on a plain primary click", () => {
    const onHome = vi.fn();
    render(<BreadcrumbsField items={[{ text: "Home", link: onHome }, { text: "Current" }]} />);
    expect(fireEvent.click(screen.getByRole("link", { name: "Home" }))).toBe(false);
    expect(onHome).toHaveBeenCalledTimes(1);
  });

  it("does not queue a focus handoff when a modified click is ignored", () => {
    // The parent shrinks items only when the function runs; a modified click must
    // not leave a pending key that a later unrelated render could act on.
    const folders = ["Home", "Docs", "Now"];
    const Nav = () => {
      const [depth, setDepth] = useState(folders.length);
      const items = folders.slice(0, depth).map((text, i) => ({ text, link: () => setDepth(i + 1) }));
      return <BreadcrumbsField items={items} />;
    };
    render(<Nav />);
    fireEvent.click(screen.getByRole("link", { name: "Docs" }), { ctrlKey: true });
    expect(screen.getByRole("link", { name: "Docs" })).toBeInTheDocument();
    expect(document.body).toHaveFocus();
  });

  it("renders an empty-string link as plain text, not an anchor", () => {
    render(<BreadcrumbsField items={[{ text: "Archive", link: "" }, { text: "Current" }]} />);
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
    expect(screen.getByText("Archive")).not.toHaveAttribute("aria-current");
  });

  it("renders ancestors without a link as plain text", () => {
    render(<BreadcrumbsField items={[{ text: "Archive" }, { text: "Current" }]} />);
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
    expect(screen.getByText("Archive")).not.toHaveAttribute("aria-current");
  });
});

describe("BreadcrumbsField - separators", () => {
  it("renders a hidden slash between items by default", () => {
    const { container } = render(<BreadcrumbsField items={trail} />);
    const separators = getSeparators(container);
    expect(separators).toHaveLength(2);
    separators.forEach(separator => expect(separator).toHaveTextContent("/"));
  });

  it("renders chevron icons when separator is CHEVRON", () => {
    const { container } = render(<BreadcrumbsField items={trail} separator="CHEVRON" />);
    const separators = getSeparators(container);
    expect(separators).toHaveLength(2);
    separators.forEach(separator => {
      expect(separator.querySelector("svg")).not.toBeNull();
      expect(separator).not.toHaveTextContent("/");
    });
  });

  it("renders no separator for a single item", () => {
    const { container } = render(<BreadcrumbsField items={[{ text: "Home" }]} />);
    expect(getSeparators(container)).toHaveLength(0);
  });

  it("points the chevron left and sets dir in right-to-left locales", () => {
    localeState.direction = "RTL";
    const { container } = render(<BreadcrumbsField items={trail} separator="CHEVRON" />);
    expect(screen.getByRole("navigation")).toHaveAttribute("dir", "rtl");
    const separators = getSeparators(container);
    expect(separators).toHaveLength(2);
    separators.forEach(separator => expect(separator).toHaveAttribute("data-separator-direction", "left"));
  });

  it("points the chevron right in left-to-right locales", () => {
    const { container } = render(<BreadcrumbsField items={trail} separator="CHEVRON" />);
    getSeparators(container).forEach(separator =>
      expect(separator).toHaveAttribute("data-separator-direction", "right")
    );
  });

  it("does not set a chevron direction on slash separators", () => {
    const { container } = render(<BreadcrumbsField items={trail} />);
    getSeparators(container).forEach(separator =>
      expect(separator).not.toHaveAttribute("data-separator-direction")
    );
  });

  it("does not set dir in left-to-right locales", () => {
    render(<BreadcrumbsField items={trail} />);
    expect(screen.getByRole("navigation")).not.toHaveAttribute("dir");
  });
});

describe("BreadcrumbsField - visibility", () => {
  it("returns null when showWhen is false", () => {
    const { container } = render(<BreadcrumbsField items={trail} showWhen={false} />);
    expect(container.innerHTML).toBe("");
  });

  it("returns null when there are no visible items", () => {
    const { container } = render(<BreadcrumbsField items={[]} />);
    expect(container.innerHTML).toBe("");
  });

  it("skips items with showWhen=false or empty text", () => {
    render(
      <BreadcrumbsField
        items={[
          { text: "Home", link: "/home" },
          { text: "Hidden", link: "/hidden", showWhen: false },
          { text: "" },
          { text: "Current" },
        ]}
      />
    );
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
    expect(screen.queryByText("Hidden")).not.toBeInTheDocument();
  });

  it("hides whitespace-only text without leaving a stray separator", () => {
    const { container } = render(
      <BreadcrumbsField items={[{ text: "Home", link: "/home" }, { text: "   " }, { text: "Current" }]} />
    );
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
    expect(getSeparators(container)).toHaveLength(1);
  });

  it("makes the previous item the current page when the last item has whitespace-only text", () => {
    const { container } = render(
      <BreadcrumbsField items={[{ text: "Home", link: "/home" }, { text: "Docs", link: "/docs" }, { text: " \t " }]} />
    );
    expect(screen.getByText("Docs")).toHaveAttribute("aria-current", "page");
    expect(screen.queryByRole("link", { name: "Docs" })).not.toBeInTheDocument();
    expect(getSeparators(container)).toHaveLength(1);
  });

  it("treats the last visible item as the current page when the last item is hidden", () => {
    render(
      <BreadcrumbsField
        items={[
          { text: "Home", link: "/home" },
          { text: "Documents", link: "/documents" },
          { text: "Hidden", showWhen: false },
        ]}
      />
    );
    expect(screen.getByText("Documents")).toHaveAttribute("aria-current", "page");
    expect(screen.queryByRole("link", { name: "Documents" })).not.toBeInTheDocument();
  });
});

describe("BreadcrumbsField - margins", () => {
  it("applies the default margin below", () => {
    render(<BreadcrumbsField items={trail} />);
    expect(screen.getByRole("navigation")).toHaveClass("mb-4");
  });

  it("applies marginAbove and marginBelow", () => {
    render(<BreadcrumbsField items={trail} marginAbove="MORE" marginBelow="NONE" />);
    const nav = screen.getByRole("navigation");
    expect(nav).toHaveClass("mt-6");
    expect(nav).not.toHaveClass("mb-4");
  });
});

describe("BreadcrumbsField - focus management", () => {
  const folders = ["Home", "Documents", "Policies", "Travel Policy"];

  // Mirrors the InteractiveNavigation story: activating a crumb shrinks the trail
  const Navigation = () => {
    const [depth, setDepth] = useState(folders.length);
    const items: BreadcrumbItem[] = folders.slice(0, depth).map((text, index) => ({
      text,
      link: () => setDepth(index + 1),
    }));
    return (
      <>
        <BreadcrumbsField items={items} />
        <button onClick={() => setDepth(folders.length)}>Reset</button>
      </>
    );
  };

  it("does not move focus on mount", () => {
    render(<Navigation />);
    expect(document.body).toHaveFocus();
  });

  it("makes the current page programmatically focusable but not a tab stop", () => {
    render(<Navigation />);
    expect(screen.getByText("Travel Policy")).toHaveAttribute("tabindex", "-1");
  });

  it("moves focus to the new current page after a middle crumb is activated by keyboard", async () => {
    const user = userEvent.setup();
    render(<Navigation />);
    await user.tab();
    await user.tab();
    expect(screen.getByRole("link", { name: "Documents" })).toHaveFocus();
    await user.keyboard("{Enter}");
    const current = screen.getByText("Documents");
    expect(current).toHaveAttribute("aria-current", "page");
    expect(current).toHaveFocus();
    expect(document.activeElement).not.toBe(document.body);
  });

  it("moves focus to the new current page after a mouse click", async () => {
    const user = userEvent.setup();
    render(<Navigation />);
    await user.click(screen.getByRole("link", { name: "Policies" }));
    expect(screen.getByText("Policies")).toHaveFocus();
  });

  it("does not make the current page a tab stop", async () => {
    const user = userEvent.setup();
    render(<Navigation />);
    await user.click(screen.getByRole("link", { name: "Policies" }));
    await user.tab();
    expect(screen.getByRole("button", { name: "Reset" })).toHaveFocus();
  });

  it("does not steal focus on unrelated re-renders", async () => {
    const user = userEvent.setup();
    render(<Navigation />);
    await user.click(screen.getByRole("link", { name: "Policies" }));
    const reset = screen.getByRole("button", { name: "Reset" });
    reset.focus();
    await user.click(reset);
    expect(reset).toHaveFocus();
  });

  it("does not steal focus when a link does not make its item current", async () => {
    const user = userEvent.setup();
    const onHome = vi.fn();
    const { rerender } = render(
      <BreadcrumbsField items={[{ text: "Home", link: onHome }, { text: "Docs" }]} />
    );
    await user.click(screen.getByRole("link", { name: "Home" }));
    expect(onHome).toHaveBeenCalledTimes(1);
    rerender(<BreadcrumbsField items={[{ text: "Home", link: onHome }, { text: "Docs" }]} accessibilityText="Path" />);
    expect(screen.getByRole("link", { name: "Home" })).toHaveFocus();
  });

  it("leaves string links as normal anchors with no focus management", async () => {
    const user = userEvent.setup();
    render(<BreadcrumbsField items={trail} />);
    await user.tab();
    expect(screen.getByRole("link", { name: "Home" })).toHaveFocus();
    expect(screen.getByText("Travel Policy")).not.toHaveFocus();
  });

  it("keeps earlier items mounted when later ones are hidden", () => {
    const items = [{ text: "Home", link: "/home" }, { text: "Docs", link: "/docs" }, { text: "Now" }];
    const { rerender } = render(<BreadcrumbsField items={items} />);
    const homeItem = screen.getByRole("link", { name: "Home" });
    rerender(<BreadcrumbsField items={items.slice(0, 2)} />);
    expect(screen.getByRole("link", { name: "Home" })).toBe(homeItem);
  });

  it("renders repeated crumb text without key collisions", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    render(<BreadcrumbsField items={[{ text: "Files" }, { text: "Files" }, { text: "Files" }]} />);
    expect(screen.getAllByRole("listitem")).toHaveLength(3);
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });
});

describe("BreadcrumbsField - truncation", () => {
  // jsdom has no layout, so widths are mocked: the <ol> reports containerWidth and every other
  // element reports 10px per character of its text. With a slash separator the fixture's <li> widths
  // are Home 50, Shared 70, Ops 40, Contracts 100, Renewals 90, Current 70 (total 420, separator 10).
  // The "…" <li> (text "…/") is 20 wide.
  let containerWidth = 500;
  const observerCallbacks: Array<() => void> = [];
  const disconnect = vi.fn();

  beforeEach(() => {
    vi.stubGlobal(
      "ResizeObserver",
      class {
        private callback: () => void;
        constructor(callback: () => void) {
          this.callback = callback;
        }
        observe() {
          observerCallbacks.push(this.callback);
        }
        unobserve() {}
        disconnect = disconnect;
      }
    );
    vi.spyOn(Element.prototype, "getBoundingClientRect").mockImplementation(function (this: Element) {
      const width = this.tagName === "OL" ? containerWidth : (this.textContent ?? "").length * 10;
      return {
        width, height: 20, top: 0, left: 0, right: width, bottom: 20, x: 0, y: 0, toJSON() {},
      } as DOMRect;
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    observerCallbacks.length = 0;
    disconnect.mockClear();
    containerWidth = 500;
  });

  const resizeTo = (width: number) =>
    act(() => {
      containerWidth = width;
      observerCallbacks.forEach(callback => callback());
    });

  const names = ["Home", "Shared", "Ops", "Contracts", "Renewals"];
  const longTrail: BreadcrumbItem[] = [
    ...names.map(text => ({ text, link: `#${text.toLowerCase()}` })),
    { text: "Current" },
  ];
  const showHidden = () => screen.queryByRole("button", { name: "Show hidden levels" });
  const linkNames = () => screen.queryAllByRole("link").map(link => link.textContent);

  it("shows the full trail with no ellipsis when it fits", () => {
    for (const width of [500, 421]) {
      containerWidth = width;
      const { unmount } = render(<BreadcrumbsField items={longTrail} />);
      expect(showHidden()).not.toBeInTheDocument();
      expect(linkNames()).toEqual(names);
      unmount();
    }
  });

  it("collapses as soon as the trail is one pixel too wide", () => {
    containerWidth = 420;
    render(<BreadcrumbsField items={longTrail} />);
    expect(showHidden()).toBeInTheDocument();
  });

  it("keeps the root, the nearest levels that fit, and the current page", () => {
    containerWidth = 335;
    const { container } = render(<BreadcrumbsField items={longTrail} />);
    expect(linkNames()).toEqual(["Home", "Contracts", "Renewals"]);
    expect(showHidden()).toBeInTheDocument();
    // Hidden levels are not in the DOM, so they are neither tab stops nor screen reader text
    expect(screen.queryByText("Shared")).not.toBeInTheDocument();
    expect(screen.queryByText("Ops")).not.toBeInTheDocument();
    expect(container.querySelectorAll('[aria-current]')).toHaveLength(1);
    expect(screen.getByText("Current")).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("list")).toHaveClass("flex-nowrap");
    // Every item but the last has a hidden separator, including the one holding the "…"
    const items = container.querySelectorAll("li");
    expect(items).toHaveLength(5);
    items.forEach((item, index) => {
      const separator = item.querySelector(':scope > [aria-hidden="true"]');
      if (index < items.length - 1) expect(separator).not.toBeNull();
      else expect(separator).toBeNull();
    });
  });

  it("renders the ellipsis as a button with a localized accessible name", () => {
    containerWidth = 335;
    render(<BreadcrumbsField items={longTrail} />);
    const button = screen.getByRole("button", { name: "Show hidden levels" });
    expect(button).toHaveAttribute("type", "button");
    expect(button).toHaveClass("focus-visible:ring-2");
    expect(button).not.toHaveAttribute("tabindex");
    expect(button.querySelector('[aria-hidden="true"]')).toHaveTextContent("…");
  });

  it("falls back to the English button name in other locales and ignores accessibilityText", () => {
    containerWidth = 335;
    render(
      <LocaleProvider locale="es">
        <BreadcrumbsField items={longTrail} accessibilityText="Ruta" />
      </LocaleProvider>
    );
    expect(screen.getByRole("button", { name: "Show hidden levels" })).toBeInTheDocument();
  });

  it("keeps root, ellipsis and current page when nothing else fits, and truncates the current page", () => {
    containerWidth = 120;
    render(<BreadcrumbsField items={longTrail} />);
    expect(linkNames()).toEqual(["Home"]);
    expect(showHidden()).toBeInTheDocument();
    const current = screen.getByText("Current");
    expect(current).toHaveClass("truncate");
    expect(current).not.toHaveAttribute("title");
  });

  it("never collapses fewer than three levels", () => {
    containerWidth = 10;
    render(<BreadcrumbsField items={[{ text: "Alpha", link: "#a" }, { text: "Beta" }]} />);
    expect(showHidden()).not.toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
  });

  it("never collapses a single level", () => {
    containerWidth = 10;
    render(<BreadcrumbsField items={[{ text: "Home" }]} />);
    expect(showHidden()).not.toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(1);
  });

  it("reveals every level on click, wraps, and focuses the first revealed level", async () => {
    const user = userEvent.setup();
    containerWidth = 335;
    render(<BreadcrumbsField items={longTrail} />);
    await user.click(screen.getByRole("button", { name: "Show hidden levels" }));
    expect(showHidden()).not.toBeInTheDocument();
    expect(linkNames()).toEqual(names);
    expect(screen.getByRole("list")).toHaveClass("flex-wrap");
    expect(screen.getByRole("link", { name: "Shared" })).toHaveFocus();
  });

  it("focuses a plain-text first revealed level", async () => {
    const user = userEvent.setup();
    containerWidth = 335;
    const items = longTrail.map((item, index) => (index === 1 ? { text: item.text } : item));
    render(<BreadcrumbsField items={items} />);
    await user.click(screen.getByRole("button", { name: "Show hidden levels" }));
    const revealed = screen.getByText("Shared");
    expect(revealed).toHaveAttribute("tabindex", "-1");
    expect(revealed).toHaveFocus();
  });

  it("can be operated from the keyboard", async () => {
    const user = userEvent.setup();
    containerWidth = 335;
    render(<BreadcrumbsField items={longTrail} />);
    await user.tab();
    expect(screen.getByRole("link", { name: "Home" })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole("button", { name: "Show hidden levels" })).toHaveFocus();
    await user.keyboard("{Enter}");
    expect(screen.getByRole("link", { name: "Shared" })).toHaveFocus();
  });

  it("stays expanded while the container narrows, and collapses again after it has fit", async () => {
    const user = userEvent.setup();
    containerWidth = 335;
    render(<BreadcrumbsField items={longTrail} />);
    await user.click(screen.getByRole("button", { name: "Show hidden levels" }));
    resizeTo(120);
    expect(showHidden()).not.toBeInTheDocument();
    expect(linkNames()).toEqual(names);
    resizeTo(500);
    expect(linkNames()).toEqual(names);
    resizeTo(335);
    expect(showHidden()).toBeInTheDocument();
    expect(linkNames()).toEqual(["Home", "Contracts", "Renewals"]);
  });

  it("resets the expansion and collapses again when the levels change", async () => {
    const user = userEvent.setup();
    containerWidth = 335;
    const { rerender } = render(<BreadcrumbsField items={longTrail} />);
    await user.click(screen.getByRole("button", { name: "Show hidden levels" }));
    expect(showHidden()).not.toBeInTheDocument();
    rerender(
      <BreadcrumbsField items={longTrail.map(item => (item.text === "Shared" ? { ...item, text: "Shared Drives" } : item))} />
    );
    expect(showHidden()).toBeInTheDocument();
    expect(screen.queryByText("Shared Drives")).not.toBeInTheDocument();
  });

  it("re-evaluates when the container is resized", () => {
    render(<BreadcrumbsField items={longTrail} />);
    expect(showHidden()).not.toBeInTheDocument();
    resizeTo(335);
    expect(linkNames()).toEqual(["Home", "Contracts", "Renewals"]);
    resizeTo(500);
    expect(showHidden()).not.toBeInTheDocument();
    expect(linkNames()).toEqual(names);
  });

  it("shows the full trail while the container has no width, then measures once it does", () => {
    containerWidth = 0;
    render(<BreadcrumbsField items={longTrail} />);
    expect(showHidden()).not.toBeInTheDocument();
    expect(linkNames()).toEqual(names);
    resizeTo(335);
    expect(showHidden()).toBeInTheDocument();
  });

  it("attaches the resize observer when the trail first becomes visible", () => {
    const { rerender } = render(<BreadcrumbsField items={longTrail} showWhen={false} />);
    expect(observerCallbacks).toHaveLength(0);
    rerender(<BreadcrumbsField items={longTrail} />);
    expect(observerCallbacks).toHaveLength(1);
    resizeTo(335);
    expect(showHidden()).toBeInTheDocument();
  });

  it("moves focus to the ellipsis when a resize collapses the focused level", () => {
    render(<BreadcrumbsField items={longTrail} />);
    screen.getByRole("link", { name: "Contracts" }).focus();
    resizeTo(120);
    expect(screen.getByRole("button", { name: "Show hidden levels" })).toHaveFocus();
  });

  it("does not move focus when a resize collapses levels that are not focused", () => {
    render(<BreadcrumbsField items={longTrail} />);
    screen.getByRole("link", { name: "Home" }).focus();
    resizeTo(120);
    expect(screen.getByRole("link", { name: "Home" })).toHaveFocus();
  });

  it("hands focus to the new current page when a collapsed level is activated", async () => {
    const user = userEvent.setup();
    containerWidth = 335;
    const Nav = () => {
      const [depth, setDepth] = useState(longTrail.length);
      const items = longTrail.slice(0, depth).map((item, index) => ({
        text: item.text,
        link: () => setDepth(index + 1),
      }));
      return <BreadcrumbsField items={items} />;
    };
    render(<Nav />);
    expect(document.body).toHaveFocus();
    await user.click(screen.getByRole("link", { name: "Renewals" }));
    const current = screen.getByText("Renewals");
    expect(current).toHaveAttribute("aria-current", "page");
    expect(current).toHaveFocus();
  });

  it("keeps the chevron direction on every separator, including the one beside the ellipsis", () => {
    localeState.direction = "RTL";
    containerWidth = 300;
    const { container } = render(<BreadcrumbsField items={longTrail} separator="CHEVRON" />);
    expect(showHidden()).toBeInTheDocument();
    const separators = getSeparators(container);
    expect(separators).toHaveLength(4);
    separators.forEach(separator => expect(separator).toHaveAttribute("data-separator-direction", "left"));
  });

  it("still evaluates on mount, without later resize updates, when ResizeObserver is unavailable", () => {
    vi.stubGlobal("ResizeObserver", undefined);
    containerWidth = 335;
    render(<BreadcrumbsField items={longTrail} />);
    expect(showHidden()).toBeInTheDocument();
    resizeTo(500);
    expect(showHidden()).toBeInTheDocument();
  });

  it("disconnects the resize observer on unmount", () => {
    const { unmount } = render(<BreadcrumbsField items={longTrail} />);
    expect(disconnect).not.toHaveBeenCalled();
    unmount();
    expect(disconnect).toHaveBeenCalled();
  });

  it("renders every level and no ellipsis on the server", () => {
    const html = renderToString(<BreadcrumbsField items={longTrail} />);
    for (const { text } of longTrail) expect(html).toContain(text);
    expect(html).not.toContain("Show hidden levels");
  });
});
