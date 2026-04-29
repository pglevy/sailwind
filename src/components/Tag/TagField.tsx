import * as React from 'react'
import type { TagItemProps } from './TagItem'
import type { SAILSize, SAILAlign, SAILLabelPosition, SAILMarginSize } from '../../types/sail'
import { FieldLabel } from '../shared/FieldLabel'
import { mergeClasses } from '../../utils/classNames'
import { resolveColorClass, isSemanticColor, isPaletteColor } from '../../utils/colorResolver'
import { marginAboveMap, marginBelowMap, alignMap } from '../../utils/sailMaps'

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

  // Semantic color mappings — tags use light tints for backgrounds
  const bgColorMap: Record<string, string> = {
    ACCENT: 'bg-blue-50',
    POSITIVE: 'bg-green-50',
    NEGATIVE: 'bg-red-50',
    SECONDARY: 'bg-gray-200',
    STANDARD: 'bg-gray-100'
  }

  const textColorMap: Record<string, string> = {
    ACCENT: 'text-blue-700',
    POSITIVE: 'text-green-700',
    NEGATIVE: 'text-red-700',
    SECONDARY: 'text-gray-700',
    STANDARD: 'text-gray-900'
  }

  // Render individual tag
  const renderTag = (tag: TagItemProps, index: number) => {
    const colorKey = tag.backgroundColor || 'ACCENT'

    // Determine background: semantic → curated tint, palette → mechanical, hex → inline
    let bgClass = ''
    const inlineStyle: React.CSSProperties = {}

    if (typeof colorKey === 'string' && colorKey.startsWith('#')) {
      inlineStyle.backgroundColor = colorKey
    } else if (isSemanticColor(colorKey)) {
      bgClass = bgColorMap[colorKey]
    } else if (isPaletteColor(colorKey)) {
      bgClass = resolveColorClass(colorKey, 'bg')
    } else {
      bgClass = bgColorMap['ACCENT']
    }

    // Determine text color
    const textKey = tag.textColor || (isSemanticColor(colorKey) ? colorKey : 'STANDARD')
    let textClass = ''

    if (typeof textKey === 'string' && textKey.startsWith('#')) {
      inlineStyle.color = textKey
    } else if (isSemanticColor(textKey)) {
      textClass = textColorMap[textKey]
    } else if (isPaletteColor(textKey)) {
      textClass = resolveColorClass(textKey, 'text')
    } else {
      textClass = textColorMap['STANDARD']
    }

    // Use anchor tag if link is provided, otherwise span
    const Component = tag.link ? 'a' : 'span'
    const componentProps = tag.link ? { href: tag.link } : {}

    return (
      <Component
        key={index}
        {...componentProps}
        role="listitem"
        className={[
          'inline-block font-semibold max-w-full',
          'whitespace-nowrap overflow-hidden text-ellipsis',
          'rounded-sm',
          sizeMap[size],
          bgClass,
          textClass,
          tag.link ? 'hover:underline cursor-pointer' : 'cursor-default'
        ].filter(Boolean).join(' ')}
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
