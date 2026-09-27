import { describe, it, expect } from 'vitest'
import { lookup } from './bundleLoader'
import { KEYS } from './keys'
import * as RootBarrel from '../index'

// =============================================================================
// Example / assertion tests for the i18n catalog + default bundle wiring, and
// for the stability of the library's public root barrel (`src/index.ts`).
//
// These are NOT property-based tests — they assert concrete facts about the
// authored artifacts:
//   - Test 1 proves the default (`en-US`) bundle contains an entry for every
//     Translation_Key in the catalog (Requirement 3.6).
//   - Test 2 proves the i18n additions did not remove or rename any of the
//     library's pre-existing public exports (Requirement 5.3).
// =============================================================================

// -----------------------------------------------------------------------------
// Test 1 — Default-bundle completeness (Requirement 3.6)
//
// `lookup(locale, key)` returns the key unchanged when no entry exists for that
// key anywhere in the bundle (the terminal step of the I18nLookup fallback
// chain). So for the default `en-us` locale, a resolved value that differs from
// the key — and is a non-empty string — proves the default bundle defines that
// key. Iterating the whole catalog proves the bundle is complete.
// -----------------------------------------------------------------------------
describe('default bundle completeness (Requirement 3.6)', () => {
  const catalogKeys = Object.values(KEYS)

  it('has a non-empty key catalog to validate', () => {
    expect(catalogKeys.length).toBeGreaterThan(0)
  })

  it.each(catalogKeys)(
    'resolves %s to a defined (non-key, non-empty) string in the default en-US bundle',
    (key) => {
      const resolved = lookup('en-us', key)

      // A string is always returned (lookup never throws / never returns null).
      expect(typeof resolved).toBe('string')
      // Not the key itself: a returned key signals a missing entry.
      expect(resolved).not.toBe(key)
      // And it is a real, non-empty value.
      expect(resolved.length).toBeGreaterThan(0)
    }
  )
})

// -----------------------------------------------------------------------------
// Test 2 — Export stability (Requirement 5.3)
//
// The i18n work added exactly one line to `src/index.ts`:
//   `export * from './i18n'`
// (confirmed against `git show HEAD:src/index.ts`). Every other export predates
// the i18n additions. This test pins the pre-i18n public surface: if a future
// change removes or renames any of these names, importing the root barrel here
// will no longer expose them and the corresponding case fails.
//
// Only runtime (value) exports are asserted — type-only exports do not exist on
// the namespace object at runtime. The list below was built by reading
// `src/index.ts` and the modules it re-exports:
//   - Components (from `./components`): Paging, ButtonWidget, ProgressBar,
//     ReadOnlyGrid, StampField, FieldLabel — all `export const X: React.FC<…>`.
//   - Color utilities (from `./utils/colorResolver`): resolveColorClass,
//     isSemanticColor, isPaletteColor, semanticColorClasses.
//   - Generated palette maps (from `./types/palette-colors.generated`):
//     paletteColorMap, paletteHexMap.
// -----------------------------------------------------------------------------
describe('root barrel export stability (Requirement 5.3)', () => {
  // Known pre-existing (pre-i18n) named value exports of `src/index.ts`.
  const PRE_I18N_VALUE_EXPORTS = [
    // Components
    'Paging',
    'ButtonWidget',
    'ProgressBar',
    'ReadOnlyGrid',
    'StampField',
    'FieldLabel',
    // Color utilities
    'resolveColorClass',
    'isSemanticColor',
    'isPaletteColor',
    'semanticColorClasses',
    // Generated palette maps
    'paletteColorMap',
    'paletteHexMap',
  ] as const

  const barrel = RootBarrel as Record<string, unknown>

  it('asserts a non-empty set of pre-existing exports', () => {
    expect(PRE_I18N_VALUE_EXPORTS.length).toBeGreaterThan(0)
  })

  it.each(PRE_I18N_VALUE_EXPORTS)(
    'still exposes the pre-existing export %s',
    (name) => {
      expect(name in barrel).toBe(true)
      expect(barrel[name]).not.toBeUndefined()
    }
  )
})
