import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { ReadOnlyGrid } from "./ReadOnlyGrid";
import { GridColumn } from "./GridColumn";

const sampleData = [
  { id: 1, name: "Alice", age: 30 },
  { id: 2, name: "Bob", age: 25 },
  { id: 3, name: "Charlie", age: 35 },
];

describe("ReadOnlyGrid - core rendering", () => {
  it("renders a table with header and data rows", () => {
    render(
      <ReadOnlyGrid data={sampleData}>
        <GridColumn label="Name" value="name" />
        <GridColumn label="Age" value="age" />
      </ReadOnlyGrid>
    );

    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Age")).toBeInTheDocument();
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
    expect(screen.getByText("Charlie")).toBeInTheDocument();
  });

  it("renders correct number of rows and columns", () => {
    render(
      <ReadOnlyGrid data={sampleData}>
        <GridColumn label="Name" value="name" />
        <GridColumn label="Age" value="age" />
      </ReadOnlyGrid>
    );

    const rows = screen.getAllByRole("row");
    // 1 header row + 3 data rows
    expect(rows).toHaveLength(4);

    // Each data row has 2 cells
    const cells = screen.getAllByRole("cell");
    expect(cells).toHaveLength(6);
  });

  it("resolves string field name values", () => {
    render(
      <ReadOnlyGrid data={sampleData}>
        <GridColumn label="Name" value="name" />
      </ReadOnlyGrid>
    );

    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
    expect(screen.getByText("Charlie")).toBeInTheDocument();
  });

  it("resolves function accessor values", () => {
    render(
      <ReadOnlyGrid data={sampleData}>
        <GridColumn
          label="Display"
          value={(row, index) => `${index}: ${row.name}`}
        />
      </ReadOnlyGrid>
    );

    expect(screen.getByText("0: Alice")).toBeInTheDocument();
    expect(screen.getByText("1: Bob")).toBeInTheDocument();
    expect(screen.getByText("2: Charlie")).toBeInTheDocument();
  });

  it("handles accessor that throws by rendering empty cell and logging warning", () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    render(
      <ReadOnlyGrid data={sampleData}>
        <GridColumn
          label="Bad"
          value={() => {
            throw new Error("boom");
          }}
        />
      </ReadOnlyGrid>
    );

    // Should still render 3 data rows
    const cells = screen.getAllByRole("cell");
    expect(cells).toHaveLength(3);
    cells.forEach((cell) => expect(cell).toHaveTextContent(""));

    expect(warnSpy).toHaveBeenCalled();
    warnSpy.mockRestore();
  });

  it("shows emptyGridMessage when data is empty", () => {
    render(
      <ReadOnlyGrid data={[]}>
        <GridColumn label="Name" value="name" />
      </ReadOnlyGrid>
    );

    expect(screen.getByText("No items available")).toBeInTheDocument();
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
  });

  it("shows emptyGridMessage when data is undefined", () => {
    render(
      <ReadOnlyGrid>
        <GridColumn label="Name" value="name" />
      </ReadOnlyGrid>
    );

    expect(screen.getByText("No items available")).toBeInTheDocument();
  });

  it("shows custom emptyGridMessage", () => {
    render(
      <ReadOnlyGrid data={[]} emptyGridMessage="Nothing here">
        <GridColumn label="Name" value="name" />
      </ReadOnlyGrid>
    );

    expect(screen.getByText("Nothing here")).toBeInTheDocument();
  });

  it("returns null when showWhen is false", () => {
    const { container } = render(
      <ReadOnlyGrid data={sampleData} showWhen={false}>
        <GridColumn label="Name" value="name" />
      </ReadOnlyGrid>
    );

    expect(container.innerHTML).toBe("");
  });

  it("hides columns with showWhen=false", () => {
    render(
      <ReadOnlyGrid data={sampleData}>
        <GridColumn label="Name" value="name" />
        <GridColumn label="Hidden" value="age" showWhen={false} />
      </ReadOnlyGrid>
    );

    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.queryByText("Hidden")).not.toBeInTheDocument();
    // Only 1 column visible, so 3 cells
    expect(screen.getAllByRole("cell")).toHaveLength(3);
  });

  it("renders with label, instructions, and validations via FieldWrapper", () => {
    render(
      <ReadOnlyGrid
        data={sampleData}
        label="My Grid"
        instructions="Some instructions"
        validations={["Error 1", "Error 2"]}
      >
        <GridColumn label="Name" value="name" />
      </ReadOnlyGrid>
    );

    expect(screen.getByText("My Grid")).toBeInTheDocument();
    expect(screen.getByText("Some instructions")).toBeInTheDocument();
    expect(screen.getByText("Error 1")).toBeInTheDocument();
    expect(screen.getByText("Error 2")).toBeInTheDocument();
  });

  it("sets aria-label on the table from accessibilityText", () => {
    render(
      <ReadOnlyGrid data={sampleData} accessibilityText="Employee data grid">
        <GridColumn label="Name" value="name" />
      </ReadOnlyGrid>
    );

    expect(screen.getByRole("table")).toHaveAttribute(
      "aria-label",
      "Employee data grid"
    );
  });

  it("ignores non-GridColumn children", () => {
    render(
      <ReadOnlyGrid data={sampleData}>
        <GridColumn label="Name" value="name" />
        <div>I should be ignored</div>
        <GridColumn label="Age" value="age" />
      </ReadOnlyGrid>
    );

    // Only 2 column headers
    const headers = screen.getAllByRole("columnheader");
    expect(headers).toHaveLength(2);
  });
});

