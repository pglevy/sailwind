import * as React from 'react'
import { Info, CheckCircle, AlertCircle, AlertTriangle } from 'lucide-react'
import type { SAILShape, SAILMarginSize } from '../../types/sail'

export type BackgroundColor = "INFO" | "SUCCESS" | "WARN" | "ERROR" | string
export type HighlightColor = "INFO" | "POSITIVE" | "WARN" | "NEGATIVE" | string
export type AnnounceBehavior = "DISPLAY_ONLY" | "DISPLAY_AND_ANNOUNCE" | "ANNOUNCE_ONLY"

export interface MessageBannerProps {
  /** Text to display on the first line inside the banner */
  primaryText?: string
  /** Text to display beneath the primary text inside the banner */
  secondaryText?: string
  /** Background color - semantic values or hex color (with optional transparency) */
  backgroundColor?: BackgroundColor
  /** Color of the decorative bar and icon - semantic values or hex color */
  highlightColor?: HighlightColor
  /** Icon to display before the primary text (decorative only) */
  icon?: "info" | "success" | "warning" | "error"
  /** Whether to show the decorative bar */
  showDecorativeBar?: boolean
  /** Banner shape */
  shape?: SAILShape
  /** Space above the banner */
  marginAbove?: SAILMarginSize
  /** Space below the banner */
  marginBelow?: SAILMarginSize
  /** Whether the component is evaluated */
  showWhen?: boolean
  /** Screen reader behavior for announcing banner text */
  announceBehavior?: AnnounceBehavior
  /** Additional text for screen readers only */
  accessibilityText?: string
}

export const MessageBanner: React.FC<MessageBannerProps> = ({
  primaryText,
  secondaryText,
  backgroundColor = "INFO",
  highlightColor = "INFO",
  icon,
  showDecorativeBar = true,
  shape = "SQUARED",
  marginAbove = "NONE",
  marginBelow = "STANDARD",
  showWhen = true,
  announceBehavior = "DISPLAY_ONLY",
  accessibilityText
}) => {
  // Visibility control
  if (!showWhen) return null

  // Don't render visually if announce-only
  const isVisuallyHidden = announceBehavior === "ANNOUNCE_ONLY"

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

  const shapeMap: Record<SAILShape, string> = {
    SQUARED: 'rounded-none',
    SEMI_ROUNDED: 'rounded-sm',
    ROUNDED: 'rounded-md'
  }

  // Semantic color mappings with dark semantic text
  const backgroundColorMap: Record<string, { bg: string; text: string }> = {
    INFO: { bg: 'bg-blue-100', text: 'text-blue-900' },
    SUCCESS: { bg: 'bg-green-100', text: 'text-green-900' },
    WARN: { bg: 'bg-yellow-100', text: 'text-yellow-900' },
    ERROR: { bg: 'bg-red-100', text: 'text-red-900' }
  }

  const highlightColorMap: Record<string, string> = {
    INFO: 'bg-blue-500',
    POSITIVE: 'bg-green-700',
    WARN: 'bg-yellow-500',
    NEGATIVE: 'bg-red-700'
  }

  // Icon mapping
  const iconMap = {
    info: Info,
    success: CheckCircle,
    warning: AlertTriangle,
    error: AlertCircle
  }

  const IconComponent = icon ? iconMap[icon] : null
  const isSemanticBg = backgroundColor in backgroundColorMap
  const bgColors = isSemanticBg 
    ? backgroundColorMap[backgroundColor]
    : { bg: '', text: 'text-gray-900' }

  // Determine highlight bar color
  const isSemanticHighlight = highlightColor in highlightColorMap
  const highlightBarColor = isSemanticHighlight 
    ? highlightColorMap[highlightColor]
    : ''

  // Build CSS classes
  const containerClasses = [
    'relative',
    'flex',
    'items-start',
    'p-4',
    shapeMap[shape],
    marginAboveMap[marginAbove],
    marginBelowMap[marginBelow],
    isSemanticBg ? bgColors.bg : '',
    isSemanticBg ? bgColors.text : 'text-gray-900',
    isVisuallyHidden && 'sr-only'
  ].filter(Boolean).join(' ')

  // Inline styles for custom colors
  const containerStyle: React.CSSProperties = {}
  if (!isSemanticBg && backgroundColor) {
    containerStyle.backgroundColor = backgroundColor
  }

  const highlightStyle: React.CSSProperties = {}
  if (!isSemanticHighlight && highlightColor) {
    highlightStyle.backgroundColor = highlightColor
  }

  // ARIA attributes for screen reader behavior
  const ariaAttributes: Record<string, any> = {}
  if (announceBehavior === "DISPLAY_AND_ANNOUNCE" || announceBehavior === "ANNOUNCE_ONLY") {
    ariaAttributes.role = "status"
    ariaAttributes["aria-live"] = "polite"
  }

  return (
    <div 
      className={containerClasses}
      style={containerStyle}
      {...ariaAttributes}
    >
      {/* Decorative bar */}
      {showDecorativeBar && (
        <div 
          className={`absolute left-0 top-0 bottom-0 w-1 ${isSemanticHighlight ? highlightBarColor : ''}`}
          style={!isSemanticHighlight ? highlightStyle : undefined}
          aria-hidden="true"
        />
      )}

      {/* Content area */}
      <div className="flex items-start w-full pl-3">
        {/* Icon */}
        {IconComponent && (
          <div className="flex-shrink-0 mr-3 mt-0.5" aria-hidden="true">
            <IconComponent className="w-5 h-5" />
          </div>
        )}

        {/* Text content */}
        <div className="flex-1 min-w-0">
          {primaryText && (
            <p className="text-base font-medium leading-5">
              {primaryText}
            </p>
          )}
          {secondaryText && (
            <p className={`text-sm leading-5 ${primaryText ? 'mt-1' : ''}`}>
              {secondaryText}
            </p>
          )}
        </div>
      </div>

      {/* Screen reader only text */}
      {accessibilityText && (
        <span className="sr-only">{accessibilityText}</span>
      )}
    </div>
  )
}
