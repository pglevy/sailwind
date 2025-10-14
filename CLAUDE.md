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
- **Field/Layout components** (e.g., `TagField`, `ButtonArrayLayout`) - Group properties (size, spacing, alignment)

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
- **Styling:** Tailwind CSS with Aurora color palette
- **Language:** TypeScript (required)
- **Build:** Vite
- **Framework:** React 19+

### Why Radix UI?

- More LLM-friendly (better training data, simpler API than React Aria)
- Fully unstyled allows complete control over SAIL aesthetics
- Strong accessibility built-in (WAI-ARIA compliant)

## Two-Layer Architecture (CRITICAL)

SAIL Zero uses a clear separation between SAIL API and implementation details:

### Layer 1: SAIL API (Component Props)
User-controllable parameters that map directly to SAIL production code:

```tsx
// Component API - SAIL-exact parameters
<ButtonWidget
  size="STANDARD"          // ✅ SAIL parameter (maps to SAIL production code)
  style="SOLID"            // ✅ SAIL parameter
  color="ACCENT"           // ✅ SAIL parameter
/>
```

### Layer 2: Implementation/Layout (Component Internals)
Standard Tailwind classes for prototype-specific decisions:

```tsx
// ButtonArrayLayout - no SAIL equivalent for gap between buttons
<div className="flex gap-4 items-start">  // Vanilla Tailwind
  {buttons.map(btn => <ButtonWidget {...btn} />)}
</div>
```

### Why This Approach?

✅ **No double mapping** - SAIL values map directly to standard Tailwind classes (not SAIL → custom vars → Tailwind)
✅ **LLM-friendly** - Designers can request changes using standard Tailwind without learning custom utilities
✅ **Better DX** - Standard Tailwind utilities get IDE autocomplete, documentation, and community support
✅ **Clear boundaries** - SAIL props = production code translation, Tailwind = prototype polish

## Styling Reference

### Text Sizes

Use standard Tailwind classes internally. SAIL values map to:

| SAIL Value | Tailwind | Size | Usage |
|------------|----------|------|-------|
| SMALL | `text-xs` | 12px | Small tags, helper text |
| - | `text-sm` | 14px | Small buttons (intermediate) |
| STANDARD | `text-base` | 16px | Body text |
| MEDIUM | `text-lg` | 18px | Headings |
| MEDIUM_PLUS | `text-xl` | 20px | Large buttons |
| LARGE | `text-2xl` | 24px | Page headings |
| LARGE_PLUS | `text-3xl` | 28px | Major headings |
| EXTRA_LARGE | `text-4xl` | 32px | Hero text |

### Spacing

| SAIL Value | Tailwind | Size | Usage |
|------------|----------|------|-------|
| NONE | `p-0`, `m-0` | 0 | No spacing |
| EVEN_LESS | `p-1`, `m-1` | 4px | Minimal |
| - | `p-1.5`, `m-1.5` | 6px | Button padding |
| LESS | `p-2`, `m-2` | 8px | Small spacing |
| - | `p-2.5`, `m-2.5` | 10px | Button padding |
| - | `p-3`, `m-3` | 12px | Button padding |
| STANDARD | `p-4`, `m-4` | 16px | Default |
| MORE | `p-6`, `m-6` | 24px | Generous |
| EVEN_MORE | `p-8`, `m-8` | 32px | Maximum |

### Aurora Color Palette

**CRITICAL:** All colors use a consistent Tailwind scale: **50, 100, 200, 500, 700, 900**

Use ONLY these steps for all color families:
- **Light backgrounds:** `50`, `100`, `200`
- **Primary elements:** `500`
- **Dark text/borders:** `700`, `900`

**Available color families:**
`red`, `orange`, `yellow`, `green`, `teal`, `sky`, `blue`, `purple`, `pink`, `gray`

**Examples:**
```tsx
// Light backgrounds (tags, hover states)
className="bg-blue-100 text-blue-700"
className="bg-red-100 text-red-700"

// Primary actions (buttons, links)
className="bg-blue-500 text-white hover:bg-blue-700"

// Text hierarchy
className="text-gray-900"  // Primary heading
className="text-gray-700"  // Body text
className="text-gray-500"  // Secondary text

// Borders
className="border-2 border-blue-500"
className="border-gray-200"
```

### Semantic Color Mappings

When users specify semantic colors in component props, they map to:

