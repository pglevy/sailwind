import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'
import { EmptyState, EmptyStatePopover } from '../../pages/patterns/EmptyState'
import { HistoryIllustration, NoDataIllustration, TestCasesIllustration, TriggersIllustration } from '../../components/Image/illustrations'

/** The pre-baked illustrations, as images for ImageField */
const ILLUSTRATIONS = {
  TEST_CASES: { imageType: 'svg' as const, component: TestCasesIllustration },
  TRIGGERS: { imageType: 'svg' as const, component: TriggersIllustration },
  HISTORY: { imageType: 'svg' as const, component: HistoryIllustration },
  NO_DATA: { imageType: 'svg' as const, component: NoDataIllustration },
}

/** Holds a story to a width, since an empty state fills the container it is in */
const inWidth = (width: number) =>
  function InWidth(Story: React.ComponentType) {
    return (
      <div style={{ width }}>
        <Story />
      </div>
    )
  }

const meta = {
  title: 'Patterns/Empty State',
  component: EmptyState,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: { title: 'Nothing here yet' },
  argTypes: {
    illustration: { control: 'select', options: Object.keys(ILLUSTRATIONS), mapping: ILLUSTRATIONS },
    size: { control: 'select', options: ['SMALL', 'LARGE'] },
    marginBelow: { control: 'select', options: ['NONE', 'EVEN_LESS', 'LESS', 'STANDARD', 'MORE', 'EVEN_MORE'] },
  },
} satisfies Meta<typeof EmptyState>

export default meta
type Story = StoryObj<typeof meta>

export const LargeWithCallToAction: Story = {
  decorators: [inWidth(520)],
  args: {
    title: 'No triggers yet',
    description: 'A trigger starts another process when an instance of this model completes.',
    illustration: ILLUSTRATIONS.TRIGGERS,
    size: 'LARGE',
    primaryButtons: [{ label: 'Create Trigger', color: 'ACCENT' }],
  },
}

/** A group of buttons: the first is the main action, the rest are alternatives. */
export const LargeWithButtonGroup: Story = {
  decorators: [inWidth(520)],
  args: {
    title: 'No triggers yet',
    description: 'A trigger starts another process when an instance of this model completes.',
    illustration: ILLUSTRATIONS.TRIGGERS,
    size: 'LARGE',
    primaryButtons: [{ label: 'Create Trigger', color: 'ACCENT' }],
    secondaryButtons: [{ label: 'Learn more', color: 'ACCENT' }],
  },
}

export const LargeWithoutCallToAction: Story = {
  decorators: [inWidth(520)],
  args: {
    title: 'No version history',
    description: 'Versions are listed here once the model has been published.',
    illustration: ILLUSTRATIONS.HISTORY,
    size: 'LARGE',
  },
}

export const SmallWithCallToAction: Story = {
  decorators: [inWidth(320)],
  args: {
    title: 'No test cases yet',
    description: 'Save the values you have entered to run them again later.',
    illustration: ILLUSTRATIONS.TEST_CASES,
    size: 'SMALL',
    primaryButtons: [{ label: 'Save as test case', color: 'ACCENT', width: 'FILL' }],
  },
}

/** In a SMALL empty state a group splits the row, so it stays inside a popover. */
export const SmallWithButtonGroup: Story = {
  decorators: [inWidth(320)],
  args: {
    title: 'No test cases yet',
    description: 'Save the values you have entered to run them again later.',
    illustration: ILLUSTRATIONS.TEST_CASES,
    size: 'SMALL',
    primaryButtons: [{ label: 'Save as test case', color: 'ACCENT' }],
    secondaryButtons: [{ label: 'Not now', color: 'ACCENT' }],
  },
}

export const SmallWithoutCallToAction: Story = {
  decorators: [inWidth(320)],
  args: {
    title: 'No test cases yet',
    description: 'Set an instance as a test case and it will be listed here.',
    illustration: ILLUSTRATIONS.TEST_CASES,
    size: 'SMALL',
  },
}

/** The small empty state where it is made for. Starts closed; the play function opens it from the trigger. */
export const InAPopover: Story = {
  parameters: { layout: 'padded', docs: { story: { inline: false, iframeHeight: 420 } } },
  decorators: [
    (Story) => (
      <div style={{ width: 520, minHeight: 360 }}>
        <Story />
      </div>
    ),
  ],
  render: () => <EmptyStatePopover />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const trigger = canvas.getByRole('button', { name: 'Fill with test data' })
    await expect(trigger).toHaveAttribute('aria-expanded', 'false')
    await userEvent.click(trigger)
    await expect(trigger).toHaveAttribute('aria-expanded', 'true')
    await expect(canvas.getByText('No test cases yet')).toBeInTheDocument()
  },
}

