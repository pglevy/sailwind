import * as React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { SAILMarginSize } from '../../types/sail'
import { useI18n, useLocale, KEYS } from '../../i18n'
import { mergeClasses } from '../../utils/classNames'
import { resolveColorClass } from '../../utils/colorResolver'
import { marginAboveMap, marginBelowMap } from '../../utils/sailMaps'

/**
 * Character shown between breadcrumb items. Not in SAIL.
 * - SLASH: "/" (matches the SAIL breadcrumbs pattern)
 * - CHEVRON: a chevron icon that points toward the current page
 */
export type BreadcrumbsSeparator = "SLASH" | "CHEVRON"

/**
 * One level in the breadcrumb hierarchy.
 */
export interface BreadcrumbItem {
  /** Display text for this level. Text that is empty after trimming hides the level. */
  text: string
  /**
   * Where this level navigates to. A string renders a standard link with that
   * `href` (like TagItem's `link`). A function runs on click (like TextItem's
   * `link`), for prototypes that navigate with state or a router.
   * An empty string counts as no link, so the level renders as plain text.
   * Ignored on the last visible item, which is always the current page.
   *
   * Function links render `href="#"` (like TextItem) and only intercept plain
   * primary clicks and keyboard activation. Cmd/Ctrl/Shift/Alt-click and
   * middle-click are left to the browser, so the function does not run and the
   * browser opens its default new tab or window at `#`. Use a string link when
   * a real destination matters.
   *
   * Focus: when activating a function link makes that item the last visible
   * one (for example, `items` shrinks to end at the clicked level), the item
   * is re-rendered as the current page and the focused link would be removed.
   * The current page then receives focus so keyboard and screen reader users
   * keep their place. Focus only moves after a function link was activated and
   * only if focus would otherwise be lost. It never moves on mount, and string
   * links behave as normal anchors with no focus management.
   */
  link?: string | (() => void)
  /** Whether to show this item. Default: true */
  showWhen?: boolean
}

/**
 * Props for the BreadcrumbsField component.
 * Not in SAIL as a component: SAIL builds breadcrumbs from a rich text field
 * (the Breadcrumbs pattern). This component renders the same styling.
 *
 * Because it is navigation and not a form field, it intentionally has no
 * `label`, `labelPosition`, `instructions`, or `helpTooltip` props. Use
 * `accessibilityText` to name the navigation landmark.
 *
 * Long trails: when the trail does not fit on one line, the middle levels collapse
 * into a single "…" button. The first level and the current page always stay
 * visible, with as many of the nearest levels as fit. Selecting the button expands
 * the trail to all levels (wrapping onto multiple lines) and moves focus to the
 * first revealed level. It stays expanded until the levels change or the container
 * is wide enough for the whole trail. Collapse is automatic and width-based (not in
 * SAIL) and there is no prop to turn it off. When even the first level, "…", and
 * the current page do not fit, the current page text truncates with an ellipsis.
 * Trails of fewer than three levels never collapse. The button's accessible name
 * comes from the library string `breadcrumbs.showHidden` ("Show hidden levels").
 */
export interface BreadcrumbsFieldProps {
  /** Levels from the top of the hierarchy down to the current page. The last visible item is the current page and is always shown. */
  items: BreadcrumbItem[]
  /** Character shown between items. Not in SAIL. Default: "SLASH" */
  separator?: BreadcrumbsSeparator
  /** Accessible name for the breadcrumb navigation. Use it to tell multiple trails on one page apart. Default: "Breadcrumbs" */
  accessibilityText?: string
  /** Controls field visibility */
  showWhen?: boolean
  /** Space added above the component */
  marginAbove?: SAILMarginSize
  /** Space added below the component */
  marginBelow?: SAILMarginSize
  /** Additional Tailwind classes for prototype-specific styling (not part of SAIL API) */
  className?: string
}

// SAIL pattern styling: STANDALONE links, SECONDARY separators, STRONG current page
const linkClasses = [
  resolveColorClass('ACCENT', 'text'),
  'no-underline decoration-current/50 underline-offset-5 hover:underline',
  'rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2',
].join(' ')
const plainTextClasses = resolveColorClass('STANDARD', 'text')
const focusRingClasses =
  'rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2'
