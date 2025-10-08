# CLAUDE.md - SAIL Zero Project Instructions

## Project Overview

**SAIL Zero** is a React component library for rapid prototyping of Appian applications. The key goal is **backwards compatibility with SAIL** - every component should use exact SAIL parameter names and values so prototypes translate directly to production code.

## Core Principles

### 1. SAIL-Exact Parameters (CRITICAL)

Always use UPPERCASE SAIL parameter values exactly as they appear in SAIL documentation:

✅ **Correct:**
```tsx
<TagField size="STANDARD" labelPosition="COLLAPSED" />
```

❌ **Wrong:**
```tsx
<TagField size="standard" labelPosition="collapsed" />
```

### 2. Component Pattern: Item + Field

SAIL uses a two-component pattern for grouped elements. Always follow this:

- **Item components** (e.g., `TagItem`, `ButtonItem`) - Individual properties (text, color, link)
- **Field/Layout components** (e.g., `TagField`, `ButtonLayout`) - Group properties (size, spacing, alignment)

Example:
```tsx
interface TagItemProps {
  text: string
  backgroundColor?: string
  textColor?: string
}

interface TagFieldProps {
  tags: TagItemProps[]
  size?: "SMALL" | "STANDARD" | "MEDIUM" | "LARGE"  // applies to all tags
  align?: "START" | "CENTER" | "END"
}
```

### 3. TypeScript Types Enforce SAIL Conventions

Use TypeScript union types to enforce exact SAIL values:

```tsx
type SAILSize = "SMALL" | "STANDARD" | "MEDIUM" | "LARGE"
type SAILAlign = "START" | "CENTER" | "END"
type SAILMargin = "NONE" | "EVEN_LESS" | "LESS" | "STANDARD" | "MORE" | "EVEN_MORE"
```

### 4. SAIL Translation Examples Required

Every component must include side-by-side React/SAIL examples showing the translation:

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

## Technical Stack

- **Base:** Radix UI (unstyled, accessible primitives)
- **Styling:** Tailwind CSS with SAIL-mapped utilities
- **Language:** TypeScript (required)
- **Build:** Vite
- **Framework:** React 19+

### Why Radix UI?

- More LLM-friendly (better training data, simpler API than React Aria)
- Fully unstyled allows complete control over SAIL aesthetics
- Strong accessibility built-in (WAI-ARIA compliant)

## SAIL Mappings Reference

### Text Sizes
- `text-sail-small` → SMALL (12px)
- `text-sail-standard` → STANDARD (16px)
- `text-sail-medium` → MEDIUM (18px)
- `text-sail-medium-plus` → MEDIUM_PLUS (20px)
- `text-sail-large` → LARGE (24px)
- `text-sail-large-plus` → LARGE_PLUS (28px)
- `text-sail-extra-large` → EXTRA_LARGE (32px)

### Spacing
- `p-sail-none` / `m-sail-none` → NONE (0)
- `p-sail-even-less` / `m-sail-even-less` → EVEN_LESS (4px)
- `p-sail-less` / `m-sail-less` → LESS (8px)
- `p-sail-standard` / `m-sail-standard` → STANDARD (16px)
- `p-sail-more` / `m-sail-more` → MORE (24px)
- `p-sail-even-more` / `m-sail-even-more` → EVEN_MORE (32px)

