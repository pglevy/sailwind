import * as React from 'react'
import { Check, ChevronDown, ChevronRight } from 'lucide-react'
import { FieldLabel } from '../shared/FieldLabel'
import type { SAILLabelPosition, SAILMarginSize, SAILColorInput } from '../../types/sail'
import { mergeClasses } from '../../utils/classNames'
import { isPaletteColor, resolveColorClass, resolveColorToHex, getContrastColor, getAccessibleTextColor } from '../../utils/colorResolver'
import { marginAboveMap, marginBelowMap } from '../../utils/sailMaps'

type Orientation = "HORIZONTAL" | "VERTICAL"

/**
 * Step indicator styles.
 *
 * - `NUMBERED` (default) — numbered/checked circles joined by progress connectors,
 *   with an optional "STEP n" caption and status text under each label.
 * - `MINIMAL` — compact chevron-separated row; only the current step is highlighted
 *   as a pill and completed steps get a check.
 * - `LINE` / `DOT` / `CHEVRON` — original Sailwind styles, kept for compatibility.
 */
type StepStyle = "LINE" | "CHEVRON" | "DOT" | "NUMBERED" | "MINIMAL"

type StepState = 'completed' | 'current' | 'future'

type Color = "ACCENT" | "POSITIVE" | "NEGATIVE" | "WARN" | SAILColorInput

export interface MilestoneFieldProps {
  /** Text to display as the field label */
  label?: string
  /** Supplemental text about this field */
  instructions?: string
  /** Array of labels describing the sequence of steps */
  steps: string[]
  /** Array of links to apply to the steps */
  links?: any[]
  /** Index of the current step. When null, all steps are future. When -1, all steps are completed */
  active?: number | null
  /** Determines where the label appears */
  labelPosition?: SAILLabelPosition
  /** Displays a help icon with tooltip text */
  helpTooltip?: string
  /** Determines whether the component is displayed */
  showWhen?: boolean
  /** Determines the layout of the milestone steps */
  orientation?: Orientation
  /** Additional text for screen readers */
  accessibilityText?: string
  /** Determines the fill color of the current step */
  color?: Color
  /** Determines the fill color of completed steps (NUMBERED and MINIMAL styles) */
  completedColor?: Color
  /** Determines how much space is added above the layout */
  marginAbove?: SAILMarginSize
  /** Determines how much space is added below the layout */
  marginBelow?: SAILMarginSize
  /** Determines the style of the milestone steps */
  stepStyle?: StepStyle
  /** NUMBERED style only: show the "STEP n" caption above each step label */
  showStepNumbers?: boolean
  /** NUMBERED style only: show status text ("Completed"/"In Progress"/"Pending") below each label */
  showStepStatus?: boolean
  /**
   * Status wording used for visible status text and screen reader announcements.
   * Override for different terminology or localization.
   */
  statusLabels?: { completed?: string; current?: string; future?: string }
  /** Additional Tailwind classes for prototype-specific styling (not part of SAIL API) */
  className?: string
}

const DEFAULT_STATUS_LABELS = {
  completed: 'Completed',
  current: 'In Progress',
  future: 'Pending'
}

/** Fallback fills for semantic colors that aren't in the shared semantic map */
const semanticHexOverrides: Record<string, string> = {
  WARN: '#FFD948' // yellow-500 — pairs with black text for contrast
}

/**
 * Resolve any accepted color value to a fill hex, an accessible foreground hex for
 * text sitting on that fill, and an accessible variant for using the color as text
 * on a white surface.
 */
const resolveFill = (colorValue: Color, fallback: string) => {
  const hex =
    semanticHexOverrides[colorValue as string] ??
    resolveColorToHex(colorValue as string) ??
    fallback
  return {
    background: hex,
    foreground: getContrastColor(hex),
    onSurface: getAccessibleTextColor(hex)
  }
}

/**
 * Displays the completed, current, and future steps of a process or sequence
 *
 * Accessibility: steps are rendered as an ordered list so assistive technology
 * announces position ("2 of 5"), the current step carries `aria-current="step"`,
 * and every step exposes its state as text so state is never conveyed by color alone.
 */
