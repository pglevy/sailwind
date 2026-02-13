import type { Meta, StoryObj } from '@storybook/react-vite'
import InsuranceQuoteWizard from '../../pages/InsuranceQuoteWizard'

const meta = {
  title: 'Pages/Insurance Quote Wizard',
  component: InsuranceQuoteWizard,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof InsuranceQuoteWizard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
