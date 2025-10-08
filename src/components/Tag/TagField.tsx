import * as React from 'react'
import type { TagItemProps } from './TagItem'

type TagSize = "SMALL" | "STANDARD" | "MEDIUM" | "LARGE"
type Alignment = "START" | "CENTER" | "END"
type LabelPosition = "ABOVE" | "COLLAPSED" | "JUSTIFIED" | "ADJACENT"
type MarginSize = "NONE" | "EVEN_LESS" | "LESS" | "STANDARD" | "MORE" | "EVEN_MORE"

interface TagFieldProps {
  tags: TagItemProps[]  // Array of tag items
  size?: TagSize
  align?: Alignment
  label?: string
  labelPosition?: LabelPosition
  marginAbove?: MarginSize
  marginBelow?: MarginSize
}

export const TagField: React.FC<TagFieldProps> = ({
  tags,
  size = "STANDARD",
  align = "START",
  label,
  labelPosition = "ABOVE",
  marginAbove = "NONE",
  marginBelow = "STANDARD"
}) => {
  // Based on Appian source: STANDARD uses 1rem font-size with specific padding
  // SMALL uses 0.7857rem (11px) with tighter padding
  const sizeMap = {
    SMALL: 'text-[0.7857rem] px-[0.4286rem] pb-[0.0714rem] pt-0',
    STANDARD: 'text-[1rem] px-[0.5714rem] py-[0.1429rem]',
    MEDIUM: 'text-sail-medium px-sail-standard py-sail-less',
    LARGE: 'text-sail-large px-sail-more py-sail-less'
  }

  const alignMap = {
    START: 'justify-start',
    CENTER: 'justify-center',
    END: 'justify-end'
  }

  const marginAboveMap = {
    NONE: 'mt-sail-none',
    EVEN_LESS: 'mt-sail-even-less',
    LESS: 'mt-sail-less',
    STANDARD: 'mt-sail-standard',
    MORE: 'mt-sail-more',
    EVEN_MORE: 'mt-sail-even-more'
  }

  const marginBelowMap = {
    NONE: 'mb-sail-none',
    EVEN_LESS: 'mb-sail-even-less',
    LESS: 'mb-sail-less',
    STANDARD: 'mb-sail-standard',
    MORE: 'mb-sail-more',
    EVEN_MORE: 'mb-sail-even-more'
  }

  const bgColorMap: Record<string, string> = {
    ACCENT: 'bg-blue-3',
    POSITIVE: 'bg-green-1',
    NEGATIVE: 'bg-red-1',
    SECONDARY: 'bg-gray-2',
    STANDARD: 'bg-gray-1'
  }

  const textColorMap: Record<string, string> = {
    ACCENT: 'text-blue-4',
    POSITIVE: 'text-green-4',
    NEGATIVE: 'text-red-4',
    SECONDARY: 'text-gray-4',
    STANDARD: 'text-gray-5'
  }

  const renderTag = (tag: TagItemProps, index: number) => {
    const bgClass = tag.backgroundColor?.startsWith('#')
      ? ''
      : bgColorMap[tag.backgroundColor as keyof typeof bgColorMap] || bgColorMap.ACCENT

    const textClass = tag.textColor?.startsWith('#')
      ? ''
      : textColorMap[tag.textColor as keyof typeof textColorMap] || textColorMap.STANDARD

    const style = {
      ...(tag.backgroundColor?.startsWith('#') && { backgroundColor: tag.backgroundColor }),
      ...(tag.textColor?.startsWith('#') && { color: tag.textColor })
    }

    const Component = tag.link ? 'a' : 'span'

    return (
      <Component
        key={index}
        href={tag.link}
        className={`
          inline-block font-semibold max-w-full whitespace-nowrap overflow-hidden text-ellipsis
          cursor-default outline-none leading-[1.4] no-underline
          ${size === 'SMALL' ? 'rounded-[0.0714rem]' : 'rounded-[0.1429rem]'}
          ${sizeMap[size]}
          ${bgClass}
          ${textClass}
          ${tag.link ? 'hover:underline hover:cursor-pointer' : ''}
        `.replace(/\s+/g, ' ').trim()}
        style={style}
        aria-label={tag.accessibilityText}
      >
        {tag.text}
      </Component>
    )
  }

  return (
    <div className={`${marginAboveMap[marginAbove]} ${marginBelowMap[marginBelow]}`}>
      {label && labelPosition !== "COLLAPSED" && (
        <label className="block text-sail-standard font-medium mb-sail-less text-gray-5">
          {label}
        </label>
      )}
      <div className={`flex flex-wrap gap-sail-less ${alignMap[align]}`}>
        {tags.map(renderTag)}
      </div>
    </div>
  )
}
