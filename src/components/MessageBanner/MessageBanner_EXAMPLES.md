# MessageBanner Component Examples

## Basic Usage

### Success Message
```tsx
<MessageBanner
  primaryText="Success!"
  secondaryText="Your changes have been saved."
  backgroundColor="SUCCESS"
  highlightColor="POSITIVE"
  icon="check-circle"
/>
```

### Error Message
```tsx
<MessageBanner
  primaryText="Error"
  secondaryText="Please check your input and try again."
  backgroundColor="ERROR"
  highlightColor="NEGATIVE"
  icon="exclamation-circle"
/>
```

### Info Message with Custom Colors
```tsx
<MessageBanner
  primaryText="System Maintenance"
  secondaryText="The system will be down for maintenance this Saturday from 10 PM to 11 PM."
  backgroundColor="#E3F2FD"
  highlightColor="#1976D2"
  icon="info-circle"
  shape="ROUNDED"
/>
```

### Announce-Only Message (Screen Readers Only)
```tsx
<MessageBanner
  secondaryText="A new item has been added to the grid (row 3)"
  announceBehavior="ANNOUNCE_ONLY"
  accessibilityText="3 total items in the grid"
/>
```

### Display and Announce Message
```tsx
<MessageBanner
  primaryText="Item added to cart"
  secondaryText="2 items added to your cart"
  backgroundColor="SUCCESS"
  highlightColor="POSITIVE"
  icon="check-circle"
  announceBehavior="DISPLAY_AND_ANNOUNCE"
  accessibilityText="5 total items in your cart"
/>
```

## SAIL Translation

### Basic Success Message

**React:**
```tsx
<MessageBanner
  primaryText="Success!"
  secondaryText="Your changes have been saved."
  backgroundColor="SUCCESS"
  highlightColor="POSITIVE"
  icon="check-circle"
  shape="ROUNDED"
  marginBelow="MORE"
/>
```

**SAIL:**
```sail
a!messageBanner(
  primaryText: "Success!",
  secondaryText: "Your changes have been saved.",
  backgroundColor: "SUCCESS",
  highlightColor: "POSITIVE",
  icon: "check-circle",
  shape: "ROUNDED",
  marginBelow: "MORE"
)
```

### Announce-Only Message

**React:**
```tsx
<MessageBanner
  secondaryText="A new item has been added to the grid"
  announceBehavior="ANNOUNCE_ONLY"
  accessibilityText="Total items: 5"
/>
```

**SAIL:**
```sail
a!messageBanner(
  secondaryText: "A new item has been added to the grid",
  announceBehavior: "ANNOUNCE_ONLY",
  accessibilityText: "Total items: 5"
)
```

### Custom Hex Colors with Transparency

**React:**
```tsx
<MessageBanner
  primaryText="Custom Styling"
  backgroundColor="#FED7DE80"  // Red with 50% transparency
  highlightColor="#9F0019"
  showDecorativeBar={true}
  shape="SEMI_ROUNDED"
/>
```

**SAIL:**
```sail
a!messageBanner(
  primaryText: "Custom Styling",
  backgroundColor: "#FED7DE80",
  highlightColor: "#9F0019",
  showDecorativeBar: true(),
  shape: "SEMI_ROUNDED"
)
```

## Predefined Style Combinations

The following combinations match Appian's predefined styles:

| Type | backgroundColor | highlightColor | icon |
|------|----------------|----------------|------|
| Info | "INFO" | "INFO" | "info-circle" |
| Success | "SUCCESS" | "POSITIVE" | "check-circle" |
| Error | "ERROR" | "NEGATIVE" | "exclamation-circle" |
| Warning | "WARN" | "WARN" | "exclamation-triangle" |

## Accessibility Considerations

- Use `announceBehavior="DISPLAY_AND_ANNOUNCE"` for status messages resulting from user actions
- Use `announceBehavior="ANNOUNCE_ONLY"` when visual feedback is already provided elsewhere
- Use `announceBehavior="DISPLAY_ONLY"` for informational content present on page load
- Always provide meaningful `accessibilityText` for additional context
- Icons are decorative only and not read by screen readers

## Color Contrast

The component ensures WCAG AA compliance:
- Semantic backgrounds (INFO, SUCCESS, WARN, ERROR) use light backgrounds with dark text
- Custom hex colors should be tested for proper contrast ratios
- Highlight colors use darker shades for better visibility against light backgrounds
