import type { Meta, StoryObj } from '@storybook/react-vite'
import AdminConsoleDemo from '../../pages/AdminConsoleDemo'

const meta = {
  title: 'Pages/Admin Console Demo',
  component: AdminConsoleDemo,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof AdminConsoleDemo>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
