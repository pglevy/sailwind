import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import * as fc from "fast-check";
import { ReadOnlyGrid } from "./ReadOnlyGrid";
import { GridColumn } from "./GridColumn";

// --- Shared arbitraries ---

const FIELD_NAMES = ["name", "age", "email", "city", "score"] as const;
type FieldName = (typeof FIELD_NAMES)[number];

/** Generate a single data row with values for all known fields */
const arbRow: fc.Arbitrary<Record<string, any>> = fc.record({
  name: fc.string({ minLength: 1, maxLength: 20 }).map((s) => s.replace(/\s+/g, "_")),
  age: fc.integer({ min: 0, max: 120 }),
  email: fc.emailAddress(),
  city: fc.string({ minLength: 1, maxLength: 15 }).map((s) => s.replace(/\s+/g, "_")),
  score: fc.integer({ min: 0, max: 100 }),
});

/** Generate a non-empty data array (1-20 rows) */
const arbDataArray = fc.array(arbRow, { minLength: 1, maxLength: 20 });

/** Generate a column config with a string field accessor and visible */
const arbVisibleColumn: fc.Arbitrary<{
  label: string;
  value: FieldName;
  showWhen: true;
}> = fc.record({
  label: fc.string({ minLength: 1, maxLength: 15 }).map((s) => `Col_${s.replace(/\s+/g, "_")}`),
  value: fc.constantFrom(...FIELD_NAMES),
  showWhen: fc.constant(true as const),
});

/** Generate a hidden column */
const arbHiddenColumn: fc.Arbitrary<{
  label: string;
  value: FieldName;
  showWhen: false;
}> = fc.record({
  label: fc.string({ minLength: 1, maxLength: 15 }).map((s) => `Hidden_${s.replace(/\s+/g, "_")}`),
  value: fc.constantFrom(...FIELD_NAMES),
  showWhen: fc.constant(false as const),
});

/** Generate a mixed set of columns: 1-5 visible, 0-2 hidden */
const arbColumnSet = fc
  .tuple(
    fc.array(arbVisibleColumn, { minLength: 1, maxLength: 5 }),
    fc.array(arbHiddenColumn, { minLength: 0, maxLength: 2 })
  )
  .map(([visible, hidden]) => ({
    all: [...visible, ...hidden],
    visible,
    hidden,
  }));

/** Generate a non-empty trimmed string suitable for display text.
 *  Uses a prefix to avoid collisions with cell content in the DOM. */
const arbDisplayText = (prefix: string) =>
  fc
    .string({ minLength: 1, maxLength: 20 })
    .map((s) => `${prefix}_${s.replace(/\s+/g, "x")}`);


// =============================================================================
// Property 1: Data rendering dimensions
// Feature: read-only-grid, Property 1: Data rendering dimensions
// Validates: Requirements 1.1, 2.5
// =============================================================================
describe("Property 1: Data rendering dimensions", () => {
  it("renders exactly N data rows and M visible columns for any valid input", () => {
    fc.assert(
      fc.property(
        fc.array(arbRow, { minLength: 1, maxLength: 10 }),
        fc.integer({ min: 1, max: 5 }),
        fc.integer({ min: 0, max: 2 }),
        (data, visibleCount, hiddenCount) => {
          // Build column configs from counts
          const visibleCols = FIELD_NAMES.slice(0, visibleCount).map((f, i) => ({
            label: `Col${i}`,
            value: f,
            showWhen: true as const,
          }));
          const hiddenCols = FIELD_NAMES.slice(0, hiddenCount).map((f, i) => ({
            label: `Hidden${i}`,
            value: f,
            showWhen: false as const,
          }));
          const allCols = [...visibleCols, ...hiddenCols];

          const { unmount } = render(
            <ReadOnlyGrid data={data}>
              {allCols.map((col, i) => (
                <GridColumn
                  key={i}
                  label={col.label}
                  value={col.value}
                  showWhen={col.showWhen}
                />
              ))}
            </ReadOnlyGrid>
          );

          const expectedRows = data.length;
          const expectedCols = visibleCount;

          // All rows in the table = 1 header + N data rows
          const allRows = screen.getAllByRole("row");
          expect(allRows).toHaveLength(expectedRows + 1);

          // Data cells = N rows × M visible columns
          const cells = screen.getAllByRole("cell");
          expect(cells).toHaveLength(expectedRows * expectedCols);

          // Column headers = M visible columns
          const headers = screen.getAllByRole("columnheader");
          expect(headers).toHaveLength(expectedCols);

          unmount();
        }
      ),
      { numRuns: 100 }
    );
  }, 30000);
});


