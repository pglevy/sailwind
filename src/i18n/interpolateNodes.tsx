import { Fragment, type ReactNode } from 'react'

/**
 * Matches positional placeholders of the form `{n}` where `n` is a non-negative
 * integer (`{0}`, `{1}`, `{2}`, …), with the digits captured so the surrounding
 * literal text is preserved by `String.prototype.split`.
 */
const PLACEHOLDER_PATTERN = /\{(\d+)\}/

/**
 * The node-aware counterpart to the string `t()` interpolation performed by
 * `interpolate()` in `I18nLookup.ts`.
 *
 * `t()` only ever produces a `string`, which is enough when every substituted
 * value is itself plain text. It is NOT enough when a placeholder needs to be a
 * styled or otherwise non-text React value — for example the bold "start – end"
 * page range in `Paging`, which must render as a `<span className="font-bold">`
 * element nested inside a larger translatable phrase (`"{0} of {1}"`). String
 * concatenation around a `t()` call would restore that styling at the cost of
 * hardcoding word order outside the translation, defeating the point of
 * externalizing the phrase. `interpolateNodes` instead takes the *resolved
 * template string* (call `t(key)` with no args so its `{n}` placeholders are
 * left intact) and substitutes React nodes into it directly, so a single
 * translatable phrase still controls word order while individual placeholders
 * can carry arbitrary React content.
 *
 * Behavior mirrors the string interpolation's missing-argument semantics: a
 * placeholder is substituted only when `args[index]` is provided (`index` is
 * within bounds and the value is not `undefined`); otherwise the literal
 * `{index}` token is left unchanged in the output.
 *
 * @param template - A resolved translation string containing positional `{n}`
 *   placeholders (typically `t(key)` called with no interpolation arguments).
 * @param args - React nodes to substitute for each `{n}` placeholder, indexed
 *   positionally (`args[0]` fills `{0}`, `args[1]` fills `{1}`, …).
 * @returns An array of `ReactNode`s — literal text segments interleaved with
 *   the substituted nodes — each carrying a stable `key` so the array can be
 *   rendered directly (e.g. `<span>{interpolateNodes(...)}</span>`) without
 *   React key warnings.
 */
export function interpolateNodes(template: string, args: ReactNode[]): ReactNode[] {
  const parts = template.split(PLACEHOLDER_PATTERN)
  const result: ReactNode[] = []

  for (let i = 0; i < parts.length; i++) {
    // Even indices are literal text segments produced by `split`; odd indices
    // are the captured `{n}` digit strings.
    if (i % 2 === 0) {
      const literal = parts[i]
      if (literal) {
        result.push(<Fragment key={`literal-${i}`}>{literal}</Fragment>)
      }
      continue
    }

    const index = Number(parts[i])
    const arg = args[index]

    if (index < args.length && arg !== undefined) {
      result.push(<Fragment key={`arg-${i}`}>{arg}</Fragment>)
    } else {
      result.push(<Fragment key={`missing-${i}`}>{`{${parts[i]}}`}</Fragment>)
    }
  }

  return result
}
