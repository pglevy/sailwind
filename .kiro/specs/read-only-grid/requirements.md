# Requirements Document

## Introduction

This document defines the requirements for the ReadOnlyGrid and GridColumn components in the Sailwind component library. These components recreate the Appian SAIL `a!gridField()` and `a!gridColumn()` read-only grid experience as React components styled with Tailwind CSS. The grid displays tabular data with support for paging, sorting, row selection, and configurable column display. This is a prototyping library, so the focus is on the most commonly used and visually impactful parameters.

## Glossary

- **ReadOnlyGrid**: The top-level React component that renders a data grid with paging, sorting, and selection. Maps to Appian's `a!gridField()`.
- **GridColumn**: A child component of ReadOnlyGrid that defines a single column's label, value accessor, width, alignment, and styling. Maps to Appian's `a!gridColumn()`.
- **FieldWrapper**: An existing shared component in Sailwind that handles label, labelPosition, instructions, helpTooltip, accessibilityText, and validation display for form-like components.
- **PagingInfo**: An object describing the current page state: startIndex, batchSize, and sort information.
- **SortInfo**: An object describing a sort field and its direction (ascending or descending).
- **PageSize**: The number of rows displayed per page. Default is 10.
- **SelectionValue**: An array of identifiers representing currently selected rows.

## Requirements

### Requirement 1: Grid Data Rendering

**User Story:** As a developer, I want to render an array of data objects as a table with configurable columns, so that I can display structured data in my prototype.

#### Acceptance Criteria

1. WHEN a data array and columns are provided, THE ReadOnlyGrid SHALL render a table with one row per data item and one column per GridColumn definition
2. WHEN the data array is empty or undefined, THE ReadOnlyGrid SHALL display the emptyGridMessage text (defaulting to "No items available")
3. WHEN a GridColumn defines a value accessor function, THE ReadOnlyGrid SHALL call that function with each row's data object and render the returned value in the corresponding cell
4. WHEN a GridColumn defines a string field name as value, THE ReadOnlyGrid SHALL look up that field on each row's data object and render it in the corresponding cell

### Requirement 2: Column Configuration

**User Story:** As a developer, I want to configure individual columns with labels, widths, alignment, and background colors, so that I can control the visual presentation of each column.

#### Acceptance Criteria

1. THE GridColumn SHALL display its label text as the column header
2. WHEN a GridColumn specifies an align value ("START", "CENTER", or "END"), THE ReadOnlyGrid SHALL align the header and all cell content in that column accordingly
3. WHEN a GridColumn specifies a width value, THE ReadOnlyGrid SHALL apply the corresponding width to that column
4. WHEN a GridColumn specifies a backgroundColor (hex color or semantic name), THE ReadOnlyGrid SHALL apply that background color to each cell in the column
5. WHEN a GridColumn has showWhen set to false, THE ReadOnlyGrid SHALL hide that column entirely

### Requirement 3: Label and Validation Display

**User Story:** As a developer, I want the grid to display a label, instructions, and validation messages, so that the grid integrates consistently with other Sailwind form components.

#### Acceptance Criteria

1. WHEN a label is provided, THE ReadOnlyGrid SHALL display the label text above or adjacent to the grid based on the labelPosition parameter
2. WHEN labelPosition is "COLLAPSED", THE ReadOnlyGrid SHALL hide the label visually while keeping it accessible to screen readers
3. WHEN instructions text is provided, THE ReadOnlyGrid SHALL display it below the label and above the grid
4. WHEN a helpTooltip is provided and labelPosition is not "COLLAPSED", THE ReadOnlyGrid SHALL display a help icon next to the label that shows the tooltip text on hover
5. WHEN validations are provided, THE ReadOnlyGrid SHALL display each validation message below the grid
6. WHEN accessibilityText is provided, THE ReadOnlyGrid SHALL include it as an aria-label on the grid table element

### Requirement 4: Paging

**User Story:** As a developer, I want the grid to paginate data automatically, so that large datasets are displayed in manageable pages.

#### Acceptance Criteria

