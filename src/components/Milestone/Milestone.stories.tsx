import type { Meta, StoryObj } from '@storybook/react-vite'
import { MilestoneField } from './MilestoneField'

const meta = {
  title: 'Components/Milestone',
  component: MilestoneField,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    stepStyle: { control: 'select', options: ['NUMBERED', 'MINIMAL', 'LINE', 'DOT', 'CHEVRON'] },
    orientation: { control: 'select', options: ['HORIZONTAL', 'VERTICAL'] },
    color: { control: 'text' },
    completedColor: { control: 'text' },
    labelPosition: { control: 'select', options: ['ABOVE', 'ADJACENT', 'COLLAPSED', 'JUSTIFIED'] },
  },
} satisfies Meta<typeof MilestoneField>

export default meta
type Story = StoryObj<typeof meta>

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
 * NUMBERED — numbered/checked circles with progress connectors, a "STEP n"
 * caption and status text. Connectors are solid once passed and dashed while
 * pending, so progress reads without relying on color.
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

/** NUMBERED without the caption/status text — just circles, connectors, labels. */
export const NumberedCompact: Story = {
  args: {
    steps: ['Card Details', 'Form Review', 'Authenticate OTP', 'Create Code'],
    active: 1,
    stepStyle: 'NUMBERED',
    showStepNumbers: false,
    showStepStatus: false,
  },
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

/** Clickable steps: each becomes a button with an accessible name and focus ring. */
export const MinimalWithLinks: Story = {
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
