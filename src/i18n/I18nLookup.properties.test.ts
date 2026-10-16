import { describe, it, expect } from "vitest";
import * as fc from "fast-check";
import { I18nLookup } from "./I18nLookup";
import type { I18nBundle } from "./types";

// =============================================================================
// Shared arbitraries
// =============================================================================

/** RTL/LTR-agnostic set of language subtags, none of which is `en`, so the
 *  language-only tier is always distinct from the `en-us` default tier. */
const arbLang = fc.constantFrom(
  "fr",
  "de",
  "es",
  "it",
  "pt",
  "ja",
  "zh",
  "ko",
  "nl",
  "sv",
  "ru",
  "pl"
);

/** Two-letter region subtags (already lowercase / normalized form). */
const arbRegion = fc.constantFrom(
  "ca",
  "mx",
  "br",
  "fr",
  "de",
  "es",
  "gb",
  "au",
  "cn",
  "jp"
);

/** A non-empty, placeholder-free translation key. Prefixed with `k_` so it is
 *  always non-empty and never collides with the noise keys below. */
const arbKey = fc
  .string({ minLength: 1, maxLength: 12 })
  .map((s) => "k_" + s.replace(/[{}]/g, ""));

// =============================================================================
// Property 1: Lookup fallback determinism
// Feature: component-i18n, Property 1: Lookup fallback determinism
// Validates: Requirements 1.7, 2.1, 2.2, 2.3, 2.4, 2.5, 4.6, 5.4, 6.3, 6.6, 10.3, 10.6
// =============================================================================
describe("Property 1: Lookup fallback determinism", () => {
  it("returns the value from the highest-priority tier that contains the key (exact → language-only → en-us), or the key unchanged", () => {
    fc.assert(
      fc.property(
        arbLang,
        arbRegion,
        arbKey,
        fc.boolean(),
        fc.boolean(),
        fc.boolean(),
        fc.boolean(),
        fc.boolean(),
        (lang, region, key, hasExact, hasLang, hasDefault, useUnderscore, useUpper) => {
          const exactLocale = `${lang}-${region}`; // e.g. "fr-ca"
          const langLocale = lang; // e.g. "fr"
          const defaultLocale = "en-us";

          const EXACT_VALUE = "EXACT_VALUE";
          const LANG_VALUE = "LANG_VALUE";
          const DEFAULT_VALUE = "DEFAULT_VALUE";

          // Every tier always exists (populated with unrelated "noise" keys) so
          // the test also confirms lookup selects by key, not merely by tier
          // presence. The target key is added to a tier only when its flag is set.
          const bundle: I18nBundle = {
            [exactLocale]: { "noise.a": "na" },
            [langLocale]: { "noise.b": "nb" },
            [defaultLocale]: { "noise.c": "nc" },
          };
          if (hasExact) bundle[exactLocale][key] = EXACT_VALUE;
          if (hasLang) bundle[langLocale][key] = LANG_VALUE;
          if (hasDefault) bundle[defaultLocale][key] = DEFAULT_VALUE;

          // Feed a possibly non-normalized variant of the exact locale; it must
          // normalize back to `exactLocale` and resolve identically.
          let input: string = exactLocale;
          if (useUnderscore) input = input.replace("-", "_");
          if (useUpper) input = input.toUpperCase();

          const expected = hasExact
            ? EXACT_VALUE
            : hasLang
              ? LANG_VALUE
              : hasDefault
                ? DEFAULT_VALUE
                : key;

          const lookup = I18nLookup(bundle);

          // Fully-applied form.
          expect(lookup(input, key)).toBe(expected);
          // Curried form yields the same result.
          expect(lookup(input)(key)).toBe(expected);
        }
      ),
      { numRuns: 100 }
    );
  });

  it("returns '' for an empty/absent key without attempting locale matching", () => {
    const arbLocale = fc.oneof(
      fc.string(),
      fc.constantFrom("en-US", "fr_CA", "EN", "  en - us  ", "zh-Hant", "", "   ")
    );
    const arbBundle = fc.dictionary(
      arbLocale,
      fc.dictionary(fc.string(), fc.string(), { maxKeys: 4 }),
      { maxKeys: 4 }
    );

    fc.assert(
      fc.property(arbBundle, arbLocale, (bundle, locale) => {
        const lookup = I18nLookup(bundle as I18nBundle);
        expect(lookup(locale, "")).toBe("");
        // Curried form with an empty key behaves identically.
        expect(lookup(locale)("")).toBe("");
      }),
      { numRuns: 100 }
    );
  });

  it("never throws and always returns a string for any bundle, locale, key, and args", () => {
    const arbLocale = fc.oneof(
      fc.string(),
      fc.constantFrom("en-US", "fr_CA", "EN", "  en - us  ", "zh-Hant-TW", "123", "", "   ")
    );
    const arbBundle = fc.dictionary(
      arbLocale,
      // Values may contain `{n}` placeholders to exercise the interpolation path.
      fc.dictionary(fc.string(), fc.string(), { maxKeys: 5 }),
      { maxKeys: 5 }
    );

    fc.assert(
      fc.property(
        arbBundle,
        arbLocale,
        fc.string(),
        fc.array(fc.anything(), { maxLength: 6 }),
        (bundle, locale, key, args) => {
          const lookup = I18nLookup(bundle as I18nBundle);
          let result: unknown;
          expect(() => {
            result = lookup(locale, key, ...args);
          }).not.toThrow();
          expect(typeof result).toBe("string");
        }
      ),
      { numRuns: 100 }
    );
  });
});