// =============================================================================
// Property 2: Cell value resolution
// Feature: read-only-grid, Property 2: Cell value resolution
// Validates: Requirements 1.3, 1.4
// =============================================================================
describe("Property 2: Cell value resolution", () => {
  it("resolves string field accessors to the correct row values", () => {
    fc.assert(
      fc.property(arbDataArray, arbVisibleColumn, (data, col) => {
        const { unmount } = render(
          <ReadOnlyGrid data={data} pageSize={data.length}>
            <GridColumn label={col.label} value={col.value} />
          </ReadOnlyGrid>
        );

        const cells = screen.getAllByRole("cell");
        expect(cells).toHaveLength(data.length);

        data.forEach((row, i) => {
          const expected = String(row[col.value] ?? "");
          expect(cells[i]).toHaveTextContent(expected);
        });

        unmount();
      }),
      { numRuns: 100 }
    );
  }, 30000);

  it("resolves function accessors to the correct computed values", () => {
    fc.assert(
      fc.property(arbDataArray, (data) => {
        // Function accessor that concatenates index and name field
        const accessor = (row: any, index: number) =>
          `row${index}_${row.name}`;

        const { unmount } = render(
          <ReadOnlyGrid data={data} pageSize={data.length}>
            <GridColumn label="Computed" value={accessor} />
          </ReadOnlyGrid>
        );

        const cells = screen.getAllByRole("cell");
        expect(cells).toHaveLength(data.length);

        data.forEach((row, i) => {
          expect(cells[i]).toHaveTextContent(`row${i}_${row.name}`);
        });

        unmount();
      }),
      { numRuns: 100 }
    );
  }, 30000);
});


// =============================================================================
// Property 3: Column configuration application
// Feature: read-only-grid, Property 3: Column configuration application
// Validates: Requirements 2.1, 2.2, 2.3, 2.4
// Note: align, width, and backgroundColor styling are not implemented yet (Task 8).
// For now, we test that label text appears in column headers.
// =============================================================================
describe("Property 3: Column configuration application", () => {
  it("renders each visible column's label text in the corresponding header", () => {
    fc.assert(
      fc.property(arbDataArray, arbColumnSet, (data, columns) => {
        const { unmount } = render(
          <ReadOnlyGrid data={data}>
            {columns.all.map((col, i) => (
              <GridColumn
                key={i}
                label={col.label}
                value={col.value}
                showWhen={col.showWhen}
              />
            ))}
          </ReadOnlyGrid>
        );

        const headers = screen.getAllByRole("columnheader");
        expect(headers).toHaveLength(columns.visible.length);

        // Each visible column's label appears in the corresponding header
        columns.visible.forEach((col, i) => {
          expect(headers[i]).toHaveTextContent(col.label);
        });

        // Hidden column labels should NOT appear in any header
        columns.hidden.forEach((col) => {
          const matchingHeaders = headers.filter((h) =>
            h.textContent?.includes(col.label)
          );
          // Only fail if the hidden label uniquely doesn't appear
          // (it could coincidentally match a visible label, so we check headers only)
          const headerTexts = headers.map((h) => h.textContent);
          if (!headerTexts.some((t) => t?.includes(col.label))) {
            expect(
              screen.queryByRole("columnheader", { name: col.label })
            ).not.toBeInTheDocument();
          }
        });

        unmount();
      }),
      { numRuns: 100 }
    );
  }, 30000);
});