### Semantic Colors
- `ACCENT` → Blue (#2322F0)
- `POSITIVE` → Green (#117C00)
- `NEGATIVE` → Red (#B2002C)
- `SECONDARY` → Gray (#636363)
- `STANDARD` → Gray (#222222)

### Border Radius
- `rounded-sail-squared` → SQUARED (0)
- `rounded-sail-semi-rounded` → SEMI_ROUNDED (4px)
- `rounded-sail-rounded` → ROUNDED (8px)

## Component Development Guidelines

### When Creating New Components

1. **Research SAIL documentation first** - Use official SAIL docs to understand exact parameter names, values, and behavior
2. **Create TypeScript interfaces** - Define Item and Field props with exact SAIL parameter names
3. **Use Radix primitives when applicable** - For complex interactive components (Dialog, Dropdown, Tabs, Tooltip)
4. **Map SAIL styles** - Create Tailwind utilities for SAIL-specific values if needed
5. **Write SAIL translation examples** - Include side-by-side code examples in component documentation
6. **Ensure accessibility** - All components must meet WCAG 2.1 AA standards

### File Structure for Components

```
src/components/
├── tag/
│   ├── TagItem.tsx      # Individual tag properties
│   ├── TagField.tsx     # Group container with layout props
│   ├── index.ts         # Exports both components
│   └── types.ts         # Shared types for tag components
```

### Shared Types Location

Common SAIL types go in `src/types/sail.ts`:

```tsx
// src/types/sail.ts
export type SAILShape = "SQUARED" | "SEMI_ROUNDED" | "ROUNDED"
export type SAILPadding = "NONE" | "EVEN_LESS" | "LESS" | "STANDARD" | "MORE" | "EVEN_MORE"
export type SAILMarginSize = "NONE" | "EVEN_LESS" | "LESS" | "STANDARD" | "MORE" | "EVEN_MORE"
export type SAILSize = "SMALL" | "STANDARD" | "MEDIUM" | "LARGE"
export type SAILAlign = "START" | "CENTER" | "END"
```

Component-specific types can be defined inline.

## Component Priority (Build Order)

### Phase 1 - Core Components
1. Tags (✅ completed as proof of concept)
2. Buttons - Primary, secondary, destructive variants
3. Cards - Foundation for layouts
4. Tabs - Navigation pattern

### Phase 2 - Form Components
5. Text Input
6. Select/Dropdown (Pick List)
7. Checkbox/Radio
8. Confirmation Dialog

### Phase 3 - Display Patterns
9. Banners - Alerts/notifications
10. KPIs - Dashboard cards
11. Breadcrumbs
12. Empty States

## Common Patterns

### Color Handling: Semantic + Hex

Support both semantic color names and hex values (matches SAIL):

```tsx
// Semantic
<TagField tags={[{ text: "NEW", backgroundColor: "ACCENT" }]} />

// Hex
<TagField tags={[{ text: "URGENT", backgroundColor: "#FED7DE" }]} />
```

### Shared Logic with Separate Exports

For components like IntegerField/DecimalField that share logic but need separate SAIL-matching APIs:

```tsx
// Internal shared component
const NumberFieldBase = ({ numberType, ...props }) => {
  // Shared validation, formatting, etc.
}

// Public exports matching SAIL API
export const IntegerField = (props) => <NumberFieldBase numberType="INTEGER" {...props} />
export const DecimalField = (props) => <NumberFieldBase numberType="DECIMAL" {...props} />
```

## Testing with LLMs

This library is designed to be LLM-friendly. When testing:

1. Components should be simple enough for LLMs to generate correctly
2. Clear patterns make code generation predictable
3. SAIL-exact parameters prevent hallucination
4. Side-by-side examples teach LLMs the translation pattern

## Documentation References

- **Product Documentation:** `/Users/philip.levy/Documents/GitHub/pglevy/claude-second-brain/Projects/SAIL-React-Component-Library/`
- **SAIL Official Docs:** https://docs.appian.com/suite/help/25.3/
- **Radix UI:** https://www.radix-ui.com/
- **Tailwind CSS:** https://tailwindcss.com/

## Critical Reminders

1. **Always use UPPERCASE for SAIL parameter values** - This is non-negotiable
2. **Follow Item + Field pattern** - Matches SAIL architecture exactly
3. **TypeScript is required** - Enforces SAIL conventions at compile time
4. **Accessibility is non-negotiable** - All components must meet WCAG 2.1 AA
5. **Include SAIL translation examples** - Every component needs side-by-side React/SAIL code
6. **Check SAIL docs first** - Don't guess parameter names or values

## Questions to Ask

When implementing new components, consider:

- Does this component have a direct SAIL equivalent?
- What are the exact SAIL parameter names and allowed values?
- Should this use a Radix primitive or be built custom?
- Does this follow the Item + Field pattern?
- Can this code be translated 1:1 to SAIL?

## Success Criteria

✅ Components use exact SAIL parameter names and values
✅ LLMs can generate correct code without hallucination
✅ Prototypes translate to SAIL with minimal changes
✅ Components maintain Appian visual aesthetic
✅ All components meet accessibility standards
✅ Clear documentation with SAIL translation examples
