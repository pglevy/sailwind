import * as React from 'react'

type CardHeight = "AUTO" | "SHORT" | "MEDIUM" | "TALL" | "EXTRA_TALL"
type CardStyle = "NONE" | "ACCENT" | "SUCCESS" | "WARN" | "ERROR" | "INFO"
type CardShape = "SQUARED" | "SEMI_ROUNDED" | "ROUNDED"
type CardPadding = "NONE" | "EVEN_LESS" | "LESS" | "STANDARD" | "MORE" | "EVEN_MORE"
type MarginSize = "NONE" | "EVEN_LESS" | "LESS" | "STANDARD" | "MORE" | "EVEN_MORE"

export interface CardLayoutProps {
  children: React.ReactNode
  height?: CardHeight
  style?: CardStyle
  shape?: CardShape
  padding?: CardPadding
  marginAbove?: MarginSize
  marginBelow?: MarginSize
  showBorder?: boolean
  showShadow?: boolean
  borderColor?: string
  decorativeBarPosition?: "TOP" | "START" | "NONE"
  decorativeBarColor?: string
}

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
  decorativeBarColor
}) => {
  const heightMap = {
    AUTO: 'h-auto',
    SHORT: 'h-32',
    MEDIUM: 'h-48',
    TALL: 'h-64',
    EXTRA_TALL: 'h-96'
  }

  const shapeMap = {
    SQUARED: 'rounded-sail-squared',
    SEMI_ROUNDED: 'rounded-sail-semi-rounded',
    ROUNDED: 'rounded-sail-rounded'
  }

  const paddingMap = {
    NONE: 'p-sail-none',
    EVEN_LESS: 'p-sail-even-less',
    LESS: 'p-sail-less',
    STANDARD: 'p-sail-standard',
    MORE: 'p-sail-more',
    EVEN_MORE: 'p-sail-even-more'
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

  const styleColorMap = {
    NONE: '',
    ACCENT: 'border-blue-3',
    SUCCESS: 'border-green-3',
    WARN: 'border-orange-3',
    ERROR: 'border-red-3',
    INFO: 'border-sky-3'
  }

  const decorativeBarColorMap = {
    ACCENT: '#2322F0',
    SUCCESS: '#17B00B',
    WARN: '#FF9000',
    ERROR: '#E91547',
    INFO: '#0087FF'
  }

  const getDecorativeBarColor = () => {
    if (decorativeBarColor) {
      return decorativeBarColor.startsWith('#')
        ? decorativeBarColor
        : decorativeBarColorMap[decorativeBarColor as keyof typeof decorativeBarColorMap]
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
    ${showBorder ? `border-2 ${styleColorMap[style] || ''}` : ''}
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
        />
      )}
      {decorativeBarPosition === "START" && (
        <div
          className="absolute top-0 left-0 bottom-0 w-1"
          style={{ backgroundColor: getDecorativeBarColor() }}
        />
      )}
      <div className={decorativeBarPosition === "TOP" ? "pt-sail-even-less" : ""}>
        {children}
      </div>
    </div>
  )
}
