# Requirements Document

## Introduction

This feature adds internationalization (i18n) support to the Sailwind React component library so that the library can be packaged and deployed as an Appian Component Plug-in with full multi-language support. Today, user-facing text inside Sailwind components (pagination controls, empty states, "loading", "help", "required", tooltips, aria-labels, and locale-driven formatting for dates and numbers) is hardcoded in English. This feature introduces a locale-aware translation layer that mirrors the proven approach used by the internal Appian `ui-library` (`I18nLookup` + `.properties` bundles) and conforms to Appian's Component Plug-in Internationalization conventions.

The design goal is twofold: (1) make all user-facing component text translatable and locale-aware, and (2) preserve full backward compatibility so existing consumers who never set a locale continue to see English (`en-US`) output with no code changes.

This document covers the runtime i18n behavior of the library. Physical packaging of the component as an Appian plug-in (deployment descriptors, ZIP structure) is referenced where it constrains the design but is treated as a downstream concern.

## Glossary

- **I18n_System**: The internationalization subsystem added to Sailwind, comprising the locale context/provider, the lookup function, the bundle loader, and formatting helpers.
- **Locale_Provider**: The React context provider that supplies the active locale to descendant Sailwind components.
- **I18n_Lookup**: The translation resolution function that maps a translation key plus the active locale to a translated string, applying fallback and interpolation.
- **Translation_Bundle**: The in-memory map of locale code to key/value translation pairs, assembled from `.properties` files.
- **Bundle_Loader**: The function that assembles a Translation_Bundle from a set of `.properties` source files.
- **Translation_Key**: A stable string identifier for a piece of user-facing text (e.g., `paging.firstPage`).
- **Locale_Code**: A language/region identifier. Two forms are relevant: the Appian form (e.g., `en-US`, `es`, `ar`) and the normalized internal form (lowercase, hyphen-separated, e.g., `en-us`).
- **Default_Locale**: The fallback locale `en-US` (normalized `en-us`), which every component version must fully support.
- **Designer_Translation**: Text shown to Appian designers (component name/description, parameter names/descriptions) supplied via Appian-standard `<rule-name>_<language_code>.properties` bundles.
- **User_Translation**: Text rendered to end users of a component, managed by the I18n_System.
- **Formatting_Helper**: A locale-aware helper for formatting dates, times, and numbers.
- **Text_Direction**: The reading direction implied by a locale, either left-to-right (`LTR`) or right-to-left (`RTL`).
- **Consumer**: A developer or environment using Sailwind, including Storybook, standalone prototypes, and the Appian runtime.

## Requirements

### Requirement 1: Locale Context and Provider

**User Story:** As a Sailwind consumer, I want to set an active locale once at the application root, so that all Sailwind components render text and formats for that locale without per-component configuration.

#### Acceptance Criteria

1. THE I18n_System SHALL expose a Locale_Provider React component that accepts a single Locale_Code value and makes that Locale_Code available to all descendant Sailwind components at any nesting depth.
2. WHERE no Locale_Provider encloses a Sailwind component, THE I18n_System SHALL resolve the active locale for that component to the Default_Locale.
3. THE I18n_System SHALL expose a React hook that returns the active Locale_Code and a translation function bound to that Locale_Code, and WHERE the hook is invoked outside any Locale_Provider, THE I18n_System SHALL return the Default_Locale and a translation function bound to the Default_Locale.
4. WHEN the Locale_Code supplied to the Locale_Provider changes to a different value, THE I18n_System SHALL re-render all descendant Sailwind components using the new Locale_Code within the same render cycle in which the change is applied, with no descendant retaining the prior Locale_Code.
5. WHERE a Consumer nests one Locale_Provider inside another, THE I18n_System SHALL resolve the active Locale_Code for a given component to the Locale_Code of the nearest enclosing Locale_Provider.
6. IF the Locale_Code supplied to the Locale_Provider is not a supported Locale_Code, THEN THE I18n_System SHALL resolve the active locale to the Default_Locale, continue rendering without interrupting the component tree, and emit a warning indication identifying the unsupported Locale_Code.
7. IF the translation function is invoked with a translation key that has no entry for the active Locale_Code, THEN THE I18n_System SHALL return the corresponding text for the Default_Locale, and IF no entry exists for the Default_Locale either, THEN THE I18n_System SHALL return the requested translation key and emit a warning indication identifying the missing key and Locale_Code.

