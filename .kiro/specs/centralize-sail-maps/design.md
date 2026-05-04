# Design: Centralize SAIL Enum → Tailwind Class Mappings

## Approach

### Phase 1: Create Shared Module + Refactor Components
1. Create `src/utils/sailMaps.ts` with all canonical maps
2. Update each component to import from the shared module
3. Remove inline map definitions
4. Standardize naming (TabsField)
5. Verify no visual changes via build + tests

### Phase 2: Token-Driven Generation (Stretch)
1. Extend `tokens.json` with SAIL enum metadata if needed
2. Create or extend a generation script to produce `sailMaps.ts` from tokens
3. Wire into `pnpm run build:tokens` pipeline

## Shared Module Design

```typescript
// src/utils/sailMaps.ts
import type { SAILMarginSize, SAILPadding, SAILShape, SAILSize, SAILSizeExtended, SAILAlign } from '../types/sail'

// --- Margin Maps ---
export const marginAboveMap: Record<SAILMarginSize, string> = {
  NONE: '',
  EVEN_LESS: 'mt-1',
  LESS: 'mt-2',
  STANDARD: 'mt-4',
  MORE: 'mt-6',
  EVEN_MORE: 'mt-8'
}

export const marginBelowMap: Record<SAILMarginSize, string> = {
  NONE: '',
  EVEN_LESS: 'mb-1',
  LESS: 'mb-2',
  STANDARD: 'mb-4',
  MORE: 'mb-6',
  EVEN_MORE: 'mb-8'
}

// --- Padding Map ---
export const paddingMap: Record<SAILPadding, string> = {
  NONE: 'p-0',
  EVEN_LESS: 'p-1',
  LESS: 'p-2',
  STANDARD: 'p-4',
  MORE: 'p-6',
  EVEN_MORE: 'p-8'
}

// --- Shape Map ---
export const shapeMap: Record<SAILShape, string> = {
  SQUARED: 'rounded-none',
  SEMI_ROUNDED: 'rounded-sm',
  ROUNDED: 'rounded-md'
}

// --- Button/Interactive Size Maps ---
export const buttonSizeMap: Record<SAILSize, string> = {
  SMALL: 'px-3 py-2 text-sm leading-none',
  STANDARD: 'px-4 py-3 text-base leading-none',
  MEDIUM: 'px-5 py-4 text-lg leading-none',
  LARGE: 'px-6 py-5 text-xl leading-none'
}

export const buttonIconOnlySizeMap: Record<SAILSize, string> = {
  SMALL: 'p-2 text-sm',
  STANDARD: 'p-3 text-base',
  MEDIUM: 'p-4 text-lg',
  LARGE: 'p-5 text-xl'
}

// --- Text Size Map ---
export const textSizeMap: Record<SAILSizeExtended, string> = {
  SMALL: 'text-xs',
  STANDARD: 'text-base',
  MEDIUM: 'text-lg',
  MEDIUM_PLUS: 'text-xl',
  LARGE: 'text-2xl',
  LARGE_PLUS: 'text-3xl',
  EXTRA_LARGE: 'text-4xl'
}

// --- Alignment Map ---
export const alignMap: Record<SAILAlign, string> = {
  START: 'justify-start',
  CENTER: 'justify-center',
  END: 'justify-end'
}
```

## Component Refactor Pattern

Before:
```typescript
// Inside component function
const marginAboveMap: Record<SAILMarginSize, string> = {
  NONE: '', EVEN_LESS: 'mt-1', LESS: 'mt-2', STANDARD: 'mt-4', MORE: 'mt-6', EVEN_MORE: 'mt-8'
}
```

After:
```typescript
// At top of file
import { marginAboveMap, marginBelowMap } from '../../utils/sailMaps'
// No local definition needed — use imported maps directly
```

## Risk Mitigation

### Visual Regression
- Run `pnpm build` before and after to catch TypeScript errors
- Run `pnpm test` before and after to catch behavioral regressions
- Manually verify Storybook for each affected component category (buttons, cards, text, stamps, etc.)
- This is a pure refactor — no logic changes, no value changes

### Incremental Approach
- Can be done component-by-component if needed
- Each component update is independently verifiable
- FieldWrapper is the highest-impact single change (used by ~10 form components)

## Files Changed

### Created
- `src/utils/sailMaps.ts`

### Modified (15 components)
- FieldWrapper, CardLayout, HeadingField, ButtonWidget, ButtonArrayLayout, TagField, MessageBanner, StampField, RichTextDisplayField, DialogField, ProgressBar, MilestoneField, TabsField, ToggleField, SiteNav
