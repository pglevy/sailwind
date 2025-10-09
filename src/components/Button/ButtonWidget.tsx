import * as React from 'react'
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
  value
}) => {
  // Visibility control
  if (!showWhen) return null

  // Size mappings
  const sizeMap: Record<SAILSize, string> = {
    SMALL: 'px-sail-standard py-sail-even-less text-sail-small',
    STANDARD: 'px-sail-more py-sail-less text-sail-standard',
    MEDIUM: 'px-sail-even-more py-sail-standard text-sail-medium',
    LARGE: 'px-sail-even-more py-sail-more text-sail-large'
  }

  // Width mappings
  const widthClass = width === "FILL" ? 'w-full' : 'w-auto'

  // Style + Color combinations
  const getColorClasses = (): string => {
    // Handle hex colors
    if (color.startsWith('#')) {
      // For custom hex colors, use inline styles (handled below)
      return style === "SOLID" ? '' : 'border-2'
    }

    const semanticColor = color as ButtonColor

    if (style === "SOLID") {
      const solidColors: Record<ButtonColor, string> = {
        ACCENT: 'bg-blue-3 text-white hover:bg-blue-4',
        NEGATIVE: 'bg-red-35 text-white hover:bg-red-4',
        SECONDARY: 'bg-gray-4 text-white hover:bg-gray-5'
      }
      return solidColors[semanticColor]
    }

    if (style === "OUTLINE") {
      const outlineColors: Record<ButtonColor, string> = {
        ACCENT: 'border-2 border-blue-3 text-blue-3 bg-white hover:bg-blue-1',
        NEGATIVE: 'border-2 border-red-35 text-red-35 bg-white hover:bg-red-1',
        SECONDARY: 'border-2 border-gray-4 text-gray-4 bg-white hover:bg-gray-1'
      }
      return outlineColors[semanticColor]
    }

    if (style === "GHOST") {
      const ghostColors: Record<ButtonColor, string> = {
        ACCENT: 'text-blue-3 hover:bg-blue-1',
        NEGATIVE: 'text-red-35 hover:bg-red-1',
        SECONDARY: 'text-gray-4 hover:bg-gray-1'
      }
      return ghostColors[semanticColor]
    }

    if (style === "LINK") {
      const linkColors: Record<ButtonColor, string> = {
        ACCENT: 'text-blue-3 hover:underline',
        NEGATIVE: 'text-red-35 hover:underline',
        SECONDARY: 'text-gray-4 hover:underline'
      }
      return linkColors[semanticColor]
    }

    return ''
  }

  const baseClasses = `
    inline-flex items-center justify-center gap-sail-even-less
    font-medium transition-colors rounded-sail-semi-rounded
    ${sizeMap[size]}
    ${widthClass}
    ${getColorClasses()}
    ${disabled || loadingIndicator ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
    ${style === "LINK" ? '' : 'min-w-[80px]'}
  `.replace(/\s+/g, ' ').trim()

  const handleClick = () => {
    if (saveInto && !disabled && !loadingIndicator) {
      saveInto(value)
    }
  }

  return (
    <button
      type={submit ? "submit" : "button"}
      onClick={handleClick}
      disabled={disabled || loadingIndicator}
      className={baseClasses}
      aria-label={accessibilityText || label}
      title={tooltip}
    >
      {loadingIndicator && (
        <span className="animate-spin" aria-label="loading">⟳</span>
      )}
      {!loadingIndicator && icon && iconPosition === "START" && (
        <span aria-hidden="true">{icon}</span>
      )}
      {label && <span>{label}</span>}
      {!loadingIndicator && icon && iconPosition === "END" && (
        <span aria-hidden="true">{icon}</span>
      )}
    </button>
  )
}