// =============================================================================
// Property 3: Positional interpolation
// Feature: component-i18n, Property 3: Positional interpolation
// Validates: Requirements 2.7, 2.8
// =============================================================================

/** A single argument value covering the cases that matter for interpolation:
 *  defined-but-falsy values (0, '', false) MUST be substituted, while null and
 *  undefined MUST leave the placeholder unchanged. */
const arbArg = fc.oneof(
  fc.string(),
  fc.integer(),
  fc.double(),
  fc.boolean(),
  fc.constant(0),
  fc.constant(""),
  fc.constant(null),
  fc.constant(undefined)
);

/** A template segment: either literal text (brace-free) or a positional
 *  placeholder for a given index. */
type Segment =
  | { type: "lit"; text: string }
  | { type: "ph"; index: number };

const arbSegment: fc.Arbitrary<Segment> = fc.oneof(
  fc
    .string({ maxLength: 8 })
    // Strip braces so literals can never form an accidental `{n}` placeholder.
    .map((s) => ({ type: "lit" as const, text: s.replace(/[{}]/g, "") })),
  fc.integer({ min: 0, max: 6 }).map((index) => ({ type: "ph" as const, index }))
);

describe("Property 3: Positional interpolation", () => {
  it("replaces each placeholder that has a non-null/defined arg and leaves the rest unchanged", () => {
    fc.assert(
      fc.property(
        fc.array(arbSegment, { maxLength: 12 }),
        fc.array(arbArg, { maxLength: 8 }),
        (segments, args) => {
          // Build the template and the expected output in lockstep from the same
          // segments, so the oracle never re-runs the implementation's regex.
          let template = "";
          let expected = "";
          for (const seg of segments) {
            if (seg.type === "lit") {
              template += seg.text;
              expected += seg.text;
            } else {
              template += `{${seg.index}}`;
              const arg = args[seg.index];
              if (arg !== undefined && arg !== null) {
                expected += String(arg);
              } else {
                expected += `{${seg.index}}`;
              }
            }
          }

          const key = "tpl.key";
          const bundle: I18nBundle = { "en-us": { [key]: template } };
          const t = I18nLookup(bundle);

          expect(t("en-us", key, ...args)).toBe(expected);
        }
      ),
      { numRuns: 100 }
    );
  });

  it("leaves every placeholder unchanged when no arguments are supplied", () => {
    fc.assert(
      fc.property(fc.array(arbSegment, { maxLength: 12 }), (segments) => {
        let template = "";
        for (const seg of segments) {
          template += seg.type === "lit" ? seg.text : `{${seg.index}}`;
        }

        const key = "tpl.key";
        const bundle: I18nBundle = { "en-us": { [key]: template } };
        const t = I18nLookup(bundle);

        // With no args, every placeholder token is left intact; literals pass through.
        expect(t("en-us", key)).toBe(template);
      }),
      { numRuns: 100 }
    );
  });
});
