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
  /** Display text for this level */
  text: string
  /**
   * Where this level navigates to. A string renders a standard link with that
   * `href` (like TagItem's `link`). A function runs on click (like TextItem's
   * `link`), for prototypes that navigate with state or a router.
   * Ignored on the last visible item, which is always the current page.
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
 */
export interface BreadcrumbsFieldProps {
  /** Levels from the top of the hierarchy down to the current page. The last visible item is the current page. */
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
// The current page can take programmatic focus (tabIndex -1) but is never a tab stop
const currentPageClasses = [
  `font-bold ${resolveColorClass('STANDARD', 'text')}`,
  'rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2',
].join(' ')
const separatorClasses = `mx-2 inline-flex items-center ${resolveColorClass('SECONDARY', 'text')}`

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

  if (!showWhen) return null

  const visibleItems = items.filter(item => item.showWhen !== false && item.text)
  if (visibleItems.length === 0) return null

  // Stable keys from the item text so earlier items are not remounted when later
  // ones are hidden. Repeated text gets an occurrence suffix to stay unique.
  const seen = new Map<string, number>()
  const keys = visibleItems.map(item => {
    const count = seen.get(item.text) ?? 0
    seen.set(item.text, count + 1)
    return count === 0 ? item.text : `${item.text}#${count}`
  })

  // Focus the current page once it mounts, but only when focus was lost with the
  // removed link (document.body) so focus is never stolen from elsewhere.
  const focusCurrentPage = (key: string) => (el: HTMLSpanElement | null) => {
    if (!el || pendingFocusKey.current !== key) return
    pendingFocusKey.current = null
    const active = document.activeElement
    if (!active || active === document.body) el.focus()
  }

  // In right-to-left locales the trail runs right to left, so the chevron flips
  const isRtl = direction === 'RTL'
  const ChevronIcon = isRtl ? ChevronLeft : ChevronRight

  const renderAncestor = (item: BreadcrumbItem, key: string) => {
    const { link, text } = item
    if (typeof link === 'string') {
      return <a href={link} className={linkClasses}>{text}</a>
    }
    if (typeof link === 'function') {
      return (
        <a
          href="#"
          className={linkClasses}
          onClick={(e) => {
            e.preventDefault()
            pendingFocusKey.current = key
            link()
          }}
        >
          {text}
        </a>
      )
    }
    return <span className={plainTextClasses}>{text}</span>
  }

  const sailClasses = `${marginAboveMap[marginAbove]} ${marginBelowMap[marginBelow]}`

  return (
    <nav
      aria-label={accessibilityText || t(KEYS.breadcrumbsLabel)}
      className={mergeClasses(sailClasses, className)}
      dir={isRtl ? 'rtl' : undefined}
    >
      {/* role="list" is explicit because Safari/VoiceOver drops list semantics from lists
          styled with list-none (Tailwind preflight), which would lose the "2 of 3" announcement */}
      <ol role="list" className="flex flex-wrap items-center gap-y-1 text-base">
        {visibleItems.map((item, index) => {
          const isCurrent = index === visibleItems.length - 1
          const key = keys[index]
          return (
            <li key={key} className="inline-flex items-center">
              {isCurrent ? (
                <span
                  aria-current="page"
                  tabIndex={-1}
                  ref={focusCurrentPage(key)}
                  className={currentPageClasses}
                >
                  {item.text}
                </span>
              ) : (
                renderAncestor(item, key)
              )}
              {!isCurrent && (
                <span aria-hidden="true" className={separatorClasses}>
                  {separator === "CHEVRON" ? <ChevronIcon size={14} /> : '/'}
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
