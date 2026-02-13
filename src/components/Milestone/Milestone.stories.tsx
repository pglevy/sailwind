import type { Meta, StoryObj } from '@storybook/react-vite'
import { MilestoneField } from './MilestoneField'

const meta = {
  title: 'Components/Milestone',
  component: MilestoneField,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
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

export const VerticalDotStyle: Story = {
  args: {
    steps: ['Review Cart', 'Billing Information', 'Shipping Information', 'Confirm Order'],
    stepStyle: 'DOT',
    active: 1,
    orientation: 'VERTICAL',
    color: '#674ea7',
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
