import * as React from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { ButtonArrayLayout } from '../../components/Button/ButtonArrayLayout'
import type { ButtonWidgetProps } from '../../components/Button/ButtonWidget'
import { CardLayout } from '../../components/Card/CardLayout'
import { DialogField } from '../../components/Dialog/DialogField'
import type { DialogWidth } from '../../components/Dialog/DialogField'
import { HeadingField } from '../../components/Heading/HeadingField'
import { MilestoneField } from '../../components/Milestone/MilestoneField'
import { RichTextDisplayField } from '../../components/RichText/RichTextDisplayField'
import { TextItem } from '../../components/RichText/TextItem'
import type { SAILDynamicLink } from '../../types/sail'

/**
 * Modal pattern
 * Demonstrates: a dialog in three sizes, with a body that scrolls and a footer that stays in
 * view. Built from DialogField, ButtonArrayLayout, CardLayout, MilestoneField, HeadingField and
 * RichTextDisplayField.
 *
 * This is a pattern, not a library component: nothing here is exported from
 * `@pglevy/sailwind`. Copy the file into your project and adjust it. SAIL has no dialog
 * layout of its own, so the options below are choices made by this pattern, not SAIL
 * parameters. The sizes are the widths of an Appian record action dialog, which is what
 * DialogField follows.
 *
 * Sizes
 * - `SMALL` is a Narrow dialog (480px). It asks one question: pick one of a few things. Choosing
 *   is the action, so it usually has no buttons of its own.
 * - `MEDIUM` is a Medium dialog (720px). It gathers a few related inputs and ends in one
 *   action. Put the content in a `ModalHero` for the soft gradient ground, with
 *   `ModalSection`s on it.
 * - `LARGE` is a Full dialog (96% of the window). It is for a task with steps: give it `steps`
 *   and `activeStep` and it adds a list of the steps down the left. Put each step's content
 *   in a `ModalHero`, so every step has the gradient ground, and head it with a
 *   `ModalHeading`. It keeps one height from step to step, so the footer does not move.
 *   Changing `activeStep` slides the content in, like a drilldown: moving on to a later step it
 *   travels left to right, going back it travels right to left (reversed in a right-to-left
 *   language). Nothing slides for a reader who
 *   has asked for less motion. Focus moves to the new page's first heading, so a screen reader
 *   reads it. The list of steps is hidden below 640px wide, so LARGE is meant for a tablet or
 *   wider.
 *
 * Buttons
 * - `primaryButtons` and `secondaryButtons` are named and ordered as in Appian's
 *   a!buttonLayout (https://docs.appian.com/suite/help/26.9/Button_Layout.html): the first
 *   primary button is the most prominent and sits at the far right, the first secondary
 *   button is the least prominent and sits at the far left. A button that gives no `style`
 *   is SOLID if primary and OUTLINE if secondary.
 * - There is no Cancel button. The modal shows a close (X) control.
 * - The buttons are rendered in the order they appear on screen, so Tab moves the way the
 *   eye does.
 * - Unlike a!buttonLayout, the buttons stay in one row on a phone instead of stacking.
 *
 * Titles come in three sizes, largest first: the modal's own (18px), a page of the modal (16px,
 * `ModalHeading`), and a section on a page (14px, `ModalSection`). Each sits close to its line.
 * DialogField fixes the space under its own title, so the modal draws its title, line and close
 * (X) control itself, inside DialogField's panel, to keep that space as tight as the others.
 * Its label, "Close dialog", is a prop (`closeAccessibilityText`) so a project can translate it.
 *
 * Everything inside the modal is a Sailwind component. The one thing drawn by hand is the
 * gradient ground of `ModalHero`, because no Sailwind component has one.
 *
 * Not in SAIL: `size`, `steps`, `activeStep`, `onStepSelect` and the pieces below the modal
 * (`ModalHeading`, `ModalHero`, `ModalCard` and `ModalSection`).
 */

export type ModalSize = 'SMALL' | 'MEDIUM' | 'LARGE'

/** The DialogField width each size uses */
const WIDTH: Record<ModalSize, DialogWidth> = {
  SMALL: 'NARROW',
  MEDIUM: 'MEDIUM',
  LARGE: 'FIT',
}

/**
 * The body's height. SMALL and MEDIUM grow with their content up to this and then scroll. LARGE
 * is always this tall, so the footer stays put when one step has more to show than the next.
 * Each is a share of the window's height, but never more than the window less 14rem, which is
 * what the title, footer and padding need, so a short window scrolls the body, not the dialog.
 */
