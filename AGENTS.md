# Sailwind Component Library — Agent Reference

This document provides essential guidance for AI agents working with the Sailwind React component library for rapid Appian prototyping.

For human contributors, see [CONTRIBUTING.md](CONTRIBUTING.md).

## Critical Principles

### 1. SAIL-Exact Parameters (UPPERCASE Required)

Always use UPPERCASE for SAIL parameter values:

```tsx
// ✅ CORRECT
<TagField size="STANDARD" labelPosition="COLLAPSED" />

// ❌ WRONG
<TagField size="standard" labelPosition="collapsed" />
```

### 2. Component Pattern: Item + Field

SAIL uses a two-component pattern:

- **Item components** (e.g., `TagItem`, `ButtonItem`) — Individual properties
- **Field/Layout components** (e.g., `TagField`, `ButtonArrayLayout`) — Group properties

### 3. Two-Layer Architecture

- **Layer 1 (SAIL API):** Component props use exact SAIL parameter names and UPPERCASE values
- **Layer 2 (Implementation):** Internal mapping from SAIL values to standard Tailwind classes

```tsx
// SAIL API layer
<ButtonWidget size="STANDARD" style="SOLID" color="ACCENT" />

// Implementation layer (inside component)
const sizeMap: Record<SAILSize, string> = {
  SMALL: 'px-3 py-1.5 text-sm',
  STANDARD: 'px-4 py-2.5 text-base',
  MEDIUM: 'px-6 py-3 text-lg',
  LARGE: 'px-8 py-4 text-xl'
}
```

### 4. Use Lucide Icons (NOT Emoji)

Always use Lucide React icons, never emoji characters:

```tsx
import { CheckCircle, AlertCircle } from 'lucide-react'
<Icon icon={CheckCircle} color="POSITIVE" size="MEDIUM" />
```

Common icons:
- Status: `CheckCircle`, `XCircle`, `AlertCircle`, `Info`
- Actions: `Plus`, `Minus`, `Edit`, `Trash2`, `Download`, `Upload`
- Navigation: `ChevronRight`, `ChevronDown`, `ArrowLeft`, `ArrowRight`
- UI: `Search`, `Filter`, `Settings`, `Menu`, `X`

### 5. UserImage is NOT a Component

`UserImage` is a data structure. Use `ImageField` with `style="AVATAR"` instead:

```tsx
<ImageField
  images={[{
    imageType: 'user' as const,
    user: { name: "John Smith", photoUrl: "/avatar.jpg", initials: "JS" },
    altText: "John Smith"
  }]}
  style="AVATAR"
  size="SMALL"
  marginBelow="NONE"
/>
```

## Styling Reference

### Text Sizes
- `SMALL` → `text-xs` (12px)
- `STANDARD` → `text-base` (16px)
- `MEDIUM` → `text-lg` (18px)
- `MEDIUM_PLUS` → `text-xl` (20px)
- `LARGE` → `text-2xl` (24px)
- `LARGE_PLUS` → `text-3xl` (28px)
- `EXTRA_LARGE` → `text-4xl` (32px)

### Spacing
- `NONE` → `p-0`, `m-0` (0)
- `EVEN_LESS` → `p-1`, `m-1` (4px)
- `LESS` → `p-2`, `m-2` (8px)
- `STANDARD` → `p-4`, `m-4` (16px)
- `MORE` → `p-6`, `m-6` (24px)
- `EVEN_MORE` → `p-8`, `m-8` (32px)

### Shape (Border Radius)
- `SQUARED` → `rounded-none` (0)
- `SEMI_ROUNDED` → `rounded-sm` (4px)
- `ROUNDED` → `rounded-md` (8px)

### Aurora Color Palette

All colors use steps: **50, 100, 200, 500, 700, 900**

Available families: `red`, `orange`, `yellow`, `green`, `teal`, `sky`, `blue`, `purple`, `pink`, `gray`

### Semantic Color Mappings

| Semantic | Tailwind | Usage |
|----------|----------|-------|
| ACCENT | `blue-500` | Primary actions |
| POSITIVE | `green-700` | Success states |
| NEGATIVE | `red-700` | Error states |
| SECONDARY | `gray-700` | Secondary actions |
| STANDARD | `gray-900` | Default text |

## Component Development

### File Structure

```
src/components/
├── Button/
│   ├── ButtonWidget.tsx
│   ├── ButtonArrayLayout.tsx
│   ├── Button.stories.tsx
│   ├── index.ts
│   └── types.ts (optional)
```

### Shared Types

Common SAIL types are in `src/types/sail.ts`. Component-specific types can be defined inline.

### Component Mapping Pattern

```tsx
// ✅ Correct — map SAIL values to Tailwind internally
const sizeMap: Record<SAILSize, string> = {
  SMALL: 'px-3 py-1.5 text-sm',
  STANDARD: 'px-4 py-2.5 text-base',
  MEDIUM: 'px-6 py-3 text-lg',
  LARGE: 'px-8 py-4 text-xl'
}

// ❌ Wrong — don't expose Tailwind at the component API
<Button className="px-4 py-2.5 text-base" />
```

## Quick Reference Patterns

### Card with Content
```tsx
<CardLayout padding="STANDARD" showShadow={true}>
  <HeadingField text="Title" size="MEDIUM" marginBelow="STANDARD" />
  <RichTextDisplayField value={["Content here"]} />
</CardLayout>
```

### Tags
```tsx
<TagField tags={[{ text: "Status", backgroundColor: "ACCENT" }]} size="SMALL" marginBelow="NONE" />
```

### Buttons
```tsx
<ButtonArrayLayout
  buttons={[
    { label: "Save", style: "SOLID", color: "ACCENT" },
    { label: "Cancel", style: "OUTLINE", color: "SECONDARY" }
  ]}
  align="END"
/>
```

## Validation

Run `npm run build` to catch TypeScript errors before considering work complete.

## Resources

- **TAILWIND-SAIL-MAPPING.md** — Complete Tailwind/SAIL mapping reference
- **CONTRIBUTING.md** — Architecture, principles, and detailed guidelines
- **SAIL Official Docs** — https://docs.appian.com/suite/help/25.3/
- **Radix UI** — https://www.radix-ui.com/
- **Tailwind CSS** — https://tailwindcss.com/
