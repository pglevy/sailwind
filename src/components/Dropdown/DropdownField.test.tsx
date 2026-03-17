import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { DropdownField } from "./DropdownField";
import { MultipleDropdownField } from "./MultipleDropdownField";

const choices = {
  choiceLabels: ["Red", "Green", "Blue"],
  choiceValues: ["red", "green", "blue"],
};

// Helper to open the dropdown
async function openDropdown(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole("button", { name: /select\.\.\.|red|green|blue/i }));
}

// ─── DropdownField (single-select) ───────────────────────────────────────────

describe("DropdownField - visibility", () => {
  it("returns null when showWhen is false", () => {
    const { container } = render(
      <DropdownField {...choices} showWhen={false} />
    );
    expect(container.innerHTML).toBe("");
  });

  it("renders when showWhen is true (default)", () => {
    render(<DropdownField {...choices} />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });
});

describe("DropdownField - rendering", () => {
  it("shows placeholder text when no value is selected", () => {
    render(<DropdownField {...choices} placeholder="Choose a color" />);
    expect(screen.getByText("Choose a color")).toBeInTheDocument();
  });

  it("shows default placeholder when no value and no placeholder prop", () => {
    render(<DropdownField {...choices} />);
    expect(screen.getByText("Select...")).toBeInTheDocument();
  });

  it("shows selected value label", () => {
    render(<DropdownField {...choices} value="green" />);
    expect(screen.getByText("Green")).toBeInTheDocument();
  });

  it("renders label when provided", () => {
    render(<DropdownField {...choices} label="Favorite Color" />);
    expect(screen.getByText("Favorite Color")).toBeInTheDocument();
  });

  it("renders instructions when provided", () => {
    render(<DropdownField {...choices} instructions="Pick one color" />);
    expect(screen.getByText("Pick one color")).toBeInTheDocument();
  });
});

describe("DropdownField - open/close", () => {
  it("opens listbox when trigger is clicked", async () => {
    const user = userEvent.setup();
    render(<DropdownField {...choices} />);
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    await user.click(screen.getByRole("button"));
    expect(screen.getByRole("listbox")).toBeInTheDocument();
  });

  it("shows all options when open", async () => {
    const user = userEvent.setup();
    render(<DropdownField {...choices} />);
    await user.click(screen.getByRole("button"));
    expect(screen.getByRole("option", { name: "Red" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Green" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Blue" })).toBeInTheDocument();
  });

  it("trigger button has aria-expanded=false when closed", () => {
    render(<DropdownField {...choices} />);
    expect(screen.getByRole("button")).toHaveAttribute("aria-expanded", "false");
  });

  it("trigger button has aria-expanded=true when open", async () => {
    const user = userEvent.setup();
    render(<DropdownField {...choices} />);
    await user.click(screen.getByRole("button"));
    expect(screen.getByRole("button", { expanded: true })).toBeInTheDocument();
  });
});

describe("DropdownField - selection", () => {
  it("calls onChange with selected value when an option is clicked", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<DropdownField {...choices} onChange={onChange} />);
    await user.click(screen.getByRole("button"));
    await user.click(screen.getByRole("option", { name: "Blue" }));
    expect(onChange).toHaveBeenCalledWith("blue");
  });

  it("calls saveInto when onChange is not provided", async () => {
    const user = userEvent.setup();
    const saveInto = vi.fn();
    render(<DropdownField {...choices} saveInto={saveInto} />);
    await user.click(screen.getByRole("button"));
    await user.click(screen.getByRole("option", { name: "Red" }));
    expect(saveInto).toHaveBeenCalledWith("red");
  });

  it("closes the dropdown after selecting an option", async () => {
    const user = userEvent.setup();
    render(<DropdownField {...choices} onChange={vi.fn()} />);
    await user.click(screen.getByRole("button"));
    await user.click(screen.getByRole("option", { name: "Green" }));
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("marks the selected option as aria-selected=true", async () => {
    const user = userEvent.setup();
    render(<DropdownField {...choices} value="red" />);
    await user.click(screen.getByRole("button"));
    expect(screen.getByRole("option", { name: "Red" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("option", { name: "Green" })).toHaveAttribute("aria-selected", "false");
  });
});

describe("DropdownField - clear button", () => {
  it("shows clear button when a value is selected", () => {
    render(<DropdownField {...choices} value="red" />);
    // The X icon is rendered as an SVG inside the trigger area
    const trigger = screen.getByRole("button");
    expect(trigger.querySelector("svg")).toBeInTheDocument();
  });

  it("calls onChange with null when clear is clicked", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<DropdownField {...choices} value="red" onChange={onChange} />);
    // The X icon is the first SVG in the trigger
    const svgs = screen.getByRole("button").querySelectorAll("svg");
    await user.click(svgs[0]);
    expect(onChange).toHaveBeenCalledWith(null);
  });
});

describe("DropdownField - disabled", () => {
  it("disables the trigger button when disabled=true", () => {
    render(<DropdownField {...choices} disabled={true} />);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("does not open when disabled", async () => {
    const user = userEvent.setup();
    render(<DropdownField {...choices} disabled={true} />);
    await user.click(screen.getByRole("button"));
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });
});

describe("DropdownField - validations", () => {
  it("renders validation messages", () => {
    render(
      <DropdownField {...choices} validations={["Required field", "Invalid value"]} />
    );
    expect(screen.getByText("Required field")).toBeInTheDocument();
    expect(screen.getByText("Invalid value")).toBeInTheDocument();
  });

  it("marks trigger as aria-invalid when validations are present", () => {
    render(<DropdownField {...choices} validations={["Error"]} />);
    expect(screen.getByRole("button")).toHaveAttribute("aria-invalid", "true");
  });

  it("renders requiredMessage when required and no value selected", () => {
    render(
      <DropdownField
        {...choices}
        required={true}
        requiredMessage="Please select a color"
      />
    );
    expect(screen.getByText("Please select a color")).toBeInTheDocument();
  });
});

describe("DropdownField - search", () => {
  it("shows search input when searchDisplay=ON", async () => {
    const user = userEvent.setup();
    render(<DropdownField {...choices} searchDisplay="ON" />);
    await user.click(screen.getByRole("button"));
    expect(screen.getByPlaceholderText("Search...")).toBeInTheDocument();
  });

  it("does not show search input when searchDisplay=OFF", async () => {
    const user = userEvent.setup();
    render(<DropdownField {...choices} searchDisplay="OFF" />);
    await user.click(screen.getByRole("button"));
    expect(screen.queryByPlaceholderText("Search...")).not.toBeInTheDocument();
  });

  it("filters options based on search term", async () => {
    const user = userEvent.setup();
    render(<DropdownField {...choices} searchDisplay="ON" />);
    await user.click(screen.getByRole("button"));
    await user.type(screen.getByPlaceholderText("Search..."), "blu");
    expect(screen.getByRole("option", { name: "Blue" })).toBeInTheDocument();
    expect(screen.queryByRole("option", { name: "Red" })).not.toBeInTheDocument();
    expect(screen.queryByRole("option", { name: "Green" })).not.toBeInTheDocument();
  });

  it("shows 'No results found' when search has no matches", async () => {
    const user = userEvent.setup();
    render(<DropdownField {...choices} searchDisplay="ON" />);
    await user.click(screen.getByRole("button"));
    await user.type(screen.getByPlaceholderText("Search..."), "zzz");
    expect(screen.getByText("No results found")).toBeInTheDocument();
  });

  it("shows search automatically when there are more than 11 choices", async () => {
    const user = userEvent.setup();
    const manyLabels = Array.from({ length: 12 }, (_, i) => `Option ${i + 1}`);
    const manyValues = Array.from({ length: 12 }, (_, i) => `opt${i + 1}`);
    render(
      <DropdownField
        choiceLabels={manyLabels}
        choiceValues={manyValues}
        searchDisplay="AUTO"
      />
    );
    await user.click(screen.getByRole("button"));
    expect(screen.getByPlaceholderText("Search...")).toBeInTheDocument();
  });

  it("does not show search automatically when there are 11 or fewer choices", async () => {
    const user = userEvent.setup();
    render(<DropdownField {...choices} searchDisplay="AUTO" />);
    await user.click(screen.getByRole("button"));
    expect(screen.queryByPlaceholderText("Search...")).not.toBeInTheDocument();
  });
});

// ─── MultipleDropdownField ────────────────────────────────────────────────────

describe("MultipleDropdownField - multi-select behavior", () => {
  it("renders with no selection by default", () => {
    render(<MultipleDropdownField {...choices} />);
    expect(screen.getByText("Select...")).toBeInTheDocument();
  });

  it("shows comma-separated labels for selected values", () => {
    render(<MultipleDropdownField {...choices} value={["red", "blue"]} />);
    expect(screen.getByText("Red, Blue")).toBeInTheDocument();
  });

  it("keeps dropdown open after selecting an option", async () => {
    const user = userEvent.setup();
    render(<MultipleDropdownField {...choices} onChange={vi.fn()} />);
    await user.click(screen.getByRole("button"));
    await user.click(screen.getByRole("option", { name: /Red/ }));
    expect(screen.getByRole("listbox")).toBeInTheDocument();
  });

  it("calls onChange with array containing selected value", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<MultipleDropdownField {...choices} value={[]} onChange={onChange} />);
    await user.click(screen.getByRole("button"));
    await user.click(screen.getByRole("option", { name: /Green/ }));
    expect(onChange).toHaveBeenCalledWith(["green"]);
  });

  it("calls onChange with value removed when already-selected option is clicked", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <MultipleDropdownField {...choices} value={["red", "green"]} onChange={onChange} />
    );
    await user.click(screen.getByRole("button"));
    await user.click(screen.getByRole("option", { name: /Red/ }));
    expect(onChange).toHaveBeenCalledWith(["green"]);
  });

  it("calls onChange with null when last selected item is deselected", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <MultipleDropdownField {...choices} value={["blue"]} onChange={onChange} />
    );
    await user.click(screen.getByRole("button"));
    await user.click(screen.getByRole("option", { name: /Blue/ }));
    expect(onChange).toHaveBeenCalledWith(null);
  });

  it("renders checkboxes inside options", async () => {
    const user = userEvent.setup();
    render(<MultipleDropdownField {...choices} />);
    await user.click(screen.getByRole("button"));
    const checkboxes = screen.getAllByRole("checkbox");
    expect(checkboxes).toHaveLength(3);
  });

  it("selected options have checked checkboxes", async () => {
    const user = userEvent.setup();
    render(<MultipleDropdownField {...choices} value={["red"]} />);
    await user.click(screen.getByRole("button"));
    const checkboxes = screen.getAllByRole("checkbox");
    expect(checkboxes[0]).toBeChecked();   // Red
    expect(checkboxes[1]).not.toBeChecked(); // Green
    expect(checkboxes[2]).not.toBeChecked(); // Blue
  });
});
