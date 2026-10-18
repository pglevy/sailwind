import type { Meta, StoryObj } from '@storybook/react-vite'
import { FormEntry } from '../../pages/patterns/FormEntry'

const meta = {
  title: 'Patterns/Form Entry',
  component: FormEntry,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof FormEntry>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  // Known a11y failure, exempted until fixed:
  // - color-contrast (Dropdown placeholder text): https://github.com/pglevy/sailwind/issues/185
  parameters: { a11y: { test: 'todo' } },
}
