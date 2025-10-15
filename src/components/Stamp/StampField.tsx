import * as React from 'react'
import * as LucideIcons from 'lucide-react'
import type { SAILLabelPosition, SAILMarginSize, SAILAlign, SAILShape, SAILSemanticColor } from '../../types/sail'

type StampSize = "TINY" | "SMALL" | "MEDIUM" | "LARGE"
type StampBackgroundColor = SAILSemanticColor | "TRANSPARENT" | string
type StampContentColor = SAILSemanticColor | string

export interface StampFieldProps {
  /** Text to display as the field label */
  label?: string
  /** Determines where the label appears */
  labelPosition?: SAILLabelPosition
  /** Supplemental text about this field */
  instructions?: string
  /** Displays a help icon with the specified text as a tooltip */
  helpTooltip?: string
  /** Icon to display inside the stamp */
  icon?: string
  /** Text to display within the stamp */
  text?: string
  /** Determines the background color */
  backgroundColor?: StampBackgroundColor
  /** Determines the icon color */
  contentColor?: StampContentColor
  /** Determines the size of the stamp */
  size?: StampSize
  /** Determines alignment of the stamp */
  align?: SAILAlign
  /** Text to display on mouseover (web) or tap (mobile) */
  tooltip?: string
  /** Determines whether the component is displayed on the interface */
  showWhen?: boolean
  /** Additional text to be announced by screen readers */
  accessibilityText?: string
  /** Link to apply to the stamp */
  link?: any
  /** Determines how much space is added above the layout */
  marginAbove?: SAILMarginSize
  /** Determines how much space is added below the layout */
  marginBelow?: SAILMarginSize
  /** Determines the stamp shape */
  shape?: SAILShape
}

/**
 * Displays an icon and/or text on a colored circular background.
 * Best used as a decorative component to add visual interest to your page.
 */
