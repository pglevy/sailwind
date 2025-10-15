import * as React from 'react'
import * as Progress from '@radix-ui/react-progress'
import type { SAILLabelPosition, SAILMarginSize } from '../../types/sail'
import { FieldLabel } from '../shared/FieldLabel'

export type ProgressBarColor = "ACCENT" | "POSITIVE" | "NEGATIVE" | "WARN" | string
export type ProgressBarStyle = "THIN" | "THICK"

export interface ProgressBarProps {
  /** Text to display as the field label */
  label?: string
  /** Supplemental text about this field */
  instructions?: string
  /** Number to display between 0 and 100 */
  percentage: number
  /** Determines where the label appears */
  labelPosition?: SAILLabelPosition
  /** Help tooltip text */
  helpTooltip?: string
  /** Additional text for screen readers only */
  accessibilityText?: string
  /** Progress bar color - semantic values or hex color */
  color?: ProgressBarColor
  /** Whether the component is displayed */
  showWhen?: boolean
  /** Thickness of the progress bar */
  style?: ProgressBarStyle
  /** Whether to display the percentage text */
  showPercentage?: boolean
  /** Space above the component */
  marginAbove?: SAILMarginSize
  /** Space below the component */
  marginBelow?: SAILMarginSize
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  label,
  instructions,
  percentage,
  labelPosition = "ABOVE",
  helpTooltip,
  accessibilityText,
  color = "ACCENT",
  showWhen = true,
  style = "THIN",
  showPercentage = true,
  marginAbove = "NONE",
  marginBelow = "STANDARD"
}) => {
  // Visibility control
  if (!showWhen) return null

  // Clamp percentage between 0 and 100 for display, but show actual value in text
  const clampedPercentage = Math.max(0, Math.min(100, percentage))
  const displayPercentage = Math.round(percentage)

  // Generate unique ID for accessibility
  const progressId = React.useId()

  // Styling maps using standard Tailwind classes
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

  const styleMap: Record<ProgressBarStyle, { height: string; textSize: string }> = {
    THIN: { height: 'h-2', textSize: 'text-sm' },
    THICK: { height: 'h-6', textSize: 'text-base' }
  }

  // Semantic color mappings
  const colorMap: Record<string, string> = {
    ACCENT: 'bg-blue-500',
    POSITIVE: 'bg-green-700',
    NEGATIVE: 'bg-red-700',
    WARN: 'bg-yellow-500'
  }

  // Determine progress bar color
  const isSemanticColor = color in colorMap
  const progressColor = isSemanticColor ? colorMap[color] : ''

  // Build CSS classes
  const containerClasses = [
    marginAboveMap[marginAbove],
    marginBelowMap[marginBelow]
  ].filter(Boolean).join(' ')

  const progressBarClasses = [
    'relative',
    'overflow-hidden',
    'bg-gray-300',
    'rounded-sm',
    styleMap[style].height
  ].join(' ')

  const progressIndicatorClasses = [
    'h-full',
    'transition-transform',
    'duration-300',
    'ease-in-out',
    isSemanticColor ? progressColor : 'bg-gray-500'
  ].join(' ')

  // Inline styles for custom colors
  const indicatorStyle: React.CSSProperties = {}
  if (!isSemanticColor && color) {
    indicatorStyle.backgroundColor = color
  }

  return (
    <div className={containerClasses}>
      <FieldLabel
        label={label}
        labelPosition={labelPosition}
        helpTooltip={helpTooltip}
        htmlFor={progressId}
        accessibilityText={accessibilityText}
      />

      <div className="relative">
        <Progress.Root
          id={progressId}
          className={progressBarClasses}
          value={clampedPercentage}
          max={100}
        >
          <Progress.Indicator
            className={progressIndicatorClasses}
            style={{
              width: `${clampedPercentage}%`,
              ...indicatorStyle
            }}
          />
        </Progress.Root>

        {/* Percentage overlaid for THICK style */}
        {showPercentage && style === "THICK" && clampedPercentage > 15 && (
          <div 
            className="absolute inset-y-0 flex items-center pr-2"
            style={{ left: '0', width: `${clampedPercentage}%` }}
          >
            <div className="w-full flex justify-end">
              <span className={`${styleMap[style].textSize} font-semibold text-white`}>
                {displayPercentage}%
              </span>
            </div>
          </div>
        )}
        
        {/* Fallback for very low percentages */}
        {showPercentage && style === "THICK" && clampedPercentage <= 15 && (
          <div className="absolute inset-0 flex items-center justify-start pl-3">
            <span className={`${styleMap[style].textSize} font-semibold text-black`}>
              {displayPercentage}%
            </span>
          </div>
        )}
      </div>

      {/* Instructions and THIN percentage below bar */}
      {(instructions || (showPercentage && style === "THIN")) && (
        <div className="flex justify-between items-start mt-1">
          <div className="flex-1">
            {instructions && (
              <p className="text-gray-700 text-sm">{instructions}</p>
            )}
          </div>
          {showPercentage && style === "THIN" && (
            <span className={`${styleMap[style].textSize} font-semibold text-black ml-4`}>
              {displayPercentage}%
            </span>
          )}
        </div>
      )}

      {/* Screen reader only text */}
      {accessibilityText && (
        <span className="sr-only">{accessibilityText}</span>
      )}
    </div>
  )
}
