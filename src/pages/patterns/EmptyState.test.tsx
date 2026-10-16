import { render, screen, fireEvent } from '@testing-library/react'
import { afterEach, describe, it, expect, vi } from 'vitest'
import { ButtonLayout, EmptyState, EmptyStatePopover } from './EmptyState'
import type { EmptyStateImage } from './EmptyState'

/** Pretends the window is wide (a row of buttons) or narrow (a stack) */
const setWidth = (wide: boolean) => {
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches: wide,
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
  }))
}

afterEach(() => {
  vi.unstubAllGlobals()
})

const labels = () => screen.getAllByRole('button').map(button => button.textContent)

const BUTTONS = {
  primaryButtons: [{ label: 'Upload' }, { label: 'Scan' }],
  secondaryButtons: [{ label: 'Skip' }, { label: 'Learn more' }],
}

describe('ButtonLayout - keys', () => {
  it('keeps the same button element when the window changes and the order flips', () => {
    setWidth(true)
    const { rerender } = render(<ButtonLayout size="STANDARD" {...BUTTONS} />)
    const upload = screen.getByRole('button', { name: 'Upload' })
    setWidth(false)
    rerender(<ButtonLayout size="STANDARD" {...BUTTONS} />)
    expect(screen.getByRole('button', { name: 'Upload' })).toBe(upload)
  })

  it('does not warn about repeated labels', () => {
    setWidth(true)
    const error = vi.spyOn(console, 'error').mockImplementation(() => {})
    render(<ButtonLayout size="STANDARD" primaryButtons={[{ label: 'OK' }, { label: 'OK' }]} />)
    expect(error).not.toHaveBeenCalled()
    error.mockRestore()
  })
})

describe('ButtonLayout - order', () => {
  it('in a row, goes from the least prominent button to the most prominent', () => {
    setWidth(true)
    render(<ButtonLayout size="STANDARD" {...BUTTONS} />)
    // Secondary as given, then primary reversed: the first primary button ends up last (far right)
    expect(labels()).toEqual(['Skip', 'Learn more', 'Scan', 'Upload'])
  })

  it('in a stack, goes from the most prominent button to the least, so Tab follows what is on screen', () => {
    setWidth(false)
    render(<ButtonLayout size="STANDARD" {...BUTTONS} />)
    expect(labels()).toEqual(['Upload', 'Scan', 'Learn more', 'Skip'])
  })
})

describe('ButtonLayout - buttons', () => {
  it('leaves out buttons whose showWhen is false', () => {
    setWidth(true)
    render(
      <ButtonLayout
        size="STANDARD"
        primaryButtons={[{ label: 'Upload' }, { label: 'Hidden', showWhen: false }]}
        secondaryButtons={[{ label: 'Skip' }]}
      />
    )
    expect(labels()).toEqual(['Skip', 'Upload'])
  })

  it('draws nothing when there are no buttons', () => {
    setWidth(true)
    const { container } = render(<ButtonLayout size="STANDARD" />)
    expect(container).toBeEmptyDOMElement()
  })

  it('is a named group only when it is given accessibilityText', () => {
    setWidth(true)
    const named = render(<ButtonLayout size="STANDARD" primaryButtons={[{ label: 'Upload' }]} accessibilityText="Ways to add a document" />)
    expect(screen.getByRole('group', { name: 'Ways to add a document' })).toBeInTheDocument()
    named.unmount()

    render(<ButtonLayout size="STANDARD" primaryButtons={[{ label: 'Upload' }]} />)
    expect(screen.queryByRole('group')).not.toBeInTheDocument()
  })
})

describe('EmptyState', () => {
  it('draws nothing when showWhen is false', () => {
    const { container } = render(<EmptyState title="Nothing" showWhen={false} />)
    expect(container).toBeEmptyDOMElement()
  })

  it('shows the words, and the second line only when given one', () => {
    const first = render(<EmptyState title="No items" description="Add one to start" />)
    expect(screen.getByText('No items')).toBeInTheDocument()
    expect(screen.getByText('Add one to start')).toBeInTheDocument()
    first.unmount()

    render(<EmptyState title="No items" />)
    expect(screen.queryByText('Add one to start')).not.toBeInTheDocument()
  })
})

