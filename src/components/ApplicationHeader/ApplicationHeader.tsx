import * as React from 'react'
import { ButtonWidget } from '../Button/ButtonWidget'
import { ButtonArrayLayout } from '../Button/ButtonArrayLayout'
import { SwitchField } from '../Switch/SwitchField'
import { ToggleField } from '../Toggle/ToggleField'

type ObjectType = 'app' | 'interface' | 'record-type' | 'expression-rule'

const DEFAULT_ICON_MAP: Record<ObjectType, string> = {
  'app': 'images/icon-app.svg',
  'interface': 'images/icon-interface.svg',
  'record-type': 'images/icon-record-type.svg',
  'expression-rule': 'images/icon-expression-rule.svg',
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
  /** Additional buttons to display before the right-side controls */
  additionalButtons?: Array<{
    label: string
    style?: "SOLID" | "OUTLINE" | "GHOST" | "LINK"
    size?: "SMALL" | "STANDARD" | "MEDIUM" | "LARGE"
    color?: string
    onClick?: () => void
  }>
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
  appianLogoSrc = 'images/icon-appian-header.png',
  additionalButtons = []
}) => {
  const displayIconSrc = iconSrc || DEFAULT_ICON_MAP[objectType]

  return (
    <div className="application-header-gradient border-b border-gray-200">
      <div className="flex items-center justify-between px-6 pt-4 pb-3">
        {/* Left section */}
        <div className="flex items-center gap-3">
          {showDesignerControls && onBackClick && (
            <ButtonWidget
              icon="ChevronLeft"
              style="GHOST"
              size="SMALL"
              onClick={onBackClick}
              className="aspect-square"
            />
          )}
          
          <div className="flex items-center gap-1">
            <img 
              src={displayIconSrc}
              alt={objectType}
              className="h-8 w-8 mr-2"
            />
            <span className="text-gray-800 font-bold">{name}</span>
          </div>

          {showDesignerControls && (
            <>
              <div className="flex items-center gap-0 ml-4 bg-gray-50 p-1 rounded-sm">
                <ToggleField
                  icon="square-dashed-mouse-pointer"
                  style="GHOST"
                  size="SMALL"
                  value={!showStoriesView}
                  saveInto={showStoriesView ? onStoryToggle : undefined}
                  marginBelow="NONE"
                />
                <ToggleField
                  icon="code"
                  style="GHOST"
                  size="SMALL"
                  value={false}
                  marginBelow="NONE"
                />
              </div>

              <div className="mt-1 [&>div>div]:flex-row-reverse [&>div>div]:gap-2 [&_label]:mb-1 scale-75">
                <SwitchField
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
        <div className="flex items-center gap-0">
          {showDesignerControls && (
            <>
              <div className="[&>div]:gap-1 mr-0">
                <ButtonArrayLayout
                  buttons={[
                    {
                      icon: "palette",
                      style: "GHOST",
                      size: "SMALL",
                      color: "STANDARD",
                      className: "aspect-square"
                    },
                    {
                      icon: "monitor",
                      style: "GHOST",
                      size: "SMALL",
                      color: "STANDARD",
                      className: "aspect-square"
                    },
                    {
                      icon: "globe",
                      style: "GHOST",
                      size: "SMALL",
                      color: "STANDARD",
                      className: "aspect-square"
                    }
                  ]}
                  marginBelow="NONE"
                />
              </div>
              <div className="[&_button]:border-0">
                <ToggleField
                  icon="book-open-text"
                  style={!showStoriesView ? "GHOST" : "SOLID"}
                  size="SMALL"
                  value={showStoriesView}
                  saveInto={onStoryToggle}
                  marginBelow="NONE"
                  color={!showStoriesView ? "STANDARD" : "ACCENT"}
                />
              </div>
            </>
          )}
        </div>

        {/* Right section */}
        <div className="flex items-center gap-0">
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
                color="STANDARD"
                className="aspect-square"
              />
              <ButtonWidget
                icon="Undo"
                style="GHOST"
                size="SMALL"
                color="STANDARD"
                className="aspect-square"
              />
              <ButtonWidget
                icon="Redo"
                style="GHOST"
                size="SMALL"
                color="STANDARD"
                className="aspect-square mr-3"
              />
              <ButtonWidget
                icon="PieChart"
                style="GHOST"
                size="SMALL"
                color="STANDARD"
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
            color="STANDARD"
            className="aspect-square"
          />
          <ButtonWidget
            icon="Settings"
            style="GHOST"
            size="SMALL"
            color="STANDARD"
            className="aspect-square"
          />
          <ButtonWidget
            icon="Grid3X3"
            style="GHOST"
            size="SMALL"
            color="STANDARD"
            className="aspect-square mr-3"
          />
          
          <div className="w-8 h-8 border border-gray-300 rounded-full flex items-center justify-center mr-3">
            <span className="text-gray-700 text-sm font-medium">{userInitials}</span>
          </div>
          
          <img 
            src={appianLogoSrc} 
            alt="Appian" 
            className="h-6 w-auto"
          />
        </div>
      </div>
    </div>
  )
}