| Semantic | Tailwind | Aurora Color | Usage |
|----------|----------|--------------|-------|
| ACCENT | `blue-500` | Blue 3 (#2322F0) | Primary actions |
| POSITIVE | `green-700` | Green 4 (#117C00) | Success states |
| NEGATIVE | `red-700` | Red 35 (#B2002C) | Error states |
| SECONDARY | `gray-700` | Gray 4 (#636363) | Secondary actions |
| STANDARD | `gray-900` | Gray 5 (#222222) | Default text |

### Shape (Border Radius)

| SAIL Value | Tailwind | Size |
|------------|----------|------|
| SQUARED | `rounded-none` | 0 |
| SEMI_ROUNDED | `rounded-sm` | 4px |
| ROUNDED | `rounded-md` | 8px |

## Component Development Guidelines

### When Creating New Components

1. **Research SAIL documentation first** - Use official SAIL docs to understand exact parameter names, values, and behavior
2. **Create TypeScript interfaces** - Define Item and Field props with exact SAIL parameter names
3. **Use Radix primitives when applicable** - For complex interactive components (Dialog, Dropdown, Tabs, Tooltip)
4. **Map SAIL props internally** - Create mappings from SAIL values to standard Tailwind classes
5. **Write SAIL translation examples** - Include side-by-side code examples in component documentation
6. **Ensure accessibility** - All components must meet WCAG 2.1 AA standards

### Component Mapping Pattern

Always map SAIL parameter values to Tailwind classes internally:

```tsx
// ✅ Correct - mapping SAIL to Tailwind
const sizeMap: Record<SAILSize, string> = {
  SMALL: 'px-3 py-1.5 text-sm',      // SAIL SMALL
  STANDARD: 'px-4 py-2.5 text-base', // SAIL STANDARD
  MEDIUM: 'px-6 py-3 text-lg',       // SAIL MEDIUM
  LARGE: 'px-8 py-4 text-xl'         // SAIL LARGE
}

// Component usage
<button className={`${sizeMap[size]} bg-blue-500`}>
  {label}
</button>
```

```tsx
// ❌ Wrong - exposing Tailwind at component API
<Button className="px-4 py-2.5 text-base" />
```

### File Structure for Components

```
src/components/
├── Button/
│   ├── ButtonWidget.tsx       # Individual button
│   ├── ButtonArrayLayout.tsx  # Button group container
│   ├── index.ts              # Exports
│   └── types.ts              # Button-specific types (optional)
├── Tag/
│   ├── TagItem.tsx           # Individual tag (types only)
│   ├── TagField.tsx          # Tag group with layout
│   └── index.ts
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
export type SAILSemanticColor = "ACCENT" | "POSITIVE" | "NEGATIVE" | "SECONDARY" | "STANDARD"
```

Component-specific types can be defined inline.

## Component Priority (Build Order)

### Phase 1 - Core Components ✅
1. Tags (✅ completed - TagField, TagItem)
2. Buttons (✅ completed - ButtonWidget, ButtonArrayLayout)
3. Cards (✅ completed - CardLayout)
4. Tabs (🚧 next up)

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
// Semantic - maps to Tailwind class
<TagField tags={[{ text: "NEW", backgroundColor: "ACCENT" }]} />
// Renders: className="bg-blue-500"

// Hex - uses inline style
<TagField tags={[{ text: "URGENT", backgroundColor: "#FED7DE" }]} />
// Renders: style={{ backgroundColor: "#FED7DE" }}
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

## Theme Configuration

The `@theme` directive in `src/index.css` **only defines values that differ from Tailwind defaults**:

```css
@theme {
  /* Custom text size (overrides default 30px) */
  --text-3xl: 1.75rem;       /* 28px - SAIL LARGE_PLUS */

  /* Intermediate spacing (not in default scale) */
  --spacing-1\.5: 0.375rem;  /* 6px - button padding */
  --spacing-2\.5: 0.625rem;  /* 10px - button padding */

  /* Custom border radius (overrides default 2px) */
  --radius-sm: 0.25rem;      /* 4px - SAIL SEMI_ROUNDED */

  /* Aurora color palette - all custom (100+ color definitions) */
  --color-blue-50: #F5F5FC;
  --color-blue-100: #EDEEFA;
  /* ... etc ... */
}
```

**Do NOT add values that match Tailwind defaults** - they're unnecessary and add clutter.

## Testing with LLMs

This library is designed to be LLM-friendly:

1. Components should be simple enough for LLMs to generate correctly
2. Clear patterns make code generation predictable
3. SAIL-exact parameters prevent hallucination
4. Side-by-side examples teach LLMs the translation pattern
5. Standard Tailwind classes for implementation make tweaking easy

## Documentation References

- **TAILWIND-SAIL-MAPPING.md** - Complete reference for all Tailwind/SAIL mappings
- **Aurora Color Palette** - `/Users/philip.levy/Documents/GitHub/pglevy/aurora/docs/branding/colors.md`
- **Project Decisions** - `/Users/philip.levy/Documents/GitHub/pglevy/claude-second-brain/Projects/SAIL-React-Component-Library/02-decisions.md`
- **SAIL Official Docs** - https://docs.appian.com/suite/help/25.3/
- **Radix UI** - https://www.radix-ui.com/
- **Tailwind CSS** - https://tailwindcss.com/

## Critical Reminders

1. **Always use UPPERCASE for SAIL parameter values** - This is non-negotiable
2. **Follow Item + Field pattern** - Matches SAIL architecture exactly
3. **Use standard Tailwind classes internally** - No custom SAIL utilities
4. **Only use color steps: 50, 100, 200, 500, 700, 900** - Consistent across all colors
5. **TypeScript is required** - Enforces SAIL conventions at compile time
6. **Accessibility is non-negotiable** - All components must meet WCAG 2.1 AA
7. **Include SAIL translation examples** - Every component needs side-by-side React/SAIL code
8. **Check SAIL docs first** - Don't guess parameter names or values

## Questions to Ask

When implementing new components, consider:

- Does this component have a direct SAIL equivalent?
- What are the exact SAIL parameter names and allowed values?
- Should this use a Radix primitive or be built custom?
- Does this follow the Item + Field pattern?
- Can this code be translated 1:1 to SAIL?
- Are we using only the approved color steps (50, 100, 200, 500, 700, 900)?

## Success Criteria

✅ Components use exact SAIL parameter names and values (UPPERCASE)
✅ Internal implementation uses standard Tailwind classes
✅ LLMs can generate correct code without hallucination
✅ Prototypes translate to SAIL with minimal changes
✅ Components maintain Appian visual aesthetic (Aurora colors)
✅ All components meet accessibility standards
✅ Clear documentation with SAIL translation examples
✅ Consistent color scale across all color families