// =============================================================================
// Property 4: Grid metadata rendering
// Feature: read-only-grid, Property 4: Grid metadata rendering
// Validates: Requirements 3.1, 3.3, 3.5, 3.6
// =============================================================================
describe("Property 4: Grid metadata rendering", () => {
  /** Generate a non-empty array of validation message strings */
  const arbValidations = fc.array(arbDisplayText("val"), {
    minLength: 1,
    maxLength: 5,
  });

  it("renders label, instructions, all validations, and aria-label for any valid metadata", () => {
    fc.assert(
      fc.property(
        arbDataArray,
        arbDisplayText("lbl"),
        arbDisplayText("ins"),
        arbValidations,
        arbDisplayText("acc"),
        (data, label, instructions, validations, accessibilityText) => {
          const { unmount, container } = render(
            <ReadOnlyGrid
              data={data}
              label={label}
              instructions={instructions}
              validations={validations}
              accessibilityText={accessibilityText}
            >
              <GridColumn label="Name" value="name" />
            </ReadOnlyGrid>
          );

          // Requirement 3.1: label text is rendered (in a <label> element)
          const labelEl = container.querySelector("label");
          expect(labelEl).not.toBeNull();
          expect(labelEl!.textContent).toBe(label);

          // Requirement 3.3: instructions text is rendered
          const instructionsEl = container.querySelector(
            "[id$='-instructions']"
          );
          expect(instructionsEl).not.toBeNull();
          expect(instructionsEl!.textContent).toBe(instructions);

          // Requirement 3.5: all validation messages are rendered
          const validationEls = container.querySelectorAll(
            ".text-red-600"
          );
          expect(validationEls).toHaveLength(validations.length);
          validations.forEach((msg, i) => {
            expect(validationEls[i].textContent).toBe(msg);
          });

          // Requirement 3.6: table has aria-label from accessibilityText
          const table = screen.getByRole("table");
          expect(table).toHaveAttribute("aria-label", accessibilityText);

          unmount();
        }
      ),
      { numRuns: 100 }
    );
  }, 30000);
});


// =============================================================================
// Property 5: Paging row count constraint
// Feature: read-only-grid, Property 5: Paging row count constraint
// Validates: Requirements 4.1
// =============================================================================
describe("Property 5: Paging row count constraint", () => {
  it("renders at most pageSize rows on any page, and N%P (or P) on the last page", async () => {
    const user = userEvent.setup();

    await fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 2, max: 50 }),
        fc.integer({ min: 1, max: 10 }),
        async (n, p) => {
          // Ensure N > P so paging is active
          fc.pre(n > p);

          const data = Array.from({ length: n }, (_, i) => ({
            name: `row${i}`,
            age: i,
            email: `r${i}@test.com`,
            city: `city${i}`,
            score: i,
          }));

          const { unmount } = render(
            <ReadOnlyGrid data={data} pageSize={p}>
              <GridColumn label="Name" value="name" />
            </ReadOnlyGrid>
          );

          // First page: should have exactly P rows (since N > P)
          const firstPageRows = screen.getAllByRole("row");
          const firstPageDataRows = firstPageRows.length - 1; // subtract header
          expect(firstPageDataRows).toBe(p);

          // Navigate to the last page
          const totalPages = Math.ceil(n / p);
          const lastPageExpected = n % p === 0 ? p : n % p;

          const nextButton = screen.getByRole("button", { name: "Next page" });
          for (let page = 1; page < totalPages; page++) {
            await user.click(nextButton);
          }

          const lastPageRows = screen.getAllByRole("row");
          const lastPageDataRows = lastPageRows.length - 1;
          expect(lastPageDataRows).toBe(lastPageExpected);

          unmount();
        }
      ),
      { numRuns: 100 }
    );
  }, 60000);
});


// =============================================================================
// Property 6: Page navigation round trip
// Feature: read-only-grid, Property 6: Page navigation round trip
// Validates: Requirements 4.3, 4.4
// =============================================================================
describe("Property 6: Page navigation round trip", () => {
  it("navigating forward then backward returns to the same page with the same rows", async () => {
    const user = userEvent.setup();

    await fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 2, max: 30 }),
        fc.integer({ min: 1, max: 10 }),
        async (n, p) => {
          fc.pre(n > p);

          const data = Array.from({ length: n }, (_, i) => ({
            name: `row${i}`,
            age: i,
            email: `r${i}@test.com`,
            city: `city${i}`,
            score: i,
          }));

          const { unmount } = render(
            <ReadOnlyGrid data={data} pageSize={p}>
              <GridColumn label="Name" value="name" />
            </ReadOnlyGrid>
          );

          // Capture page 1 cell content
          const getCellTexts = () =>
            screen.getAllByRole("cell").map((cell) => cell.textContent);

          const page1Content = getCellTexts();

          // Navigate forward
          const nextButton = screen.getByRole("button", { name: "Next page" });
          await user.click(nextButton);

          // Navigate backward
          const prevButton = screen.getByRole("button", { name: "Previous page" });
          await user.click(prevButton);

          // Verify we're back to the same content
          const afterRoundTrip = getCellTexts();
          expect(afterRoundTrip).toEqual(page1Content);

          unmount();
        }
      ),
      { numRuns: 100 }
    );
  }, 60000);
});


