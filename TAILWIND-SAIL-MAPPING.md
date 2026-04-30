# Tailwind to SAIL Value Mappings

This document shows how SAIL parameter values map to Tailwind CSS utilities in the Sailwind library.

## Philosophy: Two-Layer Approach

Sailwind uses a **two-layer architecture**:

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
| STANDARD | `text-base` | 14px (0.875rem) | Aliased to `text-sm` in theme |
| MEDIUM | `text-lg` | 18px (1.125rem) | Section headings |
| MEDIUM_PLUS | `text-xl` | 20px (1.25rem) | Large buttons, subheadings |
| LARGE | `text-2xl` | 24px (1.5rem) | Page headings |
| LARGE_PLUS | `text-3xl` | 28px (1.75rem) | Major headings ⚠️ Custom override |
| EXTRA_LARGE | `text-4xl` | 32px (2rem) | Hero text |

**Note:** `text-base` is aliased to `text-sm` (14px) in the theme — `STANDARD` body text renders at 14px, not 16px. Only `text-3xl` (28px) overrides a Tailwind default (normally 30px).

## Spacing (Padding & Margins)

| SAIL Value | Tailwind Class | Actual Size | Notes |
|------------|---------------|-------------|-------|
| NONE | `p-0`, `m-0` | 0 | No spacing |
| EVEN_LESS | `p-1`, `m-1` | 4px (0.25rem) | Minimal spacing |
| LESS | `p-2`, `m-2` | 8px (0.5rem) | Small spacing |
| STANDARD | `p-4`, `m-4` | 16px (1rem) | Default spacing |
| MORE | `p-6`, `m-6` | 24px (1.5rem) | Generous spacing |
| EVEN_MORE | `p-8`, `m-8` | 32px (2rem) | Maximum spacing |

The base spacing unit is `--spacing: 0.25rem`, so all Tailwind spacing utilities work as expected.

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

## Color Palette

All color families use a **full 10-step scale**: `50, 100, 200, 300, 400, 500, 600, 700, 800, 900`

### Available Color Families

`red`, `burnt-orange`, `orange`, `amber`, `yellow`, `lime`, `green`, `teal`, `cyan`, `sky`, `blue`, `violet`, `purple`, `pink`, `gray`

### Recommended Steps by Use Case

- **Light backgrounds** (tags, hover states, tinted surfaces): `50`, `100`, `200`
- **Primary / interactive elements** (buttons, links, icons): `500`
- **Dark text, borders, emphasis**: `700`, `900`
- **Mid-tone text / secondary elements**: `300`, `400`, `600` (available but less common)

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

In Sailwind components, semantic colors map to:

| Semantic | Tailwind Class | Hex |
|----------|---------------|-----|
| ACCENT | `blue-500` | #2322F0 |
| POSITIVE | `green-700` | #357A38 |
| NEGATIVE | `red-700` | #9B0027 |
| SECONDARY | `gray-700` | #616161 |
| STANDARD | `gray-900` | #212121 |

## Component Size Mappings

### Button Sizes

```tsx
// SAIL Component API uses UPPERCASE values
<ButtonWidget size="SMALL" />    // Maps to: px-3 py-1.5 text-sm
<ButtonWidget size="STANDARD" /> // Maps to: px-4 py-2.5 text-base
<ButtonWidget size="MEDIUM" />   // Maps to: px-6 py-3 text-lg
<ButtonWidget size="LARGE" />    // Maps to: px-8 py-4 text-xl
```

Internal mapping in ButtonWidget.tsx:
```tsx
const sizeMap: Record<SAILSize, string> = {
  SMALL: 'px-3 py-1.5 text-sm',      // 12px horizontal, 6px vertical, 14px text
  STANDARD: 'px-4 py-2.5 text-base', // 16px horizontal, 10px vertical, 14px text
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
  STANDARD: 'text-base px-4 py-1'  // 14px text, 16px horizontal, 4px vertical
}
```

## Theme Configuration

The `@theme` directive in `index.css` is **fully generated from `tokens/tokens.json`** via `pnpm run generate:css`. Do not edit the generated regions by hand.

Key overrides from Tailwind defaults:

```css
@theme {
  /* text-base aliased to text-sm (14px instead of 16px) */
  --text-base: var(--text-sm);

  /* Custom text size (overrides default 30px) */
  --text-3xl: 1.75rem;       /* 28px - SAIL LARGE_PLUS */

  /* Base spacing unit */
  --spacing: 0.25rem;

  /* Custom border radius (overrides default 2px) */
  --radius-sm: 0.25rem;      /* 4px - SAIL SEMI_ROUNDED */

  /* Full color palette - all 15 families × 10 steps */
  --color-red-50: #FCE6EB;
  /* ... all color definitions ... */
}
```

To regenerate after editing `tokens/tokens.json`:
```bash
pnpm run generate:css
```

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

3. **Use the full color scale — prefer semantic steps**
   ```
   "Light backgrounds: 50, 100, 200 — Primary: 500 — Dark text/borders: 700, 900"
   ```

4. **Comments document SAIL equivalence**
   ```tsx
   STANDARD: 'px-4 py-2.5 text-base', // SAIL STANDARD: 16px horizontal, 10px vertical
   ```

## Benefits of This Approach

✅ **Standard Tailwind utilities** - Better IDE support and autocomplete
✅ **Token-driven theme** - Single source of truth in `tokens/tokens.json`
✅ **SAIL-exact at API level** - Components accept SAIL parameter names
✅ **LLM-friendly** - Clear, consistent patterns for code generation
✅ **Full color palette** - 15 families × 10 steps for rich UI expression

## For LLM Steering Files

When documenting for AI assistants, use:

**Text sizes:** `text-xs`, `text-sm`, `text-base`, `text-lg`, `text-xl`, `text-2xl`, `text-3xl`, `text-4xl`

**Spacing:** `p-0`, `p-1`, `p-2`, `p-4`, `p-6`, `p-8` (and `m-*` equivalents)

**Colors:** 15 families (`red`, `burnt-orange`, `orange`, `amber`, `yellow`, `lime`, `green`, `teal`, `cyan`, `sky`, `blue`, `violet`, `purple`, `pink`, `gray`), steps `50`–`900`

**Example:**
```
"For light backgrounds use: 50, 100, 200
For primary elements use: 500
For dark text/borders use: 700, 900"
```
