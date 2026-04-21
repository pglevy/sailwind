import type { Meta, StoryObj } from '@storybook/react-vite'
import { ChatUserMessage } from './ChatUserMessage'

const meta = {
  title: 'Components/ChatUserMessage',
  component: ChatUserMessage,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof ChatUserMessage>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    message: 'Can you summarize the latest quarterly report?',
  },
}

export const ShortMessage: Story = {
  args: {
    message: 'Hello!',
  },
}

export const LongMessage: Story = {
  args: {
    message:
      'I need help reviewing the contract terms for the new vendor agreement. Specifically, I want to understand the liability clauses and whether the indemnification language is standard for our industry. Can you walk me through the key sections?',
  },
}

export const MultipleMessages: Story = {
  args: { message: '' },
  render: () => (
    <div className="flex flex-col gap-2 w-full max-w-2xl">
      <ChatUserMessage message="What's the status of the project?" />
      <ChatUserMessage message="Can you pull up the latest report?" />
      <ChatUserMessage message="Thanks, that's exactly what I needed." />
    </div>
  ),
}
