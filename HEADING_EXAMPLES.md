# HeadingField Component Examples

## Basic Usage

```tsx
<HeadingField
  text="Welcome to Our Application"
  size="LARGE_PLUS"
  headingTag="H1"
/>
```

## Different Sizes

```tsx
{/* Page title */}
<HeadingField
  text="Dashboard"
  size="LARGE_PLUS"
  headingTag="H1"
  color="ACCENT"
/>

{/* Section heading */}
<HeadingField
  text="Recent Activity"
  size="MEDIUM_PLUS"
  headingTag="H2"
  marginBelow="STANDARD"
/>

{/* Subsection heading */}
<HeadingField
  text="Account Details"
  size="MEDIUM"
  headingTag="H3"
  fontWeight="SEMI_BOLD"
/>

{/* Small heading */}
<HeadingField
  text="Settings"
  size="SMALL"
  headingTag="H4"
  color="SECONDARY"
/>
```

## With Links

```tsx
<HeadingField
  text="View All Transactions"
  size="MEDIUM"
  headingTag="H3"
  color="ACCENT"
  link={() => navigate('/transactions')}
/>
```

## Color Variations

```tsx
{/* Semantic colors */}
<HeadingField text="Success!" size="LARGE" color="POSITIVE" />
<HeadingField text="Error Occurred" size="MEDIUM" color="NEGATIVE" />
<HeadingField text="Secondary Info" size="MEDIUM" color="SECONDARY" />

{/* Custom hex colors */}
<HeadingField text="Custom Brand Color" size="LARGE" color="#0a578a" />
```

## Font Weight Variations

```tsx
<HeadingField text="Light Heading" fontWeight="LIGHT" />
<HeadingField text="Regular Heading" fontWeight="REGULAR" />
<HeadingField text="Semi Bold Heading" fontWeight="SEMI_BOLD" />
<HeadingField text="Bold Heading" fontWeight="BOLD" />
```

## Alignment Options

```tsx
<HeadingField text="Left Aligned" align="START" />
<HeadingField text="Center Aligned" align="CENTER" />
<HeadingField text="Right Aligned" align="END" />
```

## Spacing Control

```tsx
<HeadingField
  text="Heading with Custom Spacing"
  marginAbove="MORE"
  marginBelow="EVEN_MORE"
/>
```

## Prevent Wrapping

```tsx
<HeadingField
  text="This is a very long heading that would normally wrap to multiple lines but won't"
  preventWrapping={true}
  size="LARGE"
/>
```

## Navigation Example (from SAIL docs)

```tsx
<HeadingField
  text="My Accounts"
  headingTag="H1"
  color="#0a578a"
  marginBelow="NONE"
/>

<HeadingField
  text="Checking"
  size="MEDIUM"
  headingTag="H2"
  color="#0a578a"
  marginBelow="NONE"
/>

<HeadingField
  text="Main Checking - 8291"
  size="EXTRA_SMALL"
  headingTag="H3"
  color="#222222"
  fontWeight="SEMI_BOLD"
  link={() => viewAccount('8291')}
  marginBelow="NONE"
/>
```

---

## SAIL Translation

### Basic Heading

**React:**
```tsx
<HeadingField
  text="Dashboard"
  size="LARGE_PLUS"
  headingTag="H1"
  color="ACCENT"
/>
```

**SAIL:**
```sail
a!headingField(
  text: "Dashboard",
  size: "LARGE_PLUS",
  headingTag: "H1",
  color: "ACCENT"
)
```

### Heading with Link

**React:**
```tsx
<HeadingField
  text="View Details"
  size="MEDIUM"
  color="ACCENT"
  link={() => navigate('/details')}
/>
```

**SAIL:**
```sail
a!headingField(
  text: "View Details",
  size: "MEDIUM",
  color: "ACCENT",
  link: a!dynamicLink(
    value: "details",
    saveInto: local!selectedView
  )
)
```

### Heading with Custom Styling

**React:**
```tsx
<HeadingField
  text="Account Balance"
  size="MEDIUM_PLUS"
  headingTag="H2"
  fontWeight="BOLD"
  align="CENTER"
  marginAbove="MORE"
  marginBelow="STANDARD"
  color="#0a578a"
/>
```

**SAIL:**
```sail
a!headingField(
  text: "Account Balance",
  size: "MEDIUM_PLUS",
  headingTag: "H2",
  fontWeight: "BOLD",
  align: "CENTER",
  marginAbove: "MORE",
  marginBelow: "STANDARD",
  color: "#0a578a"
)
```

### Conditional Display

**React:**
```tsx
<HeadingField
  text="Admin Panel"
  size="LARGE"
  showWhen={user.isAdmin}
/>
```

**SAIL:**
```sail
a!headingField(
  text: "Admin Panel",
  size: "LARGE",
  showWhen: local!user.isAdmin
)
```

---

## Accessibility Notes

- The component automatically maps heading sizes to appropriate HTML heading tags (H1-H6) when `headingTag` is not specified
- Always provide explicit `headingTag` values for proper document structure
- Use semantic heading hierarchy (H1 → H2 → H3, etc.) for screen reader navigation
- Color contrast is automatically handled for semantic colors (minimum 4.5:1 ratio)
- When using custom hex colors, ensure adequate contrast against the background

## Design Decisions

1. **Link Implementation**: Simplified to accept onClick handler instead of complex SAIL link types for prototype flexibility
2. **Default Heading Tags**: Automatically assigned based on size when not specified, following common patterns
3. **Color Contrast**: Semantic colors use high-contrast combinations from Aurora palette
4. **Truncation**: `preventWrapping` uses CSS `truncate` class for clean single-line display
