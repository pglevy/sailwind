/**
 * Appian locale bridge.
 *
 * Safely reads the ambient locale exposed by the Appian client at runtime,
 * without breaking any non-Appian environment (Storybook, tests, standalone
 * prototypes). Every access to the global `Appian` object is guarded and wrapped
 * in `try/catch`, so the bridge is inert wherever the Appian runtime is absent.
 *
 * The value produced here flows into the {@link LocaleProvider}'s fallback chain
 * (`getAppianLocale() ?? props.locale ?? DEFAULT_LOCALE`) rather than bypassing
 * it. That keeps the context the single source of truth and means a component
 * never needs to know whether it is running inside Appian (Requirement 6.1, 6.4).
 * An unavailable, null, empty, or unnormalizable Appian value simply yields
 * `null` here and falls through to the provider/default and the Requirement 2
 * lookup fallback chain (Requirement 6.3, 6.5, 6.6).
 */

/**
 * The shape of the optional ambient `Appian` object provided by the Appian
 * client runtime. Only the `getLocale` affordance consumed by this bridge is
 * modeled, and it is optional: the object (and the method) are absent in
 * Storybook, tests, and standalone prototypes.
 */
interface AppianGlobal {
  getLocale?: () => string | null | undefined
}

declare global {
  /**
   * Optional ambient Appian client object. Typed as possibly `undefined` so
   * TypeScript never assumes its presence; all access is guarded at runtime.
   */
  var Appian: AppianGlobal | undefined
}

/**
 * Read the active locale from the Appian client, if available.
 *
 * Resolution:
 * 1. If there is no `globalThis`, or no global `Appian` object, or it does not
 *    expose a `getLocale` function, return `null` (Requirement 6.4, 6.5).
 * 2. Otherwise call `Appian.getLocale()` and coerce the result to a string.
 * 3. Return `null` for an unavailable/null/undefined/empty result
 *    (Requirement 6.5), and `null` if anything throws (Requirement 6.6).
 *
 * The returned raw locale is intentionally *not* normalized here — the provider
 * normalizes and validates it as part of its single resolution path, so an
 * invalid Appian locale falls through the existing fallback chain naturally
 * (Requirement 6.2, 6.3, 6.6).
 *
 * This function never throws.
 *
 * @returns The raw Appian locale string, or `null` when unavailable.
 *
 * _Requirements: 6.1, 6.4, 6.5, 6.6_
 */
export function getAppianLocale(): string | null {
  try {
    if (typeof globalThis === 'undefined') {
      return null
    }

    const appian = globalThis.Appian
    if (!appian || typeof appian.getLocale !== 'function') {
      return null
    }

    const rawLocale = appian.getLocale()
    if (rawLocale === null || rawLocale === undefined) {
      return null
    }

    const localeString = String(rawLocale)
    return localeString === '' ? null : localeString
  } catch {
    // Any access error or thrown getLocale() leaves resolution to the provider
    // and default (Requirement 6.6).
    return null
  }
}
