import * as React from 'react'
import type { TagItemProps } from './TagItem'
import type { SAILSize, SAILAlign, SAILLabelPosition, SAILMarginSize, SAILSemanticColor } from '../../types/sail'
import { FieldLabel } from '../shared/FieldLabel'
import { mergeClasses } from '../../utils/classNames'

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
  /** Additional Tailwind classes for prototype-specific styling (not part of SAIL API) */
  className?: string
}

/**
 * TagField Component
 * Displays a list of short text labels with colored backgrounds
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
  marginBelow = "STANDARD",
  className
}) => {
  // Visibility control
  if (!showWhen) return null

  // Filter out hidden tags
  const visibleTags = tags.filter(tag => tag.showWhen !== false && tag.text)

  // Size mappings - using Tailwind standard classes that map to SAIL values
  const sizeMap = {
    SMALL: 'text-xs px-2 py-1',      // SAIL SMALL: 12px text, 8px horizontal padding, 4px vertical
    STANDARD: 'text-base px-4 py-1'  // SAIL STANDARD: 16px text, 16px horizontal padding, 4px vertical
  }

  // Alignment mappings
  const alignMap = {
    START: 'justify-start',
    CENTER: 'justify-center',
    END: 'justify-end'
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

  // Semantic color mappings
  const bgColorMap: Record<SAILSemanticColor, string> = {
    ACCENT: 'bg-blue-100',
    POSITIVE: 'bg-green-100',
    NEGATIVE: 'bg-red-100',
    SECONDARY: 'bg-gray-200',
    STANDARD: 'bg-gray-100'
  }

  const textColorMap: Record<SAILSemanticColor | "STANDARD", string> = {
    ACCENT: 'text-blue-700',
    POSITIVE: 'text-green-700',
    NEGATIVE: 'text-red-700',
    SECONDARY: 'text-gray-700',
    STANDARD: 'text-gray-900'
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
          rounded-sm
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

  // Build SAIL-computed classes for root container
  const sailClasses = `${marginAboveMap[marginAbove]} ${marginBelowMap[marginBelow]}`
  const finalClasses = mergeClasses(sailClasses, className)

  return (
    <div
      className={finalClasses}
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
          className={`flex flex-wrap gap-2 ${alignMap[align]}`}
          role="list"
        >
          {visibleTags.map(renderTag)}
        </div>
      )}
    </div>
  )
}
