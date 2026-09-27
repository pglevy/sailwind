# Sailwind

[![npm version](https://img.shields.io/npm/v/@pglevy/sailwind)](https://www.npmjs.com/package/@pglevy/sailwind)

A React component library for vibe coding that speaks Appian SAIL

## Overview

Sailwind provides React components that follow Appian SAIL parameter names and conventions so prototype code translates closely to production SAIL. Some components go beyond what SAIL offers; those additions are noted in the component docs.

Built on Radix UI primitives, Tailwind CSS, and TypeScript.

## For Prototypers

Use the **[sailwind-starter](https://github.com/pglevy/sailwind-starter)** template to start building prototypes. It comes pre-configured with Sailwind and is ready for AI-assisted development.

Browse the **[Storybook component reference](https://pglevy.github.io/sailwind/components/)** to see what's available.

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

If you're using Tailwind CSS in your project, add a `@source` directive to your CSS:

```css
@import "@pglevy/sailwind/index.css";
@source "../node_modules/@pglevy/sailwind/dist";
```

This ensures Tailwind scans Sailwind's compiled output for class names. The `@import` brings in the theme tokens, base styles, and pre-built utility classes, while `@source` lets your project's Tailwind build include any additional classes it discovers.

### Using Images

Sailwind components take images as URL strings (for example, the `source` of an `ImageField` image), so you can use images from your project or from the web. In a Vite project like [sailwind-starter](https://github.com/pglevy/sailwind-starter), there are two places to put your own images.

**Import from `src/assets/` (the default).** Use this for images your code refers to directly, like an empty-state illustration or a logo:

```tsx
import emptyInbox from '../assets/empty-inbox.svg'

<ImageField
  images={[{ source: emptyInbox, altText: 'Empty inbox' }]}
  size="LARGE"
/>
```

Vite resolves the path wherever the prototype is deployed, and the build fails if the file is missing or the name has a typo.

**Put in `public/` when the path is a string in data.** Use this for images named in mock data (like a `photoUrl` for each user in a JSON file), or files that need a fixed URL, like a favicon. Vite copies `public/` as is, and you refer to the files by path:

```tsx
{ name: 'Jane Doe', photoUrl: 'images/avatars/jane.png' }
```

Leave off the leading slash. Write `images/avatars/jane.png`, not `/images/avatars/jane.png`. Prototypes are often deployed in a subfolder (for example on GitHub Pages), and a leading slash points to the root of the site instead of your prototype. Files in `public/` also aren't checked at build time, so a wrong path only shows up as a broken image.

A rule of thumb: if you `import` it, it goes in `src/assets/`. If you type its path in a string, it goes in `public/`.

Images from external URLs work too, which is handy for quick mockups. They can change or disappear, though, so copy anything you want to keep into your project.

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

To add a locale or a new translatable string, see [User-facing text and i18n](CONTRIBUTING.md#user-facing-text-and-i18n) in CONTRIBUTING.

> v1 ships `en-US` only. A temporary, unreviewed Spanish (`es`) bundle is included purely as a smoke-test fixture for manually verifying locale switching — it isn't a reviewed translation.

### Storybook

Use the Locale toolbar (globe icon) to switch locales and see components re-render. The a11y addon's Accessibility panel runs per-story, so you can check each locale for accessibility issues too.

## Design Tokens

Sailwind's design tokens (colors, typography, spacing, gradients) are published in [W3C DTCG](https://www.w3.org/community/reports/design-tokens/CG-FINAL-format-20251028/) format for use in other tools:

- In the npm package: `@pglevy/sailwind/tokens.json`
- From the CDN, latest: `https://cdn.jsdelivr.net/gh/pglevy/sailwind@latest/public/tokens.json`
- From the CDN, a specific version: `https://cdn.jsdelivr.net/gh/pglevy/sailwind@0.10.2/public/tokens.json`

## Contributing

Contributions are welcome, including AI-assisted ones, from developers and designers alike. Start with [CONTRIBUTING.md](CONTRIBUTING.md). It covers how contributions work, what we look for in a pull request, and how to review your changes with AI before submitting.

New components start with an issue, so we can agree on direction before you build.

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

- **[Component Reference](https://pglevy.github.io/sailwind/components/)** — Live Storybook with all components
- **[Internationalization (i18n)](#internationalization-i18n)** — Providing a locale, formatting helpers, and adding a new locale
- **[TAILWIND-SAIL-MAPPING.md](TAILWIND-SAIL-MAPPING.md)** — Tailwind to SAIL style mappings
- **[CONTRIBUTING.md](CONTRIBUTING.md)** — How to contribute to the project
- **[AGENTS.md](AGENTS.md)** — Guidance for AI agents working with the library
- **[docs/ai-review.md](docs/ai-review.md)** — AI review prompt to run before opening a PR
- **[SAIL Docs](https://docs.appian.com)** — Official Appian SAIL reference

## License

MIT