export const StampField: React.FC<StampFieldProps> = ({
  label,
  labelPosition = "ABOVE",
  instructions,
  helpTooltip,
  icon,
  text,
  backgroundColor = "ACCENT",
  contentColor = "STANDARD",
  size = "MEDIUM",
  align = "CENTER",
  tooltip,
  showWhen = true,
  accessibilityText,
  link,
  marginAbove = "NONE",
  marginBelow = "NONE",
  shape = "ROUNDED"
}) => {
  // Visibility control
  if (!showWhen) return null

  // Styling maps using standard Tailwind classes
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

  const sizeMap: Record<StampSize, { container: string; text: string; icon: string }> = {
    TINY: { container: 'w-6 h-6', text: 'text-xs', icon: 'text-xs' },
    SMALL: { container: 'w-8 h-8', text: 'text-sm', icon: 'text-sm' },
    MEDIUM: { container: 'w-12 h-12', text: 'text-base', icon: 'text-base' },
    LARGE: { container: 'w-16 h-16', text: 'text-lg', icon: 'text-lg' }
  }

  const alignMap: Record<SAILAlign, string> = {
    START: 'justify-start',
    CENTER: 'justify-center',
    END: 'justify-end'
  }

  const shapeMap: Record<SAILShape, string> = {
    SQUARED: 'rounded-none',
    SEMI_ROUNDED: 'rounded-sm',
    ROUNDED: 'rounded-full'
  }

  // Background color mapping
  const getBackgroundColor = (): { className?: string; style?: React.CSSProperties } => {
    if (backgroundColor === "TRANSPARENT") {
      return { className: 'bg-transparent' }
    }

    const semanticColorMap: Record<string, string> = {
      ACCENT: 'bg-blue-500',
      POSITIVE: 'bg-green-700',
      NEGATIVE: 'bg-red-700',
      SECONDARY: 'bg-gray-700',
      STANDARD: 'bg-gray-900'
    }

    if (semanticColorMap[backgroundColor]) {
      return { className: semanticColorMap[backgroundColor] }
    }

    // Hex color - use inline style
    if (backgroundColor.startsWith('#')) {
      return { style: { backgroundColor } }
    }

    // Default fallback
    return { className: 'bg-blue-500' }
  }

  // Content color mapping
  const getContentColor = (): { className?: string; style?: React.CSSProperties } => {
    const semanticColorMap: Record<string, string> = {
      STANDARD: backgroundColor === "TRANSPARENT" ? 'text-gray-900' : 'text-white',
      ACCENT: 'text-blue-500',
      POSITIVE: 'text-green-700',
      NEGATIVE: 'text-red-700',
      SECONDARY: 'text-gray-700'
    }

    if (semanticColorMap[contentColor]) {
      return { className: semanticColorMap[contentColor] }
    }

    // Hex color - use inline style
    if (contentColor.startsWith('#')) {
      return { style: { color: contentColor } }
    }

    // Default fallback
    return { className: backgroundColor === "TRANSPARENT" ? 'text-gray-900' : 'text-white' }
  }

  // Border for transparent background
  const getBorderColor = (): string => {
    if (backgroundColor !== "TRANSPARENT") return ''

    const semanticColorMap: Record<string, string> = {
      STANDARD: 'border-gray-900',
      ACCENT: 'border-blue-500',
      POSITIVE: 'border-green-700',
      NEGATIVE: 'border-red-700',
      SECONDARY: 'border-gray-700'
    }

    return semanticColorMap[contentColor] || 'border-gray-900'
  }

  const backgroundStyles = getBackgroundColor()
  const contentStyles = getContentColor()
  const borderClass = backgroundColor === "TRANSPARENT" ? `border-2 ${getBorderColor()}` : ''

  const stampClasses = [
    'flex',
    'items-center',
    'justify-center',
    'font-medium',
    sizeMap[size].container,
    shapeMap[shape],
    backgroundStyles.className,
    contentStyles.className,
    borderClass,
    alignMap[align] === 'justify-start' ? 'self-start' : 
    alignMap[align] === 'justify-end' ? 'self-end' : 'self-center',
    link ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''
  ].filter(Boolean).join(' ')

  const containerClasses = [
    marginAboveMap[marginAbove],
    marginBelowMap[marginBelow]
  ].filter(Boolean).join(' ')

  const stampStyle = {
    ...backgroundStyles.style,
    ...contentStyles.style
  }

  // Map any Lucide icon name directly, with SAIL compatibility fallbacks
  const getIconComponent = (iconName: string) => {
    // First try direct Lucide icon name (kebab-case or PascalCase)
    const kebabToPascal = (str: string) => 
      str.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('')
    
    const pascalIconName = kebabToPascal(iconName)
    if (pascalIconName in LucideIcons) {
      return LucideIcons[pascalIconName as keyof typeof LucideIcons] as React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>
    }
    
    // Also try direct case-insensitive lookup
    const directIconName = iconName.charAt(0).toUpperCase() + iconName.slice(1).toLowerCase()
    if (directIconName in LucideIcons) {
      return LucideIcons[directIconName as keyof typeof LucideIcons] as React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>
    }
    
    // Fallback to SAIL compatibility mapping
    const sailIconMap: Record<string, keyof typeof LucideIcons> = {
      'STAR': 'Star',
      'HOME': 'Home',
      'USER': 'User',
      'PHONE': 'Phone',
      'briefcase': 'Briefcase',
      'tasks': 'ListTodo',
      'paper-plane': 'Send',
      'calendar': 'Calendar',
      'clock-o': 'Clock',
      'money': 'DollarSign'
    }
    
    const lucideIconName = sailIconMap[iconName]
    if (lucideIconName && lucideIconName in LucideIcons) {
      return LucideIcons[lucideIconName] as React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>
    }
    
    // Fallback to a generic icon
    return LucideIcons.Circle as React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>
  }

  const renderStampContent = () => {
    if (icon && text) {
      const IconComponent = getIconComponent(icon)
      return (
        <div className="flex flex-col items-center justify-center">
          <IconComponent 
            size={sizeMap[size].container === 'w-6 h-6' ? 12 : 
                  sizeMap[size].container === 'w-8 h-8' ? 14 :
                  sizeMap[size].container === 'w-12 h-12' ? 18 : 22}
            className="leading-none"
          />
          <span className={`${sizeMap[size].text} leading-none mt-0.5`}>
            {text}
          </span>
        </div>
      )
    }

    if (icon) {
      const IconComponent = getIconComponent(icon)
      return (
        <IconComponent 
          size={sizeMap[size].container === 'w-6 h-6' ? 12 : 
                sizeMap[size].container === 'w-8 h-8' ? 16 :
                sizeMap[size].container === 'w-12 h-12' ? 20 : 28}
          className="leading-none"
        />
      )
    }

    if (text) {
      return (
        <span className={`${sizeMap[size].text} leading-none font-semibold`}>
          {text}
        </span>
      )
    }

    return null
  }

  const stampElement = (
    <div
      className={stampClasses}
      style={stampStyle}
      title={tooltip}
      role={link ? "button" : undefined}
      tabIndex={link ? 0 : undefined}
      aria-label={accessibilityText || text || `${icon} stamp`}
    >
      {renderStampContent()}
    </div>
  )

  const wrappedStamp = link ? (
    <div onClick={() => link?.onClick?.()} onKeyDown={(e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        link?.onClick?.()
      }
    }}>
      {stampElement}
    </div>
  ) : stampElement

  const renderLabel = () => {
    if (!label || labelPosition === "COLLAPSED") {
      return accessibilityText ? (
        <span className="sr-only">{label || accessibilityText}</span>
      ) : null
    }

    return (
      <label className="text-base font-medium text-gray-900 block mb-2">
        {label}
        {helpTooltip && (
          <span
            className="ml-2 text-gray-700 cursor-help"
            title={helpTooltip}
            aria-label="help"
          >
            ℹ️
          </span>
        )}
      </label>
    )
  }

  return (
    <div className={containerClasses}>
      {renderLabel()}
      {wrappedStamp}
      {instructions && (
        <p className="text-gray-700 text-sm mt-2">
          {instructions}
        </p>
      )}
    </div>
  )
}