import userEvent from "@testing-library/user-event";

// Generate an array of N items for paging tests
function generateData(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `Item ${i + 1}`,
  }));
}

/** Helper to find the paging range text container by matching its combined text content */
function expectRangeText(start: number, end: number, total: number) {
  const text = `${start} – ${end} of ${total}`;
  expect(screen.getByText((_content, element) => {
    return element?.tagName === "SPAN" && element?.textContent === text;
  })).toBeInTheDocument();
}

describe("ReadOnlyGrid - paging", () => {
  it("shows paging controls when data exceeds pageSize", () => {
    render(
      <ReadOnlyGrid data={generateData(15)} pageSize={5}>
        <GridColumn label="Name" value="name" />
      </ReadOnlyGrid>
    );

    expectRangeText(1, 5, 15);
    expect(screen.getByRole("button", { name: "First page" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Previous page" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Next page" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Last page" })).toBeInTheDocument();
  });

  it("hides paging controls when all data fits on one page", () => {
    render(
      <ReadOnlyGrid data={generateData(3)} pageSize={10}>
        <GridColumn label="Name" value="name" />
      </ReadOnlyGrid>
    );

    expect(screen.queryByRole("button", { name: "Previous page" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Next page" })).not.toBeInTheDocument();
  });

  it("navigates to next page and back", async () => {
    const user = userEvent.setup();
    render(
      <ReadOnlyGrid data={generateData(12)} pageSize={5}>
        <GridColumn label="Name" value="name" />
      </ReadOnlyGrid>
    );

    // Page 1: items 1-5
    expectRangeText(1, 5, 12);
    expect(screen.getByText("Item 1")).toBeInTheDocument();
    expect(screen.queryByText("Item 6")).not.toBeInTheDocument();

    // Go to page 2
    await user.click(screen.getByRole("button", { name: "Next page" }));
    expectRangeText(6, 10, 12);
    expect(screen.getByText("Item 6")).toBeInTheDocument();
    expect(screen.queryByText("Item 1")).not.toBeInTheDocument();

    // Go back to page 1
    await user.click(screen.getByRole("button", { name: "Previous page" }));
    expectRangeText(1, 5, 12);
    expect(screen.getByText("Item 1")).toBeInTheDocument();
  });

  it("disables first/previous buttons on first page and last/next on last page", () => {
    render(
      <ReadOnlyGrid data={generateData(15)} pageSize={5}>
        <GridColumn label="Name" value="name" />
      </ReadOnlyGrid>
    );

    expect(screen.getByRole("button", { name: "First page" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Previous page" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Next page" })).toBeEnabled();
    expect(screen.getByRole("button", { name: "Last page" })).toBeEnabled();
  });

  it("disables next/last buttons on last page", async () => {
    const user = userEvent.setup();
    render(
      <ReadOnlyGrid data={generateData(8)} pageSize={5}>
        <GridColumn label="Name" value="name" />
      </ReadOnlyGrid>
    );

    // Navigate to last page (page 2)
    await user.click(screen.getByRole("button", { name: "Next page" }));
    expectRangeText(6, 8, 8);
    expect(screen.getByRole("button", { name: "Next page" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Last page" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Previous page" })).toBeEnabled();
    expect(screen.getByRole("button", { name: "First page" })).toBeEnabled();
  });

  it("first page button jumps to page 1, last page button jumps to final page", async () => {
    const user = userEvent.setup();
    render(
      <ReadOnlyGrid data={generateData(25)} pageSize={5}>
        <GridColumn label="Name" value="name" />
      </ReadOnlyGrid>
    );

    // Jump to last page
    await user.click(screen.getByRole("button", { name: "Last page" }));
    expectRangeText(21, 25, 25);
    expect(screen.getByText("Item 25")).toBeInTheDocument();

    // Jump back to first page
    await user.click(screen.getByRole("button", { name: "First page" }));
    expectRangeText(1, 5, 25);
    expect(screen.getByText("Item 1")).toBeInTheDocument();
  });

  it("defaults pageSize to 10", () => {
    render(
      <ReadOnlyGrid data={generateData(15)}>
        <GridColumn label="Name" value="name" />
      </ReadOnlyGrid>
    );

    expectRangeText(1, 10, 15);
    // Should render exactly 10 data rows
    const rows = screen.getAllByRole("row");
    expect(rows).toHaveLength(11); // 1 header + 10 data
  });

  it("shows correct page range text", async () => {
    const user = userEvent.setup();
    render(
      <ReadOnlyGrid data={generateData(23)} pageSize={10}>
        <GridColumn label="Name" value="name" />
      </ReadOnlyGrid>
    );

    expectRangeText(1, 10, 23);

    await user.click(screen.getByRole("button", { name: "Next page" }));
    expectRangeText(11, 20, 23);

    await user.click(screen.getByRole("button", { name: "Next page" }));
    expectRangeText(21, 23, 23);
  });

  it("handles invalid pageSize by defaulting to 10", () => {
    render(
      <ReadOnlyGrid data={generateData(15)} pageSize={0}>
        <GridColumn label="Name" value="name" />
      </ReadOnlyGrid>
    );

    expectRangeText(1, 10, 15);
  });

  it("handles negative pageSize by defaulting to 10", () => {
    render(
      <ReadOnlyGrid data={generateData(15)} pageSize={-5}>
        <GridColumn label="Name" value="name" />
      </ReadOnlyGrid>
    );

    expectRangeText(1, 10, 15);
  });

  it("paging buttons have tooltips", () => {
    render(
      <ReadOnlyGrid data={generateData(15)} pageSize={5}>
        <GridColumn label="Name" value="name" />
      </ReadOnlyGrid>
    );

    expect(screen.getByRole("button", { name: "First page" })).toHaveAttribute("title", "First page");
    expect(screen.getByRole("button", { name: "Previous page" })).toHaveAttribute("title", "Previous page");
    expect(screen.getByRole("button", { name: "Next page" })).toHaveAttribute("title", "Next page");
    expect(screen.getByRole("button", { name: "Last page" })).toHaveAttribute("title", "Last page");
  });
});

describe("ReadOnlyGrid - sorting", () => {
  const sortableData = [
    { id: 1, name: "Charlie", age: 35 },
    { id: 2, name: "Alice", age: 30 },
    { id: 3, name: "Bob", age: 25 },
  ];

  it("clicking a sortable column header sorts ascending", async () => {
    const user = userEvent.setup();
    render(
      <ReadOnlyGrid data={sortableData}>
        <GridColumn label="Name" value="name" sortField="name" />
        <GridColumn label="Age" value="age" sortField="age" />
      </ReadOnlyGrid>
    );

    // Click "Name" header to sort ascending
    await user.click(screen.getByRole("button", { name: "Name" }));

    const cells = screen.getAllByRole("cell");
    // 3 rows × 2 cols = 6 cells; first column cells at indices 0, 2, 4
    expect(cells[0]).toHaveTextContent("Alice");
    expect(cells[2]).toHaveTextContent("Bob");
    expect(cells[4]).toHaveTextContent("Charlie");
  });

  it("clicking same header again toggles to descending", async () => {
    const user = userEvent.setup();
    render(
      <ReadOnlyGrid data={sortableData}>
        <GridColumn label="Name" value="name" sortField="name" />
        <GridColumn label="Age" value="age" sortField="age" />
      </ReadOnlyGrid>
    );

    // Click "Name" twice: ascending then descending
    await user.click(screen.getByRole("button", { name: "Name" }));
    await user.click(screen.getByRole("button", { name: /Name/ }));

    const cells = screen.getAllByRole("cell");
    expect(cells[0]).toHaveTextContent("Charlie");
    expect(cells[2]).toHaveTextContent("Bob");
    expect(cells[4]).toHaveTextContent("Alice");
  });

  it("non-sortable column headers are not clickable", () => {
    render(
      <ReadOnlyGrid data={sortableData}>
        <GridColumn label="Name" value="name" />
        <GridColumn label="Age" value="age" sortField="age" />
      </ReadOnlyGrid>
    );

    // "Name" has no sortField, so no button
    const headers = screen.getAllByRole("columnheader");
    const nameHeader = headers[0];
    expect(nameHeader.querySelector("button")).toBeNull();

    // "Age" has sortField, so it has a button
    const ageHeader = headers[1];
    expect(ageHeader.querySelector("button")).not.toBeNull();
  });

  it("sort indicator shows on active sort column", async () => {
    const user = userEvent.setup();
    render(
      <ReadOnlyGrid data={sortableData}>
        <GridColumn label="Name" value="name" sortField="name" />
        <GridColumn label="Age" value="age" sortField="age" />
      </ReadOnlyGrid>
    );

    // Click Name to sort ascending
    await user.click(screen.getByRole("button", { name: "Name" }));

    const nameHeader = screen.getAllByRole("columnheader")[0];
    expect(nameHeader).toHaveAttribute("aria-sort", "ascending");
    expect(nameHeader).toHaveTextContent("▲");

    // Click again to sort descending
    await user.click(screen.getByRole("button", { name: /Name/ }));
    expect(nameHeader).toHaveAttribute("aria-sort", "descending");
    expect(nameHeader).toHaveTextContent("▼");
  });

  it("initialSorts applies on first render", () => {
    render(
      <ReadOnlyGrid
        data={sortableData}
        initialSorts={[{ field: "name", ascending: true }]}
      >
        <GridColumn label="Name" value="name" sortField="name" />
        <GridColumn label="Age" value="age" sortField="age" />
      </ReadOnlyGrid>
    );

    const cells = screen.getAllByRole("cell");
    // Sorted ascending by name: Alice, Bob, Charlie
    expect(cells[0]).toHaveTextContent("Alice");
    expect(cells[2]).toHaveTextContent("Bob");
    expect(cells[4]).toHaveTextContent("Charlie");
  });

  it("sorting resets to page 1", async () => {
    const user = userEvent.setup();
    const data = Array.from({ length: 12 }, (_, i) => ({
      id: i + 1,
      name: `Item ${String.fromCharCode(65 + (11 - i))}`,
    }));

    render(
      <ReadOnlyGrid data={data} pageSize={5}>
        <GridColumn label="Name" value="name" sortField="name" />
      </ReadOnlyGrid>
    );

    // Navigate to page 2
    await user.click(screen.getByRole("button", { name: "Next page" }));
    expectRangeText(6, 10, 12);

    // Click sort — should reset to page 1
    await user.click(screen.getByRole("button", { name: "Name" }));
    expectRangeText(1, 5, 12);
  });
});

describe("ReadOnlyGrid - selection", () => {
  const selectableData = [
    { id: 1, name: "Alice" },
    { id: 2, name: "Bob" },
    { id: 3, name: "Charlie" },
  ];

  it("renders checkbox column when selectable=true", () => {
    render(
      <ReadOnlyGrid data={selectableData} selectable>
        <GridColumn label="Name" value="name" />
      </ReadOnlyGrid>
    );

    // Header checkbox + 3 row checkboxes
    const checkboxes = screen.getAllByRole("checkbox");
    expect(checkboxes).toHaveLength(4);
    expect(screen.getByLabelText("Select all rows")).toBeInTheDocument();
    expect(screen.getByLabelText("Select row 1")).toBeInTheDocument();
  });

  it("does not render checkbox column when selectable is false (default)", () => {
    render(
      <ReadOnlyGrid data={selectableData}>
        <GridColumn label="Name" value="name" />
      </ReadOnlyGrid>
    );

    expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();
  });

  it("row checkbox toggles selection and calls selectionSaveInto", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();

    render(
      <ReadOnlyGrid
        data={selectableData}
        selectable
        selectionValue={[]}
        selectionSaveInto={onSelect}
      >
        <GridColumn label="Name" value="name" />
      </ReadOnlyGrid>
    );

    // Click first row checkbox to select
    await user.click(screen.getByLabelText("Select row 1"));
    expect(onSelect).toHaveBeenCalledWith([1]);
  });

  it("row checkbox deselects when already selected", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();

    render(
      <ReadOnlyGrid
        data={selectableData}
        selectable
        selectionValue={[1, 2]}
        selectionSaveInto={onSelect}
      >
        <GridColumn label="Name" value="name" />
      </ReadOnlyGrid>
    );

    // Click first row checkbox to deselect
    await user.click(screen.getByLabelText("Select row 1"));
    expect(onSelect).toHaveBeenCalledWith([2]);
  });

  it("header checkbox selects all page rows", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();

    render(
      <ReadOnlyGrid
        data={selectableData}
        selectable
        selectionValue={[]}
        selectionSaveInto={onSelect}
      >
        <GridColumn label="Name" value="name" />
      </ReadOnlyGrid>
    );

    await user.click(screen.getByLabelText("Select all rows"));
    expect(onSelect).toHaveBeenCalledWith([1, 2, 3]);
  });

  it("header checkbox deselects all when all page rows are selected", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();

    render(
      <ReadOnlyGrid
        data={selectableData}
        selectable
        selectionValue={[1, 2, 3]}
        selectionSaveInto={onSelect}
      >
        <GridColumn label="Name" value="name" />
      </ReadOnlyGrid>
    );

    await user.click(screen.getByLabelText("Select all rows"));
    expect(onSelect).toHaveBeenCalledWith([]);
  });

  it("pre-selected rows render as checked", () => {
    render(
      <ReadOnlyGrid
        data={selectableData}
        selectable
        selectionValue={[2, 3]}
      >
        <GridColumn label="Name" value="name" />
      </ReadOnlyGrid>
    );

    const checkboxes = screen.getAllByRole("checkbox");
    // Header checkbox (index 0), row 1 (index 1), row 2 (index 2), row 3 (index 3)
    expect(checkboxes[1]).not.toBeChecked(); // Alice (id=1) not selected
    expect(checkboxes[2]).toBeChecked();     // Bob (id=2) selected
    expect(checkboxes[3]).toBeChecked();     // Charlie (id=3) selected
  });

  it("ROW_HIGHLIGHT style highlights selected rows instead of checkboxes", () => {
    render(
      <ReadOnlyGrid
        data={selectableData}
        selectable
        selectionStyle="ROW_HIGHLIGHT"
        selectionValue={[2]}
      >
        <GridColumn label="Name" value="name" />
      </ReadOnlyGrid>
    );

    // No checkboxes in ROW_HIGHLIGHT mode
    expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();

    // All rows should have cursor-pointer
    const rows = screen.getAllByRole("row");
    // rows[0] is header, rows[1..3] are data rows
    expect(rows[1]).toHaveClass("cursor-pointer");
    expect(rows[2]).toHaveClass("cursor-pointer");
    expect(rows[3]).toHaveClass("cursor-pointer");

    // Only Bob's row (id=2) should be highlighted
    expect(rows[1]).not.toHaveClass("bg-blue-50");
    expect(rows[2]).toHaveClass("bg-blue-50");
    expect(rows[3]).not.toHaveClass("bg-blue-50");
  });

  it("ROW_HIGHLIGHT clicking row toggles selection", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();

    render(
      <ReadOnlyGrid
        data={selectableData}
        selectable
        selectionStyle="ROW_HIGHLIGHT"
        selectionValue={[]}
        selectionSaveInto={onSelect}
      >
        <GridColumn label="Name" value="name" />
      </ReadOnlyGrid>
    );

    // Click Bob's row
    const rows = screen.getAllByRole("row");
    await user.click(rows[2]); // rows[0]=header, rows[1]=Alice, rows[2]=Bob
    expect(onSelect).toHaveBeenCalledWith([2]);
  });

  it("uses original index as identifier when row has no id field", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    const dataWithoutId = [
      { name: "Alice" },
      { name: "Bob" },
      { name: "Charlie" },
    ];

    render(
      <ReadOnlyGrid
        data={dataWithoutId}
        selectable
        selectionValue={[]}
        selectionSaveInto={onSelect}
      >
        <GridColumn label="Name" value="name" />
      </ReadOnlyGrid>
    );

    // Click second row checkbox (original index 1)
    await user.click(screen.getByLabelText("Select row 2"));
    expect(onSelect).toHaveBeenCalledWith([1]);
  });
});

