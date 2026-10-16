import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { MilestoneField } from "./MilestoneField";
import { LocaleProvider } from "../../i18n";

const steps = ["Card Details", "Form Review", "Authenticate OTP", "Create Code"];

describe("MilestoneField - visibility", () => {
  it("returns null when showWhen is false", () => {
    const { container } = render(<MilestoneField steps={steps} showWhen={false} />);
    expect(container.innerHTML).toBe("");
  });
});

describe("MilestoneField - list semantics", () => {
  it("renders steps as an ordered list", () => {
    render(<MilestoneField steps={steps} active={1} />);
    expect(screen.getByRole("list")).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(steps.length);
  });

  it("does not use the progressbar role, which would hide step labels from AT", () => {
    render(<MilestoneField steps={steps} active={1} />);
    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    steps.forEach((step) => {
      expect(screen.getByText(step)).toBeInTheDocument();
    });
  });

  it("exposes a labelled group for the step sequence", () => {
    render(<MilestoneField steps={steps} active={1} label="Application" />);
    expect(screen.getByRole("group", { name: "Application" })).toBeInTheDocument();
  });

  it("falls back to accessibilityText for the group name when the label is collapsed", () => {
    render(
      <MilestoneField
        steps={steps}
        active={1}
        labelPosition="COLLAPSED"
        accessibilityText="Application progress"
      />
    );
    expect(screen.getByRole("group", { name: "Application progress" })).toBeInTheDocument();
  });
});

describe("MilestoneField - current step", () => {
  it("marks only the active step with aria-current=step", () => {
    render(<MilestoneField steps={steps} active={2} />);
    const items = screen.getAllByRole("listitem");
    expect(items[2]).toHaveAttribute("aria-current", "step");
    [0, 1, 3].forEach((i) => {
      expect(items[i]).not.toHaveAttribute("aria-current");
    });
  });

  it("marks no step as current when active is null", () => {
    render(<MilestoneField steps={steps} active={null} />);
    screen.getAllByRole("listitem").forEach((item) => {
      expect(item).not.toHaveAttribute("aria-current");
    });
  });

  it("marks no step as current when all steps are complete", () => {
    render(<MilestoneField steps={steps} active={-1} />);
    screen.getAllByRole("listitem").forEach((item) => {
      expect(item).not.toHaveAttribute("aria-current");
    });
  });
});

describe("MilestoneField - state is not conveyed by color alone", () => {
  it("renders text for each step state in the NUMBERED style", () => {
    render(<MilestoneField steps={steps} active={2} stepStyle="NUMBERED" />);
    expect(screen.getAllByText("Completed")).toHaveLength(2);
    expect(screen.getAllByText("In Progress")).toHaveLength(1);
    expect(screen.getAllByText("Pending")).toHaveLength(1);
  });

  it("keeps state text for screen readers when status text is hidden", () => {
    render(
      <MilestoneField steps={steps} active={2} stepStyle="NUMBERED" showStepStatus={false} />
    );
    expect(screen.getAllByText("Completed")).toHaveLength(2);
    expect(screen.getAllByText("In Progress")).toHaveLength(1);
  });

  it("renders state text in the MINIMAL style", () => {
    render(<MilestoneField steps={steps} active={1} stepStyle="MINIMAL" />);
    expect(screen.getAllByText("Completed")).toHaveLength(1);
    expect(screen.getAllByText("In Progress")).toHaveLength(1);
    expect(screen.getAllByText("Pending")).toHaveLength(2);
  });

  it("renders state text in the legacy DOT style", () => {
    render(<MilestoneField steps={steps} active={1} stepStyle="DOT" />);
    expect(screen.getAllByText("Completed")).toHaveLength(1);
    expect(screen.getAllByText("In Progress")).toHaveLength(1);
  });

  it("supports custom status wording", () => {
    render(
      <MilestoneField
        steps={steps}
        active={1}
        statusLabels={{ completed: "Done", current: "Active", future: "Not started" }}
      />
    );
    expect(screen.getByText("Done")).toBeInTheDocument();
    expect(screen.getByText("Active")).toBeInTheDocument();
    expect(screen.getAllByText("Not started")).toHaveLength(2);
  });

  it("announces overall position for screen readers", () => {
    render(<MilestoneField steps={steps} active={2} />);
    expect(
      screen.getByText("Step 3 of 4: Authenticate OTP.")
    ).toBeInTheDocument();
  });
});

