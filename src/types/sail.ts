/**
 * Shared SAIL type definitions
 * These types are used across multiple components to ensure consistency
 */

/**
 * Border radius/shape values matching SAIL's shape parameter
 */
export type SAILShape = "SQUARED" | "SEMI_ROUNDED" | "ROUNDED"

/**
 * Padding values matching SAIL's padding parameter
 */
export type SAILPadding = "NONE" | "EVEN_LESS" | "LESS" | "STANDARD" | "MORE" | "EVEN_MORE"

/**
 * Margin size values matching SAIL's marginAbove/marginBelow parameters
 */
export type SAILMarginSize = "NONE" | "EVEN_LESS" | "LESS" | "STANDARD" | "MORE" | "EVEN_MORE"

/**
 * Common size values matching SAIL's size parameter
 */
export type SAILSize = "SMALL" | "STANDARD" | "MEDIUM" | "LARGE"

/**
 * Extended size values (includes additional sizes used by some components)
 */
export type SAILSizeExtended = SAILSize | "MEDIUM_PLUS" | "LARGE_PLUS" | "EXTRA_LARGE"

/**
 * Alignment values matching SAIL's align parameter
 */
export type SAILAlign = "START" | "CENTER" | "END"

/**
 * Label position values matching SAIL's labelPosition parameter
 */
export type SAILLabelPosition = "ABOVE" | "ADJACENT" | "COLLAPSED" | "JUSTIFIED"

/**
 * Semantic color values matching SAIL's color constants
 */
export type SAILSemanticColor = "ACCENT" | "POSITIVE" | "NEGATIVE" | "SECONDARY" | "STANDARD"

/**
 * Sort configuration for grid columns
 */
export interface SortInfo {
  field: string;
  ascending: boolean;
}

/**
 * Grid height values matching SAIL's height parameter for grids
 */
export type SAILGridHeight =
  | "SHORT" | "SHORT_PLUS"
  | "MEDIUM" | "MEDIUM_PLUS"
  | "TALL" | "TALL_PLUS"
  | "EXTRA_TALL" | "AUTO";

/**
 * Grid column width values matching SAIL's width parameter for grid columns
 */
export type SAILGridColumnWidth =
  | "AUTO" | "ICON" | "ICON_PLUS"
  | "NARROW" | "NARROW_PLUS"
  | "MEDIUM" | "MEDIUM_PLUS"
  | "WIDE"
  | "1X" | "2X" | "3X" | "4X" | "5X"
  | "6X" | "7X" | "8X" | "9X" | "10X";
