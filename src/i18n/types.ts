/**
 * Shared type definitions for the Sailwind i18n subsystem.
 *
 * These types are consumed across the i18n module (lookup engine, bundle loader,
 * React context/provider, hooks, and formatting helpers). Keeping them colocated
 * here avoids circular imports between the runtime modules.
 */

import type { ReactNode } from 'react'

/**
 * A supported, normalized locale code (lowercase, hyphenated).
 *
 * v1 supports only `'en-us'`. Kept as a `string` alias so adding locales is a
 * data-only change (a new `.properties` bundle + a `SUPPORTED_LOCALES` entry).
 */
export type LocaleCode = string

/**
 * The in-memory translation bundle: normalized locale -> (key -> value).
 */
export type I18nBundle = Record<string, Record<string, string>>

/**
 * Reading direction implied by a locale.
 */
export type TextDirection = 'LTR' | 'RTL'

/**
 * The curried lookup function produced by `I18nLookup(bundle)`.
 *
 * Callable either fully applied — `(locale, key, ...args)` — or partially
 * applied to bind a locale — `(locale) => (key, ...args) => string`.
 */
export interface I18nLookupFunction {
  (locale: string, key: string, ...args: unknown[]): string
  (locale: string): (key: string, ...args: unknown[]) => string
}

/**
 * A translation function already bound to the active locale.
 */
export type TranslateFn = (key: string, ...args: unknown[]) => string

/**
 * Shape returned by the `useI18n()` hook.
 */
export interface I18nContextValue {
  /** Active, normalized locale code (e.g., `'en-us'`). */
  locale: LocaleCode
  /** Translation function bound to the active locale. */
  t: TranslateFn
  /** Reading direction implied by the active locale. */
  direction: TextDirection
}

/**
 * Props for the `LocaleProvider` component.
 */
export interface LocaleProviderProps {
  /** Locale to apply to descendants. Appian-form or internal-form accepted. */
  locale?: string
  children: ReactNode
}
