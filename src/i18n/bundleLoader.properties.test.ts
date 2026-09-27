import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import { loadI18nBundle } from './bundleLoader'

// =============================================================================
// Property-based tests for the Bundle_Loader (`loadI18nBundle`).
//
// `loadI18nBundle(files)` maps a file path -> raw `.properties` text and returns
// a curried `I18nLookupFunction`. We assert what got loaded via `lookup(locale,
// key)`:
//   - a present key resolves to its value under the file's normalized locale;
//   - an absent key falls through to the key unchanged (I18nLookup semantics).
//
// Content is built exclusively from lowercase-letter tokens (plus the Unicode
// fragments in Property 5), so no value/key ever contains a `=`, `:`, `#`, `!`,
// newline, or stray `\u` that would perturb the `.properties` parser.
// =============================================================================

// --- Shared arbitraries -----------------------------------------------------

/** A single lowercase ASCII letter (`a`-`z`). */
const arbLowerLetter = fc
  .integer({ min: 0, max: 25 })
  .map((i) => String.fromCharCode(97 + i))

/** A single uppercase ASCII letter (`A`-`Z`). */
const arbUpperLetter = fc
  .integer({ min: 0, max: 25 })
  .map((i) => String.fromCharCode(65 + i))

/** A short, non-empty lowercase-letter token safe to use as a key or value. */
const arbToken = fc
  .array(arbLowerLetter, { minLength: 1, maxLength: 6 })
  .map((cs) => cs.join(''))

/** A two-letter lowercase language subtag (matches the loader's `[a-z]{2}`). */
const arbLang = fc.tuple(arbLowerLetter, arbLowerLetter).map(([a, b]) => a + b)

/** A two-letter uppercase region subtag (matches the loader's `[A-Z]{2}`). */
const arbRegion = fc.tuple(arbUpperLetter, arbUpperLetter).map(([a, b]) => a + b)

/**
 * A valid `_<locale>` filename suffix paired with the locale it normalizes to
 * (`_`->`-`, lowercase) — either language-only (`es` -> `es`) or
 * language+region (`es_MX` -> `es-mx`).
 */
type LocaleSpec = { suffix: string; normalized: string }
const arbLocaleSpec = fc.oneof(
  arbLang.map((l): LocaleSpec => ({ suffix: l, normalized: l })),
  fc.tuple(arbLang, arbRegion).map(
    ([l, r]): LocaleSpec => ({
      suffix: `${l}_${r}`,
      normalized: `${l}-${r.toLowerCase()}`,
    })
  )
)

// =============================================================================
// Property 4: Bundle loader filename handling
// Feature: component-i18n, Property 4: Bundle loader filename handling
// Validates: Requirements 3.2, 3.3, 3.7
//
// For a mix of valid `<name>_<locale>.properties` files, a suffix-less
// `<name>.properties` file, and clearly invalid names: each valid file's keys
// are retrievable under its normalized locale; the suffix-less file's keys are
// under `en-us`; keys from invalid-named files are absent (lookup returns the
// key unchanged); and `loadI18nBundle` never throws regardless of how many
// entries are malformed.
// =============================================================================

/** Clearly invalid filenames the loader must skip. */
const INVALID_TEMPLATES = [
  'foo.txt',
  'bar_toolong.properties',
  'baz_1.properties',
  'README.md',
]

describe('Feature: component-i18n, Property 4: Bundle loader filename handling', () => {
  it('routes valid + suffix-less files to their locales, skips invalid names, and never throws', () => {
    fc.assert(
      fc.property(
        fc.record({
          locales: fc.array(arbLocaleSpec, { minLength: 1, maxLength: 5 }),
          invalidTemplates: fc.subarray(INVALID_TEMPLATES, { minLength: 0 }),
          extraInvalid: fc.integer({ min: 0, max: 6 }),
        }),
        ({ locales, invalidTemplates, extraInvalid }) => {
          // Valid `<name>_<locale>.properties` files — unique path + key per entry.
          const validEntries = locales.map((spec, i) => ({
            path: `./bundles/bundle${i}_${spec.suffix}.properties`,
            locale: spec.normalized,
            key: `vkey${i}`,
            value: `vval${i}`,
          }))

          // A single suffix-less default bundle, expected under `en-us`.
          const defaultEntry = {
            path: './bundles/components.properties',
            key: 'dkey',
            value: 'dval',
          }

          // Invalid names: the fixed templates plus extra `.md` junk to push the
          // malformed count higher and exercise "regardless of how many".
          const invalidNames = [
            ...invalidTemplates,
            ...Array.from({ length: extraInvalid }, (_, i) => `junk${i}.md`),
          ]
          const invalidEntries = invalidNames.map((name, j) => ({
            path: `./bundles/${name}`,
            key: `xkey${j}`,
            value: `xval${j}`,
          }))

          const files: Record<string, string> = {}
          for (const e of validEntries) files[e.path] = `${e.key}=${e.value}`
          files[defaultEntry.path] = `${defaultEntry.key}=${defaultEntry.value}`
          for (const e of invalidEntries) files[e.path] = `${e.key}=${e.value}`

          // Never throws regardless of how many entries are malformed.
          expect(() => loadI18nBundle(files)).not.toThrow()

          const lookup = loadI18nBundle(files)

          // Each valid file's key is retrievable under its normalized locale.
          for (const e of validEntries) {
            expect(lookup(e.locale, e.key)).toBe(e.value)
          }

          // The suffix-less file's key is under `en-us`.
          expect(lookup('en-us', defaultEntry.key)).toBe(defaultEntry.value)

          // Invalid-named files are skipped: their keys are absent, so lookup
          // returns the key unchanged.
          for (const e of invalidEntries) {
            expect(lookup('en-us', e.key)).toBe(e.key)
          }
        }
      ),
      { numRuns: 100 }
    )
  })
})

