import * as React from 'react'

type ButtonStyle = "SOLID" | "OUTLINE" | "GHOST" | "LINK"
type ButtonColor = "ACCENT" | "NEGATIVE" | "SECONDARY" | "STANDARD"
type ButtonSize = "SMALL" | "STANDARD" | "LARGE"
type ButtonShape = "SQUARED" | "SEMI_ROUNDED" | "ROUNDED"

export interface ButtonWidgetProps {
  label: string
  onClick?: () => void
  style?: ButtonStyle
  color?: ButtonColor
  size?: ButtonSize
  shape?: ButtonShape
  disabled?: boolean
  loadingIndicator?: boolean
  icon?: string
  iconPosition?: "START" | "END"
  submit?: boolean
  accessibilityText?: string
}

export const ButtonWidget: React.FC<ButtonWidgetProps> = ({
  label,
  onClick,
  style = "SOLID",
  color = "ACCENT",
  size = "STANDARD",
  shape = "SEMI_ROUNDED",
  disabled = false,
  loadingIndicator = false,
  icon,
  iconPosition = "START",
  submit = false,
  accessibilityText
}) => {
  const sizeMap = {
    SMALL: 'px-sail-standard py-sail-even-less text-sail-small',
    STANDARD: 'px-sail-more py-sail-less text-sail-standard',
    LARGE: 'px-sail-even-more py-sail-standard text-sail-medium'
  }

  const shapeMap = {
    SQUARED: 'rounded-sail-squared',
    SEMI_ROUNDED: 'rounded-sail-semi-rounded',
    ROUNDED: 'rounded-sail-rounded'
  }

  // Style + Color combinations
  const getColorClasses = () => {
    if (style === "SOLID") {
      const solidColors = {
        ACCENT: 'bg-blue-3 text-white hover:bg-blue-35',
        NEGATIVE: 'bg-red-35 text-white hover:bg-red-4',
        SECONDARY: 'bg-gray-4 text-white hover:bg-gray-5',
        STANDARD: 'bg-gray-5 text-white hover:bg-gray-4'
      }
      return solidColors[color]
    }

    if (style === "OUTLINE") {
      const outlineColors = {
        ACCENT: 'border-2 border-blue-3 text-blue-3 bg-white hover:bg-blue-1',
        NEGATIVE: 'border-2 border-red-35 text-red-35 bg-white hover:bg-red-1',
        SECONDARY: 'border-2 border-gray-4 text-gray-4 bg-white hover:bg-gray-1',
        STANDARD: 'border-2 border-gray-5 text-gray-5 bg-white hover:bg-gray-1'
      }
      return outlineColors[color]
    }

    if (style === "GHOST") {
      const ghostColors = {
        ACCENT: 'text-blue-3 hover:bg-blue-1',
        NEGATIVE: 'text-red-35 hover:bg-red-1',
        SECONDARY: 'text-gray-4 hover:bg-gray-1',
        STANDARD: 'text-gray-5 hover:bg-gray-1'
      }
      return ghostColors[color]
    }

    if (style === "LINK") {
      const linkColors = {
        ACCENT: 'text-blue-3 hover:underline',
        NEGATIVE: 'text-red-35 hover:underline',
        SECONDARY: 'text-gray-4 hover:underline',
        STANDARD: 'text-gray-5 hover:underline'
      }
      return linkColors[color]
    }

    return ''
  }

  const baseClasses = `
    inline-flex items-center justify-center gap-sail-even-less
    font-medium transition-colors
    ${sizeMap[size]}
    ${shapeMap[shape]}
    ${getColorClasses()}
    ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
    ${style === "LINK" ? '' : 'min-w-[80px]'}
  `.replace(/\s+/g, ' ').trim()

  return (
    <button
      type={submit ? "submit" : "button"}
      onClick={onClick}
      disabled={disabled || loadingIndicator}
      className={baseClasses}
      aria-label={accessibilityText || label}
    >
      {loadingIndicator && (
        <span className="animate-spin">⟳</span>
      )}
      {!loadingIndicator && icon && iconPosition === "START" && (
        <span>{icon}</span>
      )}
      <span>{label}</span>
      {!loadingIndicator && icon && iconPosition === "END" && (
        <span>{icon}</span>
      )}
    </button>
  )
}