### Requirement 2: Translation Lookup and Fallback

**User Story:** As a component author, I want a lookup function that resolves a key to translated text with predictable fallback, so that components always render meaningful text even when a translation is missing.

#### Acceptance Criteria

1. WHEN the I18n_Lookup receives a Translation_Key and the active Locale_Code has an exact-match entry for that key, THE I18n_Lookup SHALL return the value for the exact Locale_Code.
2. IF no exact Locale_Code match exists, THEN THE I18n_Lookup SHALL return the value for the language-only Locale_Code derived from the active Locale_Code (for example, `en` derived from `en-us`).
3. IF neither an exact nor a language-only match exists, THEN THE I18n_Lookup SHALL return the value for the Default_Locale.
4. IF no match exists for the exact Locale_Code, the language-only Locale_Code, or the Default_Locale, THEN THE I18n_Lookup SHALL return the Translation_Key unchanged.
5. IF the supplied Translation_Key is empty or is not provided, THEN THE I18n_Lookup SHALL return an empty string without attempting locale matching.
6. THE I18n_Lookup SHALL normalize Locale_Codes before matching by trimming leading and trailing whitespace, converting underscores to hyphens, and converting all characters to lowercase.
7. WHEN a resolved translated value contains one or more positional placeholders of the form `{n}`, where n is a non-negative integer (0, 1, 2, and continuing sequentially), THE I18n_Lookup SHALL replace every occurrence of each placeholder with the string representation of the argument supplied at the corresponding zero-based index.
8. IF a positional placeholder `{n}` has no argument supplied at index n, or the argument at index n is null or undefined, THEN THE I18n_Lookup SHALL leave that placeholder token unchanged in the returned string.

### Requirement 3: Bundle Format and Naming

**User Story:** As a component author, I want translation strings defined in Appian-convention `.properties` files, so that the same bundles serve both Sailwind runtime and Appian plug-in packaging.

#### Acceptance Criteria

1. THE I18n_System SHALL source User_Translation strings from `.properties` files whose names follow the pattern `<BundleName>_<locale>.properties`.
2. THE Bundle_Loader SHALL derive the Locale_Code for each file from the `_<locale>` suffix, where the suffix matches a two-letter ISO language code with an optional underscore-separated two-letter region code (for example, `en` or `en_US`).
3. THE Bundle_Loader SHALL normalize each derived Locale_Code by converting underscores to hyphens and converting to lowercase before adding entries to the Translation_Bundle.
4. WHERE a `.properties` file contains a key whose name includes the marker `.##CONTEXT##`, THE Bundle_Loader SHALL exclude that key from the Translation_Bundle.
5. THE I18n_System SHALL interpret non-ASCII characters expressed as escaped Unicode sequences (for example, `\u00FC`) in `.properties` values as their corresponding Unicode characters.
6. THE I18n_System SHALL provide a Default_Locale bundle, named `<BundleName>.properties` without a locale suffix, that contains an entry for every Translation_Key referenced by any component.
7. IF a `.properties` file name does not match the pattern `<BundleName>_<locale>.properties`, or its `_<locale>` suffix does not match a two-letter language code with an optional two-letter region code, THEN THE Bundle_Loader SHALL exclude that file from all Translation_Bundles and continue loading the remaining files without terminating.
8. IF a `.properties` value contains a malformed escaped Unicode sequence with fewer than four hexadecimal digits following `\u`, THEN THE I18n_System SHALL retain the literal characters of that sequence unchanged and continue processing the remaining entries.

### Requirement 4: Component Text Externalization

**User Story:** As an end user in a non-English locale, I want the built-in text inside Sailwind components to appear in my language, so that the interface is understandable.

#### Acceptance Criteria

