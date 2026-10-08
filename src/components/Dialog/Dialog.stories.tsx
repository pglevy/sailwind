import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { userEvent, within, expect } from 'storybook/test'
import { DialogField } from './DialogField'
import { ButtonWidget } from '../Button/ButtonWidget'
import { TextField } from '../TextField/TextField'
import { ToggleField } from '../Toggle/ToggleField'

const meta = {
  title: 'Components/Dialog',
  component: DialogField,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    width: { control: 'select', options: ['NARROW', 'MEDIUM', 'MEDIUM_PLUS', 'WIDE', 'FIT'] },
    height: { control: 'select', options: ['AUTO', 'FIT', 'SHORT', 'MEDIUM', 'TALL'] },
    background: { control: 'inline-radio', options: ['STANDARD', 'GLASS'] },
  },
} satisfies Meta<typeof DialogField>

export default meta
type Story = StoryObj<typeof meta>

// Shared button classes matching ButtonWidget styles
const btnBase = 'inline-flex items-center justify-center font-medium rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 cursor-pointer'
const btnSolid = `${btnBase} px-4 py-3 text-base leading-none border border-transparent`
const btnOutline = `${btnBase} px-4 py-3 text-base leading-none border`
const btnSmOutline = `${btnBase} px-3 py-2 text-sm leading-none border`

export const Default: Story = {
  args: {
    trigger: (
      <button className={`${btnSolid} bg-blue-500 text-white hover:bg-blue-700`}>
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
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: /open basic dialog/i }))
    const body = within(document.body)
    await expect(body.getByText('Welcome to Sailwind')).toBeVisible()
    await expect(body.getByText(/basic dialog example/i)).toBeVisible()
    await userEvent.click(body.getByRole('button', { name: /close dialog/i }))
    await expect(body.queryByText('Welcome to Sailwind')).not.toBeInTheDocument()
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
          <button className={`${btnOutline} border-blue-500 text-blue-500 bg-white hover:bg-blue-100`}>
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
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: /edit profile/i }))
    const body = within(document.body)
    await expect(body.getByRole('dialog')).toBeVisible()
    await expect(body.getByLabelText(/full name/i)).toBeVisible()
    await expect(body.getByLabelText(/email address/i)).toBeVisible()
    await userEvent.click(body.getByRole('button', { name: /cancel/i }))
    await expect(body.queryByRole('dialog')).not.toBeInTheDocument()
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
          <button className={`${btnSolid} bg-red-700 text-white hover:bg-red-900`}>
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
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: /delete item/i }))
    const body = within(document.body)
    await expect(body.getByText('Confirm Deletion')).toBeVisible()
    await expect(body.getByText(/cannot be undone/i)).toBeVisible()
    await userEvent.click(body.getByRole('button', { name: /^delete$/i }))
    await expect(body.queryByText('Confirm Deletion')).not.toBeInTheDocument()
  },
}

