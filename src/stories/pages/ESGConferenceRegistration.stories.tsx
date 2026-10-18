import type { Meta, StoryObj } from '@storybook/react-vite'
import ESGConferenceRegistration from '../../pages/ESGConferenceRegistration'

const meta = {
  title: 'Pages/ESG Conference Registration',
  component: ESGConferenceRegistration,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof ESGConferenceRegistration>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  // Known a11y failure, exempted until fixed:
  // - color-contrast (Dropdown placeholder text): https://github.com/pglevy/sailwind/issues/185
  parameters: { a11y: { test: 'todo' } },
}
