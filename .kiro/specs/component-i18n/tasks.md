# Implementation Plan: Component Internationalization (component-i18n)

## Overview

This plan builds the Sailwind i18n subsystem bottom-up: the pure/core modules in `src/i18n/` first (each paired with its `fast-check` property test), then the React provider/hook layer, the Appian locale bridge, the key catalog and default `en-US` bundle, and finally the wiring of each library-owned component to resolve its strings through `t()` while preserving byte-for-byte backward compatibility. Storybook locale selection and the downstream Appian designer/packaging work close out the plan.

Language: **TypeScript** (per the design's module signatures and the existing project). Tooling per project convention: `pnpm`, Vitest with `fast-check` for property-based tests colocated as `*.properties.test.ts(x)`, and `typecheck` + `lint` + `test` as the verification gate.

Tasks marked `*` are optional (test sub-tasks, RTL-application work, and downstream packaging-pipeline work). Core implementation tasks are never optional. Note that computing and exposing `Text_Direction` through the provider/hook is **core** (tasks 5 and 7); only components *applying* RTL layout is optional (task 12).

## Tasks

- [ ] 1. Establish i18n module foundations (types + locale normalization)
  - [ ] 1.1 Create `src/i18n/normalizeLocale.ts` and shared i18n types
    - Implement `normalizeLocale(locale)` — trim, convert `_`→`-`, lowercase
    - Define `LocaleCode`, `I18nBundle`, `TextDirection`, `I18nLookupFunction`, `TranslateFn`, `I18nContextValue`, `LocaleProviderProps` (colocate in `src/i18n/types.ts` or inline per design)
    - _Requirements: 2.6, 3.3, 6.2_

  - [ ]* 1.2 Write property test for locale normalization
    - `src/i18n/normalizeLocale.properties.test.ts`
    - **Property 2: Normalization idempotency and lookup invariance**
    - **Validates: Requirements 2.6, 3.3, 6.2**

- [ ] 2. Implement the pure lookup engine
  - [ ] 2.1 Implement `src/i18n/I18nLookup.ts`
    - Curried `I18nLookup(bundle)` returning the lookup/translate function
    - Fallback chain: exact locale → language-only → `en-us` default → key unchanged; empty/absent key → `''`; never throws
    - Positional `{n}` interpolation; leave token unchanged when arg is missing/null/undefined
    - Normalize the locale via `normalizeLocale` before matching
    - _Requirements: 1.7, 2.1, 2.2, 2.3, 2.4, 2.5, 2.7, 2.8_

  - [ ]* 2.2 Write property test for lookup fallback determinism
    - `src/i18n/I18nLookup.properties.test.ts`
    - **Property 1: Lookup fallback determinism**
    - **Validates: Requirements 1.7, 2.1, 2.2, 2.3, 2.4, 2.5, 4.6, 5.4, 6.3, 6.6, 10.3, 10.6**

  - [ ]* 2.3 Write property test for positional interpolation
    - `src/i18n/I18nLookup.properties.test.ts`
    - **Property 3: Positional interpolation**
    - **Validates: Requirements 2.7, 2.8**

- [ ] 3. Implement the bundle loader (.properties parser + Unicode decoding)
  - [ ] 3.1 Implement `src/i18n/bundleLoader.ts`
    - Minimal `.properties` parser: split on newlines, ignore blank/`#`/`!` lines, split on first `=`/`:`, trim key, preserve value; last-write-wins on duplicate keys
    - Decode `\uXXXX` escapes; leave malformed (<4 hex digits) escapes literal and continue
    - Derive locale from filename via `/_([a-z]{2}(?:_[A-Z]{2})?)\.properties$/`, normalize `_`→`-` + lowercase; suffix-less `<BundleName>.properties` keyed under `en-us`; skip non-matching filenames and continue
    - Exclude keys containing `.##CONTEXT##`; assemble `I18nBundle` and hand to `I18nLookup`
    - Wire `import.meta.glob('./bundles/*.properties', { eager: true, query: '?raw', import: 'default' })`
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8_

  - [ ]* 3.2 Write property test for loader filename handling
    - `src/i18n/bundleLoader.properties.test.ts`
    - **Property 4: Bundle loader filename handling**
    - **Validates: Requirements 3.2, 3.3, 3.7**

  - [ ]* 3.3 Write property test for Unicode escape decoding
    - `src/i18n/bundleLoader.properties.test.ts`
    - **Property 5: Unicode escape decoding**
    - **Validates: Requirements 3.5, 3.8**

  - [ ]* 3.4 Write property test for context-key exclusion
    - `src/i18n/bundleLoader.properties.test.ts`
    - **Property 6: Context-key exclusion**
    - **Validates: Requirements 3.4**

- [ ] 4. Checkpoint - core lookup + loader
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 5. Implement the Text_Direction helper (core — direction signal is not optional)
  - [ ] 5.1 Implement `src/i18n/direction.ts`
    - `directionForLocale(locale)` with RTL subtag set (`ar`, `he`, `fa`, `ur`, extendable); `RTL` when normalized language subtag is RTL, else `LTR` (including absent/unknown)
    - _Requirements: 9.1, 9.2, 9.3, 9.5_

  - [ ]* 5.2 Write property test for direction mapping
    - `src/i18n/direction.properties.test.ts`
    - **Property 12: Direction mapping**
    - **Validates: Requirements 9.2, 9.3, 9.4, 9.5**

- [ ] 6. Implement locale-aware formatting helpers
  - [ ] 6.1 Implement `src/i18n/format.ts`
    - `formatDate` / `formatNumber` on `Intl`; valid input + locale → format for that locale; no locale → default; unsupported locale (`RangeError`) → retry default; null/undefined/unparseable → `''`; default also fails → `String(value)`; never throws
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6_

  - [ ]* 6.2 Write property test for date formatting
    - `src/i18n/format.properties.test.ts` — oracle is `Intl.DateTimeFormat` itself
    - **Property 9: Date formatting matches Intl**
    - **Validates: Requirements 8.1, 8.3**

  - [ ]* 6.3 Write property test for number formatting
    - `src/i18n/format.properties.test.ts` — oracle is `Intl.NumberFormat` itself
    - **Property 10: Number formatting matches Intl**
    - **Validates: Requirements 8.2, 8.3**

  - [ ]* 6.4 Write property test for formatting robustness
    - `src/i18n/format.properties.test.ts`
    - **Property 11: Formatting robustness**
    - **Validates: Requirements 8.4, 8.5, 8.6**

- [ ] 7. Implement the React context, provider, and hooks
  - [ ] 7.1 Implement `src/i18n/context.tsx`
    - Create `I18nContext` with a fully-initialized default value bound to `en-us` (never `undefined`)
    - `LocaleProvider` computes effective locale, validates against `SUPPORTED_LOCALES`, warns + falls back on unsupported values, derives `direction` via `directionForLocale`, memoizes `t = lookup(effectiveLocale)`, provides `{ locale, t, direction }`
    - `useI18n()` returns `{ locale, t, direction }`; `useLocale()` returns `{ locale, direction }`
    - Locale change re-renders descendants in the same commit via context value identity; nested providers resolve to nearest
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 5.5, 9.1, 9.4, 10.1, 10.2, 10.3_

  - [ ]* 7.2 Write unit/example tests for provider and hooks
    - No-provider default instance (1.2, 1.3, 5.5); nested nearest-wins (1.5); locale-change re-render + direction update (1.4, 9.4); unsupported-locale warning + default render (1.6, 10.3)
    - _Requirements: 1.2, 1.3, 1.4, 1.5, 1.6, 5.5, 9.4, 10.3_

- [ ] 8. Implement the Appian locale bridge and wire it into the provider
  - [ ] 8.1 Implement `src/i18n/appianLocale.ts` and integrate with `LocaleProvider`
    - `getAppianLocale()` with guarded (`typeof`) access + `try/catch`; returns `null` for absent/null/empty/throwing; `declare global` ambient type for optional `Appian`
    - Provider effective locale = `normalize(getAppianLocale() ?? props.locale ?? DEFAULT_LOCALE)`; invalid/unnormalizable Appian locale falls through the Requirement 2 chain
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6_

  - [ ]* 8.2 Write unit tests for the Appian bridge
    - Mock/inject global `Appian.getLocale` and assert the provider consumes it; assert `null` on empty/absent global with no throw
    - _Requirements: 6.1, 6.4, 6.5_

- [ ] 9. Author the key catalog, default bundle, registry, and public exports
  - [ ] 9.1 Create `src/i18n/keys.ts`, `src/i18n/bundles/components.properties`, registry, and `src/i18n/index.ts`
    - Typed `Translation_Key` constants for every library-owned string (paging, button.loading, field.help, field.required, progressBar.label, image.openLinked, grid.emptyMessage)
    - Adopt full-phrase interpolated Paging keys: `paging.range={0} \u2013 {1} of {2}` and `paging.rangeMany={0} \u2013 {1} of many` (plus `paging.firstPage/previousPage/nextPage/lastPage`)
    - Default `components.properties` bundle with the exact current English literals for every key (backward-compat source of truth)
    - `SUPPORTED_LOCALES = ['en-us']`, `DEFAULT_LOCALE = 'en-us'`
    - Export public API from `src/i18n/index.ts` (`LocaleProvider`, `useI18n`, `useLocale`, `formatDate`, `formatNumber`, types) and re-export from `src/index.ts` without altering existing exports
    - _Requirements: 3.1, 3.6, 4.1, 4.2, 5.3_

  - [ ]* 9.2 Write default-bundle completeness and export-stability tests
    - Assert every constant in `keys.ts` resolves to a non-key value in the default bundle (3.6); assert all pre-existing `src/index.ts` exports remain present (5.3)
    - _Requirements: 3.6, 5.3_

- [ ] 10. Checkpoint - i18n runtime complete (core + React + bridge + bundle)
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 11. Wire library-owned components to resolve strings via `t()`
  - [ ] 11.1 Externalize `Paging` strings
    - `src/components/Paging/Paging.tsx`: replace hardcoded control labels/aria/titles with `t()`; render range using the full-phrase interpolated keys (`paging.range` / `paging.rangeMany`), not concatenation
    - _Requirements: 4.1, 4.2, 5.1, 5.2_

  - [ ] 11.2 Externalize `ButtonWidget` loading label
    - `src/components/Button/ButtonWidget.tsx`: `aria-label="loading"` → `t('button.loading')`
    - _Requirements: 4.1, 4.2, 5.1, 5.2_

  - [ ] 11.3 Externalize `FieldLabel` and `StampField` labels
    - `src/components/shared/FieldLabel.tsx`: `help`/`required` aria-labels → `t('field.help')` / `t('field.required')`; `src/components/Stamp/*` help affordance → `t('field.help')`
    - _Requirements: 4.1, 4.2, 5.1, 5.2_

  - [ ] 11.4 Externalize `ProgressBar` default aria-label
    - `src/components/ProgressBar/*`: default `aria-label` "Progress" → `t('progressBar.label')` (only when consumer omits it)
    - _Requirements: 4.1, 4.2, 4.4, 5.1, 5.2_

  - [ ] 11.5 Externalize `ImageField` default aria-label
    - `src/components/Image/*`: default `aria-label` "Open linked image" → `t('image.openLinked')` (only when consumer omits it)
    - _Requirements: 4.1, 4.2, 4.4, 5.1, 5.2_

  - [ ] 11.6 Externalize `ReadOnlyGrid` empty-state message
    - `src/components/ReadOnlyGrid/*`: change `emptyGridMessage` default sentinel to `undefined`; resolve `emptyGridMessage ?? t('grid.emptyMessage')`; preserve prop name/type/behavior
    - _Requirements: 4.1, 4.3, 4.4, 5.1, 5.2_

  - [ ]* 11.7 Write no-provider backward-compatibility property test
    - `src/i18n/backwardCompat.properties.test.tsx` — `constantFrom` over the full key catalog vs authored `en-US` literals, no provider present
    - **Property 7: No-provider backward-compatibility invariance**
    - **Validates: Requirements 4.5, 5.1**

  - [ ]* 11.8 Write consumer text pass-through property test
    - `src/i18n/passthrough.properties.test.tsx` — arbitrary non-empty strings into component text props render unmodified and are not routed through lookup
    - **Property 8: Consumer text pass-through**
    - **Validates: Requirements 4.3**

- [ ] 12. Apply RTL layout in components (OPTIONAL for v1)
  - [ ]* 12.1 Consume `direction` from `useLocale()` to set `dir` and mirror layout
    - Apply `dir={direction === 'RTL' ? 'rtl' : 'ltr'}` and mirrored spacing in affected components; document the consumption pattern
    - _Requirements: 9.1_

- [ ] 13. Add Storybook locale selection
  - [ ] 13.1 Add locale toolbar and decorator in `.storybook/preview.tsx`
    - Add `globalTypes.locale` listing `SUPPORTED_LOCALES` (default `en-US`); add a decorator wrapping every story in `<LocaleProvider locale={context.globals.locale}>`
    - _Requirements: 10.4, 10.5_

- [ ] 14. Appian designer bundles and packaging validation (downstream — OPTIONAL for v1)
  - [ ]* 14.1 Author `_en_US` designer-translation bundles per component version
    - `<rule-name>_en_US.properties` with component display name and every parameter display name/description
    - _Requirements: 7.1, 7.2, 7.4, 7.5_

  - [ ]* 14.2 Add packaging-validation step enforcing the `_en_US` designer bundle
    - Build-pipeline check that fails the build and identifies any component version missing a complete `_en_US` designer bundle
    - _Requirements: 7.3_

- [ ] 15. Final verification
  - Run `pnpm run typecheck`, `pnpm run lint`, and `pnpm test` (Vitest `--run`); ensure the full suite (including the pre-existing component tests) passes. Fix any failures before considering the work complete.

## Notes

- Tasks marked with `*` are optional: test sub-tasks, RTL layout application (task 12), and the downstream Appian designer/packaging work (task 14). Computing/exposing `Text_Direction` (tasks 5 and 7) is core and not optional.
- Each task references the specific requirement clauses it implements; property test sub-tasks reference their design Property number for traceability.
- Property tests use `fast-check` at ≥100 iterations and are colocated as `*.properties.test.ts(x)`. P9/P10 use `Intl` as the oracle rather than asserting brittle literal output.
- Checkpoints (tasks 4, 10) provide incremental validation; the final verification (task 15) is the project's typecheck + lint + test gate, which also guards Requirement 5.2 (no prop removed/renamed).
- Backward compatibility is preserved throughout: default sentinels become `undefined` and resolve library defaults via `t()`; consumer-supplied text always passes through untouched.

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1"] },
    { "id": 1, "tasks": ["1.2", "2.1", "5.1", "6.1"] },
    { "id": 2, "tasks": ["2.2", "3.1", "5.2", "6.2"] },
    { "id": 3, "tasks": ["2.3", "3.2", "6.3"] },
    { "id": 4, "tasks": ["3.3", "6.4", "7.1"] },
    { "id": 5, "tasks": ["3.4", "8.1", "9.1"] },
    { "id": 6, "tasks": ["7.2", "8.2", "9.2", "11.1", "11.2", "11.3", "11.4", "11.5", "11.6"] },
    { "id": 7, "tasks": ["11.7", "11.8", "12.1", "13.1", "14.1"] },
    { "id": 8, "tasks": ["14.2"] }
  ]
}
```
