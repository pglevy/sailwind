import * as React from 'react'
import {
  ChevronRight,
  ChevronLeft,
  LayoutGrid,
  type LucideIcon,
} from 'lucide-react'
import { ImageField } from '../Image/ImageField'
import type { SAILSemanticColor } from '../../types/sail'

/**
 * Represents a single page/tab in the site navigation.
 * Maps to SAIL's NavigationNode / NavigationMenuTab types.
 */
export interface SiteNavPage {
  /** Display text for the page (maps to NavigationNode.name / NavigationMenuTab.label) */
  label: string
  /** Lucide icon component (maps to NavigationNode.icon / NavigationMenuTab.iconFriendlyName) */
  icon?: LucideIcon
  /** Whether this page is currently active (maps to NavigationMenuTab.isSelected) */
  isSelected?: boolean
  /** Whether this is a group with children (maps to NavigationNode.isGroup) */
  isGroup?: boolean
  /** Sub-pages for grouped navigation (maps to NavigationNode.children) */
  children?: SiteNavPage[]
  /** Optional badge text, e.g. "(1)" for unread count */
  badge?: string
  /** Callback when page is clicked */
  onClick?: () => void
}

/**
 * Props for the SiteNav component.
 * Maps to SAIL's a!navigationLayout with primaryNavLayoutType="SIDEBAR".
 */
export interface SiteNavProps {
  /** Site/solution display name (maps to NavigationLayout.displayName) */
  displayName?: string
  /** Array of site pages (maps to NavigationLayout.tabs / NavigationNode[]) */
  pages: SiteNavPage[]
  /** Controlled collapsed state */
  collapsed?: boolean
  /** Callback when collapse toggle is clicked */
  onCollapseToggle?: (collapsed: boolean) => void
  /** Whether to show the navigation (maps to NavigationLayout.showNavigation) */
  showNavigation?: boolean
  /** User full name — initials are derived automatically */
  userName?: string
  /** Path to Appian logo image */
  appianLogoSrc?: string
  /** Background color for the selected/highlighted page. Accepts hex or semantic color. Default: "POSITIVE" */
  highlightColor?: SAILSemanticColor | string
}


/**
 * SiteNav Component
 *
 * Renders the sidebar navigation for an Appian site.
 * Maps to SAIL's a!navigationLayout with primaryNavLayoutType="SIDEBAR".
 */
export const SiteNav: React.FC<SiteNavProps> = ({
  displayName,
  pages,
  collapsed: controlledCollapsed,
  onCollapseToggle,
  showNavigation = true,
  userName,
  appianLogoSrc = 'images/icon-appian-header.png',
  highlightColor = 'POSITIVE',
}) => {
  const [internalCollapsed, setInternalCollapsed] = React.useState(false)

  const isCollapsed = controlledCollapsed ?? internalCollapsed

  // Highlight color mappings
  const semanticHighlightMap: Record<SAILSemanticColor, string> = {
    ACCENT: 'bg-blue-100',
    POSITIVE: 'bg-green-100',
    NEGATIVE: 'bg-red-100',
    SECONDARY: 'bg-gray-100',
    STANDARD: 'bg-gray-200',
  }
  const isHexHighlight = highlightColor.startsWith('#')
  const highlightClass = !isHexHighlight ? (semanticHighlightMap[highlightColor as SAILSemanticColor] || semanticHighlightMap.POSITIVE) : ''
  const highlightStyle = isHexHighlight ? { backgroundColor: highlightColor } : undefined

  const userInitials = userName
    ? userName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : 'U'

  const toggleCollapse = () => {
    const next = !isCollapsed
    setInternalCollapsed(next)
    onCollapseToggle?.(next)
  }

  if (!showNavigation) return null

  return (
      <nav
        className={`flex flex-col h-full bg-white transition-all duration-200 shrink-0 ${
          isCollapsed ? 'w-16' : 'w-[240px]'
        }`}
        aria-label="Site navigation"
      >
        {/* Logo + waffle menu */}
        {!isCollapsed ? (
          <div className="flex items-center justify-between px-4 pt-4 pb-6 shrink-0">
            <img
              src={appianLogoSrc}
              alt="Appian"
              className="h-8 w-auto -mb-0.5"
            />
            {/* Waffle menu (decorative) */}
            <button
              className="flex items-center justify-center w-8 h-8 text-gray-700 hover:bg-gray-100 rounded-sm transition-colors"
              aria-label="Navigation menu"
              title="Navigation menu"
            >
              <LayoutGrid className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-center pt-3 pb-6 shrink-0">
            <img
              src={appianLogoSrc}
              alt="Appian"
              className="h-4 w-auto"
            />
          </div>
        )}

        {/* Site name */}
        {!isCollapsed && displayName && (
          <div className="px-4 pb-3">
            <span className="text-lg font-semibold text-gray-900 leading-tight whitespace-pre-line">
              {displayName}
            </span>
          </div>
        )}

        {/* Page list */}
        <ul className="flex-1 list-none m-0 px-2 py-0 overflow-y-auto" role="list">
          {pages.map((page) => (
            <SiteNavItem
              key={page.label}
              page={page}
              isCollapsed={isCollapsed}
              highlightClass={highlightClass}
              highlightStyle={highlightStyle}
            />
          ))}
        </ul>

        {/* Bottom section */}
        <div className="flex flex-col shrink-0">
          {isCollapsed ? (
            <div className="flex flex-col items-center gap-3 py-4">
              {/* Waffle menu (decorative) */}
              <button
                className="flex items-center justify-center w-8 h-8 text-gray-700 hover:bg-gray-100 rounded-sm transition-colors"
                aria-label="Navigation menu"
                title="Navigation menu"
              >
                <LayoutGrid className="w-5 h-5" />
              </button>

              <ImageField
                images={[{
                  imageType: 'user' as const,
                  user: { name: userName || userInitials, initials: userInitials },
                  altText: userName || userInitials,
                }]}
                style="AVATAR"
                size="ICON_PLUS"
                marginBelow="NONE"
              />

              <button
                onClick={toggleCollapse}
                className="flex items-center justify-center w-8 h-8 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
                aria-label="Expand navigation"
                title="Expand navigation"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
              <div className="flex items-center pl-4 py-4">
                <ImageField
                  images={[{
                    imageType: 'user' as const,
                    user: { name: userName || userInitials, initials: userInitials },
                    altText: userName || userInitials,
                  }]}
                  style="AVATAR"
                  size="ICON_PLUS"
                  marginBelow="NONE"
                />
                <span className="ml-3 text-sm font-medium text-gray-800 truncate flex-1">
                  {userName || userInitials}
                </span>
                <button
                  onClick={toggleCollapse}
                  className="flex items-center justify-center w-8 h-8 rounded-l bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors shrink-0"
                  aria-label="Collapse navigation"
                  title="Collapse navigation"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>
          )}
        </div>
      </nav>
  )
}

