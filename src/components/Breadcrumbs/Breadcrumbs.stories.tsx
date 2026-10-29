import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { expect, userEvent, waitFor, within } from 'storybook/test'
import { BreadcrumbsField } from './BreadcrumbsField'
import type { BreadcrumbItem } from './BreadcrumbsField'
import { HeadingField } from '../Heading/HeadingField'
import { ButtonWidget } from '../Button/ButtonWidget'

const meta = {
  title: 'Components/Breadcrumbs',
  component: BreadcrumbsField,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: {
    // Hash links keep the Storybook preview from navigating away
    items: [
      { text: 'Home', link: '#home' },
      { text: 'Documents', link: '#documents' },
      { text: 'Policies', link: '#policies' },
      { text: '2026 Travel Policy' },
    ],
    separator: 'SLASH',
  },
  argTypes: {
    separator: { control: 'select', options: ['SLASH', 'CHEVRON'] },
    marginAbove: { control: 'select', options: ['NONE', 'EVEN_LESS', 'LESS', 'STANDARD', 'MORE', 'EVEN_MORE'] },
    marginBelow: { control: 'select', options: ['NONE', 'EVEN_LESS', 'LESS', 'STANDARD', 'MORE', 'EVEN_MORE'] },
  },
} satisfies Meta<typeof BreadcrumbsField>

export default meta
type Story = StoryObj<typeof meta>

/** Matches the SAIL breadcrumbs pattern: links for parent levels, slash separators, and the current page in bold. */
export const Default: Story = {}

export const ChevronSeparator: Story = {
  args: {
    separator: 'CHEVRON',
  },
}

const longTrailItems: BreadcrumbItem[] = [
  { text: 'Home', link: '#home' },
  { text: 'Shared Drives', link: '#shared' },
  { text: 'Operations', link: '#operations' },
  { text: 'Vendor Management', link: '#vendors' },
  { text: 'Contracts', link: '#contracts' },
  { text: 'Renewals', link: '#renewals' },
  { text: 'Master Services Agreement Renewal' },
]

/**
 * When the whole trail does not fit on one line, the middle levels collapse into a "…" button.
 * The first level and the current page always stay visible, along with as many of the nearest
 * levels as fit. Look for the trail staying on one line, with "…" between Home and the last levels.
 * Select "…" to show every level: the trail wraps as needed and focus moves to the first level
 * that was hidden.
 */
export const LongTrail: Story = {
  args: {
    items: longTrailItems,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('button', { name: 'Show hidden levels' })).toBeInTheDocument()
    await expect(canvas.queryByRole('link', { name: 'Shared Drives' })).not.toBeInTheDocument()
  },
  render: (args) => (
    <div className="max-w-2xl">
      <BreadcrumbsField {...args} />
    </div>
  ),
}

const trailWidths = {
  narrow: 'max-w-xs',
  wide: 'max-w-3xl',
} as const

/**
 * The trail re-evaluates whenever its container changes width. Select Narrow to collapse the middle
 * levels into "…", and Wide to show the whole trail again.
 */
export const ResizableTrail: Story = {
  args: {
    items: longTrailItems.slice(0, 5).map((item, index) => (index === 4 ? { text: item.text } : item)),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Narrow' }))
    await waitFor(() => expect(canvas.getByRole('button', { name: 'Show hidden levels' })).toBeInTheDocument())
    await userEvent.click(canvas.getByRole('button', { name: 'Wide' }))
    await waitFor(() => expect(canvas.queryByRole('button', { name: 'Show hidden levels' })).not.toBeInTheDocument())
  },
  render: function ResizableTrailStory(args) {
    const [width, setWidth] = useState<keyof typeof trailWidths>('wide')
    return (
      <div>
        <div className={trailWidths[width]}>
          <BreadcrumbsField {...args} />
        </div>
        <ButtonWidget label="Narrow" style="OUTLINE" size="SMALL" onClick={() => setWidth('narrow')} />
        <ButtonWidget label="Wide" style="OUTLINE" size="SMALL" onClick={() => setWidth('wide')} />
      </div>
    )
  },
}

const folders = ['Home', 'Documents', 'Policies', '2026 Travel Policy']

/**
 * Function links run on click, for prototypes that navigate with state.
 * Select a parent level to move up the hierarchy. The new current page takes
 * focus, so keyboard users keep their place.
 */
export const InteractiveNavigation: Story = {
  args: {
    items: [],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const link = canvas.getByRole('link', { name: 'Documents' })
    link.focus()
    await userEvent.keyboard('{Enter}')
    const current = canvas.getByText('Documents', { selector: '[aria-current="page"]' })
    await expect(current).toHaveFocus()
  },
  render: function InteractiveNavigationStory(args) {
    const [depth, setDepth] = useState(folders.length)
    const items: BreadcrumbItem[] = folders.slice(0, depth).map((text, index) => ({
      text,
      link: () => setDepth(index + 1),
    }))
    return (
      <div>
        <BreadcrumbsField {...args} items={items} />
        <HeadingField text={folders[depth - 1]} size="MEDIUM" headingTag="H2" marginBelow="LESS" />
        {depth < folders.length && (
          <ButtonWidget label="Reset" style="OUTLINE" size="SMALL" onClick={() => setDepth(folders.length)} />
        )}
      </div>
    )
  },
}
