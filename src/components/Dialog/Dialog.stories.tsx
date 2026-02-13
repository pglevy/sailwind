import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { DialogField } from './DialogField'
import { ButtonWidget } from '../Button/ButtonWidget'
import { TextField } from '../TextField/TextField'

const meta = {
  title: 'Components/Dialog',
  component: DialogField,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof DialogField>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    trigger: (
      <button className="px-4 py-2.5 text-base bg-blue-500 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
        Open Basic Dialog
      </button>
    ),
    title: 'Welcome to Sailwind',
    description: 'This is a basic dialog example with customizable width and height.',
    width: 'MEDIUM',
    height: 'AUTO',
    children: (
      <p className="text-gray-700">
        This dialog demonstrates the basic functionality with a title, description, and content area.
        The dialog can be closed by clicking the X button, pressing Escape, or clicking outside.
      </p>
    ),
  },
}

export const FormDialog: Story = {
  args: {
    children: null,
    title: 'Edit Profile',
  },
  render: () => {
    const [open, setOpen] = useState(false)
    const [name, setName] = useState('John Doe')
    const [email, setEmail] = useState('john.doe@example.com')

    return (
      <DialogField
        open={open}
        onOpenChange={setOpen}
        trigger={
          <button className="px-4 py-2.5 text-base border-2 border-blue-500 text-blue-500 bg-white rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
            Edit Profile
          </button>
        }
        title="Edit Profile"
        description="Update your profile information below."
        width="MEDIUM_PLUS"
        height="FIT"
      >
        <div className="space-y-4">
          <TextField
            label="Full Name"
            value={name}
            saveInto={(value) => setName(value)}
            required={true}
          />
          <TextField
            label="Email Address"
            value={email}
            saveInto={(value) => setEmail(value)}
            required={true}
          />
          <div className="flex justify-end gap-2 pt-4">
            <ButtonWidget
              label="Cancel"
              style="GHOST"
              color="SECONDARY"
              saveInto={() => setOpen(false)}
            />
            <ButtonWidget
              label="Save Changes"
              style="SOLID"
              color="ACCENT"
              saveInto={() => setOpen(false)}
            />
          </div>
        </div>
      </DialogField>
    )
  },
}

export const ConfirmationDialog: Story = {
  args: {
    children: null,
    title: 'Confirm Deletion',
  },
  render: () => {
    const [open, setOpen] = useState(false)

    return (
      <DialogField
        open={open}
        onOpenChange={setOpen}
        trigger={
          <button className="px-4 py-2.5 text-base bg-red-700 text-white rounded-md hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-500">
            Delete Item
          </button>
        }
        title="Confirm Deletion"
        description="This action cannot be undone."
        width="NARROW"
        height="AUTO"
        closeOnOutsideClick={false}
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            Are you sure you want to delete this item? This action is permanent and cannot be reversed.
          </p>
          <div className="flex justify-end gap-2">
            <ButtonWidget
              label="Cancel"
              style="GHOST"
              color="SECONDARY"
              saveInto={() => setOpen(false)}
            />
            <ButtonWidget
              label="Delete"
              style="SOLID"
              color="NEGATIVE"
              saveInto={() => setOpen(false)}
            />
          </div>
        </div>
      </DialogField>
    )
  },
}

export const WideDialog: Story = {
  args: {
    trigger: (
      <button className="px-3 py-1.5 text-sm border-2 border-gray-700 text-gray-700 bg-white rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500">
        Wide Dialog
      </button>
    ),
    title: 'Wide Dialog',
    width: 'WIDE',
    height: 'MEDIUM',
    children: (
      <p className="text-gray-700">
        This is a wide dialog with medium height. Perfect for displaying detailed content
        or complex forms that need more horizontal space.
      </p>
    ),
  },
}

export const TallDialog: Story = {
  args: {
    trigger: (
      <button className="px-3 py-1.5 text-sm border-2 border-gray-700 text-gray-700 bg-white rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500">
        Tall Dialog
      </button>
    ),
    title: 'Tall Dialog',
    width: 'MEDIUM',
    height: 'TALL',
    children: (
      <div className="space-y-4">
        <p className="text-gray-700">This is a tall dialog with fixed height.</p>
        {Array.from({ length: 20 }, (_, i) => (
          <p key={i} className="text-gray-600">
            Content item {i + 1} - This dialog has a fixed tall height with scrollable content.
          </p>
        ))}
      </div>
    ),
  },
}

export const FullWidthFit: Story = {
  args: {
    trigger: (
      <button className="px-3 py-1.5 text-sm border-2 border-gray-700 text-gray-700 bg-white rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500">
        Full Width (FIT)
      </button>
    ),
    title: 'Full Width Dialog',
    width: 'FIT',
    height: 'AUTO',
    children: (
      <p className="text-gray-700">
        This dialog uses FIT width to take up most of the screen width while still showing some content underneath.
      </p>
    ),
  },
}