/**
 * SiteNavItem — renders a single navigation item (page or group).
 */
const SiteNavItem: React.FC<{
  page: SiteNavPage
  isCollapsed: boolean
  highlightClass: string
  highlightStyle?: React.CSSProperties
  depth?: number
}> = ({ page, isCollapsed, highlightClass, highlightStyle, depth = 0 }) => {
  const [expanded, setExpanded] = React.useState(
    // Auto-expand if any child is selected
    page.children?.some((c) => c.isSelected) ?? false
  )

  const IconComponent = page.icon
  const hasChildren = page.isGroup || (page.children && page.children.length > 0)

  const handleClick = () => {
    if (hasChildren) {
      setExpanded((prev) => !prev)
    }
    page.onClick?.()
  }

  return (
    <li className="list-none mb-1">
      <button
        onClick={handleClick}
        title={isCollapsed ? page.label : undefined}
        className={`
          flex items-center w-full text-left transition-colors
          ${isCollapsed ? 'justify-center px-2' : 'px-3'}
          ${depth > 0 ? 'py-2' : 'py-3'}
          rounded-sm
          ${page.isSelected ? `font-bold ${highlightClass}` : 'font-normal'}
          text-gray-800 hover:bg-gray-100
        `}
        style={
          page.isSelected
            ? highlightStyle
            : undefined
        }
        aria-current={page.isSelected ? 'page' : undefined}
      >
        {/* Icon */}
        {IconComponent && (
          <span className={`shrink-0 ${isCollapsed ? '' : 'mr-3'}`}>
            <IconComponent className="w-5 h-5 text-gray-700" />
          </span>
        )}

        {/* Indentation for children without icons */}
        {!IconComponent && depth > 0 && !isCollapsed && (
          <span className="w-5 mr-3 shrink-0" />
        )}

        {/* Label + badge */}
        {!isCollapsed && (
          <span className="flex-1 truncate text-sm text-gray-900">
            {page.label}
            {page.badge && (
              <span className="ml-1 text-gray-700">{page.badge}</span>
            )}
          </span>
        )}

        {/* Group chevron */}
        {hasChildren && !isCollapsed && (
          <ChevronRight
            className={`w-4 h-4 text-gray-400 shrink-0 transition-transform ${
              expanded ? 'rotate-90' : ''
            }`}
          />
        )}
      </button>

      {/* Children */}
      {hasChildren && expanded && !isCollapsed && page.children && (
        <ul className="list-none m-0 p-0 pl-4" role="group">
          {page.children.map((child) => (
            <SiteNavItem
              key={child.label}
              page={child}
              isCollapsed={isCollapsed}
              highlightClass={highlightClass}
              highlightStyle={highlightStyle}
              depth={depth + 1}
            />
          ))}
        </ul>
      )}
    </li>
  )
}
