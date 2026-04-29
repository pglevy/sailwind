import * as React from 'react'
import type { SAILAlign, SAILMarginSize, SAILColorInput } from '../../types/sail'
import { mergeClasses } from '../../utils/classNames'
import { resolveColorClass, isSemanticColor, isPaletteColor } from '../../utils/colorResolver'
import { marginAboveMap, marginBelowMap, textAlignMap } from '../../utils/sailMaps'

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
  /** Determines the label color - hex color, semantic color, or palette token (e.g. TEAL_700) */
  color?: SAILColorInput
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
  /** Additional Tailwind classes for prototype-specific styling (not part of SAIL API) */
  className?: string
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
  preventWrapping = false,
  className: classNameProp
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

  // Build color styles — semantic, palette, or hex
  const colorStyles = isSemanticColor(color)
    ? { className: resolveColorClass(color, 'text') }
    : isPaletteColor(color)
      ? { className: resolveColorClass(color, 'text') }
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
  const sailClasses = [
    sizeMap[size],
    fontWeightMap[fontWeight],
    textAlignMap[align],
    marginAboveMap[marginAbove],
    marginBelowMap[marginBelow],
    preventWrapping && 'truncate',
    colorStyles.className
  ].filter(Boolean).join(' ')

  const className = mergeClasses(sailClasses, classNameProp)

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
          className="text-inherit border-b-2 border-blue-500/0 hover:border-blue-500 hover:cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500 focus:ring-offset-2 transition-all ease-in-out"
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