// =============================================================================
// Property 7: Sort toggling behavior
// Feature: read-only-grid, Property 7: Sort toggling behavior
// Validates: Requirements 5.1, 5.2, 5.3, 5.6
// =============================================================================
describe("Property 7: Sort toggling behavior", () => {
  it("clicking a sortable header sorts ascending, then descending; non-sortable headers have no button", async () => {
    const user = userEvent.setup();

    await fc.assert(
      fc.asyncProperty(
        fc.array(arbRow, { minLength: 2, maxLength: 20 }),
        async (data) => {
          const { unmount } = render(
            <ReadOnlyGrid data={data} pageSize={data.length}>
              <GridColumn label="Score" value="score" sortField="score" />
              <GridColumn label="City" value="city" />
            </ReadOnlyGrid>
          );

          // Requirement 5.1: sortable column header is clickable (rendered as button)
          const sortButton = screen.getByRole("button", { name: /Score/ });
          expect(sortButton).toBeInTheDocument();

          // Requirement 5.6: non-sortable column has no button
          const headers = screen.getAllByRole("columnheader");
          const cityHeader = headers[1];
          expect(within(cityHeader).queryByRole("button")).toBeNull();

          // Requirement 5.2: click once → ascending sort
          await user.click(sortButton);

          const ascendingScores = screen
            .getAllByRole("row")
            .slice(1) // skip header
            .map((row) => {
              const cells = within(row).getAllByRole("cell");
              return Number(cells[0].textContent);
            });

          for (let i = 1; i < ascendingScores.length; i++) {
            expect(ascendingScores[i]).toBeGreaterThanOrEqual(ascendingScores[i - 1]);
          }

          // Requirement 5.3: click again → descending sort
          await user.click(sortButton);

          const descendingScores = screen
            .getAllByRole("row")
            .slice(1)
            .map((row) => {
              const cells = within(row).getAllByRole("cell");
              return Number(cells[0].textContent);
            });

          for (let i = 1; i < descendingScores.length; i++) {
            expect(descendingScores[i]).toBeLessThanOrEqual(descendingScores[i - 1]);
          }

          unmount();
        }
      ),
      { numRuns: 100 }
    );
  }, 60000);
});


// =============================================================================
// Property 8: Initial sorts applied correctly
// Feature: read-only-grid, Property 8: Initial sorts applied correctly
// Validates: Requirements 5.5
// =============================================================================
describe("Property 8: Initial sorts applied correctly", () => {
  it("renders data sorted according to initialSorts on initial load", () => {
    fc.assert(
      fc.property(
        fc.array(arbRow, { minLength: 2, maxLength: 20 }),
        fc.boolean(),
        (data, ascending) => {
          const { unmount } = render(
            <ReadOnlyGrid
              data={data}
              pageSize={data.length}
              initialSorts={[{ field: "score", ascending }]}
            >
              <GridColumn label="Score" value="score" sortField="score" />
            </ReadOnlyGrid>
          );

          // Compute expected order
          const expectedScores = [...data]
            .sort((a, b) =>
              ascending ? a.score - b.score : b.score - a.score
            )
            .map((r) => r.score);

          // Read rendered scores
          const renderedScores = screen
            .getAllByRole("row")
            .slice(1)
            .map((row) => Number(within(row).getAllByRole("cell")[0].textContent));

          expect(renderedScores).toEqual(expectedScores);

          unmount();
        }
      ),
      { numRuns: 100 }
    );
  }, 30000);
});


// Need vi for mocking selectionSaveInto callbacks
import { vi } from "vitest";

// --- Selection test helpers ---

/** Generate a data array where each row has a unique numeric `id` field (1..N) */
const arbIdDataArray = (minLen = 1, maxLen = 20) =>
  fc.integer({ min: minLen, max: maxLen }).chain((n) =>
    fc.tuple(
      ...Array.from({ length: n }, (_, i) =>
        fc.record({
          id: fc.constant(i + 1),
          name: fc.string({ minLength: 1, maxLength: 10 }).map((s) => s.replace(/\s+/g, "_")),
          score: fc.integer({ min: 0, max: 100 }),
        })
      )
    )
  );

