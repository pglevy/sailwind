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
 * Darkens a color until it meets a WCAG contrast ratio against the given background,
 * so brand colors stay recognizable when used as text.
 *
 * Light accent colors (yellow, amber, light palette steps) are unreadable as text on
 * white; this returns a darker shade of the same hue instead of failing contrast.
 */
export function getAccessibleTextColor(
  hex: string,
  background: string = '#FFFFFF',
  minRatio: number = 4.5
): string {
  let [r, g, b] = hexChannels(hex)
  const toHex = (n: number) => n.toString(16).padStart(2, '0')

  for (let i = 0; i < 24; i++) {
    const candidate = `#${toHex(r)}${toHex(g)}${toHex(b)}`
    if (contrastRatio(candidate, background) >= minRatio) return candidate
    if (r === 0 && g === 0 && b === 0) break
    r = Math.floor(r * 0.85)
    g = Math.floor(g * 0.85)
    b = Math.floor(b * 0.85)
  }

  return '#000000'
}
