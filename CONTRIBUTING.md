# Contributing to Sailwind

Thanks for helping out. Contributions are welcome from developers and designers alike, and AI-assisted contributions are welcome too. This guide explains how the project works, what we look for in a pull request, and how to get the most out of your AI tools along the way.

If you're using an AI assistant, it reads [AGENTS.md](AGENTS.md) automatically. That file covers the technical rules. This one covers the expectations.

## Start here

### This is a shared library

Sailwind is used by many prototypes across many teams, and increasingly alongside real Appian code. Anything you change here shows up in every one of those projects the next time they upgrade.

That shapes most of the guidance below:

- **Build for everyone, not just your project.** If a feature only makes sense in your prototype, it probably belongs in your prototype. Components accept a `className` prop for one-off styling.
- **Assimilating from a prototype is great.** Before you do, generalize it: remove app-specific names, content, and sample data, and make it configurable only as far as a second project would reasonably need.
- **Adding is easy, changing is expensive.** A new prop or option affects no one until they opt in. Changing how an existing prop behaves affects everyone. See [Breaking changes](#breaking-changes).

### Think about the library as a whole

Before building something new, look at what's already here:

- Is there a component you could extend instead of creating a new one?
- Is there a similar component whose patterns you should match (prop names, how labels and margins work, how stories are structured)?
- Is there a shared utility that already does this? Check `src/utils/` (color resolution, SAIL-to-Tailwind maps), `src/components/shared/` (labels, field wrappers), and `src/types/sail.ts`.

If you change something shared, you're changing every component that uses it. Check those components in Storybook too.

### SAIL is the starting point, not the limit

Sailwind started by mirroring the Appian SAIL API so that prototype code translates to production. That's still the default:

- When SAIL has the component or parameter, use SAIL's names and values.
- Follow SAIL's naming style for everything, including new props: UPPERCASE values (`"STANDARD"`, `"ACCENT"`), and SAIL-style prop names (`marginBelow`, `labelPosition`).

It's fine to go beyond SAIL. This library can move faster than SAIL does, and new props, values, and components are welcome. When you add something SAIL doesn't have, it helps to mention it in the prop's doc comment (for example, "Not in SAIL"), so people converting a prototype know what to watch for.

## How contributions work

1. **Open an issue first for new components.** Describe the problem, where you'd use it, and a rough API. This lets us agree on direction before you invest time. Bug fixes and small improvements to existing components can go straight to a pull request. For changes to existing behavior, an issue is a good idea too.
2. **Fork the repo and create a branch** for your change.
3. **Build and preview in Storybook** (`pnpm run storybook`). Every component has stories, and new behavior needs one.
4. **Run the checks** with `pnpm run check`. This is what CI runs.
5. **Get an AI review in a fresh session** before opening your PR. See [AI-assisted contributions](#ai-assisted-contributions).
6. **Open a pull request** against `main`. The template asks for a summary, any breaking changes, and your review results. Add a screenshot to your PR! (You can paste into GitHub directly from the clipboard.) It makes it easier to quickly grasp the intent and implications of the changes.

### Keep pull requests focused

One concern per PR. A PR that adds a new component, reworks CSS, and changes a shared utility is hard to review and hard to merge, because one open question holds up everything else. If your work grew into several things, split it. Smaller PRs get merged faster.

## Guidelines

### Breaking changes

A change is breaking if existing code using Sailwind would look or behave differently after upgrading, without the author changing anything. That includes:

- Removing or renaming a component, prop, type, or export
- Changing a prop's default value
- Removing an allowed value, or changing what a value does
- A noticeable change to a component's default appearance or layout
- Changing rendered structure that people rely on, such as ARIA roles, element types, or `data-*` attributes
- Using an API that doesn't work in React 18 (see below)

Prefer the additive route: add a new prop or value and keep the existing default. If a breaking change really is the right call:

- Say so in the PR and explain why it's worth it.
- Where practical, deprecate first. Keep the old prop or value working, mark it `@deprecated` in its doc comment with a pointer to the replacement, and remove it in a later release.

While Sailwind is pre-1.0, breaking changes ship in a minor release (for example `0.19.0` → `0.20.0`) and are called out at the top of the release notes. The maintainer decides when they go out.

### React 18 and 19

Sailwind supports React 18 and 19, and it's used alongside Appian code that runs on React 18. Development happens on React 19, so tests won't catch React 19-only code. Avoid:

- `inert` as a boolean prop (React 18 ignores it). Use `inert={isHidden ? '' : undefined}`.
- `ref` as a regular prop on function components. Use `React.forwardRef`.
- `use()`, `useActionState`, `useOptimistic`, `useFormStatus`, and form `action` functions
- Rendering `<SomeContext>` directly as a provider. Use `<SomeContext.Provider>`.

### Tailwind class names must be complete strings

Tailwind finds classes by scanning the source for complete class names. Classes assembled at runtime (`` `${prefix}:bg-white` ``, `` `bg-${color}-500` ``) won't be generated, and the style silently does nothing in the published package. Write each class out in full, typically in a lookup map:

```tsx
// ✅ Tailwind can find these
const bgMap = { ACCENT: 'bg-blue-500', POSITIVE: 'bg-green-700' }

// ❌ Tailwind never sees "bg-blue-500"
const bg = `bg-${color}-500`
```

### Keep CSS scoped

Global CSS in `src/index.css` ships to every consumer. Prefix custom classes with `sw-`, and don't write rules that target generic selectors (`svg`, `.group`, `button`) on their own. Those will affect people's own markup, not just Sailwind components.

### Accessibility

All components must meet WCAG 2.2 AA. In practice:

- Everything interactive works with a keyboard and has a visible focus state.
- State is never conveyed by color alone.
- Text meets contrast requirements (4.5:1 for body text).
- Animation respects `prefers-reduced-motion`.
- Prefer Radix primitives for complex interactive components (dialogs, menus, tabs, tooltips). They handle most of this for you.

Storybook's accessibility checks run as part of `pnpm test`, and violations fail the build. Automated checks catch a lot but not everything, so try new interactions with a keyboard, and with a screen reader if you can.

### User-facing text and i18n

Sailwind supports localization. Text that the library itself shows to users (button labels, ARIA labels, empty states, status text) goes through the translation catalog rather than being hardcoded. Text that consumers pass in as props doesn't.

To add a library-owned string:

1. Add a key to `KEYS` in `src/i18n/keys.ts`, using the `component.camelCaseName` format (for example `milestone.stepCompleted`).
2. Add the English text to `src/i18n/bundles/components.properties`. With no `LocaleProvider`, components render this default, so it should match what you'd have hardcoded.
3. Read it in the component with `const { t } = useI18n()` and `t(KEYS.yourKey)`.

For phrases containing values, use a single interpolated phrase (`{0} of {1}`) rather than joining fragments, because word order differs between languages. See how `Paging` does it.

**Adding a locale:** drop a `components_<locale>.properties` file into `src/i18n/bundles/`, and add the normalized code to `SUPPORTED_LOCALES` in `src/i18n/keys.ts`. The bundle loader discovers the file automatically, and it appears in the Storybook locale picker.

**Appian designer bundles:** `appian-plugin/i18n/designer/` holds the design-time names and descriptions for some components' parameters. If you add a parameter to one of those components, add its entries there too. `pnpm run validate:designer-bundles` checks that each bundle is complete. See that folder's README for the conventions.

### Stories and tests

- Every new component, prop value, or state needs a story. Stories are the documentation.
- New behavior needs tests. Unit tests sit next to the component (`ComponentName.test.tsx`) and use Vitest and Testing Library. Stories can also carry `play` functions for interaction tests.
- Stories that open overlays (dialogs, menus) should start closed and open from a trigger. Otherwise they cover the whole docs page.

## AI-assisted contributions

AI tools are a great way to contribute, including if you're newer to development. A few things make it go smoothly:

**You're the author.** Your name is on the PR, so you should understand what it changes and why. If something in the diff doesn't make sense to you, ask your assistant to explain it, or ask in the PR. Unexplained code is the most common reason a PR stalls.

**Let the agent ask questions.** [AGENTS.md](AGENTS.md) tells agents to stop and check with you before risky changes, such as changing a default or editing shared code. When that happens, take the question seriously. It usually marks a decision the reviewer will ask about too.

**Separate building from reviewing.** The session that wrote the code is the worst one to review it, because it tends to confirm its own choices. Before opening a PR:

1. Start a **fresh session** (new chat, or a different tool or model).
2. Give it the review prompt in [docs/ai-review.md](docs/ai-review.md). It reviews your branch's diff against a checklist based on the issues we see most often, and runs the checks.
3. Take the findings back to your working session and fix them, or decide they're fine and note why.
4. Include a short summary of the review in your PR description.

The goal is for human review to focus on intent and design, not on things a tool could have caught.

## Technical reference

### Stack

- **Primitives:** [Radix UI](https://www.radix-ui.com/) (unstyled, accessible)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) v4 with the Aurora color palette, driven by design tokens
- **Language:** TypeScript (required)
- **Build:** Vite, with Storybook for development and docs
- **Tests:** Vitest, Testing Library, Storybook interaction and accessibility tests
- **React:** 18 or 19 (peer dependency). Development uses 19.

Radix was chosen because it's fully unstyled, which leaves full control over SAIL aesthetics, has strong accessibility built in, and has a simple API that AI tools handle well.

### Setup

```bash
git clone https://github.com/<your-username>/sailwind.git
cd sailwind
pnpm install
pnpm exec playwright install chromium   # needed for Storybook tests
```

### Commands

```bash
pnpm run storybook         # Develop in Storybook at http://localhost:6006
pnpm run check             # Everything CI runs: typecheck, lint, tests, designer bundles, library build
pnpm run test:unit         # Unit tests only (faster)
pnpm run typecheck         # TypeScript
pnpm run lint              # ESLint
pnpm run build:lib         # Build the npm package into dist/
pnpm run token-server      # Visual token editor at http://localhost:3001
```

### Project structure

```
tokens/
└── tokens.json             # Source of truth for design tokens (DTCG format)
src/
├── components/             # One folder per component, each with stories
├── i18n/                   # Localization: provider, hooks, keys, string bundles
├── stories/
│   ├── pages/              # Full page examples (realistic Appian interfaces)
│   └── patterns/           # Common UI patterns (forms, grids, data displays)
├── types/                  # Shared TypeScript types (SAILSize, SAILAlign, etc.)
├── utils/                  # Shared helpers (color resolution, SAIL maps)
└── index.css               # Tailwind v4 theme (partly generated from tokens)
appian-plugin/i18n/         # Appian design-time translation bundles
scripts/                    # Token generation, validation, and the token editor
```

### Component architecture

**Two layers.** Props are the public API and use SAIL-style names and UPPERCASE values. Internally, components map those values to Tailwind classes. Consumers never pass Tailwind classes to control SAIL behavior.

```tsx
// Layer 1: the API
<ButtonWidget size="STANDARD" style="SOLID" color="ACCENT" />

// Layer 2: inside the component
const sizeMap: Record<SAILSize, string> = {
  SMALL: 'px-3 py-1.5 text-sm',
  STANDARD: 'px-4 py-2.5 text-base',
  MEDIUM: 'px-6 py-3 text-lg',
  LARGE: 'px-8 py-4 text-xl'
}
```

**Item + Field.** For grouped elements, SAIL splits individual properties (`TagItem`, `ButtonItem`) from group properties (`TagField`, `ButtonArrayLayout`). Follow the same split.

**Union types for allowed values.** Shared types live in `src/types/sail.ts`. Component-specific types can be defined in the component file.

```tsx
type SAILSize = "SMALL" | "STANDARD" | "MEDIUM" | "LARGE"
type SAILAlign = "START" | "CENTER" | "END"
```

**Colors.** Color props accept semantic names (`"ACCENT"`), palette tokens (`"TEAL_700"`), or hex values. Use `resolveColorClass` and `resolveColorToHex` from `src/utils/colorResolver.ts` rather than writing new color logic. Hex values are applied with inline styles.

```tsx
<TagField tags={[{ text: "NEW", backgroundColor: "ACCENT" }]} />
<TagField tags={[{ text: "URGENT", backgroundColor: "#FED7DE" }]} />
```

**Shared logic, separate exports.** When SAIL has separate components with shared behavior, build one base and export thin wrappers:

```tsx
const NumberFieldBase = ({ numberType, ...props }) => { /* shared logic */ }

export const IntegerField = (props) => <NumberFieldBase numberType="INTEGER" {...props} />
export const DecimalField = (props) => <NumberFieldBase numberType="DECIMAL" {...props} />
```

**File structure.**

```
src/components/Button/
├── ButtonWidget.tsx
├── ButtonArrayLayout.tsx
├── Button.stories.tsx
├── ButtonWidget.test.tsx (when there's behavior to test)
├── index.ts
└── types.ts (optional)
```

New components also need to be exported from `src/components/index.ts`, or consumers can't use them.

### Styling reference

The SAIL-to-Tailwind mappings for text sizes, spacing, shape, and colors are in [TAILWIND-SAIL-MAPPING.md](TAILWIND-SAIL-MAPPING.md). That's the only place they're documented, so link to it rather than copying values into other docs.

### Design tokens

Design tokens live in `tokens/tokens.json` as the single source of truth, in [W3C DTCG 2025.10](https://www.w3.org/community/reports/design-tokens/CG-FINAL-format-20251028/) format. They cover colors, typography, spacing, and gradients.

Two things are generated from that file:

- **CSS custom properties** in the `BEGIN GENERATED` regions of `src/index.css`, via `pnpm run generate:css`. Don't edit those regions by hand; edit the tokens and regenerate.
- **Distributable tokens** in `dist/tokens.json` and `public/tokens.json`, via `pnpm run build:tokens`. These add semantic color aliases on top of the source.

> ⚠️ **Do not remove `public/tokens.json` from the repo.** External tools (Kiro skills, Aurora) fetch tokens at runtime from the jsdelivr CDN, which serves this path from `main`.

The token editor (`pnpm run token-server`) lets you edit tokens in the browser. Saving writes to `tokens/tokens.json` and regenerates the CSS, which Storybook picks up automatically. See `scripts/README.md` for the full pipeline.

### Publishing

Releases are handled by the maintainer. See [PUBLISHING.md](PUBLISHING.md).

## Resources

- [Component Reference](https://pglevy.github.io/sailwind/) (Storybook)
- [AGENTS.md](AGENTS.md): guidance for AI agents
- [docs/ai-review.md](docs/ai-review.md): pre-PR review prompt
- [TAILWIND-SAIL-MAPPING.md](TAILWIND-SAIL-MAPPING.md): Tailwind/SAIL mappings
- [SAIL docs](https://docs.appian.com/suite/help/25.3/)
- [Radix UI](https://www.radix-ui.com/) and [Tailwind CSS](https://tailwindcss.com/)
