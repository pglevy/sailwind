import type { SAILSemanticColor } from '../types/sail'
import { paletteColorMap, paletteHexMap } from '../types/palette-colors.generated'
import type { SAILPaletteColor } from '../types/palette-colors.generated'
import { semanticPaletteColors } from './derivedTokens'

const semanticEntries = Object.entries(semanticPaletteColors) as [SAILSemanticColor, SAILPaletteColor][]

/**
 * Semantic color mappings.
 * Each semantic color maps to a set of Tailwind classes for different contexts.
 * The palette step for each one is defined in `semanticPaletteColors` (./derivedTokens).
 * The classes themselves are complete literals in the generated palette map.
 */
export const semanticColorClasses = Object.fromEntries(
  semanticEntries.map(([name, palette]) => [name, paletteColorMap[palette]])
) as Record<SAILSemanticColor, { bg: string; text: string; border: string }>

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
 * Hex values for semantic colors, taken from the palette tokens.
 */
const semanticHexMap = Object.fromEntries(
  semanticEntries.map(([name, palette]) => [name, paletteHexMap[palette]])
) as Record<SAILSemanticColor, string>

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
  const L = relativeLuminance(hex)
  const contrastWhite = (1.0 + 0.05) / (L + 0.05)
  const contrastBlack = (L + 0.05) / (0.0 + 0.05)
  return contrastWhite >= contrastBlack ? '#ffffff' : '#000000'
}

/** Expand #RGB shorthand and return the [r, g, b] channels of a hex color. */
function hexChannels(hex: string): [number, number, number] {
  if (hex.length === 4 || hex.length === 5) {
    hex = `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`
  }
  return [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16)
  ]
}

/** WCAG 2.x relative luminance of a hex color. */
function relativeLuminance(hex: string): number {
  const [r, g, b] = hexChannels(hex)
  const toLinear = (c: number) => {
    const s = c / 255
    return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
  }
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b)
}

/** WCAG 2.x contrast ratio between two hex colors. */
export function contrastRatio(foreground: string, background: string): number {
  const a = relativeLuminance(foreground)
  const b = relativeLuminance(background)
  const [lighter, darker] = a > b ? [a, b] : [b, a]
  return (lighter + 0.05) / (darker + 0.05)
}

/**
 * Shifts a color just far enough to meet a WCAG contrast ratio against the given background,
 * so brand colors stay recognizable when used as text.
 *
 * On a light background the color is darkened (toward black); on a dark one it is lightened
 * (toward white). Light accent colors (yellow, amber, light palette steps) are unreadable as
 * text on white, and dark ones are unreadable on near-black; this returns the closest shade of
 * the same color that passes instead. A color that already passes is returned unchanged
 * (as lowercase #rrggbb). If even pure black or white can't reach the ratio against this
 * background (a mid-tone surface with a high `minRatio`), whichever of the two contrasts more
 * is returned.
 */
export function getAccessibleTextColor(
  hex: string,
  background: string = '#FFFFFF',
  minRatio: number = 4.5
): string {
  const toHex = (n: number) => Math.round(n).toString(16).padStart(2, '0')
  const [r, g, b] = hexChannels(hex)
  const at = (target: number, t: number) =>
    `#${toHex(r + (target - r) * t)}${toHex(g + (target - g) * t)}${toHex(b + (target - b) * t)}`

  if (contrastRatio(at(0, 0), background) >= minRatio) return at(0, 0)

  // Move away from the background: toward whichever extreme contrasts with it more
  const target = contrastRatio('#000000', background) >= contrastRatio('#ffffff', background) ? 0 : 255
  const extreme = at(target, 1)
  if (contrastRatio(extreme, background) < minRatio) return extreme

  // Contrast only grows toward the extreme, so binary-search the smallest shift that passes
  let low = 0
  let high = 1
  for (let i = 0; i < 12; i++) {
    const mid = (low + high) / 2
    if (contrastRatio(at(target, mid), background) >= minRatio) high = mid
    else low = mid
  }
  return at(target, high)
}
