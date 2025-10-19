import * as React from 'react'
import * as Toggle from '@radix-ui/react-toggle'
import * as LucideIcons from 'lucide-react'
import { FieldWrapper } from '../shared/FieldWrapper'
import type { SAILLabelPosition, SAILMarginSize, SAILSize } from '../../types/sail'

type ToggleStyle = "SOLID" | "OUTLINE" | "GHOST"

/**
 * Displays a toggle button for boolean input (button-style on/off)
 * Inspired by SAIL form field patterns (not an official SAIL component)
 *
 * This is a "new SAIL" component - not available in public SAIL but follows
 * the same conventions and patterns for consistency with other Sailwind components.
 *
 * Use ToggleField for button-style toggles (e.g., toolbar buttons, filters)
 * Use SwitchField for traditional on/off switches (e.g., settings)
 */
export interface ToggleFieldProps {
  /** Text to display as the field label */
  label?: string
  /** Text to display on the toggle button */
  text?: string
  /** Supplemental text about this field */
  instructions?: string
  /** Determines if a value is required to submit the form */
  required?: boolean
  /** Determines if the field should display as grayed out */
  disabled?: boolean
  /** Current pressed state (true = pressed, false = unpressed) */
  value?: boolean
  /** Validation errors to display below the field */
  validations?: string[]
  /** Callback when the user toggles the button */
  saveInto?: (value: boolean) => void
  /** Callback when the user toggles the button (React-style alias for saveInto) */
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
  /** Size of the toggle button */
  size?: SAILSize
  /** Color when toggle is pressed (hex or semantic) */
  color?: "ACCENT" | "POSITIVE" | "NEGATIVE" | "SECONDARY" | string
  /** Determines the button's appearance */
  style?: ToggleStyle
  /** Icon to display in the button */
  icon?: string
  /** Position of icon relative to text */
  iconPosition?: "START" | "END"
}

