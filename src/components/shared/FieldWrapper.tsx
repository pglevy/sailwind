import * as React from 'react'
import { FieldLabel } from './FieldLabel'
import type { SAILLabelPosition, SAILMarginSize } from '../../types/sail'

export interface FieldWrapperProps {
  /** The label text to display */
  label?: string
  /** Position of the label relative to the field */
  labelPosition?: SAILLabelPosition
  /** Whether the field is required (shows asterisk) */
  required?: boolean
  /** Helper text displayed below the input */
  instructions?: string
  /** Tooltip text for additional help */
  helpTooltip?: string
  /** Screen reader text when label is collapsed */
  accessibilityText?: string
  /** HTML ID for the input element (for label association) */
  inputId: string
  /** Determines how much space is added above the component */
  marginAbove?: SAILMarginSize
  /** Determines how much space is added below the component */
  marginBelow?: SAILMarginSize
  /** The input/control element to render */
  children: React.ReactNode
  /** Optional additional content below instructions (validation errors, etc.) */
  footer?: React.ReactNode
}

/**
 * Shared wrapper component for all SAIL form fields
 * Handles consistent layout for: label + input + instructions + validation
 *
 * This component is used internally by TextField, CheckboxField, DropdownField, etc.
 * End users never see this - they just use the individual field components.
 */
export const FieldWrapper: React.FC<FieldWrapperProps> = ({
  label,
  labelPosition = "ABOVE",
  required = false,
  instructions,
  helpTooltip,
  accessibilityText,
  inputId,
  marginAbove = "NONE",
  marginBelow = "STANDARD",
  children,
  footer
}) => {
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

  const containerClasses = [
    marginAboveMap[marginAbove],
    marginBelowMap[marginBelow],
  ].filter(Boolean).join(' ')

  // ADJACENT layout: label and input side-by-side
  if (labelPosition === "ADJACENT") {
    return (
      <div className={containerClasses}>
        <div className="flex items-center gap-4">
          <FieldLabel
            label={label}
            labelPosition={labelPosition}
            required={required}
            helpTooltip={helpTooltip}
            htmlFor={inputId}
            accessibilityText={accessibilityText}
          />

          <div className="flex-1">
            {children}
          </div>
        </div>

        {/* Instructions - below input */}
        {instructions && (
          <p id={`${inputId}-instructions`} className="text-gray-700 text-sm mt-1">
            {instructions}
          </p>
        )}

        {/* Additional footer content (validations, etc.) */}
        {footer}
      </div>
    )
  }

  // Default layout: label above input (ABOVE, COLLAPSED, JUSTIFIED)
  return (
    <div className={containerClasses}>
      <FieldLabel
        label={label}
        labelPosition={labelPosition}
        required={required}
        helpTooltip={helpTooltip}
        htmlFor={inputId}
        accessibilityText={accessibilityText}
      />

      {children}

      {/* Instructions - below input */}
      {instructions && (
        <p id={`${inputId}-instructions`} className="text-gray-700 text-sm mt-1">
          {instructions}
        </p>
      )}

      {/* Additional footer content (validations, etc.) */}
      {footer}
    </div>
  )
}
