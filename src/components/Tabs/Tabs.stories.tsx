import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { TabsField } from './TabsField'
import type { TabItem } from './TabsField'
import { TextField } from '../TextField/TextField'
import { ButtonArrayLayout } from '../Button/ButtonArrayLayout'
import { HeadingField } from '../Heading/HeadingField'

const meta = {
  title: 'Components/Tabs',
  component: TabsField,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof TabsField>

export default meta
type Story = StoryObj<typeof meta>

const simpleTabs: TabItem[] = [
  {
    value: 'tab1',
    label: 'Account',
    content: <p className="text-base text-gray-700">Make changes to your account here.</p>,
  },
  {
    value: 'tab2',
    label: 'Password',
    content: <p className="text-base text-gray-700">Change your password here.</p>,
  },
  {
    value: 'tab3',
    label: 'Notifications',
    content: <p className="text-base text-gray-700">Configure your notification preferences.</p>,
  },
]

export const Default: Story = {
  args: {
    tabs: simpleTabs,
    defaultValue: 'tab1',
    size: 'STANDARD',
    color: 'ACCENT',
  },
}

export const BasicHorizontalWithContent: Story = {
  args: {
    tabs: simpleTabs,
    defaultValue: 'tab1',
  },
  render: () => {
    const [activeTab, setActiveTab] = useState('account')
    const [name, setName] = useState('Pedro Duarte')
    const [username, setUsername] = useState('@peduarte')

    const tabs: TabItem[] = [
      {
        value: 'account',
        label: 'Account',
        content: (
          <div className="space-y-4">
            <p className="text-base text-gray-700">
              Make changes to your account here. Click save when you're done.
            </p>
            <div className="space-y-4">
              <TextField label="Name" value={name} saveInto={setName} />
              <TextField label="Username" value={username} saveInto={setUsername} />
              <ButtonArrayLayout
                buttons={[{ label: 'Save changes', style: 'SOLID', color: 'ACCENT' }]}
                align="END"
              />
            </div>
          </div>
        ),
      },
      {
        value: 'password',
        label: 'Password',
        content: (
          <div className="space-y-4">
            <p className="text-base text-gray-700">
              Change your password here. After saving, you'll be logged out.
            </p>
            <div className="space-y-4">
              <TextField label="Current password" masked={true} />
              <TextField label="New password" masked={true} />
              <TextField label="Confirm password" masked={true} />
              <ButtonArrayLayout
                buttons={[{ label: 'Change password', style: 'SOLID', color: 'ACCENT' }]}
                align="END"
              />
            </div>
          </div>
        ),
      },
      {
        value: 'notifications',
        label: 'Notifications',
        content: (
          <div className="space-y-4">
            <p className="text-base text-gray-700">Configure your notification preferences.</p>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Email notifications enabled</p>
              <p className="text-sm text-gray-600">Push notifications disabled</p>
              <p className="text-sm text-gray-600">SMS notifications disabled</p>
            </div>
          </div>
        ),
      },
    ]

    return (
      <div style={{ width: 480 }}>
        <TabsField
          tabs={tabs}
          value={activeTab}
          onValueChange={setActiveTab}
          size="STANDARD"
          color="ACCENT"
        />
      </div>
    )
  },
}

export const VerticalOrientation: Story = {
  args: {
    tabs: simpleTabs,
    defaultValue: 'tab1',
  },
  render: () => {
    const [activeTab, setActiveTab] = useState('profile')

    const tabs: TabItem[] = [
      {
        value: 'profile',
        label: 'Profile',
        content: (
          <div>
            <HeadingField text="Profile Settings" size="MEDIUM" marginBelow="LESS" />
            <p className="text-base text-gray-700">
              Manage your profile information and preferences.
            </p>
          </div>
        ),
      },
      {
        value: 'security',
        label: 'Security',
        content: (
          <div>
            <HeadingField text="Security Settings" size="MEDIUM" marginBelow="LESS" />
            <p className="text-base text-gray-700">
              Configure security settings and two-factor authentication.
            </p>
          </div>
        ),
      },
      {
        value: 'billing',
        label: 'Billing',
        disabled: true,
        content: (
          <div>
            <HeadingField text="Billing Information" size="MEDIUM" marginBelow="LESS" />
            <p className="text-base text-gray-700">
              Manage your billing information and subscription.
            </p>
          </div>
        ),
      },
    ]

    return (
      <div style={{ width: 480 }}>
        <TabsField
          tabs={tabs}
          value={activeTab}
          onValueChange={setActiveTab}
          orientation="VERTICAL"
          size="STANDARD"
          color="ACCENT"
        />
      </div>
    )
  },
}

export const SizeSmall: Story = {
  args: {
    tabs: [
      { value: 'tab1', label: 'Tab 1', content: <p>Small tab content</p> },
      { value: 'tab2', label: 'Tab 2', content: <p>Small tab content</p> },
    ],
    defaultValue: 'tab1',
    size: 'SMALL',
  },
}

export const SizeLarge: Story = {
  args: {
    tabs: [
      { value: 'tab1', label: 'Tab 1', content: <p>Large tab content</p> },
      { value: 'tab2', label: 'Tab 2', content: <p>Large tab content</p> },
    ],
    defaultValue: 'tab1',
    size: 'LARGE',
  },
}

export const ColorPositive: Story = {
  args: {
    tabs: [
      { value: 'success', label: 'Success', content: <p className="text-base text-gray-700">Success content with positive color scheme.</p> },
      { value: 'warning', label: 'Warning', content: <p className="text-base text-gray-700">Warning content with negative color scheme.</p> },
      { value: 'info', label: 'Info', content: <p className="text-base text-gray-700">Info content with secondary color scheme.</p> },
    ],
    defaultValue: 'success',
    color: 'POSITIVE',
  },
}

export const ColorNegative: Story = {
  args: {
    tabs: [
      { value: 'success', label: 'Success', content: <p className="text-base text-gray-700">Success content with positive color scheme.</p> },
      { value: 'warning', label: 'Warning', content: <p className="text-base text-gray-700">Warning content with negative color scheme.</p> },
      { value: 'info', label: 'Info', content: <p className="text-base text-gray-700">Info content with secondary color scheme.</p> },
    ],
    defaultValue: 'warning',
    color: 'NEGATIVE',
  },
}

export const ColorCustomHex: Story = {
  args: {
    tabs: [
      { value: 'success', label: 'Success', content: <p className="text-base text-gray-700">Success content with custom hex color.</p> },
      { value: 'warning', label: 'Warning', content: <p className="text-base text-gray-700">Warning content with custom hex color.</p> },
      { value: 'info', label: 'Info', content: <p className="text-base text-gray-700">Info content with custom hex color.</p> },
    ],
    defaultValue: 'info',
    color: '#9333EA',
  },
}

export const ManualActivation: Story = {
  args: {
    tabs: [
      { value: 'manual1', label: 'Manual 1', content: <p>Manual activation tab 1</p> },
      { value: 'manual2', label: 'Manual 2', content: <p>Manual activation tab 2</p> },
      { value: 'manual3', label: 'Manual 3', content: <p>Manual activation tab 3</p> },
    ],
    defaultValue: 'manual1',
    activationMode: 'MANUAL',
  },
}
