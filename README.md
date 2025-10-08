# SAIL Zero

**Zero-config React component library for rapid prototyping of Appian applications with SAIL-compatible syntax.**

## Overview

SAIL Zero enables UX designers to rapidly prototype Appian applications using React and LLMs (like Claude) before committing to SAIL development. Components look like Appian, use exact SAIL parameter names, and translate directly to production code.

## Key Features

- **SAIL-Exact Parameters** - Use UPPERCASE values matching SAIL: `size="STANDARD"` not `size="standard"`
- **Backwards Compatible** - React code translates almost directly to SAIL
- **LLM-Friendly** - Clear patterns for AI-assisted development
- **Accessible** - All components meet WCAG 2.1 AA standards
- **Production-Ready Foundation** - Built on Radix UI primitives + Tailwind CSS with SAIL-mapped utilities

## Quick Example

**React Prototype:**
```tsx
<TagField
  size="STANDARD"
  tags={[
    { text: "URGENT", backgroundColor: "#FED7DE", textColor: "#9F0019" }
  ]}
/>
```

**SAIL Production:**
```sail
a!tagField(
  size: "STANDARD",
  tags: {
    a!tagItem(text: "URGENT", backgroundColor: "#FED7DE", textColor: "#9F0019")
  }
)
```

## Architecture

### Foundation Stack
- **Base:** Radix UI (unstyled, accessible primitives)
- **Styling:** Tailwind CSS with custom SAIL-mapped utilities
- **Language:** TypeScript (enforces SAIL conventions)

### Component Pattern
SAIL Zero follows SAIL's **Item + Field** grouping pattern:

```tsx
// Item component - individual properties
interface TagItemProps {
  text: string
  backgroundColor?: string
  textColor?: string
}

// Field component - group properties
interface TagFieldProps {
  tags: TagItemProps[]
  size?: "SMALL" | "STANDARD" | "MEDIUM" | "LARGE"  // applies to all
}
```

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
npm install
npm run dev
```

### Usage

Components use exact SAIL parameter names and values:

```tsx
import { TagField, ButtonLayout, CardLayout } from './components'

// Tags with SAIL-exact parameters
<TagField
  size="STANDARD"
  align="START"
  tags={[
    { text: "NEW", backgroundColor: "ACCENT" },
    { text: "PRIORITY", backgroundColor: "#FED7DE", textColor: "#9F0019" }
  ]}
/>

// Buttons following SAIL conventions
<ButtonLayout
  buttons={[
    { label: "Submit", style: "PRIMARY" },
    { label: "Cancel", style: "SECONDARY" }
  ]}
  align="END"
/>
```

## SAIL Mappings

### Text Sizes
- `text-sail-small` → SMALL (12px)
- `text-sail-standard` → STANDARD (16px)
- `text-sail-medium` → MEDIUM (18px)
- `text-sail-large` → LARGE (24px)

### Spacing
- `p-sail-none` / `m-sail-none` → NONE (0)
- `p-sail-less` / `m-sail-less` → LESS (8px)
- `p-sail-standard` / `m-sail-standard` → STANDARD (16px)
- `p-sail-more` / `m-sail-more` → MORE (24px)

### Semantic Colors
- `ACCENT` → Blue (#2322F0)
- `POSITIVE` → Green (#117C00)
- `NEGATIVE` → Red (#B2002C)
- `SECONDARY` → Gray (#636363)
- `STANDARD` → Gray (#222222)

## Component Priority (Roadmap)

### Phase 1 - Core Components
- [x] Tags - Status indicators
- [ ] Buttons - Primary, secondary, destructive variants
- [ ] Cards - Foundation for layouts
- [ ] Tabs - Navigation pattern

### Phase 2 - Form Components
- [ ] Text Input
- [ ] Select/Dropdown (Pick List)
- [ ] Checkbox/Radio
- [ ] Confirmation Dialog

### Phase 3 - Display Patterns
- [ ] Banners - Alerts/notifications
- [ ] KPIs - Dashboard cards
- [ ] Breadcrumbs
- [ ] Empty States

## Development

### Available Scripts

- `npm run dev` - Start development server with HMR
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

### Project Structure

```
sail-zero/
├── src/
│   ├── components/     # SAIL components
│   ├── types/         # Shared TypeScript types
│   └── App.tsx        # Demo/playground
├── tailwind.config.js # SAIL mappings
└── package.json
```

## Related Resources

- **SAIL Documentation** - https://docs.appian.com/suite/help/25.3/
- **Radix UI** - https://www.radix-ui.com/
- **Tailwind CSS** - https://tailwindcss.com/

## Contributing

This is a proof-of-concept for rapid Appian prototyping. Contributions welcome!

## License

TBD

---

**Status:** Early development - Tag component implemented as proof of concept
