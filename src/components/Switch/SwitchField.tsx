import * as React from 'react'
import * as Switch from '@radix-ui/react-switch'
import { FieldWrapper } from '../shared/FieldWrapper'
import type { SAILLabelPosition, SAILMarginSize, SAILSize } from '../../types/sail'

/**
 * Displays a switch (toggle) for boolean input
 * Inspired by SAIL form field patterns (not an official SAIL component)
 *
 * This is a "new SAIL" component - not available in public SAIL but follows
 * the same conventions and patterns for consistency with other Sailwind components.
 */
export interface SwitchFieldProps {
  /** Text to display as the field label */
  label?: string
  /** Supplemental text about this field */
  instructions?: string
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
  /** Determines where the label appears */
  labelPosition?: SAILLabelPosition
  /** Displays a help icon with tooltip text */
  helpTooltip?: string
  /** Additional text for screen readers */
  accessibilityText?: string
  /** Determines whether component is displayed */
  showWhen?: boolean
  /** Space added above component */
  marginAbove?: SAILMarginSize
  /** Space added below component */
  marginBelow?: SAILMarginSize
  /** Size of the switch */
  size?: SAILSize
  /** Color when switch is on (hex or semantic) */
  color?: "ACCENT" | "POSITIVE" | "NEGATIVE" | string
}

export const SwitchField: React.FC<SwitchFieldProps> = ({
  label,
  instructions,
  required = false,
  disabled = false,
  value = false,
  validations = [],
  saveInto,
  onChange,
  validationGroup: _validationGroup,
  requiredMessage,
  labelPosition = "ABOVE",
  helpTooltip,
  accessibilityText,
  showWhen = true,
  marginAbove = "NONE",
  marginBelow = "STANDARD",
  size = "STANDARD",
  color = "ACCENT"
}) => {
  // Visibility control
  if (!showWhen) return null

  const inputId = `switchfield-${Math.random().toString(36).substr(2, 9)}`

  // Size mappings for the switch
  const sizeMap: Record<SAILSize, { root: string; thumb: string }> = {
    SMALL: {
      root: 'h-5 w-9',
      thumb: 'h-4 w-4 data-[state=checked]:translate-x-4'
    },
    STANDARD: {
      root: 'h-6 w-11',
      thumb: 'h-5 w-5 data-[state=checked]:translate-x-5'
    },
    MEDIUM: {
      root: 'h-7 w-14',
      thumb: 'h-6 w-6 data-[state=checked]:translate-x-7'
    },
    LARGE: {
      root: 'h-9 w-18',
      thumb: 'h-8 w-8 data-[state=checked]:translate-x-9'
    }
  }

  // Color mapping for checked state - returns just the background color class
  const getCheckedBgClass = (): string => {
    // Handle hex colors
    if (color.startsWith('#')) {
      return '' // Use inline style instead
    }

    const colorMap: Record<string, string> = {
      ACCENT: 'data-[state=checked]:bg-blue-500',
      POSITIVE: 'data-[state=checked]:bg-green-700',
      NEGATIVE: 'data-[state=checked]:bg-red-700'
    }

    return colorMap[color] || 'data-[state=checked]:bg-blue-500'
  }

  const handleChange = (checked: boolean) => {
    const handler = onChange || saveInto
    if (handler && !disabled) {
      handler(checked)
    }
  }

  // Show validation errors
  const showValidations = validations.length > 0

  // Show required message
  const showRequiredMessage = required && !value && requiredMessage

  // Switch element
  const switchElement = (
    <Switch.Root
      id={inputId}
      checked={value}
      onCheckedChange={handleChange}
      disabled={disabled}
      required={required}
      className={[
        sizeMap[size].root,
        'relative rounded-full transition-colors border-2',
        'data-[state=unchecked]:bg-gray-500 data-[state=unchecked]:border-gray-700',
        getCheckedBgClass(),
        'data-[state=checked]:border-transparent',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2'
      ].filter(Boolean).join(' ')}
      style={color.startsWith('#') && value ? { backgroundColor: color } : undefined}
      aria-label={accessibilityText || label}
      aria-describedby={instructions ? `${inputId}-instructions` : undefined}
      aria-invalid={showValidations}
      aria-errormessage={showValidations ? `${inputId}-error` : undefined}
    >
      <Switch.Thumb
        className={[
          sizeMap[size].thumb,
          'block rounded-full bg-white shadow-lg transition-transform',
          'translate-x-0.5'
        ].filter(Boolean).join(' ')}
      />
    </Switch.Root>
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
      {switchElement}
    </FieldWrapper>
  )
}
