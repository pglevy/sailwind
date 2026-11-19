import { useState } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderToString } from "react-dom/server";
import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";
import { SearchField, type SearchFieldProps } from "./SearchField";
import { LocaleProvider } from "../../i18n";

afterEach(() => {
  vi.restoreAllMocks();
});

// Holds the text in state, like a prototype would
function Controlled(props: SearchFieldProps) {
  const [value, setValue] = useState(props.value ?? "");
  return (
    <SearchField
      {...props}
      value={value}
      onChange={(next) => {
        setValue(next);
        props.onChange?.(next);
      }}
    />
  );
}

// The clear-search pattern: the end icon only exists while there is text
function ClearableSearch() {
  const [value, setValue] = useState("");
  return (
    <SearchField
      value={value}
      onChange={setValue}
      endIcon={value ? "x" : null}
      onEndIconClick={() => setValue("")}
      endIconAltText="Clear search"
    />
  );
}

const results = (
  <>
    <a href="#one">First result</a>
    <a href="#two">Second result</a>
  </>
);

describe("SearchField - rendering", () => {
  it("renders nothing when showWhen is false", () => {
    const { container } = render(<SearchField showWhen={false} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders a search box named 'Search' by default", () => {
    render(<SearchField />);
    const input = screen.getByRole("searchbox", { name: "Search" });
    expect(input).toHaveAttribute("type", "search");
  });

  it("shows the placeholder", () => {
    render(<SearchField placeholder="Find a document" />);
    expect(screen.getByPlaceholderText("Find a document")).toBeInTheDocument();
  });

  it("merges className onto the wrapper alongside the margin classes", () => {
    const { container } = render(<SearchField className="custom-class mb-10" />);
    const wrapper = container.firstElementChild;
    expect(wrapper).toHaveClass("custom-class");
    expect(wrapper).toHaveClass("mb-10");
    expect(wrapper).not.toHaveClass("mb-4");
  });

  it("resolves the default name through LocaleProvider", () => {
    // The Spanish bundle has no search entries yet, so "es" falls back to English
    render(
      <LocaleProvider locale="es">
        <SearchField />
      </LocaleProvider>
    );
    expect(screen.getByRole("searchbox", { name: "Search" })).toBeInTheDocument();
  });
});

describe("SearchField - value and onChange", () => {
  it("shows a controlled value", () => {
    render(<SearchField value="budget" />);
    expect(screen.getByRole("searchbox")).toHaveValue("budget");
  });

  it("does not change a controlled value until the parent updates it", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<SearchField value="abc" onChange={onChange} />);
    await user.type(screen.getByRole("searchbox"), "d");
    expect(onChange).toHaveBeenCalledWith("abcd");
    expect(screen.getByRole("searchbox")).toHaveValue("abc");
  });

  it("can be typed into without a value prop", async () => {
    const user = userEvent.setup();
    render(<SearchField />);
    const input = screen.getByRole("searchbox");
    await user.type(input, "hello");
    expect(input).toHaveValue("hello");
  });

  it("seeds the uncontrolled text from defaultValue", () => {
    render(<SearchField defaultValue="seeded" />);
    expect(screen.getByRole("searchbox")).toHaveValue("seeded");
  });

  it("calls onChange with the full text on each keystroke", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Controlled onChange={onChange} />);
    await user.type(screen.getByRole("searchbox"), "abc");
    expect(onChange.mock.calls.map(([v]) => v)).toEqual(["a", "ab", "abc"]);
  });

  it("calls saveInto as an alias for onChange", async () => {
    const user = userEvent.setup();
    const saveInto = vi.fn();
    render(<SearchField saveInto={saveInto} />);
    await user.type(screen.getByRole("searchbox"), "hi");
    expect(saveInto).toHaveBeenLastCalledWith("hi");
  });

  it("prefers onChange over saveInto when both are set", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const saveInto = vi.fn();
    render(<SearchField onChange={onChange} saveInto={saveInto} />);
    await user.type(screen.getByRole("searchbox"), "x");
    expect(onChange).toHaveBeenCalledWith("x");
    expect(saveInto).not.toHaveBeenCalled();
  });
});

