import { describe, it, expect } from "vitest";
import * as fc from "fast-check";
import { formatDate, formatNumber } from "./format";
import { normalizeLocale } from "./normalizeLocale";

// Mirror the implementation's locale resolution so the oracle matches exactly:
// normalize (trim, `_`→`-`, lowercase); empty → local default `'en-us'`.
const resolve = (loc: string) => normalizeLocale(loc) || "en-us";

// Supported/representative locales plus the empty ("no active locale") case.
const LOCALES = ["en-US", "de-DE", "fr-FR", "ja-JP", ""] as const;

// =============================================================================
// Property 9: Date formatting matches Intl
// Feature: component-i18n, Property 9: Date formatting matches Intl
// Validates: Requirements 8.1, 8.3
// =============================================================================
describe("Property 9: Date formatting matches Intl", () => {
  it("formatDate matches Intl.DateTimeFormat for the resolved locale", () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 4102444800000 }),
        fc.constantFrom(...LOCALES),
        (ms, locale) => {
          const date = new Date(ms);
          expect(formatDate(date, locale)).toBe(
            new Intl.DateTimeFormat(resolve(locale)).format(date)
          );
        }
      ),
      { numRuns: 100 }
    );
  });
});

// =============================================================================
// Property 10: Number formatting matches Intl
// Feature: component-i18n, Property 10: Number formatting matches Intl
// Validates: Requirements 8.2, 8.3
// =============================================================================
describe("Property 10: Number formatting matches Intl", () => {
  it("formatNumber matches Intl.NumberFormat for the resolved locale", () => {
    fc.assert(
      fc.property(
        fc.oneof(
          fc.integer(),
          fc.double({
            min: -1e12,
            max: 1e12,
            noNaN: true,
            noDefaultInfinity: true,
          })
        ),
        fc.constantFrom(...LOCALES),
        (num, locale) => {
          expect(formatNumber(num, locale)).toBe(
            new Intl.NumberFormat(resolve(locale)).format(num)
          );
        }
      ),
      { numRuns: 100 }
    );
  });
});

// =============================================================================
// Property 11: Formatting robustness
// Feature: component-i18n, Property 11: Formatting robustness
// Validates: Requirements 8.4, 8.5, 8.6
// =============================================================================
describe("Property 11: Formatting robustness", () => {
  it("returns an empty string for unparseable or nullish values", () => {
    fc.assert(
      fc.property(
        fc.constantFrom(null, undefined, "not-a-date", "", NaN),
        (value) => {
          expect(formatDate(value, "en-US")).toBe("");
        }
      ),
      { numRuns: 100 }
    );

    fc.assert(
      fc.property(
        fc.constantFrom(null, undefined, "abc", "", NaN, Infinity, -Infinity),
        (value) => {
          expect(formatNumber(value, "en-US")).toBe("");
        }
      ),
      { numRuns: 100 }
    );
  });

  it("falls back to the default locale for unsupported locales", () => {
    // Fixed samples: an unsupported-but-parseable locale resolves to the same
    // output as the Default_Locale.
    const sampleDate = new Date(1704067200000);
    const sampleNumber = 1234567.89;

    expect(formatDate(sampleDate, "zz-ZZ")).toBe(formatDate(sampleDate, "en-us"));
    expect(formatNumber(sampleNumber, "not a locale")).toBe(
      formatNumber(sampleNumber, "en-us")
    );
  });

  it("always returns a string and never throws for arbitrary input", () => {
    fc.assert(
      fc.property(fc.anything(), fc.string(), (value, locale) => {
        const dateResult = formatDate(
          value as Date | string | number | null | undefined,
          locale
        );
        const numberResult = formatNumber(
          value as number | string | null | undefined,
          locale
        );
        expect(typeof dateResult).toBe("string");
        expect(typeof numberResult).toBe("string");
      }),
      { numRuns: 100 }
    );
  });
});
