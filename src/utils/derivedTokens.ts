import type { SAILSemanticColor } from '../types/sail'
import type { SAILPaletteColor } from '../types/palette-colors.generated'

/**
 * Single source of truth for which palette step each SAIL semantic color uses.
 *
 * Everything that shows or publishes semantic colors reads from here:
 *   - src/utils/colorResolver.ts (what components render)
 *   - scripts/generate-tokens.ts (color.semantic in the published tokens.json)
 *   - src/stories/DesignTokens.stories.tsx (Storybook Design Tokens page)
 *
 * Change a step here and all of them follow.
 */
export const semanticPaletteColors: Record<SAILSemanticColor, SAILPaletteColor> = {
  ACCENT:    'BLUE_500',
  POSITIVE:  'GREEN_700',
  NEGATIVE:  'RED_700',
  SECONDARY: 'GRAY_700',
  STANDARD:  'GRAY_900',
}

/**
 * Split a palette color into its token path parts, e.g. "GREEN_700" → { family: "green", step: "700" }.
 */
export function paletteColorParts(color: SAILPaletteColor): { family: string; step: string } {
  const i = color.lastIndexOf('_')
  return { family: color.slice(0, i).toLowerCase(), step: color.slice(i + 1) }
}

interface DTCGColorToken { $value: string; $type: 'color'; $description: string }

/**
 * Semantic color aliases in DTCG format, keyed by the lowercase SAIL name
 * (e.g. color.semantic.negative → "{color.red.700}").
 */
export function semanticColorTokens(): Record<string, DTCGColorToken> {
  const out: Record<string, DTCGColorToken> = {}
  for (const [name, palette] of Object.entries(semanticPaletteColors) as [SAILSemanticColor, SAILPaletteColor][]) {
    const { family, step } = paletteColorParts(palette)
    out[name.toLowerCase()] = {
      $value: `{color.${family}.${step}}`,
      $type: 'color',
      $description: `SAILSemanticColor.${name}`,
    }
  }
  return out
}

/**
 * Add the tokens that the distributable tokens.json includes on top of the
 * source file (tokens/tokens.json): the color.black alias and color.semantic.
 */
export function addDerivedTokens<T extends { color: object }>(source: T) {
  return {
    ...source,
    color: {
      ...source.color,
      black: {
        $value: '#171717',
        $type: 'color' as const,
        $description: 'Black — sourced from studio grey-1000',
      },
      semantic: semanticColorTokens(),
    },
  }
}
