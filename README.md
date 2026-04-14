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

### Using Images

If your components need the included icons, reference them like this:

```tsx
import iconApp from '@pglevy/sailwind/images/icon-app.svg'
import iconInterface from '@pglevy/sailwind/images/icon-interface.svg'

<img src={iconApp} alt="App icon" />
```

Available images:
- `icon-app.svg`
- `icon-appian-header.png`
- `icon-expression-rule.svg`
- `icon-interface.svg`
- `icon-record-type.svg`

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
pnpm run build:lib         # Build the npm package (dist/) + generate tokens
pnpm run build:tokens      # Generate and validate dist/tokens.json only
pnpm run build-storybook   # Build the Storybook site (storybook-static/)
pnpm run lint              # Run ESLint
```

### Design Tokens

Sailwind ships a `tokens.json` file with all design tokens in [W3C DTCG 2025.10](https://www.w3.org/community/reports/design-tokens/CG-FINAL-format-20251028/) format. It's generated from the CSS theme and SAIL type definitions as part of the build.

The file is available in two places:
- `dist/tokens.json` — included in the npm package (`@pglevy/sailwind/tokens.json`)
- `public/tokens.json` — committed to the repo for raw GitHub access

Tokens cover colors (Aurora palette + semantic aliases), typography (font families, weights, text sizes), spacing (margins, radius), and gradients (header gradient).

See `scripts/README.md` for details on the generation and validation pipeline.

### Project Structure

```
src/
├── components/         # SAIL components (Button, Card, Dropdown, etc.)
│   └── */              # Each component has its own directory with stories
├── stories/
│   ├── pages/          # Full page examples (realistic Appian interfaces)
│   └── patterns/       # Common UI patterns (forms, grids, data displays)
├── types/              # Shared TypeScript types (SAILSize, SAILAlign, etc.)
└── index.css           # Tailwind v4 theme configuration
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
- **[TAILWIND-SAIL-MAPPING.md](TAILWIND-SAIL-MAPPING.md)** — Tailwind to SAIL style mappings
- **[CONTRIBUTING.md](CONTRIBUTING.md)** — How to contribute to the project
- **[AGENTS.md](AGENTS.md)** — Guidance for AI agents working with the library
- **[SAIL Docs](https://docs.appian.com/suite/help/25.3/)** — Official Appian SAIL reference

## License

MIT
