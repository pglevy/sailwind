import * as a11yAddonAnnotations from '@storybook/addon-a11y/preview'
import * as reactAnnotations from '@storybook/react/entry-preview'
import * as previewAnnotations from './preview'
import { setProjectAnnotations } from 'storybook/preview-api'

const annotations = setProjectAnnotations([
  reactAnnotations,
  previewAnnotations,
  a11yAddonAnnotations,
])

// Make annotations available globally for the Vitest addon's test-utils
// This is needed for classic CSF3 stories (non-factory format)
globalThis.globalProjectAnnotations = annotations
