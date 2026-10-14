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
// SAIL's boxLayout has no CIRCLE shape, so BoxLayout accepts only the other three.
export type BoxShape = Exclude<SAILShape, 'CIRCLE'>

// Component-local only, never exported, and never reusing BoxStyle/BoxBorderColor
// as a name — a local `type BoxStyle = ...` would shadow the exported, branded
// type above for the rest of the component body, which is exactly the compile
// failure this naming avoids. These exist only so the maps below can be
// exhaustively checked by tsc; they're never used as a prop type.
type BoxStyleNamed = "STANDARD" | "ACCENT" | "SUCCESS" | "INFO" | "WARN" | "ERROR"
type BoxBorderColorNamed = "STANDARD" | "ACCENT" | "POSITIVE" | "WARN" | "NEGATIVE" | "INFO"
// borderColor's named values that aren't SAIL semantic colors. ACCENT/POSITIVE/
// NEGATIVE resolve through resolveColorClass instead of a local map.
type LocalBorderColorNamed = Exclude<BoxBorderColorNamed, "ACCENT" | "POSITIVE" | "NEGATIVE">

function isBoxStyleNamed(v: string): v is BoxStyleNamed {
  return v === "STANDARD" || v === "ACCENT" || v === "SUCCESS" || v === "INFO" || v === "WARN" || v === "ERROR"
}
function isLocalBorderColorNamed(v: string): v is LocalBorderColorNamed {
  return v === "STANDARD" || v === "WARN" || v === "INFO"
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

// Border color a named style supplies while borderColor is left at STANDARD.
// SAIL's style "determines the color of the label and box outline", so every
// named style has a border tone matched to its header.
const styleBorderColorMap: Record<BoxStyleNamed, string> = {
  STANDARD: 'border-gray-300',
  ACCENT: 'border-blue-200',
  SUCCESS: 'border-green-200',
  INFO: 'border-sky-200',
  WARN: 'border-yellow-400',
  ERROR: 'border-red-200',
}

// Explicit borderColor values that use a local class. Kept in step with the
// matching styleBorderColorMap entries so borderColor="WARN" and style="WARN"
// draw the same border.
const borderColorMap: Record<LocalBorderColorNamed, string> = {
  STANDARD: 'border-gray-300',
  WARN: 'border-yellow-400',
  INFO: 'border-sky-200',
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

// Top-corner-only counterpart to shapeMap for the header row, so a colored
// header background doesn't square off past the outer rounded border.
const headerTopShapeMap: Record<BoxShape, string> = {
  SQUARED: 'rounded-t-none',
  SEMI_ROUNDED: 'rounded-t-sm',
  ROUNDED: 'rounded-t-md',
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

interface BorderColorResolution {
  className?: string
  inlineStyle?: { borderColor: string }
}

/**
 * Resolves the outer border color. While `borderColor` is left at STANDARD, a
 * named `style` supplies it from styleBorderColorMap (hex and palette styles
 * keep the STANDARD border). Otherwise `borderColor` resolves in four branches:
 * local name -> local map; ACCENT/POSITIVE/NEGATIVE -> resolveColorClass
 * (avoids a second hardcoded copy of colors colorResolver.ts already owns);
 * palette token -> resolveColorClass; otherwise hex (optional alpha) -> inline
 * style. An explicit borderColor always wins over the style.
 */
function resolveBorderColor(borderColor: BoxBorderColor, style: BoxStyle): BorderColorResolution {
  if (borderColor === "STANDARD" && isBoxStyleNamed(style)) {
    return { className: styleBorderColorMap[style] }
  }
  if (isLocalBorderColorNamed(borderColor)) {
    return { className: borderColorMap[borderColor] }
  }
  if (borderColor === "ACCENT" || borderColor === "POSITIVE" || borderColor === "NEGATIVE") {
    return { className: resolveColorClass(borderColor, 'border') }
  }
  if (isPaletteColor(borderColor)) {
    return { className: resolveColorClass(borderColor, 'border') }
  }
  return { inlineStyle: { borderColor } }
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
  /** Determines the box header color. A semantic value also sets the border color unless borderColor is set; "INFO" and "ERROR" also set the label text color. Accepts a hex color (optional 2-digit alpha suffix) or a semantic value. */
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
  /** Determines the box shape: "SQUARED", "SEMI_ROUNDED", or "ROUNDED" */
  shape?: BoxShape
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
  /** Determines the border color. When left at "STANDARD", a semantic style sets a matching border color. Accepts a hex color (optional 2-digit alpha suffix) or a semantic value. */
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
  const resolvedHeadingTag = labelHeadingTag || defaultHeadingTagForSize(labelSize)
  const HeadingEl = resolvedHeadingTag.toLowerCase() as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  // A collapsible box with no label has nothing to title, so its toggle
  // button isn't wrapped in a heading (an empty heading is an a11y error).
  const ToggleWrapper = label ? HeadingEl : 'div'

  const handleToggle = () => {
    setIsOpen((o) => !o)
    setIsAnimating(true)
    if (animationTimeoutRef.current !== undefined) {
      window.clearTimeout(animationTimeoutRef.current)
    }
    animationTimeoutRef.current = window.setTimeout(() => setIsAnimating(false), TRANSITION_MS)
  }

  const headerColors = resolveHeaderColors(style)
  const borderResolution = resolveBorderColor(borderColor, style)

  // Typography classes shared by the collapsible (<button> inside <HeadingEl>,
  // or inside a plain <div> when there's no label) and non-collapsible
  // (<HeadingEl> alone) branches.
  const headingTypographyClasses = [
    labelSizeMap[labelSize],
    labelFontWeightMap[labelFontWeight],
    headerColors.labelClassName,
  ].filter(Boolean).join(' ')
  const headingInlineStyle = headerColors.labelInlineStyle

  const outerClasses = mergeClasses([
    'flex flex-col',
    // A collapsible box's height depends on whether it's open, so h-fit keeps
    // a grid or flex row from stretching it to a taller sibling, which would
    // leave an empty band below a collapsed header. height: fit-content
    // doesn't affect width, unlike self-start in a flex column. Non-collapsible
    // boxes keep the default stretch, like CardLayout. A consumer's h-*
    // className overrides it through mergeClasses.
    isCollapsible ? 'h-fit' : '',
    shapeMap[shape],
    marginAboveMap[marginAbove],
    marginBelowMap[marginBelow],
    showBorder ? [borderWeightMap[borderWeight], borderResolution.className].filter(Boolean).join(' ') : '',
    showShadow ? 'shadow-md' : '',
  ].filter(Boolean).join(' '), className)

  const outerInlineStyle = showBorder ? borderResolution.inlineStyle : undefined

  // The header's padding is fixed regardless of the `padding` prop — only
  // the content/body area scales with `padding`. The header's label/chevron
  // are chrome, not `contents`. When collapsible, the padding lives on the
  // toggle button instead of the row, so the whole header row is clickable;
  // non-collapsible headers keep it on the row.
  //
  // The header rounds its own corners to match the outer shape, so its
  // background doesn't square off past the outer border on SEMI_ROUNDED/
  // ROUNDED (SQUARED is a no-op). Normally only the top corners are rounded.
  // Once a collapsible box has settled closed, the content row is 0px tall,
  // so the header is the box's bottom edge too and gets full rounding. That
  // switch waits until the close transition ends so the corners don't jump
  // mid-animation. It tracks `shape`, not the border, so it holds with
  // showBorder={false} + showShadow too. Rounding just the header, instead of
  // overflow-hidden on the outer container, avoids clipping other content
  // that must render outside the box's bounds — e.g. WithDropdownContent's
  // open dropdown menu.
  const isSettledClosed = isCollapsible && !isOpen && !isAnimating
  const headerShapeClass = isSettledClosed ? shapeMap[shape] : headerTopShapeMap[shape]
  const headerRowClasses = [isCollapsible ? '' : 'px-3 py-2', headerShapeClass, headerColors.bgClassName].filter(Boolean).join(' ')
  // Same shape class as the row so the inset focus ring follows its corners.
  const toggleButtonClasses = [
    'w-full flex items-center justify-between gap-2 px-3 py-2 text-start text-inherit focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-inset',
    headerShapeClass,
  ].filter(Boolean).join(' ')

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

  const contentPaddingClasses = paddingMap[padding]

  return (
    <div className={outerClasses} style={outerInlineStyle}>
      {hasHeader && (
        <div className={headerRowClasses} style={headerColors.bgInlineStyle}>
          {isCollapsible ? (
            <ToggleWrapper className={headingTypographyClasses} style={headingInlineStyle}>
              {/* Open/closed state is conveyed by aria-expanded only, so the
                  button's (and heading's) accessible name doesn't change on
                  toggle. With a label, the name is the label plus any
                  accessibilityText (sr-only, same as the non-collapsible
                  heading). With no label, a fixed aria-label names the
                  button. */}
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={contentId}
                aria-label={label ? undefined : (accessibilityText || t(KEYS.boxLayoutToggleContent))}
                onClick={handleToggle}
                className={toggleButtonClasses}
              >
                {label && <span>{label}</span>}
                {label && accessibilityText && <span className="sr-only"> {accessibilityText}</span>}
                <ChevronDown
                  aria-hidden="true"
                  className={isOpen ? 'size-4 shrink-0 ms-auto transition-transform rotate-0' : 'size-4 shrink-0 ms-auto transition-transform -rotate-90'}
                />
              </button>
            </ToggleWrapper>
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
          {/* `min-h-0` must sit on this div because it's the direct grid child
              of the `grid-rows-[0fr]`/`grid-rows-[1fr]` wrapper above — a grid
              item's default `min-height: auto` otherwise keeps the row from
              shrinking below its content's intrinsic height, so a 0fr row
              still rendered at the content's full height without this. The
              padding div is nested one level deeper so padding never adds
              height outside the row that's actually sized to 0fr. */}
          <div className="min-h-0">
            <div className={contentPaddingClasses}>{children}</div>
          </div>
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
