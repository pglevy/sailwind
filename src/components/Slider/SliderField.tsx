import * as React from 'react'
import * as Slider from '@radix-ui/react-slider'
import { FieldWrapper } from '../shared/FieldWrapper'
import type { SAILLabelPosition, SAILMarginSize, SAILSize } from '../../types/sail'

type SliderOrientation = "HORIZONTAL" | "VERTICAL"

/**
 * Displays a slider for numeric range input
 * Inspired by SAIL form field patterns (not an official SAIL component)
 *
 * This is a "new SAIL" component - not available in public SAIL but follows
 * the same conventions and patterns for consistency with other Sailwind components.
 */
export interface SliderFieldProps {
  /** Text to display as the field label */
  label?: string
  /** Supplemental text about this field */
  instructions?: string
  /** Determines if a value is required to submit the form */
  required?: boolean
  /** Determines if the field should display as grayed out */
  disabled?: boolean
  /** Current value(s) - single number for single slider, array for range */
  value?: number | number[]
  /** Minimum value */
  min?: number
  /** Maximum value */
  max?: number
  /** Step increment */
  step?: number
  /** Validation errors to display below the field */
  validations?: string[]
  /** Callback when the user changes the slider value */
  saveInto?: (value: number | number[]) => void
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
  /** Size of the slider */
  size?: SAILSize
  /** Color of the slider track and thumb (hex or semantic) */
  color?: "ACCENT" | "POSITIVE" | "NEGATIVE" | "SECONDARY" | string
  /** Orientation of the slider */
  orientation?: SliderOrientation
  /** Show current value(s) as text */
  showValue?: boolean
  /** Custom formatter for displayed values */
  formatValue?: (value: number) => string
}

export const SliderField: React.FC<SliderFieldProps> = ({
  label,
  instructions,
  required = false,
  disabled = false,
  value = 50,
  min = 0,
  max = 100,
  step = 1,
  validations = [],
  saveInto,
  validationGroup: _validationGroup,
  requiredMessage,
  labelPosition = "ABOVE",
  helpTooltip,
  accessibilityText,
  showWhen = true,
  marginAbove = "NONE",
  marginBelow = "STANDARD",
  size = "STANDARD",
  color = "ACCENT",
  orientation = "HORIZONTAL",
  showValue = false,
  formatValue = (val) => val.toString()
}) => {
  // Visibility control
  if (!showWhen) return null

  const inputId = `sliderfield-${Math.random().toString(36).substr(2, 9)}`

  // Normalize value to array for consistent handling
  const normalizedValue = Array.isArray(value) ? value : [value]
  const isRange = Array.isArray(value)

  // Size mappings for the slider
  const sizeMap: Record<SAILSize, { track: string; thumb: string; height?: string }> = {
    SMALL: {
      track: orientation === "HORIZONTAL" ? 'h-1' : 'w-1',
      thumb: 'h-4 w-4',
      height: orientation === "VERTICAL" ? 'h-32' : undefined
    },
    STANDARD: {
      track: orientation === "HORIZONTAL" ? 'h-2' : 'w-2',
      thumb: 'h-5 w-5',
      height: orientation === "VERTICAL" ? 'h-40' : undefined
    },
    MEDIUM: {
      track: orientation === "HORIZONTAL" ? 'h-3' : 'w-3',
      thumb: 'h-6 w-6',
      height: orientation === "VERTICAL" ? 'h-48' : undefined
    },
    LARGE: {
      track: orientation === "HORIZONTAL" ? 'h-4' : 'w-4',
      thumb: 'h-8 w-8',
      height: orientation === "VERTICAL" ? 'h-56' : undefined
    }
  }

  // Color mapping for track and thumb
  const getColorClasses = () => {
    // Handle hex colors
    if (color.startsWith('#')) {
      return {
        range: '',
        thumb: 'border-2 border-white shadow-lg'
      }
    }

    const colorMap: Record<string, { range: string; thumb: string }> = {
      ACCENT: {
        range: 'bg-blue-500',
        thumb: 'bg-blue-500 border-2 border-white shadow-lg hover:bg-blue-700 focus:bg-blue-700'
      },
      POSITIVE: {
        range: 'bg-green-700',
        thumb: 'bg-green-700 border-2 border-white shadow-lg hover:bg-green-900 focus:bg-green-900'
      },
      NEGATIVE: {
        range: 'bg-red-700',
        thumb: 'bg-red-700 border-2 border-white shadow-lg hover:bg-red-900 focus:bg-red-900'
      },
      SECONDARY: {
        range: 'bg-gray-700',
        thumb: 'bg-gray-700 border-2 border-white shadow-lg hover:bg-gray-900 focus:bg-gray-900'
      }
    }

    return colorMap[color] || colorMap.ACCENT
  }

  const colorClasses = getColorClasses()

  const handleValueChange = (newValue: number[]) => {
    if (saveInto && !disabled) {
      saveInto(isRange ? newValue : newValue[0])
    }
  }

  // Show validation errors
  const showValidations = validations.length > 0

  // Show required message
  const showRequiredMessage = required && normalizedValue.every(v => v === min) && requiredMessage

  // Format value display
  const formatValueDisplay = () => {
    if (isRange) {
      return `${formatValue(normalizedValue[0])} - ${formatValue(normalizedValue[1])}`
    }
    return formatValue(normalizedValue[0])
  }

  // Slider element
  const sliderElement = (
    <div className={orientation === "VERTICAL" ? "flex justify-center" : ""}>
      <Slider.Root
        id={inputId}
        value={normalizedValue}
        onValueChange={handleValueChange}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        orientation={orientation.toLowerCase() as "horizontal" | "vertical"}
        className={[
          'relative flex items-center select-none touch-none',
          orientation === "HORIZONTAL" ? 'w-full' : sizeMap[size].height,
          disabled && 'opacity-50 cursor-not-allowed'
        ].filter(Boolean).join(' ')}
        aria-label={accessibilityText || label}
        aria-describedby={instructions ? `${inputId}-instructions` : undefined}
        aria-invalid={showValidations}
        aria-errormessage={showValidations ? `${inputId}-error` : undefined}
      >
        <Slider.Track
          className={[
            'relative grow rounded-full bg-gray-200',
            sizeMap[size].track
          ].join(' ')}
        >
          <Slider.Range
            className={[
              'absolute rounded-full',
              colorClasses.range,
              orientation === "HORIZONTAL" ? 'h-full' : 'w-full'
            ].join(' ')}
            style={color.startsWith('#') ? { backgroundColor: color } : undefined}
          />
        </Slider.Track>
        {normalizedValue.map((_, index) => (
          <Slider.Thumb
            key={index}
            className={[
              'block rounded-full transition-colors',
              sizeMap[size].thumb,
              colorClasses.thumb,
              'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
            ].join(' ')}
            style={color.startsWith('#') ? { backgroundColor: color } : undefined}
          />
        ))}
      </Slider.Root>
    </div>
  )

  // Value display
  const valueDisplay = showValue && (
    <div className={[
      'text-sm text-gray-700 mt-2',
      orientation === "VERTICAL" ? 'text-center' : ''
    ].join(' ')}>
      {formatValueDisplay()}
    </div>
  )

  // Footer content (validations and required message)
  const footerContent = (
    <>
      {valueDisplay}
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
      {sliderElement}
    </FieldWrapper>
  )
}