export const ToggleField: React.FC<ToggleFieldProps> = ({
  label,
  text,
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
  color = "ACCENT",
  style = "OUTLINE",
  icon,
  iconPosition = "START"
}) => {
  // Visibility control
  if (!showWhen) return null

  const inputId = `togglefield-${Math.random().toString(36).substr(2, 9)}`

  // Size mappings (same as ButtonWidget)
  const sizeMap: Record<SAILSize, string> = {
    SMALL: 'px-3 py-1.5 text-sm',
    STANDARD: 'px-4 py-2.5 text-base',
    MEDIUM: 'px-6 py-3 text-lg',
    LARGE: 'px-8 py-4 text-xl'
  }

  // Get color classes based on style and pressed state
  const getColorClasses = (): string => {
    // Handle hex colors
    if (color.startsWith('#')) {
      return style === "SOLID" ? 'border-2' : 'border-2'
    }

    const semanticColor = color as "ACCENT" | "POSITIVE" | "NEGATIVE" | "SECONDARY"

    if (style === "SOLID") {
      const solidColors: Record<typeof semanticColor, string> = {
        ACCENT: 'border-2 border-blue-500 bg-white text-blue-500 data-[state=on]:bg-blue-500 data-[state=on]:text-white data-[state=on]:border-blue-500 hover:bg-blue-50 data-[state=on]:hover:bg-blue-700',
        POSITIVE: 'border-2 border-green-700 bg-white text-green-700 data-[state=on]:bg-green-700 data-[state=on]:text-white data-[state=on]:border-green-700 hover:bg-green-50 data-[state=on]:hover:bg-green-900',
        NEGATIVE: 'border-2 border-red-700 bg-white text-red-700 data-[state=on]:bg-red-700 data-[state=on]:text-white data-[state=on]:border-red-700 hover:bg-red-50 data-[state=on]:hover:bg-red-900',
        SECONDARY: 'border-2 border-gray-700 bg-white text-gray-700 data-[state=on]:bg-gray-700 data-[state=on]:text-white data-[state=on]:border-gray-700 hover:bg-gray-50 data-[state=on]:hover:bg-gray-900'
      }
      return solidColors[semanticColor]
    }

    if (style === "OUTLINE") {
      const outlineColors: Record<typeof semanticColor, string> = {
        ACCENT: 'border-2 border-blue-500 text-blue-500 bg-white data-[state=on]:bg-blue-100 hover:bg-blue-50',
        POSITIVE: 'border-2 border-green-700 text-green-700 bg-white data-[state=on]:bg-green-100 hover:bg-green-50',
        NEGATIVE: 'border-2 border-red-700 text-red-700 bg-white data-[state=on]:bg-red-100 hover:bg-red-50',
        SECONDARY: 'border-2 border-gray-700 text-gray-700 bg-white data-[state=on]:bg-gray-100 hover:bg-gray-50'
      }
      return outlineColors[semanticColor]
    }

    if (style === "GHOST") {
      const ghostColors: Record<typeof semanticColor, string> = {
        ACCENT: 'border-2 border-transparent text-blue-500 bg-transparent data-[state=on]:bg-blue-100 hover:bg-blue-50',
        POSITIVE: 'border-2 border-transparent text-green-700 bg-transparent data-[state=on]:bg-green-100 hover:bg-green-50',
        NEGATIVE: 'border-2 border-transparent text-red-700 bg-transparent data-[state=on]:bg-red-100 hover:bg-red-50',
        SECONDARY: 'border-2 border-transparent text-gray-700 bg-transparent data-[state=on]:bg-gray-100 hover:bg-gray-50'
      }
      return ghostColors[semanticColor]
    }

    return ''
  }

  const handleChange = (pressed: boolean) => {
    const handler = onChange || saveInto
    if (handler && !disabled) {
      handler(pressed)
    }
  }

  // Map any Lucide icon name directly, with SAIL compatibility fallbacks
  const getIconComponent = (iconName: string) => {
    // First try direct Lucide icon name (kebab-case or PascalCase)
    const kebabToPascal = (str: string) => 
      str.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('')
    
    const pascalIconName = kebabToPascal(iconName)
    if (pascalIconName in LucideIcons) {
      return LucideIcons[pascalIconName as keyof typeof LucideIcons] as React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>
    }
    
    // Also try direct case-insensitive lookup
    const directIconName = iconName.charAt(0).toUpperCase() + iconName.slice(1).toLowerCase()
    if (directIconName in LucideIcons) {
      return LucideIcons[directIconName as keyof typeof LucideIcons] as React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>
    }
    
    // Fallback to SAIL compatibility mapping
    const sailIconMap: Record<string, keyof typeof LucideIcons> = {
      'STAR': 'Star',
      'HOME': 'Home',
      'USER': 'User',
      'SETTINGS': 'Settings',
      'SEARCH': 'Search',
      'FILTER': 'Filter',
      'ARROW_RIGHT': 'ArrowRight',
      'ARROW_LEFT': 'ArrowLeft',
      'ARROW_UP': 'ArrowUp',
      'ARROW_DOWN': 'ArrowDown'
    }
    
    const lucideIconName = sailIconMap[iconName]
    if (lucideIconName && lucideIconName in LucideIcons) {
      return LucideIcons[lucideIconName] as React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>
    }
    
    // Fallback to a generic icon
    return LucideIcons.Circle as React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>
  }

  // Show validation errors
  const showValidations = validations.length > 0

  // Show required message
  const showRequiredMessage = required && !value && requiredMessage

  // Toggle button element
  const toggleElement = (
    <Toggle.Root
      id={inputId}
      pressed={value}
      onPressedChange={handleChange}
      disabled={disabled}
      className={[
        'inline-flex items-center justify-center gap-2',
        'font-medium transition-colors rounded-sm',
        sizeMap[size],
        getColorClasses(),
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      ].filter(Boolean).join(' ')}
      aria-label={accessibilityText || text || label}
      aria-describedby={instructions ? `${inputId}-instructions` : undefined}
      aria-invalid={showValidations}
      aria-errormessage={showValidations ? `${inputId}-error` : undefined}
    >
      {icon && iconPosition === "START" && (
        <span aria-hidden="true">
          {React.createElement(getIconComponent(icon), { size: 16 })}
        </span>
      )}
      {text && <span>{text}</span>}
      {icon && iconPosition === "END" && (
        <span aria-hidden="true">
          {React.createElement(getIconComponent(icon), { size: 16 })}
        </span>
      )}
    </Toggle.Root>
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
      {toggleElement}
    </FieldWrapper>
  )
}
