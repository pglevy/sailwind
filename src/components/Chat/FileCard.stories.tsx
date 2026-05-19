import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn, userEvent, within, expect } from 'storybook/test'
import { FileCard } from './FileCard'

const meta = {
  title: 'Components/Chat/FileCard',
  component: FileCard,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof FileCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { fileName: 'document.pdf', fileSize: 1024 * 250 },
}

export const WithRemoveButton: Story = {
  args: { fileName: 'presentation.pdf', fileSize: 1024 * 1024 * 2.5, showRemove: true },
}

export const ImageFile: Story = {
  args: { fileName: 'screenshot.png', fileSize: 1024 * 512 },
}

export const CodeFile: Story = {
  args: { fileName: 'component.tsx', fileSize: 1024 * 45 },
}

export const GenericFile: Story = {
  args: { fileName: 'data.csv', fileSize: 1024 * 1024 * 1.8 },
}

export const LongFileName: Story = {
  args: {
    fileName: 'this-is-a-very-long-filename-that-should-be-truncated-in-the-display.pdf',
    fileSize: 1024 * 500,
    showRemove: true,
    maxWidth: '320px',
  },
}

export const LongFileNameReadOnly: Story = {
  args: {
    fileName: 'another-extremely-long-filename-for-testing-truncation-behavior.tsx',
    fileSize: 1024 * 45,
    showRemove: false,
    maxWidth: '280px',
  },
}

export const MultipleFilesInMessage: Story = {
  render: () => (
    <div className="space-y-2 w-80">
      <FileCard fileName="requirements.pdf" fileSize={1024 * 250} />
      <FileCard fileName="design-mockup.png" fileSize={1024 * 1024 * 2.1} />
      <FileCard fileName="implementation.tsx" fileSize={1024 * 45} />
    </div>
  ),
}

export const MultipleFilesInInput: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2 max-w-md">
      <FileCard fileName="document.pdf" fileSize={1024 * 250} showRemove onRemove={fn()} />
      <FileCard fileName="image.jpg" fileSize={1024 * 512} showRemove onRemove={fn()} />
      <FileCard fileName="code.tsx" fileSize={1024 * 45} showRemove onRemove={fn()} />
    </div>
  ),
}

export const RemoveInteraction: Story = {
  args: { fileName: 'test-file.pdf', fileSize: 1024 * 100, showRemove: true, onRemove: fn() },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const removeButton = canvas.getByRole('button', { name: /remove file/i })
    await expect(removeButton).toBeInTheDocument()
    await userEvent.click(removeButton)
    await expect(args.onRemove).toHaveBeenCalled()
  },
}
