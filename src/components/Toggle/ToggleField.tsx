import * as React from 'react'
import * as Switch from '@radix-ui/react-switch'
import { Info } from 'lucide-react'
import { FieldWrapper } from '../shared/FieldWrapper'
import type { SAILMarginSize } from '../../types/sail'

/**
 * Displays a toggle (switch) for boolean input
 * Maps to SAIL's a!toggleField()
 */
export interface ToggleFieldProps {
  /** Text to display as the label next to the toggle */
  choiceLabel?: string
  /** Determines if a value is required to submit the form */
  required?: boolean
  /** Determines if the field should display as grayed out */
  disabled?: boolean
  /** Current checked state (true = on, false = off) */
  value?: boolean
  /** Validation errors to display below the field */
  validations?: string[]
  /** Callback when the user toggles the switch */
  saveInto?: (value: boolean) => void
  /** Callback when the user toggles the switch (React-style alias for saveInto) */
  onChange?: (value: boolean) => void
  /** Validation group name (no spaces) */
  validationGroup?: string
  /** Custom message when field is required and not provided */
  requiredMessage?: string
  /** Displays a help icon next to the choice label with tooltip text */
  helpTooltip?: string
  /** Additional text for screen readers */
  accessibilityText?: string
  /** Determines whether component is displayed */
  showWhen?: boolean
  /** Space added above component */
  marginAbove?: SAILMarginSize
  /** Space added below component */
  marginBelow?: SAILMarginSize
  /** Determines whether the toggle appears on the left or right of the choice label. Valid values: "START" (default), "END" */
  choicePosition?: "START" | "END"
  /** Additional Tailwind classes for prototype-specific styling (not part of SAIL API) */
  className?: string
}

export const ToggleField: React.FC<ToggleFieldProps> = ({
  choiceLabel,
  required = false,
  disabled = false,
  value = false,
  validations = [],
  saveInto,
  onChange,
  validationGroup: _validationGroup,
  requiredMessage,
  helpTooltip,
  accessibilityText,
  showWhen = true,
  marginAbove = "NONE",
  marginBelow = "STANDARD",
  choicePosition = "START",
  className
}) => {
  // Visibility control
  if (!showWhen) return null

  const inputId = `togglefield-${Math.random().toString(36).substring(2, 11)}`

  const handleChange = (checked: boolean) => {
    const handler = onChange || saveInto
    if (handler && !disabled) {
      handler(checked)
    }
  }

  // Show validation errors
  const showValidations = validations.length > 0

  // Show required message (default per SAIL docs: "Enable the toggle to continue")
  const resolvedRequiredMessage = requiredMessage || "Enable the toggle to continue"
  const showRequiredMessage = required && !value

  // The Radix switch control (fixed STANDARD size, ACCENT color)
  const switchControl = (
    <Switch.Root
      id={inputId}
      checked={value}
      onCheckedChange={handleChange}
      disabled={disabled}
      required={required}
      className={[
        'h-6 w-11',
        'shrink-0 relative rounded-full transition-colors border-2',
        'data-[state=unchecked]:bg-white data-[state=unchecked]:border-gray-300',
        'hover:data-[state=unchecked]:bg-gray-100',
        'data-[state=checked]:bg-blue-500',
        'data-[state=checked]:border-transparent',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2'
      ].join(' ')}
      aria-label={accessibilityText || choiceLabel}
      aria-invalid={showValidations}
      aria-errormessage={showValidations ? `${inputId}-error` : undefined}
    >
      <Switch.Thumb
        className={[
          'h-4 w-4 data-[state=checked]:translate-x-5.5',
          'block rounded-full bg-white shadow-lg transition-transform border border-gray-500 data-[state=checked]:border-transparent',
          'translate-x-0.5',
          'flex items-center justify-center'
        ].join(' ')}
      >
        {value && (
          <svg viewBox="0 0 12 12" fill="none" className="w-2/3 h-2/3" aria-hidden="true">
            <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              className="text-blue-500"
            />
          </svg>
        )}
      </Switch.Thumb>
    </Switch.Root>
  )

  // Inline label element (rendered next to the switch control)
  const inlineLabel = choiceLabel ? (
    <label
      htmlFor={inputId}
      className={[
        'text-base',
        'inline-flex items-center gap-1 font-medium text-gray-900 select-none',
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      ].join(' ')}
    >
      {choiceLabel}
      {required && <span className="text-red-700" aria-label="required">*</span>}
      {helpTooltip && (
        <span className="text-gray-700 cursor-help inline-flex items-center" title={helpTooltip} aria-label="help">
          <Info size={14} />
        </span>
      )}
    </label>
  ) : null

  // The switch + inline label row
  // choicePosition="START" means toggle appears on the left of the label
  // choicePosition="END" means toggle appears on the right of the label
  const switchElement = (
    <div className="flex items-center gap-3">
      {choicePosition === "END" ? (
        <>
          {inlineLabel}
          {switchControl}
        </>
      ) : (
        <>
          {switchControl}
          {inlineLabel}
        </>
      )}
    </div>
  )

  // Footer content (validations and required message)
  const footerContent = (
    <>
      {showValidations && (
        <div id={`${inputId}-error`} className="mt-2" role="alert">
          {validations.map((validation, i) => (
            <p key={i} className="text-sm text-red-700">{validation}</p>
          ))}
        </div>
      )}

      {showRequiredMessage && (
        <p className="text-sm text-red-700 mt-2" role="alert">
          {resolvedRequiredMessage}
        </p>
      )}
    </>
  )

  // Use FieldWrapper without a label — we handle the label inline
  return (
    <FieldWrapper
      labelPosition="COLLAPSED"
      accessibilityText={accessibilityText || choiceLabel}
      inputId={inputId}
      marginAbove={marginAbove}
      marginBelow={marginBelow}
      footer={footerContent}
      className={className}
    >
      {switchElement}
    </FieldWrapper>
  )
}
