import * as React from 'react'
import * as LucideIcons from 'lucide-react'
import { Search, X, type LucideIcon } from 'lucide-react'
import { FieldWrapper } from '../shared/FieldWrapper'
import type { SAILLabelPosition, SAILMarginSize, SAILShape } from '../../types/sail'
import { shapeMap } from '../../utils/sailMaps'
import { useI18n, KEYS } from '../../i18n'

export type SearchShape = Extract<SAILShape, "SQUARED" | "SEMI_ROUNDED" | "ROUNDED">

/**
 * A text input for searching, with a search icon, an optional end icon, and a
 * results panel.
 *
 * The results follow Material 3's search view
 * (https://m3.material.io/components/search/guidelines), and the layout is
 * built in. In compact windows the results are full screen: the field and
 * results cover the window, with the input at the top, the field's close (X)
 * button at the end of that row, and the results filling the rest and
 * scrolling inside it. In medium and expanded windows they are docked: a list
 * below the input, with a scrim over the page. Sailwind maps compact to SAIL's
 * PHONE width, so the results are full screen at 480px or less and docked at
 * 481px and up. Material 3's compact width is under 600px, so between 481 and
 * 599px Sailwind docks where Material 3 would use full screen. The window
 * width is used, not the width of the field's container, so a field in a
 * narrow sidebar on a wide window stays docked. There is no prop to change the
 * layout. Full screen moves focus to the input when it opens with focus
 * elsewhere. It is not modal: Tab out of the view closes it (`onDismiss`), and
 * without `onDismiss` there is no X, so the user cannot close the view.
 *
 * Not in SAIL as a component. The closest SAIL has is the search box built
 * into read-only grids and `a!textField` with a placeholder. The prop names
 * follow `a!textField` where they overlap. Props marked "Not in SAIL" are
 * Sailwind additions.
 *
 * Not implemented (a search query is not a submitted form value): required,
 * requiredMessage, validations, validationGroup, readOnly, helpTooltip,
 * masked, align, inputPurpose, characterLimit, showCharacterCount, refreshAfter.
 * `saveInto` and `onChange` run on every keystroke, like SAIL's
 * `refreshAfter: "KEYPRESS"`.
 *
 * Known limitations:
 * - Inside a Radix Dialog, Escape may also close the dialog.
 * - The scrim and the full-screen view are `position: fixed`. An ancestor with
 *   `transform`, `filter`, `perspective`, `backdrop-filter`, `contain: paint`
 *   or `will-change: transform` confines them to that ancestor's box (Storybook's
 *   docs page does this).
 * - An ancestor stacking context caps the field at that context's level, so
 *   content in a higher stacking context (for example a sticky header with a
 *   higher z-index) can paint over the scrim.
 * - The docked panel is `position: absolute`, so an ancestor with
 *   `overflow: hidden` or `auto` can clip it.
 * - A page that is itself inside a narrow iframe (480px or less) uses full
 *   screen, because the iframe is its window.
 */
