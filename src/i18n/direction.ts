import type { TextDirection } from './types'
import { normalizeLocale } from './normalizeLocale'

/**
 * The set of language subtags that imply a right-to-left reading direction.
 *
 * Keys are normalized language subtags (lowercase). The list is intentionally
 * small and covers the most common RTL languages; adding a locale is a data-only
 * change — extend this set with the new subtag (e.g., `yi`, `dv`, `ps`).
 */
const RTL_LANGUAGE_SUBTAGS: ReadonlySet<string> = new Set([
  'ar', // Arabic
  'he', // Hebrew
  'fa', // Persian (Farsi)
  'ur', // Urdu
])

/**
 * Determine the Text_Direction implied by a locale.
 *
 * The locale is normalized (trim, `_`→`-`, lowercase) and reduced to its language
 * subtag (the segment before the first `-`). If that subtag is a known
 * right-to-left language, the direction is `'RTL'`; otherwise it is `'LTR'`.
 *
 * Absent, empty, or unknown locales — as well as any left-to-right language —
 * resolve to `'LTR'`. Because the language subtag is compared against a fixed
 * set, the result is invariant to casing, region, and separator form
 * (`ar`, `AR`, `ar-EG`, `ar_EG` all yield `'RTL'`).
 *
 * This helper never throws, keeping the i18n subsystem free of render-time
 * exceptions.
 *
 * @param locale - A locale string in Appian form (`ar-EG`), Java form (`ar_EG`),
 *   already-normalized internal form (`ar-eg`), or a bare language subtag
 *   (`ar`). May be empty.
 * @returns `'RTL'` when the normalized language subtag is a known right-to-left
 *   language, otherwise `'LTR'`.
 *
 * _Requirements: 9.1, 9.2, 9.3, 9.5_
 */
export function directionForLocale(locale: string): TextDirection {
  const languageSubtag = normalizeLocale(locale).split('-')[0]
  return RTL_LANGUAGE_SUBTAGS.has(languageSubtag) ? 'RTL' : 'LTR'
}
