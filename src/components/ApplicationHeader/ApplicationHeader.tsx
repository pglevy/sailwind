import * as React from 'react'
import { ButtonWidget } from '../Button/ButtonWidget'
import { ButtonArrayLayout } from '../Button/ButtonArrayLayout'
import { ToggleField } from '../Toggle/ToggleField'
import { ButtonToggle } from '../ButtonToggle/ButtonToggle'
import type { SAILColorInput } from '../../types/sail'
import { paletteHexMap, type SAILPaletteColor } from '../../types/palette-colors.generated'
import {
  ICON_APP,
  ICON_INTERFACE,
  ICON_RECORD_TYPE,
  ICON_EXPRESSION_RULE,
  APPIAN_LOGO,
} from './assets'

type ObjectType = 'app' | 'interface' | 'record-type' | 'expression-rule'

const DEFAULT_ICON_MAP: Record<ObjectType, string> = {
  'app': ICON_APP,
  'interface': ICON_INTERFACE,
  'record-type': ICON_RECORD_TYPE,
  'expression-rule': ICON_EXPRESSION_RULE,
}

export interface ApplicationHeaderProps {
  /** Name of the application or object */
  name?: string
  /** User initials to display in avatar */
  userInitials?: string
  /** Show interface designer controls */
  showDesignerControls?: boolean
  /** Type of object being displayed */
  objectType?: ObjectType
  /** Path to custom icon image */
  iconSrc?: string
  /** Preview mode enabled */
  previewEnabled?: boolean
  /** Stories view enabled */
  showStoriesView?: boolean
  /** Callback when preview toggle changes */
  onPreviewToggle?: (enabled: boolean) => void
  /** Callback when stories toggle changes */
  onStoryToggle?: () => void
  /** Callback when back button clicked */
  onBackClick?: () => void
  /** Path to Appian logo image */
  appianLogoSrc?: string
  /** Background color for the header (hex). Foreground colors auto-swap for contrast. */
  backgroundColor?: string
  /** Additional buttons to display before the right-side controls */
  additionalButtons?: Array<{
    label: string
    style?: "SOLID" | "OUTLINE" | "GHOST" | "LINK"
    size?: "SMALL" | "STANDARD" | "MEDIUM" | "LARGE"
    color?: SAILColorInput
    onClick?: () => void
  }>
  /** Additional Tailwind classes for prototype-specific styling (not part of SAIL API) */
  className?: string
}

/**
 * ApplicationHeader Component
 * Displays the main application header with navigation, controls, and user info
 * 
 */
