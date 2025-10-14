# SAIL Zero

**Zero-config React component library for rapid prototyping of Appian applications with SAIL-compatible syntax.**

## Overview

SAIL Zero enables UX designers to rapidly prototype Appian applications using React and LLMs (like Claude) before committing to SAIL development. Components look like Appian, use exact SAIL parameter names, and translate directly to production code.

## Key Features

- **SAIL-Exact Parameters** - Use UPPERCASE values matching SAIL: `size="STANDARD"` not `size="standard"`
- **Backwards Compatible** - React code translates almost directly to SAIL
- **LLM-Friendly** - Clear patterns for AI-assisted development
- **Accessible** - All components meet WCAG 2.1 AA standards
- **Production-Ready Foundation** - Built on Radix UI primitives + Tailwind CSS

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
- **Styling:** Tailwind CSS with Aurora color palette
- **Language:** TypeScript (enforces SAIL conventions)

### Two-Layer Approach

SAIL Zero uses a clear separation:

1. **Layer 1: SAIL API** - Component props use SAIL parameter names (UPPERCASE values)
2. **Layer 2: Implementation** - Standard Tailwind classes for styling

**Why?** No double mapping, LLM-friendly, standard tooling support.

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
import { TagField, ButtonArrayLayout, CardLayout } from './components'

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
<ButtonArrayLayout
  buttons={[
    { label: "Submit", style: "SOLID", color: "ACCENT" },
    { label: "Cancel", style: "OUTLINE", color: "SECONDARY" }
  ]}
  align="END"
/>
```

## Styling Approach

SAIL Zero uses **standard Tailwind classes** internally while maintaining SAIL-exact component APIs:

### Text Sizes
- **SMALL** → `text-xs` (12px)
- **STANDARD** → `text-base` (16px)
- **MEDIUM** → `text-lg` (18px)
- **LARGE** → `text-2xl` (24px)

### Spacing
- **NONE** → `p-0` / `m-0` (0)
- **EVEN_LESS** → `p-1` / `m-1` (4px)
- **LESS** → `p-2` / `m-2` (8px)
- **STANDARD** → `p-4` / `m-4` (16px)
- **MORE** → `p-6` / `m-6` (24px)
- **EVEN_MORE** → `p-8` / `m-8` (32px)

### Aurora Color Palette

All colors use consistent Tailwind steps: **50, 100, 200, 500, 700, 900**

**Available colors:** `red`, `orange`, `yellow`, `green`, `teal`, `sky`, `blue`, `purple`, `pink`, `gray`

**Usage:**
```tsx
// Light backgrounds
<div className="bg-blue-100 text-blue-700">Tag</div>

// Primary actions
<button className="bg-blue-500 hover:bg-blue-700">Submit</button>

// Text hierarchy
<h1 className="text-gray-900">Heading</h1>
<p className="text-gray-700">Body</p>
```

### Semantic Colors

| Semantic | Usage | Tailwind |
|----------|-------|----------|
| ACCENT | Primary actions | `blue-500` |
| POSITIVE | Success states | `green-700` |
| NEGATIVE | Error states | `red-700` |
| SECONDARY | Secondary actions | `gray-700` |
| STANDARD | Default text | `gray-900` |

## Component Status

### ✅ Completed
- **Tags** (TagField, TagItem) - Status indicators with semantic/hex colors
- **Buttons** (ButtonWidget, ButtonArrayLayout) - Multiple styles (SOLID, OUTLINE, GHOST, LINK)
- **Cards** (CardLayout) - Container with decorative bars, borders, shadows

### 🚧 Phase 2 - Form Components
- [ ] Text Input
- [ ] Select/Dropdown (Pick List)
- [ ] Checkbox/Radio
- [ ] Confirmation Dialog

### 📋 Phase 3 - Display Patterns
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
│   ├── components/         # SAIL components (Button, Tag, Card, etc.)
│   ├── types/             # Shared TypeScript types (SAILSize, SAILAlign, etc.)
│   ├── index.css          # Tailwind v4 theme configuration
│   └── App.tsx            # Demo/playground
├── TAILWIND-SAIL-MAPPING.md  # Complete styling reference
├── CLAUDE.md              # LLM instructions
└── package.json
```

## Documentation

- **[TAILWIND-SAIL-MAPPING.md](TAILWIND-SAIL-MAPPING.md)** - Complete reference for Tailwind to SAIL mappings
- **[CLAUDE.md](CLAUDE.md)** - Instructions for LLM-assisted development
- **[SAIL Official Docs](https://docs.appian.com/suite/help/25.3/)** - Appian SAIL reference

## Related Resources

- **Radix UI** - https://www.radix-ui.com/
- **Tailwind CSS** - https://tailwindcss.com/
- **Aurora Design System** - Color palette and branding

## Contributing

This is a proof-of-concept for rapid Appian prototyping. Contributions welcome!

### Guidelines

1. Use exact SAIL parameter names (UPPERCASE values)
2. Follow Item + Field component pattern
3. Include SAIL translation examples in documentation
4. Ensure WCAG 2.1 AA accessibility compliance
5. Use standard Tailwind classes internally

## License

TBD

---

**Status:** Active development - Tags, Buttons, and Cards implemented
