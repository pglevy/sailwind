/**
 * Translation_Key catalog and supported-locale registry.
 *
 * Every library-owned user-facing string and generated ARIA label resolves
 * through one of these keys. Keys use a `component.camelCaseName` dotted
 * namespace, which keeps them stable, readable, collision-free, and maps cleanly
 * onto Appian `.properties` conventions. The default (`en-US`) bundle in
 * `bundles/components.properties` must contain an entry for every key here
 * (Requirement 3.6).
 *
 * Exporting the catalog as typed `const` constants lets components reference keys
 * without typos (`KEYS.pagingFirstPage` instead of the raw `'paging.firstPage'`),
 * and the derived {@link TranslationKey} union constrains lookups to known keys.
 *
 * Paging adopts full-phrase interpolated keys (`paging.range`, `paging.rangeMany`)
 * rather than concatenating a connector word, because word order differs across
 * languages and a single interpolated phrase stays translatable (Requirement 4.1).
 */

import type { LocaleCode } from './types'

/**
 * The typed catalog of every library-owned Translation_Key.
 *
 * The property names are ergonomic camelCase identifiers used in component code;
 * the values are the dotted keys stored in the `.properties` bundles. Declared
 * `as const` so the values are literal-typed and drive {@link TranslationKey}.
 */
export const KEYS = {
  /** Paging: "First page" control (aria-label / title). */
  pagingFirstPage: 'paging.firstPage',
  /** Paging: "Previous page" control (aria-label / title). */
  pagingPreviousPage: 'paging.previousPage',
  /** Paging: "Next page" control (aria-label / title). */
  pagingNextPage: 'paging.nextPage',
  /** Paging: "Last page" control (aria-label / title). */
  pagingLastPage: 'paging.lastPage',
  /** Paging: full range phrase for `ROW_COUNT` controls — `{0} – {1} of {2}`. */
  pagingRange: 'paging.range',
  /** Paging: full range phrase for `STANDARD` controls — `{0} – {1} of many`. */
  pagingRangeMany: 'paging.rangeMany',
  /** ButtonWidget: loading-indicator aria-label. */
  buttonLoading: 'button.loading',
  /** FieldLabel: help-tooltip aria-label. */
  fieldHelp: 'field.help',
  /** FieldLabel: required-indicator aria-label. */
  fieldRequired: 'field.required',
  /** ProgressBar: default aria-label. */
  progressBarLabel: 'progressBar.label',
  /** ImageField: default aria-label for a linked image. */
  imageOpenLinked: 'image.openLinked',
  /** ReadOnlyGrid: default empty-state message. */
  gridEmptyMessage: 'grid.emptyMessage',
} as const

/** The ergonomic camelCase identifiers of {@link KEYS} (e.g., `'pagingFirstPage'`). */
export type TranslationKeyName = keyof typeof KEYS

/** The dotted Translation_Key values of {@link KEYS} (e.g., `'paging.firstPage'`). */
export type TranslationKey = (typeof KEYS)[TranslationKeyName]

/**
 * The set of locales the library ships translations for. v1 ships only the
 * default `en-us` bundle; adding a locale is a drop-in `.properties` file plus
 * one entry here (used only for provider validation and the Storybook picker —
 * lookup itself is data-driven).
 */
export const SUPPORTED_LOCALES: LocaleCode[] = ['en-us']

/**
 * The normalized Default_Locale. The lookup fallback chain always terminates
 * here, and the no-provider path binds to it, so components render identical
 * `en-US` text with or without a `LocaleProvider` (Requirement 5).
 */
export const DEFAULT_LOCALE: LocaleCode = 'en-us'