1. THE I18n_System SHALL resolve all library-owned user-facing strings through the I18n_Lookup rather than as hardcoded literals, including pagination control labels, the loading indicator label, the help affordance label, the required-field indicator label, and empty-state text.
2. THE I18n_System SHALL resolve library-owned accessibility text, including `aria-label` values that the library generates, through the I18n_Lookup.
3. WHERE a Consumer supplies non-empty text for a component property (for example, `label`, `placeholder`, or `tooltip`), THE I18n_System SHALL render the Consumer-supplied text without modification and SHALL NOT resolve that text through the I18n_Lookup.
4. WHERE a Consumer omits text for a component property that has a library-owned default, THE I18n_System SHALL resolve and render the library-owned default string through the I18n_Lookup.
5. WHEN a component renders a library-owned string and no active locale is set, THE I18n_System SHALL render the Default_Locale value for that string.
6. IF a component renders a library-owned string and the active locale has no translation entry for that string, THEN THE I18n_System SHALL render the Default_Locale value for that string.

### Requirement 5: Backward Compatibility

**User Story:** As an existing Sailwind consumer, I want my current code to keep working unchanged, so that adopting the library upgrade carries no migration cost when I do not need other languages.

#### Acceptance Criteria

1. WHERE a Consumer renders Sailwind components without a Locale_Provider present in the component tree, THE I18n_System SHALL render user-facing text strings that are character-for-character identical to the strings the same components rendered in the library version immediately preceding this feature.
2. THE I18n_System SHALL preserve every existing public prop of all components such that each prop retains its prior name, accepted value type, default value, and observable rendering behavior, with zero props removed or renamed.
3. WHEN a Consumer imports any component using an import path that was valid in the library version immediately preceding this feature, THE I18n_System SHALL resolve that import to the same component export from the same path.
4. IF a Consumer supplies a locale value that is absent, empty, or not among the supported locales, THEN THE I18n_System SHALL render Default_Locale text and SHALL complete rendering without raising an error to the Consumer.
5. WHERE no Locale_Provider is present in the component tree, THE I18n_System SHALL apply the Default_Locale as the active locale.

### Requirement 6: Appian Locale Integration

**User Story:** As an Appian plug-in integrator, I want the library to adopt the end user's Appian language automatically, so that components match the platform locale at runtime.

#### Acceptance Criteria

1. WHERE the library runs inside the Appian client, WHEN the library initializes, THE I18n_System SHALL obtain the active Locale_Code from the Appian-provided locale value returned by `Appian.getLocale()`.
2. WHEN the I18n_System obtains an Appian Locale_Code, THE I18n_System SHALL normalize it to the internal Locale_Code form, treating the language and region subtags case-insensitively (for example, `en-US` and `es` both resolve to their internal Locale_Code form), before performing Translation_Bundle lookup.
3. IF the Appian Locale_Code identifies a language the Translation_Bundle does not support, THEN THE I18n_System SHALL resolve text using the fallback order defined in Requirement 2.
4. WHERE the library runs outside the Appian client, THE I18n_System SHALL obtain the active Locale_Code from the Locale_Provider.
5. WHERE the library runs inside the Appian client, IF the Appian-provided locale value is unavailable, null, or an empty string when the library initializes, THEN THE I18n_System SHALL resolve text using the fallback order defined in Requirement 2.
6. IF an obtained Appian Locale_Code cannot be normalized to a valid internal Locale_Code form, THEN THE I18n_System SHALL resolve text using the fallback order defined in Requirement 2.

### Requirement 7: Designer-Facing Translations

**User Story:** As an Appian designer, I want component and parameter names and descriptions shown in my design-time language, so that I can configure the component in my own language.

#### Acceptance Criteria