export interface SearchFieldProps {
  /** Text to display as the field label */
  label?: string
  /** Determines where the label appears. COLLAPSED hides the label visually but keeps it as the input's accessible name */
  labelPosition?: SAILLabelPosition
  /** Supplemental text about this field */
  instructions?: string
  /** Accessible name when there is no label. When there is a label, this is read as a description instead */
  accessibilityText?: string
  /** Text to display in the input when it is empty */
  placeholder?: string
  /** Text in the input. When set, the field is controlled: update it from onChange. Unlike TextField, omitting `value` makes the field uncontrolled */
  value?: string
  /** Not in SAIL. Initial text when the field is not controlled (no `value`) */
  defaultValue?: string
  /** Callback with the full text each time the user types (React-style alias for saveInto). onChange wins if both are set */
  onChange?: (value: string) => void
  /** Callback with the full text each time the user types */
  saveInto?: (value: string) => void
  /**
   * Not in SAIL. Callback with the current text when the user presses Enter in
   * the input. When set, Enter does not submit an enclosing `<form>`.
   */
  onSubmit?: (value: string) => void
  /**
   * Not in SAIL. Lucide icon name (kebab-case, for example "mic") shown at the
   * end of the input. Decorative (hidden from assistive tech, not clickable)
   * unless `onEndIconClick` is set. SAIL names icon parameters `icon` and
   * `iconPosition` ("START" or "END"), which is where start and end come from.
   * Hidden while the results are full screen (480px and under), where the
   * field's close button takes the end of the bar, so there is only one X. So
   * in full screen there is no clear button or other end action.
   */
  endIcon?: string | null
  /**
   * Not in SAIL. Makes the end icon a button. Called when the user
   * activates it by click, Enter or Space. Has no effect without
   * `endIcon`. The field moves focus to the input first, so keyboard
   * focus is not lost if the consumer removes the icon (for example, a clear
   * button that sets the value to an empty string). The field does not change
   * its own value or call `onChange`.
   */
  onEndIconClick?: () => void
  /**
   * Not in SAIL. Accessible name of the end icon button (like SAIL's
   * `altText` and `iconAltText` on icons), for example
   * "Clear search". Not translated by the library: pass the text in the
   * user's language. Only used with `onEndIconClick`. If missing, the
   * button is named with the library default ("Search action").
   */
  endIconAltText?: string
  /**
   * Determines the corner shape of the input. Not in SAIL on `a!textField`:
   * the values match SAIL's `shape` on `a!cardLayout`, but the default here is
   * "SEMI_ROUNDED" (SAIL cards default to "SQUARED"). Default: "SEMI_ROUNDED"
   */
  shape?: SearchShape
  /**
   * Not in SAIL. Shows the results (the `children`). Controlled only by this
   * prop: the field never changes it. Pair with `onDismiss`. Docked by
   * default: the panel opens below the input and a scrim covers the page
   * behind it (the page still scrolls). Without `onDismiss` there is no scrim
   * and no close button. At 480px and under the field and results cover the
   * whole window instead (see the component doc). Unlike SAIL's `isCollapsible` and
   * `isInitiallyCollapsed` on `a!boxLayout` and `a!sectionLayout`, this is a
   * controlled flag with no built-in toggle. Opening the results is not
   * announced to screen readers: see `children`.
   */
  expanded?: boolean
  /**
   * Not in SAIL. Results to show in the panel when `expanded` is true. Use
   * focusable rows (links or buttons) so keyboard users can reach them.
   * The field does not know how many results there are, so it does not
   * announce them. Render a visually hidden polite live region next to the
   * field, outside it, for example
   * `<span className="sr-only" aria-live="polite">5 suggestions</span>`.
   * Keep it always in the DOM: screen readers announce changes to an
   * existing live region, but usually not one inserted with its text, and
   * the children mount only while the panel is open. Set its text when the
   * panel opens and while the results change, and empty it when it closes.
   * The live region keeps working in full screen, because the view is not
   * `aria-modal`.
   */
  children?: React.ReactNode
  /**
   * Not in SAIL. Called when the user asks to close the results: Escape,
   * focus moving outside the field, a click on the scrim or a press outside
   * the field while docked, or the close (X) button in full screen. The field
   * does not close itself: set `expanded` to false. Without `onDismiss` there
   * is no scrim and no close button.
   */
  onDismiss?: () => void
  /** Determines if the field should display as grayed out. The results panel is hidden and Enter is ignored */
  disabled?: boolean
  /** Determines whether component is displayed */
  showWhen?: boolean
  /** Space added above component */
  marginAbove?: SAILMarginSize
  /** Space added below component */
  marginBelow?: SAILMarginSize
  /** Additional Tailwind classes for prototype-specific styling (not part of SAIL API) */
  className?: string
}

