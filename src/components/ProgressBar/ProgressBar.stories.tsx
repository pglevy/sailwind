import type { Meta, StoryObj } from '@storybook/react-vite'
import { ProgressBar } from './ProgressBar'

const meta = {
  title: 'Components/ProgressBar',
  component: ProgressBar,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      <div style={{ width: 480 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ProgressBar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: 'Task Completion',
    instructions: '143 of 150 tasks completed',
    percentage: 95,
    color: 'ACCENT',
    style: 'THICK',
  },
}

export const ThinStyle: Story = {
  args: {
    label: 'Thin Progress Bar',
    percentage: 75,
    color: 'ACCENT',
    style: 'THIN',
  },
}

export const ThickStyle: Story = {
  args: {
    label: 'Thick Progress Bar',
    percentage: 75,
    color: 'ACCENT',
    style: 'THICK',
  },
}

export const SemanticColors: Story = {
  args: {
    percentage: 80,
  },
  render: () => (
    <div className="space-y-3" style={{ width: 480 }}>
      <ProgressBar label="ACCENT (Blue)" percentage={80} color="ACCENT" />
      <ProgressBar label="POSITIVE (Green)" percentage={90} color="POSITIVE" />
      <ProgressBar label="WARN (Yellow)" percentage={60} color="WARN" />
      <ProgressBar label="NEGATIVE (Red)" percentage={30} color="NEGATIVE" />
    </div>
  ),
}

export const CustomHexColor: Story = {
  args: {
    label: 'Custom Hex Color',
    percentage: 85,
    color: '#9333EA',
  },
}

export const HiddenPercentage: Story = {
  args: {
    label: 'Without Percentage Display',
    instructions: 'Percentage text hidden',
    percentage: 45,
    color: 'ACCENT',
    showPercentage: false,
  },
}

export const OverflowPercentage: Story = {
  args: {
    label: 'Edge Cases',
    instructions: 'Handles values outside 0-100 range',
    percentage: 120,
    color: 'WARN',
  },
}

export const CollapsedLabel: Story = {
  args: {
    label: 'Collapsed Label',
    labelPosition: 'COLLAPSED',
    percentage: 55,
    color: 'POSITIVE',
    accessibilityText: 'Hidden label progress bar at 55 percent',
  },
}
