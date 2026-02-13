# Implementation Plan: Storybook Migration

## Overview

Replace Sailwind's custom Vite dev app with Storybook v10. Install and configure Storybook, migrate all 20 component demos to co-located stories, create page and pattern stories, then remove the deprecated custom app scaffolding.

## Tasks

- [ ] 1. Install Storybook and configure the project
  - [ ] 1.1 Install Storybook v10 dependencies
    - Add `storybook`, `@storybook/react-vite`, `@storybook/addon-docs`, `@storybook/addon-a11y`, `@storybook/addon-themes` as devDependencies
    - Add `storybook` and `build-storybook` npm scripts to package.json
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 5.1, 5.2, 5.3_
  - [ ] 1.2 Create `.storybook/main.ts` configuration
    - Configure `@storybook/react-vite` framework
    - Set stories glob to `../src/**/*.stories.@(ts|tsx)`
    - Register addon-docs, addon-a11y, addon-themes addons
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_
  - [ ] 1.3 Create `.storybook/preview.tsx` configuration
    - Import `../src/index.css` for Tailwind and Aurora theme styles
    - Configure controls matchers and a11y settings
    - _Requirements: 1.6, 1.7_

- [ ] 2. Create component stories (batch 1: display components)
  - [ ] 2.1 Create Heading stories
    - Create `src/components/Heading/Heading.stories.tsx`
    - Migrate variants from `HeadingDemo.tsx`: sizes, colors, alignment, heading tags
    - Include `autodocs` tag, title `Components/Heading`
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 4.1, 4.4_
  - [ ] 2.2 Create Tag stories
    - Create `src/components/Tag/Tag.stories.tsx`
    - Migrate variants from `TagsDemo.tsx`: semantic colors, custom colors, sizes
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 4.1, 4.4_
  - [ ] 2.3 Create RichText stories
    - Create `src/components/RichText/RichText.stories.tsx`
    - Migrate variants from `RichTextDemo.tsx`: text items, links, icons, styling
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 4.1, 4.4_
  - [ ] 2.4 Create Image stories
    - Create `src/components/Image/Image.stories.tsx`
    - Migrate variants from `ImageDemo.tsx`: sizes, shapes, alt text
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 4.1, 4.4_
  - [ ] 2.5 Create Stamp stories
    - Create `src/components/Stamp/Stamp.stories.tsx`
    - Migrate variants from `StampDemo.tsx`: semantic colors, sizes, icons
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 4.1, 4.4_

- [ ] 3. Create component stories (batch 2: interactive components)
  - [ ] 3.1 Create Button stories
    - Create `src/components/Button/Button.stories.tsx`
    - Migrate variants from `ButtonsDemo.tsx`: styles (SOLID, OUTLINE, GHOST, LINK), semantic colors, hex colors, sizes, button arrays, actions
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 4.1, 4.4_
  - [ ] 3.2 Create TextField stories
    - Create `src/components/TextField/TextField.stories.tsx`
    - Migrate variants from `TextFieldDemo.tsx`: types, placeholders, validation states
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 4.1, 4.4_
  - [ ] 3.3 Create Checkbox stories
    - Create `src/components/Checkbox/Checkbox.stories.tsx`
    - Migrate variants from `CheckboxDemo.tsx`
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 4.1, 4.4_
  - [ ] 3.4 Create RadioButton stories
    - Create `src/components/RadioButton/RadioButton.stories.tsx`
    - Migrate variants from `RadioButtonDemo.tsx`
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 4.1, 4.4_
  - [ ] 3.5 Create Dropdown stories
    - Create `src/components/Dropdown/Dropdown.stories.tsx`
    - Migrate variants from `DropdownDemo.tsx`
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 4.1, 4.4_
  - [ ] 3.6 Create Switch stories
    - Create `src/components/Switch/Switch.stories.tsx`
    - Migrate variants from `SwitchDemo.tsx`
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 4.1, 4.4_
  - [ ] 3.7 Create Toggle stories
    - Create `src/components/Toggle/Toggle.stories.tsx`
    - Migrate variants from `ToggleDemo.tsx`
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 4.1, 4.4_
  - [ ] 3.8 Create Slider stories
    - Create `src/components/Slider/Slider.stories.tsx`
    - Migrate variants from `SliderDemo.tsx`
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 4.1, 4.4_
  - [ ] 3.9 Create Tabs stories
    - Create `src/components/Tabs/Tabs.stories.tsx`
    - Migrate variants from `TabsDemo.tsx`
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 4.1, 4.4_
  - [ ] 3.10 Create Dialog stories
    - Create `src/components/Dialog/Dialog.stories.tsx`
    - Migrate variants from `DialogDemo.tsx`
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 4.1, 4.4_

