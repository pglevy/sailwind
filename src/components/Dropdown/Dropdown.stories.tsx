import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { userEvent, within, expect } from 'storybook/test'
import { DropdownField } from './DropdownField'
import { MultipleDropdownField } from './MultipleDropdownField'

const meta = {
  title: 'Components/Dropdown',
  component: DropdownField,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    labelPosition: { control: 'select', options: ['ABOVE', 'ADJACENT', 'COLLAPSED', 'JUSTIFIED'] },
    searchDisplay: { control: 'select', options: ['AUTO', 'ON', 'OFF'] },
  },
} satisfies Meta<typeof DropdownField>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: 'Language',
    instructions: 'In which language are you most proficient?',
    choiceLabels: ['English', 'Spanish', 'French', 'German'],
    choiceValues: ['en_US', 'es_ES', 'fr_FR', 'de_DE'],
    value: 'en_US',
    placeholder: 'Select a language',
    searchDisplay: 'AUTO',
  },
  render: (args) => {
    const [value, setValue] = useState(args.value)
    return (
      <DropdownField
        {...args}
        value={value}
        saveInto={setValue}
      />
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Open the dropdown
    await userEvent.click(canvas.getByRole('button'))
    await expect(canvas.getByRole('listbox')).toBeVisible()

    // Select a different option
    await userEvent.click(canvas.getByRole('option', { name: 'French' }))

    // Dropdown closes and shows new selection
    await expect(canvas.queryByRole('listbox')).not.toBeInTheDocument()
    await expect(canvas.getByText('French')).toBeVisible()
  },
}

export const NoDefaultSelection: Story = {
  args: {
    label: 'Country',
    choiceLabels: ['United States', 'Canada', 'Mexico', 'United Kingdom'],
    choiceValues: ['US', 'CA', 'MX', 'UK'],
    placeholder: 'Select a country',
  },
  render: (args) => {
    const [value, setValue] = useState<string | null>(null)
    return (
      <DropdownField
        {...args}
        value={value}
        saveInto={setValue}
      />
    )
  },
}