/** The same popover with a group of buttons. */
export const InAPopoverWithButtonGroup: Story = {
  parameters: { layout: 'padded', docs: { story: { inline: false, iframeHeight: 440 } } },
  decorators: [
    (Story) => (
      <div style={{ width: 520, minHeight: 380 }}>
        <Story />
      </div>
    ),
  ],
  render: () => (
    <EmptyStatePopover
      primaryButtons={[{ label: 'Save as test case', color: 'ACCENT' }]}
      secondaryButtons={[{ label: 'Not now', color: 'ACCENT' }]}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Fill with test data' }))
    await expect(canvas.getByRole('button', { name: 'Save as test case' })).toBeInTheDocument()
    await expect(canvas.getByRole('button', { name: 'Not now' })).toBeInTheDocument()
  },
}

/**
 * Buttons are ordered as in a!buttonLayout: the first primary button is the most prominent
 * and sits at the far right; the first secondary button is the least prominent and sits at
 * the far left. Narrow the window to a phone width to see them stack, most prominent on top.
 */
export const ButtonOrder: Story = {
  decorators: [inWidth(520)],
  args: {
    title: 'No documents yet',
    description: 'Upload a document, or start from one you already have.',
    illustration: ILLUSTRATIONS.NO_DATA,
    primaryButtons: [
      { label: 'Upload document', color: 'ACCENT' },
      { label: 'Scan', color: 'ACCENT', style: 'OUTLINE' },
    ],
    secondaryButtons: [
      { label: 'Skip', color: 'SECONDARY', style: 'LINK' },
      { label: 'Learn more', color: 'ACCENT' },
    ],
  },
}

/** The card fills the width of whatever it is in. */
export const FillsItsContainer: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div className="space-y-4" style={{ width: 760 }}>
      {[320, 520, 760].map((width) => (
        <div key={width} style={{ width }} className="rounded-sm bg-gray-100 p-2">
          <EmptyState
            title={`${width}px wide`}
            description="The empty state fills the container it is in."
            illustration={ILLUSTRATIONS.NO_DATA}
            size={width === 320 ? 'SMALL' : 'LARGE'}
            primaryButtons={[{ label: 'Action', color: 'ACCENT' }]}
          />
        </div>
      ))}
    </div>
  ),
}

/** Every picture, each with the kind of message it suits. The pictures themselves are documented under Components/Image. */
export const Illustrations: Story = {
  decorators: [inWidth(520)],
  render: () => (
    <div className="space-y-4">
      <EmptyState
        title="NO_DATA"
        description="Nothing to show, in general: an empty tray ringed by what would fill it."
        illustration={ILLUSTRATIONS.NO_DATA}
        marginBelow="STANDARD"
      />
      <EmptyState
        title="HISTORY"
        description="Things from the past, ringed round a clock face."
        illustration={ILLUSTRATIONS.HISTORY}
        marginBelow="STANDARD"
      />
      <EmptyState
        title="TRIGGERS"
        description="A step in a flow, with what leads in and what it starts."
        illustration={ILLUSTRATIONS.TRIGGERS}
        marginBelow="STANDARD"
      />
      <EmptyState
        title="TEST_CASES"
        description="The centre joined to the data it is tried with."
        illustration={ILLUSTRATIONS.TEST_CASES}
      />
    </div>
  ),
}

export const Sizes: Story = {
  decorators: [inWidth(520)],
  render: () => (
    <div className="space-y-4">
      <EmptyState
        title="Large"
        description="The text is the same size in both."
        illustration={ILLUSTRATIONS.TEST_CASES}
        size="LARGE"
        primaryButtons={[{ label: 'Action', color: 'ACCENT' }]}
        marginBelow="STANDARD"
      />
      <div style={{ width: 320 }}>
        <EmptyState
          title="Small"
          description="The text is the same size in both."
          illustration={ILLUSTRATIONS.TEST_CASES}
          size="SMALL"
          primaryButtons={[{ label: 'Action', color: 'ACCENT', width: 'FILL' }]}
        />
      </div>
    </div>
  ),
}
