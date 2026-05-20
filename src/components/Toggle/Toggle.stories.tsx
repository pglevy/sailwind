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
    choiceLabel: 'Enable Notifications',
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
    choiceLabel: 'Dark Mode',
    value: false,
  },
  render: (args) => {
    const [value, setValue] = useState(args.value)
    return <ToggleField {...args} value={value} saveInto={setValue} />
  },
}

export const WithHelpTooltip: Story = {
  args: {
    choiceLabel: 'Auto-save',
    helpTooltip: 'Automatically save changes every 30 seconds',
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
    choiceLabel: 'Small Toggle',
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
    choiceLabel: 'Standard Toggle',
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
    choiceLabel: 'Medium Toggle',
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
    choiceLabel: 'Large Toggle',
    value: true,
    size: 'LARGE',
  },
  render: (args) => {
    const [value, setValue] = useState(args.value)
    return <ToggleField {...args} value={value} saveInto={setValue} />
  },
}

export const AllSizes: Story = {
  args: { choiceLabel: '', value: true },
  render: () => {
    const sizes = ['SMALL', 'STANDARD', 'MEDIUM', 'LARGE'] as const
    const SizeRow = ({ s }: { s: typeof sizes[number] }) => {
      const [value, setValue] = useState(true)
      return <ToggleField choiceLabel={`${s} size`} value={value} saveInto={setValue} size={s} marginBelow="NONE" />
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
    choiceLabel: 'ACCENT (Blue)',
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
    choiceLabel: 'POSITIVE (Green)',
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
    choiceLabel: 'NEGATIVE (Red)',
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
    choiceLabel: 'Custom Hex Color',
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
    choiceLabel: 'Disabled (Off)',
    value: false,
    disabled: true,
  },
}

export const DisabledOn: Story = {
  args: {
    choiceLabel: 'Disabled (On)',
    value: true,
    disabled: true,
  },
}

// --- Choice position stories ---

export const ChoicePositionStart: Story = {
  args: {
    choiceLabel: 'Toggle on left (START, default)',
    value: true,
    choicePosition: 'START',
  },
  render: (args) => {
    const [value, setValue] = useState(args.value)
    return <ToggleField {...args} value={value} saveInto={setValue} />
  },
}

export const ChoicePositionEnd: Story = {
  args: {
    choiceLabel: 'Toggle on right (END)',
    value: true,
    choicePosition: 'END',
  },
  render: (args) => {
    const [value, setValue] = useState(args.value)
    return <ToggleField {...args} value={value} saveInto={setValue} />
  },
}

export const ChoicePositionComparison: Story = {
  args: { choiceLabel: '', value: true },
  render: () => {
    const StartPosition = () => {
      const [value, setValue] = useState(true)
      return <ToggleField choiceLabel="Toggle on left (START)" value={value} saveInto={setValue} choicePosition="START" marginBelow="NONE" />
    }
    const EndPosition = () => {
      const [value, setValue] = useState(true)
      return <ToggleField choiceLabel="Toggle on right (END)" value={value} saveInto={setValue} choicePosition="END" marginBelow="NONE" />
    }
    return (
      <div className="flex flex-col gap-4">
        <StartPosition />
        <EndPosition />
      </div>
    )
  },
}

// --- Required message stories ---

export const RequiredDefault: Story = {
  args: {
    choiceLabel: 'Accept Terms',
    value: false,
    required: true,
  },
  render: (args) => {
    const [value, setValue] = useState(args.value)
    return <ToggleField {...args} value={value} saveInto={setValue} />
  },
}

export const RequiredCustomMessage: Story = {
  args: {
    choiceLabel: 'Accept Terms',
    value: false,
    required: true,
    requiredMessage: 'You must accept the terms to proceed',
  },
  render: (args) => {
    const [value, setValue] = useState(args.value)
    return <ToggleField {...args} value={value} saveInto={setValue} />
  },
}
