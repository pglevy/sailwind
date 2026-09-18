import { render, cleanup } from '@testing-library/react'
import { afterEach, describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import { KEYS } from '../i18n'
import { ReadOnlyGrid } from '../components/ReadOnlyGrid'
import { ProgressBar } from '../components/ProgressBar'

// =============================================================================
// Feature: component-i18n, Property 8: Consumer text pass-through
// Validates: Requirements 4.3
//
// For any NON-EMPTY consumer-supplied text passed to a component text property,
// the component renders that text exactly as supplied and does NOT route it
// through I18nLookup. The rendered output equals the input even when the input
// happens to coincide with a Translation_Key identifier or with an authored
// en-US default value — proving the string is passed through untouched rather
// than looked up.
//
// These tests render each component WITHOUT any LocaleProvider (active locale
// defaults to en-us); pass-through must hold regardless of the active locale.
// =============================================================================

// Clean up the rendered DOM between fast-check runs so container-scoped queries
// never collide with a tree left mounted by a previous iteration or a shrink.
afterEach(cleanup)

// The dotted Translation_Key values every library-owned string resolves through
// (e.g. 'grid.emptyMessage', 'progressBar.label'). If a component erroneously
// routed consumer text through I18nLookup, supplying one of these would render
// the looked-up value instead of the literal — so passing them through unchanged
// is the discriminating evidence.
const TRANSLATION_KEY_VALUES: string[] = Object.values(KEYS)

// Authored en-US default literals for the components exercised here. Supplying
// these proves the consumer value is rendered even when it equals the library
// default the component would otherwise resolve when the prop is omitted.
const AUTHORED_DEFAULTS: string[] = ['No items available', 'Progress']

// Core generator: arbitrary non-empty text, plus explicit collisions with
// Translation_Key identifiers and authored default values. Non-empty is the
// core input space (empty/absent props fall back to the library default and are
// out of scope for pass-through).
const arbConsumerText: fc.Arbitrary<string> = fc.oneof(
  fc.string({ minLength: 1 }),
  fc.constantFrom(...TRANSLATION_KEY_VALUES),
  fc.constantFrom(...AUTHORED_DEFAULTS),
)

describe('Feature: component-i18n, Property 8: Consumer text pass-through', () => {
  // ReadOnlyGrid.emptyGridMessage is the clearest pass-through-vs-default case:
  // with no rows the empty-state div renders `emptyGridMessage ?? t('grid.emptyMessage')`,
  // so a supplied value must appear verbatim and must not be looked up.
  it('renders ReadOnlyGrid.emptyGridMessage exactly as supplied, without lookup', () => {
    fc.assert(
      fc.property(arbConsumerText, (consumerText) => {
        const { container } = render(
          <ReadOnlyGrid data={[]} emptyGridMessage={consumerText} />,
        )
        try {
          const messageEl = container.querySelector('div.py-4.text-center')
          expect(messageEl).not.toBeNull()
          // Exact, unnormalized text — read the rendered text node directly.
          expect(messageEl?.textContent).toBe(consumerText)
        } finally {
          cleanup()
        }
      }),
      {
        numRuns: 100,
        // Guarantee the discriminating collisions are always exercised: a
        // Translation_Key value ('grid.emptyMessage') proves lookup is bypassed;
        // the authored default ('No items available') and unrelated tokens round
        // out the coincidental cases.
        examples: [
          ['grid.emptyMessage'],
          ['No items available'],
          ['paging.firstPage'],
          ['Progress'],
        ],
      },
    )
  }, 30000)

  // ProgressBar resolves its aria-label as `accessibilityText || label || t('progressBar.label')`.
  // A supplied accessibilityText must surface verbatim on the rendered
  // progressbar's aria-label and must not be routed through I18nLookup.
  it('renders ProgressBar accessibilityText verbatim as the aria-label, without lookup', () => {
    fc.assert(
      fc.property(arbConsumerText, (consumerText) => {
        const { container } = render(
          <ProgressBar percentage={50} accessibilityText={consumerText} />,
        )
        try {
          const bar = container.querySelector('[role="progressbar"]')
          expect(bar).not.toBeNull()
          expect(bar?.getAttribute('aria-label')).toBe(consumerText)
        } finally {
          cleanup()
        }
      }),
      {
        numRuns: 100,
        examples: [
          ['progressBar.label'],
          ['Progress'],
          ['grid.emptyMessage'],
          ['No items available'],
        ],
      },
    )
  }, 30000)
})
