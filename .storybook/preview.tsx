import type { Preview } from '@storybook/react-vite'
import { LocaleProvider, SUPPORTED_LOCALES, DEFAULT_LOCALE } from '../src/i18n'
import '../src/index.css'

/**
 * Convert a normalized locale code (e.g. `en-us`) to its conventional display
 * form (`en-US`) for the Storybook picker: the language subtag stays lowercase
 * and the region subtag is uppercased. Purely cosmetic — `LocaleProvider`
 * re-normalizes whatever value the toolbar hands back.
 */
function toDisplayLocale(code: string): string {
  const [language, region] = code.split('-')
  return region ? `${language}-${region.toUpperCase()}` : language
}

/**
 * Build a human-readable toolbar label such as `English (en-US)`, falling back
 * to the bare display code when `Intl.DisplayNames` is unavailable or the
 * language subtag has no known name.
 */
function toLocaleLabel(code: string): string {
  const display = toDisplayLocale(code)
  const [language] = code.split('-')
  try {
    const name = new Intl.DisplayNames(['en'], { type: 'language' }).of(language)
    return name && name !== language ? `${name} (${display})` : display
  } catch {
    return display
  }
}

/**
 * Locale toolbar items, derived entirely from the i18n supported-locale
 * registry. Adding a locale bundle plus a `SUPPORTED_LOCALES` entry makes the
 * option appear here automatically (Requirement 10.4).
 */
const localeItems = SUPPORTED_LOCALES.map((code) => ({
  value: toDisplayLocale(code),
  title: toLocaleLabel(code),
}))

const preview: Preview = {
  parameters: {
    options: {
      storySort: {
        method: 'alphabetical',
        order: ['Welcome', 'Components', 'Patterns', 'Pages'],
      },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: 'error',
    },
  },
  globalTypes: {
    locale: {
      description: 'Active locale applied to every story via LocaleProvider',
      toolbar: {
        title: 'Locale',
        icon: 'globe',
        items: localeItems,
        // Reflect the selected locale in the toolbar button label.
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    // Default the picker to en-US (Requirement 10.4). LocaleProvider normalizes
    // this back to the internal form before validating/looking up strings.
    locale: toDisplayLocale(DEFAULT_LOCALE),
  },
  decorators: [
    // Wrap every story in LocaleProvider, sourcing the locale from the toolbar
    // global so switching it re-renders all stories under the new locale
    // (Requirements 10.4, 10.5).
    (Story, context) => (
      <LocaleProvider locale={context.globals.locale}>
        <Story />
      </LocaleProvider>
    ),
  ],
}

export default preview