// Complete class strings so Tailwind generates them
// ps-9 / pe-9 leave room for an icon, pe-3 is the plain text padding
// INTERACTIVE leaves room for the 32px-wide end icon button (end-1 + w-8 = 36px)
const endPaddingMap = { WITH_ICON: 'pe-9', INTERACTIVE: 'pe-10', PLAIN: 'pe-3' }
// End icon button: 32px wide; inset-y-1 makes it 8px shorter than the input
// (32 x 31px in a 39px input), above WCAG 2.5.8's 24px minimum. Gray-600 icon
// (4.6:1 on white; WCAG 1.4.11 needs 3:1)
const endButtonClasses = [
  'absolute inset-y-1 end-1 w-8 flex items-center justify-center rounded-sm cursor-pointer',
  'text-gray-600 hover:bg-gray-100 hover:text-gray-800',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
  'disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-gray-600'
].join(' ')
// Close (X) button of the full-screen view: 40 x 40px, above WCAG 2.5.8's 24px
// minimum. Hidden except at 480px and under. Gray-700 icon on white
const closeButtonClasses = [
  'hidden size-10 shrink-0 items-center justify-center rounded-sm cursor-pointer',
  'text-gray-700 hover:bg-gray-100 hover:text-gray-900',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500'
].join(' ')
// Docked scrim: Sailwind black at 30%, over the page and under the field
const scrimBaseClasses = 'fixed inset-0 bg-black/30'

// Full screen at SAIL's PHONE width (480px or less). Tailwind's max-[Npx] is
// exclusive (width < N), so "480 or less" is max-[481px]. The query is the one
// Tailwind writes for max-[481px] in the built CSS. It uses the classic syntax,
// not the range syntax `(width < 481px)`, which needs Chrome 104 or Safari 16.4:
// older browsers would read it as no match and dismiss a full-screen view on an
// outside press. Keep the query and the classes in step.
const FULL_SCREEN_QUERY = 'not all and (min-width: 481px)'
// Complete literal class strings so Tailwind generates them
const fullScreenClasses = {
  /** Container, while open */
  view: 'max-[481px]:fixed max-[481px]:inset-0 max-[481px]:flex max-[481px]:flex-col max-[481px]:bg-white',
  /** Header row, while open */
  header: 'max-[481px]:p-2 max-[481px]:border-b',
  /** Input, while open */
  input: 'max-[481px]:pe-3',
  /** Results panel */
  panel: 'max-[481px]:static max-[481px]:mt-0 max-[481px]:flex-1 max-[481px]:max-h-none max-[481px]:border-0 max-[481px]:shadow-none max-[481px]:rounded-none',
  /** Scrim and end icon, while open */
  hide: 'max-[481px]:hidden',
  /** Close button */
  show: 'max-[481px]:flex'
} as const

// True when the window is 480px or less right now. Reads the live width, so call
// it from an event handler or effect, never during render. False without window
// or matchMedia (SSR, jsdom), which means docked.
const isFullScreenNow = (): boolean =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia(FULL_SCREEN_QUERY).matches

const renderIcon = (name: string | null | undefined): React.ReactNode => {
  if (!name) return null
  // Convert kebab-case to PascalCase (e.g., 'arrow-right' -> 'ArrowRight')
  const iconName = name
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('')
  const IconComponent = (LucideIcons as unknown as Record<string, LucideIcon | undefined>)[iconName]
  if (!IconComponent) {
    console.warn(`Icon "${name}" not found in Lucide icons`)
    return null
  }
  return <IconComponent size={16} aria-hidden="true" />
}

