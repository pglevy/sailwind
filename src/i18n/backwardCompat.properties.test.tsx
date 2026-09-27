import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import * as fc from "fast-check";
import { KEYS, type TranslationKey } from "./keys";
import { lookup } from "./bundleLoader";
import { useI18n } from "./context";

// =============================================================================
// Property 7: No-provider backward-compatibility invariance
// Feature: component-i18n, Property 7: No-provider backward-compatibility invariance
// Validates: Requirements 4.5, 5.1
//
// For any library-owned Translation_Key, resolving that key with NO
// LocaleProvider present (active locale defaulting to `en-us`) returns a string
// character-for-character identical to that key's authored default (`en-US`)
// value.
//
// The no-provider path is faithfully represented by `lookup('en-us', key)`:
// outside any provider, `useI18n()` returns the context default instance whose
// `t` is exactly `lookup('en-us')` (see context.tsx DEFAULT_CONTEXT_VALUE), so
// `useI18n().t(key)` === `lookup('en-us', key)`. The final example test below
// also exercises the real hook path to confirm that equivalence.
// =============================================================================

/**
 * The authored `en-US` literals, transcribed verbatim from
 * `src/i18n/bundles/components.properties` — the backward-compat source of
 * truth. The bundle loader decodes `\u2013` to the real EN DASH (U+2013), so the
 * expected value uses that character (written here as the `\u2013` escape, which
 * is the same code point); the `{0}`/`{1}` interpolation placeholders are
 * kept literal because Property 7 resolves keys with no arguments.
 *
 * Typing this as `Record<TranslationKey, string>` makes completeness compile-time
 * enforced: adding a key to `KEYS` without an entry here (or leaving a stale
 * entry after a key is removed) fails typecheck, so no key can silently go
 * untested.
 */
const EXPECTED: Record<TranslationKey, string> = {
  "paging.firstPage": "First page",
  "paging.previousPage": "Previous page",
  "paging.nextPage": "Next page",
  "paging.lastPage": "Last page",
  "paging.range": "{0} of {1}",
  "paging.rangeMany": "{0} of many",
  "paging.numberRange": "{0} \u2013 {1}",
  "button.loading": "loading",
  "field.help": "help",
  "field.required": "required",
  "progressBar.label": "Progress",
  "image.openLinked": "Open linked image",
  "grid.emptyMessage": "No items available",
};

/** The full library key catalog, as the dotted `.properties` key strings. */
const ALL_KEYS: TranslationKey[] = Object.values(KEYS);

describe("Property 7: No-provider backward-compatibility invariance", () => {
  it("resolves every library key to its authored en-US default with no provider present", () => {
    fc.assert(
      fc.property(fc.constantFrom(...ALL_KEYS), (key) => {
        // `lookup('en-us', key)` is the exact resolution the no-provider
        // `useI18n().t(key)` performs. Must be character-for-character identical
        // to the authored en-US literal.
        expect(lookup("en-us", key)).toBe(EXPECTED[key]);
      }),
      { numRuns: 100 }
    );
  });

  it("covers the entire key catalog (KEYS and the expected map have the same key set)", () => {
    const expectedKeys = new Set(Object.keys(EXPECTED));
    const catalogKeys = new Set<string>(ALL_KEYS);

    // Every catalog key has an authored literal (guards new keys going untested).
    for (const key of ALL_KEYS) {
      expect(expectedKeys.has(key)).toBe(true);
    }
    // No stale expected entry outside the catalog.
    for (const key of expectedKeys) {
      expect(catalogKeys.has(key)).toBe(true);
    }
  });

  it("resolves through the real no-provider hook path identically to the authored defaults", () => {
    // Exercise the actual `useI18n()` default-context instance (no provider in
    // the tree) to confirm it is en-us bound and byte-for-byte matches the
    // authored literals — the literal statement of Property 7.
    const { result } = renderHook(() => useI18n());

    expect(result.current.locale).toBe("en-us");
    for (const key of ALL_KEYS) {
      expect(result.current.t(key)).toBe(EXPECTED[key]);
    }
  });
});
