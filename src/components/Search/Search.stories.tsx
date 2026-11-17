import type { Meta, StoryObj } from '@storybook/react-vite'
import { useRef, useState } from 'react'
import { Clock, type LucideIcon } from 'lucide-react'
import { expect, userEvent, waitFor, within } from 'storybook/test'
import { SearchField } from './SearchField'

const marginOptions = ['NONE', 'EVEN_LESS', 'LESS', 'STANDARD', 'MORE', 'EVEN_MORE']

const meta = {
  title: 'Components/Search',
  component: SearchField,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  decorators: [
    (Story) => (
      <div className="max-w-md">
        <Story />
      </div>
    ),
  ],
  args: {
    placeholder: 'Search',
    accessibilityText: 'Search',
  },
  argTypes: {
    shape: { control: 'select', options: ['SQUARED', 'SEMI_ROUNDED', 'ROUNDED'] },
    labelPosition: { control: 'select', options: ['ABOVE', 'ADJACENT', 'COLLAPSED', 'JUSTIFIED'] },
    marginAbove: { control: 'select', options: marginOptions },
    marginBelow: { control: 'select', options: marginOptions },
    expanded: { control: 'boolean' },
  },
  // Keep the text in story state so typing works, while args still drive the other props
  render: function Render(args) {
    const [value, setValue] = useState(args.value ?? '')
    return (
      <SearchField
        {...args}
        value={value}
        onChange={(next) => {
          setValue(next)
          args.onChange?.(next)
        }}
      />
    )
  },
} satisfies Meta<typeof SearchField>

export default meta
type Story = StoryObj<typeof meta>

/** A search input with the default search icon. Shape defaults to SEMI_ROUNDED. */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole('searchbox', { name: 'Search' })
    await userEvent.type(input, 'quarterly report')
    await expect(input).toHaveValue('quarterly report')
  },
}

/** Each shape uses the SAIL shape values. ROUNDED is an 8px radius, not a pill. */
export const Shapes: Story = {
  render: () => (
    <>
      <SearchField label="SQUARED" shape="SQUARED" placeholder="Search" />
      <SearchField label="SEMI_ROUNDED (default)" shape="SEMI_ROUNDED" placeholder="Search" />
      <SearchField label="ROUNDED" shape="ROUNDED" placeholder="Search" />
    </>
  ),
}

/**
 * The end icon is the field's trailing action, here clear. `onEndIconClick`
 * makes it a button and `endIconAltText` names it. Here it clears the field
 * while there is text. The field moves focus back to the input, so keyboard
 * users keep their place when the button disappears. The field itself never
 * changes `value`. Without `onEndIconClick` the end icon is decorative. It is
 * hidden in the full-screen view, where the field shows its own Close search X.
 */
