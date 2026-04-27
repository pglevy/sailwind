import * as React from 'react'
import type { SAILShape, SAILPadding, SAILMarginSize, SAILColorInput } from '../../types/sail'
import { isPaletteColor, resolveColorClass } from '../../utils/colorResolver'
import { mergeClasses } from '../../utils/classNames'
import { marginAboveMap, marginBelowMap, paddingMap, shapeMap } from '../../utils/sailMaps'

type CardHeight = "AUTO" | "SHORT" | "MEDIUM" | "TALL" | "EXTRA_TALL"
type CardStyle = "NONE" | "TRANSPARENT" | "STANDARD" | "ACCENT" | "SUCCESS" | "WARN" | "ERROR" | "INFO" | "CHARCOAL_SCHEME" | "NAVY_SCHEME" | "PLUM_SCHEME"
type DecorativeBarPosition = "TOP" | "START" | "NONE"

/**
 * Props for the CardLayout component
 * Maps to SAIL's a!cardLayout() function
 */
export interface CardLayoutProps {
  /** Content to display inside the card */
  children: React.ReactNode
  /** Determines the height of the card */
  height?: CardHeight
  /** Determines the card background color. Valid values: Any hex color (including transparency with 8 digits), or semantic values */
  style?: CardStyle | string
  /** Determines the border radius */
  shape?: SAILShape
  /** Determines the padding inside the card */
  padding?: SAILPadding
  /** Space added above the card */
  marginAbove?: SAILMarginSize
  /** Space added below the card */
  marginBelow?: SAILMarginSize
  /** Whether to show card border */
  showBorder?: boolean
  /** Whether to show card shadow */
  showShadow?: boolean
  /** Determines the border color. Valid values: Any hex color (including transparency), or "STANDARD" (default), "ACCENT", "POSITIVE", "WARN", "NEGATIVE" */
  borderColor?: SAILColorInput
  /** Position of decorative bar */
  decorativeBarPosition?: DecorativeBarPosition
  /** Color of decorative bar (hex or semantic) */
  decorativeBarColor?: SAILColorInput
  /** Controls card visibility */
  showWhen?: boolean
  /** Additional Tailwind classes for prototype-specific styling (not part of SAIL API) */
  className?: string
}

/**
 * CardLayout Component
 * Displays content within a card container
 */
export const CardLayout: React.FC<CardLayoutProps> = ({
  children,
  height = "AUTO",
  style = "NONE",
  shape = "SEMI_ROUNDED",
  padding = "STANDARD",
  marginAbove = "NONE",
  marginBelow = "STANDARD",
  showBorder = true,
  showShadow = false,
  borderColor = "STANDARD",
  decorativeBarPosition = "NONE",
  decorativeBarColor,
  showWhen = true,
  className
}) => {
  // Visibility control
  if (!showWhen) return null

  // Height mappings
  const heightMap: Record<CardHeight, string> = {
    AUTO: 'h-auto',
    SHORT: 'h-32',
    MEDIUM: 'h-48',
    TALL: 'h-64',
    EXTRA_TALL: 'h-96'
  }

  // Background color mappings for card styles
  const backgroundColorMap: Record<CardStyle, string> = {
    NONE: 'bg-white',
    TRANSPARENT: 'bg-transparent',
    STANDARD: 'bg-white',
    ACCENT: 'bg-blue-50',
    SUCCESS: 'bg-green-50',
    WARN: 'bg-orange-50',
    ERROR: 'bg-red-50',
    INFO: 'bg-sky-50',
    CHARCOAL_SCHEME: 'bg-gray-900',
    NAVY_SCHEME: 'bg-blue-900',
    PLUM_SCHEME: 'bg-purple-900'
  }

  // Get background color - either from map or use hex value
  const getBackgroundColor = (): { className?: string; style?: React.CSSProperties } => {
    if (!style || style === 'NONE') {
      return { className: 'bg-white' }
    }

    // Check if it's a hex color
    if (typeof style === 'string' && style.startsWith('#')) {
      return { style: { backgroundColor: style } }
    }

    // Use semantic color mapping
    return { className: backgroundColorMap[style as CardStyle] || 'bg-white' }
  }

  const bgProps = getBackgroundColor()

  // Border color mappings for semantic values
  const borderColorMap: Record<string, string> = {
    STANDARD: 'border-gray-300',
    ACCENT: 'border-blue-500',
    POSITIVE: 'border-green-700',
    WARN: 'border-orange-500',
    NEGATIVE: 'border-red-700'
  }

  // Get border color - either from map or use hex value
  const getBorderColor = (): { className?: string; style?: React.CSSProperties } => {
    if (!borderColor) {
      return { className: 'border-gray-300' }
    }

    // Check if it's a hex color
    if (borderColor.startsWith('#')) {
      return { style: { borderColor } }
    }

    // Palette color
    if (isPaletteColor(borderColor)) {
      return { className: resolveColorClass(borderColor, 'border') }
    }

    // Use semantic color mapping
    return { className: borderColorMap[borderColor] || 'border-gray-300' }
  }

  const borderProps = getBorderColor()

  // Decorative bar color mappings - returns Tailwind class or hex for inline style
  const decorativeBarColorMap: Record<string, string> = {
    ACCENT: 'bg-blue-500',      // Blue 3 (Aurora)
    SUCCESS: 'bg-green-500',    // Green 3 (Aurora)
    WARN: 'bg-orange-500',      // Orange 3 (Aurora)
    ERROR: 'bg-red-500',        // Red 3 (Aurora)
    INFO: 'bg-sky-500'          // Sky 3 (Aurora)
  }

  const getDecorativeBarClasses = (): { className?: string; style?: React.CSSProperties } => {
    if (decorativeBarColor) {
      if (decorativeBarColor.startsWith('#')) {
        // Custom hex color - use inline style
        return { style: { backgroundColor: decorativeBarColor } }
      }
      if (isPaletteColor(decorativeBarColor)) {
        return { className: resolveColorClass(decorativeBarColor, 'bg') }
      }
      // Semantic color - use Tailwind class
      return { className: decorativeBarColorMap[decorativeBarColor] || decorativeBarColorMap.ACCENT }
    }
    return { className: decorativeBarColorMap.ACCENT }
  }

  const barProps = getDecorativeBarClasses()

  // Build SAIL-computed classes
  const sailClasses = [
    bgProps.className || '',
    heightMap[height],
    shapeMap[shape],
    paddingMap[padding],
    marginAboveMap[marginAbove],
    marginBelowMap[marginBelow],
    showBorder ? `border ${borderProps.className || ''}` : '',
    showShadow ? 'shadow-md' : '',
    'relative'
  ].filter(Boolean).join(' ')

  // Merge with optional className override
  const finalClasses = mergeClasses(sailClasses, className)

  // Combine inline styles
  const inlineStyles = {
    ...(bgProps.style || {}),
    ...(borderProps.style || {})
  }

  return (
    <div className={finalClasses} style={Object.keys(inlineStyles).length > 0 ? inlineStyles : undefined}>
      {decorativeBarPosition === "TOP" && (
        <div
          className={`absolute -top-0.25 -left-0.25 -right-0.25 h-1 ${barProps.className || ''}`}
          style={barProps.style}
          aria-hidden="true"
        />
      )}
      {decorativeBarPosition === "START" && (
        <div
          className={`absolute -top-0.25 -left-0.25 -bottom-0.25 w-1 ${barProps.className || ''}`}
          style={barProps.style}
          aria-hidden="true"
        />
      )}
      <div className={decorativeBarPosition === "TOP" ? "pt-1" : ""}>
        {children}
      </div>
    </div>
  )
}
