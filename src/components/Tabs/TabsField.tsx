import * as React from 'react'
import * as Tabs from '@radix-ui/react-tabs'
import type { SAILMarginSize, SAILSize, SAILColorInput } from '../../types/sail'
import { isPaletteColor } from '../../utils/colorResolver'
import { paletteColorMap } from '../../types/palette-colors.generated'
import { mergeClasses } from '../../utils/classNames'

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
 * - UNDERLINE: Standard tabs with a sliding underline indicator (default)
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
  color?: "ACCENT" | "POSITIVE" | "NEGATIVE" | "SECONDARY" | SAILColorInput
  /** Activation mode - whether tabs activate on focus or click */
  activationMode?: "AUTOMATIC" | "MANUAL"
  /** Additional Tailwind classes for prototype-specific styling (not part of SAIL API) */
  className?: string
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
  activationMode = "AUTOMATIC",
  className
}) => {
  // Sliding indicator state
  const [indicatorStyle, setIndicatorStyle] = React.useState<React.CSSProperties>({})
  const listRef = React.useRef<HTMLDivElement>(null)
  const [internalActive, setInternalActive] = React.useState(value ?? defaultValue ?? tabs[0]?.value)

  const updateIndicator = React.useCallback(() => {
    if (!listRef.current) return
    const activeEl = listRef.current.querySelector<HTMLElement>('[data-state="active"]')
    if (!activeEl) return
    if (orientation === "HORIZONTAL") {
      setIndicatorStyle({ left: activeEl.offsetLeft, width: activeEl.offsetWidth })
    } else {
      setIndicatorStyle({ top: activeEl.offsetTop, height: activeEl.offsetHeight })
    }
  }, [orientation])

  // Update on mount and whenever active tab changes
  React.useEffect(() => { updateIndicator() }, [internalActive, updateIndicator])

  // Sync internalActive when controlled value changes
  React.useEffect(() => {
    if (value !== undefined) setInternalActive(value)
  }, [value])

  const handleValueChange = (val: string) => {
    setInternalActive(val)
    onValueChange?.(val)
  }

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

  // Size mappings for tab triggers — matches ButtonWidget
  const sizeMap: Record<SAILSize, string> = {
    SMALL: 'px-3 py-2 text-sm leading-none',
    STANDARD: 'px-4 py-3 text-base leading-none',
    MEDIUM: 'px-5 py-4 text-lg leading-none',
    LARGE: 'px-6 py-5 text-xl leading-none'
  }

  // Active indicator color
  const getIndicatorColor = (): string => {
    const semanticMap: Record<string, string> = {
      ACCENT:    'var(--color-blue-500)',
      POSITIVE:  'var(--color-green-700)',
      NEGATIVE:  'var(--color-red-700)',
      SECONDARY: 'var(--color-gray-700)',
      STANDARD:  'var(--color-gray-900)',
    }
    if (semanticMap[color]) return semanticMap[color]
    if (isPaletteColor(color)) {
      const segment = paletteColorMap[color].bg.replace('bg-', '')
      return `var(--color-${segment})`
    }
    return color // hex fallback
  }
  const indicatorColor = getIndicatorColor()

  // PILL variant color helpers
  const getPillBgColor = (): string => {
    const semanticMap: Record<string, string> = {
      ACCENT: 'bg-blue-500', POSITIVE: 'bg-green-700', NEGATIVE: 'bg-red-700',
      SECONDARY: 'bg-gray-700', STANDARD: 'bg-gray-900',
    }
    if (semanticMap[color]) return semanticMap[color]
    if (isPaletteColor(color)) return paletteColorMap[color].bg
    return '' // hex — handled via inline style
  }
  const getPillTextColor = (): string => {
    const semanticMap: Record<string, string> = {
      ACCENT: 'text-blue-500', POSITIVE: 'text-green-700', NEGATIVE: 'text-red-700',
      SECONDARY: 'text-gray-700', STANDARD: 'text-gray-900',
    }
    if (semanticMap[color]) return semanticMap[color]
    if (isPaletteColor(color)) return paletteColorMap[color].text
    return '' // hex — handled via inline style
  }
  const isHexColor = typeof color === 'string' && color.startsWith('#')

  // Container classes
  const sailClasses = [marginMap[marginAbove], marginBottomMap[marginBelow]].filter(Boolean).join(' ')
  const containerClasses = mergeClasses(sailClasses, className)

  const listClasses = variant === "PILL"
    ? "flex items-end gap-1"
    : orientation === "VERTICAL"
      ? "relative flex flex-col"
      : "relative flex"

  const contentClasses = orientation === "VERTICAL" ? "pl-4 flex-1 p-4" : "p-4"
  const rootClasses = orientation === "VERTICAL" ? "flex" : "block"

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
          ref={listRef}
          className={listClasses}
          loop={loop}
        >
          {tabs.map((tab) => {
            if (variant === "PILL") {
              const isActive = internalActive === tab.value
              return (
                <Tabs.Trigger
                  key={tab.value}
                  value={tab.value}
                  disabled={tab.disabled}
                  className={[
                    'group relative',
                    sizeMap[size],
                    'rounded-sm transition-colors whitespace-nowrap cursor-pointer select-none outline-none border-0',
                    isActive
                      ? (!isHexColor ? `${getPillBgColor()} text-white` : '')
                      : (!isHexColor ? getPillTextColor() : ''),
                    !isActive ? 'hover:bg-gray-100' : '',
                    'disabled:opacity-50 disabled:cursor-not-allowed',
                    'focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2'
                  ].filter(Boolean).join(' ')}
                  style={
                    isHexColor
                      ? isActive
                        ? { backgroundColor: color, color: '#ffffff' }
                        : { color: color }
                      : undefined
                  }
                >
                  {tab.label}
                  {isActive && (
                    <svg
                      className={[
                        'absolute left-1/2 -translate-x-1/2 -bottom-1.5 w-3 h-1.5',
                        !isHexColor ? getPillTextColor() : ''
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
                  'relative bg-white text-gray-700 border-0 cursor-default select-none',
                  'flex items-center justify-center outline-none font-medium',
                  orientation === "HORIZONTAL" && 'after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:z-10 after:rounded-full after:bg-transparent after:transition-colors after:duration-200 hover:after:bg-gray-500 data-[state=active]:after:bg-transparent',
                  orientation === "VERTICAL" && 'hover:bg-gray-50 after:absolute after:left-0 after:top-0 after:h-full after:w-[2px] after:z-10 after:rounded-full after:bg-transparent after:transition-colors after:duration-200 hover:after:bg-gray-500 data-[state=active]:after:bg-transparent',
                  'data-[state=active]:font-semibold data-[state=active]:text-gray-900',
                  'disabled:opacity-50 disabled:cursor-not-allowed',
                  'focus-visible:relative focus-visible:shadow-[0_0_0_2px] focus-visible:shadow-blue-500'
                ].filter(Boolean).join(' ')}
              >
                {tab.label}
              </Tabs.Trigger>
            )
          })}

          {/* Sliding indicators — UNDERLINE variant only */}
          {variant === "UNDERLINE" && orientation === "HORIZONTAL" && (
            <span aria-hidden="true" className="absolute bottom-0 left-0 w-full h-[2px] bg-gray-300 pointer-events-none" />
          )}
          {variant === "UNDERLINE" && orientation === "HORIZONTAL" && (
            <span
              aria-hidden="true"
              className="absolute bottom-0 h-[2px] rounded-full transition-all duration-300 ease-in-out pointer-events-none z-20"
              style={{ ...indicatorStyle, backgroundColor: indicatorColor }}
            />
          )}
          {variant === "UNDERLINE" && orientation === "VERTICAL" && (
            <span aria-hidden="true" className="absolute left-0 top-0 h-full w-[2px] bg-gray-300 pointer-events-none" />
          )}
          {variant === "UNDERLINE" && orientation === "VERTICAL" && (
            <span
              aria-hidden="true"
              className="absolute left-0 w-[2px] rounded-full transition-all duration-300 ease-in-out pointer-events-none z-20"
              style={{ ...indicatorStyle, backgroundColor: indicatorColor }}
            />
          )}
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
