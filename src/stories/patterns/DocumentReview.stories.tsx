import type { Meta, StoryObj } from '@storybook/react-vite'
import { DocumentReview } from '../../pages/patterns/DocumentReview'

const meta = {
  title: 'Patterns/Document Review',
  component: DocumentReview,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof DocumentReview>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
