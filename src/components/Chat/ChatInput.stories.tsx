import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn, userEvent, within, expect } from 'storybook/test'
import { ChatInput } from './ChatInput'

const meta = {
  title: 'Components/Chat/ChatInput',
  component: ChatInput,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: {
    onSubmit: fn(),
  },
} satisfies Meta<typeof ChatInput>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithPlaceholder: Story = {
  args: {
    placeholder: 'Ask me anything...',
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
  },
}

export const WithUpload: Story = {
  args: {
    showUpload: true,
  },
}

export const TypeAndSubmit: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const textarea = canvas.getByPlaceholderText('Type a message...')
    const sendButton = canvas.getByRole('button')

    await expect(sendButton).toBeDisabled()
    await userEvent.type(textarea, 'Hello, world!')
    await expect(sendButton).toBeEnabled()
    await userEvent.click(sendButton)
    await expect(args.onSubmit).toHaveBeenCalledWith('Hello, world!')
    await expect(textarea).toHaveValue('')
  },
}

export const SubmitWithEnter: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const textarea = canvas.getByPlaceholderText('Type a message...')

    await userEvent.type(textarea, 'Hello!{Enter}')
    await expect(args.onSubmit).toHaveBeenCalledWith('Hello!')
  },
}
