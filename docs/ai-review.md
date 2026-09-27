# AI review before opening a pull request

Use this to get an AI code review of your branch before you open a PR. The review should run in a **fresh session**: a new chat, or a different tool or model from the one that wrote the code. A session that built the change tends to approve its own decisions, and a clean one sees the diff the way a reviewer will.

## How to use it

1. Commit your work on your branch.
2. Open a new session in your AI tool (Kiro, Claude Code, Cursor, etc.) at the repo root.
3. Paste the prompt below.
4. Take the findings back to your working session. Fix them, or decide a finding doesn't apply and write down why.
5. If you made significant changes, run the review again in another fresh session.
6. Add a short summary to your PR description: what the review found, what you fixed, and anything you decided to leave.

The review is a helper, not a gate. You still decide what goes in the PR, and the maintainer still reviews it.

## The prompt

Copy everything in the block below.

```text
You are reviewing a pull request for Sailwind, a shared React component library used by
many prototypes and alongside production Appian code. You did not write this code. Your
job is to find problems before a human reviewer does. Do not edit any files; report only.

1. Read AGENTS.md and CONTRIBUTING.md for the project's rules.
2. Review the changes on this branch: run `git diff main...HEAD` and `git log main..HEAD`.
   Read the full source of any file where the diff alone isn't enough context.
3. Run `pnpm run check` and report any failures.

Check for each of the following, and verify by running or building where you can rather
than only reading:

- Breaking changes: changed default values; renamed or removed components, props, values,
  types, or exports; visible changes to default appearance; changed element types, ARIA
  roles, or data attributes. For each, is it necessary, and could it be additive instead?
- Scope: does the PR do one thing? List unrelated changes that could be separate PRs.
- Shared-library fit: app-specific names, content, or data; features only one project
  would use; new code that duplicates an existing component, helper, or pattern.
- Consistency: does it match how similar components handle props, labels, margins,
  colors, and stories?
- SAIL: SAIL-style naming and UPPERCASE values. Note any props or values not in SAIL,
  and whether they're mentioned in doc comments.
- Tailwind: any class names built from template strings or concatenation. These are
  missing from the published CSS. Build with `pnpm run build:lib` and confirm that new
  classes appear in dist/index.css.
- React 18: `inert` as a boolean, `ref` as a plain prop, `use()`, `useActionState`,
  `useOptimistic`, `useFormStatus`, form actions, or `<Context>` as a provider.
- CSS: global rules in src/index.css that aren't scoped to `sw-` classes, or that could
  affect consumers' own markup.
- Accessibility: keyboard access, visible focus, state conveyed by more than color,
  contrast, reduced motion, correct ARIA. Flag anything automated tests can't confirm.
- i18n: hardcoded user-facing strings (labels, ARIA labels, status text, announcements)
  that should go through KEYS and the properties bundle.
- Exports: new components or utilities that consumers need but that aren't exported.
- Stories and tests: new behavior without tests; new props or states without stories;
  stories that open overlays on load.
- Docs: README or other docs that need updating for this change.

Report findings grouped as:
- Must fix: bugs, breaking changes without justification, failing checks.
- Should fix: likely problems and inconsistencies.
- Questions: decisions the author should be ready to explain.

For each finding give the file and line, what's wrong, why it matters, and a suggested
fix. Keep it plain; the author may not be an experienced developer. End with what you
verified by running things and what you only checked by reading.
```
