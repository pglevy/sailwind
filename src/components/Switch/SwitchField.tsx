import * as React from 'react'
import * as Switch from '@radix-ui/react-switch'
import { Info } from 'lucide-react'
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
  /** Determines where the label appears relative to the component */
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
  /** Size of the switch and its label */
  size?: SAILSize
  /** Color when switch is on (hex or semantic) */
  color?: "ACCENT" | "POSITIVE" | "NEGATIVE" | "SECONDARY" | "STANDARD" | string
  /** Position of the inline label relative to the switch control: LEFT or RIGHT */
  switchLabelPosition?: "LEFT" | "RIGHT"
  /** Additional Tailwind classes for prototype-specific styling (not part of SAIL API) */
  className?: string
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
  labelPosition: _labelPosition = "ABOVE",
  helpTooltip,
  accessibilityText,
  showWhen = true,
  marginAbove = "NONE",
  marginBelow = "STANDARD",
  size = "STANDARD",
  color = "ACCENT",
  switchLabelPosition = "RIGHT",
  className
}) => {
  // Visibility control
  if (!showWhen) return null

  const inputId = `switchfield-${Math.random().toString(36).substr(2, 9)}`

  // Size mappings for the switch control
  const sizeMap: Record<SAILSize, { root: string; thumb: string }> = {
    SMALL: {
      root: 'h-5 w-9',
      thumb: 'h-3.5 w-3.5 data-[state=checked]:translate-x-4'
    },
    STANDARD: {
      root: 'h-6 w-11',
      thumb: 'h-4 w-4 data-[state=checked]:translate-x-5.5'
    },
    MEDIUM: {
      root: 'h-7 w-14',
      thumb: 'h-5 w-5 data-[state=checked]:translate-x-7.5'
    },
    LARGE: {
      root: 'h-9 w-18',
      thumb: 'h-7 w-7 data-[state=checked]:translate-x-9.5'
    }
  }

  // Size mappings for the inline label text
  const labelSizeMap: Record<SAILSize, string> = {
    SMALL: 'text-sm',
    STANDARD: 'text-base',
    MEDIUM: 'text-lg',
    LARGE: 'text-xl'
  }

  // Gap between switch and inline label, scaled by size
  const gapMap: Record<SAILSize, string> = {
    SMALL: 'gap-2',
    STANDARD: 'gap-3',
    MEDIUM: 'gap-3',
    LARGE: 'gap-4'
  }

  // Color mapping for checked state
  const getCheckedBgClass = (): string => {
    if (color.startsWith('#')) return ''

    const colorMap: Record<string, string> = {
      ACCENT:    'data-[state=checked]:bg-blue-500',
      POSITIVE:  'data-[state=checked]:bg-green-700',
      NEGATIVE:  'data-[state=checked]:bg-red-700',
      SECONDARY: 'data-[state=checked]:bg-gray-700',
      STANDARD:  'data-[state=checked]:bg-gray-900'
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

  // The Radix switch control
  const switchControl = (
    <Switch.Root
      id={inputId}
      checked={value}
      onCheckedChange={handleChange}
      disabled={disabled}
      required={required}
      className={[
        sizeMap[size].root,
        'shrink-0 relative rounded-full transition-colors border-2',
        'data-[state=unchecked]:bg-white data-[state=unchecked]:border-gray-300',
        'hover:data-[state=unchecked]:bg-gray-100',
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
          'block rounded-full bg-white shadow-lg transition-transform border border-gray-500 data-[state=checked]:border-transparent',
          'translate-x-0.5',
          'flex items-center justify-center'
        ].filter(Boolean).join(' ')}
      >
        {value && (
          <svg viewBox="0 0 12 12" fill="none" className="w-2/3 h-2/3" aria-hidden="true">
            <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              className={color.startsWith('#') ? '' : {
                ACCENT: 'text-blue-500', POSITIVE: 'text-green-700', NEGATIVE: 'text-red-700',
                SECONDARY: 'text-gray-700', STANDARD: 'text-gray-900'
              }[color] ?? 'text-blue-500'}
              style={color.startsWith('#') ? { color } : undefined}
            />
          </svg>
        )}
      </Switch.Thumb>
    </Switch.Root>
  )

  // Inline label element (rendered next to the switch control)
  const inlineLabel = label ? (
    <label
      htmlFor={inputId}
      className={[
        labelSizeMap[size],
        'inline-flex items-center gap-1 font-medium text-gray-900 select-none',
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      ].join(' ')}
    >
      {label}
      {required && <span className="text-red-700" aria-label="required">*</span>}
      {helpTooltip && (
        <span className="text-gray-700 cursor-help inline-flex items-center" title={helpTooltip} aria-label="help">
          <Info size={14} />
        </span>
      )}
    </label>
  ) : null

  // The switch + inline label row
  const switchElement = (
    <div className={`flex items-center ${gapMap[size]}`}>
      {switchLabelPosition === "LEFT" ? (
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
          {requiredMessage}
        </p>
      )}
    </>
  )

  // Use FieldWrapper without a label — we handle the label inline
  return (
    <FieldWrapper
      labelPosition="COLLAPSED"
      accessibilityText={accessibilityText || label}
      inputId={inputId}
      marginAbove={marginAbove}
      marginBelow={marginBelow}
      instructions={instructions}
      footer={footerContent}
      className={className}
    >
      {switchElement}
    </FieldWrapper>
  )
}
