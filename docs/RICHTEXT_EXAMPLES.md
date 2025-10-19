# Rich Text Components Examples

## Basic Usage

### Simple Rich Text with Mixed Formatting

```tsx
import { RichTextDisplayField, TextItem, Icon } from 'sailwind'

<RichTextDisplayField
  label="User Profile"
  value={[
    <TextItem text="Name: " />,
    <TextItem text="Xavier Jones" style="STRONG" size="MEDIUM" />,
    "\n",
    <TextItem text="Status: " />,
    <TextItem text="Active" color="POSITIVE" style="STRONG" />
  ]}
/>
```

### Rich Text with Icons

```tsx
<RichTextDisplayField
  labelPosition="COLLAPSED"
  value={[
    <TextItem
      text={[
        <Icon icon="user" caption="Name" />,
        " Xavier Jones"
      ]}
      size="MEDIUM"
      style="STRONG"
    />,
    "\n",
    <TextItem
      text={[
        <Icon icon="phone" caption="Phone" />,
        " (555) 123-4567"
      ]}
      color="SECONDARY"
    />,
    "\n",
    <TextItem
      text={[
        <Icon icon="building" caption="Location" />,
        " Reston, VA"
      ]}
      color="SECONDARY"
    />
  ]}
/>
```

### Rich Text with Links

```tsx
<RichTextDisplayField
  value={[
    "In addition to a personal statement, candidates may submit up to three ",
    <TextItem
      text={[
        <Icon icon="image" />,
        " Fine Art"
      ]}
      link={() => console.log('Fine Art clicked')}
    />,
    ", ",
    <TextItem
      text={[
        <Icon icon="headphones" />,
        " Audio"
      ]}
      link={() => console.log('Audio clicked')}
    />,
    ", or ",
    <TextItem
      text={[
        <Icon icon="video" />,
        " Video"
      ]}
      link={() => console.log('Video clicked')}
    />,
    " media samples."
  ]}
/>
```

### Standalone Links

```tsx
<RichTextDisplayField
  value={[
    <TextItem
      text={[
        <Icon icon="home" />,
        " Home"
      ]}
      link={() => console.log('Home clicked')}
      linkStyle="STANDALONE"
    />,
    "\n",
    <TextItem
      text={[
        <Icon icon="square-check" />,
        " My Open Requests"
      ]}
      link={() => console.log('Requests clicked')}
      linkStyle="STANDALONE"
    />,
    "\n",
    <TextItem
      text={[
        <Icon icon="fileText" />,
        " My Documents"
      ]}
      link={() => console.log('Documents clicked')}
      linkStyle="STANDALONE"
    />
  ]}
/>
```

### Text Styles Showcase

```tsx
<RichTextDisplayField
  labelPosition="COLLAPSED"
  value={[
    <TextItem text="Plain, " style="PLAIN" />,
    <TextItem text="Emphasis Small, " style="EMPHASIS" size="SMALL" />,
    <TextItem text="Underline Medium, " style="UNDERLINE" size="MEDIUM" />,
    <TextItem text="Strikethrough Medium_Plus, " style="STRIKETHROUGH" size="MEDIUM_PLUS" />,
    <TextItem text="Strong Large, " style="STRONG" size="LARGE" />,
    <TextItem text="Emphasis Large_Plus " style="EMPHASIS" size="LARGE_PLUS" />,
    <TextItem text="Strong Extra_Large" style="STRONG" size="EXTRA_LARGE" />
  ]}
/>
```

### Custom Colors

```tsx
<RichTextDisplayField
  value={[
    <TextItem text="Semantic Colors: " />,
    <TextItem text="ACCENT " color="ACCENT" style="STRONG" />,
    <TextItem text="POSITIVE " color="POSITIVE" style="STRONG" />,
    <TextItem text="NEGATIVE " color="NEGATIVE" style="STRONG" />,
    <TextItem text="SECONDARY " color="SECONDARY" style="STRONG" />,
    "\n",
    <TextItem text="Custom Colors: " />,
    <TextItem text="Custom Red " color="#FF0000" style="STRONG" />,
    <TextItem text="Custom Blue " color="#0066CC" style="STRONG" />
  ]}
/>
```

## SAIL Translation

### Basic Rich Text Example

