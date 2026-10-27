import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'
import { useState } from 'react'
import { FileUploadField, type FileUploadFieldProps, type FileUploadFile } from './FileUploadField'

const meta = {
  title: 'Components/FileUpload',
  component: FileUploadField,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    dropZoneStyle: { control: 'select', options: ['COMPACT', 'EXPANDED'] },
    buttonDisplay: { control: 'select', options: ['LABEL', 'ICON', 'LABEL_AND_ICON'] },
    buttonStyle: { control: 'select', options: ['OUTLINE', 'GHOST', 'LINK', 'SOLID'] },
    buttonColor: { control: 'select', options: ['SECONDARY', 'ACCENT', 'NEGATIVE'] },
    buttonSize: { control: 'select', options: ['SMALL', 'STANDARD', 'LARGE'] },
    labelPosition: { control: 'select', options: ['ABOVE', 'ADJACENT', 'COLLAPSED', 'JUSTIFIED'] },
  },
  // Keep the selected files in story state so uploads work without a server
  render: function Render(args: FileUploadFieldProps) {
    const [files, setFiles] = useState<FileUploadFile[]>(args.value ?? [])
    return (
      <div className="max-w-xl">
        <FileUploadField {...args} value={files} saveInto={setFiles} />
      </div>
    )
  },
} satisfies Meta<typeof FileUploadField>

export default meta
type Story = StoryObj<typeof meta>

const sampleFiles: FileUploadFile[] = [
  { name: 'loss-runs-2025.pdf', size: 1024 * 340 },
  { name: 'policy-declarations.docx', size: 1024 * 88 },
  { name: 'site-photo.jpg', size: 1024 * 1024 * 2.4 },
]

const makeFile = (name: string, size = 2048) => new File([new Uint8Array(size)], name)

// Simulates dropping files from the desktop onto the drop zone
const dropFiles = (zone: HTMLElement, files: File[]) => {
  const dataTransfer = new DataTransfer()
  files.forEach((file) => dataTransfer.items.add(file))
  zone.dispatchEvent(new DragEvent('drop', { bubbles: true, cancelable: true, dataTransfer }))
}

export const Default: Story = {
  args: {
    label: 'Supporting documents',
    instructions: 'Upload loss runs, policies, or other files.',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const zone = canvas.getByText('Drop or paste files here').parentElement as HTMLElement

    dropFiles(zone, [makeFile('quote.pdf')])
    await expect(await canvas.findByText('quote.pdf')).toBeVisible()

    await userEvent.click(canvas.getByRole('button', { name: 'Remove quote.pdf' }))
    await expect(canvas.queryByText('quote.pdf')).not.toBeInTheDocument()
    await expect(canvas.getByRole('button', { name: 'Upload' })).toHaveFocus()
  },
}

export const Expanded: Story = {
  args: {
    label: 'Supporting documents',
    dropZoneStyle: 'EXPANDED',
    buttonDisplay: 'LABEL_AND_ICON',
  },
}

export const WithFile: Story = {
  args: {
    label: 'Signed application',
    value: [sampleFiles[0]],
  },
}

export const MultipleFiles: Story = {
  args: {
    label: 'Supporting documents',
    value: sampleFiles,
  },
}

export const MaxSelections: Story = {
  args: {
    label: 'Signed application',
    instructions: 'Upload one file. Remove it to upload a different one.',
    maxSelections: 1,
    value: [sampleFiles[0]],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.queryByRole('button', { name: 'Upload' })).not.toBeInTheDocument()
    await userEvent.click(canvas.getByRole('button', { name: `Remove ${sampleFiles[0].name}` }))
    await expect(canvas.getByRole('button', { name: 'Upload' })).toBeVisible()
  },
}

/** Not in SAIL: `allowedExtensions` and `maxFileSize` reject files inline. Try dropping an image or a file over 1 MB. */
export const FileTypeAndSizeLimits: Story = {
  args: {
    label: 'Policy documents',
    instructions: 'PDF or DOCX, up to 1 MB each.',
    allowedExtensions: ['pdf', 'docx'],
    maxFileSize: 1024 * 1024,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const zone = canvas.getByText('Drop or paste files here').parentElement as HTMLElement

    dropFiles(zone, [makeFile('photo.png'), makeFile('large.pdf', 2 * 1024 * 1024)])

    const alert = await canvas.findByRole('alert')
    await expect(alert).toHaveTextContent('photo.png cannot be uploaded. Only PDF or DOCX files are supported.')
    await expect(alert).toHaveTextContent('large.pdf cannot be uploaded. Files must be 1.0 MB or smaller.')
  },
}

export const ValidationError: Story = {
  args: {
    label: 'Supporting documents',
    value: [sampleFiles[2]],
    validations: ['Upload the signed application, not a photo.'],
  },
}

export const Required: Story = {
  args: {
    label: 'Signed application',
    required: true,
    requiredMessage: 'Upload the signed application to continue.',
  },
}

export const Disabled: Story = {
  args: {
    label: 'Supporting documents',
    disabled: true,
    value: sampleFiles.slice(0, 2),
  },
}

export const ButtonStyles: Story = {
  render: () => (
    <div className="flex max-w-xl flex-col">
      <FileUploadField label="OUTLINE, SECONDARY (default)" />
      <FileUploadField label="SOLID, ACCENT" buttonStyle="SOLID" buttonColor="ACCENT" />
      <FileUploadField label="GHOST, ACCENT, STANDARD size" buttonStyle="GHOST" buttonColor="ACCENT" buttonSize="STANDARD" />
      <FileUploadField label="LINK, icon only" buttonStyle="LINK" buttonColor="ACCENT" buttonDisplay="ICON" />
    </div>
  ),
}
