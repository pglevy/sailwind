import type { Meta, StoryObj } from '@storybook/react-vite'
import { CardLayout } from './CardLayout'

const meta = {
  title: 'Components/Card',
  component: CardLayout,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof CardLayout>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    shape: 'SEMI_ROUNDED',
    padding: 'STANDARD',
    showBorder: true,
    borderColor: '#EDEEFA',
    children: (
      <div>
        <h4 className="text-base font-semibold text-gray-900 mb-1">Default Card</h4>
        <p className="text-sm text-gray-700">A standard card with border and semi-rounded corners.</p>
      </div>
    ),
  },
}

export const DecorativeBarTop: Story = {
  args: {
    shape: 'SEMI_ROUNDED',
    padding: 'STANDARD',
    showBorder: true,
    borderColor: '#EDEEFA',
    decorativeBarPosition: 'TOP',
    decorativeBarColor: 'ACCENT',
    children: (
      <div>
        <h4 className="text-base font-semibold text-gray-900 mb-1">Reference Information</h4>
        <p className="text-sm text-gray-700">This card uses a top decorative bar to indicate reference content.</p>
      </div>
    ),
  },
}

export const DecorativeBarStart: Story = {
  args: {
    shape: 'SEMI_ROUNDED',
    padding: 'STANDARD',
    showBorder: true,
    borderColor: '#EDEEFA',
    decorativeBarPosition: 'START',
    decorativeBarColor: 'WARN',
    children: (
      <div>
        <h4 className="text-base font-semibold text-gray-900 mb-1">Warning</h4>
        <p className="text-sm text-gray-700">This card uses a start decorative bar.</p>
      </div>
    ),
  },
}

export const DecorativeBarColors: Story = {
  args: { children: null },
  render: () => (
    <div className="flex flex-col gap-4 w-80">
      <CardLayout shape="SEMI_ROUNDED" padding="STANDARD" showBorder={true} borderColor="#EDEEFA" decorativeBarPosition="TOP" decorativeBarColor="ACCENT">
        <p className="text-sm text-gray-700">Accent bar</p>
      </CardLayout>
      <CardLayout shape="SEMI_ROUNDED" padding="STANDARD" showBorder={true} borderColor="#EDEEFA" decorativeBarPosition="TOP" decorativeBarColor="SUCCESS">
        <p className="text-sm text-gray-700">Success bar</p>
      </CardLayout>
      <CardLayout shape="SEMI_ROUNDED" padding="STANDARD" showBorder={true} borderColor="#EDEEFA" decorativeBarPosition="TOP" decorativeBarColor="WARN">
        <p className="text-sm text-gray-700">Warn bar</p>
      </CardLayout>
      <CardLayout shape="SEMI_ROUNDED" padding="STANDARD" showBorder={true} borderColor="#EDEEFA" decorativeBarPosition="TOP" decorativeBarColor="ERROR">
        <p className="text-sm text-gray-700">Error bar</p>
      </CardLayout>
      <CardLayout shape="SEMI_ROUNDED" padding="STANDARD" showBorder={true} borderColor="#EDEEFA" decorativeBarPosition="TOP" decorativeBarColor="INFO">
        <p className="text-sm text-gray-700">Info bar</p>
      </CardLayout>
    </div>
  ),
}

export const Shapes: Story = {
  args: { children: null },
  render: () => (
    <div className="grid grid-cols-3 gap-4">
      <CardLayout shape="SQUARED" padding="STANDARD" showBorder={true} borderColor="#EDEEFA">
        <h4 className="text-base font-semibold text-gray-900 mb-1">Squared</h4>
        <p className="text-xs text-gray-700">0 radius</p>
      </CardLayout>
      <CardLayout shape="SEMI_ROUNDED" padding="STANDARD" showBorder={true} borderColor="#EDEEFA">
        <h4 className="text-base font-semibold text-gray-900 mb-1">Semi Rounded</h4>
        <p className="text-xs text-gray-700">4px radius</p>
      </CardLayout>
      <CardLayout shape="ROUNDED" padding="STANDARD" showBorder={true} borderColor="#EDEEFA">
        <h4 className="text-base font-semibold text-gray-900 mb-1">Rounded</h4>
        <p className="text-xs text-gray-700">8px radius</p>
      </CardLayout>
    </div>
  ),
}

export const BorderOnly: Story = {
  args: {
    shape: 'SEMI_ROUNDED',
    padding: 'STANDARD',
    showBorder: true,
    showShadow: false,
    borderColor: '#EDEEFA',
    children: (
      <div>
        <h4 className="text-base font-semibold text-gray-900 mb-1">Border Only</h4>
        <p className="text-xs text-gray-700">No shadow</p>
      </div>
    ),
  },
}

export const ShadowOnly: Story = {
  args: {
    shape: 'SEMI_ROUNDED',
    padding: 'STANDARD',
    showBorder: false,
    showShadow: true,
    children: (
      <div>
        <h4 className="text-base font-semibold text-gray-900 mb-1">Shadow Only</h4>
        <p className="text-xs text-gray-700">No border</p>
      </div>
    ),
  },
}

export const BorderAndShadow: Story = {
  args: {
    shape: 'SEMI_ROUNDED',
    padding: 'STANDARD',
    showBorder: true,
    showShadow: true,
    borderColor: '#EDEEFA',
    children: (
      <div>
        <h4 className="text-base font-semibold text-gray-900 mb-1">Border and Shadow</h4>
        <p className="text-xs text-gray-700">Both border and shadow</p>
      </div>
    ),
  },
}

export const CardStyles: Story = {
  args: { children: null },
  render: () => (
    <div className="grid grid-cols-3 gap-4">
      <CardLayout style="ACCENT" padding="STANDARD" showBorder={false}>
        <p className="text-sm font-semibold text-gray-900">Accent</p>
      </CardLayout>
      <CardLayout style="SUCCESS" padding="STANDARD" showBorder={false}>
        <p className="text-sm font-semibold text-gray-900">Success</p>
      </CardLayout>
      <CardLayout style="WARN" padding="STANDARD" showBorder={false}>
        <p className="text-sm font-semibold text-gray-900">Warn</p>
      </CardLayout>
      <CardLayout style="ERROR" padding="STANDARD" showBorder={false}>
        <p className="text-sm font-semibold text-gray-900">Error</p>
      </CardLayout>
      <CardLayout style="INFO" padding="STANDARD" showBorder={false}>
        <p className="text-sm font-semibold text-gray-900">Info</p>
      </CardLayout>
      <CardLayout style="CHARCOAL_SCHEME" padding="STANDARD" showBorder={false}>
        <p className="text-sm font-semibold text-white">Charcoal</p>
      </CardLayout>
    </div>
  ),
}
