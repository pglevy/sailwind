# Tailwind to SAIL Value Mappings

This document shows how SAIL parameter values map to Tailwind CSS utilities in the SAIL Zero library.

## Philosophy: Two-Layer Approach

SAIL Zero uses a **two-layer architecture**:

1. **Layer 1: SAIL API** (Component Props) - User-controllable parameters that map to SAIL
2. **Layer 2: Implementation/Layout** (Component Internals) - Vanilla Tailwind for styling decisions

### Why This Approach?

✅ **No double mapping** - SAIL values map directly to standard Tailwind classes
✅ **LLM-friendly** - Designers can request Tailwind tweaks without learning custom utilities
✅ **Standard tooling** - IDE autocomplete, documentation, and community support work out of the box
✅ **Clear boundaries** - SAIL props = production translation, Tailwind = prototype polish

## Text Sizes

| SAIL Value | Tailwind Class | Actual Size | Notes |
|------------|---------------|-------------|-------|
| SMALL | `text-xs` | 12px (0.75rem) | Used for small tags, helper text |
| - | `text-sm` | 14px (0.875rem) | Intermediate size for small buttons |
| STANDARD | `text-base` | 16px (1rem) | Default body text size |
| MEDIUM | `text-lg` | 18px (1.125rem) | Section headings |
| MEDIUM_PLUS | `text-xl` | 20px (1.25rem) | Large buttons, subheadings |
| LARGE | `text-2xl` | 24px (1.5rem) | Page headings |
| LARGE_PLUS | `text-3xl` | 28px (1.75rem) | Major headings ⚠️ Custom override |
| EXTRA_LARGE | `text-4xl` | 32px (2rem) | Hero text |

**Note:** Only `text-3xl` (28px) is overridden in theme - Tailwind default is 30px.

## Spacing (Padding & Margins)

| SAIL Value | Tailwind Class | Actual Size | Notes |
|------------|---------------|-------------|-------|
| NONE | `p-0`, `m-0` | 0 | No spacing |
| EVEN_LESS | `p-1`, `m-1` | 4px (0.25rem) | Minimal spacing |
| - | `p-1.5`, `m-1.5` | 6px (0.375rem) | ⚠️ Custom - button padding |
| LESS | `p-2`, `m-2` | 8px (0.5rem) | Small spacing |
| - | `p-2.5`, `m-2.5` | 10px (0.625rem) | ⚠️ Custom - button padding |
| - | `p-3`, `m-3` | 12px (0.75rem) | Intermediate |
| STANDARD | `p-4`, `m-4` | 16px (1rem) | Default spacing |
| MORE | `p-6`, `m-6` | 24px (1.5rem) | Generous spacing |
| EVEN_MORE | `p-8`, `m-8` | 32px (2rem) | Maximum spacing |

**Note:** `1.5` and `2.5` are custom intermediate values added for button sizing.

### Directional Spacing Examples

- **Horizontal:** `px-4` (padding-left + padding-right)
- **Vertical:** `py-2` (padding-top + padding-bottom)
- **Top:** `pt-4`, `mt-4`
- **Bottom:** `pb-4`, `mb-4`
- **Left:** `pl-4`, `ml-4`
- **Right:** `pr-4`, `mr-4`

## Border Radius (Shape)

| SAIL Value | Tailwind Class | Actual Size | Notes |
|------------|---------------|-------------|-------|
| SQUARED | `rounded-none` | 0 | Sharp corners |
| SEMI_ROUNDED | `rounded-sm` | 4px (0.25rem) | ⚠️ Custom override - Tailwind default is 2px |
| ROUNDED | `rounded-md` | 8px (0.5rem) | Noticeable rounding |

## Aurora Color Palette

All color families use a **consistent Tailwind scale**: `50, 100, 200, 500, 700, 900`

### Color Scale Mapping

Aurora palette steps map to Tailwind as follows:

```
Aurora → Tailwind
  0   →   50   (lightest)
  1   →  100   (very light)
  2   →  200   (light)
  3   →  500   (medium/primary - main color)
  35  →  700   (dark - between primary and darkest)
  4   →  700   (dark - when no 35)
  4   →  900   (darkest - when 35 exists)
  5   →  900   (darkest - when no 35)
```

### Available Colors

Use only these Tailwind steps across all color families:

- **Backgrounds (light):** `50`, `100`, `200`
- **Text/Borders/Buttons:** `500`, `700`, `900`

**Color families:** `red`, `orange`, `yellow`, `green`, `teal`, `sky`, `blue`, `purple`, `pink`, `gray`

### Examples

```tsx
// Light backgrounds (tags, hover states)
<div className="bg-blue-100 text-blue-700">Tag</div>
<div className="bg-red-100 text-red-700">Alert</div>

// Primary actions (buttons, links)
<button className="bg-blue-500 text-white hover:bg-blue-700">Submit</button>
<a className="text-blue-500 hover:underline">Learn more</a>

// Text hierarchy
<h1 className="text-gray-900">Heading</h1>
<p className="text-gray-700">Body text</p>
<span className="text-gray-500">Secondary text</span>
```

