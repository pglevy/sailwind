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