export const EndIcon: Story = {
  args: { placeholder: 'Search documents' },
  render: function Render(args) {
    const [value, setValue] = useState('')
    return (
      <SearchField
        {...args}
        value={value}
        onChange={setValue}
        endIcon={value ? 'x' : null}
        onEndIconClick={() => setValue('')}
        endIconAltText="Clear search"
      />
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole('searchbox')
    await expect(canvas.queryByRole('button', { name: 'Clear search' })).not.toBeInTheDocument()
    await userEvent.type(input, 'quarterly report')
    await expect(input).toHaveValue('quarterly report')
    await userEvent.click(canvas.getByRole('button', { name: 'Clear search' }))
    await expect(input).toHaveValue('')
    await expect(canvas.queryByRole('button', { name: 'Clear search' })).not.toBeInTheDocument()
    await expect(input).toHaveFocus()
  },
}

/** Enter calls `onSubmit` with the current text. */
export const SubmitOnEnter: Story = {
  render: function Render(args) {
    const [value, setValue] = useState('')
    const [submitted, setSubmitted] = useState<string | null>(null)
    return (
      <>
        <SearchField {...args} value={value} onChange={setValue} onSubmit={setSubmitted} />
        {submitted !== null && <p className="text-base">Submitted: {submitted}</p>}
      </>
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.type(canvas.getByRole('searchbox'), 'contracts{Enter}')
    await expect(canvas.getByText('Submitted: contracts')).toBeInTheDocument()
  },
}

// Typeahead: suggestions in the results panel

const recentSearches = ['quarterly report', 'travel policy', 'vendor contracts', 'onboarding checklist', 'budget summary']

// Rows are real buttons, 44px tall (min-h-11), and wrap long text instead of truncating it
const suggestionRowClasses =
  'flex min-h-11 w-full items-center gap-3 px-3 py-2 text-start text-base break-words hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-500'

const followingText =
  'Following content. A docked panel and its scrim cover this text. A full-screen view covers the whole window.'

interface TypeaheadDemoProps {
  heading: string
  suggestions: string[]
  icon: LucideIcon
}

// Text for the visually hidden live region, so screen readers hear the count.
// Empty while the panel is closed.
const suggestionCount = (count: number) =>
  count === 0 ? 'No suggestions' : count === 1 ? '1 suggestion' : `${count} suggestions`

/**
 * Shows suggestions when the field gets focus, and filters them as the user
 * types. When nothing matches, the panel stays open and shows No results.
 * Choosing a row fills the field, runs onSubmit and closes the panel.
 * SearchField has no onFocus prop, so focus is read on a wrapper (React's
 * focus events bubble from the input). A visually hidden polite live region
 * tells screen readers how many suggestions there are, because the field
 * cannot count them itself. It sits outside SearchField so it is always in the
 * DOM: screen readers announce changes to an existing live region, not one
 * inserted with its text. It gets the count when the panel opens and while
 * filtering, and is emptied when the panel closes.
 */
function TypeaheadDemo({ heading, suggestions, icon: Icon }: TypeaheadDemoProps) {
  const [value, setValue] = useState('')
  const [open, setOpen] = useState(false)
  const [submitted, setSubmitted] = useState<string | null>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const skipOpen = useRef(false)

  const matches = suggestions.filter((item) => item.toLowerCase().includes(value.trim().toLowerCase()))

  // Close the panel and return focus to the input without reopening the panel
  const close = () => {
    setOpen(false)
    skipOpen.current = true
    wrapperRef.current?.querySelector('input')?.focus()
    skipOpen.current = false
  }

  const choose = (item: string) => {
    setValue(item)
    setSubmitted(item)
    close()
  }

  const openFromInput = (target: EventTarget) => {
    if (target instanceof HTMLInputElement && !skipOpen.current) setOpen(true)
  }

  return (
    <div ref={wrapperRef} onFocus={(e) => openFromInput(e.target)} onClick={(e) => openFromInput(e.target)}>
      <SearchField
        placeholder="Search"
        accessibilityText="Search"
        value={value}
        onChange={(next) => {
          setValue(next)
          setOpen(true)
        }}
        onSubmit={(text) => {
          setSubmitted(text)
          setOpen(false)
        }}
        expanded={open}
        onDismiss={() => setOpen(false)}
        endIcon={value ? 'x' : null}
        onEndIconClick={() => setValue('')}
        endIconAltText="Clear search"
      >
        {matches.length > 0 ? (
          <>
            <p className="px-3 pt-2 text-sm font-semibold text-gray-700">{heading}</p>
            <ul aria-label={heading}>
              {matches.map((item) => (
                <li key={item}>
                  <button type="button" className={suggestionRowClasses} onClick={() => choose(item)}>
                    <Icon size={16} aria-hidden="true" className="shrink-0 text-gray-600" />
                    <span>{item}</span>
                  </button>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p className="px-3 py-2 text-base text-gray-700">No results</p>
        )}
      </SearchField>
      <span className="sr-only" aria-live="polite">
        {open ? suggestionCount(matches.length) : ''}
      </span>
      {submitted !== null && <p className="text-base">Submitted: {submitted}</p>}
      <p className="text-base">{followingText}</p>
      <p className="text-base">More following content, to show where the page continues.</p>
    </div>
  )
}

// Tailwind's shadow-none computes to transparent layers, not the keyword none
const hasVisibleShadow = (element: Element) =>
  getComputedStyle(element).boxShadow.replace(/rgba\(0, 0, 0, 0\) 0px 0px 0px 0px,?\s*/g, '').trim() !== ''

const getResults = (canvas: ReturnType<typeof within>) => canvas.getByRole('group', { name: 'Search results' })
// The field's container holds the results. It is the full-screen view, and its first child is the scrim
const getView = (results: HTMLElement) => results.parentElement as HTMLElement
const getScrim = (results: HTMLElement) => getView(results).firstElementChild as HTMLElement

// True when the element fills the window. clientWidth leaves out a scrollbar, as inset-0 does
const coversViewport = (element: Element) => {
  const rect = element.getBoundingClientRect()
  const { clientWidth, clientHeight } = document.documentElement
  return (
    Math.abs(rect.left) < 1 &&
    Math.abs(rect.top) < 1 &&
    Math.abs(rect.width - clientWidth) < 1 &&
    Math.abs(rect.height - clientHeight) < 1
  )
}

// The hidden story that the phone frame loads. Its id comes from its export name
const PHONE_FRAME_STORY_ID = 'components-search--full-screen-results-phone'
const phoneFrameTitle = 'Full-screen search on a phone-sized screen'

// True inside a Storybook preview (the canvas or a docs page), where iframe.html
// serves stories. False in Vitest, which has no iframe.html
const isStorybookPreview = () => /\/iframe\.html$/.test(window.location.pathname)

// "Show code" for FullScreenResults. The story renders a frame, so the
// generated source would show iframe markup instead of SearchField usage.
// Nothing here is layout-specific: the layout is built in
const fullScreenResultsSource = `<SearchField
  placeholder="Search"
  accessibilityText="Search"
  value={value}
  onChange={setValue}
  expanded={open}
  onDismiss={() => setOpen(false)}
  endIcon={value ? 'x' : null}
  onEndIconClick={() => setValue('')}
  endIconAltText="Clear search"
>
  {results}
</SearchField>`

/**
 * Material 3's full-screen search view
 * (https://m3.material.io/components/search/guidelines), the built-in layout
 * for compact windows (480px and under). This frame is a 375 x 667
 * phone-sized screen, so the view fills the frame instead of this page. Click
 * the search field in the frame to open it: the input is at the top with a
 * close (X) button at the end of the row, and the results fill the rest of the
 * screen and scroll inside it. The X or Escape closes the view and returns
 * focus to the input. The clear button is hidden while the view is open, so
 * there is one X. On a real phone the view fills the phone's window.
 */
export const FullScreenResults: Story = {
  parameters: {
    // axe checks this page only. The frame's story gets its own axe run
    // (FullScreenResultsPhone), and axe can't wait for a second Storybook
    // preview to load inside this one
    a11y: { options: { iframes: false } },
    // Show the SearchField usage in "Show code", not the frame markup
    docs: { source: { code: fullScreenResultsSource } },
  },
  render: function Render(_args, { globals }) {
    const src = `iframe.html?id=${PHONE_FRAME_STORY_ID}&viewMode=story&embed=true&globals=locale:${encodeURIComponent(String(globals.locale ?? 'en-US'))}`
    return (
      <figure className="m-0">
        {/* The border is on the wrapper: preflight's border-box would shrink a bordered iframe's window */}
        <div className="inline-block max-w-full overflow-hidden rounded-md border-8 border-gray-800 bg-white shadow-lg">
          <iframe
            title={phoneFrameTitle}
            src={isStorybookPreview() ? src : undefined}
            className="block h-[667px] w-[375px] max-w-full border-0"
          />
        </div>
        <figcaption className="mt-2 text-sm text-gray-700">
          Phone-sized screen, 375 x 667. Click the search field to open the results.
        </figcaption>
      </figure>
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const frame = canvas.getByTitle(phoneFrameTitle) as HTMLIFrameElement
    await expect(frame.clientWidth).toBe(375)
    await expect(frame.clientHeight).toBe(667)
    // Vitest has no iframe.html, so the frame stays empty there. Vitest runs
    // FullScreenResultsPhone at a phone width instead
    if (!isStorybookPreview()) return
    // Catches a wrong story id or URL base: the frame loads the field, at a
    // phone width, closed
    await waitFor(
      () => expect(frame.contentDocument?.querySelector('input[type="search"]')).toBeTruthy(),
      { timeout: 15000 },
    )
    const frameWindow = frame.contentWindow as Window
    await expect(frameWindow.innerWidth).toBe(375)
    await expect(frameWindow.matchMedia('not all and (min-width: 481px)').matches).toBe(true)
    await expect(frame.contentDocument?.querySelector('[role="group"]')).toBeNull()
  },
}

const pageBelowText = 'Page content below the results. The scrim covers it while the list is open.'

/**
 * Material 3's docked search view
 * (https://m3.material.io/components/search/guidelines). Docked is the
 * built-in layout at 481px and up (Material 3's medium and expanded windows).
 * The list opens below the bar and a scrim covers the page behind it. A click
 * on the scrim closes it. The page still scrolls. The list has a shadow and
 * scrolls inside when it is taller than 20rem. At 480px and under the same
 * field opens full screen (see FullScreenResults). Its play checks the docked
 * layout, so it expects a window wider than 480px.
 *
 * The panel shows recent searches on focus and filters them as the user types,
 * showing No results when nothing matches; the clear button keeps it open.
 * Tab reaches the first suggestion, Escape closes the panel and returns focus
 * to the input, choosing a row fills the field and submits, and Enter submits
 * the typed text. Render an always-mounted, visually hidden polite live region
 * outside the field to announce the number of suggestions, as this story does.
 */
export const DockedResults: Story = {
  render: () => (
    <div>
      <TypeaheadDemo heading="Recent searches" suggestions={recentSearches} icon={Clock} />
      {/* mt-80 matches the panel's max-h-80, so this text starts below the open list */}
      <p className="mt-80 text-base">{pageBelowText}</p>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.queryByRole('group', { name: 'Search results' })).not.toBeInTheDocument()
    // The live region exists, empty, before the panel opens
    const liveRegion = canvasElement.querySelector<HTMLElement>('[aria-live="polite"]')
    await expect(liveRegion).toBeInTheDocument()
    await expect(liveRegion).toBeEmptyDOMElement()
    const following = canvas.getByText(followingText)
    const topBefore = following.getBoundingClientRect().top
    const input = canvas.getByRole('searchbox', { name: 'Search' })
    await userEvent.click(input)
    const results = getResults(canvas)
    await expect(canvas.getAllByRole('button', { name: /report|policy|contracts|checklist|summary/ })).toHaveLength(5)
    await expect(input).toHaveAttribute('aria-controls', results.id)
    await expect(results).not.toContainElement(liveRegion)
    await expect(liveRegion).toHaveTextContent('5 suggestions')
    // Docked layout: the list floats over the page with a shadow
    await expect(getComputedStyle(results).position).toBe('absolute')
    await expect(hasVisibleShadow(results)).toBe(true)
    await expect(following.getBoundingClientRect().top).toBe(topBefore)
    // The scrim covers the window, under the field and the list
    const scrim = getScrim(results)
    await expect(getComputedStyle(scrim).position).toBe('fixed')
    await expect(scrim).toHaveAttribute('aria-hidden', 'true')
    await expect(coversViewport(scrim)).toBe(true)
    const field = input.getBoundingClientRect()
    await expect(document.elementFromPoint(field.left + field.width / 2, field.top + field.height / 2)).toBe(input)
    const list = results.getBoundingClientRect()
    await expect(document.elementFromPoint(list.right + 16, list.top + 16)).toBe(scrim)
    // No scroll lock
    await expect(getComputedStyle(document.documentElement).overflow).not.toBe('hidden')
    await expect(getComputedStyle(document.body).overflow).not.toBe('hidden')
    // Scroll the page content below the list into view, so the hit test works
    // in a short canvas, and check the scrim covers it
    const belowText = canvas.getByText(pageBelowText)
    belowText.scrollIntoView({ block: 'center' })
    const below = belowText.getBoundingClientRect()
    await expect(below.top).toBeGreaterThan(results.getBoundingClientRect().bottom)
    await expect(document.elementFromPoint(below.left + below.width / 2, below.top + below.height / 2)).toBe(scrim)
    await expect(getResults(canvas)).toBeInTheDocument()
    // A click on the scrim closes the list
    await userEvent.click(scrim)
    await expect(canvas.queryByRole('group', { name: 'Search results' })).not.toBeInTheDocument()
    await expect(liveRegion).toBeEmptyDOMElement()

    // Typeahead: bring the field back into view and reopen the panel
    input.scrollIntoView({ block: 'center' })
    await userEvent.click(input)
    await expect(getResults(canvas)).toBeInTheDocument()
    await expect(liveRegion).toHaveTextContent('5 suggestions')
    // Tab reaches the first suggestion, and Escape closes the panel and returns focus to the input
    await userEvent.tab()
    await expect(canvas.getByRole('button', { name: 'quarterly report' })).toHaveFocus()
    await userEvent.keyboard('{Escape}')
    await expect(canvas.queryByRole('group', { name: 'Search results' })).not.toBeInTheDocument()
    await expect(input).toHaveFocus()
    await expect(liveRegion).toBeEmptyDOMElement()
    // Typing reopens the panel and filters the list
    await userEvent.type(input, 'travel')
    await expect(canvas.getByRole('button', { name: 'travel policy' })).toBeInTheDocument()
    await expect(canvas.queryByRole('button', { name: 'quarterly report' })).not.toBeInTheDocument()
    await expect(liveRegion).toHaveTextContent('1 suggestion')
    await userEvent.click(canvas.getByRole('button', { name: 'Clear search' }))
    await expect(input).toHaveValue('')
    await expect(getResults(canvas)).toBeInTheDocument()
    await expect(liveRegion).toHaveTextContent('5 suggestions')
    await userEvent.click(canvas.getByRole('button', { name: 'travel policy' }))
    await expect(input).toHaveValue('travel policy')
    await expect(canvas.getByText('Submitted: travel policy')).toBeInTheDocument()
    await expect(canvas.queryByRole('group', { name: 'Search results' })).not.toBeInTheDocument()
    await expect(liveRegion).toBeEmptyDOMElement()
    await expect(input).toHaveFocus()
    // Enter submits the typed text, not a suggestion
    await userEvent.click(canvas.getByRole('button', { name: 'Clear search' }))
    await userEvent.type(input, 'vendor')
    await expect(canvas.getByRole('button', { name: 'vendor contracts' })).toBeInTheDocument()
    await userEvent.keyboard('{Enter}')
    await expect(canvas.getByText('Submitted: vendor')).toBeInTheDocument()
    await expect(canvas.queryByRole('group', { name: 'Search results' })).not.toBeInTheDocument()
    // Text that matches nothing keeps the panel open with No results
    await userEvent.click(canvas.getByRole('button', { name: 'Clear search' }))
    await userEvent.type(input, 'zzz')
    const noMatches = getResults(canvas)
    await expect(within(noMatches).getByText('No results')).toBeInTheDocument()
    await expect(within(noMatches).queryByRole('button')).not.toBeInTheDocument()
    await expect(liveRegion).toHaveTextContent('No suggestions')
    // Escape closes the panel and keeps the typed text
    await userEvent.keyboard('{Escape}')
    await expect(canvas.queryByRole('group', { name: 'Search results' })).not.toBeInTheDocument()
    await expect(input).toHaveValue('zzz')
    await expect(liveRegion).toBeEmptyDOMElement()
  },
}

// Phone viewports for the Vitest browser run. 480 is SAIL's widest PHONE width
// and 481 the narrowest docked width, so the two hidden stories pin the boundary
const phoneViewports = {
  searchPhone480: { name: 'Phone, 480 x 800', styles: { width: '480px', height: '800px' }, type: 'mobile' },
  searchDocked481: { name: 'Docked, 481 x 800', styles: { width: '481px', height: '800px' }, type: 'mobile' },
} as const

/**
 * Not shown in the sidebar or the docs page. FullScreenResults loads it in its
 * phone-sized frame. Vitest runs it at 480 x 800, the widest PHONE width.
 */
export const FullScreenResultsPhone: Story = {
  name: 'Full screen results (phone frame)',
  tags: ['!dev', '!autodocs'],
  parameters: { viewport: { options: phoneViewports } },
  globals: { viewport: { value: 'searchPhone480', isRotated: false } },
  render: () => <TypeaheadDemo heading="Recent searches" suggestions={recentSearches} icon={Clock} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.queryByRole('group', { name: 'Search results' })).not.toBeInTheDocument()
    const input = canvas.getByRole('searchbox', { name: 'Search' })
    // Opens full screen: the view covers the window (the frame's, or the Vitest viewport)
    await userEvent.click(input)
    const results = getResults(canvas)
    const view = getView(results)
    await expect(getComputedStyle(view).position).toBe('fixed')
    await expect(coversViewport(view)).toBe(true)
    await expect(hasVisibleShadow(results)).toBe(false)
    await expect(getComputedStyle(getScrim(results)).display).toBe('none')
    const close = canvas.getByRole('button', { name: 'Close search' })
    await expect(close).toBeVisible()
    const closeBox = close.getBoundingClientRect()
    await expect(closeBox.width).toBeGreaterThanOrEqual(24)
    await expect(closeBox.height).toBeGreaterThanOrEqual(24)
    const row = canvas.getByRole('button', { name: 'quarterly report' })
    await expect(row.getBoundingClientRect().height).toBeGreaterThanOrEqual(44)
    // With text, the clear button exists but is hidden, so there is one X
    await userEvent.type(input, 'tr')
    await expect(canvas.queryByRole('button', { name: 'Clear search' })).not.toBeInTheDocument()
    // The X closes the view, keeps the text and returns focus to the input
    await userEvent.click(canvas.getByRole('button', { name: 'Close search' }))
    await expect(canvas.queryByRole('group', { name: 'Search results' })).not.toBeInTheDocument()
    await expect(input).toHaveFocus()
    await expect(input).toHaveValue('tr')
    // Escape closes it too
    await userEvent.click(input)
    await expect(getResults(canvas)).toBeInTheDocument()
    await userEvent.keyboard('{Escape}')
    await expect(canvas.queryByRole('group', { name: 'Search results' })).not.toBeInTheDocument()
    await expect(input).toHaveFocus()
    // Choosing a row fills the field and closes the view
    await userEvent.click(input)
    await userEvent.clear(input)
    await userEvent.click(canvas.getByRole('button', { name: 'quarterly report' }))
    await expect(input).toHaveValue('quarterly report')
    await expect(canvas.queryByRole('group', { name: 'Search results' })).not.toBeInTheDocument()
    // Reopen: the text is not empty, so the clear button exists but is hidden
    await userEvent.click(input)
    await expect(getResults(canvas)).toBeInTheDocument()
    await expect(canvas.queryByRole('button', { name: 'Clear search' })).not.toBeInTheDocument()
  },
}

/** Not shown in the sidebar or the docs page. Vitest runs it at 481 x 800, the narrowest docked width. */
export const DockedAt481: Story = {
  name: 'Docked at 481px',
  tags: ['!dev', '!autodocs'],
  parameters: { viewport: { options: phoneViewports } },
  globals: { viewport: { value: 'searchDocked481', isRotated: false } },
  render: () => (
    <div className="min-h-72">
      <TypeaheadDemo heading="Recent searches" suggestions={recentSearches} icon={Clock} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole('searchbox', { name: 'Search' })
    await userEvent.click(input)
    const results = getResults(canvas)
    await expect(getComputedStyle(results).position).toBe('absolute')
    await expect(getComputedStyle(getView(results)).position).not.toBe('fixed')
    const scrim = getScrim(results)
    await expect(getComputedStyle(scrim).position).toBe('fixed')
    await expect(coversViewport(scrim)).toBe(true)
    await expect(canvas.queryByRole('button', { name: 'Close search' })).not.toBeInTheDocument()
    await userEvent.keyboard('{Escape}')
    await expect(canvas.queryByRole('group', { name: 'Search results' })).not.toBeInTheDocument()
    await expect(input).toHaveFocus()
  },
}
