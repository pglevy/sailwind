import { useState } from 'react'
import { TabsField, HeadingField, TagField, ButtonArrayLayout, TextField } from '../components'
import type { TabItem } from '../components/Tabs/TabsField'

export const TabsDemo = () => {
  const [activeTab, setActiveTab] = useState<string>('account')
  const [verticalTab, setVerticalTab] = useState<string>('profile')
  const [name, setName] = useState('Pedro Duarte')
  const [username, setUsername] = useState('@peduarte')

  // Basic horizontal tabs
  const basicTabs: TabItem[] = [
    {
      value: 'account',
      label: 'Account',
      content: (
        <div className="space-y-4">
          <p className="text-base text-gray-700">
            Make changes to your account here. Click save when you're done.
          </p>
          <div className="space-y-4">
            <TextField
              label="Name"
              value={name}
              saveInto={setName}
            />
            <TextField
              label="Username"
              value={username}
              saveInto={setUsername}
            />
            <ButtonArrayLayout
              buttons={[
                { label: "Save changes", style: "SOLID", color: "ACCENT" }
              ]}
              align="END"
            />
          </div>
        </div>
      )
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
            <TextField
              label="Current password"
              masked={true}
            />
            <TextField
              label="New password"
              masked={true}
            />
            <TextField
              label="Confirm password"
              masked={true}
            />
            <ButtonArrayLayout
              buttons={[
                { label: "Change password", style: "SOLID", color: "ACCENT" }
              ]}
              align="END"
            />
          </div>
        </div>
      )
    },
    {
      value: 'notifications',
      label: 'Notifications',
      content: (
        <div className="space-y-4">
          <p className="text-base text-gray-700">
            Configure your notification preferences.
          </p>
          <div className="space-y-2">
            <p className="text-sm text-gray-600">Email notifications enabled</p>
            <p className="text-sm text-gray-600">Push notifications disabled</p>
            <p className="text-sm text-gray-600">SMS notifications disabled</p>
          </div>
        </div>
      )
    }
  ]

  // Vertical tabs
  const verticalTabs: TabItem[] = [
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
      )
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
      )
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
      )
    }
  ]

  // Color variations
  const colorTabs: TabItem[] = [
    {
      value: 'success',
      label: 'Success',
      content: <p className="text-base text-gray-700">Success content with positive color scheme.</p>
    },
    {
      value: 'warning',
      label: 'Warning',
      content: <p className="text-base text-gray-700">Warning content with negative color scheme.</p>
    },
    {
      value: 'info',
      label: 'Info',
      content: <p className="text-base text-gray-700">Info content with secondary color scheme.</p>
    }
  ]

  return (
    <div className="space-y-8">
      {/* Basic Horizontal Tabs */}
      <div>
        <HeadingField
          text="Basic Horizontal Tabs"
          size="MEDIUM"
          marginBelow="LESS"
        />
        <TagField
          tags={[{ text: "NEW SAIL", backgroundColor: "purple-500", textColor: "white" }]}
          size="SMALL"
          marginBelow="STANDARD"
        />
        <TabsField
          tabs={basicTabs}
          value={activeTab}
          onValueChange={setActiveTab}
          size="STANDARD"
          color="ACCENT"
        />
      </div>

      {/* Vertical Tabs */}
      <div>
        <HeadingField
          text="Vertical Tabs"
          size="MEDIUM"
          marginBelow="LESS"
        />
        <TabsField
          tabs={verticalTabs}
          value={verticalTab}
          onValueChange={setVerticalTab}
          orientation="VERTICAL"
          size="STANDARD"
          color="ACCENT"
        />
      </div>

      {/* Different Sizes */}
      <div>
        <HeadingField
          text="Size Variations"
          size="MEDIUM"
          marginBelow="LESS"
        />
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 mb-2">Small</p>
            <TabsField
              tabs={[
                { value: 'tab1', label: 'Tab 1', content: <p>Small tab content</p> },
                { value: 'tab2', label: 'Tab 2', content: <p>Small tab content</p> }
              ]}
              defaultValue="tab1"
              size="SMALL"
            />
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-2">Large</p>
            <TabsField
              tabs={[
                { value: 'tab1', label: 'Tab 1', content: <p>Large tab content</p> },
                { value: 'tab2', label: 'Tab 2', content: <p>Large tab content</p> }
              ]}
              defaultValue="tab1"
              size="LARGE"
            />
          </div>
        </div>
      </div>

      {/* Color Variations */}
      <div>
        <HeadingField
          text="Color Variations"
          size="MEDIUM"
          marginBelow="LESS"
        />
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 mb-2">Positive (Green)</p>
            <TabsField
              tabs={colorTabs}
              defaultValue="success"
              color="POSITIVE"
            />
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-2">Negative (Red)</p>
            <TabsField
              tabs={colorTabs}
              defaultValue="warning"
              color="NEGATIVE"
            />
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-2">Custom Hex Color</p>
            <TabsField
              tabs={colorTabs}
              defaultValue="info"
              color="#9333EA"
            />
          </div>
        </div>
      </div>

      {/* Manual Activation */}
      <div>
        <HeadingField
          text="Manual Activation Mode"
          size="MEDIUM"
          marginBelow="LESS"
        />
        <p className="text-sm text-gray-600 mb-2">
          Tabs require click to activate (not just focus)
        </p>
        <TabsField
          tabs={[
            { value: 'manual1', label: 'Manual 1', content: <p>Manual activation tab 1</p> },
            { value: 'manual2', label: 'Manual 2', content: <p>Manual activation tab 2</p> },
            { value: 'manual3', label: 'Manual 3', content: <p>Manual activation tab 3</p> }
          ]}
          defaultValue="manual1"
          activationMode="MANUAL"
        />
      </div>

      {/* Usage Example */}
      <div className="bg-gray-50 p-4 rounded-sm">
        <HeadingField
          text="Usage Example"
          size="MEDIUM"
          marginBelow="LESS"
        />
        <pre className="text-sm text-gray-800 overflow-x-auto">
{`<TabsField
  tabs={[
    {
      value: 'account',
      label: 'Account',
      content: <div>Account settings content</div>
    },
    {
      value: 'password',
      label: 'Password',
      content: <div>Password settings content</div>
    }
  ]}
  value={activeTab}
  onValueChange={setActiveTab}
  orientation="HORIZONTAL"
  size="STANDARD"
  color="ACCENT"
/>`}
        </pre>
      </div>
    </div>
  )
}
