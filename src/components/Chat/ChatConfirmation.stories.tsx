import type { Meta, StoryObj } from '@storybook/react-vite'
import { ChatConfirmation } from './ChatConfirmation'

const meta = {
  title: 'Components/Chat/ChatConfirmation',
  component: ChatConfirmation,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      <div style={{ width: 500 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ChatConfirmation>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    message: "Next, I'll create the document record type for handling file attachments. Should I proceed with this task?",
    primaryAction: {
      label: 'Yes, continue',
      onClick: () => console.log('Confirmed'),
    },
  },
}

export const WithSecondaryAction: Story = {
  args: {
    message: 'This action will modify your database schema. Are you sure you want to proceed?',
    primaryAction: {
      label: 'Yes, proceed',
      onClick: () => console.log('Confirmed'),
    },
    secondaryAction: {
      label: 'No, cancel',
      onClick: () => console.log('Cancelled'),
    },
  },
}

export const LongMessage: Story = {
  args: {
    message: "I've analyzed your codebase and identified several potential improvements. This includes refactoring the authentication system, updating dependencies, optimizing database queries, and implementing better error handling. Would you like me to proceed with these changes?",
    primaryAction: {
      label: 'Yes, continue',
      onClick: () => console.log('Confirmed'),
    },
    secondaryAction: {
      label: 'No, skip this',
      onClick: () => console.log('Cancelled'),
    },
  },
}

export const Completed: Story = {
  args: {
    message: "Next, I'll create the document record type for handling file attachments. Should I proceed with this task?",
    primaryAction: {
      label: 'Yes, continue',
      onClick: () => console.log('Confirmed'),
    },
    completed: true,
  },
}