export const MilestoneField: React.FC<MilestoneFieldProps> = ({
  label,
  instructions,
  steps,
  links = [],
  active = null,
  labelPosition = "ABOVE",
  helpTooltip,
  showWhen = true,
  orientation = "HORIZONTAL",
  accessibilityText,
  color = "ACCENT",
  completedColor = "POSITIVE",
  marginAbove = "NONE",
  marginBelow = "STANDARD",
  stepStyle = "NUMBERED",
  showStepNumbers = true,
  showStepStatus = true,
  statusLabels,
  className: classNameProp
}) => {
  const fieldId = React.useId()

  // Visibility control
  if (!showWhen) return null

  const status = { ...DEFAULT_STATUS_LABELS, ...statusLabels }

  // Map semantic colors to Tailwind classes
  const getColorClasses = (colorValue: Color) => {
    const semanticColorMap: Record<string, { bg: string; text: string; border: string; chevronL: string; chevronT: string; }> = {
      ACCENT: { bg: 'bg-blue-50', text: 'text-blue-500', border: 'border-blue-200', chevronL: 'border-l-blue-50', chevronT: 'border-t-blue-50' },
      POSITIVE: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', chevronL: 'border-l-green-50', chevronT: 'border-t-green-50' },
      NEGATIVE: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', chevronL: 'border-l-red-50', chevronT: 'border-t-red-50' },
      WARN: { bg: 'bg-yellow-50', text: 'text-yellow-800', border: 'border-yellow-300', chevronL: 'border-l-yellow-50', chevronT: 'border-t-yellow-50' }
    }

    if (semanticColorMap[colorValue]) {
      return {
        ...semanticColorMap[colorValue],
        style: undefined
      }
    }

    // Handle palette colors
    if (isPaletteColor(colorValue)) {
      return {
        bg: resolveColorClass(colorValue, 'bg'),
        text: resolveColorClass(colorValue, 'text'),
        border: resolveColorClass(colorValue, 'border'),
        chevronL: '',
        chevronT: '',
        style: undefined
      }
    }

    // Handle hex colors
    return {
      bg: '',
      text: '',
      border: '',
      chevronL: '',
      chevronT: '',
      style: { backgroundColor: colorValue, borderColor: colorValue, color: colorValue }
    }
  }

  const colorClasses = getColorClasses(color)

  // Solid fills used by the NUMBERED and MINIMAL styles
  const currentFill = resolveFill(color, '#2322F0')      // blue-500
  const completedFill = resolveFill(completedColor, '#357A38') // green-700

  // Determine step states
  const getStepState = (index: number): StepState => {
    if (active === null) return 'future'
    if (active === -1) return 'completed'
    if (index < active) return 'completed'
    if (index === active) return 'current'
    return 'future'
  }

  const statusFor = (state: StepState) => status[state]

  const isNewStyle = stepStyle === "NUMBERED" || stepStyle === "MINIMAL"

  /** Circular indicator shared by NUMBERED (and reused at a smaller size by MINIMAL) */
  const renderIndicator = (state: StepState, stepNumber: number, size: 'sm' | 'md') => {
    const box = size === 'md' ? 'h-7 w-7 text-xs' : 'h-5 w-5 text-[11px]'
    const iconSize = size === 'md' ? 14 : 12

    if (state === 'completed') {
      return (
        <span
          className={`${box} flex shrink-0 items-center justify-center rounded-full font-semibold`}
          style={{ backgroundColor: completedFill.background, color: completedFill.foreground }}
          aria-hidden="true"
        >
          <Check size={iconSize} strokeWidth={3} />
        </span>
      )
    }

    if (state === 'current') {
      return (
        <span
          className={`${box} flex shrink-0 items-center justify-center rounded-full font-semibold`}
          style={{ backgroundColor: currentFill.background, color: currentFill.foreground }}
          aria-hidden="true"
        >
          {stepNumber}
        </span>
      )
    }

    return (
      <span
        className={`${box} flex shrink-0 items-center justify-center rounded-full border-2 border-gray-700 bg-white font-semibold text-gray-700`}
        aria-hidden="true"
      >
        {stepNumber}
      </span>
    )
  }

  /** Connector between two NUMBERED steps. Solid once passed, dashed while pending. */
  const renderConnector = (state: StepState, direction: Orientation) => {
    const passed = state === 'completed'
    const base = direction === "HORIZONTAL"
      ? 'mx-2 h-0 flex-1 border-t-2'
      : 'my-1 w-0 flex-1 border-l-2 self-center'

    return (
      <span
        className={`${base} ${passed ? '' : 'border-dashed border-gray-200'}`}
        style={passed ? { borderColor: completedFill.background } : undefined}
        aria-hidden="true"
      />
    )
  }

  /** Text block used by NUMBERED */
  const renderNumberedText = (step: string, index: number, state: StepState) => (
    <div className={orientation === "HORIZONTAL" ? 'mt-2 pr-4' : 'pb-6'}>
      {showStepNumbers && (
        <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-700">
          {`Step ${index + 1}`}
        </p>
      )}
      <p
        className={`text-base ${state === 'future' ? 'font-normal text-gray-700' : 'font-semibold text-gray-900'}`}
      >
        {step}
      </p>
      {showStepStatus ? (
        <p
          className="text-xs font-medium"
          style={
            state === 'completed'
              ? { color: completedFill.onSurface }
              : state === 'current'
              ? { color: currentFill.onSurface }
              : undefined
          }
        >
          <span className={state === 'future' ? 'text-gray-700' : undefined}>{statusFor(state)}</span>
        </p>
      ) : (
        <span className="sr-only">{statusFor(state)}</span>
      )}
    </div>
  )

  /** Step body for the NUMBERED style */
  const renderNumberedStep = (step: string, index: number, state: StepState) => {
    if (orientation === "VERTICAL") {
      return (
        <div className="flex gap-3">
          <div className="flex flex-col items-center self-stretch">
            {renderIndicator(state, index + 1, 'md')}
            {index < steps.length - 1 && renderConnector(state, "VERTICAL")}
          </div>
          {renderNumberedText(step, index, state)}
        </div>
      )
    }

    return (
      <div>
        <div className="flex items-center">
          {renderIndicator(state, index + 1, 'md')}
          {index < steps.length - 1 && renderConnector(state, "HORIZONTAL")}
        </div>
        {renderNumberedText(step, index, state)}
      </div>
    )
  }

  /** Step body for the MINIMAL style */
  const renderMinimalStep = (step: string, index: number, state: StepState) => {
    if (state === 'current') {
      return (
        <span className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 shadow-sm">
          {renderIndicator(state, index + 1, 'sm')}
          <span className="text-base font-semibold text-gray-900">{step}</span>
          <span className="sr-only">{statusFor(state)}</span>
        </span>
      )
    }

    return (
      <span className="inline-flex items-center gap-2 px-1 py-1.5">
        {state === 'completed' && renderIndicator(state, index + 1, 'sm')}
        <span className="text-base text-gray-700">{step}</span>
        <span className="sr-only">{statusFor(state)}</span>
      </span>
    )
  }

  // Render individual step (original DOT / LINE / CHEVRON styles)
  const renderLegacyStepContent = (step: string, index: number, state: StepState) => {
    const stepNumber = index + 1

    return (
      <div className={`flex ${
        stepStyle === "DOT" && orientation === "VERTICAL"
          ? "items-start"
          : stepStyle === "CHEVRON"
          ? "items-center"
          : "flex-col items-center"
      } ${orientation === "VERTICAL" ? "relative" : ""}`}>
        {/* Step indicator */}
        <div className="flex items-center justify-center relative">
          {stepStyle === "DOT" && (
            <>
              <div
                className={`w-3 h-3 rounded-full border-2 relative z-10 flex-shrink-0 ${
                  state === 'completed'
                    ? `${colorClasses.bg} ${colorClasses.border}`
                    : state === 'current'
                    ? `bg-white ${colorClasses.border}`
                    : 'bg-gray-200 border-gray-300'
                }`}
                style={colorClasses.style ? {
                  backgroundColor: state === 'completed'
                    ? colorClasses.style.backgroundColor
                    : state === 'current'
                    ? 'white'
                    : undefined,
                  borderColor: (state === 'completed' || state === 'current')
                    ? colorClasses.style.borderColor
                    : undefined
                } : undefined}
                aria-hidden="true"
              />
              {/* Vertical connector line */}
              {orientation === "VERTICAL" && index < steps.length - 1 && (
                <div
                  className={`absolute top-3 left-1.5 w-0.5 h-[32px] transform -translate-x-px ${
                    state === 'completed' ? colorClasses.bg || 'bg-gray-400' : 'bg-gray-200'
                  }`}
                  style={colorClasses.style && state === 'completed' ? {
                    backgroundColor: colorClasses.style.backgroundColor
                  } : undefined}
                  aria-hidden="true"
                />
              )}
            </>
          )}

          {stepStyle === "LINE" && (
            <div
              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-semibold relative z-10 ${
                state === 'completed' || state === 'current'
                  ? `${colorClasses.bg} ${colorClasses.border} text-gray-900`
                  : 'bg-gray-200 border-gray-300 text-gray-700'
              }`}
              style={colorClasses.style ? {
                backgroundColor: state === 'completed' || state === 'current' ? colorClasses.style.backgroundColor : undefined,
                borderColor: state === 'completed' || state === 'current' ? colorClasses.style.borderColor : undefined,
                color: state === 'completed' || state === 'current' ? 'white' : undefined
              } : undefined}
              aria-hidden="true"
            >
              {stepNumber}
            </div>
          )}

          {stepStyle === "CHEVRON" && (
            <div className="relative flex items-center">
              <div
                className={`px-4 py-2 text-base font-medium relative ${
                  state === 'completed' || state === 'current'
                    ? `${colorClasses.bg} text-gray-900`
                    : 'bg-gray-200 text-gray-700'
                }`}
                style={colorClasses.style && (state === 'completed' || state === 'current') ? {
                  backgroundColor: colorClasses.style.backgroundColor,
                  color: 'white'
                } : undefined}
              >
                {step}
              </div>
              {/* Chevron arrow point */}
              {orientation === "HORIZONTAL" && index < steps.length - 1 && (
                <div
                  className={`w-0 h-0 border-l-[16px] border-y-[20px] border-y-transparent relative z-10 ${
                    state === 'completed' || state === 'current'
                      ? colorClasses.chevronL
                      : 'border-l-gray-200'
                  }`}
                  style={colorClasses.style && (state === 'completed' || state === 'current') ? {
                    borderLeftColor: colorClasses.style.backgroundColor
                  } : undefined}
                  aria-hidden="true"
                />
              )}
              {/* Chevron arrow for vertical */}
              {orientation === "VERTICAL" && index < steps.length - 1 && (
                <div
                  className={`absolute -bottom-2 left-4 w-0 h-0 border-t-[16px] border-x-[20px] border-x-transparent ${
                    state === 'completed' || state === 'current'
                      ? colorClasses.chevronT
                      : 'border-t-gray-200'
                  }`}
                  style={colorClasses.style && (state === 'completed' || state === 'current') ? {
                    borderTopColor: colorClasses.style.backgroundColor
                  } : undefined}
                  aria-hidden="true"
                />
              )}
            </div>
          )}
        </div>

        {/* Step label (for DOT and LINE styles) */}
        {stepStyle !== "CHEVRON" && (
          <span
            className={`${
              stepStyle === "DOT" && orientation === "VERTICAL"
                ? "ml-3 text-base leading-3"
                : "mt-2 text-base text-center"
            } ${
              state === 'current' ? 'font-semibold' : 'font-normal'
            } ${
              state === 'completed' || state === 'current'
                ? colorClasses.text || 'text-gray-900'
                : 'text-gray-700'
            }`}
            style={colorClasses.style && (state === 'completed' || state === 'current') ? {
              color: colorClasses.style.color
            } : undefined}
          >
            {step}
          </span>
        )}

        {/* State is exposed as text so it is never conveyed by color alone */}
        <span className="sr-only">{statusFor(state)}</span>
      </div>
    )
  }

  const renderStepContent = (step: string, index: number, state: StepState) => {
    if (stepStyle === "NUMBERED") return renderNumberedStep(step, index, state)
    if (stepStyle === "MINIMAL") return renderMinimalStep(step, index, state)
    return renderLegacyStepContent(step, index, state)
  }

  // Render one list item, wrapping in a button when the step is linked
  const renderStep = (step: string, index: number) => {
    const state = getStepState(index)
    const link = links[index]
    const content = renderStepContent(step, index, state)

    const itemClasses = [
      stepStyle === "NUMBERED" && orientation === "HORIZONTAL" ? 'min-w-0 flex-1' : '',
      stepStyle === "LINE" && orientation === "HORIZONTAL" ? 'flex-1' : ''
    ].filter(Boolean).join(' ')

    return (
      <li
        key={index}
        className={itemClasses || undefined}
        aria-current={state === 'current' ? 'step' : undefined}
      >
        {link ? (
          <button
            type="button"
            onClick={() => {
              const handler = link.onClick || link.saveInto
              if (handler && typeof handler === 'function') {
                handler(link.value)
              }
            }}
            className="w-full rounded-sm text-left transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
            aria-label={`${step}, ${statusFor(state)}, step ${index + 1} of ${steps.length}`}
          >
            {content}
          </button>
        ) : (
          content
        )}
      </li>
    )
  }

  const sailContainerClasses = [
    marginAboveMap[marginAbove],
    marginBelowMap[marginBelow],
  ].filter(Boolean).join(' ')

  const containerClasses = mergeClasses(sailContainerClasses, classNameProp)

  // Class names for the <ol> of steps, per style + orientation
  const listClasses = (() => {
    if (stepStyle === "NUMBERED") {
      return orientation === "HORIZONTAL" ? 'flex items-start' : 'flex flex-col'
    }
    if (stepStyle === "MINIMAL") {
      return orientation === "HORIZONTAL"
        ? 'flex flex-wrap items-center gap-x-1 gap-y-2'
        : 'flex flex-col items-start gap-y-1'
    }
    if (orientation === "HORIZONTAL") {
      return stepStyle === "CHEVRON" ? 'flex items-center' : 'flex items-start'
    }
    return stepStyle === "CHEVRON" ? 'flex flex-col space-y-4' : 'flex flex-col space-y-8'
  })()

  // Screen reader summary of overall position
  const progressSummary = (() => {
    if (active === null) return `Not started. ${steps.length} steps.`
    if (active === -1) return `All ${steps.length} steps completed.`
    if (active >= 0 && active < steps.length) {
      return `Step ${active + 1} of ${steps.length}: ${steps[active]}.`
    }
    return `${steps.length} steps.`
  })()

  const separatorIcon = orientation === "HORIZONTAL"
    ? <ChevronRight size={16} strokeWidth={2} />
    : <ChevronDown size={16} strokeWidth={2} />

  return (
    <div className={containerClasses}>
      <FieldLabel
        label={label}
        labelPosition={labelPosition}
        helpTooltip={helpTooltip}
        htmlFor={fieldId}
        accessibilityText={accessibilityText}
      />

      <div
        id={fieldId}
        role="group"
        aria-label={accessibilityText || label || "Progress"}
        className={orientation === "HORIZONTAL" ? "relative" : undefined}
      >
        <p className="sr-only">{progressSummary}</p>

        {/* Continuous progress bar for horizontal LINE style */}
        {orientation === "HORIZONTAL" && stepStyle === "LINE" && steps.length > 1 && (
          <div
            className="absolute top-3 h-0.5 bg-gray-200 z-0"
            style={{
              left: `calc(100% / ${steps.length} / 2)`,
              right: `calc(100% / ${steps.length} / 2)`
            }}
            aria-hidden="true"
          >
            <div
              className={`h-full transition-all duration-300 ${colorClasses.bg || 'bg-gray-400'}`}
              style={{
                width: active === null ? '0%' : active === -1 ? '100%' : `${(active / (steps.length - 1)) * 100}%`,
                ...(colorClasses.style ? { backgroundColor: colorClasses.style.backgroundColor } : {})
              }}
            />
          </div>
        )}

        {/* Steps list — an ordered list so position is announced by assistive tech */}
        <ol className={`list-none p-0 m-0 ${listClasses}`}>
          {steps.map((step, index) => (
            stepStyle === "MINIMAL" && index > 0 ? (
              <React.Fragment key={index}>
                <li aria-hidden="true" className="flex items-center px-1 text-gray-700">
                  {separatorIcon}
                </li>
                {renderStep(step, index)}
              </React.Fragment>
            ) : (
              renderStep(step, index)
            )
          ))}
        </ol>
      </div>

      {/* Instructions */}
      {instructions && (
        <p className={`text-gray-700 text-sm ${isNewStyle ? 'mt-2' : 'mt-1'}`}>
          {instructions}
        </p>
      )}
    </div>
  )
}
