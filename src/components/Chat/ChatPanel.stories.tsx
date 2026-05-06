import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { ChatPanel } from './ChatPanel'
import { ChatInput } from './ChatInput'
import { ChatUserMessage } from './ChatUserMessage'
import { ChatAssistantMessage } from './ChatAssistantMessage'

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
        <ChatUserMessage message="Hello!" />
        <ChatAssistantMessage message="Hi there! How can I help you today?" />
      </div>
    ),
    footer: <ChatInput />,
  },
}

export const WithHeaderActions: Story = {
  args: {
    title: 'Chat Assistant',
    headerActions: [
      { icon: 'settings', label: 'Settings', onClick: () => console.log('Settings') },
      { icon: 'more-vertical', label: 'More options', onClick: () => console.log('More') },
      { icon: 'x', label: 'Close', onClick: () => console.log('Close') },
    ],
    children: (
      <div className="space-y-4">
        <ChatUserMessage message="Hello!" />
        <ChatAssistantMessage message="Hi there! How can I help you today?" />
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
            <ChatUserMessage message={`Message ${i + 1}: This is a test message`} />
            <ChatAssistantMessage message={`Response ${i + 1}: This is a response to your message with additional content to demonstrate scrolling.`} />
          </div>
        ))}
      </div>
    ),
    footer: <ChatInput />,
    height: 'TALL',
  },
}

export const NoFooter: Story = {
  args: {
    title: 'Read-only Chat',
    children: (
      <div className="space-y-4">
        <ChatUserMessage message="Hello!" />
        <ChatAssistantMessage message="Hi there! This is a read-only chat view." />
      </div>
    ),
  },
}

export const NoHeader: Story = {
  args: {
    children: (
      <div className="space-y-4">
        <ChatUserMessage message="Hello!" />
        <ChatAssistantMessage message="Hi there! This chat has no header." />
      </div>
    ),
    footer: <ChatInput />,
  },
}

export const Interactive: Story = {
  render: () => {
    const [messages, setMessages] = React.useState<{ role: 'user' | 'assistant'; text: string }[]>([
      { role: 'assistant', text: 'Hi there! How can I help you today?' },
    ])

    const handleSubmit = (message: string) => {
      setMessages(prev => [
        ...prev,
        { role: 'user', text: message },
        { role: 'assistant', text: 'I received your message. Let me look into that for you.' },
      ])
    }

    return (
      <ChatPanel
        title="Chat"
        footer={<ChatInput onSubmit={handleSubmit} />}
      >
        <div className="space-y-4">
          {messages.map((msg, i) =>
            msg.role === 'user'
              ? <ChatUserMessage key={i} message={msg.text} />
              : <ChatAssistantMessage key={i} message={msg.text} />
          )}
        </div>
      </ChatPanel>
    )
  },
}
