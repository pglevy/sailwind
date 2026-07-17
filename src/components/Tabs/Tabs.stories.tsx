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
  argTypes: {
    variant: { control: 'select', options: ['UNDERLINE', 'PILL'] },
    size: { control: 'select', options: ['SMALL', 'STANDARD', 'MEDIUM', 'LARGE'] },
    density: { control: 'select', options: ['STANDARD', 'DENSE'] },
    color: { control: 'text' },
    orientation: { control: 'select', options: ['HORIZONTAL', 'VERTICAL'] },
    align: { control: 'select', options: ['START', 'CENTER', 'END'] },
    contentsPadding: { control: 'select', options: ['NONE', 'EVEN_LESS', 'LESS', 'STANDARD', 'MORE', 'EVEN_MORE'] },
    activationMode: { control: 'select', options: ['AUTOMATIC', 'MANUAL'] },
    navigationOnly: { control: 'boolean' },
    fullWidthSeparator: { control: 'boolean' },
  },
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

export const NavigationOnly: Story = {
  name: 'Navigation Only (No Content Panels)',
  args: {
    tabs: simpleTabs,
    defaultValue: 'tab1',
  },
  render: () => {
    const [activeTab, setActiveTab] = useState('dashboard')

    const navTabs: TabItem[] = [
      { value: 'dashboard', label: 'Dashboard' },
      { value: 'reports', label: 'Reports' },
      { value: 'settings', label: 'Settings' },
      { value: 'help', label: 'Help' },
    ]

    return (
      <div style={{ width: 480 }}>
        <TabsField
          tabs={navTabs}
          value={activeTab}
          onValueChange={setActiveTab}
          navigationOnly
          size="STANDARD"
          color="ACCENT"
        />
        <div className="mt-4 p-4 border border-gray-200 rounded-md">
          <p className="text-base text-gray-700">
            Active route: <strong>{activeTab}</strong>
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Content is rendered externally — no content panels in the tab component.
          </p>
        </div>
      </div>
    )
  },
}

export const NavigationOnlyVertical: Story = {
  name: 'Navigation Only — Vertical Sidebar',
  args: {
    tabs: simpleTabs,
    defaultValue: 'tab1',
  },
  render: () => {
    const [activeTab, setActiveTab] = useState('inbox')

    const navTabs: TabItem[] = [
      { value: 'inbox', label: 'Inbox' },
      { value: 'drafts', label: 'Drafts' },
      { value: 'sent', label: 'Sent' },
      { value: 'archive', label: 'Archive' },
      { value: 'trash', label: 'Trash' },
    ]

    return (
      <div className="flex gap-4" style={{ width: 480 }}>
        <TabsField
          tabs={navTabs}
          value={activeTab}
          onValueChange={setActiveTab}
          navigationOnly
          orientation="VERTICAL"
          align="START"
          size="STANDARD"
          color="ACCENT"
        />
        <div className="flex-1 p-4 border border-gray-200 rounded-md">
          <p className="text-base text-gray-700">
            Viewing: <strong>{activeTab}</strong>
          </p>
        </div>
      </div>
    )
  },
}

export const DensityComparison: Story = {
  name: 'Density — STANDARD vs DENSE',
  args: {
    tabs: simpleTabs,
    defaultValue: 'tab1',
  },
  render: () => {
    const tabs: TabItem[] = [
      { value: 'one', label: 'First Tab', content: <p className="text-base text-gray-700">Content for first tab.</p> },
      { value: 'two', label: 'Second Tab', content: <p className="text-base text-gray-700">Content for second tab.</p> },
      { value: 'three', label: 'Third Tab', content: <p className="text-base text-gray-700">Content for third tab.</p> },
    ]

    return (
      <div className="space-y-8" style={{ width: 480 }}>
        <div>
          <p className="text-xs text-gray-500 mb-2 uppercase tracking-wide">Density: STANDARD (default)</p>
          <TabsField tabs={tabs} defaultValue="one" density="STANDARD" />
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-2 uppercase tracking-wide">Density: DENSE</p>
          <TabsField tabs={tabs} defaultValue="one" density="DENSE" />
        </div>
      </div>
    )
  },
}

