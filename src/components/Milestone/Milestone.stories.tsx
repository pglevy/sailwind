import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { expect, userEvent, within } from 'storybook/test'
import { MilestoneField } from './MilestoneField'
import type { MilestoneFieldProps } from './MilestoneField'
import { ButtonWidget } from '../Button/ButtonWidget'

/** A milestone with Next, Back and Start over buttons, to watch it animate as the step changes */
const Stepper = (args: MilestoneFieldProps) => {
  const [active, setActive] = useState(0)
  const last = args.steps.length - 1
  return (
    <div className="flex flex-col gap-6">
      <MilestoneField {...args} active={active} />
      <div className="flex gap-2">
        <ButtonWidget label="Back" style="OUTLINE" disabled={active === 0} onClick={() => setActive(Math.max(0, active - 1))} />
        <ButtonWidget
          label={active === -1 ? 'Done' : active >= last ? 'Finish' : 'Next'}
          disabled={active === -1}
          onClick={() => setActive(active >= last ? -1 : active + 1)}
        />
        <ButtonWidget label="Start over" style="LINK" onClick={() => setActive(0)} />
      </div>
    </div>
  )
}

/** Plays the stepper: forward one step, then back */
const playStepper = (first: string, second: string) => async ({ canvasElement }: { canvasElement: HTMLElement }) => {
  const canvas = within(canvasElement)
  const current = () => canvasElement.querySelector('li[aria-current="step"]')?.textContent ?? ''
  await expect(current()).toContain(first)
  await userEvent.click(canvas.getByRole('button', { name: 'Next' }))
  await expect(current()).toContain(second)
  await userEvent.click(canvas.getByRole('button', { name: 'Back' }))
  await expect(current()).toContain(first)
}

const meta = {
  title: 'Components/Milestone',
  component: MilestoneField,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    stepStyle: { control: 'select', options: ['NUMBERED', 'MINIMAL', 'TIMELINE', 'LINE', 'DOT', 'CHEVRON'] },
    orientation: { control: 'select', options: ['HORIZONTAL', 'VERTICAL'] },
    color: { control: 'text' },
    completedColor: { control: 'text' },
    labelPosition: { control: 'select', options: ['ABOVE', 'ADJACENT', 'COLLAPSED', 'JUSTIFIED'] },
  },
} satisfies Meta<typeof MilestoneField>

export default meta
type Story = StoryObj<typeof meta>

/**
 * The default style (`LINE`): the step's number in a rounded-square marker, joined by a bar.
 * A finished step is a green check, the current step is blue with a soft halo, and a pending step
 * is an outline. The bar fills green up to the current step and blue to the next.
 */
export const Default: Story = {
  args: {
    label: 'Home Repair Claim Process',
    instructions: 'Customer #2325691',
    steps: [
      'Submit Customer Request',
      'Set Up On-Site Appt',
      'File Assessment',
      'Submit Proposal',
      'Submit Agreement',
      'Finalize Repairs',
    ],
    active: 2,
    color: 'ACCENT',
  },
}

/**
 * NUMBERED — rounded-square markers with the step's number (a check once it is done), connectors
 * that fill as steps are completed, a "STEP n" caption and status text. Progress reads without
 * relying on color: a finished step is a check, and each step says "Completed", "In Progress" or
 * "Pending" in text.
 */
export const NumberedStyle: Story = {
  args: {
    label: 'Application',
    steps: ['Card Details', 'Form Review', 'Authenticate OTP', 'Create Code'],
    active: 2,
    stepStyle: 'NUMBERED',
    color: 'ACCENT',
  },
}

/** NUMBERED in a column: the connector fills downward and each title lines up with its marker. */
export const NumberedVertical: Story = {
  args: {
    label: 'Onboarding',
    steps: ['Basic Details', 'Company Details', 'Subscription Plan', 'Payment Details'],
    active: 2,
    stepStyle: 'NUMBERED',
    orientation: 'VERTICAL',
    color: 'VIOLET_500',
  },
}

/** NUMBERED without the caption/status text — just markers, connectors and labels. */
export const NumberedCompact: Story = {
  args: {
    steps: ['Card Details', 'Form Review', 'Authenticate OTP', 'Create Code'],
    active: 1,
    stepStyle: 'NUMBERED',
    showStepNumbers: false,
    showStepStatus: false,
  },
}

