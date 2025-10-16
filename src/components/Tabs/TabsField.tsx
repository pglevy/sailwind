import * as React from 'react'
import * as Tabs from '@radix-ui/react-tabs'
import type { SAILMarginSize, SAILSize } from '../../types/sail'

/**
 * Individual tab configuration
 */
export interface TabItem {
  /** Unique identifier for the tab */
  value: string
  /** Text to display on the tab trigger */
  label: string
  /** Content to display when tab is active */
  content: React.ReactNode
  /** Whether this tab is disabled */
  disabled?: boolean
}

/**
 * Displays a set of layered sections of content (tab panels) that are displayed one at a time
 * Inspired by SAIL form field patterns (not an official SAIL component)
 *
 * This is a "new SAIL" component - not available in public SAIL but follows
 * the same conventions and patterns for consistency with other Sailwind components.
 */
export interface TabsFieldProps {
  /** Array of tab configurations */
  tabs: TabItem[]
  /** Currently active tab value (controlled) */
  value?: string
  /** Default active tab value (uncontrolled) */
  defaultValue?: string
  /** Callback when active tab changes */
  onValueChange?: (value: string) => void
  /** Orientation of the tabs */
  orientation?: "HORIZONTAL" | "VERTICAL"
  /** Size of the tab triggers */
  size?: SAILSize
  /** Whether tabs should loop when navigating with keyboard */
  loop?: boolean
  /** Determines whether component is displayed */
  showWhen?: boolean
  /** Space added above component */
  marginAbove?: SAILMarginSize
  /** Space added below component */
  marginBelow?: SAILMarginSize
  /** Color scheme for active tabs (hex or semantic) */
  color?: "ACCENT" | "POSITIVE" | "NEGATIVE" | "SECONDARY" | string
  /** Activation mode - whether tabs activate on focus or click */
  activationMode?: "AUTOMATIC" | "MANUAL"
}

export const TabsField: React.FC<TabsFieldProps> = ({
  tabs,
  value,
  defaultValue,
  onValueChange,
  orientation = "HORIZONTAL",
  size = "STANDARD",
  loop = true,
  showWhen = true,
  marginAbove = "NONE",
  marginBelow = "STANDARD",
  color = "ACCENT",
  activationMode = "AUTOMATIC"
}) => {
  // Visibility control
  if (!showWhen) return null

  // Margin mappings
  const marginMap: Record<SAILMarginSize, string> = {
    NONE: '',
    EVEN_LESS: 'mt-1',
    LESS: 'mt-2',
    STANDARD: 'mt-4',
    MORE: 'mt-6',
    EVEN_MORE: 'mt-8'
  }

  const marginBottomMap: Record<SAILMarginSize, string> = {
    NONE: '',
    EVEN_LESS: 'mb-1',
    LESS: 'mb-2',
    STANDARD: 'mb-4',
    MORE: 'mb-6',
    EVEN_MORE: 'mb-8'
  }

  // Size mappings for tab triggers
  const sizeMap: Record<SAILSize, string> = {
    SMALL: 'px-3 py-1.5 text-sm',
    STANDARD: 'px-4 py-2.5 text-base',
    MEDIUM: 'px-6 py-3 text-lg',
    LARGE: 'px-8 py-4 text-xl'
  }

  // Container classes
  const containerClasses = [
    marginMap[marginAbove],
    marginBottomMap[marginBelow]
  ].filter(Boolean).join(' ')

  // List classes based on orientation
  const listClasses = orientation === "VERTICAL" 
    ? "flex flex-col"
    : "flex border-b border-gray-200"

  // Content classes based on orientation
  const contentClasses = orientation === "VERTICAL"
    ? "pl-4 flex-1 p-4"
    : "p-4"

  // Root classes based on orientation
  const rootClasses = orientation === "VERTICAL"
    ? "flex"
    : "block"

  return (
    <div className={containerClasses}>
      <Tabs.Root
        value={value}
        defaultValue={defaultValue || tabs[0]?.value}
        onValueChange={onValueChange}
        orientation={orientation.toLowerCase() as "horizontal" | "vertical"}
        activationMode={activationMode.toLowerCase() as "automatic" | "manual"}
        className={rootClasses}
      >
        <Tabs.List
          className={listClasses}
          loop={loop}
        >
          {tabs.map((tab) => (
            <Tabs.Trigger
              key={tab.value}
              value={tab.value}
              disabled={tab.disabled}
              className={[
                sizeMap[size],
                'flex-1 bg-white text-gray-700 border-0 cursor-default select-none',
                'items-center justify-center outline-none transition-colors hover:text-blue-500',
                // Active state with underline shadow for horizontal, left border for vertical
                orientation === "HORIZONTAL"
                  ? 'data-[state=active]:text-blue-500 data-[state=active]:shadow-[inset_0_-2px_0_0] data-[state=active]:shadow-current'
                  : 'data-[state=active]:text-blue-500 data-[state=active]:shadow-[inset_2px_0_0_0] data-[state=active]:shadow-current',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                'focus-visible:relative focus-visible:shadow-[0_0_0_2px] focus-visible:shadow-blue-500'
              ].filter(Boolean).join(' ')}
              style={
                color.startsWith('#') && value === tab.value
                  ? { color: color }
                  : undefined
              }
            >
              {tab.label}
            </Tabs.Trigger>
          ))}
        </Tabs.List>

        {tabs.map((tab) => (
          <Tabs.Content
            key={tab.value}
            value={tab.value}
            className={[
              contentClasses,
              'outline-none focus-visible:shadow-[0_0_0_2px] focus-visible:shadow-blue-500'
            ].filter(Boolean).join(' ')}
          >
            {tab.content}
          </Tabs.Content>
        ))}
      </Tabs.Root>
    </div>
  )
}
