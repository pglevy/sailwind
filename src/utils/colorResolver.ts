import type { SAILSemanticColor } from '../types/sail'
import { paletteColorMap, paletteHexMap } from '../types/palette-colors.generated'
import type { SAILPaletteColor } from '../types/palette-colors.generated'

/**
 * Hand-curated semantic color mappings.
 * Each semantic color maps to a set of Tailwind classes for different contexts.
 */
export const semanticColorClasses: Record<SAILSemanticColor, { bg: string; text: string; border: string }> = {
  ACCENT:    { bg: 'bg-blue-500',  text: 'text-blue-500',  border: 'border-blue-500'  },
  POSITIVE:  { bg: 'bg-green-700', text: 'text-green-700', border: 'border-green-700' },
  NEGATIVE:  { bg: 'bg-red-700',   text: 'text-red-700',   border: 'border-red-700'   },
  SECONDARY: { bg: 'bg-gray-700',  text: 'text-gray-700',  border: 'border-gray-700'  },
  STANDARD:  { bg: 'bg-gray-900',  text: 'text-gray-900',  border: 'border-gray-900'  },
}

const SEMANTIC_KEYS = new Set<string>(Object.keys(semanticColorClasses))

/**
 * Check whether a color string is a semantic color name.
 */
export function isSemanticColor(color: string): color is SAILSemanticColor {
  return SEMANTIC_KEYS.has(color)
}

/**
 * Check whether a color string is a palette color token (e.g. "TEAL_700").
 */
export function isPaletteColor(color: string): color is SAILPaletteColor {
  return color in paletteColorMap
}

type TailwindPrefix = 'bg' | 'text' | 'border'

/**
 * Resolve a SAILColor (semantic, palette, or hex) to a Tailwind class string.
 *
 * - Semantic colors return the curated class for the given prefix.
 * - Palette colors return a static class from the generated map.
 * - Hex strings (starting with #) return '' — caller should use inline style.
 */
export function resolveColorClass(color: string, prefix: TailwindPrefix = 'bg'): string {
  if (isSemanticColor(color)) {
    return semanticColorClasses[color][prefix]
  }
  if (isPaletteColor(color)) {
    return paletteColorMap[color][prefix]
  }
  // Hex or unknown — caller handles via inline style
  return ''
}


/**
 * Hex values for semantic colors (matches the Aurora palette tokens).
 */
const semanticHexMap: Record<SAILSemanticColor, string> = {
  ACCENT:    '#2322F0', // blue-500
  POSITIVE:  '#357A38', // green-700
  NEGATIVE:  '#9B0027', // red-700
  SECONDARY: '#616161', // gray-700
  STANDARD:  '#212121', // gray-900
}

/**
 * Resolve any SAIL color (semantic, palette, or hex) to a hex string.
 * Returns the input unchanged if it's already a hex string.
 * Returns undefined for unrecognized values.
 */
export function resolveColorToHex(color: string): string | undefined {
  if (isSemanticColor(color)) {
    return semanticHexMap[color]
  }
  if (isPaletteColor(color)) {
    return paletteHexMap[color]
  }
  if (color.startsWith('#')) {
    return color
  }
  return undefined
}

/**
 * Returns accessible foreground color ('#ffffff' or '#000000') for a given hex background.
 * Uses WCAG 2.x relative luminance to determine contrast.
 */
export function getContrastColor(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  const toLinear = (c: number) => {
    const s = c / 255
    return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
  }
  const L = 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b)
  const contrastWhite = (1.0 + 0.05) / (L + 0.05)
  const contrastBlack = (L + 0.05) / (0.0 + 0.05)
  return contrastWhite >= contrastBlack ? '#ffffff' : '#000000'
}
