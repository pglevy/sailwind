import * as React from 'react'
import { FieldWrapper } from '../shared/FieldWrapper'
import type { SAILLabelPosition, SAILMarginSize, SAILAlignLegacy } from '../../types/sail'
import { legacyAlignMap } from '../../utils/sailMaps'

type ChoiceLayout = "STACKED" | "COMPACT"
type ChoiceStyle = "STANDARD" | "CARDS"
type Spacing = "STANDARD" | "MORE" | "EVEN_MORE"
type ChoicePosition = "START" | "END"

/**
 * Displays a set of checkboxes for multi-select input
 * Maps to SAIL a!checkboxField()
 */
export interface CheckboxFieldProps {
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
  /** Values of choices to display as selected */
  value?: any[]
  /** Validation errors to display below the field */
  validations?: string[]
  /** Callback when the user changes the selections */
  saveInto?: (value: any[]) => void
  /** Callback when the user changes the selections (React-style alias for saveInto) */
  onChange?: (value: any[]) => void
  /** Validation group name (no spaces) */
  validationGroup?: string
  /** Custom message when field is required and not provided */
  requiredMessage?: string
  /** Determines alignment of choice labels. Use with Grid Layout */
  align?: SAILAlignLegacy
  /** Determines where the label appears */
  labelPosition?: SAILLabelPosition
  /** Displays a help icon with tooltip text */
  helpTooltip?: string
  /** Determines the layout of choices */
  choiceLayout?: ChoiceLayout
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
  /** Determines whether checkboxes appear on left or right */
  choicePosition?: ChoicePosition
  /** Additional Tailwind classes for prototype-specific styling (not part of SAIL API) */
  className?: string
}

export const CheckboxField: React.FC<CheckboxFieldProps> = ({
  label,
  instructions,
  required = false,
  disabled = false,
  choiceLabels,
  choiceValues,
  value = [],
  validations = [],
  saveInto,
  onChange,
  validationGroup: _validationGroup,
  requiredMessage,
  align,
  labelPosition = "ABOVE",
  helpTooltip,
  choiceLayout = "STACKED",
  accessibilityText,
  showWhen = true,
  choiceStyle = "STANDARD",
  spacing = "STANDARD",
  data: _data,
  sort: _sort,
  marginAbove = "NONE",
  marginBelow = "STANDARD",
  choicePosition,
  className
}) => {
  // Visibility control
  if (!showWhen) return null

  const inputId = `checkboxfield-${Math.random().toString(36).substr(2, 9)}`

  // Auto default for choicePosition: START for STANDARD, END for CARDS
  const effectiveChoicePosition = choicePosition ?? (choiceStyle === "CARDS" ? "END" : "START")

  // Map SAIL spacing values to Tailwind classes
  const spacingMap: Record<Spacing, string> = {
    STANDARD: choiceLayout === "STACKED" ? 'gap-2' : 'gap-4',
    MORE: choiceLayout === "STACKED" ? 'gap-4' : 'gap-6',
    EVEN_MORE: choiceLayout === "STACKED" ? 'gap-6' : 'gap-8'
  }

  const checkboxLabelGapMap: Record<Spacing, string> = {
    STANDARD: 'gap-2',
    MORE: 'gap-4',
    EVEN_MORE: 'gap-6'
  }

  const handleChange = (choiceValue: any, checked: boolean) => {
    const handler = onChange || saveInto
    if (!handler) return

    const newValue = checked
      ? [...value, choiceValue]
      : value.filter(v => v !== choiceValue)

    handler(newValue)
  }

  // Show validation errors
  const showValidations = validations.length > 0

  // Show required message
  const showRequiredMessage = required && !value.length && requiredMessage

  // Render checkboxes
  const checkboxesElement = (
    <div
      className={[
        choiceLayout === "STACKED" ? 'flex flex-col' : 'flex flex-wrap',
        spacingMap[spacing],
        align && legacyAlignMap[align]
      ].filter(Boolean).join(' ')}
      role="group"
      aria-describedby={instructions ? `${inputId}-instructions` : undefined}
    >
      {choiceLabels.map((choiceLabel, index) => {
        const choiceValue = choiceValues[index]
        const isChecked = value.includes(choiceValue)
        const choiceId = `${inputId}-choice-${index}`

        // Base classes for each choice item container
        const itemContainerClasses = [
          'flex',
          'items-center',
          checkboxLabelGapMap[spacing],
          effectiveChoicePosition === "END" && 'flex-row-reverse',
          choiceStyle === "CARDS" && `border rounded-sm p-4 hover:border-blue-500 transition-colors cursor-pointer ${isChecked ? 'border-blue-500' : 'border-gray-300'}`,
          disabled && 'opacity-50 cursor-not-allowed'
        ].filter(Boolean).join(' ')

        return (
          <div
            key={index}
            className={itemContainerClasses}
            onClick={(e) => {
              if (choiceStyle === "CARDS" && !disabled) {
                const target = e.target as HTMLElement
                // Only toggle from card surface clicks — skip if the click
                // originated on the input or label (those handle it natively via htmlFor)
                if (target.tagName !== 'INPUT' && target.tagName !== 'LABEL') {
                  handleChange(choiceValue, !isChecked)
                }
              }
            }}
          >
            <span className="relative shrink-0 h-4 w-4">
              <input
                id={choiceId}
                type="checkbox"
                checked={isChecked}
                disabled={disabled}
                onChange={(e) => handleChange(choiceValue, e.target.checked)}
                className={[
                  'appearance-none absolute inset-0 h-4 w-4 rounded-xs border',
                  isChecked
                    ? 'border-blue-500 bg-blue-500'
                    : 'border-gray-400 bg-white',
                  'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 focus-visible:ring-offset-1',
                  'transition-all duration-150 ease-in',
                  disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
                ].filter(Boolean).join(' ')}
                aria-invalid={showValidations}
                aria-errormessage={showValidations ? `${inputId}-error` : undefined}
              />
              <span
                className="pointer-events-none absolute overflow-hidden transition-[width] duration-300 ease-in"
                style={{
                  width: isChecked ? 10 : 0,
                  height: 10,
                  top: 3,
                  left: 3,
                  backgroundColor: 'white',
                  maskImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1792 1792'%3E%3Cpath d='M1671 566q0 40-28 68l-724 724-136 136q-28 28-68 28t-68-28l-136-136-362-362q-28-28-28-68t28-68l136-136q28-28 68-28t68 28l294 295 656-657q28-28 68-28t68 28l136 136q28 28 28 68z'/%3E%3C/svg%3E")`,
                  maskRepeat: 'no-repeat',
                  maskSize: '10px 10px',
                  WebkitMaskImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1792 1792'%3E%3Cpath d='M1671 566q0 40-28 68l-724 724-136 136q-28 28-68 28t-68-28l-136-136-362-362q-28-28-28-68t28-68l136-136q28-28 68-28t68 28l294 295 656-657q28-28 68-28t68 28l136 136q28 28 28 68z'/%3E%3C/svg%3E")`,
                  WebkitMaskRepeat: 'no-repeat',
                  WebkitMaskSize: '10px 10px',
                }}
              />
            </span>
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
      className={className}
    >
      {checkboxesElement}
    </FieldWrapper>
  )
}
