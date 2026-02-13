import type { Meta, StoryObj } from '@storybook/react-vite'
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


export const SmallSize: Story = {
  args: {
    label: 'Small Switch',
    value: true,
    size: 'SMALL',
  },
}

export const StandardSize: Story = {
  args: {
    label: 'Standard Switch',
    value: true,
    size: 'STANDARD',
  },
}

export const MediumSize: Story = {
  args: {
    label: 'Medium Switch',
    value: true,
    size: 'MEDIUM',
  },
}

export const LargeSize: Story = {
  args: {
    label: 'Large Switch',
    value: true,
    size: 'LARGE',
  },
}

export const ColorAccent: Story = {
  args: {
    label: 'ACCENT (Blue)',
    value: true,
    color: 'ACCENT',
  },
}

export const ColorPositive: Story = {
  args: {
    label: 'POSITIVE (Green)',
    value: true,
    color: 'POSITIVE',
  },
}

export const ColorNegative: Story = {
  args: {
    label: 'NEGATIVE (Red)',
    value: true,
    color: 'NEGATIVE',
  },
}

export const CustomHexColor: Story = {
  args: {
    label: 'Custom Hex Color',
    value: true,
    color: '#9333EA',
  },
}

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

export const AdjacentLabel: Story = {
  args: {
    label: 'Adjacent Label Position',
    labelPosition: 'ADJACENT',
    value: true,
  },
}