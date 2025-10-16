import * as React from 'react'
import * as LucideIcons from 'lucide-react'
import type { SAILSize } from '../../types/sail'

type ButtonStyle = "SOLID" | "OUTLINE" | "GHOST" | "LINK"
type ButtonColor = "ACCENT" | "NEGATIVE" | "SECONDARY"
type ButtonWidth = "MINIMIZE" | "FILL"
type IconPosition = "START" | "END"

/**
 * Props for the ButtonWidget component
 * Maps to SAIL's a!buttonWidget() function
 */
export interface ButtonWidgetProps {
  /** Text to display on the button */
  label?: string
  /** Determines the button's appearance */
  style?: ButtonStyle
  /** Determines button color (hex or semantic) */
  color?: ButtonColor | string
  /** Determines size of the button */
  size?: SAILSize
  /** Determines button width */
  width?: ButtonWidth
  /** Prevents user from clicking the button */
  disabled?: boolean
  /** Whether this button submits a form */
  submit?: boolean
  /** Determines whether button performs validation */
  validate?: boolean
  /** Validation group identifier */
  validationGroup?: string
  /** Text for confirmation dialog */
  confirmMessage?: string
  /** Text for confirmation dialog header */
  confirmHeader?: string
  /** Text for confirmation button */
  confirmButtonLabel?: string
  /** Text for cancel button */
  cancelButtonLabel?: string
  /** Controls button visibility */
  showWhen?: boolean
  /** Icon to display */
  icon?: string
  /** Position of icon */
  iconPosition?: IconPosition
  /** Additional text for screen readers */
  accessibilityText?: string
  /** Tooltip text on hover */
  tooltip?: string
  /** Loading indicator on press */
  loadingIndicator?: boolean
  /** Value associated with this button */
  value?: any
  /** Click handler (maps to saveInto in SAIL) */
  saveInto?: (value?: any) => void
  /** Additional Tailwind classes for prototype-specific styling (not part of SAIL API) */
  className?: string
}

/**
 * ButtonWidget Component
 * Displays a button that can conditionally be used to submit a form
 *
 * Note: In SAIL, a!buttonWidget must be used within a!buttonArrayLayout.
 * For standalone use in React, wrap with ButtonArrayLayout component.
 *
 * @example
 * <ButtonArrayLayout
 *   buttons={[
 *     { label: "Submit", style: "SOLID", color: "ACCENT" }
 *   ]}
 * />
 */
