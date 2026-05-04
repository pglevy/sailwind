# Tasks: Centralize SAIL Enum → Tailwind Class Mappings

## Phase 1: Create Shared Module + Refactor

- [ ] Task 1: Create `src/utils/sailMaps.ts` with all canonical maps (marginAboveMap, marginBelowMap, paddingMap, shapeMap, buttonSizeMap, buttonIconOnlySizeMap, textSizeMap, alignMap)
- [ ] Task 2: Refactor FieldWrapper to import from sailMaps (highest impact — used by ~10 form components)
- [ ] Task 3: Refactor CardLayout to import margin, padding, and shape maps from sailMaps
- [ ] Task 4: Refactor HeadingField to import margin maps from sailMaps
- [ ] Task 5: Refactor ButtonWidget to import buttonSizeMap and buttonIconOnlySizeMap from sailMaps
- [ ] Task 6: Refactor ButtonArrayLayout to import margin maps from sailMaps
- [ ] Task 7: Refactor TagField to import margin maps from sailMaps
- [ ] Task 8: Refactor MessageBanner to import margin and shape maps from sailMaps
- [ ] Task 9: Refactor StampField to import margin and shape maps from sailMaps (keep component-specific sizeMap local)
- [ ] Task 10: Refactor RichTextDisplayField to import margin maps from sailMaps
- [ ] Task 11: Refactor DialogField to import margin maps from sailMaps
- [ ] Task 12: Refactor ProgressBar to import margin maps from sailMaps
- [ ] Task 13: Refactor MilestoneField to import margin maps from sailMaps
- [ ] Task 14: Refactor TabsField to import margin and buttonSize maps from sailMaps, standardize variable naming (marginMap → marginAboveMap, marginBottomMap → marginBelowMap)
- [ ] Task 15: Refactor ToggleField to import buttonSizeMap from sailMaps
- [ ] Task 16: Run build verification (`pnpm build`) and tests (`pnpm test`) to confirm no regressions
- [ ] Task 17: Verify Storybook renders correctly for all affected components

## Phase 2: Token-Driven Generation (Stretch)

- [ ] Task 18: Investigate extending `tokens.json` with SAIL enum → Tailwind mapping metadata
- [ ] Task 19: Create or extend generation script to produce `sailMaps.ts` from tokens
- [ ] Task 20: Wire generation into `pnpm run build:tokens` pipeline
