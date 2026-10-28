import { useState } from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, afterEach } from "vitest";
import { BreadcrumbsField, type BreadcrumbItem } from "./BreadcrumbsField";

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
    expect(container.querySelector("svg.lucide-chevron-left")).not.toBeNull();
    expect(container.querySelector("svg.lucide-chevron-right")).toBeNull();
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