const BODY_HEIGHT: Record<ModalSize, string> = {
  SMALL: 'max-h-[min(50vh,calc(100vh_-_14rem))]',
  MEDIUM: 'max-h-[min(60vh,calc(100vh_-_14rem))]',
  LARGE: 'h-[min(70vh,calc(100vh_-_14rem))]',
}

export interface ModalProps {
  /** Whether the modal is open */
  open?: boolean
  /** Called when the modal opens or closes */
  onOpenChange?: (open: boolean) => void
  /** The element that opens the modal. It must pass a ref on, as a plain `button` does. */
  trigger?: React.ReactNode
  /** The title, which names the modal for a screen reader */
  title: string
  /** A line under the title saying what the modal is for. It describes the modal to a screen reader. */
  description: string
  /** SMALL asks one question; MEDIUM gathers a few inputs; LARGE walks through steps */
  size?: ModalSize
  /** What the modal holds. It scrolls inside the modal; the title and buttons do not. */
  children: React.ReactNode
  /**
   * Prominent buttons, as a!buttonLayout's `primaryButtons`: the first is the most prominent
   * and sits at the far right.
   */
  primaryButtons?: ButtonWidgetProps[]
  /**
   * Less prominent buttons, as a!buttonLayout's `secondaryButtons`: the first is the least
   * prominent and sits at the far left.
   */
  secondaryButtons?: ButtonWidgetProps[]
  /** Additional text for screen readers about the buttons. Produces no visible change. */
  accessibilityText?: string
  /** LARGE only: the name of each step, shown as a list down the left. Keep them short. */
  steps?: string[]
  /** LARGE only: the index of the current step */
  activeStep?: number
  /**
   * LARGE only: called with the index of a step the user has finished when they pick it in the
   * list, so they can go back to it. Without it the list is not clickable.
   */
  onStepSelect?: (index: number) => void
  /** LARGE only: additional text for screen readers about the list of steps */
  stepsAccessibilityText?: string
  /** Called when the modal closes */
  onClose?: () => void
  /** Whether pressing Escape closes the modal. Turn off in a wizard, where it would lose the user's input. */
  closeOnEscape?: boolean
  /** Whether clicking outside the modal closes it. Turn off in a wizard, where it would lose the user's input. */
  closeOnOutsideClick?: boolean
  /** The close (X) control's name for a screen reader. Pass a translation. Default: "Close dialog". */
  closeAccessibilityText?: string
  /** Whether the modal is displayed. Default: true. */
  showWhen?: boolean
}

const isShown = (button: ButtonWidgetProps) => button.showWhen !== false

/**
 * The line under a page or section title. RichTextDisplayField takes its font size from its
 * parent (16px), so a 12px line of text would sit in a 22px-tall line box with a gap above it.
 * Setting the size on the wrapper too makes the box fit the text, and the small margin keeps it
 * close to the title without touching it.
 */
const LINE_UNDER_TITLE = 'mt-1 text-xs [&>div]:leading-snug'

/**
 * The slide between steps, in the style of a drilldown: the content moves 88px sideways over
 * 850ms and decelerates all the way in.
 * Only the position changes, with no fade, so nothing flickers. Moving to a later step it
 * starts to the left of where it rests and travels right; going back it starts to the right.
 */
const SLIDE_DISTANCE = 88
const SLIDE_DURATION = 850
const SLIDE_EASING = 'cubic-bezier(0.16, 1, 0.3, 1)'

/**
 * Each time `step` changes, moves focus to the new page's first heading and slides the content
 * in. Focus moves so a screen reader reads the new page, and so focus isn't lost when the step
 * that was clicked in the list stops being a link. It is mounted with the modal, so nothing
 * happens when the modal opens, only when the step moves. The slide uses the Web Animations API
 * instead of a keyframes rule, so the pattern stays one file and adds nothing to the library's CSS.
 */
