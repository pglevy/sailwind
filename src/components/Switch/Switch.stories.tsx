import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'
import { useState } from 'react'
import { SwitchField } from './SwitchField'

const meta = {
  title: 'Components/Switch',
  component: SwitchField,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof SwitchField>

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
    return <SwitchField {...args} value={value} saveInto={setValue} />
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
    return <SwitchField {...args} value={value} saveInto={setValue} />
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
    return <SwitchField {...args} value={value} saveInto={setValue} />
  },
}

// --- Size stories (Issue #40: size affects label too) ---

export const SmallSize: Story = {
  args: {
    label: 'Small Switch',
    value: true,
    size: 'SMALL',
  },
  render: (args) => {
    const [value, setValue] = useState(args.value)
    return <SwitchField {...args} value={value} saveInto={setValue} />
  },
}

export const StandardSize: Story = {
  args: {
    label: 'Standard Switch',
    value: true,
    size: 'STANDARD',
  },
  render: (args) => {
    const [value, setValue] = useState(args.value)
    return <SwitchField {...args} value={value} saveInto={setValue} />
  },
}

export const MediumSize: Story = {
  args: {
    label: 'Medium Switch',
    value: true,
    size: 'MEDIUM',
  },
  render: (args) => {
    const [value, setValue] = useState(args.value)
    return <SwitchField {...args} value={value} saveInto={setValue} />
  },
}

export const LargeSize: Story = {
  args: {
    label: 'Large Switch',
    value: true,
    size: 'LARGE',
  },
  render: (args) => {
    const [value, setValue] = useState(args.value)
    return <SwitchField {...args} value={value} saveInto={setValue} />
  },
}

export const AllSizes: Story = {
  args: { label: '', value: true },
  render: () => {
    const sizes = ['SMALL', 'STANDARD', 'MEDIUM', 'LARGE'] as const
    const SizeRow = ({ s }: { s: typeof sizes[number] }) => {
      const [value, setValue] = useState(true)
      return <SwitchField label={`${s} size`} value={value} saveInto={setValue} size={s} marginBelow="NONE" />
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
    return <SwitchField {...args} value={value} saveInto={setValue} />
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
    return <SwitchField {...args} value={value} saveInto={setValue} />
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
    return <SwitchField {...args} value={value} saveInto={setValue} />
  },
}

export const CustomHexColor: Story = {
  args: {
    label: 'Custom Hex Color',
    value: true,
    color: '#9333EA',
  },
  render: (args) => {
    const [value, setValue] = useState(args.value)
    return <SwitchField {...args} value={value} saveInto={setValue} />
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

// --- Label position stories (Issue #41: left or right label) ---

export const LabelOnRight: Story = {
  args: {
    label: 'Label on Right (default)',
    value: true,
    switchLabelPosition: 'RIGHT',
  },
  render: (args) => {
    const [value, setValue] = useState(args.value)
    return <SwitchField {...args} value={value} saveInto={setValue} />
  },
}

export const LabelOnLeft: Story = {
  args: {
    label: 'Label on Left',
    value: true,
    switchLabelPosition: 'LEFT',
  },
  render: (args) => {
    const [value, setValue] = useState(args.value)
    return <SwitchField {...args} value={value} saveInto={setValue} />
  },
}

export const LabelPositionComparison: Story = {
  args: { label: '', value: true },
  render: () => {
    const RightLabel = () => {
      const [value, setValue] = useState(true)
      return <SwitchField label="Label on Right" value={value} saveInto={setValue} switchLabelPosition="RIGHT" marginBelow="NONE" />
    }
    const LeftLabel = () => {
      const [value, setValue] = useState(true)
      return <SwitchField label="Label on Left" value={value} saveInto={setValue} switchLabelPosition="LEFT" marginBelow="NONE" />
    }
    return (
      <div className="flex flex-col gap-4">
        <RightLabel />
        <LeftLabel />
      </div>
    )
  },
}
