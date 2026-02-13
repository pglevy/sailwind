import type { Meta, StoryObj } from '@storybook/react-vite'
import ApplicationHeaderDemo from '../../pages/ApplicationHeaderDemo'

const meta = {
  title: 'Pages/Application Header Demo',
  component: ApplicationHeaderDemo,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof ApplicationHeaderDemo>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