/** Press Next and Back to watch the default style animate as the step changes. */
export const DefaultProgression: Story = {
  args: { steps: ['Submit request', 'Review documents', 'Approve', 'Issue payment', 'Close claim'] },
  render: (args) => <Stepper {...args} />,
  play: playStepper('Submit request', 'Review documents'),
}

/** Press Next and Back to watch the NUMBERED style animate as the step changes. */
export const NumberedProgression: Story = {
  args: {
    steps: ['Basic Details', 'Company Details', 'Subscription Plan', 'Payment Details'],
    stepStyle: 'NUMBERED',
    orientation: 'VERTICAL',
  },
  render: (args) => <Stepper {...args} />,
  play: playStepper('Basic Details', 'Company Details'),
}

/**
 * MINIMAL — chevron-separated row where only the current step is highlighted as
 * a pill and completed steps carry a check.
 */
export const MinimalStyle: Story = {
  args: {
    steps: ['Step 1', 'Step 2', 'Step 3', 'Step 4'],
    active: 1,
    stepStyle: 'MINIMAL',
  },
}

/** MINIMAL walked through every position, as in the reference design. */
export const MinimalProgression: Story = {
  args: {
    steps: ['Step 1', 'Step 2', 'Step 3', 'Step 4'],
    active: 0,
    stepStyle: 'MINIMAL',
  },
  render: () => (
    <div className="space-y-2">
      {[0, 1, 2, 3].map((activeIndex) => (
        <MilestoneField
          key={activeIndex}
          steps={['Step 1', 'Step 2', 'Step 3', 'Step 4']}
          active={activeIndex}
          stepStyle="MINIMAL"
          marginBelow="NONE"
          accessibilityText={`Checkout progress, step ${activeIndex + 1}`}
        />
      ))}
    </div>
  ),
}

/**
 * TIMELINE — rounded-square markers joined by a connector. A completed step is a check on green,
 * the current step is a dot on blue with a soft halo, and a pending step is an outline. The
 * colors are `completedColor` (green by default) and `color` (blue by default).
 */
export const TimelineStyle: Story = {
  args: {
    steps: ['Submit request', 'Review documents', 'Approve', 'Issue payment', 'Close claim'],
    active: 2,
    stepStyle: 'TIMELINE',
    orientation: 'VERTICAL',
  },
}

/** A line of text under each title, with `stepDescriptions`. */
export const TimelineWithDescriptions: Story = {
  args: {
    steps: ['Submit request', 'Review documents', 'Approve', 'Issue payment', 'Close claim'],
    stepDescriptions: [
      'Tell us what happened and when.',
      'We check what you sent.',
      'A manager signs off.',
      'The money is sent to your account.',
      'We file the claim away.',
    ],
    active: 2,
    stepStyle: 'TIMELINE',
    orientation: 'VERTICAL',
  },
}

/**
 * Press Next and Back to watch the markers move on. As the step changes the old marker turns
 * green and its check pops in, the connector fills, and the new current marker gets its halo.
 * Nothing moves for people who prefer reduced motion.
 */
export const TimelineProgression: Story = {
  args: {
    steps: ['Submit request', 'Review documents', 'Approve', 'Issue payment', 'Close claim'],
    stepStyle: 'TIMELINE',
    orientation: 'VERTICAL',
  },
  render: (args) => <Stepper {...args} stepDescriptions={args.steps.map((step) => `About “${step}”.`)} />,
  play: playStepper('Submit request', 'Review documents'),
}

/** Horizontal: the connector grows left to right. */
export const TimelineHorizontal: Story = {
  args: {
    label: 'Claim progress',
    steps: ['Submit request', 'Review documents', 'Approve', 'Issue payment'],
    stepDescriptions: ['Tell us what happened.', 'We check what you sent.', 'A manager signs off.', 'Money is sent.'],
    active: 1,
    stepStyle: 'TIMELINE',
    orientation: 'HORIZONTAL',
  },
}

/** Every step finished (`active` of -1), and none started (`active` of null). */
export const TimelineAllCompleted: Story = {
  args: {
    steps: ['Submit request', 'Review documents', 'Approve'],
    active: -1,
    stepStyle: 'TIMELINE',
    orientation: 'VERTICAL',
  },
}