export const WithSearch: Story = {
  args: {
    label: 'Language',
    instructions: 'Select your primary language',
    choiceLabels: [
      'English (US)', 'Arabic', 'Chinese (Simplified)', 'Chinese (Traditional)',
      'Spanish', 'French', 'German', 'Japanese', 'Korean', 'Polish', 'Portuguese', 'Russian',
    ],
    choiceValues: [
      'en_US', 'ar', 'zh_CN', 'zh_HK', 'es_ES', 'fr_FR', 'de_DE', 'ja', 'ko', 'pl', 'pt', 'ru',
    ],
    placeholder: 'Select a language',
    searchDisplay: 'AUTO',
  },
  render: (args) => {
    const [value, setValue] = useState<string | null>(null)
    return (
      <DropdownField
        {...args}
        value={value}
        saveInto={setValue}
      />
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Open and search
    await userEvent.click(canvas.getByRole('button'))
    await expect(canvas.getByPlaceholderText('Search...')).toBeVisible()

    await userEvent.type(canvas.getByPlaceholderText('Search...'), 'ger')
    await expect(canvas.getByRole('option', { name: 'German' })).toBeVisible()
    await expect(canvas.queryByRole('option', { name: 'Arabic' })).not.toBeInTheDocument()

    // Select the filtered result
    await userEvent.click(canvas.getByRole('option', { name: 'German' }))
    await expect(canvas.getByText('German')).toBeVisible()
  },
}

export const Disabled: Story = {
  args: {
    label: 'Status',
    choiceLabels: ['Active', 'Inactive', 'Pending'],
    choiceValues: ['active', 'inactive', 'pending'],
    value: 'active',
    disabled: true,
  },
}

export const AdjacentLabel: Story = {
  args: {
    label: 'Priority',
    labelPosition: 'ADJACENT',
    choiceLabels: ['Low', 'Medium', 'High', 'Critical'],
    choiceValues: ['low', 'med', 'high', 'crit'],
    value: 'med',
  },
  render: (args) => {
    const [value, setValue] = useState(args.value)
    return (
      <DropdownField
        {...args}
        value={value}
        saveInto={setValue}
      />
    )
  },
}

export const MultipleDefault: Story = {
  args: {
    label: 'Language',
    instructions: 'Which language(s) are you proficient in?',
    choiceLabels: ['English', 'Spanish', 'French', 'German'],
    choiceValues: ['en_US', 'es_ES', 'fr_FR', 'de_DE'],
    searchDisplay: 'AUTO',
  },
  render: (args) => {
    const [value, setValue] = useState<string[]>(['en_US', 'fr_FR'])
    return (
      <MultipleDropdownField
        label={args.label}
        instructions={args.instructions}
        choiceLabels={args.choiceLabels ?? []}
        choiceValues={args.choiceValues ?? []}
        value={value}
        saveInto={(v) => setValue(v || [])}
        searchDisplay={args.searchDisplay}
      />
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Open and verify pre-selected items shown
    await expect(canvas.getByText('English, French')).toBeVisible()
    await userEvent.click(canvas.getByRole('button'))

    // Add Spanish to selection
    await userEvent.click(canvas.getByRole('option', { name: /Spanish/ }))

    // Dropdown stays open for multi-select
    await expect(canvas.getByRole('listbox')).toBeVisible()

    // Close by clicking outside
    await userEvent.click(document.body)
    await expect(canvas.queryByRole('listbox')).not.toBeInTheDocument()
  },
}

export const MultipleNoDefault: Story = {
  args: {
    label: 'Skills',
    instructions: 'Select all applicable skills',
    choiceLabels: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Java'],
    choiceValues: ['js', 'ts', 'react', 'node', 'python', 'java'],
    placeholder: 'Select skills',
  },
  render: (args) => {
    const [value, setValue] = useState<string[]>([])
    return (
      <MultipleDropdownField
        label={args.label}
        instructions={args.instructions}
        choiceLabels={args.choiceLabels ?? []}
        choiceValues={args.choiceValues ?? []}
        value={value}
        saveInto={(v) => setValue(v || [])}
        placeholder={args.placeholder}
      />
    )
  },
}

export const MultipleWithSearch: Story = {
  args: {
    label: 'Language',
    instructions: 'Select all languages you speak',
    choiceLabels: [
      'English', 'Arabic', 'Chinese (Simplified)', 'Chinese (Traditional)',
      'Spanish', 'French', 'German', 'Japanese', 'Korean', 'Polish', 'Portuguese', 'Russian',
    ],
    choiceValues: [
      'en_US', 'ar', 'zh_CN', 'zh_HK', 'es_ES', 'fr_FR', 'de_DE', 'ja', 'ko', 'pl', 'pt', 'ru',
    ],
    searchDisplay: 'AUTO',
  },
  render: (args) => {
    const [value, setValue] = useState<string[]>([])
    return (
      <MultipleDropdownField
        label={args.label}
        instructions={args.instructions}
        choiceLabels={args.choiceLabels ?? []}
        choiceValues={args.choiceValues ?? []}
        value={value}
        saveInto={(v) => setValue(v || [])}
        searchDisplay={args.searchDisplay}
      />
    )
  },
}

export const MultipleDisabled: Story = {
  args: {
    label: 'Assigned Teams',
    choiceLabels: ['Engineering', 'Design', 'Marketing', 'Sales'],
    choiceValues: ['eng', 'design', 'marketing', 'sales'],
    disabled: true,
  },
  render: (args) => (
    <MultipleDropdownField
      label={args.label}
      choiceLabels={args.choiceLabels ?? []}
      choiceValues={args.choiceValues ?? []}
      value={['eng', 'design']}
      disabled={args.disabled}
    />
  ),
}

export const MultipleAdjacentLabel: Story = {
  args: {
    label: 'Categories',
    labelPosition: 'ADJACENT',
    choiceLabels: ['Technology', 'Business', 'Science', 'Arts'],
    choiceValues: ['tech', 'biz', 'sci', 'arts'],
  },
  render: (args) => {
    const [value, setValue] = useState<string[]>(['tech'])
    return (
      <MultipleDropdownField
        label={args.label}
        labelPosition={args.labelPosition}
        choiceLabels={args.choiceLabels ?? []}
        choiceValues={args.choiceValues ?? []}
        value={value}
        saveInto={(v) => setValue(v || [])}
      />
    )
  },
}
