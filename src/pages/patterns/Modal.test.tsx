import { render, screen, fireEvent, within } from '@testing-library/react'
import { afterEach, describe, it, expect, vi } from 'vitest'
import { Modal, ModalCard, ModalHeading, ModalHero, ModalSection } from './Modal'

const STEPS = ['Model details', 'Configure sections', 'Refine prompt']

const labels = (container: HTMLElement) => within(container).getAllByRole('button').map(button => button.textContent)

describe('Modal - size', () => {
  it.each([
    ['SMALL', 'max-w-[480px]'],
    ['MEDIUM', 'max-w-[720px]'],
    ['LARGE', 'w-[96%]'],
  ] as const)('%s uses the %s dialog width', (size, widthClass) => {
    render(
      <Modal open title="Title" description="About" size={size}>
        Body
      </Modal>
    )
    expect(screen.getByRole('dialog').className).toContain(widthClass)
  })

  it('is MEDIUM by default', () => {
    render(
      <Modal open title="Title" description="About">
        Body
      </Modal>
    )
    expect(screen.getByRole('dialog').className).toContain('max-w-[720px]')
  })

  it('names the dialog with its title and describes it with its description', () => {
    render(
      <Modal open title="Run extraction" description="Choose a document">
        Body
      </Modal>
    )
    const dialog = screen.getByRole('dialog', { name: 'Run extraction' })
    expect(dialog).toHaveAccessibleDescription('Choose a document')
  })

  it('shows nothing when showWhen is false', () => {
    render(
      <Modal open showWhen={false} title="Title" description="About">
        Body
      </Modal>
    )
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})

describe('Modal - buttons', () => {
  it('puts secondary buttons at the left and the first primary button at the far right', () => {
    render(
      <Modal
        open
        title="Title"
        description="About"
        secondaryButtons={[{ label: 'Skip' }, { label: 'Back' }]}
        primaryButtons={[{ label: 'Create' }, { label: 'Create and open' }]}
      >
        Body
      </Modal>
    )
    // The close control comes first in the document; the footer follows, least to most prominent
    expect(labels(screen.getByRole('dialog')).filter(Boolean)).toEqual(['Skip', 'Back', 'Create and open', 'Create'])
  })

  it('makes primary buttons SOLID and secondary buttons OUTLINE unless they say otherwise', () => {
    render(
      <Modal
        open
        title="Title"
        description="About"
        secondaryButtons={[{ label: 'Back' }]}
        primaryButtons={[{ label: 'Next' }, { label: 'Save', style: 'OUTLINE' }]}
      >
        Body
      </Modal>
    )
    const solid = screen.getByRole('button', { name: 'Next' }).className
    const outline = screen.getByRole('button', { name: 'Back' }).className
    expect(solid).not.toEqual(outline)
    expect(screen.getByRole('button', { name: 'Save' }).className).toEqual(outline)
  })

  it('leaves out a button whose showWhen is false', () => {
    render(
      <Modal
        open
        title="Title"
        description="About"
        secondaryButtons={[{ label: 'Back', showWhen: false }]}
        primaryButtons={[{ label: 'Next' }]}
      >
        Body
      </Modal>
    )
    expect(screen.queryByRole('button', { name: 'Back' })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Next' })).toBeInTheDocument()
  })

  it('has no footer when there are no buttons and no steps', () => {
    render(
      <Modal open title="Title" description="About" size="SMALL">
        Body
      </Modal>
    )
    // Only the close (X) control is left
    expect(screen.getAllByRole('button')).toHaveLength(1)
    expect(screen.getByRole('button', { name: 'Close dialog' })).toBeInTheDocument()
  })

  it('calls onClick when a footer button is pressed', () => {
    const onClick = vi.fn()
    render(
      <Modal open title="Title" description="About" primaryButtons={[{ label: 'Run', onClick }]}>
        Body
      </Modal>
    )
    fireEvent.click(screen.getByRole('button', { name: 'Run' }))
    expect(onClick).toHaveBeenCalledTimes(1)
  })
})

describe('Modal - steps', () => {
  it('lists the steps and marks the current one in a LARGE modal', () => {
    render(
      <Modal open title="Create" description="About" size="LARGE" steps={STEPS} activeStep={1}>
        Body
      </Modal>
    )
    for (const step of STEPS) expect(screen.getByText(step)).toBeInTheDocument()
    expect(screen.getByText('Configure sections').closest('[aria-current]')).not.toBeNull()
  })

  it('makes finished steps links when onStepSelect is given, and calls it with the step', () => {
    const onStepSelect = vi.fn()
    render(
      <Modal open title="Create" description="About" size="LARGE" steps={STEPS} activeStep={2} onStepSelect={onStepSelect}>
        Body
      </Modal>
    )
    fireEvent.click(screen.getByRole('button', { name: /Model details/ }))
    expect(onStepSelect).toHaveBeenCalledWith(0)
    // The current step and the ones ahead are not links
    expect(screen.queryByRole('button', { name: /Refine prompt/ })).not.toBeInTheDocument()
  })

  it('leaves the steps unlinked without onStepSelect', () => {
    render(
      <Modal open title="Create" description="About" size="LARGE" steps={STEPS} activeStep={2}>
        Body
      </Modal>
    )
    expect(screen.queryByRole('button', { name: /Model details/ })).not.toBeInTheDocument()
  })

  it('ignores steps in a SMALL or MEDIUM modal', () => {
    render(
      <Modal open title="Create" description="About" size="MEDIUM" steps={STEPS}>
        Body
      </Modal>
    )
    expect(screen.queryByText('Model details')).not.toBeInTheDocument()
  })
})

describe('ModalHero and ModalSection', () => {
  it('puts a section under a heading, with its line of description', () => {
    render(
      <ModalHero>
        <ModalSection title="Test case" description="Keep this run.">
          <span>Inside</span>
        </ModalSection>
      </ModalHero>
    )
    expect(screen.getByRole('heading', { name: 'Test case', level: 3 })).toBeInTheDocument()
    expect(screen.getByText('Keep this run.')).toBeInTheDocument()
    expect(screen.getByText('Inside')).toBeInTheDocument()
  })

  it('draws the gradient ground behind its content', () => {
    render(
      <ModalHero>
        <span>Inside</span>
      </ModalHero>
    )
    const ground = screen.getByText('Inside').parentElement!.parentElement as HTMLElement
    expect(ground.style.backgroundImage).toContain('radial-gradient')
  })
})

describe('ModalHeading', () => {
  it('is a level 3 heading with its line under it', () => {
    render(<ModalHeading title="Configure Sections" description="Where fields are looked for" />)
    expect(screen.getByRole('heading', { name: 'Configure Sections', level: 3 })).toBeInTheDocument()
    expect(screen.getByText('Where fields are looked for')).toBeInTheDocument()
  })

  it('can be centred, and is centred', () => {
    render(<ModalHeading title="Model Details" align="CENTER" />)
    expect(screen.getByRole('heading', { name: 'Model Details' }).className).toContain('text-center')
  })

  it('is 16px: smaller than the modal title (text-lg) and larger than a section title (text-sm)', () => {
    render(
      <Modal open title="Create" description="About">
        <ModalHeading title="Configure Sections" />
        <ModalSection title="Main Section">Inside</ModalSection>
      </Modal>
    )
    expect(screen.getByRole('heading', { name: 'Create' }).className).toContain('text-lg')
    expect(screen.getByRole('heading', { name: 'Configure Sections' }).className).toContain('text-[16px]')
    expect(screen.getByRole('heading', { name: 'Main Section' }).className).toContain('text-sm')
  })
})

describe('Modal - closing', () => {
  it('calls onOpenChange and onClose when the close control is pressed', () => {
    const onOpenChange = vi.fn()
    const onClose = vi.fn()
    render(
      <Modal open title="Title" description="About" onOpenChange={onOpenChange} onClose={onClose}>
        Body
      </Modal>
    )
    fireEvent.click(screen.getByRole('button', { name: 'Close dialog' }))
    expect(onOpenChange).toHaveBeenCalledWith(false)
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('names the close control with closeAccessibilityText, so a project can translate it', () => {
    render(
      <Modal open title="Title" description="About" closeAccessibilityText="Cerrar">
        Body
      </Modal>
    )
    expect(screen.getByRole('button', { name: 'Cerrar' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Close dialog' })).not.toBeInTheDocument()
  })

  it('closes on Escape', () => {
    const onOpenChange = vi.fn()
    render(
      <Modal open title="Title" description="About" onOpenChange={onOpenChange}>
        Body
      </Modal>
    )
    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' })
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it('stays open on Escape when closeOnEscape is false', () => {
    const onOpenChange = vi.fn()
    render(
      <Modal open title="Title" description="About" closeOnEscape={false} onOpenChange={onOpenChange}>
        Body
      </Modal>
    )
    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' })
    expect(onOpenChange).not.toHaveBeenCalled()
  })

  it('opens from its trigger', () => {
    render(
      <Modal title="Title" description="About" trigger={<button type="button">Open it</button>}>
        Body
      </Modal>
    )
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Open it' }))
    expect(screen.getByRole('dialog', { name: 'Title' })).toBeInTheDocument()
  })
})

describe('Modal - button text for screen readers', () => {
  it('names the whole row of buttons, with only primary buttons', () => {
    render(
      <Modal open title="Title" description="About" accessibilityText="Run actions" primaryButtons={[{ label: 'Run' }]}>
        Body
      </Modal>
    )
    const group = screen.getByRole('group', { name: 'Run actions' })
    expect(within(group).getByRole('button', { name: 'Run' })).toBeInTheDocument()
  })

  it('names the whole row of buttons, with both kinds', () => {
    render(
      <Modal
        open
        title="Title"
        description="About"
        accessibilityText="Wizard actions"
        secondaryButtons={[{ label: 'Back' }]}
        primaryButtons={[{ label: 'Next' }]}
      >
        Body
      </Modal>
    )
    const group = screen.getByRole('group', { name: 'Wizard actions' })
    expect(within(group).getAllByRole('button').map(b => b.textContent)).toEqual(['Back', 'Next'])
  })
})

describe('Modal - steps edge cases', () => {
  it('shows no list of steps for an empty list', () => {
    render(
      <Modal open title="Title" description="About" size="LARGE" steps={[]}>
        Body
      </Modal>
    )
    expect(screen.queryByRole('list')).not.toBeInTheDocument()
  })

  it('does not break when activeStep is past the last step', () => {
    render(
      <Modal open title="Title" description="About" size="LARGE" steps={STEPS} activeStep={9}>
        Body
      </Modal>
    )
    for (const step of STEPS) expect(screen.getByText(step)).toBeInTheDocument()
    expect(screen.getByText('Body')).toBeInTheDocument()
  })
})

describe('ModalHero and ModalCard', () => {
  it.each([
    ['STANDARD', 'max-w-xl'],
    ['WIDE', 'max-w-4xl'],
  ] as const)('keeps the %s column to %s', (width, widthClass) => {
    render(
      <ModalHero width={width}>
        <span>Inside</span>
      </ModalHero>
    )
    expect(screen.getByText('Inside').parentElement!.className).toContain(widthClass)
  })

  it('lets the FILL column run the width of the panel', () => {
    render(
      <ModalHero width="FILL">
        <span>Inside</span>
      </ModalHero>
    )
    const column = screen.getByText('Inside').parentElement!.className
    expect(column).not.toContain('max-w-')
  })

  it('puts its children in a card', () => {
    render(
      <ModalCard>
        <span>Inside</span>
      </ModalCard>
    )
    expect(screen.getByText('Inside')).toBeInTheDocument()
  })
})

describe('Modal - moving between steps', () => {
  /** jsdom has no Element.animate, so stand one in and record how it is called */
  const stubAnimate = (reducedMotion = false) => {
    const cancel = vi.fn()
    const animate = vi.fn(() => ({ cancel }))
    Object.defineProperty(HTMLElement.prototype, 'animate', { configurable: true, writable: true, value: animate })
    vi.stubGlobal('matchMedia', (query: string) => ({
      matches: reducedMotion && query.includes('prefers-reduced-motion'),
      media: query,
      addEventListener: () => {},
      removeEventListener: () => {},
    }))
    return animate
  }

  afterEach(() => {
    vi.unstubAllGlobals()
    delete (HTMLElement.prototype as { animate?: unknown }).animate
  })

  const wizard = (activeStep: number, heading = `Page ${activeStep}`) => (
    <Modal open title="Create" description="About" size="LARGE" steps={STEPS} activeStep={activeStep}>
      <ModalHeading title={heading} />
    </Modal>
  )

  it('does not slide or move focus when the modal opens', () => {
    const animate = stubAnimate()
    render(wizard(0))
    expect(animate).not.toHaveBeenCalled()
    expect(screen.getByRole('heading', { name: 'Page 0' })).not.toHaveFocus()
  })

  it('slides in from the left, 88px, when moving to a later step', () => {
    const animate = stubAnimate()
    const { rerender } = render(wizard(0))
    rerender(wizard(1))
    expect(animate).toHaveBeenCalledTimes(1)
    const [frames, options] = animate.mock.calls[0] as unknown as [Keyframe[], KeyframeAnimationOptions]
    expect(frames).toEqual([{ transform: 'translateX(-88px)' }, { transform: 'translateX(0)' }])
    expect(options).toMatchObject({ duration: 850, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' })
  })

  it('slides in from the right, 88px, when going back', () => {
    const animate = stubAnimate()
    const { rerender } = render(wizard(2))
    rerender(wizard(1))
    const [frames] = animate.mock.calls[0] as unknown as [Keyframe[]]
    expect(frames[0]).toEqual({ transform: 'translateX(88px)' })
  })

  it('slides the other way in a right-to-left language', () => {
    const animate = stubAnimate()
    const { rerender, baseElement } = render(wizard(0))
    baseElement.ownerDocument.documentElement.dir = 'rtl'
    rerender(wizard(1))
    baseElement.ownerDocument.documentElement.dir = 'ltr'
    const [frames] = animate.mock.calls[0] as unknown as [Keyframe[]]
    expect(frames[0]).toEqual({ transform: 'translateX(88px)' })
  })

  it('moves focus to the new first heading, so a screen reader reads the new page', () => {
    stubAnimate()
    const { rerender } = render(wizard(0))
    rerender(wizard(1))
    expect(screen.getByRole('heading', { name: 'Page 1' })).toHaveFocus()
  })

  it('moves focus even for a reader who prefers reduced motion, but does not slide', () => {
    const animate = stubAnimate(true)
    const { rerender } = render(wizard(0))
    rerender(wizard(1))
    expect(animate).not.toHaveBeenCalled()
    expect(screen.getByRole('heading', { name: 'Page 1' })).toHaveFocus()
  })

  it('leaves the heading out of the Tab order', () => {
    stubAnimate()
    const { rerender } = render(wizard(0))
    rerender(wizard(1))
    expect(screen.getByRole('heading', { name: 'Page 1' })).toHaveAttribute('tabindex', '-1')
  })

  it('does nothing when only something else changes', () => {
    const animate = stubAnimate()
    const { rerender } = render(wizard(1, 'Same'))
    rerender(wizard(1, 'Same'))
    expect(animate).not.toHaveBeenCalled()
  })

  it('does not slide in a MEDIUM modal', () => {
    const animate = stubAnimate()
    const { rerender } = render(
      <Modal open title="Run" description="About" size="MEDIUM" steps={STEPS} activeStep={0}>
        Body
      </Modal>
    )
    rerender(
      <Modal open title="Run" description="About" size="MEDIUM" steps={STEPS} activeStep={1}>
        Body
      </Modal>
    )
    expect(animate).not.toHaveBeenCalled()
  })
})
