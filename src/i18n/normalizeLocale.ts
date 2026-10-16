import type { LocaleCode } from './types'

/**
 * Normalize a locale string into the internal Locale_Code form.
 *
 * The normalization is:
 * 1. Trim leading/trailing whitespace.
 * 2. Convert underscores (`_`) to hyphens (`-`) — bridges the Appian/Java
 *    `en_US` form to the internal `en-us` form.
 * 3. Lowercase all characters.
 *
 * This mirrors the normalization applied before every Translation_Bundle lookup
 * so that any casing, separator, or surrounding-whitespace variant of the same
 * locale resolves identically. The operation is idempotent: normalizing an
 * already-normalized value yields the same value.
 *
 * Non-string / nullish input is coerced to an empty string rather than throwing,
 * keeping the i18n subsystem free of render-time exceptions.
 *
 * @param locale - A locale string in Appian form (`en-US`), Java form (`en_US`),
 *   or already-normalized internal form (`en-us`). May be empty.
 * @returns The normalized Locale_Code (lowercase, hyphen-separated, trimmed).
 *
 * _Requirements: 2.6, 3.3, 6.2_
 */
export function normalizeLocale(locale: string): LocaleCode {
  if (typeof locale !== 'string') {
    return ''
  }
  return locale.trim().replace(/_/g, '-').toLowerCase()
}
