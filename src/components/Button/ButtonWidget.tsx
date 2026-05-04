import * as React from 'react'
import * as LucideIcons from 'lucide-react'
import type { SAILSize, SAILColorInput } from '../../types/sail'
import { mergeClasses } from '../../utils/classNames'
import { resolveColorClass, isSemanticColor, isPaletteColor } from '../../utils/colorResolver'
import { buttonSizeMap, buttonIconOnlySizeMap } from '../../utils/sailMaps'

type ButtonStyle = "SOLID" | "OUTLINE" | "GHOST" | "LINK"
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
  /** Determines button color (hex, semantic, or palette token e.g. TEAL_700) */
  /** Enhancement to SAIL */
  color?: SAILColorInput
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
  /** Click handler (React-style alias for saveInto) */
  onClick?: (value?: any) => void
  /** Additional Tailwind classes for prototype-specific styling (not part of SAIL API) */
  className?: string
}

/**
 * ButtonWidget Component
 * Displays a button that can conditionally be used to submit a form
 *
 * Note: In SAIL, a!buttonWidget must be used within a!buttonArrayLayout.
 * For standalone use in React, wrap with ButtonArrayLayout component.
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
  onClick,
  value,
  className
}) => {
  // Visibility control
  if (!showWhen) return null

  const isIconOnly = !!icon && !label
  const effectiveSizeClasses = isIconOnly ? buttonIconOnlySizeMap[size] : buttonSizeMap[size]

  // Width mappings
  const widthClass = width === "FILL" ? 'w-full' : 'w-auto'

  // Returns accessible text color (black or white) for a given hex background
  const getContrastColor = (hex: string): string => {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    // Relative luminance per WCAG 2.x
    const toLinear = (c: number) => {
      const s = c / 255
      return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
    }
    const L = 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b)
    // Contrast ratio against white (1.0) vs black (0.0)
    const contrastWhite = (1.0 + 0.05) / (L + 0.05)
    const contrastBlack = (L + 0.05) / (0.0 + 0.05)
    return contrastWhite >= contrastBlack ? '#ffffff' : '#000000'
  }

  // Get inline styles for hex colors
  const getInlineStyles = (): React.CSSProperties | undefined => {
    if (!color.startsWith('#')) return undefined

    const baseStyles: React.CSSProperties = {}

    if (style === "SOLID") {
      baseStyles.backgroundColor = color
      baseStyles.borderColor = 'transparent'
      baseStyles.color = getContrastColor(color)
    } else if (style === "OUTLINE") {
      baseStyles.borderColor = color
      baseStyles.color = color
      baseStyles.backgroundColor = '#ffffff'
    } else if (style === "GHOST") {
      baseStyles.color = color
      baseStyles.borderColor = 'transparent'
    } else if (style === "LINK") {
      baseStyles.color = color
      baseStyles.borderColor = 'transparent'
    }

    return Object.keys(baseStyles).length > 0 ? baseStyles : undefined
  }

  // Style + Color combinations
  const getColorClasses = (): string => {
    // Handle hex colors - use inline styles + 1px border for size consistency
    if (color.startsWith('#')) {
      return 'border' // Border color set via inline styles
    }

    // Handle palette colors — mechanical Tailwind class generation
    if (isPaletteColor(color)) {
      const bg = resolveColorClass(color, 'bg')
      const text = resolveColorClass(color, 'text')
      const border = resolveColorClass(color, 'border')

      if (style === "SOLID") {
        return `border border-transparent ${bg} text-white`
      }
      if (style === "OUTLINE") {
        return `border ${border} ${text} bg-white`
      }
      if (style === "GHOST") {
        return `border border-transparent ${text}`
      }
      if (style === "LINK") {
        return `border border-transparent ${text} hover:underline`
      }
      return ''
    }

    // Handle semantic colors — curated combos
    if (!isSemanticColor(color)) return ''

    if (style === "SOLID") {
      const solidColors: Record<string, string> = {
        ACCENT: 'border border-transparent bg-blue-500 text-white hover:bg-blue-700',
        POSITIVE: 'border border-transparent bg-green-700 text-white hover:bg-green-900',
        NEGATIVE: 'border border-transparent bg-red-700 text-white hover:bg-red-900',
        SECONDARY: 'border border-transparent bg-gray-700 text-white hover:bg-gray-900',
        STANDARD: 'border border-transparent bg-gray-900 text-white hover:bg-gray-700'
      }
      return solidColors[color]
    }

    if (style === "OUTLINE") {
      const outlineColors: Record<string, string> = {
        ACCENT: 'border border-blue-500 text-blue-500 bg-white hover:bg-blue-50',
        POSITIVE: 'border border-green-700 text-green-700 bg-white hover:bg-green-50',
        NEGATIVE: 'border border-red-700 text-red-700 bg-white hover:bg-red-50',
        SECONDARY: 'border border-gray-700 text-gray-700 bg-white hover:bg-gray-100',
        STANDARD: 'border border-gray-900 text-gray-900 bg-white hover:bg-gray-100'
      }
      return outlineColors[color]
    }

    if (style === "GHOST") {
      const ghostColors: Record<string, string> = {
        ACCENT: 'border border-transparent text-blue-500 hover:bg-blue-100',
        POSITIVE: 'border border-transparent text-green-700 hover:bg-green-100',
        NEGATIVE: 'border border-transparent text-red-700 hover:bg-red-100',
        SECONDARY: 'border border-transparent text-gray-700 hover:bg-gray-100',
        STANDARD: 'border border-transparent text-gray-900 hover:bg-gray-100'
      }
      return ghostColors[color]
    }

    if (style === "LINK") {
      const linkColors: Record<string, string> = {
        ACCENT: 'border border-transparent text-blue-500 hover:underline',
        POSITIVE: 'border border-transparent text-green-700 hover:underline',
        NEGATIVE: 'border border-transparent text-red-700 hover:underline',
        SECONDARY: 'border border-transparent text-gray-700 hover:underline',
        STANDARD: 'border border-transparent text-gray-900 hover:underline'
      }
      return linkColors[color]
    }

    return ''
  }

  // Border handling is now in getColorClasses - all buttons use 1px border
  // (visible for OUTLINE, transparent for others) to ensure consistent sizing
  const getBorderClasses = (): string => {
    return '' // All borders now handled in getColorClasses for consistency
  }

  // Build SAIL-computed classes
  const sailClasses = [
    'inline-flex items-center justify-center gap-1',
    'font-medium transition-colors h-auto rounded-sm',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2',
    effectiveSizeClasses,
    widthClass,
    getBorderClasses(),
    getColorClasses(),
    (disabled || loadingIndicator) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
  ].filter(Boolean).join(' ')

  // Merge with optional className override
  const finalClasses = mergeClasses(sailClasses, className)

  const handleClick = () => {
    const handler = onClick || saveInto
    if (handler && !disabled && !loadingIndicator) {
      handler(value)
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
      className={finalClasses}
      style={inlineStyles}
      aria-label={accessibilityText || label || tooltip || (icon ? icon.replace(/-/g, ' ') : undefined)}
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
