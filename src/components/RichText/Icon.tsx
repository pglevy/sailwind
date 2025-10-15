import * as React from 'react'
import * as LucideIcons from 'lucide-react'
import type { SAILSizeExtended, SAILSemanticColor } from '../../types/sail'

type LinkStyle = "INLINE" | "STANDALONE"

export interface IconProps {
  /** The key of the icon to display */
  icon: string
  /** Alternative text for accessibility */
  altText?: string
  /** Text to display on mouseover */
  caption?: string
  /** Icon size */
  size?: SAILSizeExtended
  /** Icon color - semantic color or hex value */
  color?: SAILSemanticColor | string
  /** Link behavior when icon is clicked */
  link?: () => void
  /** How the link is underlined */
  linkStyle?: LinkStyle
  /** Whether to show this component */
  showWhen?: boolean
}

/**
 * Icon component for use within Rich Text Display Field
 * Displays icons with various formatting options
 */
export const Icon: React.FC<IconProps> = ({
  icon,
  altText,
  caption,
  size = "STANDARD",
  color = "STANDARD",
  link,
  linkStyle = "INLINE", // Note: linkStyle not implemented yet for icons
  showWhen = true
}) => {
  // Suppress unused variable warning - linkStyle will be implemented later
  void linkStyle
  if (!showWhen || !icon) return null

  // Size mappings - icons use similar sizing to text
  const sizeMap: Record<SAILSizeExtended, number> = {
    SMALL: 12,
    STANDARD: 16,
    MEDIUM: 20,
    MEDIUM_PLUS: 24,
    LARGE: 28,
    LARGE_PLUS: 32,
    EXTRA_LARGE: 40
  }

  // Color mappings
  const colorMap: Record<SAILSemanticColor, string> = {
    STANDARD: 'text-gray-900',
    ACCENT: 'text-blue-500',
    POSITIVE: 'text-green-700',
    NEGATIVE: 'text-red-700',
    SECONDARY: 'text-gray-700'
  }

  // Build classes array
  const classes = [
    'inline-block',
    // Handle color - use semantic mapping or inline style for hex
    color.startsWith('#') ? '' : colorMap[color as SAILSemanticColor] || 'text-gray-900',
    // Link styles
    link && 'cursor-pointer',
    link && 'hover:opacity-75'
  ].filter(Boolean).join(' ')

  // Inline styles for hex colors
  const inlineStyles = color.startsWith('#') ? { color } : undefined

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
      'USER': 'User',
      'PHONE': 'Phone',
      'BUILDING-O': 'Building',
      'HOME': 'Home',
      'CHECK-SQUARE-O': 'SquareCheck',
      'FILE-TEXT-O': 'FileText',
      'PICTURE-O': 'Image',
      'HEADPHONES': 'Headphones',
      'VIDEO-CAMERA': 'Video',
      'WRENCH': 'Wrench',
      'EXCLAMATION': 'AlertTriangle',
      'TICKET': 'Ticket',
      'ARROW-RIGHT': 'ArrowRight',
      'CHECK': 'Check'
    }
    
    const lucideIconName = sailIconMap[iconName.toUpperCase()]
    if (lucideIconName && lucideIconName in LucideIcons) {
      return LucideIcons[lucideIconName] as React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>
    }
    
    // Fallback to a generic icon
    return LucideIcons.Circle as React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>
  }

  const IconComponent = getIconComponent(icon)

  const iconElement = (
    <span
      className="inline-flex items-center translate-y-0.5"
      title={caption}
      aria-label={altText || caption}
      role={altText || caption ? 'img' : 'presentation'}
    >
      <IconComponent
        size={sizeMap[size]}
        className={classes}
        style={inlineStyles}
      />
    </span>
  )

  // If there's a link, wrap in clickable element
  if (link) {
    return (
      <span
        onClick={link}
        role="button"
        tabIndex={0}
        className="inline-block"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            link()
          }
        }}
      >
        {iconElement}
      </span>
    )
  }

  return iconElement
}