describe("MilestoneField - linked steps", () => {
  it("renders linked steps as buttons with a descriptive accessible name", () => {
    render(
      <MilestoneField
        steps={steps}
        active={1}
        links={steps.map(() => ({ onClick: () => {} }))}
      />
    );
    expect(
      screen.getByRole("button", { name: "Card Details, Completed, step 1 of 4" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Form Review, In Progress, step 2 of 4" })
    ).toBeInTheDocument();
  });

  it("calls the link handler when a step is activated by keyboard", async () => {
    const onClick = vi.fn();
    render(
      <MilestoneField steps={steps} active={1} links={[{ onClick }]} stepStyle="MINIMAL" />
    );
    const button = screen.getByRole("button", { name: /card details/i });
    button.focus();
    await userEvent.keyboard("{Enter}");
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("supports saveInto as the link handler", async () => {
    const saveInto = vi.fn();
    render(<MilestoneField steps={steps} active={1} links={[{ saveInto, value: "a" }]} />);
    await userEvent.click(screen.getByRole("button", { name: /card details/i }));
    expect(saveInto).toHaveBeenCalledWith("a");
  });
});

describe("MilestoneField - step numbering", () => {
  it("renders STEP captions by default in the NUMBERED style", () => {
    render(<MilestoneField steps={steps} active={1} stepStyle="NUMBERED" />);
    expect(screen.getByText("Step 1")).toBeInTheDocument();
    expect(screen.getByText("Step 4")).toBeInTheDocument();
  });

  it("hides STEP captions when showStepNumbers is false", () => {
    render(
      <MilestoneField steps={steps} active={1} stepStyle="NUMBERED" showStepNumbers={false} />
    );
    expect(screen.queryByText("Step 1")).not.toBeInTheDocument();
  });
});

describe("MilestoneField - defaults", () => {
  it("keeps LINE as the default step style so existing projects don't change", () => {
    render(<MilestoneField steps={steps} active={1} />);
    // LINE has no "Step n" captions, no status text beside the label, and numbers its circles
    expect(screen.queryByText("Step 1")).not.toBeInTheDocument();
    expect(document.querySelector(".rounded-full.border-2")).not.toBeNull();
  });
});

describe("MilestoneField - list role", () => {
  it("sets role=list explicitly, since list-none drops list semantics in Safari/VoiceOver", () => {
    const { container } = render(<MilestoneField steps={steps} active={1} />);
    const list = container.querySelector("ol");
    expect(list).toHaveClass("list-none");
    expect(list).toHaveAttribute("role", "list");
  });
});

describe("MilestoneField - localization", () => {
  it("reads its default wording from the locale bundle, in English with no provider", () => {
    render(<MilestoneField steps={steps} active={1} stepStyle="NUMBERED" />);
    expect(screen.getByText("Step 1")).toBeInTheDocument();
    expect(screen.getByText("In Progress")).toBeInTheDocument();
    expect(screen.getByText("Step 2 of 4: Form Review.")).toBeInTheDocument();
  });

  it("builds the screen reader summaries from interpolated phrases", () => {
    const { rerender } = render(<MilestoneField steps={steps} active={null} />);
    expect(screen.getByText("Not started. 4 steps.")).toBeInTheDocument();
    rerender(<MilestoneField steps={steps} active={-1} />);
    expect(screen.getByText("All 4 steps completed.")).toBeInTheDocument();
    rerender(<MilestoneField steps={steps} active={9} />);
    expect(screen.getByText("4 steps.")).toBeInTheDocument();
  });

  it("names the group Progress when it has no label", () => {
    render(<MilestoneField steps={steps} active={1} />);
    expect(screen.getByRole("group", { name: "Progress" })).toBeInTheDocument();
  });

  it("still lets statusLabels override the bundle wording", () => {
    render(
      <MilestoneField
        steps={steps}
        active={1}
        stepStyle="NUMBERED"
        statusLabels={{ current: "Working" }}
      />
    );
    expect(screen.getByText("Working")).toBeInTheDocument();
    expect(screen.getByText("Completed")).toBeInTheDocument();
  });

  it("renders without a LocaleProvider and inside one", () => {
    render(
      <LocaleProvider locale="en-US">
        <MilestoneField steps={steps} active={1} stepStyle="NUMBERED" />
      </LocaleProvider>
    );
    expect(screen.getByText("Step 1")).toBeInTheDocument();
  });
});
