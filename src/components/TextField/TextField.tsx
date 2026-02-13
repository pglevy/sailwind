import * as React from 'react'
import { FieldWrapper } from '../shared/FieldWrapper'
import type { SAILLabelPosition, SAILMarginSize } from '../../types/sail'

/**
 * Text alignment options for the input field
 */
type TextAlign = "LEFT" | "CENTER" | "RIGHT"

/**
 * Input purpose for autocomplete hints (accessibility)
 */
type InputPurpose =
  | "NAME"
  | "EMAIL"
  | "PHONE_NUMBER"
  | "STREET_ADDRESS"
  | "POSTAL_CODE"
  | "COUNTRY"
  | "CREDIT_CARD_NUMBER"
  | "FIRST_NAME"
  | "LAST_NAME"
  | "DOB"
  | "OFF"

/**
 * Refresh timing for when the interface updates with saved value
 */
type RefreshAfter = "KEYPRESS" | "UNFOCUS"

/**
 * Props for the TextField component
 * Based on SAIL a!textField() parameters
 */
export interface TextFieldProps {
  /** Text to display as the field label */
  label?: string
  /** Supplemental text about this field */
  instructions?: string
  /** Determines if a value is required to submit the form */
  required?: boolean
  /** Determines if the field should display as not editable */
  readOnly?: boolean
  /** Determines if the field should display as potentially editable but grayed out */
  disabled?: boolean
  /** Text to display in the text field */
  value?: string
  /** Validation errors to display below the field when the value is not null */
  validations?: string[]
  /** Callback when the user changes the text */
  saveInto?: (value: string) => void
  /** Callback when the user changes the text (React-style alias for saveInto) */
  onChange?: (value: string) => void
  /** Determines when the interface is refreshed with the saved value */
  refreshAfter?: RefreshAfter
  /** When present, the requiredness of the field is only evaluated when a button in the same validation group is pressed */
  validationGroup?: string
  /** Custom message to display when the field's value is required and not provided */
  requiredMessage?: string
  /** Determines alignment of the text value */
  align?: TextAlign
  /** Determines where the label appears */
  labelPosition?: SAILLabelPosition
  /** Text to display in the field when it is empty */
  placeholder?: string
  /** Displays a help icon with the specified text as a tooltip */
  helpTooltip?: string
  /** Determines if the value is obscured from view (password field) */
  masked?: boolean
  /** Additional text to be announced by screen readers */
  accessibilityText?: string
  /** Determines whether the component is displayed on the interface */
  showWhen?: boolean
  /** Indicates the intent of input for accessibility improvements */
  inputPurpose?: InputPurpose
  /** Determines the maximum number of characters */
  characterLimit?: number
  /** Determines if the character count displays on the text field */
  showCharacterCount?: boolean
  /** Determines how much space is added above the component */
  marginAbove?: SAILMarginSize
  /** Determines how much space is added below the component */
  marginBelow?: SAILMarginSize
}

/**
 * TextField - Single line text input component
 *
 * Displays and allows entry of a single line of text.
 * Maps to SAIL a!textField() function.
 *
 */
export const TextField: React.FC<TextFieldProps> = ({
  label,
  instructions,
  required = false,
  readOnly = false,
  disabled = false,
  value = "",
  validations = [],
  saveInto,
  onChange,
  // refreshAfter = "UNFOCUS", // Not used in React (controlled components update immediately)
  validationGroup,
  requiredMessage,
  align = "LEFT",
  labelPosition = "ABOVE",
  placeholder,
  helpTooltip,
  masked = false,
  accessibilityText,
  showWhen = true,
  inputPurpose,
  characterLimit,
  showCharacterCount = true,
  marginAbove = "NONE",
  marginBelow = "STANDARD",
}) => {
  // Visibility control
  if (!showWhen) return null

  // Generate unique ID for label association
  const inputId = React.useMemo(() => `textfield-${Math.random().toString(36).substr(2, 9)}`, [])

  // Map SAIL text alignment to Tailwind classes
  const alignMap: Record<TextAlign, string> = {
    LEFT: 'text-left',
    CENTER: 'text-center',
    RIGHT: 'text-right'
  }

  // Map inputPurpose to autocomplete attribute
  const autoCompleteMap: Record<InputPurpose, string> = {
    NAME: 'name',
    EMAIL: 'email',
    PHONE_NUMBER: 'tel',
    STREET_ADDRESS: 'street-address',
    POSTAL_CODE: 'postal-code',
    COUNTRY: 'country',
    CREDIT_CARD_NUMBER: 'cc-number',
    FIRST_NAME: 'given-name',
    LAST_NAME: 'family-name',
    DOB: 'bday',
    OFF: 'off'
  }

  // Build input classes
  const inputClasses = [
    'w-full',
    'text-base',
    alignMap[align],
    // ReadOnly mode: no border, no background, no padding (inline display)
    readOnly && 'border-none bg-transparent p-0',
    // Normal mode: standard input styling
    !readOnly && 'px-3 py-2 border border-gray-200 rounded-sm bg-white',
    !readOnly && 'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
    // Disabled state
    disabled && 'bg-gray-100 text-gray-700 cursor-not-allowed',
    // Error state
    validations.length > 0 && 'border-red-700 focus:ring-red-700'
  ].filter(Boolean).join(' ')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const handler = onChange || saveInto
    if (handler) {
      handler(e.target.value)
    }
  }

  const handleBlur = () => {
    // In SAIL, UNFOCUS triggers a save. For React, we're already saving on every change
    // This is here for potential future use if we need to differentiate behavior
  }

  // Show validation errors
  const showValidations = validations.length > 0 && value !== ""

  // Show required message if field is required, empty, and no other validations
  const showRequiredMessage = required && !value && requiredMessage && validations.length === 0

  // Render the input element
  const inputElement = (
    <div className="relative">
      <input
        id={inputId}
        type={masked ? "password" : "text"}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={readOnly ? undefined : placeholder}
        disabled={disabled}
        readOnly={readOnly}
        maxLength={characterLimit}
        autoComplete={inputPurpose ? autoCompleteMap[inputPurpose] : undefined}
        className={inputClasses}
        aria-invalid={validations.length > 0}
        aria-describedby={
          validations.length > 0
            ? `${inputId}-error`
            : instructions
              ? `${inputId}-instructions`
              : undefined
        }
        aria-label={accessibilityText || (labelPosition === "COLLAPSED" ? label : undefined)}
        data-validation-group={validationGroup}
      />

      {/* Character count - inside input border */}
      {characterLimit && showCharacterCount && !readOnly && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-700 pointer-events-none">
          {value.length} / {characterLimit}
        </span>
      )}
    </div>
  )

  // Footer content (validations and required message)
  const footerContent = (
    <>
      {/* Validation errors */}
      {showValidations && (
        <div id={`${inputId}-error`} className="mt-2" role="alert">
          {validations.map((validation, i) => (
            <p key={i} className="text-sm text-red-700">{validation}</p>
          ))}
        </div>
      )}

      {/* Required message */}
      {showRequiredMessage && (
        <p className="text-sm text-red-700 mt-2" role="alert">
          {requiredMessage}
        </p>
      )}
    </>
  )

  return (
    <FieldWrapper
      label={label}
      labelPosition={labelPosition}
      required={required}
      instructions={instructions}
      helpTooltip={helpTooltip}
      accessibilityText={accessibilityText}
      inputId={inputId}
      marginAbove={marginAbove}
      marginBelow={marginBelow}
      footer={footerContent}
    >
      {inputElement}
    </FieldWrapper>
  )
}
