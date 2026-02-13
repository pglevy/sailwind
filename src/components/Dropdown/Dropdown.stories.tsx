import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { DropdownField } from './DropdownField'
import { MultipleDropdownField } from './MultipleDropdownField'

const meta = {
  title: 'Components/Dropdown',
  component: DropdownField,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
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
}

export const MultipleDefault: Story = {
  args: {
    choiceLabels: ['English', 'Spanish', 'French', 'German'],
    choiceValues: ['en_US', 'es_ES', 'fr_FR', 'de_DE'],
  },
  render: () => {
    const [value, setValue] = useState<string[]>(['en_US', 'fr_FR'])
    return (
      <MultipleDropdownField
        label="Language"
        instructions="Which language(s) are you proficient in?"
        choiceLabels={['English', 'Spanish', 'French', 'German']}
        choiceValues={['en_US', 'es_ES', 'fr_FR', 'de_DE']}
        value={value}
        saveInto={(v) => setValue(v || [])}
        searchDisplay="AUTO"
      />
    )
  },
}

export const MultipleNoDefault: Story = {
  args: {
    choiceLabels: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Java'],
    choiceValues: ['js', 'ts', 'react', 'node', 'python', 'java'],
  },
  render: () => {
    const [value, setValue] = useState<string[]>([])
    return (
      <MultipleDropdownField
        label="Skills"
        instructions="Select all applicable skills"
        choiceLabels={['JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Java']}
        choiceValues={['js', 'ts', 'react', 'node', 'python', 'java']}
        value={value}
        saveInto={(v) => setValue(v || [])}
        placeholder="Select skills"
      />
    )
  },
}

export const MultipleWithSearch: Story = {
  args: {
    choiceLabels: [
      'English', 'Arabic', 'Chinese (Simplified)', 'Chinese (Traditional)',
      'Spanish', 'French', 'German', 'Japanese', 'Korean', 'Polish', 'Portuguese', 'Russian',
    ],
    choiceValues: [
      'en_US', 'ar', 'zh_CN', 'zh_HK', 'es_ES', 'fr_FR', 'de_DE', 'ja', 'ko', 'pl', 'pt', 'ru',
    ],
  },
  render: () => {
    const [value, setValue] = useState<string[]>([])
    return (
      <MultipleDropdownField
        label="Language"
        instructions="Select all languages you speak"
        choiceLabels={[
          'English', 'Arabic', 'Chinese (Simplified)', 'Chinese (Traditional)',
          'Spanish', 'French', 'German', 'Japanese', 'Korean', 'Polish', 'Portuguese', 'Russian',
        ]}
        choiceValues={[
          'en_US', 'ar', 'zh_CN', 'zh_HK', 'es_ES', 'fr_FR', 'de_DE', 'ja', 'ko', 'pl', 'pt', 'ru',
        ]}
        value={value}
        saveInto={(v) => setValue(v || [])}
        searchDisplay="AUTO"
      />
    )
  },
}

export const MultipleDisabled: Story = {
  args: {
    choiceLabels: ['Engineering', 'Design', 'Marketing', 'Sales'],
    choiceValues: ['eng', 'design', 'marketing', 'sales'],
  },
  render: () => (
    <MultipleDropdownField
      label="Assigned Teams"
      choiceLabels={['Engineering', 'Design', 'Marketing', 'Sales']}
      choiceValues={['eng', 'design', 'marketing', 'sales']}
      value={['eng', 'design']}
      disabled
    />
  ),
}

export const MultipleAdjacentLabel: Story = {
  args: {
    choiceLabels: ['Technology', 'Business', 'Science', 'Arts'],
    choiceValues: ['tech', 'biz', 'sci', 'arts'],
  },
  render: () => {
    const [value, setValue] = useState<string[]>(['tech'])
    return (
      <MultipleDropdownField
        label="Categories"
        labelPosition="ADJACENT"
        choiceLabels={['Technology', 'Business', 'Science', 'Arts']}
        choiceValues={['tech', 'biz', 'sci', 'arts']}
        value={value}
        saveInto={(v) => setValue(v || [])}
      />
    )
  },
}
