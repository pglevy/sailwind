import type { Meta, StoryObj } from '@storybook/react-vite'
import ESGConferenceRegistration from '../../pages/ESGConferenceRegistration'

const meta = {
  title: 'Pages/ESG Conference Registration',
  component: ESGConferenceRegistration,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof ESGConferenceRegistration>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