export const FullWidthSeparator: Story = {
  name: 'Full-Width Separator',
  args: {
    tabs: simpleTabs,
    defaultValue: 'tab1',
  },
  render: () => {
    const tabs: TabItem[] = [
      { value: 'overview', label: 'Overview', content: <p className="text-base text-gray-700">Overview content here.</p> },
      { value: 'details', label: 'Details', content: <p className="text-base text-gray-700">Details content here.</p> },
      { value: 'history', label: 'History', content: <p className="text-base text-gray-700">History content here.</p> },
    ]

    return (
      <div className="border border-gray-200 rounded-md p-6" style={{ width: 600 }}>
        <HeadingField text="Record Detail" size="MEDIUM" marginBelow="STANDARD" />
        <TabsField
          tabs={tabs}
          defaultValue="overview"
          fullWidthSeparator
          size="STANDARD"
          color="ACCENT"
        />
      </div>
    )
  },
}

export const LightBackground: Story = {
  name: 'Light Background (Non-White)',
  args: {
    tabs: simpleTabs,
    defaultValue: 'tab1',
  },
  render: () => {
    const tabs: TabItem[] = [
      { value: 'overview', label: 'Overview', content: <p className="text-gray-700">Overview content on light bg.</p> },
      { value: 'details', label: 'Details', content: <p className="text-gray-700">Details content on light bg.</p> },
      { value: 'history', label: 'History', content: <p className="text-gray-700">History content on light bg.</p> },
    ]

    return (
      <div className="bg-gray-100 text-gray-800 p-6 rounded-md" style={{ width: 480 }}>
        <TabsField
          tabs={tabs}
          defaultValue="overview"
          size="STANDARD"
          color="ACCENT"
        />
      </div>
    )
  },
}

export const DarkBackground: Story = {
  name: 'Dark Background (Auto Separator)',
  args: {
    tabs: simpleTabs,
    defaultValue: 'tab1',
  },
  render: () => {
    const tabs: TabItem[] = [
      { value: 'overview', label: 'Overview', content: <p className="text-gray-200">Overview content on dark.</p> },
      { value: 'details', label: 'Details', content: <p className="text-gray-200">Details content on dark.</p> },
      { value: 'history', label: 'History', content: <p className="text-gray-200">History content on dark.</p> },
    ]

    return (
      <div className="bg-gray-900 text-white p-6 rounded-md" style={{ width: 480 }}>
        <TabsField
          tabs={tabs}
          defaultValue="overview"
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

export const Pill: Story = {
  args: {
    tabs: [
      { value: 'summary', label: 'Summary', content: <p className="text-base text-gray-700">Summary view content.</p> },
      { value: 'details', label: 'Details', content: <p className="text-base text-gray-700">Details view content.</p> },
      { value: 'activity', label: 'Activity', content: <p className="text-base text-gray-700">Activity view content.</p> },
      { value: 'documents', label: 'Documents', content: <p className="text-base text-gray-700">Documents view content.</p> },
      { value: 'history', label: 'History', content: <p className="text-base text-gray-700">History view content.</p> },
    ],
    defaultValue: 'summary',
    variant: 'PILL',
    size: 'SMALL',
  },
}

export const PillCustomColor: Story = {
  args: {
    tabs: [
      { value: 'tab1', label: 'Tab One', content: <p className="text-base text-gray-700">Custom color pill tab.</p> },
      { value: 'tab2', label: 'Tab Two', content: <p className="text-base text-gray-700">Custom color pill tab.</p> },
    ],
    defaultValue: 'tab1',
    variant: 'PILL',
    size: 'SMALL',
    color: '#9333EA',
  },
}
