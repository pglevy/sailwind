import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin'
import { playwright } from '@vitest/browser-playwright'

const dirname = typeof __dirname !== 'undefined'
  ? __dirname
  : path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [react()],
  test: {
    coverage: {
      provider: 'v8',
      include: ['src/components/**/*.tsx'],
      exclude: ['src/components/**/*.stories.tsx', 'src/components/**/*.test.tsx'],
      reporter: ['text', 'html'],
    },
    projects: [
      // Unit tests (existing)
      {
        extends: true,
        test: {
          name: 'unit',
          environment: 'jsdom',
          globals: true,
          setupFiles: ['./src/test/setup.ts'],
          include: ['src/**/*.test.{ts,tsx}'],
          exclude: ['src/**/*.browser.test.{ts,tsx}'],
        },
      },
      // Real-browser (Playwright) tests for behavior jsdom can't verify, e.g.
      // native Tab-key navigation honoring the `inert` attribute. Kept out of
      // the "storybook" project below because that project's `include` is
      // driven by Storybook's own `stories` glob (`*.stories.tsx`), not a
      // generic test pattern, so a plain `*.test.tsx` file never runs under
      // it. Kept out of "unit" (jsdom) because `vitest/browser` can only be
      // imported inside Vitest's browser-mode runtime.
      {
        extends: true,
        test: {
          name: 'browser',
          globals: true,
          setupFiles: ['./src/test/setup.ts'],
          include: ['src/**/*.browser.test.{ts,tsx}'],
          browser: {
            enabled: true,
            headless: true,
            provider: playwright(),
            instances: [{ browser: 'chromium' }],
          },
        },
      },
      // Storybook component + a11y tests
      {
        extends: true,
        plugins: [
          storybookTest({ configDir: path.join(dirname, '.storybook') }),
        ],
        optimizeDeps: {
          include: [
            '@storybook/react/entry-preview',
            '@storybook/addon-a11y/preview',
          ],
        },
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            headless: true,
            provider: playwright(),
            instances: [{ browser: 'chromium' }],
          },
          setupFiles: ['.storybook/vitest.setup.ts'],
        },
      },
    ],
  },
})
