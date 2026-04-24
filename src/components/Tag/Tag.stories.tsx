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
  argTypes: {
    size: { control: 'select', options: ['SMALL', 'STANDARD'] },
    marginBelow: { control: 'select', options: ['NONE', 'EVEN_LESS', 'LESS', 'STANDARD', 'MORE', 'EVEN_MORE'] },
  },
} satisfies Meta<typeof TagField>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const SemanticColors: Story = {
  args: {
    size: 'STANDARD',
    tags: [
      { text: 'HIGH PRIORITY', backgroundColor: 'NEGATIVE' },
      { text: 'REVIEWED', backgroundColor: 'POSITIVE' },
      { text: 'NEW', backgroundColor: 'ACCENT' },
    ],
  },
}

export const CustomHexColors: Story = {
  args: {
    size: 'STANDARD',
    tags: [
      { text: 'URGENT', backgroundColor: 'PINK_50', textColor: 'RED_700' },
      { text: 'CUSTOMER FACING', backgroundColor: 'BLUE_50', textColor: 'BLUE_800' },
      { text: 'IN PROGRESS', backgroundColor: 'YELLOW_100', textColor: 'YELLOW_800' },
    ],
  },
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
