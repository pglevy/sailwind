import React from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { FieldWrapper } from "../shared/FieldWrapper";
import { GridColumn, type GridColumnProps } from "./GridColumn";
import type {
  SAILLabelPosition,
  SAILMarginSize,
  SAILGridHeight,
  SortInfo,
} from "../../types/sail";

export interface ReadOnlyGridProps {
  /** Text to display as the grid label */
  label?: string;
  /** Determines where the label appears */
  labelPosition?: SAILLabelPosition;
  /** Supplemental text about this grid */
  instructions?: string;
  /** Displays a help icon with tooltip text */
  helpTooltip?: string;
  /** Text to display when no data is available */
  emptyGridMessage?: string;
  /** The data array to display */
  data?: Record<string, any>[];
  /** GridColumn children defining the columns */
  children?: React.ReactNode;
  /** Maximum rows per page. Default: 10 */
  pageSize?: number;
  /** Initial sort configurations */
  initialSorts?: SortInfo[];
  /** Whether rows are selectable */
  selectable?: boolean;
  /** Selection visual style */
  selectionStyle?: "CHECKBOX" | "ROW_HIGHLIGHT";
  /** Currently selected row identifiers */
  selectionValue?: (string | number)[];
  /** Callback when selection changes */
  selectionSaveInto?: (selectedIds: (string | number)[]) => void;
  /** Validation messages to display below the grid */
  validations?: string[];
  /** Whether the component is displayed */
  showWhen?: boolean;
  /** Cell spacing */
  spacing?: "STANDARD" | "DENSE";
  /** Grid height */
  height?: SAILGridHeight;
  /** Border style */
  borderStyle?: "STANDARD" | "LIGHT";
  /** Whether to shade alternate rows */
  shadeAlternateRows?: boolean;
  /** Index of column to use as row header for accessibility */
  rowHeader?: number;
  /** Additional text for screen readers */
  accessibilityText?: string;
  /** Space above component */
  marginAbove?: SAILMarginSize;
  /** Space below component */
  marginBelow?: SAILMarginSize;
}

/** Extract column definitions from GridColumn children */
function extractColumns(children: React.ReactNode): GridColumnProps[] {
  const columns: GridColumnProps[] = [];
  React.Children.forEach(children, (child) => {
    if (React.isValidElement(child) && child.type === GridColumn) {
      columns.push(child.props as GridColumnProps);
    }
  });
  return columns;
}

/** Resolve a cell value from a row using the column's value accessor */
function resolveValue(
  value: GridColumnProps["value"],
  row: Record<string, any>,
  rowIndex: number
): React.ReactNode {
  if (value === undefined || value === null) {
    return null;
  }
  if (typeof value === "string") {
    return row[value] ?? null;
  }
  if (typeof value === "function") {
    try {
      return value(row, rowIndex);
    } catch (e) {
      console.warn("GridColumn value accessor threw an error:", e);
      return null;
    }
  }
  return null;
}

/** Resolve background color for a cell */
function resolveBgColor(
  backgroundColor: GridColumnProps["backgroundColor"],
  row: Record<string, any>
): { className?: string; style?: React.CSSProperties } {
  if (!backgroundColor) return {};
  const colorValue =
    typeof backgroundColor === "function" ? backgroundColor(row) : backgroundColor;
  if (!colorValue || colorValue === "NONE") return {};
  if (bgColorMap[colorValue] !== undefined) {
    return bgColorMap[colorValue] ? { className: bgColorMap[colorValue] } : {};
  }
  if (colorValue.startsWith("#")) {
    return { style: { backgroundColor: colorValue } };
  }
  return {};
}

// --- Styling maps ---

const heightMap: Record<string, string> = {
  SHORT: "max-h-40",
  SHORT_PLUS: "max-h-52",
  MEDIUM: "max-h-64",
  MEDIUM_PLUS: "max-h-80",
  TALL: "max-h-96",
  TALL_PLUS: "max-h-[28rem]",
  EXTRA_TALL: "max-h-[36rem]",
  AUTO: "",
};

