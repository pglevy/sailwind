import type { Meta, StoryObj } from '@storybook/react-vite'
import { StampField } from './StampField'

const meta = {
  title: 'Components/Stamp',
  component: StampField,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof StampField>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    backgroundColor: 'ACCENT',
    icon: 'star',
    contentColor: 'STANDARD',
    tooltip: 'Favorite',
  },
}

export const SemanticColors: Story = {
  render: () => (
    <div className="flex gap-4 items-center">
      <StampField backgroundColor="ACCENT" icon="star" contentColor="STANDARD" tooltip="Favorite" />
      <StampField backgroundColor="POSITIVE" icon="home" contentColor="STANDARD" tooltip="Home" />
      <StampField backgroundColor="NEGATIVE" icon="briefcase" contentColor="STANDARD" tooltip="Work" />
    </div>
  ),
}

export const TransparentBackground: Story = {
  render: () => (
    <div className="flex gap-4 items-center">
      <StampField backgroundColor="TRANSPARENT" icon="home" contentColor="POSITIVE" tooltip="Home (Transparent)" />
      <StampField backgroundColor="TRANSPARENT" icon="star" contentColor="ACCENT" tooltip="Star (Transparent)" />
    </div>
  ),
}

export const TextStamps: Story = {
  render: () => (
    <div className="flex gap-4 items-center">
      <StampField backgroundColor="#cc0000" text="1" align="CENTER" />
      <StampField backgroundColor="#cc0000" text="2" align="CENTER" />
      <StampField backgroundColor="#cc0000" text="3" align="CENTER" />
    </div>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div className="flex gap-4 items-center">
      <StampField icon="star" size="TINY" backgroundColor="ACCENT" tooltip="Tiny" />
      <StampField icon="star" size="SMALL" backgroundColor="ACCENT" tooltip="Small" />
      <StampField icon="star" size="MEDIUM" backgroundColor="ACCENT" tooltip="Medium" />
      <StampField icon="star" size="LARGE" backgroundColor="ACCENT" tooltip="Large" />
    </div>
  ),
}

export const Shapes: Story = {
  render: () => (
    <div className="flex gap-4 items-center">
      <StampField icon="star" shape="SQUARED" backgroundColor="ACCENT" tooltip="Squared" />
      <StampField icon="star" shape="SEMI_ROUNDED" backgroundColor="ACCENT" tooltip="Semi Rounded" />
      <StampField icon="star" shape="ROUNDED" backgroundColor="ACCENT" tooltip="Rounded (Default)" />
    </div>
  ),
}

export const WithLabelAndInstructions: Story = {
  args: {
    label: 'Priority Level',
    instructions: 'Indicates the urgency of this item',
    labelPosition: 'ABOVE',
    icon: 'star',
    text: '7',
    size: 'LARGE',
    backgroundColor: 'NEGATIVE',
    helpTooltip: 'High priority items require immediate attention',
  },
}
