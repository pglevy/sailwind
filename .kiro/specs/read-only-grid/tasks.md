# Implementation Plan: ReadOnlyGrid

## Overview

Implement the ReadOnlyGrid and GridColumn components for the Sailwind library. The implementation proceeds incrementally: types first, then GridColumn, then the core grid rendering, then paging, sorting, selection, styling, and finally Storybook stories. Testing infrastructure is set up early so property tests can validate each feature as it's built.

## Tasks

- [x] 1. Set up test infrastructure and shared types
  - [x] 1.1 Install vitest, @testing-library/react, @testing-library/jest-dom, jsdom, and fast-check as dev dependencies
    - Add vitest config to vite.config or create vitest.config.ts
    - Configure jsdom as the test environment
    - _Requirements: N/A (infrastructure)_
  - [x] 1.2 Add grid-related types to `src/types/sail.ts`
    - Add `SortInfo`, `SAILGridHeight`, `SAILGridColumnWidth` types
    - _Requirements: 5.5, 2.3, 7.5_

- [x] 2. Implement GridColumn component and ReadOnlyGrid core rendering
  - [x] 2.1 Create `src/components/ReadOnlyGrid/GridColumn.tsx` with GridColumnProps interface and no-op component
    - GridColumn renders null; it's a configuration-only component
    - Export GridColumnProps interface with JSDoc comments
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_
  - [x] 2.2 Create `src/components/ReadOnlyGrid/ReadOnlyGrid.tsx` with core table rendering
    - Implement ReadOnlyGridProps interface
    - Extract column definitions from GridColumn children
    - Render table with header row and data rows
    - Handle value resolution (string field name and function accessor)
    - Handle showWhen for columns and for the grid itself
    - Handle empty data state with emptyGridMessage
    - Wrap with FieldWrapper for label, labelPosition, instructions, helpTooltip, validations, accessibilityText
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 8.1, 8.2_
  - [x] 2.3 Create `src/components/ReadOnlyGrid/index.ts` barrel export and add to `src/components/index.ts`
    - _Requirements: N/A (wiring)_
  - [x]* 2.4 Write property tests for core rendering
    - **Property 1: Data rendering dimensions**
    - **Validates: Requirements 1.1, 2.5**
    - **Property 2: Cell value resolution**
    - **Validates: Requirements 1.3, 1.4**
    - **Property 3: Column configuration application**
    - **Validates: Requirements 2.1, 2.2, 2.3, 2.4**
    - **Property 4: Grid metadata rendering**
    - **Validates: Requirements 3.1, 3.3, 3.5, 3.6**

- [x] 3. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 4. Implement paging
  - [x] 4.1 Add paging logic and paging controls UI to ReadOnlyGrid
    - Compute paging state (totalPages, startIndex, endIndex, hasPreviousPage, hasNextPage)
    - Slice data array for current page
    - Render paging controls: "X - Y of Z" text, previous/next buttons
    - Hide paging controls when all data fits on one page
    - Default pageSize to 10
    - Reset currentPage when data length changes
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8_
  - [x]* 4.2 Write property tests for paging
    - **Property 5: Paging row count constraint**
    - **Validates: Requirements 4.1**
    - **Property 6: Page navigation round trip**
    - **Validates: Requirements 4.3, 4.4**

- [x] 5. Implement sorting
  - [x] 5.1 Add sorting logic and sort indicators to ReadOnlyGrid
    - Track sortField and sortAscending in internal state
    - Apply initialSorts on first render
    - Make sortable column headers clickable; toggle sort direction on re-click
    - Sort data before paging slice
    - Display sort direction arrow indicator on active sort column
    - Non-sortable columns render as plain text headers
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6_
  - [x]* 5.2 Write property tests for sorting
    - **Property 7: Sort toggling behavior**
    - **Validates: Requirements 5.1, 5.2, 5.3, 5.6**
    - **Property 8: Initial sorts applied correctly**
    - **Validates: Requirements 5.5**

- [x] 6. Implement row selection
  - [x] 6.1 Add selection logic and checkbox/highlight rendering to ReadOnlyGrid
    - Render checkbox column when selectable=true
    - Handle row checkbox click: add/remove identifier, call selectionSaveInto
    - Handle header checkbox: select-all / deselect-all for current page
    - Render pre-selected rows from selectionValue
    - Support ROW_HIGHLIGHT selectionStyle (highlight row background instead of checkboxes)
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6_
  - [x]* 6.2 Write property tests for selection
    - **Property 9: Selection toggle updates identifiers**
    - **Validates: Requirements 6.2**
    - **Property 10: Select-all / deselect-all round trip**
    - **Validates: Requirements 6.3, 6.4**
    - **Property 11: Pre-selected rows render as selected**
    - **Validates: Requirements 6.5**

- [x] 7. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 8. Implement visual styling options
  - [x] 8.1 Add borderStyle, shadeAlternateRows, spacing, and height styling to ReadOnlyGrid
    - Map borderStyle to Tailwind border classes ("STANDARD" vs "LIGHT")
    - Apply alternating row background when shadeAlternateRows=true
    - Map spacing to cell padding classes ("STANDARD" vs "DENSE")
    - Map height to max-height + overflow-y-auto + sticky header classes
    - Map column width values to Tailwind width classes
    - Map backgroundColor semantic names and hex colors to cell styles
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6_
  - [x]* 8.2 Write property tests for styling
    - **Property 12: Alternate row shading pattern**
    - **Validates: Requirements 7.3**
    - **Property 13: Fixed height constrains grid body**
    - **Validates: Requirements 7.5**

- [x] 9. Create Storybook stories
  - [x] 9.1 Create `src/components/ReadOnlyGrid/ReadOnlyGrid.stories.tsx`
    - Default story: basic grid with sample data and columns
    - Empty state story: no data, custom emptyGridMessage
    - Paging story: large dataset showing paging controls
    - Sorting story: sortable columns with initialSorts
    - Selection story: selectable grid with checkbox and row-highlight variants
    - Styling story: borderStyle, shadeAlternateRows, spacing, height variations
    - With label/instructions/validations story
    - _Requirements: all_

- [x] 10. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties using fast-check
- Unit tests validate specific examples and edge cases
- The GridColumn component is configuration-only (renders null); ReadOnlyGrid reads its children's props
- FieldWrapper is reused for label/instructions/validations to stay consistent with other Sailwind components
