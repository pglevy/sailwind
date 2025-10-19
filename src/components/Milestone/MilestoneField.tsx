import * as React from 'react'
import { FieldLabel } from '../shared/FieldLabel'
import type { SAILLabelPosition, SAILMarginSize } from '../../types/sail'

type Orientation = "HORIZONTAL" | "VERTICAL"
type StepStyle = "LINE" | "CHEVRON" | "DOT"
type Color = "ACCENT" | "POSITIVE" | "NEGATIVE" | "WARN" | string

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
  /** Determines the fill color */
  color?: Color
  /** Determines how much space is added above the layout */
  marginAbove?: SAILMarginSize
  /** Determines how much space is added below the layout */
  marginBelow?: SAILMarginSize
  /** Determines the style of the milestone steps */
  stepStyle?: StepStyle
}

/**
 * Displays the completed, current, and future steps of a process or sequence
 * 
 * @example
 * <MilestoneField
 *   label="Home Repair Claim Process"
 *   instructions="Customer #2325691"
 *   steps={["Submit Request", "Set Up Appointment", "File Assessment", "Submit Proposal"]}
 *   active={2}
 *   color="ACCENT"
 * />
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
  marginAbove = "NONE",
  marginBelow = "STANDARD",
  stepStyle = "LINE"
}) => {
  // Visibility control
  if (!showWhen) return null

  const fieldId = `milestone-${Math.random().toString(36).slice(2, 11)}`

  // Map SAIL margin values to Tailwind classes
  const marginAboveMap: Record<SAILMarginSize, string> = {
    NONE: 'mt-0',
    EVEN_LESS: 'mt-1',
    LESS: 'mt-2',
    STANDARD: 'mt-4',
    MORE: 'mt-6',
    EVEN_MORE: 'mt-8'
  }

  const marginBelowMap: Record<SAILMarginSize, string> = {
    NONE: 'mb-0',
    EVEN_LESS: 'mb-1',
    LESS: 'mb-2',
    STANDARD: 'mb-4',
    MORE: 'mb-6',
    EVEN_MORE: 'mb-8'
  }

  // Map semantic colors to Tailwind classes
  const getColorClasses = (colorValue: Color) => {
    const semanticColorMap: Record<string, { bg: string; text: string; border: string }> = {
      ACCENT: { bg: 'bg-blue-500', text: 'text-blue-500', border: 'border-blue-500' },
      POSITIVE: { bg: 'bg-green-700', text: 'text-green-700', border: 'border-green-700' },
      NEGATIVE: { bg: 'bg-red-700', text: 'text-red-700', border: 'border-red-700' },
      WARN: { bg: 'bg-yellow-500', text: 'text-yellow-500', border: 'border-yellow-500' }
    }

    if (semanticColorMap[colorValue]) {
      return {
        ...semanticColorMap[colorValue],
        style: undefined
      }
    }

    // Handle hex colors
    return {
      bg: '',
      text: '',
      border: '',
      style: { backgroundColor: colorValue, borderColor: colorValue, color: colorValue }
    }
  }

  const colorClasses = getColorClasses(color)

  // Determine step states
  const getStepState = (index: number): 'completed' | 'current' | 'future' => {
    if (active === null) return 'future'
    if (active === -1) return 'completed'
    if (index < active) return 'completed'
    if (index === active) return 'current'
    return 'future'
  }

  // Render individual step
  const renderStep = (step: string, index: number) => {
    const state = getStepState(index)
    const link = links[index]
    const stepNumber = index + 1

    const stepContent = (
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
                />
              )}
            </>
          )}

          {stepStyle === "LINE" && (
            <div
              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-semibold relative z-10 ${
                state === 'completed' || state === 'current'
                  ? `${colorClasses.bg} ${colorClasses.border} text-white`
                  : 'bg-gray-200 border-gray-300 text-gray-600'
              }`}
              style={colorClasses.style ? {
                backgroundColor: state === 'completed' || state === 'current' ? colorClasses.style.backgroundColor : undefined,
                borderColor: state === 'completed' || state === 'current' ? colorClasses.style.borderColor : undefined,
                color: state === 'completed' || state === 'current' ? 'white' : undefined
              } : undefined}
            >
              {stepNumber}
            </div>
          )}

          {stepStyle === "CHEVRON" && (
            <div className="relative flex items-center">
              <div
                className={`px-4 py-2 text-base font-medium relative ${
                  state === 'completed' || state === 'current'
                    ? `${colorClasses.bg} text-white`
                    : 'bg-gray-200 text-gray-600'
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
                      ? colorClasses.border
                      : 'border-l-gray-200'
                  }`}
                  style={colorClasses.style && (state === 'completed' || state === 'current') ? {
                    borderLeftColor: colorClasses.style.backgroundColor
                  } : undefined}
                />
              )}
              {/* Chevron arrow for vertical */}
              {orientation === "VERTICAL" && index < steps.length - 1 && (
                <div
                  className={`absolute -bottom-2 left-4 w-0 h-0 border-t-[16px] border-x-[20px] border-x-transparent ${
                    state === 'completed' || state === 'current'
                      ? colorClasses.border
                      : 'border-t-gray-200'
                  }`}
                  style={colorClasses.style && (state === 'completed' || state === 'current') ? {
                    borderTopColor: colorClasses.style.backgroundColor
                  } : undefined}
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
                : 'text-gray-500'
            }`}
            style={colorClasses.style && (state === 'completed' || state === 'current') ? {
              color: colorClasses.style.color
            } : undefined}
          >
            {step}
          </span>
        )}
      </div>
    )

    // Wrap with link if provided
    if (link) {
      return (
        <button
          key={index}
          onClick={() => {
            const handler = link.onClick || link.saveInto
            if (handler && typeof handler === 'function') {
              handler(link.value)
            }
          }}
          className={`text-left hover:opacity-80 transition-opacity ${
            orientation === "HORIZONTAL" && stepStyle === "LINE" ? "flex-1" : ""
          }`}
          aria-label={`${step} - Step ${stepNumber}`}
        >
          {stepContent}
        </button>
      )
    }

    return (
      <div
        key={index}
        aria-label={`${step} - Step ${stepNumber}`}
        className={orientation === "HORIZONTAL" && stepStyle === "LINE" ? "flex-1" : ""}
      >
        {stepContent}
      </div>
    )
  }

  const containerClasses = [
    marginAboveMap[marginAbove],
    marginBelowMap[marginBelow],
  ].filter(Boolean).join(' ')

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
        className={orientation === "HORIZONTAL" ? "relative" : "flex flex-col"}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={steps.length - 1}
        aria-valuenow={active ?? 0}
        aria-valuetext={active !== null && active >= 0 && active < steps.length ? steps[active] : undefined}
      >
        {/* Continuous progress bar for horizontal LINE style */}
        {orientation === "HORIZONTAL" && stepStyle === "LINE" && steps.length > 1 && (
          <div
            className="absolute top-3 h-0.5 bg-gray-200 z-0"
            style={{
              left: `calc(100% / ${steps.length} / 2)`,
              right: `calc(100% / ${steps.length} / 2)`
            }}
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

        {/* Steps container */}
        <div className={
          orientation === "HORIZONTAL"
            ? stepStyle === "CHEVRON"
              ? "flex items-center"
              : "flex items-start"
            : stepStyle === "CHEVRON"
            ? "flex flex-col space-y-4"
            : "flex flex-col space-y-8"
        }>
          {steps.map((step, index) => renderStep(step, index))}
        </div>
      </div>

      {/* Instructions */}
      {instructions && (
        <p className="text-gray-700 text-sm mt-1">
          {instructions}
        </p>
      )}
    </div>
  )
}
