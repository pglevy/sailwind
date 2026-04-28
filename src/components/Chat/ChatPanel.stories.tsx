import type { Meta, StoryObj } from '@storybook/react-vite'
import { Settings, MoreVertical, X } from 'lucide-react'
import { ChatPanel } from './ChatPanel'
import { ChatInput } from './ChatInput'

const meta = {
  title: 'Components/Chat/ChatPanel',
  component: ChatPanel,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof ChatPanel>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    title: 'Chat',
    children: (
      <div className="space-y-4">
        <div className="bg-blue-50 rounded-md px-4 py-2 ml-auto max-w-[80%] w-fit text-gray-900">Hello!</div>
        <div className="text-gray-900">Hi there! How can I help you today?</div>
      </div>
    ),
    footer: <ChatInput />,
  },
}

export const WithHeaderActions: Story = {
  args: {
    title: 'Chat Assistant',
    headerActions: [
      { icon: <Settings size={18} />, label: 'Settings', onClick: () => console.log('Settings') },
      { icon: <MoreVertical size={18} />, label: 'More options', onClick: () => console.log('More') },
      { icon: <X size={18} />, label: 'Close', onClick: () => console.log('Close') },
    ],
    children: (
      <div className="space-y-4">
        <div className="bg-blue-50 rounded-md px-4 py-2 ml-auto max-w-[80%] w-fit text-gray-900">Hello!</div>
        <div className="text-gray-900">Hi there! How can I help you today?</div>
      </div>
    ),
    footer: <ChatInput placeholder="Ask me anything..." />,
  },
}

export const LongScrollingContent: Story = {
  args: {
    title: 'Long Conversation',
    children: (
      <div className="space-y-4">
        {Array.from({ length: 20 }, (_, i) => (
          <div key={i} className="space-y-4">
            <div className="bg-blue-50 rounded-md px-4 py-2 ml-auto max-w-[80%] w-fit text-gray-900">
              Message {i + 1}: This is a test message
            </div>
            <div className="text-gray-900">
              Response {i + 1}: This is a response to your message with additional content to demonstrate scrolling.
            </div>
          </div>
        ))}
      </div>
    ),
    footer: <ChatInput />,
    height: '600px',
  },
}

export const NoFooter: Story = {
  args: {
    title: 'Read-only Chat',
    children: (
      <div className="space-y-4">
        <div className="bg-blue-50 rounded-md px-4 py-2 ml-auto max-w-[80%] w-fit text-gray-900">Hello!</div>
        <div className="text-gray-900">Hi there! This is a read-only chat view.</div>
      </div>
    ),
  },
}

export const NoHeader: Story = {
  args: {
    children: (
      <div className="space-y-4">
        <div className="bg-blue-50 rounded-md px-4 py-2 ml-auto max-w-[80%] w-fit text-gray-900">Hello!</div>
        <div className="text-gray-900">Hi there! This chat has no header.</div>
      </div>
    ),
    footer: <ChatInput />,
  },
}
