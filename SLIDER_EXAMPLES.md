# Slider Component Examples

## Basic Usage

### Single Value Slider
```tsx
<SliderField
  label="Volume Level"
  instructions="Adjust the audio volume"
  value={volumeLevel}
  min={0}
  max={100}
  step={1}
  saveInto={setVolumeLevel}
  showValue={true}
  formatValue={(val) => `${val}%`}
  color="ACCENT"
/>
```

### Range Slider
```tsx
<SliderField
  label="Price Range"
  instructions="Select your budget range"
  value={[25, 75]}
  min={0}
  max={100}
  step={1}
  saveInto={setPriceRange}
  showValue={true}
  formatValue={(val) => `$${val}`}
  color="ACCENT"
/>
```

### Vertical Slider
```tsx
<SliderField
  label="Vertical Volume"
  value={volumeLevel}
  min={0}
  max={100}
  saveInto={setVolumeLevel}
  orientation="VERTICAL"
  showValue={true}
  color="ACCENT"
/>
```

## Size Variations

```tsx
<SliderField label="Small" value={50} min={0} max={100} size="SMALL" />
<SliderField label="Standard" value={50} min={0} max={100} size="STANDARD" />
<SliderField label="Medium" value={50} min={0} max={100} size="MEDIUM" />
<SliderField label="Large" value={50} min={0} max={100} size="LARGE" />
```

## Color Variations

```tsx
<SliderField label="Accent" value={50} min={0} max={100} color="ACCENT" />
<SliderField label="Positive" value={50} min={0} max={100} color="POSITIVE" />
<SliderField label="Negative" value={50} min={0} max={100} color="NEGATIVE" />
<SliderField label="Custom" value={50} min={0} max={100} color="#9333EA" />
```

## Advanced Features

### Custom Value Formatting
```tsx
<SliderField
  label="Temperature"
  value={72}
  min={60}
  max={80}
  saveInto={setTemperature}
  showValue={true}
  formatValue={(val) => `${val}°F`}
/>
```

### With Validation
```tsx
<SliderField
  label="Required Setting"
  value={value}
  min={0}
  max={100}
  saveInto={setValue}
  required={true}
  validations={value < 10 ? ["Value must be at least 10"] : []}
  requiredMessage="This setting is required"
/>
```

## SAIL Translation

**React Prototype:**
```tsx
<SliderField
  label="Volume Level"
  instructions="Adjust the audio volume"
  value={local!volumeLevel}
  min={0}
  max={100}
  step={1}
  saveInto={(value) => setLocal!volumeLevel(value)}
  showValue={true}
  color="ACCENT"
/>
```

**SAIL Production (hypothetical - not available in current SAIL):**
```sail
a!sliderField(
  label: "Volume Level",
  instructions: "Adjust the audio volume",
  value: local!volumeLevel,
  min: 0,
  max: 100,
  step: 1,
  saveInto: local!volumeLevel,
  showValue: true,
  color: "ACCENT"
)
```

## Component Features

- **Single or Range Values**: Supports both single numeric values and range selection
- **Orientation**: Horizontal (default) or vertical layout
- **Size Variations**: SMALL, STANDARD, MEDIUM, LARGE
- **Color Support**: Semantic colors (ACCENT, POSITIVE, NEGATIVE, SECONDARY) and hex values
- **Value Display**: Optional formatted value display
- **Custom Formatting**: Format displayed values with custom functions
- **Accessibility**: Full keyboard navigation and screen reader support
- **Validation**: Standard SAIL validation patterns
- **Field Wrapper**: Uses shared FieldWrapper for consistent layout

## Accessibility Features

- Proper ARIA labels and descriptions
- Keyboard navigation (arrow keys, page up/down, home/end)
- Screen reader announcements for value changes
- Focus management and visual indicators
- High contrast support

## Use Cases

- Volume controls
- Price range filters
- Temperature settings
- Brightness adjustments
- Progress indicators (when used as display-only)
- Any numeric range input where visual feedback is helpful
