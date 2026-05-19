import type { Meta, StoryObj } from '@storybook/react-vite'
import { ChatAssistantMessage } from './ChatAssistantMessage'
import { FileCard } from './FileCard'

const meta = {
  title: 'Components/Chat/ChatAssistantMessage',
  component: ChatAssistantMessage,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof ChatAssistantMessage>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    message: 'Here is a summary of the latest quarterly report...',
  },
}

export const ShortMessage: Story = {
  args: {
    message: 'Sure, I can help with that!',
  },
}

export const LongMessage: Story = {
  args: {
    message:
      'The contract includes standard indemnification language in Section 8. The liability cap is set at the total fees paid in the prior 12 months, which is typical for SaaS agreements. The indemnification covers IP infringement and gross negligence. I would recommend reviewing Section 12 for any unusual termination clauses before signing.',
  },
}

export const MultipleMessages: Story = {
  args: { message: '' },
  render: () => (
    <div className="flex flex-col gap-2 w-full max-w-2xl">
      <ChatAssistantMessage message="The project is currently on track for the Q3 deadline." />
      <ChatAssistantMessage message="Here is the latest report as of last Friday." />
      <ChatAssistantMessage message="You're welcome! Let me know if you need anything else." />
    </div>
  ),
}

export const WithFileAttachment: Story = {
  args: { message: '' },
  render: () => (
    <div className="flex flex-col gap-2 w-full max-w-2xl">
      <ChatAssistantMessage message="Here's the report you requested:" />
      <FileCard fileName="quarterly-report.pdf" fileSize={1024 * 250} className="w-fit" />
    </div>
  ),
}
