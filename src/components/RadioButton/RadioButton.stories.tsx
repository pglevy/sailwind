import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { RadioButtonField } from './RadioButtonField'

const meta = {
  title: 'Components/RadioButton',
  component: RadioButtonField,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    labelPosition: { control: 'select', options: ['ABOVE', 'ADJACENT', 'COLLAPSED', 'JUSTIFIED'] },
    choiceLayout: { control: 'select', options: ['STACKED', 'COMPACT'] },
    choiceStyle: { control: 'select', options: ['STANDARD', 'CARDS'] },
    choicePosition: { control: 'select', options: ['START', 'END'] },
    spacing: { control: 'select', options: ['STANDARD', 'MORE', 'EVEN_MORE'] },
  },
} satisfies Meta<typeof RadioButtonField>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: 'Browser',
    choiceLabels: ['Firefox', 'Chrome', 'Safari'],
    choiceValues: ['ffx', 'chr', 'sfr'],
    value: 'ffx',
  },
}

export const CompactCardsLayout: Story = {
  args: {
    label: 'Did the product meet your needs?',
    labelPosition: 'ABOVE',
    choiceLabels: ['Yes', 'No'],
    choiceValues: [1, 2],
    choiceLayout: 'COMPACT',
    choiceStyle: 'CARDS',
  },
  render: (args) => {
    const [value, setValue] = useState<number | undefined>(undefined)
    return (
      <RadioButtonField
        {...args}
        value={value}
        saveInto={setValue}
      />
    )
  },
}

export const CardsStyleStacked: Story = {
  args: {
    label: 'Select a plan',
    choiceLabels: ['Basic - $9/month', 'Pro - $29/month', 'Enterprise - Contact us'],
    choiceValues: ['basic', 'pro', 'enterprise'],
    choiceStyle: 'CARDS',
  },
  render: (args) => {
    const [value, setValue] = useState<string | undefined>(undefined)
    return (
      <RadioButtonField
        {...args}
        value={value}
        saveInto={setValue}
      />
    )
  },
}

export const AdjacentLabel: Story = {
  args: {
    label: 'Status',
    labelPosition: 'ADJACENT',
    choiceLabels: ['Active', 'Inactive'],
    choiceValues: ['active', 'inactive'],
    value: 'active',
  },
}

export const WithRequiredAndInstructions: Story = {
  args: {
    label: 'Delivery Method',
    instructions: "Choose how you'd like to receive your order",
    choiceLabels: ['Standard Shipping', 'Express Shipping', 'Pickup'],
    choiceValues: ['standard', 'express', 'pickup'],
    required: true,
    requiredMessage: 'Please select a delivery method',
  },
  render: (args) => {
    const [value, setValue] = useState<string | undefined>(undefined)
    return (
      <RadioButtonField
        {...args}
        value={value}
        saveInto={setValue}
      />
    )
  },
}

export const Disabled: Story = {
  args: {
    label: 'Disabled Radio Buttons',
    choiceLabels: ['Option 1', 'Option 2', 'Option 3'],
    choiceValues: ['1', '2', '3'],
    value: '1',
    disabled: true,
  },
}

export const SpacingVariations: Story = {
  args: {
    label: 'Standard Spacing',
    choiceLabels: ['Small', 'Medium', 'Large'],
    choiceValues: ['S', 'M', 'L'],
    value: 'M',
    spacing: 'STANDARD',
  },
  render: (args) => {
    const [value, setValue] = useState(args.value)
    return (
      <RadioButtonField
        {...args}
        value={value}
        saveInto={setValue}
      />
    )
  },
}

export const ChoicePositionEnd: Story = {
  args: {
    label: 'Radio Buttons on Right',
    choiceLabels: ['First option', 'Second option', 'Third option'],
    choiceValues: ['1', '2', '3'],
    choicePosition: 'END',
  },
  render: (args) => {
    const [value, setValue] = useState('2')
    return (
      <RadioButtonField
        {...args}
        value={value}
        saveInto={setValue}
      />
    )
  },
}
