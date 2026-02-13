import type { Meta, StoryObj } from '@storybook/react-vite'
import { MessageBanner } from './MessageBanner'

const meta = {
  title: 'Components/MessageBanner',
  component: MessageBanner,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      <div style={{ width: 500 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof MessageBanner>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    primaryText: 'Information',
    secondaryText: 'This is an informational message with default INFO styling.',
    backgroundColor: 'INFO',
    highlightColor: 'INFO',
    icon: 'info',
  },
}

export const Success: Story = {
  args: {
    primaryText: 'Success!',
    secondaryText: 'Your changes have been saved successfully.',
    backgroundColor: 'SUCCESS',
    highlightColor: 'POSITIVE',
    icon: 'success',
  },
}

export const Warning: Story = {
  args: {
    primaryText: 'Warning',
    secondaryText: 'Please review your input before proceeding.',
    backgroundColor: 'WARN',
    highlightColor: 'WARN',
    icon: 'warning',
  },
}

export const Error: Story = {
  args: {
    primaryText: 'Error',
    secondaryText: 'An error occurred while processing your request.',
    backgroundColor: 'ERROR',
    highlightColor: 'NEGATIVE',
    icon: 'error',
  },
}

export const PredefinedStyles: Story = {
  args: { primaryText: '' },
  render: () => (
    <div className="space-y-3">
      <MessageBanner
        primaryText="Information"
        secondaryText="This is an informational message with default INFO styling."
        backgroundColor="INFO"
        highlightColor="INFO"
        icon="info"
      />
      <MessageBanner
        primaryText="Success!"
        secondaryText="Your changes have been saved successfully."
        backgroundColor="SUCCESS"
        highlightColor="POSITIVE"
        icon="success"
      />
      <MessageBanner
        primaryText="Warning"
        secondaryText="Please review your input before proceeding."
        backgroundColor="WARN"
        highlightColor="WARN"
        icon="warning"
      />
      <MessageBanner
        primaryText="Error"
        secondaryText="An error occurred while processing your request."
        backgroundColor="ERROR"
        highlightColor="NEGATIVE"
        icon="error"
      />
    </div>
  ),
}

export const CustomColors: Story = {
  args: {
    primaryText: 'Custom Colors',
    secondaryText: 'This banner uses custom hex colors with transparency.',
    backgroundColor: '#FED7DE80',
    highlightColor: '#9F0019',
    shape: 'ROUNDED',
  },
}

export const NoDecorativeBar: Story = {
  args: {
    primaryText: 'No Decorative Bar',
    secondaryText: 'This banner has the decorative bar disabled.',
    backgroundColor: 'INFO',
    showDecorativeBar: false,
    shape: 'SEMI_ROUNDED',
  },
}

export const Shapes: Story = {
  args: { primaryText: '' },
  render: () => (
    <div className="space-y-4">
      <MessageBanner
        primaryText="Squared Banner"
        secondaryText="This banner has sharp, 90-degree corners"
        backgroundColor="SUCCESS"
        highlightColor="POSITIVE"
        shape="SQUARED"
      />
      <MessageBanner
        primaryText="Semi-Rounded Banner"
        secondaryText="This banner has slightly rounded corners"
        backgroundColor="INFO"
        highlightColor="INFO"
        shape="SEMI_ROUNDED"
      />
      <MessageBanner
        primaryText="Rounded Banner"
        secondaryText="This banner has more rounded corners"
        backgroundColor="WARN"
        highlightColor="WARN"
        shape="ROUNDED"
      />
    </div>
  ),
}

export const MarginSpacing: Story = {
  args: { primaryText: '' },
  render: () => (
    <div className="bg-gray-50 p-4 rounded-sm">
      <MessageBanner
        primaryText="NONE margin below"
        backgroundColor="INFO"
        highlightColor="INFO"
        marginBelow="NONE"
      />
      <MessageBanner
        primaryText="LESS margin below"
        backgroundColor="SUCCESS"
        highlightColor="POSITIVE"
        marginBelow="LESS"
      />
      <MessageBanner
        primaryText="STANDARD margin below"
        backgroundColor="WARN"
        highlightColor="WARN"
        marginBelow="STANDARD"
      />
      <MessageBanner
        primaryText="MORE margin below"
        backgroundColor="ERROR"
        highlightColor="NEGATIVE"
        marginBelow="MORE"
      />
    </div>
  ),
}
