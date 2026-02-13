# Sailwind

React component library for prototyping Appian applications with SAIL-compatible syntax.

## Overview

Sailwind provides React components that mirror Appian SAIL parameter names and conventions. Components use exact SAIL syntax (`size="STANDARD"`, `color="ACCENT"`) so prototype code translates almost directly to production SAIL.

Built on Radix UI primitives, Tailwind CSS, and TypeScript.

## For Prototypers

Use the **[sailwind-starter](https://github.com/pglevy/sailwind-starter)** template to start building prototypes. It comes pre-configured with Sailwind and is ready for LLM-assisted development (Kiro, Cursor, Claude Code, etc.).

Browse the **[Component Reference](https://pglevy.github.io/sailwind/)** to see what's available.

## For Contributors

### Setup

```bash
git clone https://github.com/pglevy/sailwind.git
cd sailwind
npm install
```

### Development

Storybook is the primary development environment:

```bash
npm run storybook     # Start Storybook at http://localhost:6006
```

Every component has a `.stories.tsx` file for documentation and interactive testing. When adding or modifying components, update the corresponding stories.

### Build

```bash
npm run build:lib         # Build the npm package (dist/)
npm run build-storybook   # Build the Storybook site (storybook-static/)
npm run lint              # Run ESLint
```

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
npm run build:lib
npm publish --access public
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
- **[CLAUDE.md](CLAUDE.md)** — Instructions for LLM-assisted development
- **[SAIL Docs](https://docs.appian.com/suite/help/25.3/)** — Official Appian SAIL reference

## License

MIT
