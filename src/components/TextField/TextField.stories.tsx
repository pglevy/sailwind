import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'
import { TextField } from './TextField'

const meta = {
  title: 'Components/TextField',
  component: TextField,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      <div style={{ width: 400 }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    labelPosition: { control: 'select', options: ['ABOVE', 'ADJACENT', 'COLLAPSED', 'JUSTIFIED'] },
    align: { control: 'select', options: ['LEFT', 'CENTER', 'RIGHT'] },
  },
} satisfies Meta<typeof TextField>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: 'Email Address',
    placeholder: 'user@example.com',
    required: true,
  },
  render: (args) => {
    const [value, setValue] = useState(args.value ?? '')
    return <TextField {...args} value={value} saveInto={setValue} />
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByLabelText(/email address/i)
    await expect(input).toBeVisible()
    await userEvent.click(input)
    await userEvent.type(input, 'test@example.com')
    await expect(input).toHaveValue('test@example.com')
  },
}

export const WithCharacterLimit: Story = {
  args: {
    label: 'Phone Number',
    instructions: 'Include only dashes and numbers. For example, 555-456-7890.',
    value: '555-456-7890-876',
    characterLimit: 12,
    showCharacterCount: true,
  },
  render: (args) => {
    const [value, setValue] = useState(args.value ?? '')
    return <TextField {...args} value={value} saveInto={setValue} />
  },
}

export const Masked: Story = {
  args: {
    label: 'Password',
    masked: true,
    placeholder: 'Enter password',
    required: true,
  },
  render: (args) => {
    const [value, setValue] = useState(args.value ?? '')
    return <TextField {...args} value={value} saveInto={setValue} />
  },
}

export const ReadOnly: Story = {
  args: {
    label: 'Title',
    value: 'Expenses could not be submitted',
    readOnly: true,
  },
}

export const AdjacentLabel: Story = {
  args: {
    label: 'First Name',
    labelPosition: 'ADJACENT',
    value: 'John',
  },
  render: (args) => {
    const [value, setValue] = useState(args.value ?? '')
    return <TextField {...args} value={value} saveInto={setValue} />
  },
}

export const RightAligned: Story = {
  args: {
    label: 'Amount',
    value: '$1,234.56',
    align: 'RIGHT',
    readOnly: true,
  },
}

export const WithHelpTooltip: Story = {
  args: {
    label: 'Username',
    instructions: 'Choose a unique username for your account',
    helpTooltip:
      'Your username must be 3-20 characters long and contain only letters, numbers, and underscores',
    placeholder: 'username',
  },
  render: (args) => {
    const [value, setValue] = useState(args.value ?? '')
    return <TextField {...args} value={value} saveInto={setValue} />
  },
}

export const WithValidationError: Story = {
  args: {
    label: 'Email Address',
    placeholder: 'user@example.com',
    value: 'invalid-email',
    required: true,
  },
  render: (args) => {
    const [email, setEmail] = useState(args.value ?? '')
    const validations = email && !email.includes('@')
      ? ['Please enter a valid email address']
      : []

    return (
      <TextField
        {...args}
        value={email}
        saveInto={setEmail}
        validations={validations}
      />
    )
  },
}