// =============================================================================
// Property 5: Unicode escape decoding
// Feature: component-i18n, Property 5: Unicode escape decoding
// Validates: Requirements 3.5, 3.8
//
// Well-formed `\uXXXX` escapes (exactly four hex digits) decode to their
// Unicode characters; malformed `\u` sequences with fewer than four hex digits
// are left literal; and other entries in the same file still load. Fragments
// are joined by a non-hex separator (`.`) so a malformed fragment can never
// combine with a neighbour to form an accidental well-formed escape.
// =============================================================================

/** A `.properties` value fragment and the text it decodes to. */
type Frag = { raw: string; decoded: string }

/** Well-formed escapes: `ü`, `é`, en dash `–`. */
const WELL_FORMED: Frag[] = [
  { raw: '\\u00fc', decoded: '\u00fc' },
  { raw: '\\u00e9', decoded: '\u00e9' },
  { raw: '\\u2013', decoded: '\u2013' },
]

/** Malformed escapes (fewer than four hex digits) — left literal. */
const MALFORMED: Frag[] = [
  { raw: '\\u12', decoded: '\\u12' },
  { raw: '\\uZZZZ', decoded: '\\uZZZZ' },
]

const arbFragment = fc.constantFrom(...WELL_FORMED, ...MALFORMED)

/** Non-hex fragment separator (prevents accidental cross-fragment escapes). */
const SEP = '.'

describe('Feature: component-i18n, Property 5: Unicode escape decoding', () => {
  it('decodes well-formed \\uXXXX escapes, leaves malformed ones literal, and loads other entries', () => {
    fc.assert(
      fc.property(
        fc.record({
          escaped: fc.array(fc.array(arbFragment, { minLength: 1, maxLength: 5 }), {
            minLength: 1,
            maxLength: 6,
          }),
          plain: fc.array(arbToken, { minLength: 0, maxLength: 4 }),
        }),
        ({ escaped, plain }) => {
          const escapedEntries = escaped.map((frags, i) => ({
            key: `emsg${i}`,
            raw: frags.map((f) => f.raw).join(SEP),
            expected: frags.map((f) => f.decoded).join(SEP),
          }))
          const plainEntries = plain.map((token, i) => ({
            key: `pmsg${i}`,
            raw: token,
            expected: token,
          }))

          // Include a comment line and a blank line to confirm both are ignored.
          const lines = [
            '# leading comment line',
            '',
            ...escapedEntries.map((e) => `${e.key}=${e.raw}`),
            ...plainEntries.map((e) => `${e.key}=${e.raw}`),
          ]
          const content = lines.join('\n')

          const lookup = loadI18nBundle({
            './bundles/components_de.properties': content,
          })

          for (const e of escapedEntries) {
            expect(lookup('de', e.key)).toBe(e.expected)
          }
          for (const e of plainEntries) {
            expect(lookup('de', e.key)).toBe(e.expected)
          }
        }
      ),
      { numRuns: 100 }
    )
  })
})

// =============================================================================
// Property 6: Context-key exclusion
// Feature: component-i18n, Property 6: Context-key exclusion
// Validates: Requirements 3.4
//
// Every key containing the `.##CONTEXT##` marker is absent from the loaded
// bundle (lookup returns the key unchanged); every non-marker key is retained
// with its value intact.
// =============================================================================

describe('Feature: component-i18n, Property 6: Context-key exclusion', () => {
  it('excludes keys containing .##CONTEXT## and retains all other keys with values intact', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            token: arbToken,
            value: arbToken,
            isContext: fc.boolean(),
            placement: fc.integer({ min: 0, max: 2 }),
          }),
          { minLength: 1, maxLength: 10 }
        ),
        (entries) => {
          // Build globally-unique keys (index-prefixed). Marker keys embed the
          // `.##CONTEXT##` marker at varying positions; non-marker keys never do.
          const built = entries.map((e, i) => {
            const base = `k${i}${e.token}`
            const value = `val${i}${e.value}`
            let key: string
            if (!e.isContext) {
              key = base
            } else if (e.placement === 0) {
              key = `${base}.##CONTEXT##`
            } else if (e.placement === 1) {
              key = `${base}.##CONTEXT##.label`
            } else {
              key = `ctx${i}.##CONTEXT##.${base}`
            }
            return { key, value, isContext: e.isContext }
          })

          const content = built.map((b) => `${b.key}=${b.value}`).join('\n')
          const lookup = loadI18nBundle({
            './bundles/components_fr.properties': content,
          })

          for (const b of built) {
            if (b.isContext) {
              // Marker key excluded -> lookup returns the key unchanged.
              expect(lookup('fr', b.key)).toBe(b.key)
            } else {
              // Non-marker key retained with its value intact.
              expect(lookup('fr', b.key)).toBe(b.value)
            }
          }
        }
      ),
      { numRuns: 100 }
    )
  })
})
