import { describe, it, expect } from "vitest";
import * as fc from "fast-check";
import { directionForLocale } from "./direction";
import type { TextDirection } from "./types";

// =============================================================================
// Property 12: Direction mapping
// Feature: component-i18n, Property 12: Direction mapping
// Validates: Requirements 9.2, 9.3, 9.4, 9.5
//
// For any locale string, `directionForLocale` returns `RTL` when the normalized
// language subtag is a known right-to-left language, and `LTR` in every other
// case — including left-to-right languages and absent, empty, or unknown
// locales — invariant to casing, region, and separator form.
// =============================================================================

/** Language subtags the implementation treats as right-to-left. */
const RTL_SUBTAGS = ["ar", "he", "fa", "ur"] as const;

/**
 * A sampling of unambiguously left-to-right language subtags that are also
 * unknown to the system's RTL set (so the expected direction is LTR under both
 * the requirement's semantics and the implementation).
 */
const LTR_SUBTAGS = [
  "en", "es", "fr", "de", "it", "pt", "ja", "zh", "ko", "ru",
  "nl", "sv", "pl", "tr", "hi", "vi", "th", "id", "cs", "el",
] as const;

// --- Building-block arbitraries for casing / region / separator / whitespace ---

/** Surrounding whitespace variants, including none. */
const arbWhitespace = fc.constantFrom("", " ", "  ", "\t", " \t ", "\n");

/** Both accepted separator forms between language and region subtags. */
const arbSeparator = fc.constantFrom("-", "_");

/** A spread of two-letter region codes across LTR and RTL regions. */
const arbRegion = fc.constantFrom(
  "US", "EG", "IL", "IR", "PK", "GB", "FR", "DE", "CA", "AE", "SA", "JP",
);

interface LocaleSpec {
  /** The assembled locale string handed to `directionForLocale`. */
  input: string;
  /** The direction the assembled locale is expected to resolve to. */
  expected: TextDirection;
}

/**
 * Assemble a concrete locale string from a base language subtag, applying an
 * optional region, either separator form, arbitrary per-character casing, and
 * arbitrary surrounding whitespace. The `expected` direction is fixed by the
 * base subtag, so every generated variant must resolve to the same value —
 * this is what exercises the casing / region / separator invariance.
 */
function buildLocale(
  subtag: string,
  expected: TextDirection,
): fc.Arbitrary<LocaleSpec> {
  return fc
    .record({
      useRegion: fc.boolean(),
      region: arbRegion,
      sep: arbSeparator,
      lead: arbWhitespace,
      trail: arbWhitespace,
      caseSeed: fc.array(fc.boolean(), { minLength: 0, maxLength: 12 }),
    })
    .map(({ useRegion, region, sep, lead, trail, caseSeed }) => {
      const core = useRegion ? `${subtag}${sep}${region}` : subtag;
      const cased = core
        .split("")
        .map((ch, i) => (caseSeed[i] ? ch.toUpperCase() : ch.toLowerCase()))
        .join("");
      return { input: `${lead}${cased}${trail}`, expected };
    });
}

describe("Property 12: Direction mapping", () => {
  // --- Requirement 9.2: known RTL languages → RTL ---
  it("returns RTL for known RTL languages regardless of casing, region, and separator", () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...RTL_SUBTAGS).chain((t) => buildLocale(t, "RTL")),
        ({ input }) => {
          expect(directionForLocale(input)).toBe("RTL");
        },
      ),
      { numRuns: 200 },
    );
  });

  // --- Requirement 9.3: known LTR languages → LTR ---
  it("returns LTR for known LTR languages regardless of casing, region, and separator", () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...LTR_SUBTAGS).chain((t) => buildLocale(t, "LTR")),
        ({ input }) => {
          expect(directionForLocale(input)).toBe("LTR");
        },
      ),
      { numRuns: 200 },
    );
  });

  // --- Requirement 9.5: absent / empty locales → LTR ---
  it("returns LTR for absent, empty, or whitespace-only locales", () => {
    fc.assert(
      fc.property(
        fc.constantFrom("", " ", "   ", "\t", "\n", "  \t ", "\r\n"),
        (input) => {
          expect(directionForLocale(input)).toBe("LTR");
        },
      ),
      { numRuns: 100 },
    );
  });

  // --- Requirement 9.5: unknown language subtags → LTR ---
  it("returns LTR for unknown language subtags (invariant to region, separator, casing)", () => {
    // A subtag of ASCII letters whose lowercase form is not a known RTL code.
    const arbUnknownSubtag = fc
      .array(
        fc.constantFrom(..."abcdefghijklmnopqrstuvwxyz".split("")),
        { minLength: 1, maxLength: 6 },
      )
      .map((chars) => chars.join(""))
      .filter(
        (s) => !(RTL_SUBTAGS as readonly string[]).includes(s.toLowerCase()),
      );

    fc.assert(
      fc.property(
        arbUnknownSubtag.chain((t) => buildLocale(t, "LTR")),
        ({ input }) => {
          expect(directionForLocale(input)).toBe("LTR");
        },
      ),
      { numRuns: 200 },
    );
  });

  // --- Invariance clause + Requirement 9.4: casing/region/separator variants of
  // the same locale all resolve to the same direction, and distinct locales are
  // mapped independently (a change in locale changes the reported direction). ---
  it("maps every casing/region/separator variant of a locale to a single direction", () => {
    const arbAnySubtag = fc.oneof(
      fc.constantFrom(...RTL_SUBTAGS).map((t) => ({ subtag: t, expected: "RTL" as TextDirection })),
      fc.constantFrom(...LTR_SUBTAGS).map((t) => ({ subtag: t, expected: "LTR" as TextDirection })),
    );

    fc.assert(
      fc.property(
        arbAnySubtag,
        fc.array(arbSeparator, { minLength: 1, maxLength: 4 }),
        fc.array(arbRegion, { minLength: 1, maxLength: 4 }),
        ({ subtag, expected }, seps, regions) => {
          // Build several surface forms of the same underlying locale.
          const variants: string[] = [
            subtag,
            subtag.toUpperCase(),
            `  ${subtag}  `,
          ];
          for (const sep of seps) {
            for (const region of regions) {
              variants.push(`${subtag}${sep}${region}`);
              variants.push(`${subtag.toUpperCase()}${sep}${region.toLowerCase()}`);
              variants.push(` ${subtag}${sep}${region} `);
            }
          }

          const results = variants.map((v) => directionForLocale(v));
          // All variants agree with each other...
          results.forEach((r) => expect(r).toBe(results[0]));
          // ...and agree with the direction implied by the base subtag.
          expect(results[0]).toBe(expected);
        },
      ),
      { numRuns: 150 },
    );
  });

  // --- Requirement 9.4 (locale change tracking) + total function guarantee:
  // for ANY string the mapping is deterministic and never throws. ---
  it("is a total, deterministic function that never throws for any string input", () => {
    fc.assert(
      fc.property(fc.string(), (input) => {
        const first = directionForLocale(input);
        const second = directionForLocale(input);
        expect(first).toBe(second);
        expect(first === "RTL" || first === "LTR").toBe(true);
      }),
      { numRuns: 200 },
    );
  });
});
