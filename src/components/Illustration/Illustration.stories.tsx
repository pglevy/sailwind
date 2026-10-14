import type { Meta, StoryObj } from '@storybook/react-vite'
import { Illustration } from './Illustration'

const meta = {
  title: 'Components/Illustration',
  component: Illustration,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      // The outer rings run past the picture's edge, so it sits in something that clips
      <div style={{ width: 400 }} className="overflow-hidden rounded-sm border border-gray-200 bg-white">
        <Story />
      </div>
    ),
  ],
  argTypes: {
    name: { control: 'select', options: ['TEST_CASES', 'TRIGGERS', 'HISTORY', 'NO_DATA'] },
    showAnimation: { control: 'boolean' },
  },
} satisfies Meta<typeof Illustration>

export default meta
type Story = StoryObj<typeof meta>

export const TestCases: Story = {
  args: { name: 'TEST_CASES' },
}

export const Triggers: Story = {
  args: { name: 'TRIGGERS' },
}

export const History: Story = {
  args: { name: 'HISTORY' },
}

export const NoData: Story = {
  args: { name: 'NO_DATA' },
}

export const WithoutAnimation: Story = {
  args: { name: 'TRIGGERS', showAnimation: false },
}

/** The illustration fills the width it is given, up to 400px, and scales to fit. */
export const FillsItsContainer: Story = {
  args: { name: 'TEST_CASES' },
  parameters: { layout: 'padded' },
  decorators: [
    (Story) => (
      <div className="space-y-4">
        {[400, 260, 160].map((width) => (
          <div key={width} style={{ width }} className="overflow-hidden rounded-sm border border-gray-200 bg-white">
            <Story />
          </div>
        ))}
      </div>
    ),
  ],
}
