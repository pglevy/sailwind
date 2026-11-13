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

  it("calls the link handler with the link value when a step is activated by keyboard", async () => {
    const onClick = vi.fn();
    render(
      <MilestoneField steps={steps} active={1} links={[{ onClick, value: "a" }]} stepStyle="MINIMAL" />
    );
    const button = screen.getByRole("button", { name: /card details/i });
    button.focus();
    await userEvent.keyboard("{Enter}");
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onClick).toHaveBeenCalledWith("a");
  });

  it("supports saveInto as the link handler", async () => {
    const saveInto = vi.fn();
    render(<MilestoneField steps={steps} active={1} links={[{ saveInto, value: "a" }]} />);
    await userEvent.click(screen.getByRole("button", { name: /card details/i }));
    expect(saveInto).toHaveBeenCalledWith("a");
  });

  it("calls onClick instead of saveInto when a link has both", async () => {
    const onClick = vi.fn();
    const saveInto = vi.fn();
    render(<MilestoneField steps={steps} active={1} links={[{ onClick, saveInto, value: "a" }]} />);
    await userEvent.click(screen.getByRole("button", { name: /card details/i }));
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onClick).toHaveBeenCalledWith("a");
    expect(saveInto).not.toHaveBeenCalled();
  });
  it("leaves a step unlinked when its link has showWhen false", async () => {
    const saveInto = vi.fn();
    render(
      <MilestoneField
        steps={steps}
        active={1}
        links={[{ saveInto, value: "a", showWhen: false }, { saveInto, value: "b" }]}
      />
    );
    expect(screen.queryByRole("button", { name: /card details/i })).not.toBeInTheDocument();
    expect(screen.getAllByRole("button")).toHaveLength(1);
    await userEvent.click(screen.getByText("Card Details"));
    expect(saveInto).not.toHaveBeenCalled();
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
  it("keeps LINE as the default step style", () => {
    render(<MilestoneField steps={steps} active={1} />);
    // NUMBERED shows "Step n" captions by default; LINE does not
    expect(screen.queryByText("Step 1")).not.toBeInTheDocument();
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

  it("renders its wording in the active locale", () => {
    render(
      <LocaleProvider locale="es">
        <MilestoneField steps={steps} active={1} stepStyle="NUMBERED" links={steps.map(() => ({ onClick: () => {} }))} />
      </LocaleProvider>
    );
    // Visible captions and status text
    expect(screen.getByText("Paso 1")).toBeInTheDocument();
    expect(screen.getByText("Completado")).toBeInTheDocument();
    expect(screen.getByText("En curso")).toBeInTheDocument();
    expect(screen.getAllByText("Pendiente")).toHaveLength(2);
    // Screen reader summary and the accessible name of a linked step
    expect(screen.getByText("Paso 2 de 4: Form Review.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Card Details, Completado, paso 1 de 4" })).toBeInTheDocument();
    // No English left over from the default bundle
    expect(screen.queryByText("In Progress")).not.toBeInTheDocument();
    expect(screen.queryByText("Step 1")).not.toBeInTheDocument();
  });

  it("names the group in the active locale when it has no label", () => {
    render(
      <LocaleProvider locale="es">
        <MilestoneField steps={steps} active={1} />
      </LocaleProvider>
    );
    expect(screen.getByRole("group", { name: "Progreso" })).toBeInTheDocument();
  });

  it("lets statusLabels win over the active locale", () => {
    render(
      <LocaleProvider locale="es">
        <MilestoneField steps={steps} active={1} stepStyle="NUMBERED" statusLabels={{ current: "Working" }} />
      </LocaleProvider>
    );
    expect(screen.getByText("Working")).toBeInTheDocument();
    expect(screen.getByText("Completado")).toBeInTheDocument();
  });
});

describe("MilestoneField - TIMELINE style", () => {
  const GREEN = "rgb(21, 128, 61)"; // POSITIVE, green-700
  const BLUE = "rgb(35, 34, 240)"; // ACCENT, blue-500

  const markers = (container: HTMLElement) =>
    Array.from(container.querySelectorAll<HTMLElement>("[data-timeline-marker]"));
  const fills = (container: HTMLElement) =>
    Array.from(container.querySelectorAll<HTMLElement>("[data-timeline-fill]"));

  it("marks each step as completed, current or future", () => {
    const { container } = render(<MilestoneField steps={steps} active={2} stepStyle="TIMELINE" />);
    expect(markers(container).map((m) => m.dataset.timelineMarker)).toEqual([
      "completed",
      "completed",
      "current",
      "future",
    ]);
  });

  it("makes completed steps green and the current step blue by default", () => {
    const { container } = render(<MilestoneField steps={steps} active={2} stepStyle="TIMELINE" />);
    const [first, , current, pending] = markers(container);
    expect(first.style.backgroundColor).toBe(GREEN);
    expect(current.style.backgroundColor).toBe(BLUE);
    // A pending step is an outline: white inside, gray edge
    expect(pending.style.backgroundColor).toBe("rgb(255, 255, 255)");
    expect(pending.style.borderColor).toBe("rgb(107, 114, 128)");
  });

  it("takes other colors from color and completedColor", () => {
    const { container } = render(
      <MilestoneField steps={steps} active={1} stepStyle="TIMELINE" color="#8B5CF6" completedColor="#0F766E" />
    );
    const [done, current] = markers(container);
    expect(done.style.backgroundColor).toBe("rgb(15, 118, 110)");
    expect(current.style.backgroundColor).toBe("rgb(139, 92, 246)");
  });

  it("shows a check only on a completed step", () => {
    const { container } = render(<MilestoneField steps={steps} active={1} stepStyle="TIMELINE" />);
    const [done, current, pending] = markers(container);
    const checkOf = (marker: HTMLElement) => marker.children[0] as HTMLElement;
    expect(checkOf(done).style.opacity).toBe("1");
    expect(checkOf(current).style.opacity).toBe("0");
    expect(checkOf(pending).style.opacity).toBe("0");
  });

  it("gives the current step a halo and no other step", () => {
    const { container } = render(<MilestoneField steps={steps} active={1} stepStyle="TIMELINE" />);
    const [done, current, pending] = markers(container);
    expect(current.style.boxShadow).toContain("5px");
    expect(done.style.boxShadow).toContain("0px");
    expect(pending.style.boxShadow).toContain("0px");
  });

  it("fills the connector from every step that is done or current, and not from a pending step", () => {
    const { container } = render(<MilestoneField steps={steps} active={2} stepStyle="TIMELINE" orientation="VERTICAL" />);
    // Four steps have three connectors: after steps 1, 2 and 3
    expect(fills(container).map((f) => f.dataset.timelineFill)).toEqual(["filled", "filled", "filled"]);
    const { container: other } = render(<MilestoneField steps={steps} active={0} stepStyle="TIMELINE" orientation="VERTICAL" />);
    expect(fills(other).map((f) => f.dataset.timelineFill)).toEqual(["filled", "empty", "empty"]);
  });

  it("colors a finished connector green and the current one blue", () => {
    const { container } = render(<MilestoneField steps={steps} active={1} stepStyle="TIMELINE" orientation="VERTICAL" />);
    const [afterDone, afterCurrent] = fills(container);
    expect(afterDone.style.backgroundColor).toBe(GREEN);
    expect(afterCurrent.style.backgroundColor).toBe(BLUE);
  });

  it("grows a vertical connector downward and a horizontal one to the right", () => {
    const { container: vertical } = render(<MilestoneField steps={steps} active={0} stepStyle="TIMELINE" orientation="VERTICAL" />);
    expect(fills(vertical)[1].style.transform).toBe("scaleY(0)");
    const { container: horizontal } = render(<MilestoneField steps={steps} active={0} stepStyle="TIMELINE" orientation="HORIZONTAL" />);
    expect(fills(horizontal)[1].style.transform).toBe("scaleX(0)");
  });

  it("keeps the same elements when the step changes, so the browser can animate between states", () => {
    const { container, rerender } = render(<MilestoneField steps={steps} active={0} stepStyle="TIMELINE" orientation="VERTICAL" />);
    const before = markers(container);
    const fillBefore = fills(container)[0];
    expect(before[0].dataset.timelineMarker).toBe("current");

    rerender(<MilestoneField steps={steps} active={1} stepStyle="TIMELINE" orientation="VERTICAL" />);
    const after = markers(container);
    expect(after[0]).toBe(before[0]);
    expect(after[1]).toBe(before[1]);
    expect(fills(container)[0]).toBe(fillBefore);
    expect(after[0].dataset.timelineMarker).toBe("completed");
    expect(after[0].style.backgroundColor).toBe(GREEN);
    expect(after[1].dataset.timelineMarker).toBe("current");
  });

  it("turns the transitions off for people who prefer reduced motion", () => {
    const { container } = render(<MilestoneField steps={steps} active={1} stepStyle="TIMELINE" orientation="VERTICAL" />);
    const animated = [markers(container)[0], markers(container)[0].children[0], markers(container)[0].children[1], fills(container)[0]];
    for (const element of animated) {
      expect(element.className).toContain("motion-reduce:transition-none");
    }
  });

  it("shows a description under each title when stepDescriptions is given", () => {
    render(
      <MilestoneField
        steps={steps}
        active={1}
        stepStyle="TIMELINE"
        stepDescriptions={["Enter your card", undefined as unknown as string, "Check the code"]}
      />
    );
    expect(screen.getByText("Enter your card")).toBeInTheDocument();
    expect(screen.getByText("Check the code")).toBeInTheDocument();
  });

  it("shows every step as completed when active is -1, and as pending when it is null", () => {
    const { container, rerender } = render(<MilestoneField steps={steps} active={-1} stepStyle="TIMELINE" />);
    expect(markers(container).every((m) => m.dataset.timelineMarker === "completed")).toBe(true);
    rerender(<MilestoneField steps={steps} active={null} stepStyle="TIMELINE" />);
    expect(markers(container).every((m) => m.dataset.timelineMarker === "future")).toBe(true);
  });

  it("never conveys state by color alone: each step has state text and a check or a mark", () => {
    render(<MilestoneField steps={steps} active={1} stepStyle="TIMELINE" />);
    expect(screen.getAllByText("Completed")).toHaveLength(1);
    expect(screen.getAllByText("In Progress")).toHaveLength(1);
    expect(screen.getAllByText("Pending")).toHaveLength(2);
  });

  it("hides the markers from assistive technology and marks only the current step", () => {
    const { container } = render(<MilestoneField steps={steps} active={2} stepStyle="TIMELINE" />);
    for (const marker of markers(container)) expect(marker).toHaveAttribute("aria-hidden", "true");
    expect(container.querySelectorAll('[aria-current="step"]')).toHaveLength(1);
    expect(screen.getAllByRole("listitem")).toHaveLength(steps.length);
  });

  it("makes finished steps buttons when linked", async () => {
    const onClick = vi.fn();
    render(
      <MilestoneField
        steps={steps}
        active={2}
        stepStyle="TIMELINE"
        orientation="VERTICAL"
        links={[{ onClick }, { showWhen: false }, { showWhen: false }, { showWhen: false }]}
      />
    );
    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(1);
    await userEvent.click(buttons[0]);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("leaves the DOT, CHEVRON and MINIMAL styles alone", () => {
    for (const stepStyle of ["DOT", "CHEVRON", "MINIMAL"] as const) {
      const { container, unmount } = render(<MilestoneField steps={steps} active={1} stepStyle={stepStyle} />);
      expect(container.querySelectorAll("[data-timeline-marker]")).toHaveLength(0);
      unmount();
    }
  });
});

describe("MilestoneField - NUMBERED style markers", () => {
  const GREEN = "rgb(21, 128, 61)";
  const BLUE = "rgb(35, 34, 240)";
  const markers = (container: HTMLElement) =>
    Array.from(container.querySelectorAll<HTMLElement>("[data-timeline-marker]"));
  const fills = (container: HTMLElement) =>
    Array.from(container.querySelectorAll<HTMLElement>("[data-timeline-fill]"));
  const numberOf = (marker: HTMLElement) => marker.children[1] as HTMLElement;

  it("uses a marker for each step, green when completed and blue when current", () => {
    const { container } = render(<MilestoneField steps={steps} active={2} stepStyle="NUMBERED" />);
    const all = markers(container);
    expect(all.map((m) => m.dataset.timelineMarker)).toEqual(["completed", "completed", "current", "future"]);
    expect(all[0].style.backgroundColor).toBe(GREEN);
    expect(all[2].style.backgroundColor).toBe(BLUE);
    expect(all[3].style.backgroundColor).toBe("rgb(255, 255, 255)");
  });

  it("shows the step's number on the current and pending steps, and a check on finished ones", () => {
    const { container } = render(<MilestoneField steps={steps} active={1} stepStyle="NUMBERED" />);
    const [done, current, pending] = markers(container);
    expect(numberOf(current).textContent).toBe("2");
    expect(numberOf(current).style.opacity).toBe("1");
    expect(numberOf(pending).textContent).toBe("3");
    expect(numberOf(pending).style.opacity).toBe("1");
    // The number is still there on a finished step, faded out under the check
    expect(numberOf(done).style.opacity).toBe("0");
    expect((done.children[0] as HTMLElement).style.opacity).toBe("1");
  });

  it("joins the steps with a connector that fills as the steps are done, not a dashed line", () => {
    const { container } = render(
      <MilestoneField steps={steps} active={1} stepStyle="NUMBERED" orientation="VERTICAL" />
    );
    expect(fills(container).map((f) => f.dataset.timelineFill)).toEqual(["filled", "filled", "empty"]);
    expect(container.querySelector(".border-dashed")).toBeNull();
    expect(fills(container)[0].style.backgroundColor).toBe(GREEN);
    expect(fills(container)[1].style.backgroundColor).toBe(BLUE);
  });

  it("fills a horizontal connector sideways and a vertical one downward", () => {
    const { container: h } = render(<MilestoneField steps={steps} active={0} stepStyle="NUMBERED" />);
    expect(fills(h)[1].style.transform).toBe("scaleX(0)");
    const { container: v } = render(<MilestoneField steps={steps} active={0} stepStyle="NUMBERED" orientation="VERTICAL" />);
    expect(fills(v)[1].style.transform).toBe("scaleY(0)");
  });

  it("keeps the same elements when the step changes, so the browser can animate between states", () => {
    const { container, rerender } = render(<MilestoneField steps={steps} active={0} stepStyle="NUMBERED" />);
    const first = markers(container)[0];
    rerender(<MilestoneField steps={steps} active={1} stepStyle="NUMBERED" />);
    expect(markers(container)[0]).toBe(first);
    expect(first.dataset.timelineMarker).toBe("completed");
    expect(first.style.backgroundColor).toBe(GREEN);
  });

  it("still shows the STEP caption and status text, and is the same without them in the compact form", () => {
    const { rerender } = render(<MilestoneField steps={steps} active={1} stepStyle="NUMBERED" />);
    expect(screen.getByText("Step 2")).toBeInTheDocument();
    expect(screen.getByText("In Progress")).toBeInTheDocument();
    rerender(<MilestoneField steps={steps} active={1} stepStyle="NUMBERED" showStepNumbers={false} showStepStatus={false} />);
    expect(screen.queryByText("Step 2")).not.toBeInTheDocument();
    // The state is still there for a screen reader
    expect(screen.getByText("In Progress")).toHaveClass("sr-only");
  });

  it("turns the transitions off for people who prefer reduced motion", () => {
    const { container } = render(<MilestoneField steps={steps} active={1} stepStyle="NUMBERED" />);
    const marker = markers(container)[0];
    for (const element of [marker, marker.children[0], marker.children[1], fills(container)[0]]) {
      expect(element.className).toContain("motion-reduce:transition-none");
    }
  });

  it("takes the colors from color and completedColor", () => {
    const { container } = render(
      <MilestoneField steps={steps} active={1} stepStyle="NUMBERED" color="#8B5CF6" completedColor="#0F766E" />
    );
    const [done, current] = markers(container);
    expect(done.style.backgroundColor).toBe("rgb(15, 118, 110)");
    expect(current.style.backgroundColor).toBe("rgb(139, 92, 246)");
  });
});

describe("MilestoneField - default (LINE) style markers and bar", () => {
  const GREEN = "rgb(21, 128, 61)";
  const BLUE = "rgb(35, 34, 240)";
  const markers = (container: HTMLElement) =>
    Array.from(container.querySelectorAll<HTMLElement>("[data-timeline-marker]"));
  const bar = (container: HTMLElement) => ({
    completed: container.querySelector<HTMLElement>('[data-line-fill="completed"]'),
    current: container.querySelector<HTMLElement>('[data-line-fill="current"]'),
  });

  it("is still the default style", () => {
    const { container } = render(<MilestoneField steps={steps} active={1} />);
    expect(markers(container)).toHaveLength(steps.length);
  });

  it("puts the step's number in a green (completed) or blue (current) marker", () => {
    const { container } = render(<MilestoneField steps={steps} active={2} />);
    const all = markers(container);
    expect(all[0].style.backgroundColor).toBe(GREEN);
    expect(all[2].style.backgroundColor).toBe(BLUE);
    expect((all[2].children[1] as HTMLElement).textContent).toBe("3");
    expect((all[3].children[1] as HTMLElement).textContent).toBe("4");
  });

  it.each([
    [null, 0, 0],
    [0, 0, 33.33],
    [1, 33.33, 66.67],
    [2, 66.67, 100],
    [3, 100, 100],
    [-1, 100, 100],
  ])("with active %s the green fill reaches %s% and the blue fill %s%", (active, green, blue) => {
    const { container } = render(<MilestoneField steps={steps} active={active} />);
    expect(parseFloat(bar(container).completed!.style.width)).toBeCloseTo(green, 1);
    expect(parseFloat(bar(container).current!.style.width)).toBeCloseTo(blue, 1);
  });

  it("draws the bar behind the markers and animates its width", () => {
    const { container } = render(<MilestoneField steps={steps} active={1} />);
    expect(bar(container).completed!.className).toContain("transition-[width,background-color]");
    expect(bar(container).completed!.className).toContain("motion-reduce:transition-none");
    expect(bar(container).completed!.style.backgroundColor).toBe(GREEN);
    expect(bar(container).current!.style.backgroundColor).toBe(BLUE);
  });

  it("has no bar in a vertical layout, as before", () => {
    const { container } = render(<MilestoneField steps={steps} active={1} orientation="VERTICAL" />);
    expect(bar(container).completed).toBeNull();
  });

  it("keeps the same marker elements when the step changes", () => {
    const { container, rerender } = render(<MilestoneField steps={steps} active={0} />);
    const first = markers(container)[0];
    rerender(<MilestoneField steps={steps} active={1} />);
    expect(markers(container)[0]).toBe(first);
    expect(first.dataset.timelineMarker).toBe("completed");
  });

  it("states each step's state as text, so it is not shown by color alone", () => {
    render(<MilestoneField steps={steps} active={1} />);
    expect(screen.getAllByText("Completed")).toHaveLength(1);
    expect(screen.getAllByText("In Progress")).toHaveLength(1);
    expect(screen.getAllByText("Pending")).toHaveLength(2);
  });
});
