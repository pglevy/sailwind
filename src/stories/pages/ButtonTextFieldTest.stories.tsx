import type { Meta, StoryObj } from '@storybook/react-vite'
import ButtonTextFieldTest from '../../pages/ButtonTextFieldTest'

const meta = {
  title: 'Pages/Button TextField Test',
  component: ButtonTextFieldTest,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof ButtonTextFieldTest>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
