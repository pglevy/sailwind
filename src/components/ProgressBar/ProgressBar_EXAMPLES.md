# ProgressBar Component Examples

## Basic Usage

### Standard Progress Bar
```tsx
<ProgressBar
  label="Task Completion"
  instructions="143 of 150 tasks completed"
  percentage={95}
  color="ACCENT"
/>
```

### Thick Progress Bar
```tsx
<ProgressBar
  label="Project Progress"
  percentage={67}
  color="POSITIVE"
  style="THICK"
/>
```

### Custom Color
```tsx
<ProgressBar
  label="Custom Progress"
  percentage={85}
  color="#9333EA"
  style="THICK"
/>
```

### Without Percentage Display
```tsx
<ProgressBar
  label="Loading..."
  percentage={45}
  color="ACCENT"
  showPercentage={false}
/>
```

### Collapsed Label (Screen Readers Only)
```tsx
<ProgressBar
  label="Background Process"
  labelPosition="COLLAPSED"
  percentage={78}
  color="POSITIVE"
  accessibilityText="Background synchronization 78% complete"
/>
```

## SAIL Translation

### Basic Progress Bar

**React:**
```tsx
<ProgressBar
  label="Task Completion"
  instructions="143 of 150 tasks completed"
  percentage={95}
  color="ACCENT"
  style="THICK"
/>
```

**SAIL:**
```sail
a!progressBarField(
  label: "Task Completion",
  instructions: "143 of 150 tasks completed",
  percentage: 95,
  color: "ACCENT",
  style: "THICK"
)
```

### Dynamic Color Based on Value

**React:**
```tsx
<ProgressBar
  label="Evaluation Progress"
  percentage={completionPercentage}
  color={completionPercentage > 60 ? "POSITIVE" : "NEGATIVE"}
/>
```

**SAIL:**
```sail
a!progressBarField(
  label: "Evaluation Progress",
  percentage: local!completionPercentage,
  color: if(local!completionPercentage > 60, "POSITIVE", "NEGATIVE")
)
```

### Custom Hex Color with Transparency

**React:**
```tsx
<ProgressBar
  label="Custom Styling"
  percentage={72}
  color="#9333EA80"
  style="THICK"
  marginBelow="MORE"
/>
```

**SAIL:**
```sail
a!progressBarField(
  label: "Custom Styling",
  percentage: 72,
  color: "#9333EA80",
  style: "THICK",
  marginBelow: "MORE"
)
```

## Percentage Display Behavior

### THIN Style
- Percentage appears **below** the progress bar (right-aligned)
- Aligns with instructions text when both are present
- Uses semibold font weight for better readability

### THICK Style  
- Percentage appears **overlaid** on the progress bar
- Positioned inside the colored portion (white text on color)
- For very low percentages (≤15%), falls back to black text on gray background
- Uses semibold font weight for better contrast

## Color Options

| Semantic Value | Color | Usage |
|----------------|-------|-------|
| ACCENT | Blue | Default progress, primary actions |
| POSITIVE | Green | Success states, completed tasks |
| NEGATIVE | Red | Error states, failed processes |
| WARN | Yellow | Warning states, attention needed |

## Style Options

| Style | Height | Percentage Display | Usage |
|-------|--------|-------------------|-------|
| THIN | 8px | Below bar (right-aligned) | Compact spaces, grids, lists |
| THICK | 24px | Overlaid on colored portion | Prominent display, detailed views |

## Edge Cases

### Values Outside 0-100 Range
```tsx
// Negative values - displays 0% filled, shows actual value in text
<ProgressBar percentage={-5} />  // Shows "0% filled, -5% text"

// Values over 100 - displays 100% filled, shows actual value in text  
<ProgressBar percentage={120} /> // Shows "100% filled, 120% text"
```

### Decimal Values
```tsx
// Automatically rounds to nearest integer
<ProgressBar percentage={67.8} /> // Displays as "68%"
```

## Accessibility Features

- **ARIA Attributes**: Uses Radix Progress primitive with proper `role="progressbar"`
- **Screen Reader Support**: Announces current value and maximum value
- **Label Association**: Proper `htmlFor` linking between label and progress bar
- **Keyboard Navigation**: Focusable and navigable via keyboard
- **High Contrast**: All color combinations meet WCAG AA standards

## Label Position Options

| Position | Behavior |
|----------|----------|
| ABOVE | Label appears above the progress bar (default) |
| ADJACENT | Label appears to the left of the progress bar |
| COLLAPSED | Label hidden visually, still read by screen readers |
| JUSTIFIED | Label aligned at page edge with justified layout |

## Usage Considerations

- Use **THIN** style in constrained spaces like grids or lists
- Use **THICK** style for prominent progress indicators
- Choose colors that match the semantic meaning (POSITIVE for success, NEGATIVE for errors)
- Always provide meaningful labels for accessibility
- Consider using `instructions` to provide additional context about the progress
