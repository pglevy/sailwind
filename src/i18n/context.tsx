/* eslint-disable react-refresh/only-export-components --
 * This module intentionally co-locates I18nContext, the LocaleProvider
 * component, and the useI18n/useLocale hooks per the i18n design. It is a
 * library entry point, not a Fast Refresh (HMR) boundary, so the
 * "only export components" rule does not apply here.
 */
import { createContext, useContext, useMemo } from 'react'
import type { ReactElement } from 'react'
import type {
  I18nContextValue,
  LocaleCode,
  LocaleProviderProps,
  TextDirection,
} from './types'
import { normalizeLocale } from './normalizeLocale'
import { directionForLocale } from './direction'
import { lookup } from './bundleLoader'
import { getAppianLocale } from './appianLocale'
import { SUPPORTED_LOCALES, DEFAULT_LOCALE } from './keys'

/**
 * The context's default value: a fully-initialized instance bound to the
 * Default_Locale — never `undefined`. Because `useI18n()` reads this value when
 * no `LocaleProvider` encloses the caller, components outside any provider get a
 * working `en-us` translation function, direction, and locale rather than an
 * error path (Requirement 1.3, 5.5, 10.2).
 */
const DEFAULT_CONTEXT_VALUE: I18nContextValue = {
  locale: DEFAULT_LOCALE,
  t: lookup(DEFAULT_LOCALE),
  direction: directionForLocale(DEFAULT_LOCALE),
}

/**
 * React context carrying the active {@link I18nContextValue}. Seeded with a real
 * initialized value (never `undefined`) so the no-provider path is a valid,
 * working default rather than a "provider required" error (Requirement 1.3, 5.5).
 */
export const I18nContext =
  createContext<I18nContextValue>(DEFAULT_CONTEXT_VALUE)

/**
 * Provides the active locale, a locale-bound translation function, and the
 * implied Text_Direction to all descendants.
 *
 * The effective locale is
 * `normalizeLocale(getAppianLocale() ?? locale ?? DEFAULT_LOCALE)`. The Appian
 * client locale takes precedence when present, then the `locale` prop, then the
 * Default_Locale — the Appian bridge *feeds* this provider rather than bypassing
 * it, keeping the context the single source of truth (Requirement 6.1, 6.4). If
 * the resolved value is not among {@link SUPPORTED_LOCALES}, the provider emits a
 * `console.warn` naming the unsupported code and falls back to the
 * Default_Locale, continuing to render without interrupting the tree
 * (Requirement 1.6, 10.3). An invalid or unnormalizable Appian locale therefore
 * falls through this same validation and the Requirement 2 lookup fallback chain
 * naturally (Requirement 6.3, 6.6). It then derives `direction` via
 * {@link directionForLocale} and binds `t = lookup(effectiveLocale)`.
 *
 * The provided value is memoized on the `locale` prop, so changing it produces a
 * new context value identity that re-renders every descendant in the same
 * commit — with the updated direction — and none retains the prior locale
 * (Requirement 1.4, 9.1, 9.4). Nesting resolves to the nearest provider
 * automatically via React context (Requirement 1.1, 1.5, 10.1).
 *
 * The Appian locale is read *inside* the memo. It is effectively constant per
 * session (the Appian client does not change locale mid-session), so it is not a
 * reactive memo dependency; keying the memo on the `locale` prop alone is
 * correct and avoids re-reading the global on every render.
 *
 * _Requirements: 1.1, 1.4, 1.5, 1.6, 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 9.1, 9.4, 10.1, 10.3_
 */
export function LocaleProvider({
  locale,
  children,
}: LocaleProviderProps): ReactElement {
  const value = useMemo<I18nContextValue>(() => {
    const requested = normalizeLocale(
      getAppianLocale() ?? locale ?? DEFAULT_LOCALE
    )

    let effectiveLocale = requested
    if (!SUPPORTED_LOCALES.includes(requested)) {
      console.warn(
        `[sailwind i18n] Unsupported locale "${requested}"; falling back to "${DEFAULT_LOCALE}".`
      )
      effectiveLocale = DEFAULT_LOCALE
    }

    return {
      locale: effectiveLocale,
      t: lookup(effectiveLocale),
      direction: directionForLocale(effectiveLocale),
    }
    // Recomputed only when the incoming locale prop changes; the resulting
    // object identity is what propagates a locale change to descendants.
  }, [locale])

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

/**
 * Returns the active {@link I18nContextValue} — `{ locale, t, direction }` — from
 * the nearest enclosing {@link LocaleProvider}, or the Default_Locale instance
 * when invoked outside any provider (Requirement 1.3, 5.5).
 */
export function useI18n(): I18nContextValue {
  return useContext(I18nContext)
}

/**
 * Returns the active `{ locale, direction }` from the nearest enclosing
 * {@link LocaleProvider} (or the Default_Locale instance outside any provider).
 * A convenience for components that need locale/direction but not `t`
 * (Requirement 9.1).
 */
export function useLocale(): { locale: LocaleCode; direction: TextDirection } {
  const { locale, direction } = useContext(I18nContext)
  return { locale, direction }
}
