import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { RadioButtonField } from "./RadioButtonField";

const choices = {
  choiceLabels: ["Apple", "Banana", "Cherry"],
  choiceValues: ["apple", "banana", "cherry"],
};

describe("RadioButtonField - visibility", () => {
  it("returns null when showWhen is false", () => {
    const { container } = render(
      <RadioButtonField {...choices} showWhen={false} />
    );
    expect(container.innerHTML).toBe("");
  });

  it("renders when showWhen is true (default)", () => {
    render(<RadioButtonField {...choices} />);
    expect(screen.getByRole("radiogroup")).toBeInTheDocument();
  });
});

describe("RadioButtonField - rendering", () => {
  it("renders all choice labels", () => {
    render(<RadioButtonField {...choices} />);
    expect(screen.getByLabelText("Apple")).toBeInTheDocument();
    expect(screen.getByLabelText("Banana")).toBeInTheDocument();
    expect(screen.getByLabelText("Cherry")).toBeInTheDocument();
  });

  it("renders the correct number of radio inputs", () => {
    render(<RadioButtonField {...choices} />);
    expect(screen.getAllByRole("radio")).toHaveLength(3);
  });

  it("renders label text when provided", () => {
    render(<RadioButtonField {...choices} label="Favorite Fruit" />);
    expect(screen.getByText("Favorite Fruit")).toBeInTheDocument();
  });

  it("renders instructions when provided", () => {
    render(<RadioButtonField {...choices} instructions="Pick one" />);
    expect(screen.getByText("Pick one")).toBeInTheDocument();
  });
});

describe("RadioButtonField - selection state", () => {
  it("pre-selected value renders as checked", () => {
    render(<RadioButtonField {...choices} value="banana" />);
    expect(screen.getByLabelText("Banana")).toBeChecked();
    expect(screen.getByLabelText("Apple")).not.toBeChecked();
    expect(screen.getByLabelText("Cherry")).not.toBeChecked();
  });

  it("no radio is checked when value is undefined", () => {
    render(<RadioButtonField {...choices} />);
    screen.getAllByRole("radio").forEach((radio) => {
      expect(radio).not.toBeChecked();
    });
  });

  it("calls onChange with the selected value when a radio is clicked", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<RadioButtonField {...choices} onChange={onChange} />);
    await user.click(screen.getByLabelText("Cherry"));
    expect(onChange).toHaveBeenCalledWith("cherry");
  });

  it("calls saveInto when onChange is not provided", async () => {
    const user = userEvent.setup();
    const saveInto = vi.fn();
    render(<RadioButtonField {...choices} saveInto={saveInto} />);
    await user.click(screen.getByLabelText("Apple"));
    expect(saveInto).toHaveBeenCalledWith("apple");
  });

  it("prefers onChange over saveInto when both are provided", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const saveInto = vi.fn();
    render(<RadioButtonField {...choices} onChange={onChange} saveInto={saveInto} />);
    await user.click(screen.getByLabelText("Banana"));
    expect(onChange).toHaveBeenCalledWith("banana");
    expect(saveInto).not.toHaveBeenCalled();
  });
});

describe("RadioButtonField - disabled state", () => {
  it("disables all radio inputs when disabled=true", () => {
    render(<RadioButtonField {...choices} disabled={true} />);
    screen.getAllByRole("radio").forEach((radio) => {
      expect(radio).toBeDisabled();
    });
  });

  it("does not call onChange when disabled and a radio is clicked", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<RadioButtonField {...choices} disabled={true} onChange={onChange} />);
    await user.click(screen.getByLabelText("Apple"));
    expect(onChange).not.toHaveBeenCalled();
  });
});

describe("RadioButtonField - validations", () => {
  it("renders validation messages", () => {
    render(
      <RadioButtonField
        {...choices}
        validations={["This field is required", "Invalid selection"]}
      />
    );
    expect(screen.getByText("This field is required")).toBeInTheDocument();
    expect(screen.getByText("Invalid selection")).toBeInTheDocument();
  });

  it("marks radio inputs as aria-invalid when validations are present", () => {
    render(<RadioButtonField {...choices} validations={["Error"]} />);
    screen.getAllByRole("radio").forEach((radio) => {
      expect(radio).toHaveAttribute("aria-invalid", "true");
    });
  });

  it("renders requiredMessage when required and no value selected", () => {
    render(
      <RadioButtonField
        {...choices}
        required={true}
        requiredMessage="Please select an option"
      />
    );
    expect(screen.getByText("Please select an option")).toBeInTheDocument();
  });

  it("does not render requiredMessage when a value is selected", () => {
    render(
      <RadioButtonField
        {...choices}
        required={true}
        value="apple"
        requiredMessage="Please select an option"
      />
    );
    expect(screen.queryByText("Please select an option")).not.toBeInTheDocument();
  });
});

describe("RadioButtonField - layout", () => {
  it("choiceLayout=STACKED applies flex-col", () => {
    render(<RadioButtonField {...choices} choiceLayout="STACKED" />);
    const group = screen.getByRole("radiogroup");
    expect(group).toHaveClass("flex-col");
  });

  it("choiceLayout=COMPACT applies flex-wrap", () => {
    render(<RadioButtonField {...choices} choiceLayout="COMPACT" />);
    const group = screen.getByRole("radiogroup");
    expect(group).toHaveClass("flex-wrap");
  });
});

describe("RadioButtonField - choiceStyle CARDS", () => {
  it("applies card styling to each choice item", () => {
    const { container } = render(
      <RadioButtonField {...choices} choiceStyle="CARDS" />
    );
    const cardItems = container.querySelectorAll(".border.border-gray-200.rounded-sm");
    expect(cardItems.length).toBe(3);
  });

  it("clicking the card container (not the input) triggers selection", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const { container } = render(
      <RadioButtonField {...choices} choiceStyle="CARDS" onChange={onChange} />
    );
    // Click the label text (part of the card, not the input itself)
    await user.click(screen.getByText("Banana"));
    expect(onChange).toHaveBeenCalledWith("banana");
  });

  it("selected card gets highlighted classes", () => {
    const { container } = render(
      <RadioButtonField {...choices} choiceStyle="CARDS" value="apple" />
    );
    const cards = container.querySelectorAll(".border.rounded-sm");
    // First card (Apple) should be highlighted
    expect(cards[0]).toHaveClass("border-blue-500", "bg-blue-50");
    // Others should not
    expect(cards[1]).not.toHaveClass("bg-blue-50");
  });
});

describe("RadioButtonField - choicePosition", () => {
  it("choicePosition=END applies flex-row-reverse to item containers", () => {
    const { container } = render(
      <RadioButtonField {...choices} choicePosition="END" />
    );
    const items = container.querySelectorAll(".flex-row-reverse");
    expect(items.length).toBe(3);
  });

  it("choicePosition=START does not apply flex-row-reverse", () => {
    const { container } = render(
      <RadioButtonField {...choices} choicePosition="START" />
    );
    const items = container.querySelectorAll(".flex-row-reverse");
    expect(items.length).toBe(0);
  });

  it("CARDS style defaults choicePosition to END", () => {
    const { container } = render(
      <RadioButtonField {...choices} choiceStyle="CARDS" />
    );
    const items = container.querySelectorAll(".flex-row-reverse");
    expect(items.length).toBe(3);
  });
});
