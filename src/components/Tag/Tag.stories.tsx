import type { Meta, StoryObj } from '@storybook/react-vite'
import { TagField } from './TagField'

const meta = {
  title: 'Components/Tag',
  component: TagField,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: {
    size: 'STANDARD' as const,
    tags: [
      { text: 'ACTIVE', backgroundColor: 'POSITIVE' },
    ],
  },
} satisfies Meta<typeof TagField>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const SemanticColors: Story = {
  render: () => (
    <TagField
      size="STANDARD"
      tags={[
        { text: 'HIGH PRIORITY', backgroundColor: 'NEGATIVE' },
        { text: 'REVIEWED', backgroundColor: 'POSITIVE' },
        { text: 'NEW', backgroundColor: 'ACCENT' },
      ]}
    />
  ),
}

export const CustomHexColors: Story = {
  render: () => (
    <TagField
      size="STANDARD"
      tags={[
        { text: 'URGENT', backgroundColor: '#FED7DE', textColor: '#9F0019' },
        { text: 'CUSTOMER FACING', backgroundColor: '#DBECFF', textColor: '#0C4283' },
        { text: 'IN PROGRESS', backgroundColor: '#FFF6C9', textColor: '#856C00' },
      ]}
    />
  ),
}

export const SmallSize: Story = {
  args: {
    size: 'SMALL',
    tags: [
      { text: 'ACTIVE', backgroundColor: 'POSITIVE' },
      { text: 'PENDING', backgroundColor: 'SECONDARY' },
    ],
  },
}
