# Requirements: Centralize SAIL Enum → Tailwind Class Mappings

GitHub Issue: [#83](https://github.com/pglevy/sailwind/issues/83)

## Big Picture Vision

Sailwind mostly uses existing Tailwind classes to express the Appian SAIL design system, but in the language of SAIL (STANDARD, MORE, EVEN_MORE). Everything is driven from `tokens.json` as the source of truth. The goal is to make it easy to get the Appian look and feel by default, while not limiting designers — they can customize prototypes using Tailwind classes via `className`. LLMs will frequently use Tailwind classes by default, so those need to work too.

## Problem

Each component independently maps SAIL enums (SAILSize, SAILMarginSize, SAILShape, SAILPadding) to Tailwind classes. These maps are hand-rolled and duplicated across 11+ components with no guarantee of consistency or alignment with `tokens.json`.

## Current State (Audit)

### Duplicated Maps

| Map Type | Components | Identical? |
|----------|-----------|-----------|
| marginAboveMap | FieldWrapper, CardLayout, HeadingField, ButtonArrayLayout, TagField, MessageBanner, StampField, RichTextDisplayField, DialogField, ProgressBar, MilestoneField, TabsField | Yes (TabsField uses different variable names) |
| marginBelowMap | Same 12 components | Yes |
| shapeMap | CardLayout, MessageBanner, StampField | Yes |
| buttonSizeMap | ButtonWidget, TabsField, ToggleField | Yes |
| paddingMap | CardLayout only | N/A (single source) |

### Component-Specific Maps (Keep Local)
- StampField — complex `{ container, text, icon }` structure
- ImageField — standard + avatar size variants
- SwitchField — size, label, gap maps
- SliderField — complex track/thumb structure
- HeadingField — extended size scale (EXTRA_SMALL through LARGE_PLUS)
- Icon — numeric pixel sizes

### Existing Shared Infrastructure
- `src/utils/colorResolver.ts` — semantic + palette color resolution (already centralized)
- `src/utils/classNames.ts` — class merging utility
- `src/types/palette-colors.generated.ts` — auto-generated from tokens.json
- `scripts/generate-palette-types.ts` — generation pipeline

## Requirements

### REQ-1: Shared Mapping Module
Create `src/utils/sailMaps.ts` exporting canonical SAIL enum → Tailwind class maps:
- `marginAboveMap: Record<SAILMarginSize, string>`
- `marginBelowMap: Record<SAILMarginSize, string>`
- `paddingMap: Record<SAILPadding, string>`
- `shapeMap: Record<SAILShape, string>`
- `buttonSizeMap: Record<SAILSize, string>`
- `buttonIconOnlySizeMap: Record<SAILSize, string>`
- `alignMap: Record<SAILAlign, string>`
- `textSizeMap: Record<SAILSizeExtended, string>`

### REQ-2: Refactor Components
All 15 components with duplicated maps must import from the shared module instead of defining their own. No visual changes should result.

Components to update:
1. src/components/shared/FieldWrapper.tsx
2. src/components/Card/CardLayout.tsx
3. src/components/Heading/HeadingField.tsx
4. src/components/Button/ButtonWidget.tsx
5. src/components/Button/ButtonArrayLayout.tsx
6. src/components/Tag/TagField.tsx
7. src/components/MessageBanner/MessageBanner.tsx
8. src/components/Stamp/StampField.tsx
9. src/components/RichText/RichTextDisplayField.tsx
10. src/components/Dialog/DialogField.tsx
11. src/components/ProgressBar/ProgressBar.tsx
12. src/components/Milestone/MilestoneField.tsx
13. src/components/Tabs/TabsField.tsx (also standardize variable naming)
14. src/components/Toggle/ToggleField.tsx
15. src/components/SiteNav/SiteNav.tsx (if applicable)

### REQ-3: Token-Driven Generation (Stretch)
Ideally generate `sailMaps.ts` from `tokens.json` via the existing pipeline (`scripts/generate-tokens.ts` or a new script), so token changes automatically produce correct Tailwind mappings. Follow the same pattern as `generate-palette-types.ts`.

### REQ-4: Visual Regression Safety
No visual changes should result from this refactor. Before/after Storybook screenshots should be identical. Consider:
- Running existing tests before and after
- Storybook visual comparison for affected components
- Build verification (`pnpm build`)

### REQ-5: Naming Standardization
Standardize map variable names across all components:
- TabsField currently uses `marginMap` / `marginBottomMap` — should align with `marginAboveMap` / `marginBelowMap` convention
