# Stamp Component Examples

The StampField component displays an icon and/or text on a colored circular background. It's best used as a decorative component to add visual interest to your page and can include links for interactive behavior.

## Basic Usage

### Stamp with Icon and ACCENT Background

```tsx
<StampField
  label="Status"
  labelPosition="COLLAPSED"
  backgroundColor="ACCENT"
  icon="star"
  contentColor="STANDARD"
/>
```

### Stamp with TRANSPARENT Background

```tsx
<StampField
  label="Home"
  labelPosition="COLLAPSED"
  backgroundColor="TRANSPARENT"
  icon="home"
  contentColor="POSITIVE"
/>
```

### Stamp with Text Only

```tsx
<StampField
  backgroundColor="#cc0000"
  text="1"
  align="CENTER"
/>
```

## Size Variations

```tsx
{/* Different sizes */}
<StampField icon="star" size="TINY" backgroundColor="ACCENT" />
<StampField icon="star" size="SMALL" backgroundColor="ACCENT" />
<StampField icon="star" size="MEDIUM" backgroundColor="ACCENT" />
<StampField icon="star" size="LARGE" backgroundColor="ACCENT" />
```

## Alignment Options

```tsx
{/* Different alignments */}
<StampField text="1" backgroundColor="#cc0000" align="START" />
<StampField text="2" backgroundColor="#cc0000" align="CENTER" />
<StampField text="3" backgroundColor="#cc0000" align="END" />
```

## Shape Variations

```tsx
{/* Different shapes */}
<StampField icon="star" shape="SQUARED" backgroundColor="ACCENT" />
<StampField icon="star" shape="SEMI_ROUNDED" backgroundColor="ACCENT" />
<StampField icon="star" shape="ROUNDED" backgroundColor="ACCENT" />
```

## Interactive Stamps with Links

```tsx
const [activeSection, setActiveSection] = useState(1)

const navSections = [
  { name: "Workspace", icon: "briefcase" },
  { name: "Tasks", icon: "list-todo" },
  { name: "Requests", icon: "send" },
  { name: "Calendar", icon: "calendar" },
  { name: "My Time", icon: "clock" },
  { name: "Expenses", icon: "dollar-sign" }
]

{navSections.map((section, index) => (
  <StampField
    key={index}
    labelPosition="COLLAPSED"
    icon={section.icon}
    backgroundColor={index + 1 === activeSection ? "ACCENT" : "SECONDARY"}
    link={{
      onClick: () => setActiveSection(index + 1)
    }}
    size="MEDIUM"
    align="CENTER"
    tooltip={section.name}
  />
))}
```

## Color Combinations

```tsx
{/* Semantic colors */}
<StampField icon="star" backgroundColor="ACCENT" contentColor="STANDARD" />
<StampField icon="star" backgroundColor="POSITIVE" contentColor="STANDARD" />
<StampField icon="star" backgroundColor="NEGATIVE" contentColor="STANDARD" />
<StampField icon="star" backgroundColor="SECONDARY" contentColor="STANDARD" />

{/* Custom hex colors */}
<StampField 
  text="NEW" 
  backgroundColor="#FED7DE" 
  contentColor="#9F0019" 
/>
```

## With Labels and Instructions

```tsx
<StampField
  label="Priority Level"
  instructions="Indicates the urgency of this item"
  labelPosition="ABOVE"
  icon="star"
  backgroundColor="NEGATIVE"
  helpTooltip="High priority items require immediate attention"
/>
```

## Icon Usage

The Stamp component supports any Lucide React icon. You can use either:
- **Kebab-case**: `"check-circle"`, `"alarm-clock"`, `"user-plus"`
- **PascalCase**: `"CheckCircle"`, `"AlarmClock"`, `"UserPlus"`
- **SAIL compatibility**: `"STAR"`, `"HOME"`, `"USER"` (mapped to Lucide equivalents)

```tsx
{/* Modern Lucide icons */}
<StampField icon="check-circle" backgroundColor="POSITIVE" />
<StampField icon="alarm-clock" backgroundColor="ACCENT" />
<StampField icon="user-plus" backgroundColor="SECONDARY" />

{/* SAIL compatibility */}
<StampField icon="STAR" backgroundColor="ACCENT" />
<StampField icon="HOME" backgroundColor="POSITIVE" />
```

## SAIL Translation

### Basic Stamp with Icon

**React:**
```tsx
<StampField
  label="Stamp"
  labelPosition="COLLAPSED"
  backgroundColor="ACCENT"
  icon="star"
  contentColor="STANDARD"
/>
```

**SAIL:**
```sail
a!stampField(
  label: "Stamp",
  labelPosition: "COLLAPSED",
  backgroundColor: "ACCENT",
  icon: "STAR",
  contentColor: "STANDARD"
)
```

### Transparent Background Stamp

**React:**
```tsx
<StampField
  label="Stamp"
  labelPosition="COLLAPSED"
  backgroundColor="TRANSPARENT"
  icon="home"
  contentColor="POSITIVE"
/>
```

**SAIL:**
```sail
a!stampField(
  label: "Stamp",
  labelPosition: "COLLAPSED",
  backgroundColor: "TRANSPARENT",
  icon: "HOME",
  contentColor: "POSITIVE"
)
```

### Stamp with Label and Instructions

**React:**
```tsx
<StampField
  label="Priority Level"
  instructions="these are stamp instructions"
  backgroundColor="ACCENT"
  icon="star"
  size="MEDIUM"
/>
```

**SAIL:**
```sail
a!stampField(
  label: "Priority Level",
  instructions: "these are stamp instructions",
  backgroundColor: "ACCENT",
  icon: "STAR",
  size: "MEDIUM"
)
```

### Interactive Navigation Stamps

**React:**
```tsx
{navSections.map((section, index) => (
  <StampField
    key={index}
    labelPosition="COLLAPSED"
    icon={section.icon}
    backgroundColor={index + 1 === activeSection ? "ACCENT" : "SECONDARY"}
    link={{
      onClick: () => setActiveSection(index + 1)
    }}
    size="MEDIUM"
    align="CENTER"
  />
))}
```

**SAIL:**
```sail
a!forEach(
  items: local!navSections,
  expression: { 
    a!stampField(
      labelPosition: "COLLAPSED",
      icon: fv!item.icon,
      backgroundColor: if(
        fv!index = local!activeNavSection,
        "ACCENT",
        "SECONDARY"
      ),
      link: a!dynamicLink(
        value: fv!index,
        saveInto: local!activeNavSection
      ),
      size: "MEDIUM",
      align: "CENTER"
    )
  }
)
```

## Layout Behavior

- **Label**: Appears above the stamp when `labelPosition` is "ABOVE" (default)
- **Instructions**: Always appear below the stamp
- **Help Tooltip**: Appears next to the label (when label is visible)

## Accessibility Considerations

- Always provide meaningful `accessibilityText` when using icons without text
- Use appropriate color contrast ratios (4.5:1 minimum for WCAG AA)
- When using `backgroundColor="TRANSPARENT"`, ensure the content color provides sufficient contrast
- Interactive stamps (with links) are keyboard accessible and include proper ARIA attributes

## Design Guidelines

- Use stamps sparingly as decorative elements to avoid visual clutter
- Prefer semantic colors (`ACCENT`, `POSITIVE`, `NEGATIVE`) over custom hex colors for consistency
- Consider the `TRANSPARENT` background option when you need the stamp to blend with the page background
- Use appropriate sizes: `TINY` for subtle indicators, `LARGE` for prominent navigation elements
