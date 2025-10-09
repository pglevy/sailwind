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

  // Shape mappings
  const shapeMap: Record<SAILShape, string> = {
    SQUARED: 'rounded-sail-squared',
    SEMI_ROUNDED: 'rounded-sail-semi-rounded',
    ROUNDED: 'rounded-sail-rounded'
  }

  // Padding mappings
  const paddingMap: Record<SAILPadding, string> = {
    NONE: 'p-sail-none',
    EVEN_LESS: 'p-sail-even-less',
    LESS: 'p-sail-less',
    STANDARD: 'p-sail-standard',
    MORE: 'p-sail-more',
    EVEN_MORE: 'p-sail-even-more'
  }

  // Margin mappings
  const marginAboveMap: Record<SAILMarginSize, string> = {
    NONE: 'mt-sail-none',
    EVEN_LESS: 'mt-sail-even-less',
    LESS: 'mt-sail-less',
    STANDARD: 'mt-sail-standard',
    MORE: 'mt-sail-more',
    EVEN_MORE: 'mt-sail-even-more'
  }

  const marginBelowMap: Record<SAILMarginSize, string> = {
    NONE: 'mb-sail-none',
    EVEN_LESS: 'mb-sail-even-less',
    LESS: 'mb-sail-less',
    STANDARD: 'mb-sail-standard',
    MORE: 'mb-sail-more',
    EVEN_MORE: 'mb-sail-even-more'
  }

  // Style color mappings for borders
  const styleColorMap: Record<CardStyle, string> = {
    NONE: '',
    ACCENT: 'border-blue-3',
    SUCCESS: 'border-green-3',
    WARN: 'border-orange-3',
    ERROR: 'border-red-3',
    INFO: 'border-sky-3'
  }

  // Decorative bar color mappings
  const decorativeBarColorMap: Record<string, string> = {
    ACCENT: '#2322F0',
    SUCCESS: '#17B00B',
    WARN: '#FF9000',
    ERROR: '#E91547',
    INFO: '#0087FF'
  }

  const getDecorativeBarColor = (): string => {
    if (decorativeBarColor) {
      return decorativeBarColor.startsWith('#')
        ? decorativeBarColor
        : decorativeBarColorMap[decorativeBarColor] || decorativeBarColorMap.ACCENT
    }
    return decorativeBarColorMap.ACCENT
  }

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
          className="absolute top-0 left-0 right-0 h-1"
          style={{ backgroundColor: getDecorativeBarColor() }}
          aria-hidden="true"
        />
      )}
      {decorativeBarPosition === "START" && (
        <div
          className="absolute top-0 left-0 bottom-0 w-1"
          style={{ backgroundColor: getDecorativeBarColor() }}
          aria-hidden="true"
        />
      )}
      <div className={decorativeBarPosition === "TOP" ? "pt-sail-even-less" : ""}>
        {children}
      </div>
    </div>
  )
}
