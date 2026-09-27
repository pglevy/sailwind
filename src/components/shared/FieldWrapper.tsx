import * as React from 'react'
import { FieldLabel } from './FieldLabel'
import { useLocale } from '../../i18n'
import type { SAILLabelPosition, SAILMarginSize } from '../../types/sail'
import { mergeClasses } from '../../utils/classNames'
import { marginAboveMap, marginBelowMap } from '../../utils/sailMaps'

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
  /** Additional Tailwind classes for prototype-specific styling (not part of SAIL API) */
  className?: string
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
  footer,
  className
}) => {
  const sailClasses = [
    marginAboveMap[marginAbove],
    marginBelowMap[marginBelow],
  ].filter(Boolean).join(' ')

  const containerClasses = mergeClasses(sailClasses, className)

  // RTL / Text_Direction consumption pattern (Requirement 9.1):
  // Read the active reading direction from the nearest LocaleProvider and apply
  // it to the outermost wrapper element. The attribute is emitted CONDITIONALLY —
  // `'rtl'` for RTL locales, `undefined` (i.e. no `dir` attribute at all) for
  // LTR. Because v1 ships only en-us (LTR), this produces zero DOM change for the
  // shipped locale: no `dir` attribute is rendered. Do NOT hardcode `dir="ltr"`.
  // This wires the direction signal into the DOM; full layout mirroring
  // (spacing/margins) is intentionally out of scope for v1.
  const { direction } = useLocale()
  const dir = direction === 'RTL' ? 'rtl' : undefined

  // ADJACENT layout: label and input side-by-side
  if (labelPosition === "ADJACENT") {
    return (
      <div className={containerClasses} dir={dir}>
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
    <div className={containerClasses} dir={dir}>
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
