# Sailwind Component Library — Agent Reference

This document provides essential guidance for AI agents working with the Sailwind React component library for rapid Appian prototyping.

For human contributors, see [CONTRIBUTING.md](CONTRIBUTING.md).

## Working with Contributors

Many people contributing to Sailwind are designers or are newer to shared codebases. They may not know what they don't know. Your job includes spotting consequences they wouldn't think to ask about.

Keep in mind that this is a **shared library** used by many projects, and alongside real Appian code. A change that's right for one prototype can be wrong for everyone else.

### Stop and check before

Pause, explain the impact in plain language, and ask whether to proceed when a change would:

- **Change a default value** of an existing prop. Every existing usage that relies on the default will change. Ask whether it's necessary, or whether a new prop or value would do.
- **Rename or remove** a component, prop, allowed value, type, or export. This breaks existing code. Suggest deprecating instead (keep it working, mark it `@deprecated`).
- **Visibly change a component's default appearance, layout, or structure** (element types, ARIA roles, `data-*` attributes).
- **Edit shared code**: `src/utils/`, `src/components/shared/`, `src/types/sail.ts`, `src/index.css`, `tokens/`, or `src/i18n/`. Name the components that will be affected.
- **Create a new component.** Check whether an existing one could be extended, and remind the contributor that new components need an issue first.
- **Add a prop or value that isn't in SAIL.** That's allowed. Confirm the name follows SAIL conventions and suggest noting "Not in SAIL" in its doc comment.
- **Add a dependency.**
- **Bring in app-specific names, content, or data** from the contributor's own project. Suggest generalizing it.
- **Grow beyond one concern.** If the work now spans unrelated changes, suggest splitting it into separate PRs.

Explain why each of these matters in a sentence or two. The goal is an informed decision, not a refusal.

### Before you start

- Search for the closest existing component or pattern and match it: prop names, label and margin handling, story structure.
- Reuse shared helpers (`resolveColorClass`, `resolveColorToHex`, the maps in `src/utils/sailMaps.ts`, `FieldLabel`, `FieldWrapper`) instead of writing new versions.

### When you finish

- Run `pnpm run check` and fix what it finds.
- Tell the contributor what you verified and what you couldn't (for example, "I didn't test with a screen reader" or "I only tested on React 19").
- Suggest a fresh-session review using [docs/ai-review.md](docs/ai-review.md) before they open a PR.

## Critical Principles

### 1. SAIL Naming Conventions (UPPERCASE Required)

Start from SAIL: when SAIL has the component or parameter, use its exact names and values. Going beyond SAIL is fine, because Sailwind can move faster than SAIL. New props and values should still follow SAIL's naming style.

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

- **Layer 1 (SAIL API):** Component props use SAIL parameter names (or SAIL-style names for additions) and UPPERCASE values
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

**Before any styling work, read [TAILWIND-SAIL-MAPPING.md](TAILWIND-SAIL-MAPPING.md).** It's the single reference for how SAIL values map to Tailwind: text sizes, spacing, shape, the color palette, and semantic colors. The values come from `tokens/tokens.json`, and the theme in `src/index.css` is generated from that file.

Don't rely on Tailwind's defaults from memory. Sailwind overrides some of them (for example, `text-base` is 14px, not 16px). Don't copy mapping values into other docs; link to the mapping file instead so there's only one place to keep up to date.

For colors in components, use the semantic names (`ACCENT`, `POSITIVE`, `NEGATIVE`, `SECONDARY`, `STANDARD`) and resolve them with `resolveColorClass` or `resolveColorToHex` from `src/utils/colorResolver.ts`, rather than hardcoding the Tailwind class.

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

### Tailwind Classes Must Be Complete Literals

Tailwind generates only the class names it finds written out in the source. Classes built with template strings or concatenation are silently missing from the published CSS, even though they may appear to work in development.

```tsx
// ✅ Correct — every class is a complete string
const surfaceMap = { STANDARD: 'bg-white', GLASS: 'bg-white/70 backdrop-blur-xl' }

// ❌ Wrong — Tailwind never sees these
const cls = `bg-${color}-500`
const fallback = `${mediaPrefix}:bg-white`
```

### React 18 Compatibility

Sailwind supports React 18 and 19 and is used alongside Appian code on React 18. Development runs on React 19, so tests won't catch these. Don't use:

- `inert={boolean}`. React 18 drops it. Use `inert={hidden ? '' : undefined}`.
- `ref` as a plain prop on function components. Use `React.forwardRef`.
- `use()`, `useActionState`, `useOptimistic`, `useFormStatus`, or form `action` functions
- `<Context>` as a provider. Use `<Context.Provider>`.

### Scoped CSS

`src/index.css` ships to every consumer. Prefix custom classes with `sw-`. Never write rules whose selectors target generic elements or utilities (`svg`, `button`, `.group`) without a `sw-` class, because they'll affect consumers' own markup. Scope `prefers-reduced-motion` overrides to Sailwind's own classes too.

### Exports

A new component, hook, or utility that consumers need must be exported from `src/components/index.ts` or `src/index.ts`. Code that only runs inside a story isn't a feature consumers can use.

### User-Facing Text (i18n)

Don't hardcode strings the library shows to users (button labels, ARIA labels, status text, empty states, screen reader announcements). Route them through the translation catalog:

1. Add a key to `KEYS` in `src/i18n/keys.ts` (`component.camelCaseName`).
2. Add the English text to `src/i18n/bundles/components.properties`.
3. Read it with `const { t } = useI18n()` and `t(KEYS.yourKey)`.

Use one interpolated phrase (`{0} of {1}`) instead of concatenating fragments, because word order varies by language. `Paging` is the reference example. Text passed in by consumers as props doesn't need keys.

If you add a parameter to a component that has a folder in `appian-plugin/i18n/designer/`, add its name and description to that bundle as well.

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

### Toggle (switch for boolean input — a!toggleField)
```tsx
<ToggleField choiceLabel="Enable Notifications" value={true} saveInto={setValue} />
```

### ButtonToggle (button-style on/off toggle)
```tsx
<ButtonToggle text="Bold" icon="bold" style="SOLID" value={pressed} saveInto={setPressed} />
```

## Validation

Run `pnpm run check` before considering work complete. It runs the same checks as CI: typecheck, lint, unit and Storybook tests (including accessibility), designer bundle validation, and the library build.

New behavior needs tests, and new props, values, or states need a story. Stories that open overlays should start closed and open from a trigger.

## Resources

- **TAILWIND-SAIL-MAPPING.md** — Complete Tailwind/SAIL mapping reference
- **CONTRIBUTING.md** — Architecture, principles, and detailed guidelines
- **docs/ai-review.md** — Pre-PR review prompt for a fresh session
- **SAIL Official Docs** — https://docs.appian.com/suite/help/25.3/
- **Radix UI** — https://www.radix-ui.com/
- **Tailwind CSS** — https://tailwindcss.com/