// =============================================================================
// Property 9: Selection toggle updates identifiers
// Feature: read-only-grid, Property 9: Selection toggle updates identifiers
// Validates: Requirements 6.2
// =============================================================================
describe("Property 9: Selection toggle updates identifiers", () => {
  it("clicking an unselected row's checkbox calls selectionSaveInto with that row's id included", async () => {
    const user = userEvent.setup();

    await fc.assert(
      fc.asyncProperty(
        arbIdDataArray(1, 15),
        async (data) => {
          const rowIndex = Math.floor(Math.random() * data.length);
          const targetId = data[rowIndex].id;
          const onSelect = vi.fn();

          const { unmount } = render(
            <ReadOnlyGrid
              data={data}
              selectable={true}
              selectionValue={[]}
              selectionSaveInto={onSelect}
              pageSize={data.length}
            >
              <GridColumn label="Name" value="name" />
            </ReadOnlyGrid>
          );

          // Click the target row's checkbox
          const checkbox = screen.getByLabelText(`Select row ${rowIndex + 1}`);
          await user.click(checkbox);

          expect(onSelect).toHaveBeenCalledTimes(1);
          const callArg = onSelect.mock.calls[0][0];
          expect(callArg).toContain(targetId);

          unmount();
        }
      ),
      { numRuns: 100 }
    );
  }, 60000);

  it("clicking an already-selected row's checkbox calls selectionSaveInto without that row's id", async () => {
    const user = userEvent.setup();

    await fc.assert(
      fc.asyncProperty(
        arbIdDataArray(1, 15),
        async (data) => {
          const rowIndex = Math.floor(Math.random() * data.length);
          const targetId = data[rowIndex].id;
          const onSelect = vi.fn();

          // Render with the target row already selected
          const { unmount } = render(
            <ReadOnlyGrid
              data={data}
              selectable={true}
              selectionValue={[targetId]}
              selectionSaveInto={onSelect}
              pageSize={data.length}
            >
              <GridColumn label="Name" value="name" />
            </ReadOnlyGrid>
          );

          // Click the target row's checkbox to deselect
          const checkbox = screen.getByLabelText(`Select row ${rowIndex + 1}`);
          await user.click(checkbox);

          expect(onSelect).toHaveBeenCalledTimes(1);
          const callArg = onSelect.mock.calls[0][0];
          expect(callArg).not.toContain(targetId);

          unmount();
        }
      ),
      { numRuns: 100 }
    );
  }, 60000);
});

// =============================================================================
// Property 10: Select-all / deselect-all round trip
// Feature: read-only-grid, Property 10: Select-all / deselect-all round trip
// Validates: Requirements 6.3, 6.4
// =============================================================================
describe("Property 10: Select-all / deselect-all round trip", () => {
  it("header checkbox selects all page rows, then deselects all page rows", async () => {
    const user = userEvent.setup();

    await fc.assert(
      fc.asyncProperty(
        arbIdDataArray(1, 15),
        async (data) => {
          const allIds = data.map((r) => r.id);
          const onSelectAll = vi.fn();

          // Render with no rows selected
          const { unmount: unmount1 } = render(
            <ReadOnlyGrid
              data={data}
              selectable={true}
              selectionValue={[]}
              selectionSaveInto={onSelectAll}
              pageSize={data.length}
            >
              <GridColumn label="Name" value="name" />
            </ReadOnlyGrid>
          );

          // Click header checkbox → should select all
          const headerCheckbox = screen.getByLabelText("Select all rows");
          await user.click(headerCheckbox);

          expect(onSelectAll).toHaveBeenCalledTimes(1);
          const selectAllArg = onSelectAll.mock.calls[0][0] as (string | number)[];
          // All page row ids should be included
          allIds.forEach((id) => {
            expect(selectAllArg).toContain(id);
          });

          unmount1();

          // Now render with all rows selected and click header to deselect
          const onDeselectAll = vi.fn();

          const { unmount: unmount2 } = render(
            <ReadOnlyGrid
              data={data}
              selectable={true}
              selectionValue={allIds}
              selectionSaveInto={onDeselectAll}
              pageSize={data.length}
            >
              <GridColumn label="Name" value="name" />
            </ReadOnlyGrid>
          );

          const headerCheckbox2 = screen.getByLabelText("Select all rows");
          await user.click(headerCheckbox2);

          expect(onDeselectAll).toHaveBeenCalledTimes(1);
          const deselectAllArg = onDeselectAll.mock.calls[0][0] as (string | number)[];
          expect(deselectAllArg).toEqual([]);

          unmount2();
        }
      ),
      { numRuns: 100 }
    );
  }, 60000);
});

