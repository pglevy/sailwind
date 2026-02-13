import type { Meta, StoryObj } from '@storybook/react-vite'
import { UserProfile } from '../../pages/patterns/UserProfile'

const meta = {
  title: 'Patterns/User Profile',
  component: UserProfile,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof UserProfile>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
