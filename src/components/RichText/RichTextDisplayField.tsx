import * as React from 'react'
import { FieldLabel } from '../shared/FieldLabel'
import type { SAILLabelPosition, SAILMarginSize } from '../../types/sail'

type TextAlign = "LEFT" | "CENTER" | "RIGHT"

export interface RichTextDisplayFieldProps {
  /** Text to display as the field label */
  label?: string
  /** Position of the label */
  labelPosition?: SAILLabelPosition
  /** Supplemental text about this field */
  instructions?: string
  /** Alignment of the text value */
  align?: TextAlign
  /** Array of rich text to display */
  value?: React.ReactNode[]
  /** Help tooltip text */
  helpTooltip?: string
  /** Screen reader text */
  accessibilityText?: string
  /** Whether to show this component */
  showWhen?: boolean
  /** Prevents wrapping to multiple lines */
  preventWrapping?: boolean
  /** Tooltip text on mouseover */
  tooltip?: string
  /** Margin above the component */
  marginAbove?: SAILMarginSize
  /** Margin below the component */
  marginBelow?: SAILMarginSize
}

/**
 * Rich Text Display Field component
 * Displays text in variety of styles, including bold, italics, underline, links, and lists
 */
export const RichTextDisplayField: React.FC<RichTextDisplayFieldProps> = ({
  label,
  labelPosition = "ABOVE",
  instructions,
  align = "LEFT",
  value = [],
  helpTooltip,
  accessibilityText,
  showWhen = true,
  preventWrapping = false,
  tooltip,
  marginAbove = "NONE",
  marginBelow = "STANDARD"
}) => {
  if (!showWhen) return null

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

  // Alignment mappings
  const alignMap: Record<TextAlign, string> = {
    LEFT: 'text-left',
    CENTER: 'text-center',
    RIGHT: 'text-right'
  }

  // Build container classes
  const containerClasses = [
    marginAboveMap[marginAbove],
    marginBelowMap[marginBelow]
  ].filter(Boolean).join(' ')

  // Build content classes
  const contentClasses = [
    alignMap[align],
    preventWrapping && 'truncate',
    'leading-relaxed' // Better line spacing for rich text
  ].filter(Boolean).join(' ')

  // Generate unique ID for accessibility
  const fieldId = React.useMemo(() => 
    `richtext-${Math.random().toString(36).substr(2, 9)}`, []
  )

  return (
    <div className={containerClasses}>
      <FieldLabel
        label={label}
        labelPosition={labelPosition}
        instructions={instructions}
        helpTooltip={helpTooltip}
        htmlFor={fieldId}
        accessibilityText={accessibilityText}
      />
      
      <div
        id={fieldId}
        className={contentClasses}
        title={tooltip}
        role={accessibilityText ? 'region' : undefined}
        aria-label={accessibilityText}
      >
        {value.length > 0 ? (
          value.map((item, index) => (
            <React.Fragment key={index}>{item}</React.Fragment>
          ))
        ) : (
          // Show empty state if no content
          <span className="text-gray-500 italic">No content</span>
        )}
      </div>
    </div>
  )
}