### Semantic Color Mappings

In SAIL Zero components, semantic colors map to:

| Semantic | Tailwind Class | Aurora Color |
|----------|---------------|--------------|
| ACCENT | `blue-500` | Blue 3 (#2322F0) |
| POSITIVE | `green-700` | Green 4 (#117C00) |
| NEGATIVE | `red-700` | Red 35 (#B2002C) |
| SECONDARY | `gray-700` | Gray 4 (#636363) |
| STANDARD | `gray-900` | Gray 5 (#222222) |

## Component Size Mappings

### Button Sizes

```tsx
// SAIL Component API uses UPPERCASE values
<ButtonWidget size="SMALL" />   // Maps to: px-3 py-1.5 text-sm
<ButtonWidget size="STANDARD" /> // Maps to: px-4 py-2.5 text-base
<ButtonWidget size="MEDIUM" />   // Maps to: px-6 py-3 text-lg
<ButtonWidget size="LARGE" />    // Maps to: px-8 py-4 text-xl
```

Internal mapping in ButtonWidget.tsx:
```tsx
const sizeMap: Record<SAILSize, string> = {
  SMALL: 'px-3 py-1.5 text-sm',      // 12px horizontal, 6px vertical, 14px text
  STANDARD: 'px-4 py-2.5 text-base', // 16px horizontal, 10px vertical, 16px text
  MEDIUM: 'px-6 py-3 text-lg',       // 24px horizontal, 12px vertical, 18px text
  LARGE: 'px-8 py-4 text-xl'         // 32px horizontal, 16px vertical, 20px text
}
```

### Tag Sizes

```tsx
// SAIL Component API
<TagField size="SMALL" />    // Maps to: px-2 py-1 text-xs
<TagField size="STANDARD" /> // Maps to: px-4 py-1 text-base
```

Internal mapping in TagField.tsx:
```tsx
const sizeMap = {
  SMALL: 'text-xs px-2 py-1',      // 12px text, 8px horizontal, 4px vertical
  STANDARD: 'text-base px-4 py-1'  // 16px text, 16px horizontal, 4px vertical
}
```

## Theme Configuration

The `@theme` directive in `index.css` **only defines values that differ from Tailwind defaults**:

```css
@theme {
  /* Custom text size (overrides default 30px) */
  --text-3xl: 1.75rem;       /* 28px - SAIL LARGE_PLUS */

  /* Intermediate spacing (not in default scale) */
  --spacing-1\.5: 0.375rem;  /* 6px - for button py-1.5 */
  --spacing-2\.5: 0.625rem;  /* 10px - for button py-2.5 */

  /* Custom border radius (overrides default 2px) */
  --radius-sm: 0.25rem;      /* 4px - SAIL SEMI_ROUNDED */

  /* Aurora color palette - all custom */
  --color-red-50: #FDEDF0;
  /* ... 100+ color definitions ... */
}
```

**Why only non-defaults?**
- Cleaner configuration
- Easier to see what's custom
- Leverages Tailwind's built-in scale

## Key Principles

1. **SAIL parameters remain UPPERCASE** at the component API level
   ```tsx
   <ButtonWidget size="STANDARD" marginBelow="MORE" />
   ```

2. **Internal mappings use standard Tailwind classes**
   ```tsx
   const sizeMap: Record<SAILSize, string> = {
     STANDARD: 'px-4 py-2.5 text-base'
   }
   ```

3. **Use consistent color steps for LLM steering**
   ```
   "Only use these color steps: 50, 100, 200, 500, 700, 900"
   ```

4. **Comments document SAIL equivalence**
   ```tsx
   STANDARD: 'px-4 py-2.5 text-base', // SAIL STANDARD: 16px horizontal, 10px vertical
   ```

## Benefits of This Approach

✅ **Standard Tailwind utilities** - Better IDE support and autocomplete
✅ **Minimal theme config** - Only non-defaults defined
✅ **SAIL-exact at API level** - Components accept SAIL parameter names
✅ **LLM-friendly** - Clear, consistent patterns for code generation
✅ **Consistent color scale** - Same steps across all color families

## For LLM Steering Files

When documenting for AI assistants, use:

**Text sizes:** `text-xs`, `text-sm`, `text-base`, `text-lg`, `text-xl`, `text-2xl`, `text-3xl`, `text-4xl`

**Spacing:** `p-0`, `p-1`, `p-2`, `p-4`, `p-6`, `p-8` (and `m-*` equivalents)

**Colors:** Only use steps `50`, `100`, `200`, `500`, `700`, `900` across all color families

**Example:**
```
"For light backgrounds use: 50, 100, 200
For primary elements use: 500
For dark text/borders use: 700, 900"
```