**React:**
```tsx
<RichTextDisplayField
  labelPosition="COLLAPSED"
  value={[
    <TextItem
      text={[
        <Icon icon="USER" caption="Name" />,
        " Xavier Jones"
      ]}
      size="MEDIUM"
      style="STRONG"
    />,
    "\n",
    <TextItem
      text={[
        <Icon icon="PHONE" caption="Phone" />,
        " (555) 123-4567"
      ]}
      color="SECONDARY"
    />
  ]}
/>
```

**SAIL:**
```sail
a!richTextDisplayField(
  labelPosition: "COLLAPSED",
  value: {
    a!richTextItem(
      text: {
        a!richTextIcon(icon: "USER", caption: "Name"),
        " Xavier Jones"
      },
      size: "MEDIUM",
      style: { "STRONG" }
    ),
    char(10),
    a!richTextItem(
      text: {
        a!richTextIcon(icon: "PHONE", caption: "Phone"),
        " (555) 123-4567"
      },
      color: "SECONDARY"
    )
  }
)
```

### Rich Text with Links

**React:**
```tsx
<RichTextDisplayField
  value={[
    "Submit up to three ",
    <TextItem
      text={[
        <Icon icon="PICTURE-O" />,
        " Fine Art"
      ]}
      link={() => handleFineArtClick()}
    />,
    " samples."
  ]}
/>
```

**SAIL:**
```sail
a!richTextDisplayField(
  value: {
    "Submit up to three ",
    a!richTextItem(
      text: {
        a!richTextIcon(icon: "picture-o"),
        " Fine Art"
      },
      link: a!dynamicLink(
        value: "fineArt",
        saveInto: local!selectedCategory
      )
    ),
    " samples."
  }
)
```

### Multiple Text Styles

**React:**
```tsx
<RichTextDisplayField
  value={[
    <TextItem text="Plain, " style="PLAIN" />,
    <TextItem text="Strong, " style="STRONG" />,
    <TextItem text="Emphasis" style="EMPHASIS" />
  ]}
/>
```

**SAIL:**
```sail
a!richTextDisplayField(
  value: {
    a!richTextItem(text: "Plain, ", style: "PLAIN"),
    a!richTextItem(text: "Strong, ", style: "STRONG"),
    a!richTextItem(text: "Emphasis", style: "EMPHASIS")
  }
)
```

## Component Features

### RichTextDisplayField
- ✅ All SAIL parameters implemented
- ✅ Label positioning (ABOVE, ADJACENT, COLLAPSED, JUSTIFIED)
- ✅ Text alignment (LEFT, CENTER, RIGHT)
- ✅ Margin controls (marginAbove, marginBelow)
- ✅ Prevent wrapping option
- ✅ Tooltip support
- ✅ Accessibility features

### TextItem
- ✅ Multiple text styles (PLAIN, EMPHASIS, STRONG, UNDERLINE, STRIKETHROUGH)
- ✅ Size options (SMALL through EXTRA_LARGE)
- ✅ Semantic and hex color support
- ✅ Link functionality with inline/standalone styles
- ✅ Nested content support (text + icons)

### Icon
- ✅ **Flexible icon names** - Use any Lucide icon name (e.g., `icon="user"`, `icon="home"`, `icon="checkSquare"`)
- ✅ **SAIL compatibility** - Still supports SAIL icon names (e.g., `icon="USER"`, `icon="BUILDING-O"`)
- ✅ Size and color options matching TextItem
- ✅ Accessibility attributes (altText, caption)
- ✅ Link functionality
- ✅ Tooltip support
- ✅ **Auto-generated keys** - No need to manually specify React keys

## Assumptions & Decisions

1. **Icon Implementation**: Using emoji symbols as placeholders. In production, you'd integrate with an icon library like Lucide React or Heroicons.

2. **Link Handling**: SAIL links are complex (a!dynamicLink, a!safeLink, etc.). We simplified to onClick handlers for prototyping.

3. **Line Breaks**: Using "\n" strings for line breaks. SAIL uses `char(10)`.

4. **Color Contrast**: All semantic colors follow WCAG AA guidelines with proper contrast ratios.

5. **Nested Content**: TextItem supports arrays of content (text + icons) to match SAIL's flexible text parameter.

## Accessibility Features

- ✅ Proper ARIA labels and roles
- ✅ Screen reader support for collapsed labels
- ✅ Keyboard navigation for links
- ✅ High contrast color combinations
- ✅ Alternative text for icons
- ✅ Semantic HTML structure
