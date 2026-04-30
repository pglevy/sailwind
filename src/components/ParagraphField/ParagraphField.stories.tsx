import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { ParagraphField } from './ParagraphField'

const meta = {
  title: 'Components/ParagraphField',
  component: ParagraphField,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      <div style={{ width: 400 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ParagraphField>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: 'Description',
    placeholder: 'Enter a description...',
    saveInto: fn(),
  },
}

export const WithValue: Story = {
  args: {
    label: 'Comments',
    value: 'This is an existing comment that can be edited.',
    saveInto: fn(),
  },
}

export const Required: Story = {
  args: {
    label: 'Feedback',
    required: true,
    placeholder: 'Please provide your feedback...',
    saveInto: fn(),
  },
}

export const WithValidation: Story = {
  args: {
    label: 'Notes',
    value: 'Too short',
    validations: ['Please enter at least 20 characters'],
    saveInto: fn(),
  },
}

export const WithCharacterLimit: Story = {
  args: {
    label: 'Bio',
    value: 'A short bio about myself.',
    characterLimit: 200,
    placeholder: 'Tell us about yourself...',
    saveInto: fn(),
  },
}

export const Short: Story = {
  args: {
    label: 'Short Field',
    height: 'SHORT',
    placeholder: 'A short paragraph field...',
    saveInto: fn(),
  },
}

export const ExtraTall: Story = {
  args: {
    label: 'Extra Tall Field',
    height: 'EXTRA_TALL',
    placeholder: 'An extra tall paragraph field...',
    saveInto: fn(),
  },
}

export const NarrowWidth: Story = {
  args: {
    label: 'Narrow Field',
    width: 'NARROW',
    placeholder: 'Narrow width...',
    saveInto: fn(),
  },
}

export const ReadOnlyWithLinks: Story = {
  args: {
    label: 'Description',
    value: 'Visit https://docs.appian.com for more information.',
    readOnly: true,
    linkify: true,
  },
}

export const Disabled: Story = {
  args: {
    label: 'Locked Field',
    value: 'This field cannot be edited.',
    disabled: true,
  },
}

export const ReadOnly: Story = {
  args: {
    label: 'Summary',
    value: 'This is a read-only paragraph field displaying content without edit controls.',
    readOnly: true,
  },
}

export const CollapsedLabel: Story = {
  args: {
    label: 'Hidden Label',
    labelPosition: 'COLLAPSED',
    placeholder: 'Label is hidden but accessible...',
    saveInto: fn(),
  },
}
