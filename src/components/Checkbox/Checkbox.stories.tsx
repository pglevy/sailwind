import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'
import { useState } from 'react'
import { CheckboxField } from './CheckboxField'

const meta = {
  title: 'Components/Checkbox',
  component: CheckboxField,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    labelPosition: { control: 'select', options: ['ABOVE', 'ADJACENT', 'COLLAPSED', 'JUSTIFIED'] },
    choiceLayout: { control: 'select', options: ['STACKED', 'COMPACT'] },
    choiceStyle: { control: 'select', options: ['STANDARD', 'CARDS'] },
    choicePosition: { control: 'select', options: ['START', 'END'] },
    spacing: { control: 'select', options: ['STANDARD', 'MORE', 'EVEN_MORE'] },
  },
} satisfies Meta<typeof CheckboxField>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: 'Language',
    instructions: 'In which languages are you proficient?',
    choiceLabels: ['English', 'Spanish', 'French', 'German'],
    choiceValues: ['en_US', 'es_ES', 'fr_FR', 'de_DE'],
    value: ['en_US', 'fr_FR'],
  },
  render: (args) => {
    const [value, setValue] = useState<string[]>(args.value ?? [])
    return <CheckboxField {...args} value={value} saveInto={setValue} />
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const englishCheckbox = canvas.getByLabelText('English')
    const spanishCheckbox = canvas.getByLabelText('Spanish')
    await expect(englishCheckbox).toBeChecked()
    await expect(spanishCheckbox).not.toBeChecked()
    await userEvent.click(spanishCheckbox)
    await expect(spanishCheckbox).toBeChecked()
  },
}

export const CompactLayout: Story = {
  args: {
    label: 'Preferences',
    choiceLabels: ['Email', 'SMS', 'Push'],
    choiceValues: ['email', 'sms', 'push'],
    value: [],
    choiceLayout: 'COMPACT',
  },
}

export const CardsStyle: Story = {
  args: {
    label: 'Reason(s) for appointment',
    labelPosition: 'ABOVE',
    choiceLabels: ['Cough', 'Sore throat', 'Congestion', 'Body aches', 'Nausea', 'Fever'],
    choiceValues: ['cough', 'sore_throat', 'congestion', 'body_aches', 'nausea', 'fever'],
    value: [],
    choiceStyle: 'CARDS',
  },
  render: (args) => {
    const [value, setValue] = useState<string[]>(args.value ?? [])
    return (
      <CheckboxField
        {...args}
        value={value}
        saveInto={setValue}
      />
    )
  },
}

export const AdjacentLabel: Story = {
  args: {
    label: 'Terms',
    labelPosition: 'ADJACENT',
    choiceLabels: ['I agree to the terms and conditions'],
    choiceValues: ['agreed'],
    value: [],
  },
}

export const WithRequiredAndValidation: Story = {
  args: {
    label: 'Required Selection',
    instructions: 'Please select at least one option',
    choiceLabels: ['Option A', 'Option B', 'Option C'],
    choiceValues: ['a', 'b', 'c'],
    value: [],
    required: true,
    requiredMessage: 'This field is required',
    validations: [],
  },
}

export const Disabled: Story = {
  args: {
    label: 'Disabled Checkboxes',
    choiceLabels: ['Option 1', 'Option 2', 'Option 3'],
    choiceValues: ['1', '2', '3'],
    value: ['1'],
    disabled: true,
  },
}

export const SpacingVariations: Story = {
  args: {
    label: 'Standard Spacing',
    choiceLabels: ['Item 1', 'Item 2', 'Item 3'],
    choiceValues: ['1', '2', '3'],
    value: [],
    spacing: 'STANDARD',
  },
}

export const ChoicePositionEnd: Story = {
  args: {
    label: 'Checkboxes on Right',
    choiceLabels: ['First option', 'Second option', 'Third option'],
    choiceValues: ['1', '2', '3'],
    value: [],
    choicePosition: 'END',
  },
  render: (args) => {
    const [value, setValue] = useState<string[]>(args.value ?? [])
    return (
      <CheckboxField
        {...args}
        value={value}
        saveInto={setValue}
      />
    )
  },
}
