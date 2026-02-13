# Requirements Document

## Introduction

Sailwind is a React component library (`@pglevy/sailwind`) that provides Appian SAIL components for React prototyping. It currently uses a custom Vite dev app with wouter routing as the "front door" for viewing components, with demos in `src/demos/` and full-page examples in `src/pages/`. This feature replaces that custom setup with Storybook v10 as the primary development and documentation interface, consolidating all existing demos and pages into Storybook stories. The sibling Propeller project serves as the reference implementation for Storybook configuration.

## Glossary

- **Storybook**: An open-source tool for building, documenting, and testing UI components in isolation. Version 10 is the target.
- **Story**: A Storybook artifact that renders a component in a specific state. Stories are defined in `.stories.tsx` files.
- **Component_Story**: A story that documents a single Sailwind component with its variants, props, and usage examples.
- **Page_Story**: A story that renders a full-page composition demonstrating how multiple Sailwind components work together in a realistic layout.
- **Pattern_Story**: A story that renders a reusable UI pattern (e.g., TaskDashboard, UserProfile) composed of multiple Sailwind components.
- **Demo**: An existing React component in `src/demos/` that showcases a single Sailwind component with various configurations.
- **Addon**: A Storybook plugin that extends functionality (e.g., accessibility testing, documentation generation, theme switching).
- **Sailwind_Library**: The published npm package `@pglevy/sailwind` containing the component source code and build output.
- **Storybook_Configuration**: The `.storybook/` directory containing `main.ts` and `preview.tsx` files that configure Storybook behavior.

## Requirements

### Requirement 1: Storybook Installation and Configuration

**User Story:** As a developer, I want Storybook v10 installed and configured for the Sailwind project, so that I can use it as the primary interface for viewing and developing components.

#### Acceptance Criteria

1. THE Storybook_Configuration SHALL use `@storybook/react-vite` as the framework with Storybook v10
2. THE Storybook_Configuration SHALL include the `@storybook/addon-docs` addon for automatic documentation generation
3. THE Storybook_Configuration SHALL include the `@storybook/addon-a11y` addon for accessibility testing
4. THE Storybook_Configuration SHALL include the `@storybook/addon-themes` addon for theme switching support
5. THE Storybook_Configuration SHALL discover stories from `src/**/*.stories.tsx` files
6. THE Storybook_Configuration SHALL import the Sailwind global stylesheet so that component styles render correctly in stories
7. WHEN Storybook starts, THE Storybook_Configuration SHALL render components with the correct Tailwind CSS styles applied

### Requirement 2: Component Story Creation

**User Story:** As a developer, I want each Sailwind component to have a dedicated Storybook story, so that I can browse, test, and document components in isolation.

#### Acceptance Criteria

1. WHEN a developer opens Storybook, THE Component_Story SHALL exist for each of the 20 Sailwind components (ApplicationHeader, Button, Card, Checkbox, Dialog, Dropdown, Heading, Image, MessageBanner, Milestone, ProgressBar, RadioButton, RichText, Slider, Stamp, Switch, Tabs, Tag, TextField, Toggle)
2. THE Component_Story SHALL be co-located with its component source file in the component directory (e.g., `src/components/Button/Button.stories.tsx`)
3. THE Component_Story SHALL include a default story showing the component in its primary configuration
4. THE Component_Story SHALL include variant stories demonstrating the different prop combinations currently shown in the corresponding demo file
5. WHEN a Component_Story renders, THE Component_Story SHALL produce the same visual output as the corresponding existing demo

### Requirement 3: Page and Pattern Story Creation

**User Story:** As a developer, I want the existing full-page demos and pattern pages available as Storybook stories, so that I can view realistic component compositions without the custom routing app.

#### Acceptance Criteria

1. THE Page_Story SHALL exist for each full-page demo (ESGConferenceRegistration, InsuranceQuoteWizard, ApplicationHeaderDemo, ButtonTextFieldTest)
2. THE Pattern_Story SHALL exist for each pattern page (TaskDashboard, UserProfile, FormEntry, DocumentReview, Publications, ApplicationStatus)
3. WHEN a Page_Story or Pattern_Story renders, THE story SHALL produce the same visual output as the corresponding existing page
4. THE Page_Story and Pattern_Story files SHALL use the `fullscreen` layout parameter so that page-level compositions render without Storybook padding

### Requirement 4: Story Organization and Navigation

**User Story:** As a developer, I want stories organized in a logical hierarchy within Storybook, so that I can quickly find the component or page I need.

#### Acceptance Criteria

1. THE Component_Story SHALL be organized under a "Components" category in the Storybook sidebar (e.g., `Components/Button`, `Components/Card`)
2. THE Page_Story SHALL be organized under a "Pages" category in the Storybook sidebar
3. THE Pattern_Story SHALL be organized under a "Patterns" category in the Storybook sidebar
4. THE Storybook_Configuration SHALL enable the `autodocs` tag so that documentation pages are automatically generated for components

### Requirement 5: Storybook Build Scripts

**User Story:** As a developer, I want npm scripts for running and building Storybook, so that I can start the development server and produce a static build for deployment.

#### Acceptance Criteria

1. WHEN a developer runs `npm run storybook`, THE Sailwind_Library SHALL start the Storybook development server
2. WHEN a developer runs `npm run build-storybook`, THE Sailwind_Library SHALL produce a static Storybook build suitable for deployment
3. THE Sailwind_Library SHALL retain the existing `build:lib` script so that the npm package build is unaffected by the Storybook addition

### Requirement 6: Library Build Isolation

**User Story:** As a developer, I want the Storybook setup to have no impact on the published library package, so that consumers of `@pglevy/sailwind` are unaffected.

#### Acceptance Criteria

1. THE Sailwind_Library SHALL add all Storybook-related packages as devDependencies only
2. THE Sailwind_Library SHALL exclude story files and the `.storybook/` directory from the library build output
3. WHEN the library is built with `npm run build:lib`, THE build output SHALL contain only component source code and type declarations, with no Storybook artifacts

### Requirement 7: Deprecation of Custom Dev App

**User Story:** As a developer, I want the custom Vite routing app phased out in favor of Storybook, so that there is a single, maintained entry point for component development.

#### Acceptance Criteria

1. WHEN all component, page, and pattern stories are created, THE Sailwind_Library SHALL remove the `wouter` routing dependency
2. THE Sailwind_Library SHALL remove the custom routing files (`src/App.tsx`, `src/main.tsx`, `src/pages/home.tsx`, `src/pages/not-found.tsx`, `src/pages/components.tsx`, `src/components/TableOfContents.tsx`)
3. THE Sailwind_Library SHALL remove the demo files from `src/demos/` after their content has been migrated to stories
4. THE Sailwind_Library SHALL update the `index.html` or remove it if no longer needed for the dev app entry point
