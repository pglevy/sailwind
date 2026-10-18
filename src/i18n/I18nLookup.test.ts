import { describe, it, expect } from 'vitest'
import { I18nLookup } from './I18nLookup'
import type { I18nBundle } from './types'

// =============================================================================
// Example tests for I18nLookup edge cases (#173).
//
// A plain object inherits members from `Object.prototype` (`toString`,
// `constructor`, ...). Reading `bundle[locale][key]` with such a name used to
// return the inherited function or object instead of `undefined`, and
// interpolation then threw `template.indexOf is not a function`. These cases
// run every time, so they don't depend on the property test's random seed.
// =============================================================================

const NAMES = ['toString', 'constructor', 'hasOwnProperty', 'valueOf', '__proto__']

const defaultBundle: I18nBundle = { 'en-us': { 'button.loading': 'Loading' } }

const threeTierBundle: I18nBundle = {
  'fr-ca': { 'noise.a': 'na' },
  fr: { 'noise.b': 'nb' },
  'en-us': { 'noise.c': 'nc' },
}

describe('inherited Object.prototype names (#173)', () => {
  it.each(NAMES)('returns the key %s when no bundle defines it', (name) => {
    const lookup = I18nLookup(defaultBundle)
    expect(() => lookup('en-US', name)).not.toThrow()
    expect(lookup('en-US', name)).toBe(name)
    expect(() => lookup('en-US')(name)).not.toThrow()
    expect(lookup('en-US')(name)).toBe(name)

    const tiered = I18nLookup(threeTierBundle)
    expect(() => tiered('fr-CA', name)).not.toThrow()
    expect(tiered('fr-CA', name)).toBe(name)
  })

  it.each(NAMES)('falls back to the default locale when the locale is %s', (name) => {
    const lookup = I18nLookup(defaultBundle)
    expect(() => lookup(name, 'button.loading')).not.toThrow()
    expect(lookup(name, 'button.loading')).toBe('Loading')
    expect(lookup(name)('button.loading')).toBe('Loading')
    expect(() => lookup(name, 'missing.key')).not.toThrow()
    expect(lookup(name, 'missing.key')).toBe('missing.key')
    expect(lookup(name)('missing.key')).toBe('missing.key')
  })

  // Locales are normalized (trim, `_` to `-`, lowercase) before matching, so
  // `toString`, `valueOf`, and `hasOwnProperty` become non-inherited names and
  // `__proto__` becomes `--proto--`. Only `constructor` survives as an
  // inherited name, through the exact tier (`constructor`) and the language
  // tier (`constructor-us` gives the language `constructor`).
  it.each(['constructor', 'CONSTRUCTOR', 'constructor-us', 'Constructor_US'])(
    'ignores members inherited through the locale %s',
    (locale) => {
      const lookup = I18nLookup({ 'en-us': { name: 'Name' } })
      // Before #173 this returned `Object.name`, which is `'Object'`.
      expect(lookup(locale, 'name')).toBe('Name')
      for (const key of ['length', 'prototype', 'toString']) {
        expect(() => lookup(locale, key)).not.toThrow()
        expect(lookup(locale, key)).toBe(key)
      }
    }
  )

  it.each(NAMES)('returns the key when both the locale and key are %s', (name) => {
    const lookup = I18nLookup(defaultBundle)
    expect(() => lookup(name, name)).not.toThrow()
    expect(lookup(name, name)).toBe(name)
  })

  it('handles inherited names in the locale and key together', () => {
    const lookup = I18nLookup(defaultBundle)
    expect(() => lookup('constructor', 'toString')).not.toThrow()
    expect(lookup('constructor', 'toString')).toBe('toString')
    expect(() => lookup('constructor-us', 'constructor')).not.toThrow()
    expect(lookup('constructor-us', 'constructor')).toBe('constructor')

    const withEntry = I18nLookup({ 'en-us': { toString: 'To string' } })
    expect(withEntry('constructor', 'toString')).toBe('To string')
  })

  it('still resolves own entries that use these names', () => {
    const lookup = I18nLookup({
      'en-us': {
        toString: 'A',
        constructor: 'B',
        hasOwnProperty: 'C',
        valueOf: 'D',
        // A computed key creates an own `__proto__` entry. The literal form
        // `{ __proto__: 'E' }` would try to set the prototype instead.
        ['__proto__']: 'E',
      },
    })
    expect(lookup('en-us', 'toString')).toBe('A')
    expect(lookup('en-us', 'constructor')).toBe('B')
    expect(lookup('en-us', 'hasOwnProperty')).toBe('C')
    expect(lookup('en-us', 'valueOf')).toBe('D')
    expect(lookup('en-us', '__proto__')).toBe('E')
  })

  it('keeps the tier order for own entries with these names', () => {
    const lookup = I18nLookup({ fr: { valueOf: 'FR' }, 'en-us': { valueOf: 'EN' } })
    expect(lookup('fr-CA', 'valueOf')).toBe('FR')
  })

  it('resolves an own locale named constructor', () => {
    const lookup = I18nLookup({ constructor: { greeting: 'Hi' } })
    expect(lookup('constructor', 'greeting')).toBe('Hi')
  })

  it('interpolates own entries with these names as before', () => {
    const lookup = I18nLookup({ 'en-us': { valueOf: '{0} of {1}' } })
    expect(lookup('en-us', 'valueOf', 1, 5)).toBe('1 of 5')
  })

  it('works with null-prototype bundles and entries', () => {
    const entries = Object.assign(Object.create(null), { 'button.loading': 'Loading' })
    const bundle: I18nBundle = Object.assign(Object.create(null), { 'en-us': entries })
    const lookup = I18nLookup(bundle)
    expect(lookup('en-us', 'button.loading')).toBe('Loading')
    expect(() => lookup('en-us', 'toString')).not.toThrow()
    expect(lookup('en-us', 'toString')).toBe('toString')
  })
})

