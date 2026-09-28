import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { DialogField } from "./DialogField";

describe("DialogField - visibility", () => {
  it("returns null when showWhen is false", () => {
    const { container } = render(
      <DialogField showWhen={false}>
        <p>Content</p>
      </DialogField>
    );
    expect(container.innerHTML).toBe("");
  });

  it("renders when showWhen is true (default)", () => {
    const { container } = render(
      <DialogField open={true} title="Hello">
        <p>Content</p>
      </DialogField>
    );
    expect(container.innerHTML).not.toBe("");
  });
});

describe("DialogField - content rendering", () => {
  it("renders title when open", () => {
    render(
      <DialogField open={true} title="My Dialog">
        <p>Body</p>
      </DialogField>
    );
    expect(screen.getByText("My Dialog")).toBeInTheDocument();
  });

  it("renders description when open", () => {
    render(
      <DialogField open={true} title="T" description="Some description">
        <p>Body</p>
      </DialogField>
    );
    expect(screen.getByText("Some description")).toBeInTheDocument();
  });

  it("renders children content when open", () => {
    render(
      <DialogField open={true}>
        <p>Dialog body content</p>
      </DialogField>
    );
    expect(screen.getByText("Dialog body content")).toBeInTheDocument();
  });

  it("does not render dialog content when closed", () => {
    render(
      <DialogField open={false} title="Hidden">
        <p>Hidden content</p>
      </DialogField>
    );
    expect(screen.queryByText("Hidden")).not.toBeInTheDocument();
    expect(screen.queryByText("Hidden content")).not.toBeInTheDocument();
  });
});

describe("DialogField - close button", () => {
  it("renders close button by default", () => {
    render(
      <DialogField open={true} title="T">
        <p>Content</p>
      </DialogField>
    );
    expect(screen.getByRole("button", { name: "Close dialog" })).toBeInTheDocument();
  });

  it("hides close button when showCloseButton=false", () => {
    render(
      <DialogField open={true} title="T" showCloseButton={false}>
        <p>Content</p>
      </DialogField>
    );
    expect(screen.queryByRole("button", { name: "Close dialog" })).not.toBeInTheDocument();
  });

  it("calls onOpenChange(false) when close button is clicked", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <DialogField open={true} title="T" onOpenChange={onOpenChange}>
        <p>Content</p>
      </DialogField>
    );
    await user.click(screen.getByRole("button", { name: "Close dialog" }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("calls onClose when close button is clicked", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(
      <DialogField open={true} title="T" onClose={onClose}>
        <p>Content</p>
      </DialogField>
    );
    await user.click(screen.getByRole("button", { name: "Close dialog" }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

describe("DialogField - trigger mode", () => {
  it("renders trigger element", () => {
    render(
      <DialogField trigger={<button>Open</button>} title="T">
        <p>Content</p>
      </DialogField>
    );
    expect(screen.getByRole("button", { name: "Open" })).toBeInTheDocument();
  });

  it("opens dialog when trigger is clicked", async () => {
    const user = userEvent.setup();
    render(
      <DialogField trigger={<button>Open</button>} title="Triggered Dialog">
        <p>Dialog content</p>
      </DialogField>
    );
    expect(screen.queryByText("Triggered Dialog")).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Open" }));
    expect(screen.getByText("Triggered Dialog")).toBeInTheDocument();
    expect(screen.getByText("Dialog content")).toBeInTheDocument();
  });
});

describe("DialogField - keyboard / outside click", () => {
  it("closes on Escape key by default", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <DialogField open={true} title="T" onOpenChange={onOpenChange}>
        <p>Content</p>
      </DialogField>
    );
    await user.keyboard("{Escape}");
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("does not close on Escape when closeOnEscape=false", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <DialogField open={true} title="T" onOpenChange={onOpenChange} closeOnEscape={false}>
        <p>Content</p>
      </DialogField>
    );
    await user.keyboard("{Escape}");
    expect(onOpenChange).not.toHaveBeenCalled();
  });
});

describe("DialogField - width/height classes", () => {
  // Radix Dialog renders into a portal (document.body), not container
  const widthCases: Array<[string, string]> = [
    ["NARROW", "max-w-sm"],
    ["MEDIUM", "max-w-md"],
    ["MEDIUM_PLUS", "max-w-lg"],
    ["WIDE", "max-w-2xl"],
  ];

  widthCases.forEach(([width, expectedClass]) => {
    it(`width="${width}" applies ${expectedClass}`, () => {
      render(
        <DialogField open={true} title="T" width={width as any}>
          <p>Content</p>
        </DialogField>
      );
      const content = document.body.querySelector(`[class*="${expectedClass}"]`);
      expect(content).toBeInTheDocument();
    });
  });

  const heightCases: Array<[string, string]> = [
    ["SHORT", "h-[300px]"],
    ["MEDIUM", "h-[500px]"],
    ["TALL", "h-[700px]"],
  ];

  heightCases.forEach(([height, expectedClass]) => {
    it(`height="${height}" applies ${expectedClass}`, () => {
      render(
        <DialogField open={true} title="T" height={height as any}>
          <p>Content</p>
        </DialogField>
      );
      expect(document.body.innerHTML).toContain(expectedClass);
    });
  });
});

describe("DialogField - background", () => {
  it("defaults to the STANDARD opaque surface", () => {
    render(
      <DialogField open={true} title="T">
        <p>Content</p>
      </DialogField>
    );
    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("data-background", "standard");
    expect(dialog.className).toContain("bg-white");
    expect(dialog.className).not.toContain("backdrop-blur-xl");
  });

  it("applies the translucent glass surface when background is GLASS", () => {
    render(
      <DialogField open={true} title="T" background="GLASS">
        <p>Content</p>
      </DialogField>
    );
    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("data-background", "glass");
    expect(dialog.className).toContain("bg-white/70");
    expect(dialog.className).toContain("backdrop-blur-xl");
  });

  it("falls back to an opaque surface for reduced transparency and forced colors", () => {
    render(
      <DialogField open={true} title="T" background="GLASS">
        <p>Content</p>
      </DialogField>
    );
    const className = screen.getByRole("dialog").className;
    expect(className).toContain("[@media(prefers-reduced-transparency:reduce)]:bg-white");
    expect(className).toContain(
      "[@media(prefers-reduced-transparency:reduce)]:backdrop-blur-none"
    );
    expect(className).toContain("forced-colors:backdrop-blur-none");
  });

  it("keeps the description at full-strength text color on glass", () => {
    render(
      <DialogField open={true} title="T" description="Readable" background="GLASS">
        <p>Content</p>
      </DialogField>
    );
    expect(screen.getByText("Readable").className).toContain("text-gray-900");
  });
});
