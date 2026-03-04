# Contributing to Sailwind

## Project Overview

**Sailwind** is a React component library for rapid prototyping of Appian applications. The key goal is **backwards compatibility with SAIL** — every component should use exact SAIL parameter names and values so prototypes translate directly to production code.

## Technical Stack

- **Base:** Radix UI (unstyled, accessible primitives)
- **Styling:** Tailwind CSS with Aurora color palette
- **Language:** TypeScript (required)
- **Build:** Vite
- **Framework:** React 19+

### Why Radix UI?

- More LLM-friendly (better training data, simpler API than React Aria)
- Fully unstyled allows complete control over SAIL aesthetics
- Strong accessibility built-in (WAI-ARIA compliant)

## Core Principles

### SAIL-Exact Parameters

Always use UPPERCASE SAIL parameter values exactly as they appear in SAIL documentation:

```tsx
// ✅ Correct
<TagField size="STANDARD" labelPosition="COLLAPSED" />

// ❌ Wrong
<TagField size="standard" labelPosition="collapsed" />
```

### Component Pattern: Item + Field

SAIL uses a two-component pattern for grouped elements:

- **Item components** (e.g., `TagItem`, `ButtonItem`) — Individual properties (text, color, link)
- **Field/Layout components** (e.g., `TagField`, `ButtonArrayLayout`) — Group properties (size, spacing, alignment)

### Two-Layer Architecture

Sailwind uses a clear separation between SAIL API and implementation details:

**Layer 1: SAIL API (Component Props)** — User-controllable parameters that map directly to SAIL production code:

```tsx
<ButtonWidget size="STANDARD" style="SOLID" color="ACCENT" />
```

**Layer 2: Implementation/Layout (Component Internals)** — Standard Tailwind classes for prototype-specific decisions:

```tsx
<div className="flex gap-4 items-start">
  {buttons.map(btn => <ButtonWidget {...btn} />)}
</div>
```

### TypeScript Types Enforce SAIL Conventions

Use TypeScript union types to enforce exact SAIL values:

```tsx
type SAILSize = "SMALL" | "STANDARD" | "MEDIUM" | "LARGE"
type SAILAlign = "START" | "CENTER" | "END"
type SAILMargin = "NONE" | "EVEN_LESS" | "LESS" | "STANDARD" | "MORE" | "EVEN_MORE"
```

## Styling Reference

### Aurora Color Palette

All colors use a consistent Tailwind scale: **50, 100, 200, 500, 700, 900**

- **Light backgrounds:** `50`, `100`, `200`
- **Primary elements:** `500`
- **Dark text/borders:** `700`, `900`

**Available color families:** `red`, `orange`, `yellow`, `green`, `teal`, `sky`, `blue`, `purple`, `pink`, `gray`

### Semantic Color Mappings

| Semantic | Tailwind | Usage |
|----------|----------|-------|
| ACCENT | `blue-500` | Primary actions |
| POSITIVE | `green-700` | Success states |
| NEGATIVE | `red-700` | Error states |
| SECONDARY | `gray-700` | Secondary actions |
| STANDARD | `gray-900` | Default text |

### Text Sizes

| SAIL Value | Tailwind | Size |
|------------|----------|------|
| SMALL | `text-xs` | 12px |
| STANDARD | `text-base` | 16px |
| MEDIUM | `text-lg` | 18px |
| MEDIUM_PLUS | `text-xl` | 20px |
| LARGE | `text-2xl` | 24px |
| LARGE_PLUS | `text-3xl` | 28px |
| EXTRA_LARGE | `text-4xl` | 32px |

### Spacing

| SAIL Value | Tailwind | Size |
|------------|----------|------|
| NONE | `p-0`, `m-0` | 0 |
| EVEN_LESS | `p-1`, `m-1` | 4px |
| LESS | `p-2`, `m-2` | 8px |
| STANDARD | `p-4`, `m-4` | 16px |
| MORE | `p-6`, `m-6` | 24px |
| EVEN_MORE | `p-8`, `m-8` | 32px |

### Shape (Border Radius)

| SAIL Value | Tailwind | Size |
|------------|----------|------|
| SQUARED | `rounded-none` | 0 |
| SEMI_ROUNDED | `rounded-sm` | 4px |
| ROUNDED | `rounded-md` | 8px |

