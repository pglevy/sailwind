# Sailwind

[![npm version](https://img.shields.io/npm/v/@pglevy/sailwind)](https://www.npmjs.com/package/@pglevy/sailwind)

A React component library for vibe coding that speaks Appian SAIL

## Overview

Sailwind provides React components that mirror Appian SAIL parameter names and conventions. Components use exact SAIL syntax (`size="STANDARD"`, `color="ACCENT"`) so prototype code translates almost directly to production SAIL.

Built on Radix UI primitives, Tailwind CSS, and TypeScript.

## For Prototypers

Use the **[sailwind-starter](https://github.com/pglevy/sailwind-starter)** template to start building prototypes. It comes pre-configured with Sailwind and is ready for LLM-assisted development (Kiro, Cursor, Claude Code, etc.).

Browse the **[Component Reference](https://pglevy.github.io/sailwind/)** to see what's available.

### Installation

```bash
pnpm add @pglevy/sailwind
```

### Peer Dependencies

Sailwind requires React 18 or 19 as a peer dependency:

```bash
pnpm add react react-dom
```

Supported versions:
- `react` — `^18.0.0 || ^19.0.0`
- `react-dom` — `^18.0.0 || ^19.0.0`

These are listed as `peerDependencies` in the package, so your project needs to provide them.

### Setup

Import the CSS in your main entry file (e.g., `main.tsx` or `App.tsx`):

```tsx
import '@pglevy/sailwind/index.css'
```

If you're using Tailwind CSS in your project and want Tailwind to detect utility classes used by Sailwind components, add a `@source` directive to your CSS:

```css
@import "@pglevy/sailwind/index.css";
@source "../node_modules/@pglevy/sailwind/dist";
```

This ensures Tailwind scans Sailwind's compiled output for class names. The `@import` brings in the theme tokens, base styles, and pre-built utility classes, while `@source` lets your project's Tailwind build include any additional classes it discovers.

### Using Images

The `ApplicationHeader` component includes all its icon assets as embedded data URIs — no image copying or configuration needed. Icons render automatically based on the `objectType` prop, and you can override them via `iconSrc` and `appianLogoSrc` if needed.

## Internationalization (i18n)

i18n is opt-in and fully backward-compatible. With no provider in the tree, every component renders the same English text as before — existing prototypes need no changes.

### Providing a locale

Wrap your app (or just a subtree) in `LocaleProvider` and read the active locale/translations via the `useI18n()` / `useLocale()` hooks:

```tsx
import { LocaleProvider, useI18n } from '@pglevy/sailwind'

<LocaleProvider locale="en-US">
  <App />
</LocaleProvider>
```

Inside Appian, the locale is picked up automatically from the Appian client. The `locale` prop and its default (`en-US`) are there for Storybook and standalone use outside Appian.

### Locale-aware formatting

`formatDate` and `formatNumber` are exported helpers (built on `Intl`) for formatting dates and numbers correctly for the active locale.

### Adding a locale (contributors)

1. Drop a `components_<locale>.properties` file into `src/i18n/bundles/` (Appian-convention `.properties`, keyed by the `_<locale>` filename suffix).
2. Add the normalized code to `SUPPORTED_LOCALES` in `src/i18n/keys.ts`.

No other code changes are needed — the bundle loader auto-discovers the new file, and it shows up in the Storybook locale picker.

> v1 ships `en-US` only. A temporary, unreviewed Spanish (`es`) bundle is included purely as a smoke-test fixture for manually verifying locale switching — it isn't a reviewed translation.

### Storybook

Use the Locale toolbar (globe icon) to switch locales and see components re-render. The a11y addon's Accessibility panel runs per-story, so you can check each locale for accessibility issues too.

## For Contributors

### Setup

```bash
git clone https://github.com/pglevy/sailwind.git
cd sailwind
pnpm install
```

### Development

Storybook is the primary development environment:

```bash
pnpm run storybook     # Start Storybook at http://localhost:6006
```

Every component has a `.stories.tsx` file for documentation and interactive testing. When adding or modifying components, update the corresponding stories.

### Build

```bash
pnpm run generate:css      # Generate CSS custom properties from tokens/tokens.json
pnpm run build:tokens      # Generate and validate dist/tokens.json
pnpm run build:lib         # Build the npm package (dist/) + generate tokens
pnpm run build-storybook   # Build the Storybook site (storybook-static/)
pnpm run lint              # Run ESLint
```

### Design Tokens

Sailwind's design tokens live in `tokens/tokens.json` as the single source of truth, using [W3C DTCG 2025.10](https://www.w3.org/community/reports/design-tokens/CG-FINAL-format-20251028/) format. The token file covers colors, typography (text sizes, font families, weights), spacing (margins, padding, radius), and gradients.

From that source file, two things are generated:
- **CSS custom properties** in `src/index.css` — via `pnpm run generate:css`
- **Distributable tokens** in `dist/tokens.json` and `public/tokens.json` — via `pnpm run build:tokens` (adds semantic color aliases on top of the source)

The distributable file is available in two places:
- `dist/tokens.json` — included in the npm package (`@pglevy/sailwind/tokens.json`)
- `public/tokens.json` — committed to the repo for versioned CDN access

> ⚠️ **Do not remove `public/tokens.json` from the repo.** External tools (Kiro skills, Aurora) fetch tokens at runtime from the jsdelivr CDN, which serves files directly from this path on the `main` branch.

You can access the latest version here:
```
https://cdn.jsdelivr.net/gh/pglevy/sailwind@latest/public/tokens.json
```

Or a specific version here:
```
https://cdn.jsdelivr.net/gh/pglevy/sailwind@0.10.2/public/tokens.json
```

#### Token Editor

A standalone visual editor for design tokens runs alongside Storybook:

```bash
pnpm run token-server      # Start the token editor at http://localhost:3001
```

Edit colors, typography, and spacing values in the browser. Saving writes back to `tokens/tokens.json` and regenerates the CSS, which Storybook picks up via HMR.

See `scripts/README.md` for details on the generation and validation pipeline.

### Project Structure

```
tokens/
└── tokens.json             # Source of truth for all design tokens (DTCG format)
src/
├── components/             # SAIL components (Button, Card, Dropdown, etc.)
│   └── */                  # Each component has its own directory with stories
├── stories/
│   ├── pages/              # Full page examples (realistic Appian interfaces)
│   └── patterns/           # Common UI patterns (forms, grids, data displays)
├── types/                  # Shared TypeScript types (SAILSize, SAILAlign, etc.)
└── index.css               # Tailwind v4 theme (generated from tokens)
scripts/
├── generate-css.ts         # tokens/tokens.json → CSS custom properties
├── generate-tokens.ts      # tokens/tokens.json → dist + public (with semantic aliases)
├── validate-tokens.ts      # DTCG format validation
├── token-server.ts         # Dev server for the visual token editor
└── token-editor.html       # Standalone token editor UI
```

### Publishing to npm

```bash
pnpm run build:lib
pnpm publish --access public
```

See [PUBLISHING.md](PUBLISHING.md) for detailed release instructions.

## Component Comparison

**React (Sailwind):**
```tsx
<TagField
  size="STANDARD"
  tags={[
    { text: "URGENT", backgroundColor: "#FED7DE", textColor: "#9F0019" }
  ]}
/>
```

**SAIL (Production):**
```sail
a!tagField(
  size: "STANDARD",
  tags: {
    a!tagItem(text: "URGENT", backgroundColor: "#FED7DE", textColor: "#9F0019")
  }
)
```

## Documentation

- **[Component Reference](https://pglevy.github.io/sailwind/)** — Live Storybook with all components
- **[Internationalization (i18n)](#internationalization-i18n)** — Providing a locale, formatting helpers, and adding a new locale
- **[TAILWIND-SAIL-MAPPING.md](TAILWIND-SAIL-MAPPING.md)** — Tailwind to SAIL style mappings
- **[CONTRIBUTING.md](CONTRIBUTING.md)** — How to contribute to the project
- **[AGENTS.md](AGENTS.md)** — Guidance for AI agents working with the library
- **[SAIL Docs](https://docs.appian.com/suite/help/25.3/)** — Official Appian SAIL reference

## License

MIT
