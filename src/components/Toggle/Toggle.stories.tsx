import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'
import { useState } from 'react'
import { ToggleField } from './ToggleField'

const meta = {
  title: 'Components/Toggle',
  component: ToggleField,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof ToggleField>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: 'Enable Notifications',
    instructions: 'Receive email and push notifications for updates',
    value: true,
  },
  render: (args) => {
    const [value, setValue] = useState(args.value)
    return <ToggleField {...args} value={value} saveInto={setValue} />
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const switchEl = canvas.getByRole('switch')
    await expect(switchEl).toBeVisible()
    await expect(switchEl).toBeChecked()
    await userEvent.click(switchEl)
    await expect(switchEl).not.toBeChecked()
  },
}

export const Unchecked: Story = {
  args: {
    label: 'Dark Mode',
    value: false,
  },
  render: (args) => {
    const [value, setValue] = useState(args.value)
    return <ToggleField {...args} value={value} saveInto={setValue} />
  },
}

export const WithInstructions: Story = {
  args: {
    label: 'Auto-save',
    instructions: 'Automatically save changes every 30 seconds',
    value: true,
    color: 'POSITIVE',
  },
  render: (args) => {
    const [value, setValue] = useState(args.value)
    return <ToggleField {...args} value={value} saveInto={setValue} />
  },
}

// --- Size stories ---

export const SmallSize: Story = {
  args: {
    label: 'Small Toggle',
    value: true,
    size: 'SMALL',
  },
  render: (args) => {
    const [value, setValue] = useState(args.value)
    return <ToggleField {...args} value={value} saveInto={setValue} />
  },
}

export const StandardSize: Story = {
  args: {
    label: 'Standard Toggle',
    value: true,
    size: 'STANDARD',
  },
  render: (args) => {
    const [value, setValue] = useState(args.value)
    return <ToggleField {...args} value={value} saveInto={setValue} />
  },
}

export const MediumSize: Story = {
  args: {
    label: 'Medium Toggle',
    value: true,
    size: 'MEDIUM',
  },
  render: (args) => {
    const [value, setValue] = useState(args.value)
    return <ToggleField {...args} value={value} saveInto={setValue} />
  },
}

export const LargeSize: Story = {
  args: {
    label: 'Large Toggle',
    value: true,
    size: 'LARGE',
  },
  render: (args) => {
    const [value, setValue] = useState(args.value)
    return <ToggleField {...args} value={value} saveInto={setValue} />
  },
}

export const AllSizes: Story = {
  args: { label: '', value: true },
  render: () => {
    const sizes = ['SMALL', 'STANDARD', 'MEDIUM', 'LARGE'] as const
    const SizeRow = ({ s }: { s: typeof sizes[number] }) => {
      const [value, setValue] = useState(true)
      return <ToggleField label={`${s} size`} value={value} saveInto={setValue} size={s} marginBelow="NONE" />
    }
    return (
      <div className="flex flex-col gap-4">
        {sizes.map((s) => <SizeRow key={s} s={s} />)}
      </div>
    )
  },
}

// --- Color stories ---

export const ColorAccent: Story = {
  args: {
    label: 'ACCENT (Blue)',
    value: true,
    color: 'ACCENT',
  },
  render: (args) => {
    const [value, setValue] = useState(args.value)
    return <ToggleField {...args} value={value} saveInto={setValue} />
  },
}

export const ColorPositive: Story = {
  args: {
    label: 'POSITIVE (Green)',
    value: true,
    color: 'POSITIVE',
  },
  render: (args) => {
    const [value, setValue] = useState(args.value)
    return <ToggleField {...args} value={value} saveInto={setValue} />
  },
}

export const ColorNegative: Story = {
  args: {
    label: 'NEGATIVE (Red)',
    value: true,
    color: 'NEGATIVE',
  },
  render: (args) => {
    const [value, setValue] = useState(args.value)
    return <ToggleField {...args} value={value} saveInto={setValue} />
  },
}

export const CustomHexColor: Story = {
  args: {
    label: 'Custom Hex Color',
    value: true,
    color: 'VIOLET_500',
  },
  render: (args) => {
    const [value, setValue] = useState(args.value)
    return <ToggleField {...args} value={value} saveInto={setValue} />
  },
}

// --- Disabled stories ---

export const DisabledOff: Story = {
  args: {
    label: 'Disabled (Off)',
    value: false,
    disabled: true,
  },
}

export const DisabledOn: Story = {
  args: {
    label: 'Disabled (On)',
    value: true,
    disabled: true,
  },
}

// --- Label position stories ---

export const LabelOnRight: Story = {
  args: {
    label: 'Label on Right (default)',
    value: true,
    toggleLabelPosition: 'RIGHT',
  },
  render: (args) => {
    const [value, setValue] = useState(args.value)
    return <ToggleField {...args} value={value} saveInto={setValue} />
  },
}

export const LabelOnLeft: Story = {
  args: {
    label: 'Label on Left',
    value: true,
    toggleLabelPosition: 'LEFT',
  },
  render: (args) => {
    const [value, setValue] = useState(args.value)
    return <ToggleField {...args} value={value} saveInto={setValue} />
  },
}

export const LabelPositionComparison: Story = {
  args: { label: '', value: true },
  render: () => {
    const RightLabel = () => {
      const [value, setValue] = useState(true)
      return <ToggleField label="Label on Right" value={value} saveInto={setValue} toggleLabelPosition="RIGHT" marginBelow="NONE" />
    }
    const LeftLabel = () => {
      const [value, setValue] = useState(true)
      return <ToggleField label="Label on Left" value={value} saveInto={setValue} toggleLabelPosition="LEFT" marginBelow="NONE" />
    }
    return (
      <div className="flex flex-col gap-4">
        <RightLabel />
        <LeftLabel />
      </div>
    )
  },
}
