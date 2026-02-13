import type { Meta, StoryObj } from '@storybook/react-vite'
import { Publications } from '../../pages/patterns/Publications'

const meta = {
  title: 'Patterns/Publications',
  component: Publications,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof Publications>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
