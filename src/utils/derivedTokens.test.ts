import { describe, expect, it } from 'vitest'
import sourceTokens from '../../tokens/tokens.json'
import { addDerivedTokens, paletteColorParts, semanticPaletteColors } from './derivedTokens'
import { resolveColorClass, resolveColorToHex } from './colorResolver'
import type { SAILSemanticColor } from '../types/sail'

const tokens = addDerivedTokens(sourceTokens)

function resolveAlias(ref: string): string | undefined {
  const m = ref.match(/^\{(.+)\}$/)
  if (!m) return undefined
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let node: any = tokens
  for (const p of m[1].split('.')) node = node?.[p]
  return node?.$value
}

const semanticNames = Object.keys(semanticPaletteColors) as SAILSemanticColor[]

describe('derived tokens', () => {
  it('keys semantic aliases by lowercase SAIL name', () => {
    expect(Object.keys(tokens.color.semantic).sort()).toEqual(
      semanticNames.map(n => n.toLowerCase()).sort()
    )
    expect(tokens.color.semantic).toHaveProperty('negative')
    expect(tokens.color.semantic).not.toHaveProperty('destructive')
  })

  it.each(semanticNames)('%s alias resolves to the hex components render', name => {
    const alias = tokens.color.semantic[name.toLowerCase()]
    expect(alias.$description).toBe(`SAILSemanticColor.${name}`)
    const hex = resolveAlias(alias.$value)
    expect(hex).toBeDefined()
    expect(hex?.toUpperCase()).toBe(resolveColorToHex(name)?.toUpperCase())
  })

  it.each(semanticNames)('%s class uses the same palette step as its alias', name => {
    const { family, step } = paletteColorParts(semanticPaletteColors[name])
    expect(resolveColorClass(name, 'bg')).toBe(`bg-${family}-${step}`)
    expect(resolveColorClass(name, 'text')).toBe(`text-${family}-${step}`)
    expect(resolveColorClass(name, 'border')).toBe(`border-${family}-${step}`)
  })

  it('keeps the source tokens intact', () => {
    expect(tokens.color.red).toBe(sourceTokens.color.red)
    expect(tokens.typography).toBe(sourceTokens.typography)
  })
})
