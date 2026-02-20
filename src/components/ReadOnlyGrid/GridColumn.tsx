import React from "react";
import type { SAILAlign, SAILGridColumnWidth } from "../../types/sail";

/**
 * Props for the GridColumn component.
 * GridColumn is a configuration-only component — it renders nothing.
 * ReadOnlyGrid reads these props from its children to define column behavior.
 */
export interface GridColumnProps {
  /** Text to display as the column header */
  label?: string;
  /** Field name used for sorting when this column header is clicked */
  sortField?: string;
  /**
   * Display value for each cell. Can be:
   * - A string field name to look up on each row object
   * - A function (row: any, index: number) => React.ReactNode
   */
  value?: string | ((row: any, index: number) => React.ReactNode);
  /** Alignment for header and cell content */
  align?: SAILAlign;
  /** Column width */
  width?: SAILGridColumnWidth;
  /** Background color for cells — hex color or semantic name */
  backgroundColor?: string | ((row: any) => string);
  /** Whether this column is visible. Defaults to true. */
  showWhen?: boolean;
  /** Additional text for screen readers */
  accessibilityText?: string;
}

/**
 * GridColumn is a declarative, configuration-only component.
 * It renders nothing — ReadOnlyGrid reads its props to determine column behavior.
 */
export const GridColumn: React.FC<GridColumnProps> = () => null;
