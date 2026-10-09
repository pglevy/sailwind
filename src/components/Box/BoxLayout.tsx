import * as React from 'react'
import { ChevronDown } from 'lucide-react'
import type { SAILShape, SAILPadding, SAILMarginSize } from '../../types/sail'
import { isPaletteColor, resolveColorClass, resolveColorToHex, getContrastColor } from '../../utils/colorResolver'
import { mergeClasses } from '../../utils/classNames'
import { marginAboveMap, marginBelowMap, paddingMap, shapeMap } from '../../utils/sailMaps'
import { useI18n, KEYS } from '../../i18n'

/** Must stay in sync with the `duration-200` Tailwind class on the content wrapper. */
const TRANSITION_MS = 200

// Exported, branded prop types. Branded with `(string & {})` so TypeScript keeps
// literal-value autocomplete without collapsing the union to `string` — the same
// pattern SAILColorInput uses in src/types/sail.ts.
export type BoxStyle = "STANDARD" | "ACCENT" | "SUCCESS" | "INFO" | "WARN" | "ERROR" | (string & {})
export type BoxBorderColor = "STANDARD" | "ACCENT" | "POSITIVE" | "WARN" | "NEGATIVE" | "INFO" | (string & {})
export type BoxLabelSize = "LARGE_PLUS" | "LARGE" | "MEDIUM_PLUS" | "MEDIUM" | "SMALL" | "EXTRA_SMALL"
export type BoxHeadingTag = "H1" | "H2" | "H3" | "H4" | "H5" | "H6"
export type BoxBorderWeight = "THIN" | "MEDIUM" | "THICK"
export type BoxLabelFontWeight = "LIGHT" | "REGULAR" | "SEMI_BOLD" | "BOLD"

// Component-local only, never exported, and never reusing BoxStyle/BoxBorderColor
// as a name — a local `type BoxStyle = ...` would shadow the exported, branded
// type above for the rest of the component body, which is exactly the compile
// failure this naming avoids. These exist only so the maps below can be
// exhaustively checked by tsc; they're never used as a prop type.
type BoxStyleNamed = "STANDARD" | "ACCENT" | "SUCCESS" | "INFO" | "WARN" | "ERROR"
type BoxBorderColorNamed = "STANDARD" | "ACCENT" | "POSITIVE" | "WARN" | "NEGATIVE" | "INFO"
// EffectiveBorderColorNamed adds "ERROR": the INFO/ERROR override can assign the
// literal "ERROR" into the border-resolution step, and "ERROR" is not a member
// of BoxBorderColorNamed itself (only borderColor's own 6 names are).
type EffectiveBorderColorNamed = Exclude<BoxBorderColorNamed, "ACCENT" | "POSITIVE" | "NEGATIVE"> | "ERROR"

function isBoxStyleNamed(v: string): v is BoxStyleNamed {
  return v === "STANDARD" || v === "ACCENT" || v === "SUCCESS" || v === "INFO" || v === "WARN" || v === "ERROR"
}
function isEffectiveBorderColorNamed(v: string): v is EffectiveBorderColorNamed {
  return v === "STANDARD" || v === "WARN" || v === "INFO" || v === "ERROR"
}

// Header background + label text color maps. Every one of the 6 named values has
// an explicit entry — no fallback-to-undefined.
const headerBgMap: Record<BoxStyleNamed, string> = {
  STANDARD: 'bg-gray-100',
  ACCENT: 'bg-blue-50',
  SUCCESS: 'bg-green-50',
  INFO: 'bg-sky-50',
  WARN: 'bg-yellow-50',
  ERROR: 'bg-red-50',
}

const headerLabelColorMap: Record<BoxStyleNamed, string> = {
  STANDARD: 'text-gray-900',
  ACCENT: 'text-gray-900',
  SUCCESS: 'text-gray-900',
  WARN: 'text-gray-900',
  INFO: 'text-sky-900',
  ERROR: 'text-red-900',
}

const borderColorMap: Record<EffectiveBorderColorNamed, string> = {
  STANDARD: 'border-gray-300',
  WARN: 'border-yellow-400',
  INFO: 'border-sky-300',
  ERROR: 'border-red-300',
}

