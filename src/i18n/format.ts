import { normalizeLocale } from './normalizeLocale'

/**
 * Locale-aware formatting helpers built on the platform `Intl` API.
 *
 * These helpers are intentionally defensive: no code path throws into a
 * consumer's render tree. They degrade gracefully through a fixed chain —
 * active locale → Default_Locale → the value's default string representation —
 * and return an empty string for values that cannot be parsed as the expected
 * type.
 *
 * Currency and relative-time formatting are intentionally out of scope for v1
 * (future considerations); only date and number formatting are provided.
 *
 * _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6_
 */

/**
 * The Default_Locale fallback used by these formatters.
 *
 * Defined locally (rather than imported from `keys.ts`, which is authored in a
 * later task) to avoid a forward/circular dependency between the formatting
 * helpers and the key catalog. It mirrors the canonical `DEFAULT_LOCALE`
 * (`'en-us'`) and `Intl` resolves it case-insensitively.
 */
const DEFAULT_LOCALE = 'en-us'

/**
 * Resolve the locale to use for formatting.
 *
 * Normalizes the supplied locale (trim, `_`→`-`, lowercase). When the result is
 * empty — i.e., no active locale was supplied — the Default_Locale is used
 * (Requirement 8.3). The value is still handed to `Intl`, which performs its own
 * validation; a structurally invalid tag causes the constructor to throw a
 * `RangeError`, which the callers catch and retry against the Default_Locale
 * (Requirement 8.4).
 */
function resolveLocale(locale: string): string {
  const normalized = normalizeLocale(locale)
  return normalized !== '' ? normalized : DEFAULT_LOCALE
}

/**
 * Coerce an input into a valid `Date`, or `null` when it cannot be parsed.
 *
 * `null`/`undefined` and any value that produces an invalid `Date` (empty
 * string, non-date string, `NaN`, non-finite number) yield `null`, which the
 * caller renders as an empty string (Requirement 8.5).
 */
function toValidDate(value: Date | string | number | null | undefined): Date | null {
  if (value === null || value === undefined) {
    return null
  }
  const date = value instanceof Date ? value : new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

/**
 * Coerce an input into a finite `number`, or `null` when it cannot be parsed.
 *
 * `null`/`undefined`, empty/whitespace-only strings, non-numeric strings, and
 * non-finite numbers (`NaN`, `±Infinity`) yield `null`, which the caller renders
 * as an empty string (Requirement 8.5).
 */
function toValidNumber(value: number | string | null | undefined): number | null {
  if (value === null || value === undefined) {
    return null
  }
  if (typeof value === 'string' && value.trim() === '') {
    return null
  }
  const num = typeof value === 'number' ? value : Number(value)
  return Number.isFinite(num) ? num : null
}

/**
 * Format a date value for the active locale using `Intl.DateTimeFormat`.
 *
 * Behavior (Requirement 8):
 * - Valid date + active locale → formatted for that locale (8.1).
 * - No active locale → formatted for the Default_Locale (8.3).
 * - Unrecognized/unsupported locale (constructor throws `RangeError`) → retry
 *   with the Default_Locale (8.4).
 * - `null`/`undefined`/unparseable value → `''`, without throwing (8.5).
 * - If even the Default_Locale cannot format the value → the value's default
 *   string representation (`String(value)`), without throwing (8.6).
 *
 * The helper never throws for any combination of inputs.
 *
 * @param value - A `Date`, date string, or timestamp (ms since epoch). May be
 *   `null`/`undefined`.
 * @param locale - The active locale. Appian-form, Java-form, or internal-form
 *   accepted; empty means "no active locale" and uses the Default_Locale.
 * @param options - Optional `Intl.DateTimeFormatOptions`.
 * @returns The formatted date, or `''` when the value cannot be parsed.
 *
 * _Requirements: 8.1, 8.3, 8.4, 8.5, 8.6_
 */
export function formatDate(
  value: Date | string | number | null | undefined,
  locale: string,
  options?: Intl.DateTimeFormatOptions
): string {
  const date = toValidDate(value)
  if (date === null) {
    return ''
  }

  const activeLocale = resolveLocale(locale)

  try {
    return new Intl.DateTimeFormat(activeLocale, options).format(date)
  } catch {
    try {
      return new Intl.DateTimeFormat(DEFAULT_LOCALE, options).format(date)
    } catch {
      return String(value)
    }
  }
}

/**
 * Format a numeric value for the active locale using `Intl.NumberFormat`.
 *
 * Behavior (Requirement 8):
 * - Finite number + active locale → formatted for that locale (8.2).
 * - No active locale → formatted for the Default_Locale (8.3).
 * - Unrecognized/unsupported locale (constructor throws `RangeError`) → retry
 *   with the Default_Locale (8.4).
 * - `null`/`undefined`/unparseable value (including `NaN`/`±Infinity`) → `''`,
 *   without throwing (8.5).
 * - If even the Default_Locale cannot format the value → the value's default
 *   string representation (`String(value)`), without throwing (8.6).
 *
 * The helper never throws for any combination of inputs.
 *
 * @param value - A number or numeric string. May be `null`/`undefined`.
 * @param locale - The active locale. Appian-form, Java-form, or internal-form
 *   accepted; empty means "no active locale" and uses the Default_Locale.
 * @param options - Optional `Intl.NumberFormatOptions`.
 * @returns The formatted number, or `''` when the value cannot be parsed.
 *
 * _Requirements: 8.2, 8.3, 8.4, 8.5, 8.6_
 */
export function formatNumber(
  value: number | string | null | undefined,
  locale: string,
  options?: Intl.NumberFormatOptions
): string {
  const num = toValidNumber(value)
  if (num === null) {
    return ''
  }

  const activeLocale = resolveLocale(locale)

  try {
    return new Intl.NumberFormat(activeLocale, options).format(num)
  } catch {
    try {
      return new Intl.NumberFormat(DEFAULT_LOCALE, options).format(num)
    } catch {
      return String(value)
    }
  }
}
