import type { StorybookConfig } from '@storybook/react-vite'

const config: StorybookConfig = {
  stories: [
    '../src/**/*.stories.@(ts|tsx)',
  ],
  addons: [
    '@storybook/addon-docs',
    '@storybook/addon-a11y',
    '@storybook/addon-themes',
    '@storybook/addon-vitest'
  ],
  framework: '@storybook/react-vite',
  core: {
    disableTelemetry: true, // 👈 Disables telemetry
  },
}

export default config
