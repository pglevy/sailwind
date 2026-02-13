import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
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
} satisfies Meta<typeof TextField>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: 'Email Address',
    placeholder: 'user@example.com',
    required: true,
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
}

export const Masked: Story = {
  args: {
    label: 'Password',
    masked: true,
    placeholder: 'Enter password',
    required: true,
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
}

export const WithValidationError: Story = {
  render: () => {
    const [email, setEmail] = useState('invalid-email')
    const validations = email && !email.includes('@')
      ? ['Please enter a valid email address']
      : []

    return (
      <TextField
        label="Email Address"
        placeholder="user@example.com"
        value={email}
        saveInto={setEmail}
        required
        validations={validations}
      />
    )
  },
}