const StepSlide: React.FC<{ step: number; children: React.ReactNode }> = ({ step, children }) => {
  const ref = React.useRef<HTMLDivElement>(null)
  const previous = React.useRef(step)

  React.useLayoutEffect(() => {
    const from = previous.current
    previous.current = step
    const element = ref.current
    if (from === step || !element) return

    // A heading is not focusable until it is given a tabindex; -1 lets code focus it, not Tab
    const target = element.querySelector<HTMLElement>('h1, h2, h3') ?? element
    target.tabIndex = -1
    target.focus({ preventScroll: true })

    if (typeof element.animate !== 'function') return
    if (typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    // Later steps come in from the start side and earlier ones from the end side, so in a
    // right-to-left language the slide runs the other way
    const isRtl = element.closest('[dir]')?.getAttribute('dir') === 'rtl' || getComputedStyle(element).direction === 'rtl'
    const direction = isRtl ? -1 : 1
    const offset = (step > from ? -SLIDE_DISTANCE : SLIDE_DISTANCE) * direction
    const animation = element.animate(
      [{ transform: `translateX(${offset}px)` }, { transform: 'translateX(0)' }],
      { duration: SLIDE_DURATION, easing: SLIDE_EASING }
    )
    return () => animation.cancel()
  }, [step])

  return <div ref={ref}>{children}</div>
}

/**
 * Modal
 * Not exported from the library: see the note at the top of this file.
 */
export const Modal: React.FC<ModalProps> = ({
  open,
  onOpenChange,
  trigger,
  title,
  description,
  size = 'MEDIUM',
  children,
  primaryButtons = [],
  secondaryButtons = [],
  accessibilityText,
  steps,
  activeStep = 0,
  onStepSelect,
  stepsAccessibilityText,
  onClose,
  closeOnEscape = true,
  closeOnOutsideClick = true,
  closeAccessibilityText = 'Close dialog',
  showWhen = true,
}) => {
  const shownSecondary = secondaryButtons.filter(isShown).map(button => ({ style: 'OUTLINE' as const, ...button }))
  // The first primary button is the most prominent, so it goes last, at the far right
  const shownPrimary = primaryButtons
    .filter(isShown)
    .map(button => ({ style: 'SOLID' as const, ...button }))
    .reverse()
  const hasButtons = shownSecondary.length + shownPrimary.length > 0
  const showSteps = size === 'LARGE' && steps !== undefined && steps.length > 0

  // A step that is done can be gone back to; the current step and those ahead are not links
  const stepLinks: SAILDynamicLink[] | undefined =
    showSteps && onStepSelect
      ? steps.map((_, index) =>
          index < activeStep ? { onClick: () => onStepSelect(index) } : { showWhen: false }
        )
      : undefined

  return (
    <DialogField
      open={open}
      onOpenChange={onOpenChange}
      onClose={onClose}
      trigger={trigger}
      width={WIDTH[size]}
      showCloseButton={false}
      closeOnEscape={closeOnEscape}
      closeOnOutsideClick={closeOnOutsideClick}
      showWhen={showWhen}
      marginBelow="NONE"
    >
      <div className="flex flex-col">
        <div className="mb-4 flex items-start justify-between">
          <div className="min-w-0 flex-1">
            <Dialog.Title className="m-0 text-lg font-semibold leading-tight text-gray-900">{title}</Dialog.Title>
            <Dialog.Description className="m-0 mt-0.5 text-sm leading-snug text-gray-700">
              {description}
            </Dialog.Description>
          </div>
          <Dialog.Close asChild>
            <button
              type="button"
              className="ml-4 rounded-sm p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              aria-label={closeAccessibilityText}
            >
              <X className="h-4 w-4" />
            </button>
          </Dialog.Close>
        </div>
        <div className={`flex min-h-0 gap-5 ${BODY_HEIGHT[size]}`}>
          {showSteps && (
            // A finished step is wrapped in a button, which is inline by default and so adds a
            // line of space under each one. Making it a block keeps every step the same height.
            <div className="w-40 shrink-0 overflow-y-auto border-r border-gray-200 pr-4 max-sm:hidden [&_li>button]:block">
              <MilestoneField
                steps={steps}
                links={stepLinks}
                active={activeStep}
                stepStyle="DOT"
                orientation="VERTICAL"
                accessibilityText={stepsAccessibilityText}
                marginBelow="NONE"
              />
            </div>
          )}
          {/* The padding and matching negative margin leave room for a focus ring, and for a card
              that lifts on hover, which the scroll area would otherwise cut off at the edge */}
          <div className={`-m-1 min-w-0 flex-1 overflow-y-auto p-1 ${showSteps ? 'overflow-x-hidden' : ''}`}>
            {showSteps ? <StepSlide step={activeStep}>{children}</StepSlide> : children}
          </div>
        </div>

        {hasButtons && (
          <div
            // The text covers every button, as a!buttonLayout's does, not just one side of the row
            role={accessibilityText ? 'group' : undefined}
            aria-label={accessibilityText}
            className="mt-4 flex shrink-0 flex-wrap items-center justify-between gap-2 border-t border-gray-200 pt-4"
          >
            {shownSecondary.length > 0 && <ButtonArrayLayout buttons={shownSecondary} align="START" marginBelow="NONE" />}
            {shownPrimary.length > 0 && (
              <ButtonArrayLayout buttons={shownPrimary} align="END" marginBelow="NONE" className="ml-auto" />
            )}
          </div>
        )}
      </div>
    </DialogField>
  )
}

/* -------------------------------------------------------------------------- */
/* Pieces to put in a modal                                                    */
/* -------------------------------------------------------------------------- */

/**
 * The ground of a hero panel: three soft washes of colour over a grid of dots. The hexes are
 * the pink-50, blue-50 and violet-50 steps of the palette and the dots are gray-200. They are
 * written out because the theme only emits the colours that a class uses.
 */
const HERO_GROUND: React.CSSProperties = {
  backgroundColor: '#FFFFFF',
  backgroundImage:
    'radial-gradient(60% 55% at 12% 0%, #FDF2F8 0%, transparent 70%), radial-gradient(50% 50% at 92% 8%, #E9E9FE 0%, transparent 70%), radial-gradient(60% 60% at 75% 100%, #F5F3FF 0%, transparent 70%), radial-gradient(#E5E7EB 1px, transparent 1px)',
  backgroundSize: 'auto, auto, auto, 24px 24px',
}

/**
 * ModalHeading
 * The title of a page of the modal and the line under it. The title is 16px, smaller than the
 * modal's own 18px and larger than a section's 14px, and sits close to its line. Centre it inside a
 * ModalHero for the first step of a wizard.
 */
export const ModalHeading: React.FC<{
  title: string
  description?: string
  align?: 'START' | 'CENTER'
}> = ({ title, description, align = 'START' }) => (
  <div>
    <HeadingField
      text={title}
      size="SMALL"
      headingTag="H3"
      fontWeight="SEMI_BOLD"
      align={align}
      marginBelow="NONE"
      // 16px is between HeadingField's SMALL (14px) and MEDIUM (18px). Setting the size here
      // replaces the alignment class HeadingField adds, so the alignment is set here too.
      className={`text-[16px] leading-tight ${align === 'CENTER' ? 'text-center' : 'text-left'}`}
    />
    {description && (
      <RichTextDisplayField
        align={align}
        marginAbove="NONE"
        marginBelow="NONE"
        className={LINE_UNDER_TITLE}
        value={[<TextItem key="description" text={description} size="SMALL" color="SECONDARY" />]}
      />
    )}
  </div>
)

/** The width of a hero's column of content */
const HERO_COLUMN: Record<'STANDARD' | 'WIDE' | 'FILL', string> = {
  STANDARD: 'max-w-xl',
  WIDE: 'max-w-4xl',
  FILL: '',
}

/**
 * ModalHero
 * A bordered CardLayout whose ground is the gradient, holding ModalSections. Its content is
 * centred in a column and spaced evenly. Best in a MEDIUM modal, and in every step of a LARGE one.
 */
export const ModalHero: React.FC<{
  children: React.ReactNode
  /**
   * How wide the column of content is. STANDARD is about 576px, WIDE about 896px, and FILL runs
   * the width of the panel.
   */
  width?: 'STANDARD' | 'WIDE' | 'FILL'
}> = ({ children, width = 'STANDARD' }) => (
  <CardLayout padding="NONE" style="TRANSPARENT" marginBelow="NONE" className="overflow-hidden">
    <div className="relative px-5 py-6" style={HERO_GROUND}>
      <div className={`relative mx-auto flex flex-col gap-5 ${HERO_COLUMN[width]}`}>{children}</div>
    </div>
  </CardLayout>
)

/** ModalCard: a white CardLayout, for sitting on a ModalHero */
export const ModalCard: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <CardLayout padding="STANDARD" marginBelow="NONE" className={className}>
    {children}
  </CardLayout>
)

/** ModalSection: a ModalCard with a heading and a line saying what it is for */
export const ModalSection: React.FC<{
  title: string
  description?: string
  children: React.ReactNode
}> = ({ title, description, children }) => (
  <ModalCard>
    <HeadingField
      text={title}
      size="SMALL"
      headingTag="H3"
      fontWeight="SEMI_BOLD"
      marginBelow="NONE"
      className="leading-tight"
    />
    {description && (
      <RichTextDisplayField
        marginAbove="NONE"
        marginBelow="NONE"
        className={LINE_UNDER_TITLE}
        value={[<TextItem key="description" text={description} size="SMALL" color="SECONDARY" />]}
      />
    )}
    <div className="mt-3 flex flex-col gap-4">{children}</div>
  </ModalCard>
)
