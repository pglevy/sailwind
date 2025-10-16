import { useState } from 'react'
import { CardLayout, HeadingField, TagField, SwitchField } from '../components'

export default function SwitchDemo() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [darkModeEnabled, setDarkModeEnabled] = useState(false)
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true)

  return (
    <CardLayout
      shape="SEMI_ROUNDED"
      padding="MORE"
      marginBelow="MORE"
      showBorder={true}
      borderColor="#EDEEFA"
      decorativeBarPosition="TOP"
      decorativeBarColor="ACCENT"
    >
      <div className="flex items-center gap-2 mb-4">
        <HeadingField
          text="Switch Component"
          size="LARGE"
          headingTag="H2"
          marginBelow="NONE"
        />
        <TagField
          tags={[{ text: "NEW SAIL", backgroundColor: "#9333EA", textColor: "#FFFFFF" }]}
          size="SMALL"
        />
      </div>
      <p className="text-sm text-gray-700 mb-4">
        Not available in public SAIL - this is a "new SAIL" component following the same patterns and conventions.
      </p>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Basic Switches
          </h3>
          <div className="space-y-4">
            <SwitchField
              label="Enable Notifications"
              instructions="Receive email and push notifications for updates"
              value={notificationsEnabled}
              saveInto={(value) => setNotificationsEnabled(value)}
            />

            <SwitchField
              label="Dark Mode"
              value={darkModeEnabled}
              saveInto={(value) => setDarkModeEnabled(value)}
            />

            <SwitchField
              label="Auto-save"
              instructions="Automatically save changes every 30 seconds"
              value={autoSaveEnabled}
              saveInto={(value) => setAutoSaveEnabled(value)}
              color="POSITIVE"
            />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Size Variations
          </h3>
          <div className="space-y-4">
            <SwitchField
              label="Small Switch"
              value={true}
              size="SMALL"
            />
            <SwitchField
              label="Standard Switch"
              value={true}
              size="STANDARD"
            />
            <SwitchField
              label="Medium Switch"
              value={true}
              size="MEDIUM"
            />
            <SwitchField
              label="Large Switch"
              value={true}
              size="LARGE"
            />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Color Options
          </h3>
          <div className="space-y-4">
            <SwitchField
              label="ACCENT (Blue)"
              value={true}
              color="ACCENT"
            />
            <SwitchField
              label="POSITIVE (Green)"
              value={true}
              color="POSITIVE"
            />
            <SwitchField
              label="NEGATIVE (Red)"
              value={true}
              color="NEGATIVE"
            />
            <SwitchField
              label="Custom Hex Color"
              value={true}
              color="#9333EA"
            />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            States
          </h3>
          <div className="space-y-4">
            <SwitchField
              label="Disabled (Off)"
              value={false}
              disabled
            />
            <SwitchField
              label="Disabled (On)"
              value={true}
              disabled
            />
            <SwitchField
              label="Adjacent Label Position"
              labelPosition="ADJACENT"
              value={true}
            />
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-purple-50 border-2 border-purple-200 rounded-sm">
        <h4 className="text-xs font-semibold text-purple-900 mb-1">
          Imagined SAIL Translation (not real SAIL):
        </h4>
        <pre className="text-xs text-gray-900 overflow-x-auto">
{`a!switchField(
  label: "Enable Notifications",
  instructions: "Receive email and push notifications",
  value: local!notificationsEnabled,
  saveInto: local!notificationsEnabled,
  color: "ACCENT"
)`}
        </pre>
      </div>
    </CardLayout>
  )
}
