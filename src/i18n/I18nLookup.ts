import type { I18nBundle, I18nLookupFunction } from './types'
import { normalizeLocale } from './normalizeLocale'

/**
 * The normalized Default_Locale. Every lookup terminates here before returning
 * the key unchanged. Kept local to this module so the pure lookup engine has no
 * dependency on the (later-authored) key catalog / registry.
 */
const DEFAULT_LOCALE = 'en-us'

/**
 * Matches positional placeholders of the form `{n}` where `n` is a non-negative
 * integer (`{0}`, `{1}`, `{2}`, …). The captured group is the zero-based index.
 */
const PLACEHOLDER_PATTERN = /\{(\d+)\}/g

/**
 * Replace positional `{n}` placeholders in a resolved template with the string
 * representation of the argument at the corresponding zero-based index.
 *
 * A placeholder whose argument is missing, `null`, or `undefined` is left
 * unchanged in the output (Requirement 2.8). All other placeholders are replaced
 * with `String(arg)` (Requirement 2.7).
 */
function interpolate(template: string, args: readonly unknown[]): string {
  if (template.indexOf('{') === -1) {
    return template
  }
  return template.replace(PLACEHOLDER_PATTERN, (token, indexStr: string) => {
    const arg = args[Number(indexStr)]
    if (arg === undefined || arg === null) {
      return token
    }
    return String(arg)
  })
}

/**
 * Whether `target` has its own (non-inherited) property `property`. Uses
 * `Object.prototype.hasOwnProperty.call` so it works on null-prototype objects
 * without relying on ES2022 `Object.hasOwn`.
 */
function hasOwn(target: object, property: string): boolean {
  return Object.prototype.hasOwnProperty.call(target, property)
}

/**
 * Read `bundle[locale][key]`, counting only own, string-valued entries.
 *
 * Plain objects inherit members from `Object.prototype`, so a plain read with a
 * locale or key such as `toString` or `constructor` returns a function or object
 * instead of `undefined` (#173). Inherited members and non-string values are
 * treated as missing, so the caller falls through to the next tier.
 */
function readEntry(
  bundle: I18nBundle,
  locale: string,
  key: string
): string | undefined {
  if (!hasOwn(bundle, locale)) {
    return undefined
  }
  const entries: unknown = bundle[locale]
  if (typeof entries !== 'object' || entries === null) {
    return undefined
  }
  if (!hasOwn(entries, key)) {
    return undefined
  }
  const value: unknown = (entries as Record<string, unknown>)[key]
  return typeof value === 'string' ? value : undefined
}

/**
 * Resolve a single key against a bundle for an already-normalized locale,
 * applying the fallback chain and interpolating any positional arguments.
 *
 * Fallback order (Requirement 2.1–2.4):
 *   1. Exact locale match     — `bundle[locale][key]`
 *   2. Language-only match    — `bundle[lang][key]`, `lang = locale.split('-')[0]`
 *   3. Default locale match   — `bundle['en-us'][key]`
 *   4. Otherwise              — the key unchanged
 *
 * Only own, string-valued entries count (see {@link readEntry}). Inherited
 * members (`toString`, `constructor`, …) and non-string values are treated as
 * missing (#173).
 *
 * An empty/absent key short-circuits to `''` (Requirement 2.5).
 */
function resolve(
  bundle: I18nBundle,
  locale: string,
  key: string,
  args: readonly unknown[]
): string {
  // Empty or absent key: return '' without attempting locale matching.
  if (!key) {
    return ''
  }

  // 1. Exact locale match.
  const exact = readEntry(bundle, locale, key)
  if (exact !== undefined) {
    return interpolate(exact, args)
  }

  // 2. Language-only match (e.g., `en` derived from `en-us`).
  const lang = locale.split('-')[0]
  if (lang && lang !== locale) {
    const langValue = readEntry(bundle, lang, key)
    if (langValue !== undefined) {
      return interpolate(langValue, args)
    }
  }

  // 3. Default_Locale match.
  const defaultValue = readEntry(bundle, DEFAULT_LOCALE, key)
  if (defaultValue !== undefined) {
    return interpolate(defaultValue, args)
  }

  // 4. No entry anywhere: return the key unchanged.
  return key
}

/**
 * Build a translation lookup function bound to a given Translation_Bundle.
 *
 * A direct port of the internal Appian `ui-library` `I18nLookup` pattern, with
 * the overloaded {@link I18nLookupFunction} signature preserved so the two
 * codebases stay conceptually aligned. The returned function is callable two
 * ways:
 *
 * - Fully applied — `lookup(locale, key, ...args)` returns the resolved string.
 * - Curried — `lookup(locale)` returns `(key, ...args) => string` bound to that
 *   locale (the locale is normalized once when the closure is created).
 *
 * Resolution semantics for every call:
 *
 * 1. The locale is normalized via {@link normalizeLocale} (trim, `_`→`-`,
 *    lowercase) before matching (Requirement 2.6).
 * 2. An empty or absent key returns `''` immediately (Requirement 2.5).
 * 3. The value is taken from the highest-priority tier that contains the key —
 *    exact locale, then language-only, then the Default_Locale (`en-us`) —
 *    and the key itself is returned when no tier contains it
 *    (Requirement 2.1–2.4).
 * 4. Positional `{n}` placeholders in the resolved value are interpolated from
 *    the supplied arguments, leaving tokens with missing/null/undefined
 *    arguments unchanged (Requirement 2.7–2.8).
 *
 * The lookup never throws for any locale or key input (Requirement 1.7). Only
 * own, string-valued bundle entries count: inherited members (`toString`,
 * `constructor`, …) and non-string values are treated as missing, so they fall
 * back like any absent key (#173).
 *
 * @param bundle - The in-memory Translation_Bundle (normalized locale → key →
 *   value).
 * @returns A curried lookup with the overloaded {@link I18nLookupFunction}
 *   signature.
 *
 * _Requirements: 1.7, 2.1, 2.2, 2.3, 2.4, 2.5, 2.7, 2.8_
 */
export function I18nLookup(bundle: I18nBundle): I18nLookupFunction {
  function lookup(locale: string): (key: string, ...args: unknown[]) => string
  function lookup(locale: string, key: string, ...args: unknown[]): string
  function lookup(
    locale: string,
    key?: string,
    ...args: unknown[]
  ): string | ((key: string, ...args: unknown[]) => string) {
    const normalized = normalizeLocale(locale)

    // Curried form: only the locale was supplied.
    if (key === undefined) {
      return (boundKey: string, ...boundArgs: unknown[]): string =>
        resolve(bundle, normalized, boundKey, boundArgs)
    }

    // Fully-applied form.
    return resolve(bundle, normalized, key, args)
  }

  return lookup as I18nLookupFunction
}
