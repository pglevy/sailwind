import * as React from 'react'
import * as LucideIcons from 'lucide-react'
import type { TagItemProps } from './TagItem'
import type { SAILSize, SAILAlign, SAILLabelPosition, SAILMarginSize } from '../../types/sail'
import { FieldLabel } from '../shared/FieldLabel'
import { mergeClasses } from '../../utils/classNames'
import { resolveColorClass, isSemanticColor, isPaletteColor } from '../../utils/colorResolver'
import { marginAboveMap, marginBelowMap, alignMap, tagSizeMap, tagIconSizeMap, tagHorizontalPaddingMap } from '../../utils/sailMaps'

/**
 * Tag size - SMALL, STANDARD, and LARGE are supported (no MEDIUM per SAIL docs)
 */
type TagSize = Extract<SAILSize, "SMALL" | "STANDARD" | "LARGE">

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
  /** Size of the tags (SMALL, STANDARD, or LARGE) */
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
  const fieldId = React.useId()

  // Visibility control
  if (!showWhen) return null

  // Filter out hidden tags
  const visibleTags = tags.filter(tag => tag.showWhen !== false && tag.text)

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

  // Map a Lucide icon name (kebab-case or PascalCase) to its component
  const getIconComponent = (iconName: string) => {
    const kebabToPascal = (str: string) =>
      str.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('')

    const pascalIconName = kebabToPascal(iconName)
    if (pascalIconName in LucideIcons) {
      return LucideIcons[pascalIconName as keyof typeof LucideIcons] as React.ComponentType<{ size?: number; className?: string; 'aria-hidden'?: boolean }>
    }

    const directIconName = iconName.charAt(0).toUpperCase() + iconName.slice(1).toLowerCase()
    if (directIconName in LucideIcons) {
      return LucideIcons[directIconName as keyof typeof LucideIcons] as React.ComponentType<{ size?: number; className?: string; 'aria-hidden'?: boolean }>
    }

    console.warn(`Icon "${iconName}" not found in Lucide icons`)
    return null
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

    // Resolve icon (icon color follows text color — inherits via currentColor)
    const IconComponent = tag.icon ? getIconComponent(tag.icon) : null
    const iconPosition = tag.iconPosition || 'START'
    const iconSize = tagIconSizeMap[size]
    const iconElement = IconComponent && (
      <IconComponent size={iconSize} className="shrink-0" aria-hidden={true} />
    )

    // When an icon is present, tighten the padding on the icon's side by 2px.
    // The icon's own visual weight plus the gap to the text otherwise makes
    // that side look heavier than the plain (text-only) side.
    if (IconComponent) {
      const { tight } = tagHorizontalPaddingMap[size]
      if (iconPosition === 'START') {
        inlineStyle.paddingLeft = tight
      } else {
        inlineStyle.paddingRight = tight
      }
    }

    return (
      <Component
        key={index}
        {...componentProps}
        role="listitem"
        className={[
          'inline-flex items-center gap-1 font-semibold max-w-full',
          'rounded-sm',
          tagSizeMap[size],
          bgClass,
          textClass,
          tag.link ? 'hover:underline cursor-pointer' : 'cursor-default'
        ].filter(Boolean).join(' ')}
        style={inlineStyle}
        title={tag.tooltip}
        aria-label={tag.tooltip}
      >
        {iconElement && iconPosition === 'START' && iconElement}
        <span className="overflow-hidden whitespace-nowrap text-ellipsis">{tag.text}</span>
        {iconElement && iconPosition === 'END' && iconElement}
      </Component>
    )
  }

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