describe('EmptyStatePopover - accessibility', () => {
  const trigger = () => screen.getByRole('button', { name: 'Saved filters' })

  it('is a disclosure, not a menu', () => {
    render(<EmptyStatePopover />)
    expect(trigger()).not.toHaveAttribute('aria-haspopup')
    expect(trigger()).toHaveAttribute('aria-expanded', 'false')
    fireEvent.click(trigger())
    expect(trigger()).toHaveAttribute('aria-expanded', 'true')
    expect(trigger()).toHaveAttribute('aria-controls', screen.getByRole('region', { name: 'Saved filters' }).id)
  })

  it('closes on Escape and returns focus to the button that opened it, even from inside the panel', () => {
    render(<EmptyStatePopover />)
    fireEvent.click(trigger())
    const inside = screen.getByRole('button', { name: 'Save filters' })
    inside.focus()
    expect(inside).toHaveFocus()

    fireEvent.keyDown(document, { key: 'Escape' })

    expect(screen.queryByRole('region')).not.toBeInTheDocument()
    expect(trigger()).toHaveAttribute('aria-expanded', 'false')
    expect(trigger()).toHaveFocus()
  })

  it('closes when focus moves out of it', () => {
    render(
      <div>
        <EmptyStatePopover />
        <button>Elsewhere</button>
      </div>
    )
    fireEvent.click(trigger())
    expect(screen.getByRole('region')).toBeInTheDocument()
    fireEvent.focusIn(screen.getByRole('button', { name: 'Elsewhere' }))
    expect(screen.queryByRole('region')).not.toBeInTheDocument()
  })

  it('names the panel with the button that opened it', () => {
    render(<EmptyStatePopover />)
    fireEvent.click(trigger())
    expect(screen.getByRole('region')).toHaveAttribute('aria-labelledby', trigger().id)
  })

  it('closes on a press outside it', () => {
    render(
      <div>
        <EmptyStatePopover />
        <p>Elsewhere</p>
      </div>
    )
    fireEvent.click(trigger())
    expect(screen.getByRole('region')).toBeInTheDocument()
    fireEvent.pointerDown(screen.getByText('Elsewhere'))
    expect(screen.queryByRole('region')).not.toBeInTheDocument()
  })
})

describe('EmptyState - image', () => {
  it('draws the NO_DATA illustration when no image is given', () => {
    const { container } = render(<EmptyState title="Nothing here" />)
    expect(container.querySelectorAll('svg .sw-ill-tile')).toHaveLength(8)
    expect(container.querySelector('svg')).toHaveClass('sw-illustration-animated')
  })

  it('draws the illustration it is given, without animation when asked', () => {
    const { container } = render(
      <EmptyState title="No triggers" image={{ imageType: 'illustration', illustration: 'TRIGGERS', showAnimation: false }} />
    )
    expect(container.querySelectorAll('svg .sw-ill-arrow')).toHaveLength(3)
    expect(container.querySelector('svg')).not.toHaveClass('sw-illustration-animated')
  })

  it('still shows the words, and draws no picture, for an illustration name that is not in the list', () => {
    const image = { imageType: 'illustration', illustration: 'NOT_AN_ILLUSTRATION' } as unknown as EmptyStateImage
    const { container } = render(<EmptyState title="Nothing here" image={image} />)
    expect(screen.getByText('Nothing here')).toBeInTheDocument()
    expect(container.querySelector('svg')).toBeNull()
  })

  it('puts a document image above the words, in the flow, rather than behind them', () => {
    const { container } = render(
      <EmptyState title="No documents" image={{ document: 'images/process-modeler.webp', altText: 'A process model' }} />
    )
    const img = screen.getByAltText('A process model')
    expect(img).toHaveAttribute('src', 'images/process-modeler.webp')
    // No illustration, and nothing positioned over the words
    expect(container.querySelector('svg.sw-illustration-animated')).toBeNull()
    expect(img.closest('.absolute')).toBeNull()
    // Held to a height so a tall image cannot swamp the words
    expect(img.closest('[class*="max-h-"]')).not.toBeNull()
  })

  it('holds a document image to a smaller height in a SMALL empty state', () => {
    render(<EmptyState title="No documents" size="SMALL" image={{ document: 'a.png', altText: 'A' }} />)
    expect(screen.getByAltText('A').closest('[class*="max-h-28"]')).not.toBeNull()
  })

  it('keeps an illustration behind the words', () => {
    const { container } = render(<EmptyState title="No data" image={{ imageType: 'illustration', illustration: 'NO_DATA' }} />)
    expect(container.querySelector('svg')!.closest('.absolute')).not.toBeNull()
  })

  it('accepts a web image', () => {
    const { container } = render(
      <EmptyState title="No photos" image={{ source: 'https://example.com/empty.png', altText: 'An empty frame' }} />
    )
    expect(screen.getByAltText('An empty frame')).toHaveAttribute('src', 'https://example.com/empty.png')
    expect(container.querySelector('svg.sw-illustration-animated')).toBeNull()
  })
})