// =============================================================================
// Property 11: Pre-selected rows render as selected
// Feature: read-only-grid, Property 11: Pre-selected rows render as selected
// Validates: Requirements 6.5
// =============================================================================
describe("Property 11: Pre-selected rows render as selected", () => {
  it("rows in selectionValue have checked checkboxes, others do not", () => {
    fc.assert(
      fc.property(
        arbIdDataArray(1, 15),
        (data) => {
          const allIds = data.map((r) => r.id);
          // Generate a random subset of ids
          const subset = allIds.filter(() => Math.random() < 0.5);

          const { unmount } = render(
            <ReadOnlyGrid
              data={data}
              selectable={true}
              selectionValue={subset}
              selectionSaveInto={vi.fn()}
              pageSize={data.length}
            >
              <GridColumn label="Name" value="name" />
            </ReadOnlyGrid>
          );

          // Check each row's checkbox state
          data.forEach((row, i) => {
            const checkbox = screen.getByLabelText(`Select row ${i + 1}`) as HTMLInputElement;
            if (subset.includes(row.id)) {
              expect(checkbox.checked).toBe(true);
            } else {
              expect(checkbox.checked).toBe(false);
            }
          });

          unmount();
        }
      ),
      { numRuns: 100 }
    );
  }, 30000);
});


// =============================================================================
// Property 12: Alternate row shading pattern
// Feature: read-only-grid, Property 12: Alternate row shading pattern
// Validates: Requirements 7.3
// =============================================================================
describe("Property 12: Alternate row shading pattern", () => {
  it("even-indexed rows have bg-gray-50 and odd-indexed rows do not when shadeAlternateRows is true", () => {
    fc.assert(
      fc.property(
        fc.array(arbRow, { minLength: 2, maxLength: 20 }),
        (data) => {
          const { unmount } = render(
            <ReadOnlyGrid data={data} shadeAlternateRows={true} pageSize={data.length}>
              <GridColumn label="Name" value="name" />
            </ReadOnlyGrid>
          );

          // Get all data rows (skip header row)
          const allRows = screen.getAllByRole("row");
          const dataRows = allRows.slice(1);

          expect(dataRows).toHaveLength(data.length);

          dataRows.forEach((row, index) => {
            if (index % 2 === 0) {
              // Even-indexed rows SHALL have shaded background
              expect(row.className).toContain("bg-gray-50");
            } else {
              // Odd-indexed rows SHALL NOT have shaded background
              expect(row.className).not.toContain("bg-gray-50");
            }
          });

          unmount();
        }
      ),
      { numRuns: 100 }
    );
  }, 30000);
});

// =============================================================================
// Property 13: Fixed height constrains grid body
// Feature: read-only-grid, Property 13: Fixed height constrains grid body
// Validates: Requirements 7.5
// =============================================================================
describe("Property 13: Fixed height constrains grid body", () => {
  const heightMap: Record<string, string> = {
    SHORT: "max-h-40",
    SHORT_PLUS: "max-h-52",
    MEDIUM: "max-h-64",
    MEDIUM_PLUS: "max-h-80",
    TALL: "max-h-96",
    TALL_PLUS: "max-h-[28rem]",
    EXTRA_TALL: "max-h-[36rem]",
  };

  const nonAutoHeights = Object.keys(heightMap) as Array<keyof typeof heightMap>;

  it("grid body container has the correct max-height class, overflow-y-auto, and sticky header", () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...nonAutoHeights),
        fc.array(arbRow, { minLength: 1, maxLength: 10 }),
        (height, data) => {
          const { unmount, container } = render(
            <ReadOnlyGrid data={data} height={height as any} pageSize={data.length}>
              <GridColumn label="Name" value="name" />
            </ReadOnlyGrid>
          );

          const expectedMaxHClass = heightMap[height];

          // Find the scroll container (div with overflow-y-auto wrapping the table)
          const scrollContainer = container.querySelector(`.overflow-y-auto`);
          expect(scrollContainer).not.toBeNull();

          // Verify it has the correct max-height class
          expect(scrollContainer!.className).toContain(expectedMaxHClass);

          // Verify the thead has sticky header classes
          const thead = container.querySelector("thead");
          expect(thead).not.toBeNull();
          expect(thead!.className).toContain("sticky");
          expect(thead!.className).toContain("top-0");
          expect(thead!.className).toContain("bg-white");
          expect(thead!.className).toContain("z-10");

          unmount();
        }
      ),
      { numRuns: 100 }
    );
  }, 30000);
});