1. THE I18n_System SHALL define Designer_Translation strings for the component display name, each parameter display name, and each parameter description in Appian-standard bundles named `<rule-name>_<language_code>.properties`.
2. THE I18n_System SHALL provide, for each component version, a Default_Locale Designer_Translation bundle named with the `_en_US` suffix that contains a string entry for the component display name and for every parameter display name and parameter description exposed by that component version.
3. IF a component version folder omits its Default_Locale (`_en_US`) Designer_Translation bundle, THEN THE I18n_System SHALL treat the packaging as invalid and surface a deployment-blocking condition that identifies the component version missing the bundle and prevents the deployment from completing.
4. WHEN a designer's design-time language code has no matching Designer_Translation bundle for a component version, THE I18n_System SHALL display the Default_Locale (`_en_US`) Designer_Translation strings for that component version.
5. IF a Designer_Translation bundle matching the designer's design-time language omits a string entry for the component display name, a parameter display name, or a parameter description, THEN THE I18n_System SHALL display the corresponding Default_Locale (`_en_US`) string entry for that missing item.

### Requirement 8: Locale-Aware Formatting

**User Story:** As an end user, I want dates and numbers formatted according to my locale, so that values read naturally in my language and region.

#### Acceptance Criteria

1. WHEN a Formatting_Helper receives a valid date value and an active Locale_Code is set, THE Formatting_Helper SHALL return the date formatted according to that Locale_Code using the Intl API.
2. WHEN a Formatting_Helper receives a valid numeric value and an active Locale_Code is set, THE Formatting_Helper SHALL return the number formatted according to that Locale_Code using the Intl API.
3. WHILE no active Locale_Code is set, WHEN a Formatting_Helper receives a valid value, THE Formatting_Helper SHALL return the value formatted using the Default_Locale.
4. IF a Formatting_Helper receives a value and the active Locale_Code is unrecognized or unsupported by the Intl API, THEN THE Formatting_Helper SHALL return the value formatted using the Default_Locale.
5. IF a Formatting_Helper receives a value that is null, undefined, or that cannot be parsed as the expected type (a date for date formatting or a number for number formatting), THEN THE Formatting_Helper SHALL return an empty string without throwing an error.
6. IF a value cannot be formatted using either the active Locale_Code or the Default_Locale, THEN THE Formatting_Helper SHALL return the value's default string representation without throwing an error.

### Requirement 9: Text Direction

**User Story:** As an end user of a right-to-left language, I want components laid out in my reading direction, so that the interface is usable.

#### Acceptance Criteria

1. THE I18n_System SHALL make the Text_Direction implied by the active Locale_Code available to all descendant Sailwind components at all times.
2. WHERE the active Locale_Code identifies a right-to-left language, THE I18n_System SHALL report the Text_Direction as `RTL`.
3. WHERE the active Locale_Code identifies a left-to-right language, THE I18n_System SHALL report the Text_Direction as `LTR`.
4. WHEN the active Locale_Code changes, THE I18n_System SHALL update the reported Text_Direction to match the new Locale_Code before the next render of descendant Sailwind components.
5. IF the active Locale_Code is absent or does not resolve to a known left-to-right or right-to-left language, THEN THE I18n_System SHALL report the Text_Direction as `LTR`.

### Requirement 10: Consumer and Storybook Locale Selection

**User Story:** As a designer building prototypes, I want to switch locales in Storybook and standalone prototypes, so that I can preview components in different languages.

#### Acceptance Criteria

1. WHEN a Consumer wraps content in the Locale_Provider with a supported Locale_Code, THE I18n_System SHALL set the active Locale_Code for all descendant components.
2. IF content is rendered without an enclosing Locale_Provider, THEN THE I18n_System SHALL apply the Default_Locale.
3. IF a Consumer supplies a Locale_Code that is not among the supported Locale_Codes, THEN THE I18n_System SHALL fall back to the Default_Locale and continue rendering without throwing an error.
4. WHERE Storybook is running, THE I18n_System SHALL present a locale selector listing every supported Locale_Code and SHALL render the active story under the selected Locale_Code, defaulting to the Default_Locale when no selection has been made.
5. WHEN a Consumer changes the selected Locale_Code in Storybook, THE I18n_System SHALL re-render all previewed components using the newly selected Locale_Code within 1 second.
6. IF a translated string is unavailable for the active Locale_Code, THEN THE I18n_System SHALL render the corresponding string from the Default_Locale.
