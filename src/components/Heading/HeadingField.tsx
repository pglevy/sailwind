import * as React from 'react'
import type { SAILAlign, SAILMarginSize, SAILSemanticColor } from '../../types/sail'

/**
 * Heading size values matching SAIL's size parameter
 */
type HeadingSize = "EXTRA_SMALL" | "SMALL" | "MEDIUM" | "MEDIUM_PLUS" | "LARGE" | "LARGE_PLUS"

/**
 * Heading tag values for accessibility
 */
type HeadingTag = "H1" | "H2" | "H3" | "H4" | "H5" | "H6"

/**
 * Font weight values matching SAIL's fontWeight parameter
 */
type FontWeight = "LIGHT" | "REGULAR" | "SEMI_BOLD" | "BOLD"

/**
 * Props for the HeadingField component
 */
export interface HeadingFieldProps {
  /** Text to display in the header */
  text: string
  /** Determines the text size */
  size?: HeadingSize
  /** Determines the heading tag for screen readers */
  headingTag?: HeadingTag
  /** Determines the label color - hex color or semantic color */
  color?: string | SAILSemanticColor
  /** Determines the thickness of the text */
  fontWeight?: FontWeight
  /** Link to apply to the text (simplified - accepts onClick handler) */
  link?: () => void
  /** Determines whether the component is displayed */
  showWhen?: boolean
  /** Determines alignment of the text */
  align?: SAILAlign
  /** Determines space added above the layout */
  marginAbove?: SAILMarginSize
  /** Determines space added below the layout */
  marginBelow?: SAILMarginSize
  /** Prevents wrapping to multiple lines when true */
  preventWrapping?: boolean
}

/**
 * Displays a heading with configurations for color, size, and font weight.
 * Supports heading accessibility tags for screen readers.
 */
export const HeadingField: React.FC<HeadingFieldProps> = ({
  text,
  size = "MEDIUM_PLUS",
  headingTag,
  color = "STANDARD",
  fontWeight = "REGULAR",
  link,
  showWhen = true,
  align = "START",
  marginAbove = "NONE",
  marginBelow = "MORE",
  preventWrapping = false
}) => {
  // Visibility control
  if (!showWhen) return null

  // Size mappings to Tailwind classes
  const sizeMap: Record<HeadingSize, string> = {
    EXTRA_SMALL: 'text-xs',      // 12px
    SMALL: 'text-sm',            // 14px
    MEDIUM: 'text-lg',           // 18px
    MEDIUM_PLUS: 'text-xl',      // 20px
    LARGE: 'text-2xl',           // 24px
    LARGE_PLUS: 'text-3xl'       // 28px (custom override)
  }

  // Font weight mappings
  const fontWeightMap: Record<FontWeight, string> = {
    LIGHT: 'font-light',         // 300
    REGULAR: 'font-normal',      // 400
    SEMI_BOLD: 'font-semibold',  // 600
    BOLD: 'font-bold'            // 700
  }

  // Alignment mappings
  const alignMap: Record<SAILAlign, string> = {
    START: 'text-left',
    CENTER: 'text-center',
    END: 'text-right'
  }

  // Margin mappings
  const marginAboveMap: Record<SAILMarginSize, string> = {
    NONE: 'mt-0',
    EVEN_LESS: 'mt-1',
    LESS: 'mt-2',
    STANDARD: 'mt-4',
    MORE: 'mt-6',
    EVEN_MORE: 'mt-8'
  }

  const marginBelowMap: Record<SAILMarginSize, string> = {
    NONE: 'mb-0',
    EVEN_LESS: 'mb-1',
    LESS: 'mb-2',
    STANDARD: 'mb-4',
    MORE: 'mb-6',
    EVEN_MORE: 'mb-8'
  }

  // Semantic color mappings with proper contrast
  const semanticColorMap: Record<SAILSemanticColor, string> = {
    ACCENT: 'text-blue-500',
    POSITIVE: 'text-green-700',
    NEGATIVE: 'text-red-700',
    SECONDARY: 'text-gray-700',
    STANDARD: 'text-gray-900'
  }

  // Determine if color is semantic or hex
  const isSemanticColor = (color: string): color is SAILSemanticColor => {
    return ['ACCENT', 'POSITIVE', 'NEGATIVE', 'SECONDARY', 'STANDARD'].includes(color)
  }

  // Build color styles
  const colorStyles = isSemanticColor(color) 
    ? { className: semanticColorMap[color] }
    : { style: { color } }

  // Default heading tag based on size if not specified
  const getDefaultHeadingTag = (size: HeadingSize): HeadingTag => {
    switch (size) {
      case 'LARGE_PLUS':
        return 'H1'
      case 'LARGE':
        return 'H1'
      case 'MEDIUM_PLUS':
        return 'H2'
      case 'MEDIUM':
        return 'H3'
      case 'SMALL':
        return 'H4'
      case 'EXTRA_SMALL':
        return 'H5'
      default:
        return 'H2'
    }
  }

  const finalHeadingTag = headingTag || getDefaultHeadingTag(size)

  // Build className
  const className = [
    sizeMap[size],
    fontWeightMap[fontWeight],
    alignMap[align],
    marginAboveMap[marginAbove],
    marginBelowMap[marginBelow],
    preventWrapping && 'truncate',
    colorStyles.className
  ].filter(Boolean).join(' ')

  // Create the heading element
  const HeadingElement = finalHeadingTag.toLowerCase() as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'

  const headingProps = {
    className,
    ...(colorStyles.style && { style: colorStyles.style })
  }

  // Render with or without link
  if (link) {
    return (
      <HeadingElement {...headingProps}>
        <button
          onClick={link}
          className="text-inherit underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {text}
        </button>
      </HeadingElement>
    )
  }

  return (
    <HeadingElement {...headingProps}>
      {text}
    </HeadingElement>
  )
}
