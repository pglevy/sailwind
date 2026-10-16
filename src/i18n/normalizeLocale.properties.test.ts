import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import { normalizeLocale } from './normalizeLocale'
import { I18nLookup } from './I18nLookup'
import type { I18nBundle } from './types'

// =============================================================================
// Property 2: Normalization idempotency and lookup invariance
// Feature: component-i18n, Property 2: Normalization idempotency and lookup invariance
// Validates: Requirements 2.6, 3.3, 6.2
//
// For any locale string, normalization (trim, `_`->`-`, lowercase) is
// idempotent -- normalizing an already-normalized value yields the same value
// -- and `I18nLookup` returns identical results for any casing, underscore/
// hyphen, or surrounding-whitespace variant of the same locale.
// =============================================================================

// --- Shared arbitraries ---

/** Runs of ASCII/Unicode whitespace that `String.prototype.trim` removes. */
const arbWhitespace = fc
  .array(fc.constantFrom(' ', '\t', '\n', '\r', '\f', '\v', '\u00a0'), {
    maxLength: 4,
  })
  .map((parts) => parts.join(''))

/**
 * Produce a variant of `base` that normalizes to the same value: each letter is
 * randomly upper/lower-cased and each separator is randomly rendered as `-` or
 * `_`. Non-letter, non-separator characters are preserved.
 */
function arbSeparatorAndCaseVariant(base: string): fc.Arbitrary<string> {
  const perChar = [...base].map((ch) => {
    if (ch === '-' || ch === '_') {
      return fc.constantFrom('-', '_')
    }
    const lower = ch.toLowerCase()
    const upper = ch.toUpperCase()
    if (lower !== upper) {
      return fc.constantFrom(lower, upper)
    }
    return fc.constant(ch)
  })
  return fc.tuple(...perChar).map((chars) => chars.join(''))
}

/**
 * Wrap a casing/separator variant with random leading/trailing whitespace so
 * the variant exercises all three normalization dimensions at once.
 */
function arbVariant(base: string): fc.Arbitrary<string> {
  return fc
    .tuple(arbWhitespace, arbSeparatorAndCaseVariant(base), arbWhitespace)
    .map(([pre, core, post]) => pre + core + post)
}

/**
 * Canonical locales spanning: exact-match locales, language-only locales,
 * region-qualified locales, an RTL locale, locales absent from the bundle, and
 * a multi-subtag locale. Invariance must hold whether or not the locale (or the
 * key) resolves to a bundle entry.
 */
const CANONICAL_LOCALES = [
  'en-us',
  'en',
  'es',
  'es-mx',
  'fr-ca',
  'ar',
  'de-de',
  'zz',
  'zh-hans-cn',
] as const

/** A canonical locale paired with two independently generated variants of it. */
const arbCanonicalWithVariants = fc
  .constantFrom(...CANONICAL_LOCALES)
  .chain((base) =>
    fc.tuple(fc.constant(base), arbVariant(base), arbVariant(base))
  )

/** Locale-shaped strings (valid and invalid) to stress the idempotency law. */
const arbLocaleLike = fc
  .tuple(
    fc.constantFrom('en', 'ES', 'Fr', 'AR', 'zh', 'DE', 'En', 'pt'),
    fc.constantFrom('', '-us', '_US', '-CA', '_mx', '-Latn', '_419'),
    fc.constantFrom('', '-US', '_us')
  )
  .map((parts) => parts.join(''))

/** Any string, biased toward locale-like and whitespace-padded forms. */
const arbAnyLocaleString = fc.oneof(
  fc.string(),
  arbLocaleLike,
  fc
    .tuple(arbWhitespace, arbLocaleLike, arbWhitespace)
    .map(([pre, core, post]) => pre + core + post)
)

/** A bundle with entries at several tiers so lookups exercise the fallback chain. */
const bundle: I18nBundle = {
  'en-us': {
    greeting: 'Hello',
    farewell: 'Goodbye',
    count: '{0} items',
  },
  en: { greeting: 'Hi' },
  es: { greeting: 'Hola' },
  'es-mx': { greeting: 'Hola, mx' },
  'fr-ca': { greeting: 'Bonjour' },
  ar: { greeting: 'marhaba' },
}

/** Keys present at various tiers, an absent key, and the empty key. */
const KEYS = ['greeting', 'farewell', 'count', 'missing.key', ''] as const

// =============================================================================
describe('Property 2: Normalization idempotency and lookup invariance', () => {
  it('normalizeLocale is idempotent for any string', () => {
    fc.assert(
      fc.property(arbAnyLocaleString, (input) => {
        const once = normalizeLocale(input)
        const twice = normalizeLocale(once)
        expect(twice).toBe(once)
      }),
      { numRuns: 100 }
    )
  })

  it('all casing / underscore-hyphen / whitespace variants normalize to the same value', () => {
    fc.assert(
      fc.property(arbCanonicalWithVariants, ([base, a, b]) => {
        const expected = normalizeLocale(base)
        expect(normalizeLocale(a)).toBe(expected)
        expect(normalizeLocale(b)).toBe(expected)
      }),
      { numRuns: 100 }
    )
  })

  it('I18nLookup returns identical results for any variant of the same locale', () => {
    const lookup = I18nLookup(bundle)
    fc.assert(
      fc.property(
        arbCanonicalWithVariants,
        fc.constantFrom(...KEYS),
        ([base, a, b], key) => {
          const expected = lookup(base, key)
          expect(lookup(a, key)).toBe(expected)
          expect(lookup(b, key)).toBe(expected)
        }
      ),
      { numRuns: 100 }
    )
  })
})