- [ ] 4. Create component stories (batch 3: layout and feedback components)
  - [ ] 4.1 Create Card stories
    - Create `src/components/Card/Card.stories.tsx`
    - Migrate variants from `CardsDemo.tsx`: shapes, decorative bars, borders, shadows
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 4.1, 4.4_
  - [ ] 4.2 Create MessageBanner stories
    - Create `src/components/MessageBanner/MessageBanner.stories.tsx`
    - Migrate variants from `BannersDemo.tsx`: background colors, icons, highlight colors
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 4.1, 4.4_
  - [ ] 4.3 Create Milestone stories
    - Create `src/components/Milestone/Milestone.stories.tsx`
    - Migrate variants from `MilestoneDemo.tsx`
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 4.1, 4.4_
  - [ ] 4.4 Create ProgressBar stories
    - Create `src/components/ProgressBar/ProgressBar.stories.tsx`
    - Migrate variants from `ProgressBarDemo.tsx`: colors, styles, percentages
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 4.1, 4.4_
  - [ ] 4.5 Create ApplicationHeader stories
    - Create `src/components/ApplicationHeader/ApplicationHeader.stories.tsx`
    - Migrate from `ApplicationHeaderDemo.tsx` page
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 4.1, 4.4_

- [ ] 5. Checkpoint - Verify component stories
  - Ensure all 20 component stories render correctly in Storybook
  - Verify autodocs pages are generated
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 6. Create page and pattern stories
  - [ ] 6.1 Create page stories directory and ESGConferenceRegistration story
    - Create `src/stories/pages/ESGConferenceRegistration.stories.tsx`
    - Use `fullscreen` layout, title `Pages/ESG Conference Registration`
    - _Requirements: 3.1, 3.4, 4.2_
  - [ ] 6.2 Create InsuranceQuoteWizard story
    - Create `src/stories/pages/InsuranceQuoteWizard.stories.tsx`
    - Use `fullscreen` layout, title `Pages/Insurance Quote Wizard`
    - _Requirements: 3.1, 3.4, 4.2_
  - [ ] 6.3 Create ApplicationHeaderDemo page story
    - Create `src/stories/pages/ApplicationHeaderDemo.stories.tsx`
    - Use `fullscreen` layout, title `Pages/Application Header Demo`
    - _Requirements: 3.1, 3.4, 4.2_
  - [ ] 6.4 Create ButtonTextFieldTest page story
    - Create `src/stories/pages/ButtonTextFieldTest.stories.tsx`
    - Use `fullscreen` layout, title `Pages/Button TextField Test`
    - _Requirements: 3.1, 3.4, 4.2_
  - [ ] 6.5 Create pattern stories for TaskDashboard, UserProfile, FormEntry
    - Create `src/stories/patterns/TaskDashboard.stories.tsx`
    - Create `src/stories/patterns/UserProfile.stories.tsx`
    - Create `src/stories/patterns/FormEntry.stories.tsx`
    - All use `fullscreen` layout, titles under `Patterns/`
    - _Requirements: 3.2, 3.4, 4.3_
  - [ ] 6.6 Create pattern stories for DocumentReview, Publications, ApplicationStatus
    - Create `src/stories/patterns/DocumentReview.stories.tsx`
    - Create `src/stories/patterns/Publications.stories.tsx`
    - Create `src/stories/patterns/ApplicationStatus.stories.tsx`
    - All use `fullscreen` layout, titles under `Patterns/`
    - _Requirements: 3.2, 3.4, 4.3_

- [ ] 7. Checkpoint - Verify all stories
  - Ensure all component, page, and pattern stories render correctly
  - Verify sidebar organization matches the design (Components/, Pages/, Patterns/)
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 8. Remove deprecated custom app scaffolding
  - [ ] 8.1 Remove demo files and custom routing files
    - Delete `src/demos/` directory (all 21 files including index.ts)
    - Delete `src/App.tsx`, `src/App.css`, `src/main.tsx`
    - Delete `src/pages/home.tsx`, `src/pages/not-found.tsx`, `src/pages/components.tsx`
    - Delete `src/components/TableOfContents.tsx`
    - _Requirements: 7.2, 7.3_
  - [ ] 8.2 Remove wouter dependency and update index.html
    - Remove `wouter` from package.json dependencies
    - Update or remove `index.html` (no longer needed as Storybook entry point)
    - _Requirements: 7.1, 7.4_
  - [ ] 8.3 Update component index exports
    - Remove `TableOfContents` export from `src/components/index.ts`
    - Verify `src/index.ts` library entry point is unaffected
    - _Requirements: 6.2, 6.3_

- [ ] 9. Final checkpoint - Verify clean build
  - Run `npm run build-storybook` to verify static Storybook build succeeds
  - Run `npm run build:lib` to verify library build is unaffected
  - Ensure all tests pass, ask the user if questions arise.
  - _Requirements: 5.2, 5.3, 6.2, 6.3_

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP (none in this plan — all tasks are core migration work)
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Component stories are batched by category (display, interactive, layout/feedback) for manageable progress
- Page/pattern stories import existing page components directly — the page source files under `src/pages/patterns/` and `src/pages/` are retained until stories are verified, then the routing scaffolding is removed in task 8
