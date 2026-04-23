import * as React from 'react'
import * as Tabs from '@radix-ui/react-tabs'
import type { SAILMarginSize, SAILSize, SAILSemanticColor } from '../../types/sail'

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
 * Visual variant for tab styling
 * - UNDERLINE: Standard tabs with an underline indicator (default)
 * - PILL: Filled background on active tab with a downward caret indicator
 */
export type TabsVariant = "UNDERLINE" | "PILL"

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
  /** Visual variant for tab styling */
  variant?: TabsVariant
  /** Orientation of the tabs (only applies to UNDERLINE variant) */
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
  color?: SAILSemanticColor | string
  /** Activation mode - whether tabs activate on focus or click */
  activationMode?: "AUTOMATIC" | "MANUAL"
}

export const TabsField: React.FC<TabsFieldProps> = ({
  tabs,
  value,
  defaultValue,
  onValueChange,
  variant = "UNDERLINE",
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

  // Track active tab
  const [internalValue, setInternalValue] = React.useState(value || defaultValue || tabs[0]?.value)
  const activeValue = value ?? internalValue

  const handleValueChange = (val: string) => {
    setInternalValue(val)
    onValueChange?.(val)
  }

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

  // Color mappings
  const semanticBgMap: Record<SAILSemanticColor, string> = {
    ACCENT: 'bg-blue-500',
    POSITIVE: 'bg-green-700',
    NEGATIVE: 'bg-red-700',
    SECONDARY: 'bg-gray-700',
    STANDARD: 'bg-gray-900',
  }
  const semanticTextMap: Record<SAILSemanticColor, string> = {
    ACCENT: 'text-blue-500',
    POSITIVE: 'text-green-700',
    NEGATIVE: 'text-red-700',
    SECONDARY: 'text-gray-700',
    STANDARD: 'text-gray-900',
  }
  const isHexColor = color.startsWith('#')

  // List classes based on orientation and variant
  const listClasses = variant === "PILL"
    ? "flex items-end gap-1"
    : orientation === "VERTICAL"
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
        onValueChange={handleValueChange}
        orientation={orientation.toLowerCase() as "horizontal" | "vertical"}
        activationMode={activationMode.toLowerCase() as "automatic" | "manual"}
        className={rootClasses}
      >
        <Tabs.List
          className={listClasses}
          loop={loop}
        >
          {tabs.map((tab) => {
            if (variant === "PILL") {
              return (
                <Tabs.Trigger
                  key={tab.value}
                  value={tab.value}
                  disabled={tab.disabled}
                  className={[
                    'group relative',
                    sizeMap[size],
                    'rounded-sm transition-colors whitespace-nowrap cursor-pointer select-none outline-none border-0',
                    activeValue === tab.value
                      ? (isHexColor ? '' : `${semanticBgMap[color as SAILSemanticColor] || semanticBgMap.ACCENT} text-white`)
                      : (isHexColor ? '' : `${semanticTextMap[color as SAILSemanticColor] || semanticTextMap.ACCENT}`),
                    activeValue !== tab.value ? 'hover:bg-gray-100' : '',
                    'disabled:opacity-50 disabled:cursor-not-allowed',
                    'focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2'
                  ].filter(Boolean).join(' ')}
                  style={
                    isHexColor
                      ? activeValue === tab.value
                        ? { backgroundColor: color, color: '#ffffff' }
                        : { color: color }
                      : undefined
                  }
                >
                  {tab.label}
                  {activeValue === tab.value && (
                    <svg
                      className={[
                        'absolute left-1/2 -translate-x-1/2 -bottom-1.5 w-3 h-1.5',
                        !isHexColor ? (semanticTextMap[color as SAILSemanticColor] || semanticTextMap.ACCENT) : ''
                      ].filter(Boolean).join(' ')}
                      viewBox="0 0 12 6"
                      aria-hidden="true"
                    >
                      <polygon
                        points="6,6 0,0 12,0"
                        fill={isHexColor ? color : 'currentColor'}
                      />
                    </svg>
                  )}
                </Tabs.Trigger>
              )
            }

            return (
              <Tabs.Trigger
                key={tab.value}
                value={tab.value}
                disabled={tab.disabled}
                className={[
                  sizeMap[size],
                  'flex-1 bg-white text-gray-700 border-0 cursor-default select-none',
                  'items-center justify-center outline-none transition-colors hover:text-blue-500',
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
            )
          })}
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
