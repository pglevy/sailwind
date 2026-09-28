import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import { FolderOpen, Home } from "lucide-react";
import { SiteNav } from "./SiteNav";
import type { SiteNavPage } from "./SiteNav";

const pages: SiteNavPage[] = [
  { label: "Home", icon: Home },
  {
    label: "Directory",
    icon: FolderOpen,
    isGroup: true,
    children: [{ label: "People" }, { label: "Teams" }],
  },
];

/** The wrapper element that animates is the trigger button's next sibling. */
const groupWrapper = (triggerName: string) => {
  const trigger = screen.getByRole("button", { name: new RegExp(triggerName, "i") });
  return { trigger, wrapper: trigger.nextElementSibling as HTMLElement };
};

describe("SiteNav - group expand/collapse animation", () => {
  it("wires the trigger to the group it controls", () => {
    render(<SiteNav pages={pages} />);
    const { trigger, wrapper } = groupWrapper("Directory");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger).toHaveAttribute("aria-controls", wrapper.id);
    expect(wrapper.id).toBeTruthy();
  });

  it("animates grid-template-rows and opacity instead of unmounting the subtree", async () => {
    render(<SiteNav pages={pages} />);
    const { trigger, wrapper } = groupWrapper("Directory");

    // Closed: zero-height row, faded out, but still in the DOM so it can animate
    expect(wrapper.className).toContain("grid-rows-[0fr]");
    expect(wrapper.className).toContain("opacity-0");
    expect(wrapper.textContent).toContain("People");

    await userEvent.click(trigger);

    expect(wrapper.className).toContain("grid-rows-[1fr]");
    expect(wrapper.className).toContain("opacity-100");
    expect(trigger).toHaveAttribute("aria-expanded", "true");

    await userEvent.click(trigger);

    expect(wrapper.className).toContain("grid-rows-[0fr]");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("expands on a 300ms cubic-bezier(0.32,0.72,0,1) transition", () => {
    render(<SiteNav pages={pages} />);
    const { wrapper } = groupWrapper("Directory");
    expect(wrapper.className).toContain("transition-[grid-template-rows,opacity]");
    expect(wrapper.className).toContain("duration-300");
    expect(wrapper.className).toContain("ease-[cubic-bezier(0.32,0.72,0,1)]");
  });

  it("lets the animated row shrink by keeping the inner list min-h-0 and clipped", () => {
    render(<SiteNav pages={pages} />);
    const { wrapper } = groupWrapper("Directory");
    const list = wrapper.querySelector("ul") as HTMLElement;
    expect(list.className).toContain("min-h-0");
    expect(list.className).toContain("overflow-hidden");
    // Keeps the implicit list role: role="group" here would orphan the child <li>s
    expect(list).not.toHaveAttribute("role");
  });

  it("rotates the chevron with the same timing", async () => {
    render(<SiteNav pages={pages} />);
    const { trigger } = groupWrapper("Directory");
    const chevron = trigger.querySelector(".lucide-chevron-right") as SVGElement;
    const cls = () => chevron.getAttribute("class") || "";

    expect(cls()).toContain("rotate-0");
    expect(cls()).toContain("duration-300");
    expect(cls()).toContain("ease-[cubic-bezier(0.32,0.72,0,1)]");

    await userEvent.click(trigger);
    expect(cls()).toContain("rotate-90");
  });

  it("honors prefers-reduced-motion", () => {
    render(<SiteNav pages={pages} />);
    const { trigger, wrapper } = groupWrapper("Directory");
    expect(wrapper.className).toContain("motion-reduce:transition-none");
    expect(
      trigger.querySelector(".lucide-chevron-right")?.getAttribute("class") || ""
    ).toContain("motion-reduce:transition-none");
  });
});

describe("SiteNav - collapsed group accessibility", () => {
  it("keeps collapsed children out of the accessibility tree and tab order", async () => {
    render(<SiteNav pages={pages} />);
    const { trigger, wrapper } = groupWrapper("Directory");

    expect(wrapper).toHaveAttribute("aria-hidden", "true");
    expect(wrapper).toHaveAttribute("inert");
    // Role queries ignore aria-hidden subtrees, so the child is not exposed
    expect(screen.queryByRole("button", { name: "People" })).not.toBeInTheDocument();

    await userEvent.click(trigger);

    expect(wrapper).not.toHaveAttribute("inert");
    expect(screen.getByRole("button", { name: "People" })).toBeInTheDocument();
  });

  it("opens the group when it is toggled with the keyboard", async () => {
    render(<SiteNav pages={pages} />);
    const { trigger } = groupWrapper("Directory");
    trigger.focus();
    await userEvent.keyboard("{Enter}");
    expect(trigger).toHaveAttribute("aria-expanded", "true");
  });
});

describe("SiteNav - initial group state", () => {
  it("starts expanded when a child is selected", () => {
    render(
      <SiteNav
        pages={[
          { label: "Home", icon: Home },
          {
            label: "Directory",
            icon: FolderOpen,
            isGroup: true,
            children: [{ label: "People", isSelected: true }, { label: "Teams" }],
          },
        ]}
      />
    );
    const { trigger, wrapper } = groupWrapper("Directory");
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(wrapper.className).toContain("grid-rows-[1fr]");
    expect(screen.getByRole("button", { name: "People" })).toHaveAttribute(
      "aria-current",
      "page"
    );
  });

  it("does not render the group subtree in the collapsed rail", () => {
    render(<SiteNav pages={pages} collapsed={true} />);
    const { trigger } = groupWrapper("Directory");
    expect(trigger.nextElementSibling).toBeNull();
    expect(trigger).not.toHaveAttribute("aria-expanded");
    expect(screen.queryByText("People")).not.toBeInTheDocument();
  });
});