const borderWeightMap: Record<BoxBorderWeight, string> = {
  THIN: 'border',
  MEDIUM: 'border-2',
  THICK: 'border-4',
}

const labelFontWeightMap: Record<BoxLabelFontWeight, string> = {
  LIGHT: 'font-light',
  REGULAR: 'font-normal',
  SEMI_BOLD: 'font-semibold',
  BOLD: 'font-bold',
}

const labelSizeMap: Record<BoxLabelSize, string> = {
  EXTRA_SMALL: 'text-xs',
  SMALL: 'text-sm',
  MEDIUM: 'text-lg',
  MEDIUM_PLUS: 'text-xl',
  LARGE: 'text-2xl',
  LARGE_PLUS: 'text-3xl',
}

/** labelSize -> default labelHeadingTag, pinned to HeadingField's getDefaultHeadingTag table. */
function defaultHeadingTagForSize(size: BoxLabelSize): BoxHeadingTag {
  switch (size) {
    case 'LARGE_PLUS':
      return 'H1'
    case 'LARGE':
      return 'H1'
    case 'MEDIUM_PLUS':
      return 'H2'
    case 'MEDIUM':
      return 'H3'
    case 'SMALL':
      return 'H4'
    case 'EXTRA_SMALL':
      return 'H5'
    default:
      return 'H5'
  }
}

interface HeaderColorResolution {
  bgClassName?: string
  bgInlineStyle?: { backgroundColor: string }
  labelClassName?: string
  labelInlineStyle?: { color: string }
}

/**
 * Resolves `style` to a header background + label text color, in three branches:
 * named semantic value -> local maps; palette token -> resolveColorClass +
 * contrast-computed label color; otherwise hex (optional alpha) -> inline style +
 * contrast-computed label color. Mirrors CardLayout.getBackgroundColor's own
 * branch order, extended to also resolve a label color in branches 2 and 3,
 * where no curated Tailwind class exists.
 */
function resolveHeaderColors(style: BoxStyle): HeaderColorResolution {
  if (isBoxStyleNamed(style)) {
    return { bgClassName: headerBgMap[style], labelClassName: headerLabelColorMap[style] }
  }
  if (isPaletteColor(style)) {
    const hex = resolveColorToHex(style)
    return {
      bgClassName: resolveColorClass(style, 'bg'),
      labelInlineStyle: hex ? { color: getContrastColor(hex) } : undefined,
    }
  }
  // Hex (optionally with alpha). Mirrors CardLayout's own unvalidated hex-branch
  // fallthrough: a malformed, non-hex, non-named string also lands here and is
  // passed to getContrastColor as-is.
  return {
    bgInlineStyle: { backgroundColor: style },
    labelInlineStyle: { color: getContrastColor(style) },
  }
}

/**
 * Resolves `effectiveBorderColor` (either the `borderColor` prop or, when
 * defaulted, the `style` prop) to a border color, in four branches: named ->
 * local map; ACCENT/POSITIVE/NEGATIVE -> resolveColorClass (avoids a second
 * hardcoded copy of colors colorResolver.ts already owns); palette token ->
 * resolveColorClass; otherwise hex (optional alpha) -> inline style.
 */
function resolveBorderColor(effectiveBorderColor: BoxBorderColor): { className?: string; inlineStyle?: { borderColor: string } } {
  if (isEffectiveBorderColorNamed(effectiveBorderColor)) {
    return { className: borderColorMap[effectiveBorderColor] }
  }
  if (effectiveBorderColor === "ACCENT" || effectiveBorderColor === "POSITIVE" || effectiveBorderColor === "NEGATIVE") {
    return { className: resolveColorClass(effectiveBorderColor, 'border') }
  }
  if (isPaletteColor(effectiveBorderColor)) {
    return { className: resolveColorClass(effectiveBorderColor, 'border') }
  }
  return { inlineStyle: { borderColor: effectiveBorderColor } }
}

/**
 * Props for the BoxLayout component
 * Maps to SAIL's a!boxLayout() function
 */
