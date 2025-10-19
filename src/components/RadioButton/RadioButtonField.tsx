import * as React from 'react'
import { FieldWrapper } from '../shared/FieldWrapper'
import type { SAILLabelPosition, SAILMarginSize } from '../../types/sail'

type ChoiceLayout = "STACKED" | "COMPACT"
type ChoiceStyle = "STANDARD" | "CARDS"
type Spacing = "STANDARD" | "MORE" | "EVEN_MORE"
type ChoicePosition = "START" | "END"

/**
 * Displays a set of radio buttons for single-select input
 * Maps to SAIL a!radioButtonField()
 */
export interface RadioButtonFieldProps {
  /** Text to display as the field label */
  label?: string
  /** Supplemental text about this field */
  instructions?: string
  /** Determines if a value is required to submit the form */
  required?: boolean
  /** Determines if the field should display as grayed out */
  disabled?: boolean
  /** Array of options for the user to select */
  choiceLabels: any[]
  /** Array of values associated with the corresponding choices */
  choiceValues: any[]
  /** Value of choice to display as selected */
  value?: any
  /** Validation errors to display below the field */
  validations?: string[]
  /** Callback when the user changes the selection */
  saveInto?: (value: any) => void
  /** Callback when the user changes the selection (React-style alias for saveInto) */
  onChange?: (value: any) => void
  /** Validation group name (no spaces) */
  validationGroup?: string
  /** Custom message when field is required and not provided */
  requiredMessage?: string
  /** Determines where the label appears */
  labelPosition?: SAILLabelPosition
  /** Determines the layout of choices */
  choiceLayout?: ChoiceLayout
  /** Displays a help icon with tooltip text */
  helpTooltip?: string
  /** Additional text for screen readers */
  accessibilityText?: string
  /** Determines whether component is displayed */
  showWhen?: boolean
  /** Determines how choices are displayed */
  choiceStyle?: ChoiceStyle
  /** Determines space between options */
  spacing?: Spacing
  /** Data source (record type) - not implemented in prototype */
  data?: any
  /** Sort configurations - not implemented in prototype */
  sort?: any[]
  /** Space added above component */
  marginAbove?: SAILMarginSize
  /** Space added below component */
  marginBelow?: SAILMarginSize
  /** Determines whether radio buttons appear on left or right */
  choicePosition?: ChoicePosition
}

export const RadioButtonField: React.FC<RadioButtonFieldProps> = ({
  label,
  instructions,
  required = false,
  disabled = false,
  choiceLabels,
  choiceValues,
  value,
  validations = [],
  saveInto,
  onChange,
  validationGroup: _validationGroup,
  requiredMessage,
  labelPosition = "ABOVE",
  choiceLayout = "STACKED",
  helpTooltip,
  accessibilityText,
  showWhen = true,
  choiceStyle = "STANDARD",
  spacing = "STANDARD",
  data: _data,
  sort: _sort,
  marginAbove = "NONE",
  marginBelow = "STANDARD",
  choicePosition
}) => {
  // Visibility control
  if (!showWhen) return null

  const inputId = `radiobuttonfield-${Math.random().toString(36).substr(2, 9)}`

  // Auto default for choicePosition: START for STANDARD, END for CARDS
  const effectiveChoicePosition = choicePosition ?? (choiceStyle === "CARDS" ? "END" : "START")

  // Map SAIL spacing values to Tailwind classes
  const spacingMap: Record<Spacing, string> = {
    STANDARD: choiceLayout === "STACKED" ? 'gap-2' : 'gap-4',
    MORE: choiceLayout === "STACKED" ? 'gap-4' : 'gap-6',
    EVEN_MORE: choiceLayout === "STACKED" ? 'gap-6' : 'gap-8'
  }

  const radioLabelGapMap: Record<Spacing, string> = {
    STANDARD: 'gap-2',
    MORE: 'gap-4',
    EVEN_MORE: 'gap-6'
  }

  const handleChange = (choiceValue: any) => {
    const handler = onChange || saveInto
    if (!handler) return
    handler(choiceValue)
  }

  // Show validation errors
  const showValidations = validations.length > 0

  // Show required message
  const showRequiredMessage = required && value === undefined && requiredMessage

  // Render radio buttons
  const radioButtonsElement = (
    <div
      className={[
        choiceLayout === "STACKED" ? 'flex flex-col' : 'flex flex-wrap',
        spacingMap[spacing]
      ].filter(Boolean).join(' ')}
      role="radiogroup"
      aria-describedby={instructions ? `${inputId}-instructions` : undefined}
      aria-required={required}
    >
      {choiceLabels.map((choiceLabel, index) => {
        const choiceValue = choiceValues[index]
        const isChecked = value === choiceValue
        const choiceId = `${inputId}-choice-${index}`

        // Base classes for each choice item container
        const itemContainerClasses = [
          'flex',
          'items-center',
          radioLabelGapMap[spacing],
          effectiveChoicePosition === "END" && 'flex-row-reverse',
          choiceStyle === "CARDS" && 'border border-gray-200 rounded-sm p-4 hover:border-blue-500 transition-colors cursor-pointer',
          choiceStyle === "CARDS" && isChecked && 'border-blue-500 bg-blue-50',
          disabled && 'opacity-50 cursor-not-allowed'
        ].filter(Boolean).join(' ')

        return (
          <div
            key={index}
            className={itemContainerClasses}
            onClick={(e) => {
              // Allow clicking anywhere on card to select (except on the radio itself)
              if (choiceStyle === "CARDS" && !disabled) {
                const target = e.target as HTMLElement
                // Don't trigger if clicking directly on the input (it has its own handler)
                if (target.tagName !== 'INPUT') {
                  handleChange(choiceValue)
                }
              }
            }}
          >
            <input
              id={choiceId}
              type="radio"
              name={inputId}
              checked={isChecked}
              disabled={disabled}
              onChange={() => handleChange(choiceValue)}
              className={[
                'h-4 w-4 border-gray-200 text-blue-500 focus:ring-blue-500',
                disabled ? 'cursor-not-allowed' : 'cursor-pointer'
              ].filter(Boolean).join(' ')}
              aria-invalid={showValidations}
              aria-errormessage={showValidations ? `${inputId}-error` : undefined}
            />
            <label
              htmlFor={choiceId}
              className={[
                'text-base text-gray-900',
                choiceStyle === "CARDS" && 'flex-1',
                disabled ? 'cursor-not-allowed' : 'cursor-pointer'
              ].filter(Boolean).join(' ')}
            >
              {choiceLabel}
            </label>
          </div>
        )
      })}
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
      {radioButtonsElement}
    </FieldWrapper>
  )
}
