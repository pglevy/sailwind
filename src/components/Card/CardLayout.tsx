import * as React from 'react'
import type { SAILShape, SAILPadding, SAILMarginSize } from '../../types/sail'

type CardHeight = "AUTO" | "SHORT" | "MEDIUM" | "TALL" | "EXTRA_TALL"
type CardStyle = "NONE" | "ACCENT" | "SUCCESS" | "WARN" | "ERROR" | "INFO"
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
  /** Determines the border/style color */
  style?: CardStyle
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
  /** Custom border color (hex value) */
  borderColor?: string
  /** Position of decorative bar */
  decorativeBarPosition?: DecorativeBarPosition
  /** Color of decorative bar (hex or semantic) */
  decorativeBarColor?: string
  /** Controls card visibility */
  showWhen?: boolean
}

/**
 * CardLayout Component
 * Displays content within a card container
 *
 * @example
 * <CardLayout
 *   shape="SEMI_ROUNDED"
 *   padding="STANDARD"
 *   showBorder={true}
 * >
 *   <p>Card content here</p>
 * </CardLayout>
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
  borderColor = "#EDEEFA",
  decorativeBarPosition = "NONE",
  decorativeBarColor,
  showWhen = true
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

  // Shape mappings - using Tailwind standard classes that map to SAIL values
  const shapeMap: Record<SAILShape, string> = {
    SQUARED: 'rounded-none',  // SAIL SQUARED: 0
    SEMI_ROUNDED: 'rounded-sm', // SAIL SEMI_ROUNDED: 4px
    ROUNDED: 'rounded-md'     // SAIL ROUNDED: 8px
  }

  // Padding mappings - using Tailwind standard classes that map to SAIL values
  const paddingMap: Record<SAILPadding, string> = {
    NONE: 'p-0',      // SAIL NONE: 0
    EVEN_LESS: 'p-1', // SAIL EVEN_LESS: 4px
    LESS: 'p-2',      // SAIL LESS: 8px
    STANDARD: 'p-4',  // SAIL STANDARD: 16px
    MORE: 'p-6',      // SAIL MORE: 24px
    EVEN_MORE: 'p-8'  // SAIL EVEN_MORE: 32px
  }

  // Margin mappings - using Tailwind standard classes that map to SAIL values
  const marginAboveMap: Record<SAILMarginSize, string> = {
    NONE: 'mt-0',      // SAIL NONE: 0
    EVEN_LESS: 'mt-1', // SAIL EVEN_LESS: 4px
    LESS: 'mt-2',      // SAIL LESS: 8px
    STANDARD: 'mt-4',  // SAIL STANDARD: 16px
    MORE: 'mt-6',      // SAIL MORE: 24px
    EVEN_MORE: 'mt-8'  // SAIL EVEN_MORE: 32px
  }

  const marginBelowMap: Record<SAILMarginSize, string> = {
    NONE: 'mb-0',      // SAIL NONE: 0
    EVEN_LESS: 'mb-1', // SAIL EVEN_LESS: 4px
    LESS: 'mb-2',      // SAIL LESS: 8px
    STANDARD: 'mb-4',  // SAIL STANDARD: 16px
    MORE: 'mb-6',      // SAIL MORE: 24px
    EVEN_MORE: 'mb-8'  // SAIL EVEN_MORE: 32px
  }

  // Style color mappings for borders
  const styleColorMap: Record<CardStyle, string> = {
    NONE: '',
    ACCENT: 'border-blue-500',
    SUCCESS: 'border-green-500',
    WARN: 'border-orange-500',
    ERROR: 'border-red-500',
    INFO: 'border-sky-500'
  }

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
      // Semantic color - use Tailwind class
      return { className: decorativeBarColorMap[decorativeBarColor] || decorativeBarColorMap.ACCENT }
    }
    return { className: decorativeBarColorMap.ACCENT }
  }

  const barProps = getDecorativeBarClasses()

  const baseClasses = `
    bg-white
    ${heightMap[height]}
    ${shapeMap[shape]}
    ${paddingMap[padding]}
    ${marginAboveMap[marginAbove]}
    ${marginBelowMap[marginBelow]}
    ${showBorder ? `border-2 ${styleColorMap[style]}` : ''}
    ${showShadow ? 'shadow-md' : ''}
    overflow-hidden
    relative
  `.replace(/\s+/g, ' ').trim()

  const borderStyle = showBorder && !styleColorMap[style]
    ? { borderColor }
    : {}

  return (
    <div className={baseClasses} style={borderStyle}>
      {decorativeBarPosition === "TOP" && (
        <div
          className={`absolute top-0 left-0 right-0 h-1 ${barProps.className || ''}`}
          style={barProps.style}
          aria-hidden="true"
        />
      )}
      {decorativeBarPosition === "START" && (
        <div
          className={`absolute top-0 left-0 bottom-0 w-1 ${barProps.className || ''}`}
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
