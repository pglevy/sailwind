import type { Meta, StoryObj } from '@storybook/react'

const meta = {
  title: 'Welcome',
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Overview: Story = {
  render: () => (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-2xl px-6 py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Sailwind
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Component reference for Appian SAIL prototyping with React and LLMs
        </p>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              What is this?
            </h2>
            <p className="text-gray-700 mb-3">
              This is the component reference for{' '}
              <a href="https://github.com/pglevy/sailwind" className="text-blue-600 underline hover:text-blue-800">
                Sailwind
              </a>
              , a React component library that mirrors Appian SAIL syntax. Browse the sidebar to see every available component, its props, and live examples.
            </p>
            <p className="text-gray-700">
              Use this reference to understand what components are available so you can describe what you want when building prototypes with an LLM.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              Building prototypes
            </h2>
            <p className="text-gray-700 mb-3">
              To start building prototypes, use the{' '}
              <a href="https://github.com/pglevy/sailwind-starter" className="text-blue-600 underline hover:text-blue-800">
                sailwind-starter
              </a>
              {' '}template. It comes pre-configured with Sailwind and is ready for LLM-assisted development.
            </p>
            <ol className="space-y-2 text-gray-700 list-decimal list-inside">
              <li>Create a new repo from the starter template</li>
              <li>Open it in your editor with an LLM assistant (Kiro, Cursor, Claude Code, etc.)</li>
              <li>Describe the Appian interface you want to prototype</li>
              <li>Reference this component library to know what's available</li>
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              How it works
            </h2>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-3">
                <span className="text-blue-500 font-bold mt-0.5">→</span>
                <span>Components use exact SAIL parameter names and UPPERCASE values</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-500 font-bold mt-0.5">→</span>
                <span>Built on Radix UI primitives and Tailwind CSS</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-500 font-bold mt-0.5">→</span>
                <span>Prototype code translates almost directly to production SAIL</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-500 font-bold mt-0.5">→</span>
                <span>LLM-friendly patterns make AI-assisted development natural</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              Navigating this site
            </h2>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-3">
                <span className="text-gray-400 font-bold mt-0.5">📦</span>
                <span><strong>Components</strong> — Individual SAIL components with props documentation and interactive examples</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-gray-400 font-bold mt-0.5">📐</span>
                <span><strong>Patterns</strong> — Common UI patterns like forms, card grids, and data displays</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-gray-400 font-bold mt-0.5">📄</span>
                <span><strong>Pages</strong> — Full page examples showing realistic Appian interfaces</span>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  ),
}
