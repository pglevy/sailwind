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
