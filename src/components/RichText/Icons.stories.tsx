import type { Meta, StoryObj } from '@storybook/react-vite'
import * as React from 'react'
import { useEffect, useMemo, useRef, useState } from 'react'
import * as LucideIcons from 'lucide-react'
import { Icon } from './Icon'
import {
  alternatingAnimations,
  getIconAnimation,
  iconAnimationDescriptions,
  iconAnimationTargets,
  strokeDrawAnimations,
  toIconSlug,
  type IconAnimation,
} from '../../utils/iconAnimations'
import { RichTextDisplayField } from './RichTextDisplayField'
import { TextItem } from './TextItem'

/**
 * Icons in Sailwind come from [Lucide](https://lucide.dev). `Icon` takes any Lucide
 * name in kebab-case (`chevron-right`) or PascalCase (`ChevronRight`), plus a handful
 * of legacy SAIL aliases, and falls back to a circle when a name is not found.
 *
 * Use this page to find a name, then pass it to `Icon` inside a
 * `RichTextDisplayField`, or import the Lucide component directly for props that
 * expect one (`SiteNavPage.icon`, `MilestoneField`, and similar).
 */
const meta = {
  title: 'Components/Icons',
  component: Icon,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    icon: { control: 'text' },
    size: {
      control: 'select',
      options: ['SMALL', 'STANDARD', 'MEDIUM', 'MEDIUM_PLUS', 'LARGE', 'LARGE_PLUS', 'EXTRA_LARGE'],
    },
    color: { control: 'text' },
  },
} satisfies Meta<typeof Icon>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Every icon Lucide exports, de-duplicated. Lucide ships several names per glyph
 * (`Home`, `HomeIcon`, and deprecated aliases), so group by the component itself and
 * keep one preferred name each: no `Icon` suffix, shortest wins.
 */
const allIconNames: string[] = (() => {
  const byComponent = new Map<unknown, string>()

  for (const name of Object.keys(LucideIcons)) {
    if (!/^[A-Z]/.test(name)) continue
    if (['Icon', 'LucideIcon', 'IconNode'].includes(name)) continue

    const value = (LucideIcons as Record<string, unknown>)[name]
    if (typeof value !== 'function' && typeof value !== 'object') continue
    if (value === null) continue

    const existing = byComponent.get(value)
    if (!existing) {
      byComponent.set(value, name)
      continue
    }

    const existingSuffixed = existing.endsWith('Icon')
    const candidateSuffixed = name.endsWith('Icon')
    if (existingSuffixed && !candidateSuffixed) {
      byComponent.set(value, name)
    } else if (existingSuffixed === candidateSuffixed && name.length < existing.length) {
      byComponent.set(value, name)
    }
  }

  return Array.from(byComponent.values()).sort()
})()

/** Icons used most often across Sailwind components and prototypes. */
const commonIcons = [
  'Home', 'Search', 'Filter', 'Settings', 'Menu', 'X',
  'Plus', 'Minus', 'Pencil', 'Trash2', 'Download', 'Upload',
  'Check', 'CheckCircle', 'XCircle', 'AlertCircle', 'AlertTriangle', 'Info',
  'ChevronRight', 'ChevronLeft', 'ChevronDown', 'ChevronUp',
  'ArrowRight', 'ArrowLeft', 'ExternalLink', 'Link',
  'User', 'Users', 'Bell', 'Inbox', 'Calendar', 'Clock',
  'FileText', 'Folder', 'FolderOpen', 'Image', 'Paperclip',
  'BarChart3', 'LayoutGrid', 'List', 'Table', 'Sparkles',
  'MessagesSquare', 'Send', 'Star', 'Heart', 'Eye', 'EyeOff',
  'Lock', 'Unlock', 'RefreshCw', 'MoreHorizontal', 'MoreVertical',
]

