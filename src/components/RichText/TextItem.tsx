import * as React from 'react'
import type { SAILSizeExtended, SAILColor } from '../../types/sail'
import { resolveColorClass } from '../../utils/colorResolver'

type TextStyle = "PLAIN" | "EMPHASIS" | "STRONG" | "UNDERLINE" | "STRIKETHROUGH"
type LinkStyle = "INLINE" | "STANDALONE"

export interface TextItemProps {
  /** Array of text to display as a rich text item */
  text: string | React.ReactNode | (string | React.ReactNode)[]
  /** Text style(s) to apply. Multiple styles may be applied */
  style?: TextStyle | TextStyle[]
  /** Text size */
  size?: SAILSizeExtended
  /** Text color - semantic color, palette token (e.g. TEAL_700), or hex value */
  color?: SAILColor | string
  /** Link to apply to the text */
  link?: () => void
  /** How the link is underlined */
  linkStyle?: LinkStyle
  /** Whether to show this component */
  showWhen?: boolean
}

/**
 * Text Item component for use within Rich Text Display Field
 * Displays styled text with various formatting options
 */
export const TextItem: React.FC<TextItemProps> = ({
  text,
  style = "PLAIN",
  size = "STANDARD",
  color = "STANDARD",
  link,
  linkStyle = "INLINE",
  showWhen = true
}) => {
  if (!showWhen) return null

  // Convert single style to array for consistent handling
  const styles = Array.isArray(style) ? style : [style]

  // Size mappings
  const sizeMap: Record<SAILSizeExtended, string> = {
    SMALL: 'text-xs',
    STANDARD: 'text-base',
    MEDIUM: 'text-lg',
    MEDIUM_PLUS: 'text-xl',
    LARGE: 'text-2xl',
    LARGE_PLUS: 'text-3xl',
    EXTRA_LARGE: 'text-4xl'
  }

  // Color mappings
  const colorClass = color.startsWith('#') ? '' : (resolveColorClass(color, 'text') || 'text-gray-900')

  // Build classes array
  const classes = [
    sizeMap[size],
    colorClass,
    // Apply text styles
    styles.includes('STRONG') && 'font-bold',
    styles.includes('EMPHASIS') && 'italic',
    styles.includes('UNDERLINE') && 'underline',
    styles.includes('STRIKETHROUGH') && 'line-through',
    // Link styles
    link && linkStyle === "INLINE" && 'underline decoration-dotted decoration-current/50 underline-offset-5 hover:no-underline',
    link && linkStyle === "STANDALONE" && 'no-underline decoration-current/50 underline-offset-5 hover:underline'
  ].filter(Boolean).join(' ')

  // Inline styles for hex colors
  const inlineStyles = color.startsWith('#') ? { color } : undefined

  // Render text content
  const renderText = () => {
    if (Array.isArray(text)) {
      return text.map((item, index) => (
        <React.Fragment key={index}>{item}</React.Fragment>
      ))
    }
    return text
  }

  // If there's a link, wrap in anchor element
  if (link) {
    return (
      <a
        href="#"
        className={classes}
        style={inlineStyles}
        onClick={(e) => {
          e.preventDefault()
          link()
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            link()
          }
        }}
      >
        {renderText()}
      </a>
    )
  }

  return (
    <span className={classes} style={inlineStyles}>
      {renderText()}
    </span>
  )
}