export interface BoxLayoutProps {
  /** Text to display as the box's title in the header */
  label?: string
  /** Components and layouts to display within the box */
  children?: React.ReactNode
  /** Determines the box header color. If "INFO" or "ERROR", also affects border + label text color. Accepts a hex color (optional 2-digit alpha suffix) or a semantic value. */
  style?: BoxStyle
  /** Determines whether the layout is displayed. When false, the layout is hidden and not evaluated. */
  showWhen?: boolean
  /** Determines if an expand/collapse control appears in the box header */
  isCollapsible?: boolean
  /** Determines if the box is collapsed when the interface first loads */
  isInitiallyCollapsed?: boolean
  /** Determines how much space is added below the layout */
  marginBelow?: SAILMarginSize
  /** Additional text announced by screen readers only; produces no visible change */
  accessibilityText?: string
  /** Determines the space between the box edges and its contents */
  padding?: SAILPadding
  /** Determines the box shape */
  shape?: SAILShape
  /** Determines how much space is added above the layout */
  marginAbove?: SAILMarginSize
  /** Determines whether the box has an outer border */
  showBorder?: boolean
  /** Determines whether the box has an outer shadow */
  showShadow?: boolean
  /** Determines the label size */
  labelSize?: BoxLabelSize
  /** Determines the heading tag associated with the label for screen readers. Default depends on labelSize (mirrors HeadingField's size->tag table). */
  labelHeadingTag?: BoxHeadingTag
  /** Determines the box border thickness */
  borderWeight?: BoxBorderWeight
  /** Determines the border color. If style is "INFO" or "ERROR", defaults to match the style color. Accepts a hex color (optional 2-digit alpha suffix) or a semantic value. */
  borderColor?: BoxBorderColor
  /** Determines the font weight of the label */
  labelFontWeight?: BoxLabelFontWeight
  /** Additional Tailwind classes for prototype-specific styling (not part of SAIL API) */
  className?: string
}

/**
 * BoxLayout Component
 * Displays content in a bordered box with an optional header title and
 * expand/collapse control.
 */
