/**
 * Unit / example tests for the Appian locale bridge (task 8.2).
 *
 * Feature: component-i18n
 * Validates: Requirements 6.1, 6.4, 6.5, 6.6
 *
 * These are example-based unit tests (not property tests). They exercise
 * `getAppianLocale()` directly against an injected global `Appian` object and
 * confirm that the `LocaleProvider` consumes the Appian-provided locale through
 * its normal fallback chain (`getAppianLocale() ?? props.locale ?? DEFAULT_LOCALE`).
 *
 * Notes on construction:
 * - This file is `.ts` (per the task), so it cannot use JSX. Elements are built
 *   with `createElement` instead — behaviorally identical for React Testing
 *   Library. A small `LocaleProbe` component reads `useI18n()` and exposes the
 *   active locale via a `data-testid` so the provider's resolved value can be
 *   asserted from the DOM.
 * - The global `Appian` object is injected/cleared via `(globalThis as any)` so
 *   tests can set an arbitrary (including throwing) `getLocale` without matching
 *   the ambient type, and `afterEach` deletes it so no test leaks into another.
 * - v1 supports only `'en-us'`. `'en-US'` normalizes to `'en-us'`, which IS
 *   supported, so no unsupported-locale warning fires on these paths. We stub
 *   `console.warn` and assert it is NOT called for the `en-US` case rather than
 *   asserting on unstubbed console output.
 */

import { describe, it, expect, afterEach, vi } from 'vitest'
import { createElement } from 'react'
import type { ReactElement } from 'react'
import { render, screen } from '@testing-library/react'
import { getAppianLocale } from './appianLocale'
import { LocaleProvider, useI18n } from './context'
import { DEFAULT_LOCALE } from './keys'

/**
 * A minimal probe that surfaces the active locale resolved by the nearest
 * enclosing `LocaleProvider` (or the default instance) so a test can assert on
 * the value the provider actually consumed.
 */
function LocaleProbe(): ReactElement {
  const { locale } = useI18n()
  return createElement('span', { 'data-testid': 'active-locale' }, locale)
}

afterEach(() => {
  // Clear the injected global so it never leaks into another test.
  delete (globalThis as { Appian?: unknown }).Appian
  // Restore any console spies created within a test.
  vi.restoreAllMocks()
})

describe('getAppianLocale + LocaleProvider (Appian bridge)', () => {
  it('reads Appian.getLocale() and the provider consumes it (normalized) — Req 6.1', () => {
    ;(globalThis as { Appian?: unknown }).Appian = {
      getLocale: () => 'en-US',
    }

    // The bridge returns the raw Appian value (normalization happens in the provider).
    expect(getAppianLocale()).toBe('en-US')

    // Any unsupported-locale warning would go through console.warn; stub it so we
    // can assert the supported 'en-us' path does not warn.
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

    // No `locale` prop: the provider must fall back to the Appian value first.
    render(createElement(LocaleProvider, null, createElement(LocaleProbe)))

    // 'en-US' -> normalized 'en-us', which is supported => consumed as-is, no warning.
    expect(screen.getByTestId('active-locale').textContent).toBe('en-us')
    expect(warnSpy).not.toHaveBeenCalled()
  })

  it('returns null and does not throw when no global Appian exists; provider falls back — Req 6.4, 6.5', () => {
    // No global Appian injected (afterEach guarantees it is absent here).
    expect(() => getAppianLocale()).not.toThrow()
    expect(getAppianLocale()).toBeNull()

    // With the bridge yielding null, the provider falls back to its `locale`
    // prop, then the Default_Locale. 'en-US' normalizes to the default 'en-us'.
    render(
      createElement(
        LocaleProvider,
        { locale: 'en-US' },
        createElement(LocaleProbe)
      )
    )

    expect(screen.getByTestId('active-locale').textContent).toBe(DEFAULT_LOCALE)
  })

  it('returns null when Appian.getLocale() yields an empty string — Req 6.5', () => {
    ;(globalThis as { Appian?: unknown }).Appian = {
      getLocale: () => '',
    }

    expect(getAppianLocale()).toBeNull()
  })

  it('returns null and does not throw when Appian.getLocale() throws — Req 6.6', () => {
    ;(globalThis as { Appian?: unknown }).Appian = {
      getLocale: () => {
        throw new Error('Appian runtime unavailable')
      },
    }

    expect(() => getAppianLocale()).not.toThrow()
    expect(getAppianLocale()).toBeNull()
  })
})