export const SearchField: React.FC<SearchFieldProps> = ({
  label,
  labelPosition = "ABOVE",
  instructions,
  accessibilityText,
  placeholder,
  value,
  defaultValue = "",
  onChange,
  saveInto,
  onSubmit,
  endIcon,
  onEndIconClick,
  endIconAltText,
  shape = "SEMI_ROUNDED",
  expanded = false,
  children,
  onDismiss,
  disabled = false,
  showWhen = true,
  marginAbove = "NONE",
  marginBelow = "STANDARD",
  className
}) => {
  const { t } = useI18n()
  const baseId = React.useId()
  const inputId = `searchfield-${baseId}`
  const panelId = `${inputId}-results`
  const accessibilityTextId = `${inputId}-accessibility-text`
  const containerRef = React.useRef<HTMLDivElement>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [internalValue, setInternalValue] = React.useState(defaultValue)

  const isControlled = value !== undefined
  const currentValue = isControlled ? value : internalValue
  const hasResults = children !== null && children !== undefined && children !== false
  const showPanel = expanded && !disabled && hasResults
  // The scrim and the close button only render when a click on them can close the results
  const canDismiss = showPanel && !!onDismiss

  // Close on a pointer press outside the field while docked. Only listens while
  // there is something to dismiss. A press on the scrim is inside the field and
  // is handled by its click. A full-screen view covers the window, so a press
  // outside it is on something layered above it, or may start a scroll.
  React.useEffect(() => {
    if (!showPanel || !onDismiss) return
    const handlePointerDown = (e: PointerEvent) => {
      const container = containerRef.current
      if (container && e.target instanceof Node && !container.contains(e.target)) {
        if (isFullScreenNow()) return
        onDismiss()
      }
    }
    document.addEventListener('pointerdown', handlePointerDown)
    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [showPanel, onDismiss])

  // A full-screen view opened from elsewhere (a separate trigger) would hide
  // the focused control behind it, so move focus to the input. Docked opening
  // does not cover the trigger and leaves focus alone.
  React.useEffect(() => {
    if (!showPanel) return
    if (containerRef.current?.contains(document.activeElement)) return
    if (isFullScreenNow()) inputRef.current?.focus()
  }, [showPanel])

  // Visibility control
  if (!showWhen) return null

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value
    if (!isControlled) setInternalValue(next)
    const handler = onChange || saveInto
    if (handler) handler(next)
  }

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Safari ends an IME composition before the Enter keydown, so isComposing is
    // already false. keyCode 229 marks a key the IME handled
    const isImeKey = e.nativeEvent.isComposing || e.keyCode === 229
    if (e.key !== 'Enter' || isImeKey || disabled || !onSubmit) return
    // Keep an enclosing form from also submitting
    e.preventDefault()
    onSubmit(e.currentTarget.value)
  }

  const handleEndIconClick = () => {
    if (disabled) return
    // Focus the input first: the consumer may remove the icon (clear button),
    // which would unmount this button and drop keyboard focus to the page
    inputRef.current?.focus()
    onEndIconClick?.()
  }

  // Focus the input first, so focus is not dropped when the button unmounts
  const handleClose = () => {
    inputRef.current?.focus()
    onDismiss?.()
  }

  // The press already blurred the input (null relatedTarget, no dismiss), so
  // focus ends on the page, as after any click on plain page content
  const handleScrimClick = () => onDismiss?.()

  const handleContainerKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'Escape' || !showPanel || !onDismiss) return
    // Stop type="search" from clearing the text natively
    e.preventDefault()
    if (e.target !== inputRef.current) inputRef.current?.focus()
    onDismiss()
  }

  const handleContainerBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    if (!showPanel || !onDismiss) return
    const next = e.relatedTarget as Node | null
    // A null relatedTarget (clicking plain text in the panel, window blur) must not dismiss
    if (next && !e.currentTarget.contains(next)) onDismiss()
  }

  const endElement = renderIcon(endIcon)
  const endIsButton = !!endElement && !!onEndIconClick

  // Docked above 480px. The full-screen classes make the open results cover
  // the window at 480px and under. view, header, input and hide only apply
  // while open, so a closed field on a phone looks like any other
  const openClass = (part: 'view' | 'header' | 'input' | 'hide') =>
    showPanel ? fullScreenClasses[part] : ''

  const inputClasses = [
    'w-full text-base py-2 border border-gray-300 bg-white',
    'placeholder:text-gray-700',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:border-transparent',
    // Hide the browser's own clear button; it overlaps the end icon and differs per browser
    '[&::-webkit-search-cancel-button]:appearance-none',
    shapeMap[shape],
    // Room for the search icon
    'ps-9',
    endPaddingMap[endIsButton ? 'INTERACTIVE' : endElement ? 'WITH_ICON' : 'PLAIN'],
    disabled && 'bg-gray-100 text-gray-700 cursor-not-allowed',
    openClass('input')
  ].filter(Boolean).join(' ')

  // While open, z-50 makes the container a stacking context above the page.
  // Inside it the scrim paints first and the header row and panel above it
  const containerClasses = [
    'relative',
    showPanel && 'z-50',
    openClass('view')
  ].filter(Boolean).join(' ')
  const headerClasses = [
    'relative flex items-center gap-2 border-gray-300',
    openClass('header')
  ].filter(Boolean).join(' ')
  const endHideClass = openClass('hide')
  const panelClasses = [
    'absolute start-0 end-0 top-full mt-1',
    'bg-white border border-gray-300 shadow-lg max-h-80 overflow-y-auto overscroll-contain',
    shapeMap[shape],
    fullScreenClasses.panel
  ].join(' ')
  const scrimClasses = [scrimBaseClasses, endHideClass].filter(Boolean).join(' ')
  const closeClasses = `${closeButtonClasses} ${fullScreenClasses.show}`

  // The label names the input when it is visible. Otherwise aria-label does.
  const hasVisibleLabel = !!label && labelPosition !== "COLLAPSED"
  const ariaLabel = hasVisibleLabel
    ? undefined
    : (label || accessibilityText || t(KEYS.searchLabel))
  const describedBy = [
    label && accessibilityText && accessibilityTextId,
    instructions && `${inputId}-instructions`
  ].filter(Boolean).join(' ') || undefined

  return (
    <FieldWrapper
      label={label}
      labelPosition={labelPosition}
      instructions={instructions}
      inputId={inputId}
      marginAbove={marginAbove}
      marginBelow={marginBelow}
      className={className}
    >
      {/* The container anchors the docked panel and becomes the full-screen view.
          The header row holds the icon row and the close button. The icon row
          anchors the icons and must not contain the panel, or a full-screen
          panel would stretch the icons' box. */}
      <div
        ref={containerRef}
        className={containerClasses}
        onKeyDown={handleContainerKeyDown}
        onBlur={handleContainerBlur}
      >
        {canDismiss && (
          // Not focusable and hidden from assistive tech: Escape and the close
          // button are the keyboard and screen reader ways to close
          <div aria-hidden="true" className={scrimClasses} onClick={handleScrimClick} />
        )}
        <div className={headerClasses}>
          <div className="relative flex-1 min-w-0">
            {label && accessibilityText && <span id={accessibilityTextId} hidden>{accessibilityText}</span>}
            <span
              className="absolute inset-y-0 start-3 flex items-center pointer-events-none text-gray-500"
              aria-hidden="true"
            >
              <Search size={16} aria-hidden="true" />
            </span>
            <input
              ref={inputRef}
              id={inputId}
              type="search"
              enterKeyHint="search"
              className={inputClasses}
              value={currentValue}
              placeholder={placeholder}
              disabled={disabled}
              aria-label={ariaLabel}
              aria-describedby={describedBy}
              aria-controls={showPanel ? panelId : undefined}
              onChange={handleChange}
              onKeyDown={handleInputKeyDown}
            />
            {endElement && endIsButton && (
              <button
                type="button"
                className={[endButtonClasses, endHideClass].filter(Boolean).join(' ')}
                aria-label={endIconAltText || t(KEYS.searchEndAction)}
                disabled={disabled}
                onClick={handleEndIconClick}
              >
                {endElement}
              </button>
            )}
            {endElement && !endIsButton && (
              <span
                className={['absolute inset-y-0 end-3 flex items-center pointer-events-none text-gray-500', endHideClass].filter(Boolean).join(' ')}
                aria-hidden="true"
              >
                {endElement}
              </span>
            )}
          </div>
          {canDismiss && (
            <button
              type="button"
              className={closeClasses}
              aria-label={t(KEYS.searchClose)}
              onClick={handleClose}
            >
              <X size={20} aria-hidden="true" />
            </button>
          )}
        </div>
        {showPanel && (
          <div
            id={panelId}
            role="group"
            aria-label={t(KEYS.searchResults)}
            className={panelClasses}
          >
            {children}
          </div>
        )}
      </div>
    </FieldWrapper>
  )
}