export const BoxLayout: React.FC<BoxLayoutProps> = ({
  label,
  children,
  style = "STANDARD",
  showWhen = true,
  isCollapsible = false,
  isInitiallyCollapsed = false,
  marginBelow = "NONE",
  accessibilityText,
  padding = "LESS",
  shape = "SQUARED",
  marginAbove = "NONE",
  showBorder = true,
  showShadow = false,
  labelSize = "EXTRA_SMALL",
  labelHeadingTag,
  borderWeight = "THIN",
  borderColor = "STANDARD",
  labelFontWeight = "SEMI_BOLD",
  className
}) => {
  const { t } = useI18n()
  const generatedId = React.useId()
  const [isOpen, setIsOpen] = React.useState(!isInitiallyCollapsed)
  // True only while the grid-template-rows transition triggered by the most
  // recent toggle is still running. Drives whether overflow-hidden is present
  // on the content wrapper (collapsible branch only).
  const [isAnimating, setIsAnimating] = React.useState(false)
  const animationTimeoutRef = React.useRef<number | undefined>(undefined)
  // inert is set/removed imperatively via this ref (see the useLayoutEffect
  // below), not via a JSX attribute or prop spread — React 18 and 19 commit
  // opposite DOM results for every JSX value of `inert`, so this bypasses both
  // versions' coercion rules by calling the plain DOM API directly.
  const contentRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    return () => {
      if (animationTimeoutRef.current !== undefined) {
        window.clearTimeout(animationTimeoutRef.current)
      }
    }
  }, [])

  React.useLayoutEffect(() => {
    const el = contentRef.current
    if (!el) return
    if (isCollapsible && !isOpen) {
      el.setAttribute('inert', '')
    } else {
      el.removeAttribute('inert')
    }
  }, [isCollapsible, isOpen])

  if (!showWhen) return null

  const contentId = `${generatedId}-content`
  const hasHeader = !!label || isCollapsible
  const isInfoOrError = style === "INFO" || style === "ERROR"
  // Only overrides when the caller left borderColor at its default — an
  // explicit borderColor always wins.
  const effectiveBorderColor: BoxBorderColor =
    borderColor === "STANDARD" && isInfoOrError ? style : borderColor
  const resolvedHeadingTag = labelHeadingTag || defaultHeadingTagForSize(labelSize)
  const HeadingEl = resolvedHeadingTag.toLowerCase() as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  const toggleLabel = isOpen ? t(KEYS.boxLayoutCollapse) : t(KEYS.boxLayoutExpand)

  const handleToggle = () => {
    setIsOpen((o) => !o)
    setIsAnimating(true)
    if (animationTimeoutRef.current !== undefined) {
      window.clearTimeout(animationTimeoutRef.current)
    }
    animationTimeoutRef.current = window.setTimeout(() => setIsAnimating(false), TRANSITION_MS)
  }

  const headerColors = resolveHeaderColors(style)
  const borderResolution = resolveBorderColor(effectiveBorderColor)

  // Typography classes shared by both the collapsible (<button> inside
  // <HeadingEl>) and non-collapsible (<HeadingEl> alone) branches.
  const headingTypographyClasses = [
    labelSizeMap[labelSize],
    labelFontWeightMap[labelFontWeight],
    headerColors.labelClassName,
  ].filter(Boolean).join(' ')
  const headingInlineStyle = headerColors.labelInlineStyle

  const outerClasses = mergeClasses([
    'flex flex-col',
    shapeMap[shape],
    marginAboveMap[marginAbove],
    marginBelowMap[marginBelow],
    showBorder ? [borderWeightMap[borderWeight], borderResolution.className].filter(Boolean).join(' ') : '',
    showShadow ? 'shadow-md' : '',
  ].filter(Boolean).join(' '), className)

  const outerInlineStyle = showBorder ? borderResolution.inlineStyle : undefined

  // The header row's padding is fixed regardless of the `padding` prop — only
  // the content/body area scales with `padding`. The header's label/chevron
  // are chrome, not `contents`.
  const headerRowClasses = ['px-3 py-2', headerColors.bgClassName].filter(Boolean).join(' ')

  // Present whenever the box is not fully settled open: either closed/closing
  // or actively mid-transition in either direction. Dropped only once open AND
  // settled, matching CardLayout's unclipped behavior.
  const showOverflowHidden = isCollapsible && (!isOpen || isAnimating)
  const contentWrapperClasses = isCollapsible
    ? [
        'grid transition-[grid-template-rows] duration-200 ease-in-out motion-reduce:transition-none',
        showOverflowHidden ? 'overflow-hidden' : '',
        isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
      ].filter(Boolean).join(' ')
    : ''

  const contentPaddingClasses = ['min-h-0', paddingMap[padding]].filter(Boolean).join(' ')

  return (
    <div className={outerClasses} style={outerInlineStyle}>
      {hasHeader && (
        <div className={headerRowClasses} style={headerColors.bgInlineStyle}>
          {isCollapsible ? (
            <HeadingEl className={headingTypographyClasses} style={headingInlineStyle}>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={contentId}
                onClick={handleToggle}
                className="w-full flex items-center justify-between gap-2 text-inherit focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
              >
                <span>{label}</span>
                {accessibilityText && <span className="sr-only"> {accessibilityText}</span>}
                <span className="sr-only"> {toggleLabel}</span>
                <ChevronDown
                  aria-hidden="true"
                  className={isOpen ? 'size-4 shrink-0 transition-transform rotate-0' : 'size-4 shrink-0 transition-transform -rotate-90'}
                />
              </button>
            </HeadingEl>
          ) : (
            <HeadingEl className={headingTypographyClasses} style={headingInlineStyle}>
              {label}
              {accessibilityText && <span className="sr-only"> {accessibilityText}</span>}
            </HeadingEl>
          )}
        </div>
      )}
      {isCollapsible ? (
        <div id={contentId} ref={contentRef} className={contentWrapperClasses}>
          <div className={contentPaddingClasses}>{children}</div>
        </div>
      ) : (
        // Non-collapsible: no grid/overflow-hidden/transition/inert at all —
        // renders exactly like CardLayout's own children, with nothing to clip
        // or animate. contentRef/the inert effect only matter for the
        // collapsible branch; the effect's own isCollapsible check is a no-op
        // guard here, not load-bearing.
        <div id={contentId} className={contentPaddingClasses}>{children}</div>
      )}
    </div>
  )
}