describe('non-string values (#173)', () => {
  it('returns the key when the value is a number', () => {
    const lookup = I18nLookup({ 'en-us': { count: 5 } } as unknown as I18nBundle)
    expect(() => lookup('en-us', 'count')).not.toThrow()
    expect(lookup('en-us', 'count')).toBe('count')
  })

  it('falls through to the next tier when a higher tier holds an object', () => {
    const lookup = I18nLookup({
      fr: { k: {} },
      'en-us': { k: 'Default' },
    } as unknown as I18nBundle)
    expect(() => lookup('fr', 'k')).not.toThrow()
    expect(lookup('fr', 'k')).toBe('Default')
  })

  it('returns the key when the value is null', () => {
    const lookup = I18nLookup({ 'en-us': { k: null } } as unknown as I18nBundle)
    expect(() => lookup('en-us', 'k')).not.toThrow()
    expect(lookup('en-us', 'k')).toBe('k')
  })

  it('ignores a locale entry that is a string instead of a map', () => {
    const lookup = I18nLookup({ 'en-us': 'not a map' } as unknown as I18nBundle)
    expect(() => lookup('en-us', 'length')).not.toThrow()
    expect(lookup('en-us', 'length')).toBe('length')
    expect(lookup('en-us', '0')).toBe('0')
  })

  it.each([null, 42])('ignores a locale entry that is %s', (entries) => {
    const lookup = I18nLookup({ 'en-us': entries } as unknown as I18nBundle)
    expect(() => lookup('en-us', 'k')).not.toThrow()
    expect(lookup('en-us', 'k')).toBe('k')
  })

  it('still returns an own empty-string value', () => {
    const lookup = I18nLookup({ fr: { k: '' }, 'en-us': { k: 'Default' } })
    expect(lookup('fr', 'k')).toBe('')
  })
})

describe('known CI counterexamples (#173)', () => {
  // PR #190: { seed: 667272493, path: "98:1:2:2:68" },
  // counterexample [{"":{}},"","valueOf",[]]
  it('PR #190: empty locale with key valueOf', () => {
    const lookup = I18nLookup({ '': {} })
    const args: unknown[] = []
    expect(() => lookup('', 'valueOf', ...args)).not.toThrow()
    expect(lookup('', 'valueOf', ...args)).toBe('valueOf')
  })

  // PR #172: { seed: 1645786307, path: "29:2:1" },
  // counterexample [{"":{}},"   ","toString",[]]. The CI log has three
  // spaces; the issue text shows one because Markdown collapsed them.
  it.each(['   ', ' '])('PR #172: whitespace locale %j with key toString', (locale) => {
    const lookup = I18nLookup({ '': {} })
    expect(() => lookup(locale, 'toString')).not.toThrow()
    expect(lookup(locale, 'toString')).toBe('toString')
  })
})