1. WHEN the data array has more items than the pageSize, THE ReadOnlyGrid SHALL display only pageSize rows on the current page
2. WHEN the grid has multiple pages, THE ReadOnlyGrid SHALL display paging controls showing the current page range (e.g., "1 - 10 of 50") and navigation buttons
3. WHEN the user clicks the next page button, THE ReadOnlyGrid SHALL display the next page of data
4. WHEN the user clicks the previous page button, THE ReadOnlyGrid SHALL display the previous page of data
5. WHEN the grid is on the first page, THE ReadOnlyGrid SHALL disable the previous page button
6. WHEN the grid is on the last page, THE ReadOnlyGrid SHALL disable the next page button
7. WHEN all rows fit on a single page, THE ReadOnlyGrid SHALL hide the paging controls
8. WHEN pageSize is not specified, THE ReadOnlyGrid SHALL default to 10 rows per page

### Requirement 5: Sorting

**User Story:** As a developer, I want users to be able to sort the grid by clicking column headers, so that they can organize data by any sortable column.

#### Acceptance Criteria

1. WHEN a GridColumn specifies a sortField, THE ReadOnlyGrid SHALL make that column header clickable for sorting
2. WHEN the user clicks a sortable column header, THE ReadOnlyGrid SHALL sort the data by that column in ascending order
3. WHEN the user clicks the same sortable column header again, THE ReadOnlyGrid SHALL toggle the sort direction to descending
4. WHEN a column is actively sorted, THE ReadOnlyGrid SHALL display a sort direction indicator (arrow) in that column header
5. WHEN initialSorts are provided, THE ReadOnlyGrid SHALL apply those sorts on initial render
6. WHEN a GridColumn does not specify a sortField, THE ReadOnlyGrid SHALL render that column header as non-clickable plain text

### Requirement 6: Row Selection

**User Story:** As a developer, I want to enable row selection with checkboxes, so that users can select one or more rows for further action.

#### Acceptance Criteria

1. WHEN selectable is true, THE ReadOnlyGrid SHALL display a checkbox column as the first column
2. WHEN the user clicks a row checkbox, THE ReadOnlyGrid SHALL add that row's identifier to the selection and call selectionSaveInto with the updated selection array
3. WHEN the user clicks the header checkbox, THE ReadOnlyGrid SHALL select all rows on the current page and call selectionSaveInto with the updated selection array
4. WHEN the user clicks the header checkbox while all current page rows are selected, THE ReadOnlyGrid SHALL deselect all rows on the current page
5. WHEN selectionValue is provided, THE ReadOnlyGrid SHALL render those rows as pre-selected
6. WHEN selectionStyle is "ROW_HIGHLIGHT", THE ReadOnlyGrid SHALL highlight selected rows instead of showing checkboxes

### Requirement 7: Visual Styling

**User Story:** As a developer, I want to configure the grid's visual appearance (borders, row shading, spacing, height), so that the grid matches the desired design.

#### Acceptance Criteria

1. WHEN borderStyle is "STANDARD", THE ReadOnlyGrid SHALL render the grid with standard visible borders
2. WHEN borderStyle is "LIGHT" or not specified, THE ReadOnlyGrid SHALL render the grid with light subtle borders
3. WHEN shadeAlternateRows is true, THE ReadOnlyGrid SHALL apply a light background shade to every other row
4. WHEN spacing is "DENSE", THE ReadOnlyGrid SHALL reduce the cell padding compared to "STANDARD" spacing
5. WHEN height is set to a fixed value (e.g., "SHORT", "MEDIUM", "TALL"), THE ReadOnlyGrid SHALL constrain the grid body to that height with vertical scrolling and a fixed header
6. WHEN height is "AUTO" or not specified, THE ReadOnlyGrid SHALL let the grid grow to fit all displayed rows without scrolling

### Requirement 8: Conditional Visibility

**User Story:** As a developer, I want to conditionally show or hide the entire grid, so that I can control when the grid appears in the interface.

#### Acceptance Criteria

1. WHEN showWhen is false, THE ReadOnlyGrid SHALL not render any output
2. WHEN showWhen is true or not specified, THE ReadOnlyGrid SHALL render normally
