import type { Meta, StoryObj } from '@storybook/react-vite'
import { FormEntry } from '../../pages/patterns/FormEntry'

const meta = {
  title: 'Patterns/Form Entry',
  component: FormEntry,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof FormEntry>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
