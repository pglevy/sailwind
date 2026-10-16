import type { I18nBundle, I18nLookupFunction } from './types'
import { I18nLookup } from './I18nLookup'
import { normalizeLocale } from './normalizeLocale'

/**
 * The normalized Default_Locale. A suffix-less `<BundleName>.properties` file is
 * keyed here (Requirement 3.6). Kept local to this module so the loader has no
 * dependency on the (later-authored) key catalog / registry.
 */
const DEFAULT_LOCALE = 'en-us'

/** The `.properties` filename suffix. */
const PROPERTIES_SUFFIX = '.properties'

/** Marker whose presence in a key excludes that entry (Requirement 3.4). */
const CONTEXT_MARKER = '.##CONTEXT##'

/**
 * Derives the locale for a bundle from its `_<locale>` suffix: a two-letter
 * lowercase language code with an optional underscore-separated two-letter
 * uppercase region code (`_en`, `_en_US`). The suffix is normalized to internal
 * form (`_`→`-`, lowercase) elsewhere via {@link normalizeLocale}.
 */
const LOCALE_SUFFIX_PATTERN = /_([a-z]{2}(?:_[A-Z]{2})?)\.properties$/

/**
 * Decode `\uXXXX` escape sequences in a `.properties` value to their Unicode
 * characters (Requirement 3.5). Only well-formed sequences — `\u` followed by
 * exactly four hexadecimal digits — are decoded; a malformed sequence with
 * fewer than four hex digits does not match the pattern and is therefore left
 * literal, with processing continuing over the rest of the value
 * (Requirement 3.8).
 */
function decodeUnicodeEscapes(value: string): string {
  if (value.indexOf('\\u') === -1) {
    return value
  }
  return value.replace(/\\u([0-9a-fA-F]{4})/g, (_match, hex: string) =>
    String.fromCharCode(parseInt(hex, 16))
  )
}

/**
 * Minimal `.properties` parser (no external dependency).
 *
 * Rules:
 * - Split on newlines (`\n` or `\r\n`).
 * - Ignore blank lines and comment lines beginning with `#` or `!`.
 * - Split each entry on the first `=` or `:` separator; trim the key and
 *   preserve the value verbatim (aside from Unicode decoding). A line with no
 *   separator is treated as a bare key with an empty value.
 * - Decode `\uXXXX` escapes in the value (Requirement 3.5, 3.8).
 * - Exclude any key containing the `.##CONTEXT##` marker (Requirement 3.4).
 * - Duplicate keys within a file follow last-write-wins.
 *
 * Never throws: non-string content yields an empty map.
 */
function parseProperties(content: string): Record<string, string> {
  const result: Record<string, string> = {}
  if (typeof content !== 'string') {
    return result
  }

  const lines = content.split(/\r?\n/)
  for (const line of lines) {
    const trimmedLine = line.trim()
    // Skip blank lines and `#` / `!` comments.
    if (
      trimmedLine === '' ||
      trimmedLine.startsWith('#') ||
      trimmedLine.startsWith('!')
    ) {
      continue
    }

    // Split on the first `=` or `:` separator.
    const eqIndex = line.indexOf('=')
    const colonIndex = line.indexOf(':')
    let sepIndex: number
    if (eqIndex === -1) {
      sepIndex = colonIndex
    } else if (colonIndex === -1) {
      sepIndex = eqIndex
    } else {
      sepIndex = Math.min(eqIndex, colonIndex)
    }

    let key: string
    let rawValue: string
    if (sepIndex === -1) {
      // No separator: treat the whole (trimmed) line as a bare key.
      key = trimmedLine
      rawValue = ''
    } else {
      key = line.slice(0, sepIndex).trim()
      rawValue = line.slice(sepIndex + 1)
    }

    if (key === '' || key.includes(CONTEXT_MARKER)) {
      continue
    }

    // Last-write-wins on duplicate keys.
    result[key] = decodeUnicodeEscapes(rawValue)
  }

  return result
}

/**
 * Derive the normalized Locale_Code a bundle file contributes to, or `null` if
 * the file should be skipped (Requirement 3.2, 3.3, 3.6, 3.7).
 *
 * - `<BundleName>_<locale>.properties` → the normalized `<locale>`.
 * - `<BundleName>.properties` (no `_<locale>` suffix) → the Default_Locale
 *   (`en-us`).
 * - A filename with a `_<suffix>` that does not match the language/region
 *   pattern, or that is not a `.properties` file at all → `null` (skipped).
 */
function deriveLocale(fileName: string): string | null {
  const localeMatch = fileName.match(LOCALE_SUFFIX_PATTERN)
  if (localeMatch) {
    return normalizeLocale(localeMatch[1])
  }

  // Suffix-less default bundle: `<BundleName>.properties` with no `_` part.
  if (fileName.endsWith(PROPERTIES_SUFFIX)) {
    const base = fileName.slice(0, -PROPERTIES_SUFFIX.length)
    if (base.length > 0 && !base.includes('_')) {
      return DEFAULT_LOCALE
    }
  }

  // A malformed `_<suffix>` or a non-`.properties` file: skip and continue.
  return null
}

/**
 * Assemble a Translation_Bundle from a map of `.properties` file paths to raw
 * file contents, and return a lookup bound to it.
 *
 * This is the injectable core of the loader — accepting the file map as a
 * parameter (rather than reading `import.meta.glob` directly) keeps it pure and
 * unit-testable with fabricated inputs. The module-level {@link lookup} export
 * wires it to the real Vite glob below.
 *
 * Loader behavior:
 * - Each file's locale is derived via {@link deriveLocale}; files that do not
 *   match the naming pattern are skipped and loading continues over the rest
 *   (Requirement 3.7).
 * - A suffix-less `<BundleName>.properties` is keyed under the Default_Locale
 *   (`en-us`) (Requirement 3.6).
 * - Each file's contents are parsed via {@link parseProperties}: comments and
 *   blank lines ignored, `\uXXXX` escapes decoded (Requirement 3.5, 3.8), and
 *   `.##CONTEXT##` keys excluded (Requirement 3.4).
 * - Keys are merged into the per-locale map with last-write-wins semantics,
 *   both within a file and across files that resolve to the same locale.
 *
 * Never throws for any input, including an empty map (Requirement 3.7).
 *
 * @param files - Map of file path → raw `.properties` text (e.g., the eager
 *   output of `import.meta.glob`).
 * @returns An {@link I18nLookupFunction} bound to the assembled bundle.
 *
 * _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8_
 */
export function loadI18nBundle(
  files: Record<string, string>
): I18nLookupFunction {
  const bundle: I18nBundle = {}

  for (const [path, content] of Object.entries(files)) {
    const fileName = path.slice(path.lastIndexOf('/') + 1)
    const locale = deriveLocale(fileName)
    if (locale === null) {
      continue
    }

    const parsed = parseProperties(content)
    const target = bundle[locale] ?? (bundle[locale] = {})
    for (const [key, value] of Object.entries(parsed)) {
      // Last-write-wins across files resolving to the same locale.
      target[key] = value
    }
  }

  return I18nLookup(bundle)
}

/**
 * Eagerly import every co-located bundle as raw text at build time. Vite
 * resolves this glob at compile time; it may currently match zero files (the
 * default bundle is authored in a later task), which the loader handles by
 * producing an empty Translation_Bundle.
 */
const bundleFiles = import.meta.glob('./bundles/*.properties', {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string>

/**
 * The lookup bound to the library's real, co-located bundles. Consumed by the
 * `LocaleProvider` to build a locale-bound translation function.
 */
export const lookup: I18nLookupFunction = loadI18nBundle(bundleFiles)
