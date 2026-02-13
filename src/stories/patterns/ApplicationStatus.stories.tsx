import type { Meta, StoryObj } from '@storybook/react-vite'
import { ApplicationStatus } from '../../pages/patterns/ApplicationStatus'

const meta = {
  title: 'Patterns/Application Status',
  component: ApplicationStatus,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof ApplicationStatus>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