const widthMap: Record<string, string> = {
  AUTO: "",
  ICON: "w-10",
  ICON_PLUS: "w-14",
  NARROW: "w-24",
  NARROW_PLUS: "w-32",
  MEDIUM: "w-40",
  MEDIUM_PLUS: "w-48",
  WIDE: "w-64",
  "1X": "flex-1",
  "2X": "flex-[2]",
  "3X": "flex-[3]",
  "4X": "flex-[4]",
  "5X": "flex-[5]",
  "6X": "flex-[6]",
  "7X": "flex-[7]",
  "8X": "flex-[8]",
  "9X": "flex-[9]",
  "10X": "flex-[10]",
};

const alignMap: Record<string, string> = {
  START: "text-left",
  CENTER: "text-center",
  END: "text-right",
};

const bgColorMap: Record<string, string> = {
  NONE: "",
  ACCENT: "bg-blue-50",
  SUCCESS: "bg-green-50",
  INFO: "bg-sky-50",
  WARN: "bg-yellow-50",
  ERROR: "bg-red-50",
};

export const ReadOnlyGrid: React.FC<ReadOnlyGridProps> = ({
  label,
  labelPosition,
  instructions,
  helpTooltip,
  emptyGridMessage = "No items available",
  data,
  children,
  pageSize: pageSizeProp = 10,
  initialSorts,
  selectable,
  selectionStyle = "CHECKBOX",
  selectionValue = [],
  selectionSaveInto,
  validations,
  showWhen = true,
  borderStyle = "LIGHT",
  shadeAlternateRows = false,
  spacing = "STANDARD",
  height = "AUTO",
  accessibilityText,
  marginAbove,
  marginBelow,
}) => {
  const gridId = React.useId();

  // Handle invalid pageSize (0 or negative → default to 10)
  const pageSize = pageSizeProp > 0 ? pageSizeProp : 10;

  // Normalize data — treat undefined/null/non-array as empty
  const rows = Array.isArray(data) ? data : [];

  // Paging state (1-based)
  const [currentPage, setCurrentPage] = React.useState(1);

  // Sorting state
  const [sortField, setSortField] = React.useState<string | null>(null);
  const [sortAscending, setSortAscending] = React.useState(true);

  // Apply initialSorts on first render
  React.useEffect(() => {
    if (initialSorts && initialSorts.length > 0) {
      setSortField(initialSorts[0].field);
      setSortAscending(initialSorts[0].ascending);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reset currentPage to 1 when data length changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [rows.length]);

  // Sort handler
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortAscending((prev) => !prev);
    } else {
      setSortField(field);
      setSortAscending(true);
    }
    setCurrentPage(1);
  };

  // Tag each row with its original index before sorting (for row ID fallback)
  const indexedRows = React.useMemo(
    () => rows.map((row, i) => ({ ...row, __originalIndex: i })),
    [rows]
  );

  // Sort data before paging
  const sortedRows = React.useMemo(() => {
    if (!sortField) return indexedRows;
    return [...indexedRows].sort((a, b) => {
      const aVal = (a as Record<string, any>)[sortField];
      const bVal = (b as Record<string, any>)[sortField];
      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return sortAscending ? -1 : 1;
      if (bVal == null) return sortAscending ? 1 : -1;
      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortAscending
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }
      if (aVal < bVal) return sortAscending ? -1 : 1;
      if (aVal > bVal) return sortAscending ? 1 : -1;
      return 0;
    });
  }, [indexedRows, sortField, sortAscending]);

  // Requirement 8.1: showWhen=false renders nothing
  if (!showWhen) {
    return null;
  }

  const columns = extractColumns(children);
  // Requirement 2.5: filter out columns with showWhen=false
  const visibleColumns = columns.filter((col) => col.showWhen !== false);

  // Styling computations
  const isStandardBorder = borderStyle === "STANDARD";
  // STANDARD: full outer border + column dividers; LIGHT: no outer border, no vertical borders
  const tableBorderClass = isStandardBorder ? "border border-gray-300" : "";
  const headerRowBorderClass = isStandardBorder
    ? "border-b border-gray-300"
    : "border-b border-gray-200";
  const cellBorderClass = isStandardBorder
    ? "border-b border-gray-300"
    : "border-b border-gray-200";
  // STANDARD: vertical dividers between columns
  const colDividerClass = isStandardBorder ? "border-r border-gray-300" : "";
  const cellPaddingClass = spacing === "DENSE" ? "px-2 py-1" : "px-3 py-2";
  const heightClass = heightMap[height] || "";
  const needsScrollContainer = height !== "AUTO" && heightClass !== "";

  // Compute paging state (use sortedRows for total count)
  const totalPages = Math.ceil(sortedRows.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, sortedRows.length);
  const hasPreviousPage = currentPage > 1;
  const hasNextPage = currentPage < totalPages;

  // Slice sorted data for current page
  const pageRows = sortedRows.slice(startIndex, endIndex);

  // Row identifier: use row.id if it exists, otherwise use original index
  const getRowId = (row: Record<string, any>): string | number => {
    return row.id !== undefined ? row.id : row.__originalIndex;
  };

  // Selection handlers
  const handleRowSelect = (rowId: string | number) => {
    if (!selectionSaveInto) return;
    const isSelected = selectionValue.includes(rowId);
    const newSelection = isSelected
      ? selectionValue.filter((id) => id !== rowId)
      : [...selectionValue, rowId];
    selectionSaveInto(newSelection);
  };

  const pageRowIds = selectable
    ? pageRows.map((row) => getRowId(row))
    : [];
  const allPageRowsSelected =
    selectable && pageRowIds.length > 0 && pageRowIds.every((id) => selectionValue.includes(id));

  const handleSelectAll = () => {
    if (!selectionSaveInto) return;
    if (allPageRowsSelected) {
      // Deselect all page rows
      selectionSaveInto(selectionValue.filter((id) => !pageRowIds.includes(id)));
    } else {
      // Select all page rows (add missing ones)
      const newSelection = [...selectionValue];
      pageRowIds.forEach((id) => {
        if (!newSelection.includes(id)) newSelection.push(id);
      });
      selectionSaveInto(newSelection);
    }
  };

  const footer =
    validations && validations.length > 0 ? (
      <div>
        {validations.map((v, i) => (
          <p key={i} className="text-red-600 text-sm mt-1">
            {v}
          </p>
        ))}
      </div>
    ) : undefined;

  const getColWidthClass = (col: GridColumnProps) =>
    col.width && widthMap[col.width] ? widthMap[col.width] : "";

  const getColAlignClass = (col: GridColumnProps) =>
    col.align && alignMap[col.align] ? alignMap[col.align] : "text-left";

  const renderTable = () => (
    <table
      className={`w-full border-collapse ${tableBorderClass}`}
      aria-label={accessibilityText}
    >
      <thead className={needsScrollContainer ? "sticky top-0 bg-white z-10" : undefined}>
        <tr className={headerRowBorderClass}>
          {selectable && selectionStyle === "CHECKBOX" && (
            <th className={`${cellPaddingClass} w-10${colDividerClass ? ` ${colDividerClass}` : ""}`}>
              <input
                type="checkbox"
                checked={allPageRowsSelected}
                onChange={handleSelectAll}
                aria-label="Select all rows"
              />
            </th>
          )}
          {visibleColumns.map((col, colIndex) => {
            const widthClass = getColWidthClass(col);
            const alignClass = getColAlignClass(col);
            const isLastCol = colIndex === visibleColumns.length - 1;
            const divider = !isLastCol && colDividerClass ? ` ${colDividerClass}` : "";
            return (
              <th
                key={colIndex}
                className={`${cellPaddingClass} ${alignClass} text-sm font-semibold text-base${widthClass ? ` ${widthClass}` : ""}${divider}`}
                aria-sort={
                  sortField === col.sortField
                    ? sortAscending
                      ? "ascending"
                      : "descending"
                    : undefined
                }
              >
                {col.sortField ? (
                  <button
                    type="button"
                    onClick={() => handleSort(col.sortField!)}
                    className="flex items-center gap-1 hover:text-gray-900 cursor-pointer"
                  >
                    {col.label ?? ""}
                    {sortField === col.sortField && (
                      <span aria-hidden="true">
                        {sortAscending ? "▲" : "▼"}
                      </span>
                    )}
                  </button>
                ) : (
                  col.label ?? ""
                )}
              </th>
            );
          })}
        </tr>
      </thead>
      <tbody>
        {pageRows.map((row, rowIndex) => {
          const rowId = getRowId(row);
          const isRowSelected = selectable && selectionValue.includes(rowId);
          const isRowHighlightSelected =
            selectable && selectionStyle === "ROW_HIGHLIGHT" && isRowSelected;
          const alternateRowClass =
            shadeAlternateRows && rowIndex % 2 === 0 && !isRowHighlightSelected
              ? "bg-gray-50"
              : "";
          return (
            <tr
              key={rowIndex}
              className={`${cellBorderClass}${
                selectable && selectionStyle === "ROW_HIGHLIGHT"
                  ? " cursor-pointer"
                  : ""
              }${isRowHighlightSelected ? " bg-blue-50" : ""}${
                alternateRowClass ? ` ${alternateRowClass}` : ""
              }`}
              onClick={
                selectable && selectionStyle === "ROW_HIGHLIGHT"
                  ? () => handleRowSelect(rowId)
                  : undefined
              }
            >
              {selectable && selectionStyle === "CHECKBOX" && (
                <td className={`${cellPaddingClass} w-10${colDividerClass ? ` ${colDividerClass}` : ""}`}>
                  <input
                    type="checkbox"
                    checked={isRowSelected || false}
                    onChange={() => handleRowSelect(rowId)}
                    aria-label={`Select row ${rowIndex + 1}`}
                  />
                </td>
              )}
              {visibleColumns.map((col, colIndex) => {
                const widthClass = getColWidthClass(col);
                const alignClass = getColAlignClass(col);
                const bg = resolveBgColor(col.backgroundColor, row);
                const isLastCol = colIndex === visibleColumns.length - 1;
                const divider = !isLastCol && colDividerClass ? ` ${colDividerClass}` : "";
                return (
                  <td
                    key={colIndex}
                    className={`${cellPaddingClass} ${alignClass} text-sm text-gray-900${widthClass ? ` ${widthClass}` : ""}${bg.className ? ` ${bg.className}` : ""}${divider}`}
                    style={bg.style}
                  >
                    {resolveValue(col.value, row, startIndex + rowIndex)}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );

  return (
    <FieldWrapper
      label={label}
      labelPosition={labelPosition}
      instructions={instructions}
      helpTooltip={helpTooltip}
      accessibilityText={accessibilityText}
      inputId={gridId}
      marginAbove={marginAbove}
      marginBelow={marginBelow}
      footer={footer}
    >
      {rows.length === 0 ? (
        <div className="text-gray-500 py-4 text-center">{emptyGridMessage}</div>
      ) : (
        <>
          {needsScrollContainer ? (
            <div className={`${heightClass} overflow-y-auto`}>
              {renderTable()}
            </div>
          ) : (
            renderTable()
          )}
          {totalPages > 1 && (
            <div className="flex items-center justify-end gap-2 px-3 py-2 text-sm text-gray-700">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={!hasPreviousPage}
                aria-label="First page"
                title="First page"
                className="px-1 py-1 disabled:text-gray-300 disabled:cursor-not-allowed text-blue-700 hover:text-blue-900 cursor-pointer"
              >
                <ChevronsLeft size={18} />
              </button>
              <button
                onClick={() => setCurrentPage(p => p - 1)}
                disabled={!hasPreviousPage}
                aria-label="Previous page"
                title="Previous page"
                className="px-1 py-1 disabled:text-gray-300 disabled:cursor-not-allowed text-blue-700 hover:text-blue-900 cursor-pointer"
              >
                <ChevronLeft size={18} />
              </button>
              <span>
                <span className="font-bold">{startIndex + 1} – {endIndex}</span>
                {" "}of {sortedRows.length}
              </span>
              <button
                onClick={() => setCurrentPage(p => p + 1)}
                disabled={!hasNextPage}
                aria-label="Next page"
                title="Next page"
                className="px-1 py-1 disabled:text-gray-300 disabled:cursor-not-allowed text-blue-700 hover:text-blue-900 cursor-pointer"
              >
                <ChevronRight size={18} />
              </button>
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={!hasNextPage}
                aria-label="Last page"
                title="Last page"
                className="px-1 py-1 disabled:text-gray-300 disabled:cursor-not-allowed text-blue-700 hover:text-blue-900 cursor-pointer"
              >
                <ChevronsRight size={18} />
              </button>
            </div>
          )}
        </>
      )}
    </FieldWrapper>
  );
};