// The current page can take programmatic focus (tabIndex -1) but is never a tab stop
const currentPageClasses = `font-bold ${resolveColorClass('STANDARD', 'text')} ${focusRingClasses}`
// When collapsed the current page may truncate. overflow-hidden would clip an outset ring, so the ring is inset
const currentPageCollapsedClasses = [
  `block truncate font-bold ${resolveColorClass('STANDARD', 'text')}`,
  'rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-500',
].join(' ')
// A plain (unlinked) level can take programmatic focus when the "…" button reveals it
const plainTextFocusableClasses = `${plainTextClasses} ${focusRingClasses}`
const ellipsisButtonClasses = `${linkClasses} cursor-pointer px-1`
const separatorClasses = `mx-2 inline-flex items-center ${resolveColorClass('SECONDARY', 'text')}`

const olFullClasses = 'flex flex-wrap items-center gap-y-1 text-base'
const olCollapsedClasses = 'flex flex-nowrap items-center text-base'
const liFullClasses = 'inline-flex items-center'
// Measuring needs each item's natural width, so items must not shrink or wrap their text
const liMeasureClasses = 'inline-flex items-center shrink-0 whitespace-nowrap'
const liCollapsedClasses = 'inline-flex items-center shrink-0'
const liCollapsedCurrentClasses = 'inline-flex items-center min-w-0'

// useLayoutEffect warns when rendered on the server, so fall back to useEffect there
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? React.useLayoutEffect : React.useEffect

// Width of the "…" item before it has rendered and can be measured: the separator plus a button estimate
const ELLIPSIS_BUTTON_ESTIMATE = 24

interface Metrics {
  sig: string
  /** Natural width of each item, trailing separator included for all but the last. */
  widths: number[]
  /** Width of one separator including its margins. */
  sepWidth: number
  /** Width of the rendered "…" item, once known. */
  ellipsisWidth: number | null
}

/**
 * Returns null when no collapse is needed or possible, else the number of levels to
 * keep between the "…" and the current page. Always keeps the first level and the
 * current page, then fills a contiguous tail from the end and stops at the first
 * level that does not fit. At least one level (index 1) is always hidden.
 */
function computeTail(widths: number[], ellipsisWidth: number, available: number): number | null {
  const n = widths.length
  const budget = available - 1 // 1px tolerance for sub-pixel rounding
  if (n < 3) return null
  if (widths.reduce((a, b) => a + b, 0) <= budget) return null
  let used = widths[0] + ellipsisWidth + widths[n - 1]
  let tail = 0
  for (let i = n - 2; i >= 2 && used + widths[i] <= budget; i--) {
    used += widths[i]
    tail++
  }
  return tail
}

/**
 * BreadcrumbsField Component
 * Shows where the current page sits in a hierarchy, with links back to its parents.
 */