## Component Development Guidelines

### When Creating New Components

1. **Research SAIL documentation first** — Use official SAIL docs to understand exact parameter names, values, and behavior
2. **Create TypeScript interfaces** — Define Item and Field props with exact SAIL parameter names
3. **Use Radix primitives when applicable** — For complex interactive components (Dialog, Dropdown, Tabs, Tooltip)
4. **Map SAIL props internally** — Create mappings from SAIL values to standard Tailwind classes
5. **Write SAIL translation examples** — Include side-by-side code examples in component documentation
6. **Ensure accessibility** — All components must meet WCAG 2.1 AA standards

### Component Mapping Pattern

Map SAIL parameter values to Tailwind classes internally:

```tsx
// ✅ Correct — mapping SAIL to Tailwind
const sizeMap: Record<SAILSize, string> = {
  SMALL: 'px-3 py-1.5 text-sm',
  STANDARD: 'px-4 py-2.5 text-base',
  MEDIUM: 'px-6 py-3 text-lg',
  LARGE: 'px-8 py-4 text-xl'
}

// ❌ Wrong — exposing Tailwind at component API
<Button className="px-4 py-2.5 text-base" />
```

### SAIL Translation Examples Required

Every component must include side-by-side React/SAIL examples:

```tsx
// React Prototype
<TagField
  size="STANDARD"
  tags={[
    { text: "URGENT", backgroundColor: "#FED7DE", textColor: "#9F0019" }
  ]}
/>

// SAIL Production
a!tagField(
  size: "STANDARD",
  tags: {
    a!tagItem(text: "URGENT", backgroundColor: "#FED7DE", textColor: "#9F0019")
  }
)
```

### File Structure for Components

```
src/components/
├── Button/
│   ├── ButtonWidget.tsx
│   ├── ButtonArrayLayout.tsx
│   ├── Button.stories.tsx
│   ├── index.ts
│   └── types.ts (optional)
├── Tag/
│   ├── TagField.tsx
│   └── index.ts
```

### Shared Types Location

Common SAIL types go in `src/types/sail.ts`:

```tsx
export type SAILShape = "SQUARED" | "SEMI_ROUNDED" | "ROUNDED"
export type SAILPadding = "NONE" | "EVEN_LESS" | "LESS" | "STANDARD" | "MORE" | "EVEN_MORE"
export type SAILSize = "SMALL" | "STANDARD" | "MEDIUM" | "LARGE"
export type SAILAlign = "START" | "CENTER" | "END"
export type SAILSemanticColor = "ACCENT" | "POSITIVE" | "NEGATIVE" | "SECONDARY" | "STANDARD"
```

## Common Patterns

### Color Handling: Semantic + Hex

Support both semantic color names and hex values (matches SAIL):

```tsx
// Semantic — maps to Tailwind class
<TagField tags={[{ text: "NEW", backgroundColor: "ACCENT" }]} />

// Hex — uses inline style
<TagField tags={[{ text: "URGENT", backgroundColor: "#FED7DE" }]} />
```

### Shared Logic with Separate Exports

For components that share logic but need separate SAIL-matching APIs:

```tsx
const NumberFieldBase = ({ numberType, ...props }) => { /* shared logic */ }

export const IntegerField = (props) => <NumberFieldBase numberType="INTEGER" {...props} />
export const DecimalField = (props) => <NumberFieldBase numberType="DECIMAL" {...props} />
```

## Theme Configuration

The `@theme` directive in `src/index.css` **only defines values that differ from Tailwind defaults**. Do not add values that match Tailwind defaults.

## Documentation References

- **TAILWIND-SAIL-MAPPING.md** — Complete reference for all Tailwind/SAIL mappings
- **SAIL Official Docs** — https://docs.appian.com/suite/help/25.3/
- **Radix UI** — https://www.radix-ui.com/
- **Tailwind CSS** — https://tailwindcss.com/

## Questions to Ask

When implementing new components, consider:

- Does this component have a direct SAIL equivalent?
- What are the exact SAIL parameter names and allowed values?
- Should this use a Radix primitive or be built custom?
- Does this follow the Item + Field pattern?
- Can this code be translated 1:1 to SAIL?
- Are we using only the approved color steps (50, 100, 200, 500, 700, 900)?