export const ButtonWidget: React.FC<ButtonWidgetProps> = ({
  label,
  style = "OUTLINE",
  color = "ACCENT",
  size = "STANDARD",
  width,
  disabled = false,
  submit = false,
  showWhen = true,
  icon,
  iconPosition = "START",
  accessibilityText,
  tooltip,
  loadingIndicator = false,
  saveInto,
  value,
  className
}) => {
  // Visibility control
  if (!showWhen) return null

  // Size mappings - using standard Tailwind spacing classes
  const sizeMap: Record<SAILSize, string> = {
    SMALL: 'px-3 py-1.5 text-sm',      // SAIL SMALL: 12px horizontal, 6px vertical
    STANDARD: 'px-4 py-2.5 text-base', // SAIL STANDARD: 16px horizontal, 10px vertical
    MEDIUM: 'px-6 py-3 text-lg',       // SAIL MEDIUM: 24px horizontal, 12px vertical
    LARGE: 'px-8 py-4 text-xl'         // SAIL LARGE: 32px horizontal, 16px vertical
  }

  // Width mappings
  const widthClass = width === "FILL" ? 'w-full' : 'w-auto'

  // Get inline styles for hex colors
  // Note: Only apply inline styles for properties not overridden by className
  const getInlineStyles = (): React.CSSProperties | undefined => {
    if (!color.startsWith('#')) return undefined

    const baseStyles: React.CSSProperties = {}

    if (style === "SOLID") {
      baseStyles.backgroundColor = color
      baseStyles.borderColor = 'transparent'
      // Only set text color if className doesn't include text color utilities
      if (!className?.includes('text-')) {
        baseStyles.color = '#ffffff'
      }
    } else if (style === "OUTLINE") {
      baseStyles.borderColor = color
      if (!className?.includes('text-')) {
        baseStyles.color = color
      }
      baseStyles.backgroundColor = '#ffffff'
    } else if (style === "GHOST") {
      if (!className?.includes('text-')) {
        baseStyles.color = color
      }
      baseStyles.borderColor = 'transparent'
    } else if (style === "LINK") {
      if (!className?.includes('text-')) {
        baseStyles.color = color
      }
      baseStyles.borderColor = 'transparent'
    }

    return Object.keys(baseStyles).length > 0 ? baseStyles : undefined
  }

  // Style + Color combinations
  const getColorClasses = (): string => {
    // Handle hex colors - use inline styles
    if (color.startsWith('#')) {
      return style === "SOLID" || style === "OUTLINE" ? 'border-2' : 'border-2 border-transparent'
    }

    const semanticColor = color as ButtonColor

    if (style === "SOLID") {
      const solidColors: Record<ButtonColor, string> = {
        ACCENT: 'border-2 border-transparent bg-blue-500 text-white hover:bg-blue-700',
        NEGATIVE: 'border-2 border-transparent bg-red-700 text-white hover:bg-red-900',
        SECONDARY: 'border-2 border-transparent bg-gray-700 text-white hover:bg-gray-900'
      }
      return solidColors[semanticColor]
    }

    if (style === "OUTLINE") {
      const outlineColors: Record<ButtonColor, string> = {
        ACCENT: 'border-2 border-blue-500 text-blue-500 bg-white hover:bg-blue-100',
        NEGATIVE: 'border-2 border-red-700 text-red-700 bg-white hover:bg-red-100',
        SECONDARY: 'border-2 border-gray-700 text-gray-700 bg-white hover:bg-gray-100'
      }
      return outlineColors[semanticColor]
    }

    if (style === "GHOST") {
      const ghostColors: Record<ButtonColor, string> = {
        ACCENT: 'border-2 border-transparent text-blue-500 hover:bg-blue-100',
        NEGATIVE: 'border-2 border-transparent text-red-700 hover:bg-red-100',
        SECONDARY: 'border-2 border-transparent text-gray-700 hover:bg-gray-100'
      }
      return ghostColors[semanticColor]
    }

    if (style === "LINK") {
      const linkColors: Record<ButtonColor, string> = {
        ACCENT: 'border-2 border-transparent text-blue-500 hover:underline',
        NEGATIVE: 'border-2 border-transparent text-red-700 hover:underline',
        SECONDARY: 'border-2 border-transparent text-gray-700 hover:underline'
      }
      return linkColors[semanticColor]
    }

    return ''
  }

  // Only apply default rounded-sm if className doesn't include rounded-* utilities
  const defaultRounded = className?.includes('rounded-') ? '' : 'rounded-sm'

  const baseClasses = `
    inline-flex items-center justify-center gap-1
    font-medium transition-colors h-auto
    ${defaultRounded}
    ${sizeMap[size]}
    ${widthClass}
    ${getColorClasses()}
    ${disabled || loadingIndicator ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
    ${className || ''}
  `.replace(/\s+/g, ' ').trim()

  const handleClick = () => {
    if (saveInto && !disabled && !loadingIndicator) {
      saveInto(value)
    }
  }

  // Get Lucide icon component
  const getIconComponent = () => {
    if (!icon) return null

    // Convert kebab-case to PascalCase (e.g., 'arrow-right' -> 'ArrowRight')
    const iconName = icon
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join('')

    const IconComponent = (LucideIcons as any)[iconName]

    if (!IconComponent) {
      console.warn(`Icon "${icon}" not found in Lucide icons`)
      return null
    }

    // Size the icon based on button size
    const iconSizeMap: Record<SAILSize, number> = {
      SMALL: 14,
      STANDARD: 16,
      MEDIUM: 18,
      LARGE: 20
    }

    return <IconComponent size={iconSizeMap[size]} aria-hidden="true" />
  }

  const IconElement = getIconComponent()
  const inlineStyles = getInlineStyles()

  return (
    <button
      type={submit ? "submit" : "button"}
      onClick={handleClick}
      disabled={disabled || loadingIndicator}
      className={baseClasses}
      style={inlineStyles}
      aria-label={accessibilityText || label}
      title={tooltip}
    >
      {loadingIndicator && (
        <span className="animate-spin" aria-label="loading">⟳</span>
      )}
      {!loadingIndicator && IconElement && iconPosition === "START" && IconElement}
      {label && <span>{label}</span>}
      {!loadingIndicator && IconElement && iconPosition === "END" && IconElement}
    </button>
  )
}