/** Legacy SAIL icon names that `Icon` maps to a Lucide equivalent. */
const sailAliases = [
  'USER', 'PHONE', 'BUILDING-O', 'HOME', 'CHECK-SQUARE-O', 'FILE-TEXT-O',
  'PICTURE-O', 'HEADPHONES', 'VIDEO-CAMERA', 'WRENCH', 'EXCLAMATION',
  'TICKET', 'ARROW-RIGHT', 'CHECK',
]

const IconCell = ({ name, label }: { name: string; label?: string }) => (
  <li className="list-none">
    <div className="flex flex-col items-center gap-2 rounded-md border border-gray-200 p-3 text-center">
      <Icon icon={name} size="MEDIUM_PLUS" altText={`${label ?? toIconSlug(name)} icon`} />
      <code className="text-xs break-all text-gray-700">{label ?? toIconSlug(name)}</code>
    </div>
  </li>
)

/**
 * Searchable catalog. Type to filter by name; results are capped so the page stays
 * responsive with Lucide's full set loaded.
 */
export const Gallery: Story = {
  args: { icon: 'home' },
  render: () => {
    const RESULT_LIMIT = 180
    const [query, setQuery] = useState('')

    const matches = useMemo(() => {
      const q = query.trim().toLowerCase()
      if (!q) return commonIcons
      return allIconNames.filter(
        (name) => name.toLowerCase().includes(q) || toIconSlug(name).includes(q)
      )
    }, [query])

    const shown = matches.slice(0, RESULT_LIMIT)

    return (
      <div className="space-y-4">
        <div>
          <label htmlFor="icon-search" className="mb-2 block text-base font-medium text-gray-900">
            Search {allIconNames.length} Lucide icons
          </label>
          <input
            id="icon-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. chevron, file, user"
            className="w-full max-w-sm rounded-sm border border-gray-700 px-3 py-2 text-base text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          />
          <p className="mt-2 text-sm text-gray-700" role="status">
            {query.trim()
              ? `${matches.length} match${matches.length === 1 ? '' : 'es'}${
                  matches.length > RESULT_LIMIT ? ` — showing the first ${RESULT_LIMIT}` : ''
                }`
              : `Showing ${commonIcons.length} common icons. Search to see all ${allIconNames.length}.`}
          </p>
        </div>

        {shown.length > 0 ? (
          <ul className="m-0 grid list-none grid-cols-[repeat(auto-fill,minmax(7rem,1fr))] gap-2 p-0">
            {shown.map((name) => (
              <IconCell key={name} name={name} />
            ))}
          </ul>
        ) : (
          <p className="text-base text-gray-900">No icons match “{query}”.</p>
        )}
      </div>
    )
  },
}

/** The size scale, matching the text size tokens. */
export const Sizes: Story = {
  args: { icon: 'star' },
  render: () => (
    <ul className="m-0 flex list-none flex-wrap items-end gap-6 p-0">
      {(['SMALL', 'STANDARD', 'MEDIUM', 'MEDIUM_PLUS', 'LARGE', 'LARGE_PLUS', 'EXTRA_LARGE'] as const).map(
        (size) => (
          <li key={size} className="flex flex-col items-center gap-2">
            <Icon icon="star" size={size} altText={`Star, ${size}`} />
            <code className="text-xs text-gray-700">{size}</code>
          </li>
        )
      )}
    </ul>
  ),
}

/** Semantic colors, palette tokens, and raw hex all work for `color`. */
export const Colors: Story = {
  args: { icon: 'circle-check' },
  render: () => (
    <ul className="m-0 flex list-none flex-wrap gap-6 p-0">
      {['STANDARD', 'ACCENT', 'POSITIVE', 'NEGATIVE', 'SECONDARY', 'VIOLET_700', 'TEAL_700', '#AF2B9B'].map(
        (color) => (
          <li key={color} className="flex flex-col items-center gap-2">
            <Icon icon="circle-check" size="LARGE" color={color} altText={`Check, ${color}`} />
            <code className="text-xs text-gray-700">{color}</code>
          </li>
        )
      )}
    </ul>
  ),
}