describe("ReadOnlyGrid - styling", () => {
  const styleData = [
    { id: 1, name: "Alice", age: 30 },
    { id: 2, name: "Bob", age: 25 },
    { id: 3, name: "Charlie", age: 35 },
  ];

  it('borderStyle "STANDARD" applies correct border classes', () => {
    render(
      <ReadOnlyGrid data={styleData} borderStyle="STANDARD">
        <GridColumn label="Name" value="name" />
        <GridColumn label="Age" value="age" />
      </ReadOnlyGrid>
    );

    const table = screen.getByRole("table");
    expect(table).toHaveClass("border", "border-gray-300");

    // Header row should have border-b
    const headerRow = screen.getAllByRole("row")[0];
    expect(headerRow).toHaveClass("border-b", "border-gray-300");

    // Data rows should have border-b border-gray-300
    const dataRows = screen.getAllByRole("row").slice(1);
    dataRows.forEach((row) => {
      expect(row).toHaveClass("border-b", "border-gray-300");
    });

    // Column dividers: first column header should have border-r (not the last)
    const headers = screen.getAllByRole("columnheader");
    expect(headers[0]).toHaveClass("border-r", "border-gray-300");
    expect(headers[1]).not.toHaveClass("border-r");

    // First data cell in each row should have border-r
    const cells = screen.getAllByRole("cell");
    expect(cells[0]).toHaveClass("border-r", "border-gray-300");
    expect(cells[1]).not.toHaveClass("border-r");
  });

  it('borderStyle "LIGHT" (default) applies light border classes', () => {
    render(
      <ReadOnlyGrid data={styleData}>
        <GridColumn label="Name" value="name" />
        <GridColumn label="Age" value="age" />
      </ReadOnlyGrid>
    );

    // LIGHT: no outer border on table
    const table = screen.getByRole("table");
    expect(table).not.toHaveClass("border");

    // Header row still has bottom border
    const headerRow = screen.getAllByRole("row")[0];
    expect(headerRow).toHaveClass("border-b", "border-gray-200");

    const dataRows = screen.getAllByRole("row").slice(1);
    dataRows.forEach((row) => {
      expect(row).toHaveClass("border-b", "border-gray-200");
    });

    // No column dividers in LIGHT mode
    const headers = screen.getAllByRole("columnheader");
    headers.forEach((header) => {
      expect(header).not.toHaveClass("border-r");
    });
  });

  it("shadeAlternateRows applies bg-gray-50 to even-indexed rows", () => {
    render(
      <ReadOnlyGrid data={styleData} shadeAlternateRows>
        <GridColumn label="Name" value="name" />
      </ReadOnlyGrid>
    );

    const dataRows = screen.getAllByRole("row").slice(1);
    // Even-indexed (0, 2) get bg-gray-50; odd-indexed (1) does not
    expect(dataRows[0]).toHaveClass("bg-gray-50");
    expect(dataRows[1]).not.toHaveClass("bg-gray-50");
    expect(dataRows[2]).toHaveClass("bg-gray-50");
  });

  it('spacing "DENSE" reduces padding', () => {
    render(
      <ReadOnlyGrid data={styleData} spacing="DENSE">
        <GridColumn label="Name" value="name" />
      </ReadOnlyGrid>
    );

    const cells = screen.getAllByRole("cell");
    cells.forEach((cell) => {
      expect(cell).toHaveClass("px-2", "py-1");
      expect(cell).not.toHaveClass("px-3", "py-2");
    });

    const headers = screen.getAllByRole("columnheader");
    headers.forEach((header) => {
      expect(header).toHaveClass("px-2", "py-1");
    });
  });

  it('height "SHORT" constrains grid body with max-h and overflow', () => {
    const { container } = render(
      <ReadOnlyGrid data={styleData} height="SHORT">
        <GridColumn label="Name" value="name" />
      </ReadOnlyGrid>
    );

    // The table should be wrapped in a scroll container
    const scrollContainer = container.querySelector(".max-h-40");
    expect(scrollContainer).toBeInTheDocument();
    expect(scrollContainer).toHaveClass("overflow-y-auto");

    // The thead should be sticky
    const thead = container.querySelector("thead");
    expect(thead).toHaveClass("sticky", "top-0", "bg-white", "z-10");
  });

  it('height "AUTO" (default) has no height constraint', () => {
    const { container } = render(
      <ReadOnlyGrid data={styleData}>
        <GridColumn label="Name" value="name" />
      </ReadOnlyGrid>
    );

    // No scroll container
    expect(container.querySelector(".overflow-y-auto")).not.toBeInTheDocument();

    // thead should not be sticky
    const thead = container.querySelector("thead");
    expect(thead).not.toHaveClass("sticky");
  });

  it("column width applies correct class", () => {
    render(
      <ReadOnlyGrid data={styleData}>
        <GridColumn label="Name" value="name" width="NARROW" />
        <GridColumn label="Age" value="age" width="WIDE" />
      </ReadOnlyGrid>
    );

    const headers = screen.getAllByRole("columnheader");
    expect(headers[0]).toHaveClass("w-24");
    expect(headers[1]).toHaveClass("w-64");

    // Data cells should also have width classes
    const cells = screen.getAllByRole("cell");
    // Row 1: cells[0]=Name, cells[1]=Age; Row 2: cells[2]=Name, cells[3]=Age; etc.
    expect(cells[0]).toHaveClass("w-24");
    expect(cells[1]).toHaveClass("w-64");
  });

  it("column align applies correct text alignment", () => {
    render(
      <ReadOnlyGrid data={styleData}>
        <GridColumn label="Name" value="name" align="START" />
        <GridColumn label="Age" value="age" align="CENTER" />
        <GridColumn label="Score" value="name" align="END" />
      </ReadOnlyGrid>
    );

    const headers = screen.getAllByRole("columnheader");
    expect(headers[0]).toHaveClass("text-left");
    expect(headers[1]).toHaveClass("text-center");
    expect(headers[2]).toHaveClass("text-right");

    const cells = screen.getAllByRole("cell");
    // 3 rows × 3 cols = 9 cells
    // Row 1: cells 0,1,2
    expect(cells[0]).toHaveClass("text-left");
    expect(cells[1]).toHaveClass("text-center");
    expect(cells[2]).toHaveClass("text-right");
  });

  it("column backgroundColor applies semantic color class", () => {
    render(
      <ReadOnlyGrid data={styleData}>
        <GridColumn label="Name" value="name" backgroundColor="ACCENT" />
        <GridColumn label="Age" value="age" backgroundColor="SUCCESS" />
      </ReadOnlyGrid>
    );

    const cells = screen.getAllByRole("cell");
    // Row 1: cells[0]=Name(ACCENT), cells[1]=Age(SUCCESS)
    expect(cells[0]).toHaveClass("bg-blue-50");
    expect(cells[1]).toHaveClass("bg-green-50");
  });

  it("column backgroundColor applies hex color as inline style", () => {
    render(
      <ReadOnlyGrid data={styleData}>
        <GridColumn label="Name" value="name" backgroundColor="#ff5733" />
      </ReadOnlyGrid>
    );

    const cells = screen.getAllByRole("cell");
    expect(cells[0]).toHaveStyle({ backgroundColor: "#ff5733" });
  });
});