export const ApplicationHeader: React.FC<ApplicationHeaderProps> = ({
  name = "Application",
  userInitials = "U",
  showDesignerControls = false,
  objectType = 'app',
  iconSrc,
  previewEnabled = false,
  showStoriesView = false,
  onPreviewToggle,
  onStoryToggle,
  onBackClick,
  appianLogoSrc,
  backgroundColor,
  additionalButtons = [],
  className
}) => {
  const displayIconSrc = iconSrc || DEFAULT_ICON_MAP[objectType]
  const isDefaultIcon = !iconSrc
  const resolvedLogoSrc = appianLogoSrc ?? APPIAN_LOGO

  // Only support full #rrggbb hex — anything else falls back to default gradient
  const isValidHex = (s: string) => /^#[0-9a-fA-F]{6}$/.test(s)
  const resolvedBgColor = backgroundColor && (backgroundColor in paletteHexMap)
    ? paletteHexMap[backgroundColor as SAILPaletteColor]
    : backgroundColor
  const validBgColor = resolvedBgColor && isValidHex(resolvedBgColor) ? resolvedBgColor : undefined

  // WCAG contrast helper — returns '#ffffff' or '#000000' for a hex bg
  const getContrastColor = (hex: string): string => {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    const toLinear = (c: number) => { const s = c / 255; return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4) }
    const L = 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b)
    return (1.05 / (L + 0.05)) >= ((L + 0.05) / 0.05) ? '#ffffff' : '#000000'
  }

  const fgColor = validBgColor ? getContrastColor(validBgColor) : undefined
  const isLight = fgColor === '#000000'
  // For ghost buttons: use a hex color so ButtonWidget applies inline styles
  const ghostButtonColor: SAILColorInput = fgColor ?? 'STANDARD'

  const headerClasses = [
    !validBgColor && 'application-header-gradient border-b border-gray-200',
    className
  ].filter(Boolean).join(' ')

  const headerStyle: React.CSSProperties | undefined = validBgColor
    ? { backgroundColor: validBgColor, borderBottom: '1px solid rgba(0,0,0,0.1)' }
    : undefined

  return (
    <div className={headerClasses} style={headerStyle}>
      <div className="flex items-center justify-between px-6 pt-4 pb-3 min-w-0 overflow-x-auto">
        {/* Left section */}
        <div className="flex items-center gap-3 shrink-0">
          {showDesignerControls && onBackClick && (
            <ButtonWidget
              icon="ChevronLeft"
              style="GHOST"
              size="SMALL"
              color={ghostButtonColor}
              onClick={onBackClick}
              className="aspect-square"
            />
          )}
          
          <div className="flex items-center gap-1">
            <img 
              src={displayIconSrc}
              alt={objectType}
              className="h-8 w-8 mr-2"
              style={fgColor && !isLight && isDefaultIcon ? { filter: 'invert(1)' } : undefined}
            />
            <span className="font-bold" style={fgColor ? { color: fgColor } : { color: '#1f2937' }}>{name}</span>
          </div>

          {showDesignerControls && (
            <>
              <div className="flex items-center gap-0 ml-4 bg-gray-50 p-1 rounded-sm">
                <ButtonToggle
                  icon="square-dashed-mouse-pointer"
                  style="GHOST"
                  size="SMALL"
                  value={!showStoriesView}
                  saveInto={showStoriesView ? onStoryToggle : undefined}
                  marginBelow="NONE"
                />
                <ButtonToggle
                  icon="code"
                  style="GHOST"
                  size="SMALL"
                  value={false}
                  marginBelow="NONE"
                />
              </div>

              <div className="mt-1 [&>div>div]:flex-row-reverse [&>div>div]:gap-2 [&_label]:mb-1 scale-75">
                <ToggleField
                  label="Preview"
                  labelPosition="ADJACENT"
                  value={previewEnabled}
                  saveInto={onPreviewToggle}
                  marginBelow="NONE"
                />
              </div>
            </>
          )}
        </div>

        {/* Center section */}
        <div className="flex items-center gap-0 shrink-0">
          {showDesignerControls && (
            <>
              <div className="[&>div]:gap-1 mr-0">
                <ButtonArrayLayout
                  buttons={[
                    {
                      icon: "palette",
                      style: "GHOST",
                      size: "SMALL",
                      color: ghostButtonColor,
                      className: "aspect-square"
                    },
                    {
                      icon: "monitor",
                      style: "GHOST",
                      size: "SMALL",
                      color: ghostButtonColor,
                      className: "aspect-square"
                    },
                    {
                      icon: "globe",
                      style: "GHOST",
                      size: "SMALL",
                      color: ghostButtonColor,
                      className: "aspect-square"
                    }
                  ]}
                  marginBelow="NONE"
                />
              </div>
              <div className="[&_button]:border-0">
                <ButtonToggle
                  icon="book-open-text"
                  style={!showStoriesView ? "GHOST" : "SOLID"}
                  size="SMALL"
                  value={showStoriesView}
                  saveInto={onStoryToggle}
                  marginBelow="NONE"
                  color={!showStoriesView ? ghostButtonColor : "ACCENT"}
                />
              </div>
            </>
          )}
        </div>

        {/* Right section */}
        <div className="flex items-center gap-0 shrink-0">
          {additionalButtons.length > 0 && (
            <div className="[&>div]:gap-1 mr-3">
              <ButtonArrayLayout
                buttons={additionalButtons.map(btn => ({
                  label: btn.label,
                  style: btn.style || "OUTLINE",
                  size: btn.size || "SMALL",
                  color: btn.color || "STANDARD",
                  onClick: btn.onClick,
                  className: "border-1"
                }))}
                marginBelow="NONE"
              />
            </div>
          )}

          {showDesignerControls && (
            <>
              <ButtonWidget
                icon="Lightbulb"
                style="GHOST"
                size="SMALL"
                color={ghostButtonColor}
                className="aspect-square"
              />
              <ButtonWidget
                icon="Undo"
                style="GHOST"
                size="SMALL"
                color={ghostButtonColor}
                className="aspect-square"
              />
              <ButtonWidget
                icon="Redo"
                style="GHOST"
                size="SMALL"
                color={ghostButtonColor}
                className="aspect-square mr-3"
              />
              <ButtonWidget
                icon="PieChart"
                style="GHOST"
                size="SMALL"
                color={ghostButtonColor}
                className="aspect-square mr-3"
              />
              
              <div className="[&>div]:gap-1 mr-3">
                <ButtonArrayLayout
                  buttons={[
                    {
                      label: "TEST",
                      style: "OUTLINE",
                      size: "SMALL",
                      className: "border-1"
                    },
                    {
                      label: "SAVE",
                      style: "SOLID",
                      color: "ACCENT",
                      size: "SMALL",
                      className: "border-1"
                    }
                  ]}
                  marginBelow="NONE"
                />
              </div>
            </>
          )}

          <ButtonWidget
            icon="Search"
            style="GHOST"
            size="SMALL"
            color={ghostButtonColor}
            className="aspect-square"
          />
          <ButtonWidget
            icon="Settings"
            style="GHOST"
            size="SMALL"
            color={ghostButtonColor}
            className="aspect-square"
          />
          <ButtonWidget
            icon="Grid3X3"
            style="GHOST"
            size="SMALL"
            color={ghostButtonColor}
            className="aspect-square mr-3"
          />
          
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center mr-3"
            style={fgColor
              ? { border: `1px solid ${fgColor}`, color: fgColor }
              : { border: '1px solid #d1d5db', color: '#374151' }}
          >
            <span className="text-sm font-medium">{userInitials}</span>
          </div>
          
          <img 
            src={resolvedLogoSrc} 
            alt="Appian" 
            className="h-6 w-auto"
            style={fgColor && !isLight ? { filter: 'invert(1)' } : undefined}
          />
        </div>
      </div>
    </div>
  )
}
