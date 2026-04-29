import type { SAILMarginSize, SAILPadding, SAILShape, SAILSize, SAILAlign } from '../types/sail'

/**
 * Canonical SAIL enum → Tailwind class mappings.
 *
 * These maps are the single source of truth for how SAIL parameter values
 * translate to Tailwind utility classes. All components should import from
 * here instead of defining their own copies.
 *
 * See: https://github.com/pglevy/sailwind/issues/83
 */

// --- Margin Maps ---

export const marginAboveMap: Record<SAILMarginSize, string> = {
  NONE: '',
  EVEN_LESS: 'mt-1',
  LESS: 'mt-2',
  STANDARD: 'mt-4',
  MORE: 'mt-6',
  EVEN_MORE: 'mt-8'
}

export const marginBelowMap: Record<SAILMarginSize, string> = {
  NONE: '',
  EVEN_LESS: 'mb-1',
  LESS: 'mb-2',
  STANDARD: 'mb-4',
  MORE: 'mb-6',
  EVEN_MORE: 'mb-8'
}

// --- Padding Map ---

export const paddingMap: Record<SAILPadding, string> = {
  NONE: 'p-0',
  EVEN_LESS: 'p-1',
  LESS: 'p-2',
  STANDARD: 'p-4',
  MORE: 'p-6',
  EVEN_MORE: 'p-8'
}

// --- Shape Map ---

export const shapeMap: Record<SAILShape, string> = {
  SQUARED: 'rounded-none',
  SEMI_ROUNDED: 'rounded-sm',
  ROUNDED: 'rounded-md'
}

// --- Button / Interactive Size Maps ---

/** Size classes for labeled buttons, tabs, and toggles */
export const buttonSizeMap: Record<SAILSize, string> = {
  SMALL: 'px-3 py-2 text-sm leading-none',
  STANDARD: 'px-4 py-3 text-base leading-none',
  MEDIUM: 'px-5 py-4 text-lg leading-none',
  LARGE: 'px-6 py-5 text-xl leading-none'
}

/** Size classes for icon-only buttons (uniform padding for square aspect ratio) */
export const buttonIconOnlySizeMap: Record<SAILSize, string> = {
  SMALL: 'p-2 text-sm',
  STANDARD: 'p-3 text-base',
  MEDIUM: 'p-4 text-lg',
  LARGE: 'p-5 text-xl'
}

// --- Alignment Maps ---

/** Flex alignment (for button arrays, tags, images, stamps) */
export const alignMap: Record<SAILAlign, string> = {
  START: 'justify-start',
  CENTER: 'justify-center',
  END: 'justify-end'
}

/** Text alignment (for headings, rich text, text fields) */
export const textAlignMap: Record<SAILAlign, string> = {
  START: 'text-left',
  CENTER: 'text-center',
  END: 'text-right'
}
