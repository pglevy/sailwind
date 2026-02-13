import type { Meta, StoryObj } from '@storybook/react-vite'
import { TaskDashboard } from '../../pages/patterns/TaskDashboard'

const meta = {
  title: 'Patterns/Task Dashboard',
  component: TaskDashboard,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof TaskDashboard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
