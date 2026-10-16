/**
 * Public API for the Sailwind i18n subsystem.
 *
 * Consumers, Storybook, and standalone prototypes import from here to provide a
 * locale (`LocaleProvider`), read the active locale/translation (`useI18n`,
 * `useLocale`), format dates and numbers for a locale (`formatDate`,
 * `formatNumber`), reference translation keys (`KEYS`), and inspect the
 * supported-locale registry (`SUPPORTED_LOCALES`, `DEFAULT_LOCALE`).
 *
 * Internal-only building blocks (the raw `I18nLookup` engine, `bundleLoader`,
 * `normalizeLocale`, and the Appian bridge) are intentionally not re-exported.
 */

// Provider + hooks
export { LocaleProvider, useI18n, useLocale } from './context'

// Locale-aware formatting helpers (Intl-based)
export { formatDate, formatNumber } from './format'

// Text_Direction helper (exposed for future RTL consumption)
export { directionForLocale } from './direction'

// Node-aware interpolation (placeholders that must be React nodes, not strings)
export { interpolateNodes } from './interpolateNodes'

// Translation_Key catalog + supported-locale registry
export { KEYS, SUPPORTED_LOCALES, DEFAULT_LOCALE } from './keys'
export type { TranslationKey, TranslationKeyName } from './keys'

// Shared types
export type {
  LocaleCode,
  TextDirection,
  I18nBundle,
  I18nLookupFunction,
  TranslateFn,
  I18nContextValue,
  LocaleProviderProps,
} from './types'