export const WideDialog: Story = {
  args: {
    trigger: (
      <button className={`${btnSmOutline} border-gray-700 text-gray-700 bg-white hover:bg-gray-100`}>
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
      <button className={`${btnSmOutline} border-gray-700 text-gray-700 bg-white hover:bg-gray-100`}>
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
      <button className={`${btnSmOutline} border-gray-700 text-gray-700 bg-white hover:bg-gray-100`}>
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

/** Decorative backdrop so the blur behind a GLASS dialog is actually visible. */
const GlassBackdrop = () => (
  <div
    aria-hidden="true"
    className="fixed inset-0 -z-10 bg-[linear-gradient(135deg,#2322F0_0%,#B561FF_35%,#E21496_65%,#FFC107_100%)]"
  >
    <div className="absolute left-[12%] top-[18%] h-56 w-56 rounded-full bg-white/30 blur-2xl" />
    <div className="absolute right-[10%] bottom-[12%] h-72 w-72 rounded-full bg-cyan-500/40 blur-2xl" />
    <div className="absolute left-[45%] top-[55%] h-40 w-40 rounded-full bg-yellow-500/50 blur-xl" />
  </div>
)

/**
 * Glassmorphism with an in-dialog switch so you can compare the new translucent
 * surface against the current opaque one without leaving the dialog.
 *
 * Accessibility notes:
 * - The surface stays at 70% white, keeping `gray-900` body text above 6:1 contrast
 *   over any backdrop.
 * - Content you place inside a GLASS dialog should use strong foreground colors
 *   (`text-gray-900`, solid buttons). Muted text such as `text-gray-700` can drop
 *   below 4.5:1 when the backdrop behind the glass is dark.
 * - Glass automatically falls back to an opaque surface for
 *   `prefers-reduced-transparency: reduce` and forced-colors (high contrast) mode.
 * - The switch is a real labeled control (`ToggleField`), so it is reachable by
 *   keyboard and announced as "Glassmorphism, switch".
 */
export const BackgroundToggle: Story = {
  args: {
    children: null,
    title: 'Dialog background',
  },
  render: () => {
    const [open, setOpen] = useState(false)
    const [glass, setGlass] = useState(true)

    return (
      <>
        {open && <GlassBackdrop />}
        <DialogField
          open={open}
          onOpenChange={setOpen}
          background={glass ? 'GLASS' : 'STANDARD'}
          trigger={
            <button className={`${btnOutline} border-blue-500 text-blue-500 bg-white hover:bg-blue-100`}>
              Open Dialog
            </button>
          }
          title="Dialog background"
          description={
            glass
              ? 'New: glassmorphism — translucent surface with a blurred backdrop.'
              : 'Current: opaque white surface with a solid border.'
          }
          width="MEDIUM_PLUS"
          height="FIT"
        >
          <div className="space-y-4">
            <ToggleField
              choiceLabel="Glassmorphism"
              value={glass}
              saveInto={setGlass}
              helpTooltip="Switch between the current opaque dialog and the new glass surface"
              marginBelow="NONE"
            />
            <p className="text-sm text-gray-900">
              Now showing: <strong>{glass ? 'GLASS (new)' : 'STANDARD (current)'}</strong>
            </p>
            <p className="text-sm text-gray-900">
              Glass falls back to an opaque surface when the operating system requests
              reduced transparency or high contrast, so content stays readable.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <ButtonWidget
                label="Close"
                style="SOLID"
                color="SECONDARY"
                saveInto={() => setOpen(false)}
              />
            </div>
          </div>
        </DialogField>
      </>
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const body = within(document.body)
    await userEvent.click(canvas.getByRole('button', { name: /open dialog/i }))
    await expect(body.getByRole('dialog')).toHaveAttribute('data-background', 'glass')
    await userEvent.click(body.getByRole('switch', { name: /glassmorphism/i }))
    await expect(body.getByRole('dialog')).toHaveAttribute('data-background', 'standard')
    await userEvent.click(body.getByRole('switch', { name: /glassmorphism/i }))
    await expect(body.getByRole('dialog')).toHaveAttribute('data-background', 'glass')

    await userEvent.click(body.getByRole('button', { name: 'Close' }))
    await expect(body.queryByRole('dialog')).not.toBeInTheDocument()
  },
}

/**
 * The glass surface on its own, without the switch. Controlled by `open`/`onOpenChange`
 * so the header close button works — a dialog given a hard-coded `open={true}` renders
 * a close button that cannot close anything.
 */
export const GlassDialog: Story = {
  args: {
    children: null,
    title: 'Glass',
  },
  render: () => {
    const [open, setOpen] = useState(false)

    return (
      <>
        {open && <GlassBackdrop />}
        <DialogField
          open={open}
          onOpenChange={setOpen}
          background="GLASS"
          trigger={
            <button className={`${btnOutline} border-blue-500 text-blue-500 bg-white hover:bg-blue-100`}>
              Open Glass Dialog
            </button>
          }
          title="Payment details"
          description="Your card is charged when the order ships."
          width="MEDIUM"
          height="AUTO"
          showCloseButton={true}
        >
          <p className="text-sm text-gray-900">
            A translucent surface over a blurred backdrop, with a soft border and shadow
            to keep the panel edges legible.
          </p>
        </DialogField>
      </>
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const body = within(document.body)

    await userEvent.click(canvas.getByRole('button', { name: /open glass dialog/i }))
    await expect(body.getByRole('dialog')).toHaveAttribute('data-background', 'glass')

    await userEvent.click(body.getByRole('button', { name: /close/i }))
    await expect(body.queryByRole('dialog')).not.toBeInTheDocument()
  },
}
