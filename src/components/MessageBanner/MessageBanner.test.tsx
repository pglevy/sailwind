import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { MessageBanner } from "./MessageBanner";

describe("MessageBanner - visibility", () => {
  it("returns null when showWhen is false", () => {
    const { container } = render(
      <MessageBanner primaryText="Hidden" showWhen={false} />
    );
    expect(container.innerHTML).toBe("");
  });

  it("renders when showWhen is true (default)", () => {
    render(<MessageBanner primaryText="Visible" />);
    expect(screen.getByText("Visible")).toBeInTheDocument();
  });
});

describe("MessageBanner - content rendering", () => {
  it("renders primary text", () => {
    render(<MessageBanner primaryText="Alert" />);
    expect(screen.getByText("Alert")).toBeInTheDocument();
  });

  it("renders secondary text", () => {
    render(<MessageBanner secondaryText="Details here" />);
    expect(screen.getByText("Details here")).toBeInTheDocument();
  });

  it("renders both primary and secondary text", () => {
    render(<MessageBanner primaryText="Title" secondaryText="Description" />);
    expect(screen.getByText("Title")).toBeInTheDocument();
    expect(screen.getByText("Description")).toBeInTheDocument();
  });
});

describe("MessageBanner - close button", () => {
  it("does not render close button by default", () => {
    render(<MessageBanner primaryText="Info" />);
    expect(screen.queryByRole("button", { name: "Close banner" })).not.toBeInTheDocument();
  });

  it("renders close button when showCloseButton is true", () => {
    render(<MessageBanner primaryText="Info" showCloseButton />);
    expect(screen.getByRole("button", { name: "Close banner" })).toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<MessageBanner primaryText="Info" showCloseButton onClose={onClose} />);
    await user.click(screen.getByRole("button", { name: "Close banner" }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("renders close button without onClose handler without error", () => {
    render(<MessageBanner primaryText="Info" showCloseButton />);
    expect(screen.getByRole("button", { name: "Close banner" })).toBeInTheDocument();
  });
});

describe("MessageBanner - action buttons", () => {
  it("does not render buttons when buttons prop is omitted", () => {
    render(<MessageBanner primaryText="Info" />);
    expect(screen.queryByRole("group")).not.toBeInTheDocument();
  });

  it("does not render buttons when buttons array is empty", () => {
    render(<MessageBanner primaryText="Info" buttons={[]} />);
    expect(screen.queryByRole("group")).not.toBeInTheDocument();
  });

  it("renders buttons when buttons prop is provided", () => {
    render(
      <MessageBanner
        primaryText="Action needed"
        buttons={[
          { label: "Retry", style: "SOLID", color: "ACCENT", size: "SMALL" },
        ]}
      />
    );
    expect(screen.getByRole("button", { name: "Retry" })).toBeInTheDocument();
  });

  it("renders multiple buttons", () => {
    render(
      <MessageBanner
        primaryText="Review"
        buttons={[
          { label: "Accept", style: "SOLID", color: "POSITIVE", size: "SMALL" },
          { label: "Reject", style: "OUTLINE", color: "NEGATIVE", size: "SMALL" },
        ]}
      />
    );
    expect(screen.getByRole("button", { name: "Accept" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Reject" })).toBeInTheDocument();
  });

  it("button click handlers fire correctly", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <MessageBanner
        primaryText="Action"
        buttons={[{ label: "Do it", onClick, size: "SMALL" }]}
      />
    );
    await user.click(screen.getByRole("button", { name: "Do it" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});

describe("MessageBanner - buttons and close together", () => {
  it("renders both action buttons and close button", () => {
    render(
      <MessageBanner
        primaryText="Update available"
        buttons={[{ label: "Update", style: "SOLID", color: "ACCENT", size: "SMALL" }]}
        showCloseButton
        onClose={() => {}}
      />
    );
    expect(screen.getByRole("button", { name: "Update" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Close banner" })).toBeInTheDocument();
  });

  it("close and action buttons fire independently", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const onAction = vi.fn();
    render(
      <MessageBanner
        primaryText="Test"
        buttons={[{ label: "Action", onClick: onAction, size: "SMALL" }]}
        showCloseButton
        onClose={onClose}
      />
    );
    await user.click(screen.getByRole("button", { name: "Action" }));
    expect(onAction).toHaveBeenCalledTimes(1);
    expect(onClose).not.toHaveBeenCalled();

    await user.click(screen.getByRole("button", { name: "Close banner" }));
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onAction).toHaveBeenCalledTimes(1);
  });
});