/** Legacy SAIL names are mapped to Lucide equivalents so old expressions keep working. */
export const SailAliases: Story = {
  args: { icon: 'PICTURE-O' },
  render: () => (
    <ul className="m-0 grid list-none grid-cols-[repeat(auto-fill,minmax(9rem,1fr))] gap-2 p-0">
      {sailAliases.map((name) => (
        <IconCell key={name} name={name} label={name} />
      ))}
    </ul>
  ),
}

/** How icons are normally used: inline inside a rich text display field. */
export const InRichText: Story = {
  args: { icon: 'info' },
  render: () => (
    <div className="space-y-2">
      <RichTextDisplayField
        value={[
          <Icon icon="info" color="ACCENT" altText="Note" />,
          <TextItem text=" Icons sit inline with text and inherit the surrounding size." />,
        ]}
      />
      <RichTextDisplayField
        value={[
          <Icon icon="circle-check" color="POSITIVE" altText="Approved" />,
          <TextItem text=" Request approved" style="STRONG" />,
        ]}
      />
      <RichTextDisplayField
        value={[
          <Icon icon="triangle-alert" color="NEGATIVE" altText="Overdue" />,
          <TextItem text=" 3 tasks overdue" />,
        ]}
      />
    </div>
  ),
}

/* ────────────────────────────────────────────────────────────────
   Hover animations — concept-matched, one for every Lucide icon
   ──────────────────────────────────────────────────────────────── */

const GEOMETRY_SELECTOR = 'path, circle, line, rect, polyline, polygon, ellipse'

/**
 * Renders a Lucide icon with the hover animation that matches its concept.
 *
 * The animation classes go on the geometry Lucide renders for us, so they are attached
 * after mount. Which shapes get the class depends on the animation (see
 * `iconAnimationTargets`), and `draw`/`slash` also need `pathLength="1"` so one dash
 * covers the whole path.
 *
 * The animation is triggered by the `group` class on the wrapper, so the same CSS works
 * when the hover target is a whole nav row rather than the icon itself.
 */
const AnimatedIcon: React.FC<{
  name: string
  animation?: IconAnimation
  size?: number
}> = ({ name, animation, size = 24 }) => {
  const hostRef = useRef<HTMLSpanElement>(null)
  const resolved = animation ?? getIconAnimation(name)
  const LucideComponent = (LucideIcons as unknown as Record<string, React.ComponentType<{ size?: number; className?: string }>>)[name]

  useEffect(() => {
    const svg = hostRef.current?.querySelector('svg')
    if (!svg) return

    const target = iconAnimationTargets[resolved]
    const className = `sw-icon-${resolved}`

    // Whole-icon animations (spin, nudge, swing…) go on the <svg> itself
    if (target === 'icon') {
      svg.classList.add(className)
      return () => svg.classList.remove(className)
    }

    const parts = Array.from(svg.querySelectorAll(GEOMETRY_SELECTOR))
    // Align icons move the objects being arranged, not the guide line: that means the
    // rects when the icon has any, and otherwise the lines themselves (align-left etc.)
    const objects = svg.querySelectorAll('rect').length
      ? Array.from(svg.querySelectorAll('rect'))
      : parts
    const shapes =
      target === 'last' ? parts.slice(-1)
      : target === 'lastTwo' ? parts.slice(-2)
      : target === 'accessory' ? parts.slice(1)
      : target === 'objects' ? objects
      : parts

    const alternating = alternatingAnimations.has(resolved)

    shapes.forEach((shape, index) => {
      if (strokeDrawAnimations.has(resolved)) shape.setAttribute('pathLength', '1')
      // Converging animations send every other shape in from the opposite side
      shape.classList.add(alternating && index % 2 === 1 ? `${className}-alt` : className)
      // Stagger the 2nd and 3rd shapes onward for the sequenced animations
      if (index > 0 && !alternating && (target === 'parts' || target === 'accessory' || target === 'objects')) {
        shape.classList.add(`${className}-${Math.min(index + 1, 3)}`)
      }
    })

    return () => {
      shapes.forEach((shape) => {
        shape.classList.remove(className, `${className}-alt`, `${className}-2`, `${className}-3`)
        shape.removeAttribute('pathLength')
      })
    }
  }, [name, resolved])

  if (!LucideComponent) return null

  return (
    <span ref={hostRef} className="inline-flex text-gray-900">
      <LucideComponent size={size} aria-hidden="true" />
    </span>
  )
}

