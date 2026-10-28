import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { expect, userEvent, within } from 'storybook/test'
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

/** A single item shows only the current page, with no separator. */
export const SingleLevel: Story = {
  args: {
    items: [{ text: 'Home' }],
  },
}

/** Long trails wrap onto the next line instead of overflowing. */
export const LongTrail: Story = {
  args: {
    items: [
      { text: 'Home', link: '#home' },
      { text: 'Shared Drives', link: '#shared' },
      { text: 'Operations', link: '#operations' },
      { text: 'Vendor Management', link: '#vendors' },
      { text: 'Contracts', link: '#contracts' },
      { text: 'Renewals', link: '#renewals' },
      { text: 'Master Services Agreement Renewal' },
    ],
  },
  render: (args) => (
    <div className="max-w-sm">
      <BreadcrumbsField {...args} />
    </div>
  ),
}

/** `accessibilityText` sets the navigation landmark's name. Use it to tell trails apart when a page has more than one. Inspect the nav element: its aria-label is "Project files". */
export const CustomAccessibilityText: Story = {
  args: {
    accessibilityText: 'Project files',
  },
}

/**
 * Ancestors without a `link` render as plain text. Look for: "Home" and "Policies"
 * are links (blue, underlined on hover), while "Archive" is plain text.
 */
export const MixedLinkedAndUnlinked: Story = {
  args: {
    items: [
      { text: 'Home', link: '#home' },
      { text: 'Archive' },
      { text: 'Policies', link: '#policies' },
      { text: '2026 Travel Policy' },
    ],
  },
}

/**
 * An item with `showWhen={false}` is left out of the trail. Look for: the item
 * "Documents" is configured but hidden, so the trail reads Home / Policies / 2026 Travel Policy
 * with no extra separator.
 */
export const HiddenItem: Story = {
  args: {
    items: [
      { text: 'Home', link: '#home' },
      { text: 'Documents', link: '#documents', showWhen: false },
      { text: 'Policies', link: '#policies' },
      { text: '2026 Travel Policy' },
    ],
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