/** Other colors, with `color` for the current step and `completedColor` for the finished ones. */
export const TimelineColors: Story = {
  args: {
    steps: ['Submit request', 'Review documents', 'Approve', 'Issue payment'],
    active: 2,
    stepStyle: 'TIMELINE',
    orientation: 'VERTICAL',
    color: 'VIOLET_500',
    completedColor: 'TEAL_700',
  },
}

/** Clickable steps: each becomes a button with an accessible name and focus ring. */
export const MinimalWithLinks: Story = {
  // Known a11y failure, exempted until fixed:
  // - label-content-name-mismatch (button aria-label doesn't include the visible step number): https://github.com/pglevy/sailwind/issues/201
  parameters: { a11y: { test: 'todo' } },
  args: {
    steps: ['Cart', 'Billing', 'Shipping', 'Confirm'],
    active: 2,
    stepStyle: 'MINIMAL',
  },
  render: () => (
    <MilestoneField
      label="Checkout"
      steps={['Cart', 'Billing', 'Shipping', 'Confirm']}
      active={2}
      stepStyle="MINIMAL"
      links={[
        { onClick: () => console.log('Cart') },
        { onClick: () => console.log('Billing') },
        { onClick: () => console.log('Shipping') },
        { onClick: () => console.log('Confirm') },
      ]}
    />
  ),
}

export const VerticalDotStyle: Story = {
  args: {
    steps: ['Review Cart', 'Billing Information', 'Shipping Information', 'Confirm Order'],
    stepStyle: 'DOT',
    active: 1,
    orientation: 'VERTICAL',
    color: 'VIOLET_700',
  },
}

export const ChevronStyle: Story = {
  args: {
    label: 'Case Status',
    labelPosition: 'ABOVE',
    steps: ['Draft', 'Pending Review', 'Submitted', 'Filed', 'Closed'],
    active: 2,
    stepStyle: 'CHEVRON',
    color: 'POSITIVE',
  },
}

export const AllCompleted: Story = {
  args: {
    label: 'Project Completion',
    steps: ['Planning', 'Development', 'Testing', 'Deployment'],
    active: -1,
    color: 'POSITIVE',
  },
}

export const AllFuture: Story = {
  args: {
    label: 'Upcoming Project',
    steps: ['Research', 'Design', 'Implementation', 'Launch'],
    active: null,
    color: 'NEGATIVE',
  },
}

export const SemanticColors: Story = {
  args: {
    steps: ['Step 1', 'Step 2', 'Step 3'],
    active: 1,
  },
  render: () => (
    <div className="space-y-4">
      <MilestoneField steps={['Step 1', 'Step 2', 'Step 3']} active={1} color="ACCENT" />
      <MilestoneField steps={['Step 1', 'Step 2', 'Step 3']} active={1} color="POSITIVE" />
      <MilestoneField steps={['Step 1', 'Step 2', 'Step 3']} active={1} color="NEGATIVE" />
      <MilestoneField steps={['Step 1', 'Step 2', 'Step 3']} active={1} color="WARN" />
    </div>
  ),
}

export const LabelPositions: Story = {
  args: {
    steps: ['Step 1', 'Step 2', 'Step 3'],
    active: 1,
  },
  render: () => (
    <div className="space-y-4">
      <MilestoneField
        label="Above Label"
        labelPosition="ABOVE"
        steps={['Step 1', 'Step 2', 'Step 3']}
        active={1}
      />
      <MilestoneField
        label="Adjacent Label"
        labelPosition="ADJACENT"
        steps={['Step 1', 'Step 2', 'Step 3']}
        active={1}
      />
      <MilestoneField
        label="Collapsed Label"
        labelPosition="COLLAPSED"
        steps={['Step 1', 'Step 2', 'Step 3']}
        active={1}
        accessibilityText="Progress through three steps"
      />
    </div>
  ),
}

export const WithHelpTooltip: Story = {
  args: {
    label: 'Process Status',
    helpTooltip: 'This shows the current progress through our standard workflow',
    steps: ['Initiate', 'Review', 'Approve', 'Complete'],
    active: 1,
    color: 'ACCENT',
  },
}
