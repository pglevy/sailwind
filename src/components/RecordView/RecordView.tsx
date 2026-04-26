import * as React from 'react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { SiteNav } from '../SiteNav'
import type { SiteNavPage } from '../SiteNav'
import type { SAILSemanticColor } from '../../types/sail'
import { ButtonArrayLayout } from '../Button/ButtonArrayLayout'
import { ButtonWidget } from '../Button/ButtonWidget'
import { TabsField } from '../Tabs'
import { HeadingField } from '../Heading/HeadingField'

/** Active tab color */
const ACTIVE_TAB_COLOR = 'ACCENT'

/**
 * Record action button configuration.
 */
export interface RecordAction {
  /** Button label */
  label: string
  /** Click handler */
  onClick?: () => void
}

/**
 * Record view tab configuration.
 */
export interface RecordViewTab {
  /** Tab label */
  label: string
  /** Content to display when this view is active */
  content?: React.ReactNode
  /** Whether this tab is the active view. Ignored when selectedViewIndex is provided on RecordView. */
  isSelected?: boolean
  /** Click handler */
  onClick?: () => void
}

/**
 * Props for the RecordView template.
 * Composes SiteNav + record header + view tabs + content slot.
 */
export interface RecordViewProps {
  /* --- Site Nav props --- */
  /** Site/solution display name */
  displayName?: string
  /** Site pages for the left nav */
  pages: SiteNavPage[]
  /** Controlled collapsed state */
  collapsed?: boolean
  /** Collapse toggle callback */
  onCollapseToggle?: (collapsed: boolean) => void
  /** User full name */
  userName?: string
  /** Appian logo path */
  appianLogoSrc?: string
  /** Highlight color for selected nav item (passed to SiteNav) */
  highlightColor?: SAILSemanticColor | string

  /* --- Record header props --- */
  /** Record title (e.g. "REC-001 | Sample Record") */
  recordTitle: string
  /** Record action buttons shown in the record header. First 3 are shown as buttons; extras appear in an overflow dropdown. */
  recordActions?: RecordAction[]
  /** Record view tabs */
  views?: RecordViewTab[]
  /** Index of the currently selected view (controlled). When provided, overrides isSelected on individual tabs. */
  selectedViewIndex?: number
  /** Callback when a view tab is clicked. Receives the index of the clicked tab. */
  onViewChange?: (index: number) => void

  /* --- Content slot --- */
  /** Content to render inside the active view area. This is the slot UXDs fill in. */
  children?: React.ReactNode
}

/** Maximum number of action buttons shown before overflow */
const MAX_VISIBLE_ACTIONS = 3

/** Renders record action buttons with overflow dropdown. */
const RecordActions: React.FC<{ actions: RecordAction[] }> = ({ actions }) => {
  const visibleActions = actions.slice(0, MAX_VISIBLE_ACTIONS)
  const overflowActions = actions.slice(MAX_VISIBLE_ACTIONS)

  return (
    <div className="flex items-center gap-1 shrink-0">
      <ButtonArrayLayout
        buttons={visibleActions.map((action) => ({
          label: action.label,
          style: 'OUTLINE' as const,
          color: 'ACCENT',
          size: 'SMALL' as const,
          onClick: action.onClick,
        }))}
        marginBelow="NONE"
      />
      {overflowActions.length > 0 && (
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <div>
              <ButtonWidget
                icon="ellipsis"
                style="OUTLINE"
                color="ACCENT"
                size="SMALL"
                accessibilityText="More actions"
                tooltip="More actions"
              />
            </div>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content
              className="bg-white border border-gray-200 rounded-sm shadow-lg z-10 min-w-48"
              align="end"
              sideOffset={4}
            >
              {overflowActions.map((action) => (
                <DropdownMenu.Item
                  key={action.label}
                  onSelect={() => action.onClick?.()}
                  className="block w-full text-left px-4 py-2.5 text-sm text-gray-800 hover:bg-gray-100 transition-colors cursor-pointer outline-none data-[highlighted]:bg-gray-100"
                >
                  {action.label}
                </DropdownMenu.Item>
              ))}
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      )}
    </div>
  )
}

/**
 * RecordView Template
 * Maps to SAIL's a!navigationLayout (SIDEBAR) wrapping a!headerContentLayout.
 */
export const RecordView: React.FC<RecordViewProps> = ({
  // Site nav
  displayName,
  pages,
  collapsed,
  onCollapseToggle,
  userName,
  appianLogoSrc,
  highlightColor,

  // Record header
  recordTitle,
  recordActions = [],
  views = [],
  selectedViewIndex,
  onViewChange,

  // Content
  children,
}) => {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-gray-50">
      {/* Left: Site Navigation */}
      <SiteNav
        displayName={displayName}
        pages={pages}
        collapsed={collapsed}
        onCollapseToggle={onCollapseToggle}
        userName={userName}
        appianLogoSrc={appianLogoSrc}
        highlightColor={highlightColor}
      />

      {/* Right: Record content area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Record header: title + actions */}
        <div className="flex items-center justify-between px-6 pt-3 pb-2 bg-gray-50 shrink-0">
          <div className="truncate mr-4">
            <HeadingField text={recordTitle} size="LARGE_PLUS" marginBelow="NONE" fontWeight="SEMI_BOLD" />
          </div>

          {recordActions.length > 0 && (
            <RecordActions actions={recordActions} />
          )}
        </div>

        {/* Record view tabs + content */}
        {views.length > 0 && (
          <div className="px-6 pt-1.5 pb-3 bg-gray-50 shrink-0">
            <TabsField
              tabs={views.map((view, index) => ({
                value: String(index),
                label: view.label,
                content: view.content ?? null,
              }))}
              value={selectedViewIndex !== undefined ? String(selectedViewIndex) : undefined}
              defaultValue="0"
              onValueChange={(val) => {
                const idx = Number(val)
                onViewChange?.(idx)
                views[idx]?.onClick?.()
              }}
              variant="PILL"
              size="SMALL"
              color={ACTIVE_TAB_COLOR}
              marginAbove="NONE"
              marginBelow="NONE"
            />
          </div>
        )}

        {/* Content slot */}
        <div className="flex-1 overflow-y-auto bg-gray-50">
          {children || (
            <div className="p-6 text-gray-400 text-sm">
              Record view content goes here. Replace this with your view components.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
