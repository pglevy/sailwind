# Tabs Component Examples

## Overview

The `TabsField` component displays a set of layered sections of content (tab panels) that are displayed one at a time. This is a "New SAIL" component - not available in public SAIL but follows the same conventions and patterns for consistency with other Sailwind components.

Built using Radix UI Tabs primitive for full accessibility and keyboard navigation support.

## Basic Usage

```tsx
import { TabsField } from './components'

const tabs = [
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
]

<TabsField
  tabs={tabs}
  defaultValue="account"
  size="STANDARD"
  color="ACCENT"
/>
```

## Props Reference

### TabsFieldProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `tabs` | `TabItem[]` | Required | Array of tab configurations |
| `value` | `string` | - | Currently active tab value (controlled) |
| `defaultValue` | `string` | First tab | Default active tab value (uncontrolled) |
| `onValueChange` | `(value: string) => void` | - | Callback when active tab changes |
| `orientation` | `"HORIZONTAL" \| "VERTICAL"` | `"HORIZONTAL"` | Orientation of the tabs |
| `size` | `SAILSize` | `"STANDARD"` | Size of the tab triggers |
| `loop` | `boolean` | `true` | Whether tabs should loop when navigating with keyboard |
| `showWhen` | `boolean` | `true` | Determines whether component is displayed |
| `marginAbove` | `SAILMarginSize` | `"NONE"` | Space added above component |
| `marginBelow` | `SAILMarginSize` | `"STANDARD"` | Space added below component |
| `color` | `string` | `"ACCENT"` | Color scheme for active tabs (hex or semantic) |
| `activationMode` | `"AUTOMATIC" \| "MANUAL"` | `"AUTOMATIC"` | Whether tabs activate on focus or click |

### TabItem Interface

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `value` | `string` | Yes | Unique identifier for the tab |
| `label` | `string` | Yes | Text to display on the tab trigger |
| `content` | `React.ReactNode` | Yes | Content to display when tab is active |
| `disabled` | `boolean` | No | Whether this tab is disabled |

## Examples

### Controlled Tabs

```tsx
const [activeTab, setActiveTab] = useState('profile')

<TabsField
  tabs={tabs}
  value={activeTab}
  onValueChange={setActiveTab}
/>
```

### Vertical Orientation

```tsx
<TabsField
  tabs={tabs}
  orientation="VERTICAL"
  defaultValue="profile"
/>
```

### Size Variations

```tsx
// Small tabs
<TabsField
  tabs={tabs}
  size="SMALL"
  defaultValue="tab1"
/>

// Large tabs
<TabsField
  tabs={tabs}
  size="LARGE"
  defaultValue="tab1"
/>
```

### Color Variations

```tsx
// Semantic colors
<TabsField tabs={tabs} color="POSITIVE" />
<TabsField tabs={tabs} color="NEGATIVE" />
<TabsField tabs={tabs} color="SECONDARY" />

// Custom hex color
<TabsField tabs={tabs} color="#9333EA" />
```

### Manual Activation

```tsx
<TabsField
  tabs={tabs}
  activationMode="MANUAL"
  defaultValue="tab1"
/>
```

### Disabled Tabs

```tsx
const tabs = [
  { value: 'active', label: 'Active Tab', content: <div>Active content</div> },
  { 
    value: 'disabled', 
    label: 'Disabled Tab', 
    content: <div>Disabled content</div>,
    disabled: true 
  }
]

<TabsField tabs={tabs} defaultValue="active" />
```

### Complex Content Example

```tsx
const tabs = [
  {
    value: 'account',
    label: 'Account',
    content: (
      <div className="space-y-4">
        <p>Make changes to your account here.</p>
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
    )
  },
  {
    value: 'password',
    label: 'Password',
    content: (
      <div className="space-y-4">
        <p>Change your password here.</p>
        <TextField label="Current password" masked={true} />
        <TextField label="New password" masked={true} />
        <TextField label="Confirm password" masked={true} />
        <ButtonArrayLayout
          buttons={[
            { label: "Change password", style: "SOLID", color: "ACCENT" }
          ]}
          align="END"
        />
      </div>
    )
  }
]

<TabsField
  tabs={tabs}
  value={activeTab}
  onValueChange={setActiveTab}
  size="STANDARD"
  color="ACCENT"
/>
```

## Potential SAIL Translation

While this component doesn't exist in SAIL yet, if it were to be added, the translation might look like:

**React:**
```tsx
<TabsField
  tabs={[
    {
      value: 'account',
      label: 'Account',
      content: <div>Account content</div>
    },
    {
      value: 'password',
      label: 'Password',
      content: <div>Password content</div>
    }
  ]}
  value={local!activeTab}
  onValueChange={(value) => setLocal!activeTab(value)}
  orientation="HORIZONTAL"
  size="STANDARD"
  color="ACCENT"
/>
```

**Hypothetical SAIL:**
```sail
a!tabsField(
  tabs: {
    a!tabItem(
      value: "account",
      label: "Account",
      content: { /* Account content components */ }
    ),
    a!tabItem(
      value: "password",
      label: "Password",
      content: { /* Password content components */ }
    )
  },
  value: local!activeTab,
  saveInto: local!activeTab,
  orientation: "HORIZONTAL",
  size: "STANDARD",
  color: "ACCENT"
)
```

## Accessibility Features

The TabsField component includes full accessibility support via Radix UI:

- **Keyboard Navigation**: Arrow keys navigate between tabs, Tab key moves focus to content
- **ARIA Attributes**: Proper `role`, `aria-selected`, `aria-controls` attributes
- **Focus Management**: Focus moves appropriately between triggers and content
- **Screen Reader Support**: Announces tab state changes and content

### Keyboard Interactions

| Key | Description |
|-----|-------------|
| `Tab` | Moves focus to active trigger, then to active content |
| `ArrowDown` / `ArrowRight` | Moves focus to next trigger (depending on orientation) |
| `ArrowUp` / `ArrowLeft` | Moves focus to previous trigger (depending on orientation) |
| `Home` | Moves focus to first trigger |
| `End` | Moves focus to last trigger |
| `Space` / `Enter` | Activates focused trigger (in manual mode) |

## Design Considerations

- **Horizontal tabs** work best for 2-6 tabs with short labels
- **Vertical tabs** work better for longer lists or when space is constrained horizontally
- **Manual activation** is better for tabs with expensive content that shouldn't load on focus
- **Disabled tabs** should be used sparingly and with clear indication of why they're disabled

## Best Practices

1. **Keep tab labels short** - Long labels can break layout, especially on mobile
2. **Use consistent content structure** - Similar content patterns across tabs improve UX
3. **Consider loading states** - For tabs with async content, show loading indicators
4. **Provide clear visual hierarchy** - Active tab should be clearly distinguishable
5. **Test keyboard navigation** - Ensure all functionality is accessible via keyboard
6. **Consider mobile experience** - Horizontal tabs may need to scroll on small screens

## Related Components

- **ButtonArrayLayout** - For simple toggle-style navigation
- **DropdownField** - Alternative for many options in limited space
- **CardLayout** - For organizing related content without navigation