describe("SearchField - onSubmit", () => {
  it("calls onSubmit with the current text on Enter (uncontrolled)", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<SearchField onSubmit={onSubmit} />);
    await user.type(screen.getByRole("searchbox"), "invoices{Enter}");
    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledWith("invoices");
  });

  it("calls onSubmit with the current text on Enter (controlled)", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<Controlled onSubmit={onSubmit} />);
    await user.type(screen.getByRole("searchbox"), "policy{Enter}");
    expect(onSubmit).toHaveBeenCalledWith("policy");
  });

  it("does not call onSubmit for other keys", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<SearchField onSubmit={onSubmit} />);
    await user.type(screen.getByRole("searchbox"), "abc{Tab}");
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("ignores Enter while an IME is composing", () => {
    const onSubmit = vi.fn();
    render(<SearchField onSubmit={onSubmit} />);
    fireEvent.keyDown(screen.getByRole("searchbox"), { key: "Enter", isComposing: true });
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("ignores Enter that confirms an IME composition in Safari (keyCode 229)", () => {
    const onSubmit = vi.fn();
    render(<SearchField onSubmit={onSubmit} />);
    const input = screen.getByRole("searchbox");
    fireEvent.keyDown(input, { key: "Enter", keyCode: 229 });
    expect(onSubmit).not.toHaveBeenCalled();
    fireEvent.keyDown(input, { key: "Enter", keyCode: 13 });
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it("ignores Enter when disabled", () => {
    const onSubmit = vi.fn();
    render(<SearchField onSubmit={onSubmit} disabled />);
    fireEvent.keyDown(screen.getByRole("searchbox"), { key: "Enter" });
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("keeps an enclosing form from submitting when onSubmit is set", async () => {
    const user = userEvent.setup();
    const formSubmit = vi.fn((e: React.FormEvent) => e.preventDefault());
    render(
      <form onSubmit={formSubmit}>
        <SearchField onSubmit={vi.fn()} />
        <button type="submit">Go</button>
      </form>
    );
    await user.type(screen.getByRole("searchbox"), "x{Enter}");
    expect(formSubmit).not.toHaveBeenCalled();
  });

  it("leaves Enter alone when onSubmit is not set", async () => {
    const user = userEvent.setup();
    const formSubmit = vi.fn((e: React.FormEvent) => e.preventDefault());
    render(
      <form onSubmit={formSubmit}>
        <SearchField />
        <button type="submit">Go</button>
      </form>
    );
    await user.type(screen.getByRole("searchbox"), "x{Enter}");
    expect(formSubmit).toHaveBeenCalledTimes(1);
  });
});

describe("SearchField - icons", () => {
  const getIcons = (container: HTMLElement) =>
    container.querySelectorAll('.relative svg[aria-hidden="true"]');

  it("always renders the search icon at the start", () => {
    const { container } = render(<SearchField />);
    expect(getIcons(container)).toHaveLength(1);
    expect(screen.getByRole("searchbox")).toHaveClass("ps-9", "pe-3");
  });

  it("renders an end icon and makes room for it", () => {
    const { container } = render(<SearchField endIcon="mic" />);
    expect(getIcons(container)).toHaveLength(2);
    expect(screen.getByRole("searchbox")).toHaveClass("ps-9", "pe-9");
  });

  it("hides icons from assistive tech and keeps them out of the tab order", async () => {
    const user = userEvent.setup();
    const { container } = render(<SearchField endIcon="mic" />);
    container.querySelectorAll(".relative > span").forEach((span) => {
      expect(span).toHaveAttribute("aria-hidden", "true");
      expect(span).toHaveClass("pointer-events-none");
    });
    await user.tab();
    expect(screen.getByRole("searchbox")).toHaveFocus();
    await user.tab();
    expect(document.body).toHaveFocus();
  });

  it("warns and renders nothing for an unknown icon name", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const { container } = render(<SearchField endIcon="not-a-real-icon" />);
    expect(warn).toHaveBeenCalledWith(expect.stringContaining("not-a-real-icon"));
    // Only the search icon
    expect(getIcons(container)).toHaveLength(1);
    expect(screen.getByRole("searchbox")).toHaveClass("pe-3");
  });
});

describe("SearchField - interactive end icon", () => {
  it("renders no button without onEndIconClick", () => {
    render(<SearchField endIcon="x" endIconAltText="Clear search" />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("renders no button without an end icon", () => {
    render(<SearchField endIcon={null} onEndIconClick={vi.fn()} endIconAltText="Clear search" />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("renders a type=button named by endIconAltText", () => {
    render(<SearchField endIcon="x" onEndIconClick={vi.fn()} endIconAltText="Clear search" />);
    const button = screen.getByRole("button", { name: "Clear search" });
    expect(button).toHaveAttribute("type", "button");
    expect(button).not.toHaveAttribute("aria-hidden");
    expect(button.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
  });

  it("falls back to the library default name when endIconAltText is missing", () => {
    render(<SearchField endIcon="x" onEndIconClick={vi.fn()} />);
    expect(screen.getByRole("button", { name: "Search action" })).toBeInTheDocument();
  });

  it("resolves the fallback name through LocaleProvider", () => {
    render(
      <LocaleProvider locale="es">
        <SearchField endIcon="x" onEndIconClick={vi.fn()} />
      </LocaleProvider>
    );
    expect(screen.getByRole("button", { name: "Search action" })).toBeInTheDocument();
  });

  it("makes room for the button and has a target of at least 24px", () => {
    render(<SearchField endIcon="x" onEndIconClick={vi.fn()} endIconAltText="Clear search" />);
    expect(screen.getByRole("searchbox")).toHaveClass("pe-10");
    expect(screen.getByRole("button")).toHaveClass("w-8", "inset-y-1", "end-1");
  });

  it("calls the callback once per click", async () => {
    const user = userEvent.setup();
    const onEndIconClick = vi.fn();
    render(<SearchField endIcon="x" onEndIconClick={onEndIconClick} endIconAltText="Clear search" />);
    await user.click(screen.getByRole("button", { name: "Clear search" }));
    expect(onEndIconClick).toHaveBeenCalledTimes(1);
  });

  it("is reached by Tab from the input and activates with Enter and Space", async () => {
    const user = userEvent.setup();
    const onEndIconClick = vi.fn();
    const onSubmit = vi.fn();
    render(
      <SearchField
        onSubmit={onSubmit}
        endIcon="x"
        onEndIconClick={onEndIconClick}
        endIconAltText="Clear search"
      />
    );
    await user.click(screen.getByRole("searchbox"));
    await user.tab();
    const button = screen.getByRole("button", { name: "Clear search" });
    expect(button).toHaveFocus();
    await user.keyboard("{Enter}");
    expect(onEndIconClick).toHaveBeenCalledTimes(1);
    // Focus moved back to the input, so move to the button again for Space
    await user.tab();
    expect(button).toHaveFocus();
    await user.keyboard(" ");
    expect(onEndIconClick).toHaveBeenCalledTimes(2);
    // Enter on the button must not run the input's onSubmit
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("is disabled with the field and does not call the callback", async () => {
    const user = userEvent.setup();
    const onEndIconClick = vi.fn();
    render(<SearchField disabled endIcon="x" onEndIconClick={onEndIconClick} endIconAltText="Clear search" />);
    const button = screen.getByRole("button", { name: "Clear search" });
    expect(button).toBeDisabled();
    await user.click(button);
    expect(onEndIconClick).not.toHaveBeenCalled();
  });

  it("does not submit an enclosing form or call onSubmit", async () => {
    const user = userEvent.setup();
    const formSubmit = vi.fn((e: React.FormEvent) => e.preventDefault());
    const onSubmit = vi.fn();
    render(
      <form onSubmit={formSubmit}>
        <SearchField onSubmit={onSubmit} endIcon="x" onEndIconClick={vi.fn()} endIconAltText="Clear search" />
      </form>
    );
    await user.click(screen.getByRole("button", { name: "Clear search" }));
    expect(formSubmit).not.toHaveBeenCalled();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("does not call onDismiss when clicked while expanded", async () => {
    const user = userEvent.setup();
    const onDismiss = vi.fn();
    const onEndIconClick = vi.fn();
    render(
      <SearchField
        expanded
        onDismiss={onDismiss}
        endIcon="x"
        onEndIconClick={onEndIconClick}
        endIconAltText="Clear search"
      >
        {results}
      </SearchField>
    );
    await user.click(screen.getByRole("button", { name: "Clear search" }));
    expect(onEndIconClick).toHaveBeenCalledTimes(1);
    expect(onDismiss).not.toHaveBeenCalled();
    expect(screen.getByRole("group", { name: "Search results" })).toBeInTheDocument();
  });

  it("moves focus to the input on click", async () => {
    const user = userEvent.setup();
    render(<SearchField defaultValue="abc" endIcon="x" onEndIconClick={vi.fn()} endIconAltText="Clear search" />);
    await user.click(screen.getByRole("button", { name: "Clear search" }));
    expect(screen.getByRole("searchbox")).toHaveFocus();
  });

  it("keeps focus on the input when the consumer removes the icon", async () => {
    const user = userEvent.setup();
    render(<ClearableSearch />);
    const input = screen.getByRole("searchbox");
    await user.type(input, "budget");
    expect(input).toHaveValue("budget");
    await user.tab();
    expect(screen.getByRole("button", { name: "Clear search" })).toHaveFocus();
    await user.keyboard("{Enter}");
    expect(input).toHaveValue("");
    expect(screen.queryByRole("button", { name: "Clear search" })).not.toBeInTheDocument();
    expect(input).toHaveFocus();
  });

  it("does not call onChange itself: the consumer controls the value", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <SearchField value="abc" onChange={onChange} endIcon="x" onEndIconClick={vi.fn()} endIconAltText="Clear search" />
    );
    await user.click(screen.getByRole("button", { name: "Clear search" }));
    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getByRole("searchbox")).toHaveValue("abc");
  });
});

describe("SearchField - shape", () => {
  it("defaults to SEMI_ROUNDED", () => {
    render(<SearchField />);
    expect(screen.getByRole("searchbox")).toHaveClass("rounded-sm");
  });

  it.each([
    ["SQUARED", "rounded-none"],
    ["SEMI_ROUNDED", "rounded-sm"],
    ["ROUNDED", "rounded-md"],
  ] as const)("renders %s with %s", (shape, cls) => {
    render(<SearchField shape={shape} />);
    expect(screen.getByRole("searchbox")).toHaveClass(cls);
  });

  it("applies the shape to the results panel", () => {
    render(<SearchField shape="ROUNDED" expanded>{results}</SearchField>);
    expect(screen.getByRole("group", { name: "Search results" })).toHaveClass("rounded-md");
  });
});

describe("SearchField - label and accessibility", () => {
  it("names the input with the visible label", () => {
    render(<SearchField label="Products" />);
    expect(screen.getByRole("searchbox", { name: "Products" })).toBeInTheDocument();
    expect(screen.getByText("Products").tagName).toBe("LABEL");
  });

  it("keeps the label as the name when it is COLLAPSED", () => {
    render(<SearchField label="Products" labelPosition="COLLAPSED" />);
    expect(screen.getByRole("searchbox", { name: "Products" })).toBeInTheDocument();
    expect(document.querySelector("label")).toBeNull();
  });

  it("uses accessibilityText as the name when there is no label", () => {
    render(<SearchField accessibilityText="Search the catalog" />);
    expect(screen.getByRole("searchbox", { name: "Search the catalog" })).toBeInTheDocument();
  });

  it("renders no empty label when there is no label", () => {
    render(<SearchField accessibilityText="Search the catalog" />);
    expect(document.querySelector("label")).toBeNull();
  });

  it("describes the input with accessibilityText and instructions when there is a label", () => {
    render(
      <SearchField
        label="Products"
        accessibilityText="Press Enter to search"
        instructions="Search by name or SKU"
      />
    );
    const input = screen.getByRole("searchbox", { name: "Products" });
    expect(input).toHaveAccessibleDescription("Press Enter to search Search by name or SKU");
  });

  it("describes the input with the instructions", () => {
    render(<SearchField instructions="Search by name" />);
    expect(screen.getByRole("searchbox")).toHaveAccessibleDescription("Search by name");
  });

  it("disables the input", () => {
    render(<SearchField disabled />);
    expect(screen.getByRole("searchbox")).toBeDisabled();
  });
});

describe("SearchField - expanded results", () => {
  it("does not render the results when expanded is false", () => {
    render(<SearchField>{results}</SearchField>);
    expect(screen.queryByText("First result")).not.toBeInTheDocument();
    expect(screen.queryByRole("group")).not.toBeInTheDocument();
    expect(screen.getByRole("searchbox")).not.toHaveAttribute("aria-controls");
  });

  it("renders the results in a named group below the input when expanded", () => {
    render(<SearchField expanded>{results}</SearchField>);
    const group = screen.getByRole("group", { name: "Search results" });
    const input = screen.getByRole("searchbox");
    expect(group).toContainElement(screen.getByText("First result"));
    expect(input).toHaveAttribute("aria-controls", group.id);
    expect(input).not.toHaveAttribute("aria-expanded");
    expect(group).toHaveClass("top-full");
    // The panel follows the input in the DOM
    expect(input.compareDocumentPosition(group) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it("renders no panel when expanded has no children", () => {
    render(<SearchField expanded />);
    expect(screen.queryByRole("group")).not.toBeInTheDocument();
    expect(screen.getByRole("searchbox")).not.toHaveAttribute("aria-controls");
  });

  it("renders no panel when disabled", () => {
    render(<SearchField expanded disabled>{results}</SearchField>);
    expect(screen.queryByRole("group")).not.toBeInTheDocument();
  });

  it("docks the panel below the input and raises the container only while open", () => {
    const { rerender } = render(<SearchField>{results}</SearchField>);
    const container = screen.getByRole("searchbox").closest(".relative")!.parentElement!.parentElement!;
    expect(container).toHaveClass("relative");
    expect(container).not.toHaveClass("z-50");
    rerender(<SearchField expanded>{results}</SearchField>);
    const panel = screen.getByRole("group", { name: "Search results" });
    expect(panel.parentElement).toBe(container);
    expect(container).toHaveClass("relative", "z-50");
    expect(panel).toHaveClass("absolute", "start-0", "end-0", "top-full", "mt-1", "shadow-lg", "max-h-80", "overflow-y-auto", "overscroll-contain");
    expect(panel).not.toHaveClass("z-50");
  });

  it("shows and hides the panel as expanded changes", () => {
    const { rerender } = render(<SearchField>{results}</SearchField>);
    expect(screen.queryByRole("group")).not.toBeInTheDocument();
    rerender(<SearchField expanded>{results}</SearchField>);
    expect(screen.getByRole("group", { name: "Search results" })).toBeInTheDocument();
    rerender(<SearchField expanded={false}>{results}</SearchField>);
    expect(screen.queryByRole("group")).not.toBeInTheDocument();
  });
});

describe("SearchField - dismissal", () => {
  it("calls onDismiss on Escape in the input and keeps the text", async () => {
    const user = userEvent.setup();
    const onDismiss = vi.fn();
    render(<SearchField defaultValue="keep me" expanded onDismiss={onDismiss}>{results}</SearchField>);
    screen.getByRole("searchbox").focus();
    await user.keyboard("{Escape}");
    expect(onDismiss).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("searchbox")).toHaveValue("keep me");
  });

  it("returns focus to the input on Escape from inside the panel", async () => {
    const user = userEvent.setup();
    const onDismiss = vi.fn();
    render(<SearchField expanded onDismiss={onDismiss}>{results}</SearchField>);
    screen.getByRole("link", { name: "First result" }).focus();
    await user.keyboard("{Escape}");
    expect(onDismiss).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("searchbox")).toHaveFocus();
  });

  it("does not call onDismiss on Escape when the panel is closed", async () => {
    const user = userEvent.setup();
    const onDismiss = vi.fn();
    render(<SearchField onDismiss={onDismiss}>{results}</SearchField>);
    screen.getByRole("searchbox").focus();
    await user.keyboard("{Escape}");
    expect(onDismiss).not.toHaveBeenCalled();
  });

  it("keeps the panel open when Tab moves from the input into a result", async () => {
    const user = userEvent.setup();
    const onDismiss = vi.fn();
    render(<SearchField expanded onDismiss={onDismiss}>{results}</SearchField>);
    screen.getByRole("searchbox").focus();
    // jsdom applies no CSS, so the close button (hidden while docked) is in the tab order here
    await user.tab();
    expect(screen.getByRole("button", { name: "Close search" })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole("link", { name: "First result" })).toHaveFocus();
    expect(onDismiss).not.toHaveBeenCalled();
  });

  it("calls onDismiss when Tab moves focus past the panel", async () => {
    const user = userEvent.setup();
    const onDismiss = vi.fn();
    render(
      <>
        <SearchField expanded onDismiss={onDismiss}>{results}</SearchField>
        <button>After</button>
      </>
    );
    screen.getByRole("link", { name: "Second result" }).focus();
    await user.tab();
    expect(screen.getByRole("button", { name: "After" })).toHaveFocus();
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it("calls onDismiss on a click outside the field", async () => {
    const user = userEvent.setup();
    const onDismiss = vi.fn();
    render(
      <>
        <SearchField expanded onDismiss={onDismiss}>{results}</SearchField>
        <p>Elsewhere</p>
      </>
    );
    await user.click(screen.getByText("Elsewhere"));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it("does not call onDismiss when clicking plain text inside the panel", async () => {
    const user = userEvent.setup();
    const onDismiss = vi.fn();
    render(
      <SearchField expanded onDismiss={onDismiss}>
        <p>No results found</p>
      </SearchField>
    );
    await user.click(screen.getByText("No results found"));
    expect(onDismiss).not.toHaveBeenCalled();
  });

  it("does not listen for outside clicks while the panel is closed", async () => {
    const user = userEvent.setup();
    const onDismiss = vi.fn();
    render(
      <>
        <SearchField onDismiss={onDismiss}>{results}</SearchField>
        <p>Elsewhere</p>
      </>
    );
    await user.click(screen.getByText("Elsewhere"));
    expect(onDismiss).not.toHaveBeenCalled();
  });
});

// jsdom does not evaluate media queries and has no matchMedia, so these tests
// check the class strings, the DOM order and the event-time 480px check. Real
// layout, hit testing and visibility are covered by the story play functions in
// a browser.

// The full-screen class prefix (480px and under), and the media query the
// event-time check uses. The query is the classic form Tailwind writes in the
// built CSS for max-[481px] (no range syntax).
const PHONE_PREFIX = "max-[481px]:";
const PHONE_QUERY = "not all and (min-width: 481px)";

// The full-screen classes of each part of the field, for one prefix
const partClasses = (prefix: string) => {
  const withPrefix = (classes: string[]) => classes.map((c) => `${prefix}${c}`);
  return {
    view: withPrefix(["fixed", "inset-0", "flex", "flex-col", "bg-white"]),
    header: withPrefix(["p-2", "border-b"]),
    input: withPrefix(["pe-3"]),
    panel: withPrefix(["static", "mt-0", "flex-1", "max-h-none", "border-0", "shadow-none", "rounded-none"]),
    hide: withPrefix(["hidden"]),
    show: withPrefix(["flex"]),
  };
};

const getPanel = () => screen.getByRole("group", { name: "Search results" });
// The container is the panel's parent, and the scrim is its first child
const getView = () => getPanel().parentElement as HTMLElement;
const getScrim = () => getView().firstElementChild as HTMLElement;
// The header row is the parent of the icon row around the input
const getHeader = () => screen.getByRole("searchbox").closest(".relative")!.parentElement as HTMLElement;
const getCloseButton = () => screen.getByRole("button", { name: "Close search" });
const queryScrim = (container: HTMLElement) => container.querySelector('[class*="bg-black/30"]');

// Open, with onDismiss and an end icon button, so the scrim, close button and end icon all exist
function renderOpen() {
  return render(
    <SearchField
      expanded
      onDismiss={vi.fn()}
      endIcon="x"
      onEndIconClick={vi.fn()}
      endIconAltText="Clear search"
    >
      {results}
    </SearchField>
  );
}

// Checks that every part has (or does not have) its full-screen classes
function expectFullScreenParts(present: boolean) {
  const parts = partClasses(PHONE_PREFIX);
  const pairs: [HTMLElement, string[]][] = [
    [getView(), parts.view],
    [getHeader(), parts.header],
    [screen.getByRole("searchbox"), parts.input],
    [getPanel(), parts.panel],
    [getScrim(), parts.hide],
    [screen.getByRole("button", { name: "Clear search" }), parts.hide],
    [getCloseButton(), parts.show],
  ];
  for (const [element, classes] of pairs) {
    for (const cls of classes) {
      if (present) expect(element).toHaveClass(cls);
      else expect(element).not.toHaveClass(cls);
    }
  }
}

// Stub matchMedia so the given queries match. Returns the list of matching queries,
// which a test can change between events.
function stubMatchMedia(matching: string[]) {
  vi.stubGlobal(
    "matchMedia",
    vi.fn((query: string) => ({ matches: matching.includes(query), media: query }))
  );
  return matching;
}

describe("SearchField - full-screen classes", () => {
  it("keeps the docked classes and adds the full-screen parts", () => {
    renderOpen();
    expect(getPanel()).toHaveClass("absolute", "start-0", "end-0", "top-full", "mt-1", "shadow-lg", "max-h-80", "overflow-y-auto");
    expectFullScreenParts(true);
  });

  it("uses only the 480px breakpoint", () => {
    const { container } = renderOpen();
    const breakpoints = container.innerHTML.match(/max-\[\d+px\]:/g) ?? [];
    expect(breakpoints.length).toBeGreaterThan(0);
    expect(new Set(breakpoints)).toEqual(new Set([PHONE_PREFIX]));
    expect(container.innerHTML).not.toContain("min-[");
  });

  it("keeps the shape classes with the full-screen classes", () => {
    render(<SearchField expanded shape="ROUNDED">{results}</SearchField>);
    expect(getPanel()).toHaveClass("rounded-md", "max-[481px]:rounded-none");
  });

  it("adds no full-screen classes to a closed field", () => {
    render(
      <SearchField onDismiss={vi.fn()} endIcon="x" onEndIconClick={vi.fn()} endIconAltText="Clear search">
        {results}
      </SearchField>
    );
    const header = getHeader();
    const view = header.parentElement as HTMLElement;
    for (const element of [view, header, screen.getByRole("searchbox"), screen.getByRole("button", { name: "Clear search" })]) {
      expect(element.className).not.toContain("max-[481px]:");
    }
    expect(view).not.toHaveClass("z-50");
  });
});

describe("SearchField - scrim", () => {
  it("is rendered only while the panel is shown", () => {
    const { container, rerender } = render(<SearchField onDismiss={vi.fn()}>{results}</SearchField>);
    expect(queryScrim(container)).toBeNull();
    rerender(<SearchField expanded disabled onDismiss={vi.fn()}>{results}</SearchField>);
    expect(queryScrim(container)).toBeNull();
    rerender(<SearchField expanded onDismiss={vi.fn()} />);
    expect(queryScrim(container)).toBeNull();
    rerender(<SearchField expanded onDismiss={vi.fn()}>{results}</SearchField>);
    expect(queryScrim(container)).not.toBeNull();
  });

  it("is not rendered without onDismiss", () => {
    const { container } = render(<SearchField expanded>{results}</SearchField>);
    expect(getView().firstElementChild).toBe(getHeader());
    expect(queryScrim(container)).toBeNull();
  });

  it("is the container's first child, hidden from assistive tech and not focusable", () => {
    const { container } = renderOpen();
    const scrim = getScrim();
    expect(queryScrim(container)).toBe(scrim);
    expect(scrim).toHaveAttribute("aria-hidden", "true");
    expect(scrim).not.toHaveAttribute("tabindex");
    expect(scrim).toHaveClass("fixed", "inset-0", "bg-black/30");
    expect(scrim.nextElementSibling).toBe(getHeader());
  });

  it("calls onDismiss once on a click and does not move focus back to the input", async () => {
    const user = userEvent.setup();
    const onDismiss = vi.fn();
    render(<SearchField expanded onDismiss={onDismiss}>{results}</SearchField>);
    screen.getByRole("searchbox").focus();
    await user.click(getScrim());
    expect(onDismiss).toHaveBeenCalledTimes(1);
    expect(document.body).toHaveFocus();
  });

  it("does not call onDismiss on a pointerdown alone", () => {
    const onDismiss = vi.fn();
    render(<SearchField expanded onDismiss={onDismiss}>{results}</SearchField>);
    fireEvent.pointerDown(getScrim());
    expect(onDismiss).not.toHaveBeenCalled();
  });

  it("is hidden while full screen", () => {
    renderOpen();
    const scrim = getScrim();
    expect(scrim).toHaveClass("max-[481px]:hidden");
    expect(scrim.className).not.toContain("min-[");
  });
});

describe("SearchField - close button", () => {
  it("is rendered when open with onDismiss", () => {
    render(<SearchField expanded onDismiss={vi.fn()}>{results}</SearchField>);
    expect(getCloseButton()).toBeInTheDocument();
  });

  it("is not rendered without onDismiss, when closed or when disabled", () => {
    const { rerender } = render(<SearchField expanded>{results}</SearchField>);
    expect(screen.queryByRole("button", { name: "Close search" })).not.toBeInTheDocument();
    rerender(<SearchField onDismiss={vi.fn()}>{results}</SearchField>);
    expect(screen.queryByRole("button", { name: "Close search" })).not.toBeInTheDocument();
    rerender(<SearchField expanded disabled onDismiss={vi.fn()}>{results}</SearchField>);
    expect(screen.queryByRole("button", { name: "Close search" })).not.toBeInTheDocument();
  });

  it("is a type=button named 'Close search' with a hidden icon", () => {
    render(<SearchField expanded onDismiss={vi.fn()}>{results}</SearchField>);
    const button = getCloseButton();
    expect(button).toHaveAttribute("type", "button");
    expect(button.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
  });

  it("resolves its name through LocaleProvider", () => {
    // The Spanish bundle has no search entries yet, so "es" falls back to English
    render(
      <LocaleProvider locale="es">
        <SearchField expanded onDismiss={vi.fn()}>{results}</SearchField>
      </LocaleProvider>
    );
    expect(getCloseButton()).toBeInTheDocument();
  });

  it("is hidden above 480px, 40px square, and shown at 480px and under", () => {
    render(<SearchField expanded onDismiss={vi.fn()}>{results}</SearchField>);
    const button = getCloseButton();
    expect(button).toHaveClass("hidden", "size-10", "max-[481px]:flex");
    expect(button.className).not.toContain("min-[");
  });

  it("focuses the input, then calls onDismiss once on click", async () => {
    const user = userEvent.setup();
    let focusedAtDismiss: Element | null = null;
    const onDismiss = vi.fn(() => {
      focusedAtDismiss = document.activeElement;
    });
    render(<SearchField expanded onDismiss={onDismiss}>{results}</SearchField>);
    await user.click(getCloseButton());
    expect(onDismiss).toHaveBeenCalledTimes(1);
    expect(focusedAtDismiss).toBe(screen.getByRole("searchbox"));
    expect(screen.getByRole("searchbox")).toHaveFocus();
  });

  it("activates with Enter and Space", async () => {
    const user = userEvent.setup();
    const onDismiss = vi.fn();
    render(<SearchField expanded onDismiss={onDismiss}>{results}</SearchField>);
    getCloseButton().focus();
    await user.keyboard("{Enter}");
    expect(onDismiss).toHaveBeenCalledTimes(1);
    getCloseButton().focus();
    await user.keyboard(" ");
    expect(onDismiss).toHaveBeenCalledTimes(2);
  });

  it("calls onDismiss and focuses the input on Escape while it has focus", async () => {
    const user = userEvent.setup();
    const onDismiss = vi.fn();
    render(<SearchField expanded onDismiss={onDismiss}>{results}</SearchField>);
    getCloseButton().focus();
    await user.keyboard("{Escape}");
    expect(onDismiss).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("searchbox")).toHaveFocus();
  });

  it("does not submit an enclosing form or call onSubmit", async () => {
    const user = userEvent.setup();
    const formSubmit = vi.fn((e: React.FormEvent) => e.preventDefault());
    const onSubmit = vi.fn();
    render(
      <form onSubmit={formSubmit}>
        <SearchField expanded onDismiss={vi.fn()} onSubmit={onSubmit}>{results}</SearchField>
      </form>
    );
    await user.click(getCloseButton());
    expect(formSubmit).not.toHaveBeenCalled();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("follows the input and end icon button and comes before the panel in the DOM", () => {
    renderOpen();
    const order = [
      screen.getByRole("searchbox"),
      screen.getByRole("button", { name: "Clear search" }),
      getCloseButton(),
      getPanel(),
    ];
    for (let i = 1; i < order.length; i++) {
      expect(order[i - 1].compareDocumentPosition(order[i]) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    }
  });
});

describe.each([
  ["docked", [] as string[]],
  ["full screen", [PHONE_QUERY]],
])("SearchField - accessibility wiring (%s)", (_name, matching) => {
  beforeEach(() => {
    stubMatchMedia(matching);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("keeps the group, its name, aria-controls and the DOM order", () => {
    render(<SearchField expanded>{results}</SearchField>);
    const input = screen.getByRole("searchbox");
    const group = getPanel();
    expect(input).toHaveAttribute("aria-controls", group.id);
    expect(input).not.toHaveAttribute("aria-expanded");
    expect(group.tagName).toBe("DIV");
    expect(input.compareDocumentPosition(group) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it("renders no panel when disabled or without children", () => {
    const { rerender } = render(<SearchField expanded disabled>{results}</SearchField>);
    expect(screen.queryByRole("group")).not.toBeInTheDocument();
    rerender(<SearchField expanded />);
    expect(screen.queryByRole("group")).not.toBeInTheDocument();
    expect(screen.getByRole("searchbox")).not.toHaveAttribute("aria-controls");
  });

  it("keeps the panel out of the box the icons are positioned against", () => {
    const { container } = render(
      <SearchField
        expanded
        onDismiss={vi.fn()}
        endIcon="x"
        onEndIconClick={vi.fn()}
        endIconAltText="Clear search"
      >
        {results}
      </SearchField>
    );
    // The first svg is always the search icon
    const iconRow = container.querySelector("svg")!.closest(".relative")!;
    expect(iconRow).toHaveClass("relative", "flex-1", "min-w-0");
    expect(iconRow).toContainElement(screen.getByRole("searchbox"));
    expect(iconRow).toContainElement(screen.getByRole("button", { name: "Clear search" }));
    expect(iconRow).not.toContainElement(getPanel());
    // The header row holds the icon row and the close button, not the panel
    const header = iconRow.parentElement!;
    expect(header).toContainElement(screen.getByRole("searchbox"));
    expect(header).toContainElement(getCloseButton());
    expect(header).not.toContainElement(getPanel());
    // The container around both anchors the docked panel
    expect(header.parentElement).toHaveClass("relative");
    expect(header.parentElement).toContainElement(getPanel());
  });

  it("keeps Tab order: input, end icon button, then the results", async () => {
    const user = userEvent.setup();
    render(
      <SearchField
        expanded
        endIcon="x"
        onEndIconClick={vi.fn()}
        endIconAltText="Clear search"
      >
        {results}
      </SearchField>
    );
    await user.click(screen.getByRole("searchbox"));
    await user.tab();
    expect(screen.getByRole("button", { name: "Clear search" })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole("link", { name: "First result" })).toHaveFocus();
  });

  it("keeps Tab order with onDismiss: input, end icon button, close button, then the results", async () => {
    const user = userEvent.setup();
    renderOpen();
    await user.click(screen.getByRole("searchbox"));
    await user.tab();
    expect(screen.getByRole("button", { name: "Clear search" })).toHaveFocus();
    await user.tab();
    expect(getCloseButton()).toHaveFocus();
    await user.tab();
    expect(screen.getByRole("link", { name: "First result" })).toHaveFocus();
  });

  it("clears with the end icon button and keeps the panel open", async () => {
    const user = userEvent.setup();
    const onDismiss = vi.fn();
    function Clearable() {
      const [value, setValue] = useState("abc");
      return (
        <SearchField
          value={value}
          onChange={setValue}
          expanded
          onDismiss={onDismiss}
          endIcon={value ? "x" : null}
          onEndIconClick={() => setValue("")}
          endIconAltText="Clear search"
        >
          {results}
        </SearchField>
      );
    }
    render(<Clearable />);
    await user.click(screen.getByRole("button", { name: "Clear search" }));
    expect(screen.getByRole("searchbox")).toHaveValue("");
    expect(screen.getByRole("searchbox")).toHaveFocus();
    expect(onDismiss).not.toHaveBeenCalled();
    expect(getPanel()).toBeInTheDocument();
  });
});

describe("SearchField - dismissal while docked", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("dismisses on an outside press, Escape and Tab-out when no matchMedia exists (jsdom)", async () => {
    expect(typeof window.matchMedia).not.toBe("function");
    const user = userEvent.setup();
    const onDismiss = vi.fn();
    render(
      <>
        <SearchField expanded onDismiss={onDismiss}>{results}</SearchField>
        <p>Elsewhere</p>
        <button>After</button>
      </>
    );
    await user.click(screen.getByText("Elsewhere"));
    expect(onDismiss).toHaveBeenCalledTimes(1);
    screen.getByRole("searchbox").focus();
    await user.keyboard("{Escape}");
    expect(onDismiss).toHaveBeenCalledTimes(2);
    screen.getByRole("link", { name: "Second result" }).focus();
    await user.tab();
    expect(onDismiss).toHaveBeenCalledTimes(3);
  });

  it("dismisses on an outside press when the window is wider than 480px", async () => {
    stubMatchMedia([]);
    const user = userEvent.setup();
    const onDismiss = vi.fn();
    render(
      <>
        <SearchField expanded onDismiss={onDismiss}>{results}</SearchField>
        <p>Elsewhere</p>
      </>
    );
    await user.click(screen.getByText("Elsewhere"));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it("asks only the 480px query", async () => {
    // Every query matches except the 480px one
    const matchMedia = vi.fn((query: string) => ({ matches: query !== PHONE_QUERY, media: query }));
    vi.stubGlobal("matchMedia", matchMedia);
    const user = userEvent.setup();
    const onDismiss = vi.fn();
    render(
      <>
        <SearchField expanded onDismiss={onDismiss}>{results}</SearchField>
        <p>Elsewhere</p>
      </>
    );
    await user.click(screen.getByText("Elsewhere"));
    expect(onDismiss).toHaveBeenCalledTimes(1);
    expect(matchMedia).toHaveBeenCalled();
    for (const [query] of matchMedia.mock.calls) {
      expect(query).toBe(PHONE_QUERY);
    }
  });
});

describe("SearchField - dismissal while full screen", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("does not dismiss on an outside press at 480px and under", async () => {
    const matchMedia = stubMatchMedia([PHONE_QUERY]);
    const user = userEvent.setup();
    const onDismiss = vi.fn();
    render(
      <>
        <SearchField expanded onDismiss={onDismiss}>{results}</SearchField>
        <p>Elsewhere</p>
      </>
    );
    await user.click(screen.getByText("Elsewhere"));
    expect(onDismiss).not.toHaveBeenCalled();
    expect(matchMedia).toContain("not all and (min-width: 481px)");
    expect(window.matchMedia).toHaveBeenCalledWith("not all and (min-width: 481px)");
  });

  it("still dismisses on Escape from the input and from inside the panel", async () => {
    stubMatchMedia([PHONE_QUERY]);
    const user = userEvent.setup();
    const onDismiss = vi.fn();
    render(<SearchField expanded onDismiss={onDismiss}>{results}</SearchField>);
    screen.getByRole("searchbox").focus();
    await user.keyboard("{Escape}");
    expect(onDismiss).toHaveBeenCalledTimes(1);
    screen.getByRole("link", { name: "First result" }).focus();
    await user.keyboard("{Escape}");
    expect(onDismiss).toHaveBeenCalledTimes(2);
    expect(screen.getByRole("searchbox")).toHaveFocus();
  });

  it("still dismisses when focus leaves the field", async () => {
    stubMatchMedia([PHONE_QUERY]);
    const user = userEvent.setup();
    const onDismiss = vi.fn();
    render(
      <>
        <SearchField expanded onDismiss={onDismiss}>{results}</SearchField>
        <button>After</button>
      </>
    );
    screen.getByRole("link", { name: "Second result" }).focus();
    await user.tab();
    expect(screen.getByRole("button", { name: "After" })).toHaveFocus();
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it("checks the window at press time, so a resize or rotation between presses is honored", async () => {
    const matching = stubMatchMedia([PHONE_QUERY]);
    const user = userEvent.setup();
    const onDismiss = vi.fn();
    render(
      <>
        <SearchField expanded onDismiss={onDismiss}>{results}</SearchField>
        <p>Elsewhere</p>
      </>
    );
    await user.click(screen.getByText("Elsewhere"));
    expect(onDismiss).not.toHaveBeenCalled();
    // The window grows past PHONE without a re-render
    matching.length = 0;
    await user.click(screen.getByText("Elsewhere"));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it("does not call matchMedia while the panel is closed", () => {
    stubMatchMedia([PHONE_QUERY]);
    const { rerender } = render(<SearchField onDismiss={vi.fn()}>{results}</SearchField>);
    rerender(<SearchField onDismiss={vi.fn()} defaultValue="x">{results}</SearchField>);
    expect(window.matchMedia).not.toHaveBeenCalled();
  });
});

describe("SearchField - focus on open", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  // A separate trigger button next to the field, focused before the results open
  function renderTrigger() {
    const view = render(
      <>
        <button>Open</button>
        <SearchField onDismiss={vi.fn()}>{results}</SearchField>
      </>
    );
    const open = () =>
      view.rerender(
        <>
          <button>Open</button>
          <SearchField expanded onDismiss={vi.fn()}>{results}</SearchField>
        </>
      );
    return { open };
  }

  it("moves focus to the input when the results open full screen", () => {
    stubMatchMedia([PHONE_QUERY]);
    const { open } = renderTrigger();
    screen.getByRole("button", { name: "Open" }).focus();
    open();
    expect(screen.getByRole("searchbox")).toHaveFocus();
  });

  it("leaves focus alone when the results open docked", () => {
    stubMatchMedia([]);
    const { open } = renderTrigger();
    screen.getByRole("button", { name: "Open" }).focus();
    open();
    expect(screen.getByRole("button", { name: "Open" })).toHaveFocus();
  });

  it("does not check the window when focus is already in the field", () => {
    stubMatchMedia([PHONE_QUERY]);
    const { open } = renderTrigger();
    screen.getByRole("searchbox").focus();
    open();
    expect(window.matchMedia).not.toHaveBeenCalled();
    expect(screen.getByRole("searchbox")).toHaveFocus();
  });

  it("leaves focus alone without matchMedia (jsdom)", () => {
    expect(typeof window.matchMedia).not.toBe("function");
    const { open } = renderTrigger();
    screen.getByRole("button", { name: "Open" }).focus();
    open();
    expect(screen.getByRole("button", { name: "Open" })).toHaveFocus();
  });
});

describe("SearchField - listener and SSR safety", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("adds one pointerdown listener while open, keeps it across re-renders with the same onDismiss, and removes it on close", () => {
    const onDismiss = vi.fn();
    const add = vi.spyOn(document, "addEventListener");
    const remove = vi.spyOn(document, "removeEventListener");
    const countPointerDown = (spy: typeof add) => spy.mock.calls.filter(([type]) => type === "pointerdown").length;
    const { rerender } = render(<SearchField expanded onDismiss={onDismiss}>{results}</SearchField>);
    expect(countPointerDown(add)).toBe(1);
    rerender(<SearchField expanded onDismiss={onDismiss} defaultValue="x">{results}</SearchField>);
    expect(countPointerDown(add)).toBe(1);
    expect(countPointerDown(remove)).toBe(0);
    rerender(<SearchField onDismiss={onDismiss}>{results}</SearchField>);
    expect(countPointerDown(remove)).toBe(1);
    expect(countPointerDown(add)).toBe(1);
  });

  it("renders to a string on the server without touching window or matchMedia", () => {
    const matchMedia = vi.fn();
    vi.stubGlobal("matchMedia", matchMedia);
    const html = renderToString(<SearchField expanded onDismiss={vi.fn()}>{results}</SearchField>);
    expect(html).toContain("Search results");
    expect(html).toContain("max-[481px]:fixed");
    expect(html).toContain("bg-black/30");
    expect(matchMedia).not.toHaveBeenCalled();
  });

  it("does not throw when window.matchMedia is not a function", async () => {
    vi.stubGlobal("matchMedia", undefined);
    const user = userEvent.setup();
    const onDismiss = vi.fn();
    render(
      <>
        <SearchField expanded onDismiss={onDismiss}>{results}</SearchField>
        <p>Elsewhere</p>
      </>
    );
    await user.click(screen.getByText("Elsewhere"));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });
});