/** A hoverable tile: the `group` class on the tile drives the animation inside. */
const AnimatedTile = ({
  name,
  animation,
  showAnimationName = false,
}: {
  name: string
  animation?: IconAnimation
  showAnimationName?: boolean
}) => (
  <li className="list-none">
    <button
      type="button"
      className="group flex w-full flex-col items-center gap-2 rounded-md border border-gray-200 p-3 text-center hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
    >
      <AnimatedIcon name={name} animation={animation} />
      <code className="text-xs break-all text-gray-700">{toIconSlug(name)}</code>
      {showAnimationName && (
        <span className="text-xs text-gray-700">{animation ?? getIconAnimation(name)}</span>
      )}
    </button>
  </li>
)

/** Every animation, concept-specific ones first and the draw fallback last. */
const animationOrder: IconAnimation[] = [
  ...(Object.keys(iconAnimationTargets) as IconAnimation[]).filter((a) => a !== 'draw'),
  'draw',
]

/**
 * All {@link allIconNames.length} icons with their assigned animation. Search by icon
 * name or filter to one animation to compare how it reads across a family.
 */
export const AnimationsGallery: Story = {
  args: { icon: 'home' },
  render: () => {
    const [query, setQuery] = useState('')
    const [filter, setFilter] = useState<IconAnimation | 'ALL'>('ALL')
    const [limit, setLimit] = useState(240)

    const matches = useMemo(() => {
      const q = query.trim().toLowerCase()
      return allIconNames.filter((name) => {
        const animation = getIconAnimation(name)
        if (filter !== 'ALL' && animation !== filter) return false
        if (!q) return true
        return name.toLowerCase().includes(q) || toIconSlug(name).includes(q) || animation.includes(q)
      })
    }, [query, filter])

    const shown = matches.slice(0, limit)

    return (
      <div className="space-y-4">
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <label htmlFor="anim-search" className="mb-2 block text-base font-medium text-gray-900">
              Search icons
            </label>
            <input
              id="anim-search"
              type="search"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setLimit(240) }}
              placeholder="e.g. chevron, cloud, chart"
              className="w-64 rounded-sm border border-gray-700 px-3 py-2 text-base text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="anim-filter" className="mb-2 block text-base font-medium text-gray-900">
              Animation
            </label>
            <select
              id="anim-filter"
              value={filter}
              onChange={(e) => { setFilter(e.target.value as IconAnimation | 'ALL'); setLimit(240) }}
              className="w-56 rounded-sm border border-gray-700 px-3 py-2 text-base text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              <option value="ALL">All animations</option>
              {animationOrder.map((animation) => (
                <option key={animation} value={animation}>{animation}</option>
              ))}
            </select>
          </div>
        </div>

        <p className="text-sm text-gray-700" role="status">
          {matches.length} of {allIconNames.length} icons
          {shown.length < matches.length ? ` — showing the first ${shown.length}` : ''}
        </p>

        {filter !== 'ALL' && (
          <p className="text-sm text-gray-900">{iconAnimationDescriptions[filter]}</p>
        )}

        <ul className="m-0 grid list-none grid-cols-[repeat(auto-fill,minmax(7rem,1fr))] gap-2 p-0">
          {shown.map((name) => (
            <AnimatedTile key={name} name={name} showAnimationName={true} />
          ))}
        </ul>

        {shown.length < matches.length && (
          <button
            type="button"
            onClick={() => setLimit((n) => n + 480)}
            className="rounded-sm border border-blue-500 px-4 py-2 text-base text-blue-500 hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            Show more ({matches.length - shown.length} left)
          </button>
        )}
      </div>
    )
  },
}
