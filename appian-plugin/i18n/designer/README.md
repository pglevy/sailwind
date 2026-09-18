# Appian designer-translation bundles (`_en_US`)

These are **Appian design-time** (`Designer_Translation`) resource bundles for the
Sailwind SAIL components, authored per Appian's Component Plug-in
internationalization conventions. They satisfy **Requirement 7** of the
`component-i18n` spec (task 14.1).

> **Scope note.** Sailwind is primarily a React component library; it does not
> yet have a real Appian plug-in build. This directory is a **pragmatic,
> documented representation** of the designer bundles a downstream Appian
> Component Plug-in build would ship. A real plug-in build must reconcile the
> assumptions listed at the bottom of this file (rule-names, component-version
> folder layout, `appian-plugin.xml` manifest, and the packaging-validation
> step tracked separately as task 14.2).

## Two distinct bundle families — do not confuse them

| Family | Audience | Location | Naming | Resolved by |
| --- | --- | --- | --- | --- |
| **User_Translation** (runtime) | End users | [`src/i18n/bundles/`](../../../src/i18n/bundles/) | `<BundleName>_<locale>.properties` (e.g. `components.properties`) | Sailwind's runtime `I18nLookup` |
| **Designer_Translation** (design-time) | Appian designers | **this directory** | `<rule-name>_<language_code>.properties` (e.g. `paging_en_US.properties`) | Appian platform at design time (never by the runtime `I18nLookup`) |

The runtime bundles drive the text end users see inside a rendered component.
The designer bundles in this directory drive the friendly **component name**,
**component description**, and each **parameter's name and description** shown to
Appian designers in the component palette, the configuration pane, and in-line
documentation. They are never loaded by Sailwind's runtime lookup.

## Layout

One folder per component, standing in for the plug-in's
[component-version folder](https://docs.appian.com/suite/help/latest/reference-structure.html).
Each folder holds that component version's required default (`_en_US`) bundle:

```
appian-plugin/i18n/designer/
├── README.md
├── paging/       paging_en_US.properties
├── buttonWidget/ buttonWidget_en_US.properties
├── progressBar/  progressBar_en_US.properties
├── readOnlyGrid/ readOnlyGrid_en_US.properties
├── stampField/   stampField_en_US.properties
└── imageField/   imageField_en_US.properties
```

Additional languages are added by copying a bundle to `<rule-name>_<code>.properties`
(e.g. `paging_es.properties`) alongside the `_en_US` default (Requirement 7.4:
a designer whose language has no matching bundle falls back to `_en_US`;
Requirement 7.5: any individual missing entry falls back to its `_en_US` value).

## Key convention (Appian standard)

Adopted verbatim from Appian's
[Internationalization bundles](https://docs.appian.com/suite/help/latest/reference-manifest.html#internationalization-bundles)
reference. Because each file is scoped to a single component (via its filename
`<rule-name>_en_US.properties`), the component's own strings use the bare
`name` / `description` keys:

```properties
# Component (this file's rule)
name=Friendly Component Name
description=What the component is and when to use it.

# input-only or event parameters
parameter.<paramName>.name=Friendly Parameter Name
parameter.<paramName>.description=What the parameter does; optionality/default; valid values.

# input-output parameters (paired value/save-into)
parameter.<paramName>Value.name=Friendly Input Name
parameter.<paramName>SaveInto.name=Friendly Output Name
parameter.<paramName>.description=What the parameter does.
```

Conventions followed:

- **Component friendly names** use proper casing with spaces and drop the
  `Field` / `DisplayField` suffix (e.g. `stampField` → `Stamp`, `imageField` →
  `Image`), per Appian guidance.
- **Parameter friendly names** use proper casing with spaces (e.g.
  `labelPosition` → `Label Position`).
- **Descriptions** briefly state the purpose, note whether the parameter is
  optional and its default, and list valid values for enumerated types.
- **Unicode:** `en_US` values here are plain ASCII, so no escaping is needed.
  Non-`en_US` bundles must express non-ASCII characters as escaped Unicode
  (e.g. `\u00FC`), or Appian will not render them correctly.

## Parameter selection (assumptions)

Parameters were enumerated from each component's public `Props` interface in
`src/components/`. The following modeling decisions were applied consistently:

- **Excluded `className`** — every component documents this as *"not part of the
  SAIL API"* (a prototype-only Tailwind escape hatch), so it is not a designer-
  facing parameter.
- **Excluded `onClick`** on the Button — it is documented as a React-style alias
  of `saveInto`; only the SAIL parameter `saveInto` is surfaced.
- **Event/save callbacks** (`saveInto`, `onPageChange`) are modeled as
  parameters with `.name` + `.description`.
- **Input-output pairs** use the paired `Value` / `SaveInto` form. The Read-Only
  Grid's `selectionValue` (input) + `selectionSaveInto` (output) are modeled as a
  single input-output parameter with base name `selection`, so the description
  key is `parameter.selection.description`.
- The Read-Only Grid's column definitions are provided in the library via the
  React `children` prop; in SAIL terms this is the **`columns`** parameter, so it
  is keyed as `parameter.columns.*` here.

## Components without their own designer bundle

- **`FieldLabel`** (`src/components/shared/FieldLabel.tsx`) is a public React
  export but **not** a standalone SAIL component — SAIL has no free-standing
  "field label" rule. Its `label` / `labelPosition` / `helpTooltip` /
  `required` affordances surface as **parameters on each field component**
  (Image, Stamp, Progress Bar, Read-Only Grid, ...), so it is intentionally not
  given its own `_en_US` designer bundle. Its runtime `help` / `required`
  aria-label strings are handled by the User_Translation bundle instead.

## Assumptions a real plug-in build must reconcile

1. **Rule-names.** No Appian plug-in exists yet, so rule-names were derived from
   the component source names (`paging`, `buttonWidget`, `progressBar`,
   `readOnlyGrid`, `stampField`, `imageField`). The real plug-in's
   `appian-plugin.xml` manifest is the source of truth for these; filenames are
   case-sensitive and must match.
2. **Component-version folders.** Appian nests each bundle inside a versioned
   component folder. Here each component has a single folder representing its
   current version (library version `0.19.0`). A real build maps these to the
   plug-in's actual component-version directory structure.
3. **Manifest & packaging.** `appian-plugin.xml`, the component JS bundles, and
   the ZIP structure are out of scope for this task and do not exist yet.
4. **Deployment gate.** Requirement 7.3 (fail the build when a component version
   is missing a complete `_en_US` bundle) is enforced by a separate
   packaging-validation step, tracked as task 14.2 — not by this directory.

## Packaging validation

A validation gate enforces that every component-version folder here ships a complete default (`_en_US`) designer bundle (Requirement 7.3).

Run it with:

```
pnpm run validate:designer-bundles
```

The script (`scripts/validate-designer-bundles.mjs`) exits non-zero and names the offending component version if any `_en_US` bundle is missing or incomplete (missing/empty component `name` or `description`, or any parameter lacking a matching `.name`/`.description`, accounting for the input-output `Value`/`SaveInto` pairing convention). On success it prints an OK summary. If the designer directory is absent it exits 0 (optional downstream artifact).
