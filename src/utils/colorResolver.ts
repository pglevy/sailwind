import type { SAILSemanticColor } from '../types/sail'
import { paletteColorMap } from '../types/palette-colors.generated'
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
 * - Palette colors return a mechanical class (e.g. TEAL_700 → "bg-teal-700").
 * - Hex strings (starting with #) return '' — caller should use inline style.
 */
export function resolveColorClass(color: string, prefix: TailwindPrefix = 'bg'): string {
  if (isSemanticColor(color)) {
    return semanticColorClasses[color][prefix]
  }
  if (isPaletteColor(color)) {
    return `${prefix}-${paletteColorMap[color]}`
  }
  // Hex or unknown — caller handles via inline style
  return ''
}
