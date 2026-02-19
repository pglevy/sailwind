import type { Meta, StoryObj } from '@storybook/react-vite'
import { SideNavAdmin } from './SideNavAdmin'

const meta = {
  title: 'Components/SideNavAdmin',
  component: SideNavAdmin,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof SideNavAdmin>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    activeItem: 'Branding',
    onItemClick: (label: string) => console.log('Clicked:', label),
  },
}


