import * as React from 'react'
import type { TagItemProps } from './TagItem'
import type { SAILSize, SAILAlign, SAILLabelPosition, SAILMarginSize, SAILSemanticColor } from '../../types/sail'
import { FieldLabel } from '../shared/FieldLabel'

/**
 * Tag size - only SMALL and STANDARD are supported per SAIL docs
 */
type TagSize = Extract<SAILSize, "SMALL" | "STANDARD">

/**
 * Props for the TagField component
 * Maps to SAIL's a!tagField() function
 */
export interface TagFieldProps {
  /** Array of tag items to display */
  tags: TagItemProps[]
  /** Text to display as the field label */
  label?: string
  /** Position of the label relative to the tags */
  labelPosition?: SAILLabelPosition
  /** Supplemental text about this field */
  instructions?: string
  /** Help icon tooltip text */
  helpTooltip?: string
  /** Determines alignment of tags */
  align?: SAILAlign
  /** Additional text for screen readers */
  accessibilityText?: string
  /** Size of the tags */
  size?: TagSize
  /** Controls field visibility */
  showWhen?: boolean
  /** Space added above the layout */
  marginAbove?: SAILMarginSize
  /** Space added below the layout */
  marginBelow?: SAILMarginSize
}

/**
 * TagField Component
 * Displays a list of short text labels with colored backgrounds
 *
 * @example
 * <TagField
 *   size="STANDARD"
 *   tags={[
 *     { text: "URGENT", backgroundColor: "#FED7DE", textColor: "#9F0019" }
 *   ]}
 * />
 */
export const TagField: React.FC<TagFieldProps> = ({
  tags,
  label,
  labelPosition = "ABOVE",
  instructions,
  helpTooltip,
  align = "START",
  accessibilityText,
  size = "STANDARD",
  showWhen = true,
  marginAbove = "NONE",
  marginBelow = "STANDARD"
}) => {
  // Visibility control
  if (!showWhen) return null

  // Filter out hidden tags
  const visibleTags = tags.filter(tag => tag.showWhen !== false && tag.text)

  // Size mappings - using SAIL design tokens
  const sizeMap = {
    SMALL: 'text-sail-small px-sail-less py-sail-even-less',
    STANDARD: 'text-sail-standard px-sail-standard py-sail-even-less'
  }

  // Alignment mappings
  const alignMap = {
    START: 'justify-start',
    CENTER: 'justify-center',
    END: 'justify-end'
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

  // Semantic color mappings
  const bgColorMap: Record<SAILSemanticColor, string> = {
    ACCENT: 'bg-blue-1',
    POSITIVE: 'bg-green-1',
    NEGATIVE: 'bg-red-1',
    SECONDARY: 'bg-gray-2',
    STANDARD: 'bg-gray-1'
  }

  const textColorMap: Record<SAILSemanticColor | "STANDARD", string> = {
    ACCENT: 'text-blue-4',
    POSITIVE: 'text-green-4',
    NEGATIVE: 'text-red-4',
    SECONDARY: 'text-gray-4',
    STANDARD: 'text-gray-5'
  }

  // Render individual tag
  const renderTag = (tag: TagItemProps, index: number) => {
    // Determine background color classes or inline styles
    const bgClass = tag.backgroundColor?.startsWith('#')
      ? ''
      : bgColorMap[(tag.backgroundColor as SAILSemanticColor) || 'ACCENT']

    const textClass = tag.textColor?.startsWith('#')
      ? ''
      : textColorMap[(tag.textColor as SAILSemanticColor) || 'STANDARD']

    const inlineStyle: React.CSSProperties = {
      ...(tag.backgroundColor?.startsWith('#') && { backgroundColor: tag.backgroundColor }),
      ...(tag.textColor?.startsWith('#') && { color: tag.textColor })
    }

    // Use anchor tag if link is provided, otherwise span
    const Component = tag.link ? 'a' : 'span'
    const componentProps = tag.link ? { href: tag.link } : {}

    return (
      <Component
        key={index}
        {...componentProps}
        className={`
          inline-block font-semibold max-w-full
          whitespace-nowrap overflow-hidden text-ellipsis
          rounded-sail-semi-rounded
          ${sizeMap[size]}
          ${bgClass}
          ${textClass}
          ${tag.link ? 'hover:underline cursor-pointer' : 'cursor-default'}
        `.replace(/\s+/g, ' ').trim()}
        style={inlineStyle}
        title={tag.tooltip}
        aria-label={tag.tooltip}
      >
        {tag.text}
      </Component>
    )
  }

  const fieldId = React.useId()

  return (
    <div
      className={`${marginAboveMap[marginAbove]} ${marginBelowMap[marginBelow]}`}
      aria-label={accessibilityText}
    >
      <FieldLabel
        label={label}
        labelPosition={labelPosition}
        instructions={instructions}
        helpTooltip={helpTooltip}
        htmlFor={fieldId}
        accessibilityText={accessibilityText}
      />

      {visibleTags.length > 0 && (
        <div
          id={fieldId}
          className={`flex flex-wrap gap-sail-less ${alignMap[align]}`}
          role="list"
        >
          {visibleTags.map(renderTag)}
        </div>
      )}
    </div>
  )
}