export const BreadcrumbsField: React.FC<BreadcrumbsFieldProps> = ({
  items,
  separator = "SLASH",
  accessibilityText,
  showWhen = true,
  marginAbove = "NONE",
  marginBelow = "STANDARD",
  className
}) => {
  const { t } = useI18n()
  const { direction } = useLocale()

  // Key of the item whose function link was just activated. If that item
  // becomes the current page, it takes focus (see the `link` JSDoc).
  const pendingFocusKey = React.useRef<string | null>(null)

  // A pending key only applies to the render caused by the click. Clear it after
  // each commit so a later, unrelated re-render never moves focus.
  React.useEffect(() => {
    pendingFocusKey.current = null
  })

  // The one place items are filtered. Hidden levels (showWhen=false, or text that is
  // empty once trimmed) are dropped here, so the separators and the current page
  // (the last visible item) are all derived from this list.
  const visibleItems = items.filter(item => item.showWhen !== false && item.text.trim() !== '')
  const n = visibleItems.length
  const isRendered = showWhen && n > 0

  // Stable keys from the item text so earlier items are not remounted when later
  // ones are hidden. Repeated text gets an occurrence suffix to stay unique. The
  // "i:" prefix keeps them from colliding with the ellipsis item's key.
  const seen = new Map<string, number>()
  const keys = visibleItems.map(item => {
    const count = seen.get(item.text) ?? 0
    seen.set(item.text, count + 1)
    return `i:${count === 0 ? item.text : `${item.text}#${count}`}`
  })

  // Changes when level text/order/count or the separator changes (both affect widths)
  const sig = `${separator}\u0000${keys.join('\u0000')}`

  const olRef = React.useRef<HTMLOListElement>(null)
  const ellipsisRef = React.useRef<HTMLButtonElement>(null)
  const ellipsisItemRef = React.useRef<HTMLLIElement>(null)
  // The first level revealed by the "…" button, which takes focus after expanding
  const revealTargetRef = React.useRef<HTMLElement | null>(null)
  // Set when a collapse removes the focused level, so focus moves to the "…" button
  const focusEllipsisRef = React.useRef(false)
  const metricsRef = React.useRef<Metrics | null>(null)

  const [layout, setLayout] = React.useState<{ sig: string; tail: number | null }>({ sig: '', tail: null })
  const [expansion, setExpansion] = React.useState<{ sig: string; revealKey: string } | null>(null)

  // measure: full trail until the current trail has been measured (also what SSR renders)
  // full: whole trail, wrapping; collapsed: root, "…", nearest levels, current page on one line
  const measured = layout.sig === sig
  const expanded = expansion !== null && expansion.sig === sig
  const tail = measured && !expanded && n >= 3 ? layout.tail : null
  const mode: 'measure' | 'full' | 'collapsed' = !measured ? 'measure' : tail === null ? 'full' : 'collapsed'

  // Read by evaluate(), which also runs from the ResizeObserver, so it must not close over render values
  const latestRef = React.useRef({ sig, n, expanded, mode })
  useIsomorphicLayoutEffect(() => {
    latestRef.current = { sig, n, expanded, mode }
  })

  const evaluate = React.useCallback(() => {
    const ol = olRef.current
    if (!ol) return
    const { sig: currentSig, n: count, expanded: isExpanded, mode: currentMode } = latestRef.current
    const available = ol.getBoundingClientRect().width
    // Hidden or not laid out (display:none, jsdom): keep the current layout and retry on the next resize
    if (!(available > 0)) return

    let metrics = metricsRef.current
    if (!metrics || metrics.sig !== currentSig) {
      // Widths are only valid while the whole trail is rendered in measure mode
      if (currentMode !== 'measure') return
      const listItems = Array.from(ol.children)
      if (count === 0 || listItems.length !== count) return
      const widths = listItems.map(li => li.getBoundingClientRect().width)
      if (widths.some(w => !(w > 0))) return
      const first = listItems[0]
      const sepWidth =
        count > 1 ? first.getBoundingClientRect().width - (first.firstElementChild?.getBoundingClientRect().width ?? 0) : 0
      metrics = metricsRef.current = { sig: currentSig, widths, sepWidth, ellipsisWidth: null }
    }

    // The real "…" item width (separator included) is known once it has rendered
    if (ellipsisItemRef.current) {
      const w = ellipsisItemRef.current.getBoundingClientRect().width
      if (w > 0) metrics.ellipsisWidth = w
    }
    const ellipsisWidth = metrics.ellipsisWidth ?? metrics.sepWidth + ELLIPSIS_BUTTON_ESTIMATE
    const next = computeTail(metrics.widths, ellipsisWidth, available)

    if (next === null) {
      focusEllipsisRef.current = false
    } else if (!isExpanded && !ellipsisItemRef.current) {
      // About to collapse: if the focused level is about to be removed, hand focus to the "…" button
      const active = document.activeElement
      if (active && ol.contains(active)) {
        const index = Array.from(ol.children).indexOf(active.closest('li') as Element)
        if (index >= 1 && index <= count - 2 - next) focusEllipsisRef.current = true
      }
    }

    setLayout(prev => (prev.sig === currentSig && prev.tail === next ? prev : { sig: currentSig, tail: next }))
    // The container fits the whole trail again, so a stored expansion is moot
    if (next === null) setExpansion(prev => (prev === null ? prev : null))
  }, [])

  // Runs after every commit: measures a new trail, and reads the real "…" width after the first collapse
  useIsomorphicLayoutEffect(() => {
    evaluate()
  })

  // A stored expansion never outlives its trail
  useIsomorphicLayoutEffect(() => {
    setExpansion(prev => (prev && prev.sig !== sig ? null : prev))
  }, [sig])

  // Move focus to the first revealed level when the "…" button is activated
  useIsomorphicLayoutEffect(() => {
    if (expanded) revealTargetRef.current?.focus()
  }, [expanded])

  // Move focus to the "…" button when a resize collapsed the focused level
  useIsomorphicLayoutEffect(() => {
    if (focusEllipsisRef.current && ellipsisRef.current) {
      focusEllipsisRef.current = false
      ellipsisRef.current.focus()
    }
  })

  React.useEffect(() => {
    if (!isRendered || typeof ResizeObserver === 'undefined' || !olRef.current) return
    const observer = new ResizeObserver(() => evaluate())
    observer.observe(olRef.current)
    return () => observer.disconnect()
  }, [isRendered, evaluate])

  // Web fonts change text widths, so drop the cached widths and measure again once they load
  React.useEffect(() => {
    if (typeof document === 'undefined' || !document.fonts?.ready) return
    let live = true
    document.fonts.ready.then(() => {
      if (!live) return
      metricsRef.current = null
      setLayout({ sig: '', tail: null })
    })
    return () => {
      live = false
    }
  }, [])

  if (!showWhen) return null
  if (n === 0) return null

  // Focus the current page once it mounts, but only when focus was lost with the
  // removed link (document.body) so focus is never stolen from elsewhere.
  const focusCurrentPage = (key: string) => (el: HTMLSpanElement | null) => {
    if (!el || pendingFocusKey.current !== key) return
    pendingFocusKey.current = null
    const active = document.activeElement
    if (!active || active === document.body) el.focus()
  }

  const setRevealTarget = (el: HTMLElement | null) => {
    revealTargetRef.current = el
  }

  // In right-to-left locales the trail runs right to left, so the chevron flips
  const isRtl = direction === 'RTL'
  const ChevronIcon = isRtl ? ChevronLeft : ChevronRight

  const renderSeparator = () => (
    <span
      aria-hidden="true"
      className={separatorClasses}
      data-separator-direction={separator === "CHEVRON" ? (isRtl ? 'left' : 'right') : undefined}
    >
      {separator === "CHEVRON" ? <ChevronIcon size={14} /> : '/'}
    </span>
  )

  const renderAncestor = (item: BreadcrumbItem, key: string) => {
    const { link, text } = item
    const isRevealTarget = expanded && expansion.revealKey === key
    // An empty string is no link: <a href=""> would point at the current page
    if (typeof link === 'string' && link !== '') {
      return (
        <a href={link} className={linkClasses} ref={isRevealTarget ? setRevealTarget : undefined}>
          {text}
        </a>
      )
    }
    if (typeof link === 'function') {
      return (
        <a
          href="#"
          className={linkClasses}
          ref={isRevealTarget ? setRevealTarget : undefined}
          onClick={(e) => {
            // Leave modified and non-primary clicks to the browser (new tab, etc.)
            if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return
            e.preventDefault()
            pendingFocusKey.current = key
            link()
          }}
        >
          {text}
        </a>
      )
    }
    if (isRevealTarget) {
      return (
        <span className={plainTextFocusableClasses} tabIndex={-1} ref={setRevealTarget}>
          {text}
        </span>
      )
    }
    return <span className={plainTextClasses}>{text}</span>
  }

  const sailClasses = `${marginAboveMap[marginAbove]} ${marginBelowMap[marginBelow]}`

  // Levels 1 … hiddenEnd are replaced by the "…" item while collapsed
  const hiddenEnd = tail === null ? 0 : n - 2 - tail

  const listItems: React.ReactNode[] = []
  visibleItems.forEach((item, index) => {
    if (tail !== null && index >= 1 && index <= hiddenEnd) {
      if (index === 1) {
        listItems.push(
          <li key="ellipsis" ref={ellipsisItemRef} className={liCollapsedClasses}>
            <button
              type="button"
              ref={ellipsisRef}
              aria-label={t(KEYS.breadcrumbsShowHidden)}
              className={ellipsisButtonClasses}
              onClick={() => setExpansion({ sig, revealKey: keys[1] })}
            >
              <span aria-hidden="true">…</span>
            </button>
            {renderSeparator()}
          </li>
        )
      }
      return
    }
    const isCurrent = index === n - 1
    const key = keys[index]
    const liClasses =
      mode === 'measure'
        ? liMeasureClasses
        : mode === 'full'
          ? liFullClasses
          : isCurrent
            ? liCollapsedCurrentClasses
            : liCollapsedClasses
    listItems.push(
      <li key={key} className={liClasses}>
        {isCurrent ? (
          <span
            aria-current="page"
            tabIndex={-1}
            ref={focusCurrentPage(key)}
            className={mode === 'collapsed' ? currentPageCollapsedClasses : currentPageClasses}
          >
            {item.text}
          </span>
        ) : (
          renderAncestor(item, key)
        )}
        {!isCurrent && renderSeparator()}
      </li>
    )
  })

  return (
    <nav
      aria-label={accessibilityText || t(KEYS.breadcrumbsLabel)}
      className={mergeClasses(`w-full min-w-0 ${sailClasses}`, className)}
      dir={isRtl ? 'rtl' : undefined}
    >
      {/* role="list" is explicit because Safari/VoiceOver drops list semantics from lists
          styled with list-none (Tailwind preflight), which would lose the "2 of 3" announcement.
          The list wraps when it fits or is expanded, and stays on one line while collapsed. */}
      <ol ref={olRef} role="list" className={mode === 'collapsed' ? olCollapsedClasses : olFullClasses}>
        {listItems}
      </ol>
    </nav>
  )
}
