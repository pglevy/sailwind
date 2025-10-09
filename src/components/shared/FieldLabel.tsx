import * as React from 'react'
import type { SAILLabelPosition } from '../../types/sail'

export interface FieldLabelProps {
  /** The label text to display */
  label?: string
  /** Position of the label relative to the field */
  labelPosition?: SAILLabelPosition
  /** Whether the field is required (shows asterisk) */
  required?: boolean
  /** Helper text displayed below the label */
  instructions?: string
  /** Tooltip text for additional help */
  helpTooltip?: string
  /** HTML for attribute to associate label with input */
  htmlFor?: string
  /** Screen reader text when label is collapsed */
  accessibilityText?: string
}

/**
 * Shared label component used across SAIL form fields
 * Handles all label positioning modes: ABOVE, ADJACENT, COLLAPSED, JUSTIFIED
 */
export const FieldLabel: React.FC<FieldLabelProps> = ({
  label,
  labelPosition = "ABOVE",
  required = false,
  instructions,
  helpTooltip,
  htmlFor,
  accessibilityText
}) => {
  // If no label or accessibility text, render nothing
  if (!label && !accessibilityText) return null

  // COLLAPSED: Label is hidden visually but available to screen readers
  if (labelPosition === "COLLAPSED") {
    return <span className="sr-only">{label || accessibilityText}</span>
  }

  const labelClasses = [
    'text-sail-standard',
    'font-medium',
    'text-gray-5',
    labelPosition === "ABOVE" && 'block mb-sail-less',
    labelPosition === "ADJACENT" && 'inline-block mr-sail-standard',
    labelPosition === "JUSTIFIED" && 'block mb-sail-less', // Similar to ABOVE for now
  ].filter(Boolean).join(' ')

  return (
    <div className={labelPosition === "ADJACENT" ? "inline-block" : "block"}>
      <label htmlFor={htmlFor} className={labelClasses}>
        {label}
        {required && <span className="text-red-4 ml-1" aria-label="required">*</span>}
        {helpTooltip && (
          <span
            className="ml-2 text-gray-4 cursor-help"
            title={helpTooltip}
            aria-label="help"
          >
            ℹ️
          </span>
        )}
      </label>
      {instructions && (
        <p className="text-gray-4 text-sm mt-sail-even-less mb-sail-less">
          {instructions}
        </p>
      )}
    </div>
  )
}
