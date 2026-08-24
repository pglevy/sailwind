import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { TagField } from "./TagField";

describe("TagField - visibility", () => {
  it("returns null when showWhen is false", () => {
    const { container } = render(
      <TagField tags={[{ text: "Active" }]} showWhen={false} />
    );
    expect(container.innerHTML).toBe("");
  });

  it("renders when showWhen is true (default)", () => {
    render(<TagField tags={[{ text: "Active" }]} />);
    expect(screen.getByRole("list")).toBeInTheDocument();
  });

  it("filters out tags with showWhen=false", () => {
    render(
      <TagField
        tags={[
          { text: "Visible" },
          { text: "Hidden", showWhen: false },
        ]}
      />
    );
    expect(screen.getByText("Visible")).toBeInTheDocument();
    expect(screen.queryByText("Hidden")).not.toBeInTheDocument();
  });

  it("filters out tags with empty text", () => {
    render(<TagField tags={[{ text: "" }, { text: "Kept" }]} />);
    expect(screen.getAllByRole("listitem")).toHaveLength(1);
  });

  it("does not render the tag list container when there are no visible tags", () => {
    render(<TagField tags={[]} />);
    expect(screen.queryByRole("list")).not.toBeInTheDocument();
  });
});

describe("TagField - rendering", () => {
  it("renders all tag text", () => {
    render(
      <TagField
        tags={[{ text: "Active" }, { text: "Approved" }, { text: "Rejected" }]}
      />
    );
    expect(screen.getByText("Active")).toBeInTheDocument();
    expect(screen.getByText("Approved")).toBeInTheDocument();
    expect(screen.getByText("Rejected")).toBeInTheDocument();
  });

  it("renders the correct number of listitem elements", () => {
    render(<TagField tags={[{ text: "A" }, { text: "B" }]} />);
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
  });

  it("renders label text when provided", () => {
    render(<TagField tags={[{ text: "Active" }]} label="Status" />);
    expect(screen.getByText("Status")).toBeInTheDocument();
  });

  it("renders as an anchor when link is provided", () => {
    render(<TagField tags={[{ text: "Active", link: "/status" }]} />);
    const item = screen.getByText("Active").closest("a");
    expect(item).toHaveAttribute("href", "/status");
  });

  it("renders as a span when no link is provided", () => {
    render(<TagField tags={[{ text: "Active" }]} />);
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("applies tooltip as title and aria-label", () => {
    render(<TagField tags={[{ text: "Active", tooltip: "Currently active" }]} />);
    const item = screen.getByText("Active").closest('[role="listitem"]');
    expect(item).toHaveAttribute("title", "Currently active");
    expect(item).toHaveAttribute("aria-label", "Currently active");
  });
});

describe("TagField - size", () => {
  it("defaults to STANDARD size classes", () => {
    render(<TagField tags={[{ text: "Active" }]} />);
    const item = screen.getByText("Active").closest('[role="listitem"]');
    expect(item).toHaveClass("text-base");
  });

  it("applies SMALL size classes", () => {
    render(<TagField tags={[{ text: "Active" }]} size="SMALL" />);
    const item = screen.getByText("Active").closest('[role="listitem"]');
    expect(item).toHaveClass("text-xs");
  });

  it("applies LARGE size classes", () => {
    render(<TagField tags={[{ text: "Active" }]} size="LARGE" />);
    const item = screen.getByText("Active").closest('[role="listitem"]');
    expect(item).toHaveClass("text-xl");
  });
});

describe("TagField - icons", () => {
  it("renders an icon when icon is provided", () => {
    const { container } = render(
      <TagField tags={[{ text: "Active", icon: "loader-circle" }]} />
    );
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("does not render an icon when icon is omitted", () => {
    const { container } = render(<TagField tags={[{ text: "Active" }]} />);
    expect(container.querySelector("svg")).not.toBeInTheDocument();
  });

  it("marks the icon as aria-hidden so it isn't announced twice", () => {
    const { container } = render(
      <TagField tags={[{ text: "Active", icon: "loader-circle" }]} />
    );
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("aria-hidden", "true");
  });

  it("places the icon before the text by default (iconPosition START)", () => {
    const { container } = render(
      <TagField tags={[{ text: "Active", icon: "loader-circle" }]} />
    );
    const item = container.querySelector('[role="listitem"]');
    const firstChild = item?.firstElementChild;
    expect(firstChild?.tagName.toLowerCase()).toBe("svg");
  });

  it("places the icon after the text when iconPosition is END", () => {
    const { container } = render(
      <TagField tags={[{ text: "Active", icon: "loader-circle", iconPosition: "END" }]} />
    );
    const item = container.querySelector('[role="listitem"]');
    const lastChild = item?.lastElementChild;
    expect(lastChild?.tagName.toLowerCase()).toBe("svg");
  });

  it("icon inherits the tag's text color (no separate icon color prop)", () => {
    const { container } = render(
      <TagField
        tags={[{ text: "Active", icon: "loader-circle", textColor: "NEGATIVE" }]}
      />
    );
    const item = container.querySelector('[role="listitem"]');
    const svg = container.querySelector("svg");
    // The icon has no explicit color class/style — it inherits `currentColor`
    // from the text color class applied to the parent tag element.
    expect(item).toHaveClass("text-red-700");
    expect(svg).not.toHaveAttribute("style");
  });

  it("scales icon size up for LARGE tags", () => {
    const { container: small } = render(
      <TagField tags={[{ text: "Active", icon: "loader-circle" }]} size="SMALL" />
    );
    const { container: large } = render(
      <TagField tags={[{ text: "Active", icon: "loader-circle" }]} size="LARGE" />
    );
    const smallSvg = small.querySelector("svg");
    const largeSvg = large.querySelector("svg");
    const smallWidth = Number(smallSvg?.getAttribute("width"));
    const largeWidth = Number(largeSvg?.getAttribute("width"));
    expect(largeWidth).toBeGreaterThan(smallWidth);
  });

  it("warns and skips rendering when icon name is not a valid Lucide icon", () => {
    const { container } = render(
      <TagField tags={[{ text: "Active", icon: "not-a-real-icon-xyz" }]} />
    );
    expect(container.querySelector("svg")).not.toBeInTheDocument();
    expect(screen.getByText("Active")).toBeInTheDocument();
  });
});

describe("TagField - icon-adjacent padding", () => {
  it("does not apply inline padding overrides when there is no icon", () => {
    render(<TagField tags={[{ text: "Active" }]} />);
    const item = screen.getByText("Active").closest('[role="listitem"]') as HTMLElement;
    expect(item.style.paddingLeft).toBe("");
    expect(item.style.paddingRight).toBe("");
  });

  it("tightens left padding when icon is at START (default)", () => {
    render(<TagField tags={[{ text: "Active", icon: "loader-circle" }]} />);
    const item = screen.getByText("Active").closest('[role="listitem"]') as HTMLElement;
    // STANDARD base px-4 (16px) tightens to 14px on the icon side only
    expect(item.style.paddingLeft).toBe("0.875rem");
    expect(item.style.paddingRight).toBe("");
  });

  it("tightens right padding when icon is at END", () => {
    render(
      <TagField
        tags={[{ text: "Active", icon: "loader-circle", iconPosition: "END" }]}
      />
    );
    const item = screen.getByText("Active").closest('[role="listitem"]') as HTMLElement;
    expect(item.style.paddingRight).toBe("0.875rem");
    expect(item.style.paddingLeft).toBe("");
  });

  it("scales the tightened padding value per tag size", () => {
    const { container: small } = render(
      <TagField tags={[{ text: "Active", icon: "loader-circle" }]} size="SMALL" />
    );
    const { container: large } = render(
      <TagField tags={[{ text: "Active", icon: "loader-circle" }]} size="LARGE" />
    );
    const smallItem = small.querySelector('[role="listitem"]') as HTMLElement;
    const largeItem = large.querySelector('[role="listitem"]') as HTMLElement;
    expect(smallItem.style.paddingLeft).toBe("0.375rem"); // SMALL px-2 (8px) → 6px
    expect(largeItem.style.paddingLeft).toBe("1.125rem"); // LARGE px-5 (20px) → 18px
  });
});

describe("TagField - accessibility", () => {
  it("renders the tag list with role='list' and items with role='listitem'", () => {
    render(<TagField tags={[{ text: "Active" }, { text: "Approved" }]} />);
    expect(screen.getByRole("list")).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
  });

  it("applies accessibilityText as aria-label on the root", () => {
    render(
      <TagField tags={[{ text: "Active" }]} accessibilityText="Status tags" />
    );
    expect(screen.getByLabelText("Status tags")).toBeInTheDocument();
  });

  it("tag text remains visible to screen readers even with an icon present", () => {
    render(<TagField tags={[{ text: "Active", icon: "loader-circle" }]} />);
    // The accessible name comes from the visible text node, not the hidden icon.
    expect(screen.getByText("Active")).toBeInTheDocument();
  });
});
