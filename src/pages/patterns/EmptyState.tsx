import * as React from 'react'
import { CardLayout } from '../../components/Card/CardLayout'
import { ButtonWidget } from '../../components/Button/ButtonWidget'
import type { ButtonWidgetProps } from '../../components/Button/ButtonWidget'
import { ImageField } from '../../components/Image/ImageField'
import type { DocumentImageProps, IllustrationImageProps, WebImageProps } from '../../components/Image'
import { RichTextDisplayField } from '../../components/RichText/RichTextDisplayField'
import { TextItem } from '../../components/RichText/TextItem'
import type { SAILMarginSize } from '../../types/sail'
import { ChevronDown } from 'lucide-react'

/**
 * Empty State pattern
 * Demonstrates: a panel that says there is nothing here yet, why, and optionally what to
 * do about it. Built from CardLayout, ImageField, RichTextDisplayField and a button layout.
 *
 * This is a pattern, not a library component: nothing here is exported from
 * `@pglevy/sailwind`. Copy the file into your project and adjust it. SAIL has no empty
 * state, so every option below is a choice made by this pattern, not a SAIL parameter.
 * The picture is an `image` field: an illustration, a document image or a web image (the
 * ImageField image types that make sense here). By default it is the `NO_DATA` illustration, which animates in; the
 * words do not move. The empty state has no animation setting of its own: to turn an
 * illustration's animation off, give the image `showAnimation: false`.
 *
 * Variants
 * - `size="LARGE"` fills a panel; `size="SMALL"` is compact enough for a popover
 * - `image` is the picture, as one of ImageField's images: an illustration
 *   (`{ imageType: 'illustration', illustration: 'TRIGGERS' }`), or a document or web image. An illustration sits behind the words, which are placed to suit its shape (400 × 176,
 *   centre in the middle, nothing below 57 units from it). Any other image can be any shape, so
 *   it sits above the words, in the flow, at its natural proportions and no taller than 160px
 *   (LARGE) or 112px (SMALL).
 * - `primaryButtons` and `secondaryButtons` add a call to action: one button, or a group of
 *   them. Leave both out for none. They are named and ordered as in Appian's
 *   a!buttonLayout (see ButtonLayout below). In a SMALL empty state a group shares the row
 *   equally; in a LARGE one the buttons keep their own widths and sit together.
 * - The card fills the width of whatever it is in
 *
 * Text is the same in every variant: the first line is `TextItem` STANDARD and STRONG, the
 * second STANDARD in SECONDARY. Only the picture changes size: LARGE draws it 400px wide,
 * SMALL 260px, and either shrinks to fit a narrower container.
 */

export type EmptyStateSize = 'SMALL' | 'LARGE'

/**
 * The pictures an empty state can take. A user image is left out: it is drawn as a round avatar
 * with no height of its own to hold, so it cannot be fitted above the words the way a
 * document or web image is.
 */
export type EmptyStateImage = DocumentImageProps | WebImageProps | IllustrationImageProps

const NO_DATA_IMAGE: EmptyStateImage = { imageType: 'illustration', illustration: 'NO_DATA' }

/**
 * The picture's width at each size, the gap under its centre to the words, and the space under
 * the words. The gap clears the lowest tile in every picture (57 units below the centre, scaled
 * to the picture's width) with a little room to spare.
 */
const LAYOUT: Record<EmptyStateSize, { width: number; gap: number; bottom: string }> = {
  SMALL: { width: 260, gap: 46, bottom: 'pb-4' },
  LARGE: { width: 400, gap: 66, bottom: 'pb-7' },
}

/**
 * The lower part of the picture fades out so the rings never run through the words. The
 * words start at about 87-90% of the way down the picture's box, where this reaches nothing.
 */
const FADE = 'linear-gradient(to bottom, #000 0%, #000 72%, transparent 90%)'

/** Tailwind's `sm` breakpoint, which is where buttons move from a stack to a row */
const WIDE_QUERY = '(min-width: 40rem)'

const subscribeToWidth = (onChange: () => void) => {
  if (typeof window.matchMedia !== 'function') return () => {}
  const query = window.matchMedia(WIDE_QUERY)
  query.addEventListener('change', onChange)
  return () => query.removeEventListener('change', onChange)
}

/** Whether the window is wide enough for a row of buttons. Assumes wide where it cannot tell. */
const useIsWide = () =>
  React.useSyncExternalStore(
    subscribeToWidth,
    () => (typeof window.matchMedia === 'function' ? window.matchMedia(WIDE_QUERY).matches : true),
    () => true
  )

/** The picture's centre sits this far down it, as a share of its width (88 of 400) */
const CENTRE = 0.22

/**
 * The tallest a picture that is not an illustration may be at each size. An illustration has a
 * fixed shape the words are laid out around; a document, web or user image can be any shape, so
 * it sits above the words and is held to a height instead.
 */
const IMAGE_MAX_HEIGHT: Record<EmptyStateSize, string> = {
  SMALL: '[&_img]:max-h-28',
  LARGE: '[&_img]:max-h-40',
}

/* -------------------------------------------------------------------------- */
/* The pattern                                                                 */
/* -------------------------------------------------------------------------- */

export interface EmptyStateProps {
  /** First line: what is missing, as a statement ("No test cases yet") */
  title: string
  /** Second line: why it is worth adding, or how to add it */
  description?: string
  /** The picture at the top: an illustration, a document image or a web image. Defaults to the NO_DATA illustration. */
  image?: EmptyStateImage
  /** LARGE fills a panel; SMALL fits a popover */
  size?: EmptyStateSize
  /**
   * Prominent buttons, as a!buttonLayout's `primaryButtons`: the first is the most prominent
   * and sits at the far right. Leave both button parameters out for an empty state with
   * nothing to do about it.
   */
  primaryButtons?: ButtonWidgetProps[]
  /**
   * Less prominent buttons, as a!buttonLayout's `secondaryButtons`: the first is the least
   * prominent and sits at the far left.
   */
  secondaryButtons?: ButtonWidgetProps[]
  /** Additional text for screen readers about the buttons. Produces no visible change. */
  accessibilityText?: string
  /** Whether the empty state is displayed. Default: true. */
  showWhen?: boolean
  /** Whether the card has a border. Turn off inside something that already has one. */
  showBorder?: boolean
  marginBelow?: SAILMarginSize
}

/**
 * ButtonLayout
 * Displays buttons grouped by prominence, following Appian's a!buttonLayout:
 * https://docs.appian.com/suite/help/26.9/Button_Layout.html
 *
 * - `primaryButtons`: the first is the most prominent. `secondaryButtons`: the first is the
 *   least prominent.
 * - On web and tablet the buttons sit in a row with the most prominent at the far right and
 *   the least prominent at the far left. On a phone they stack, most prominent at the top.
 *   The buttons are rendered in the order they appear on screen, so Tab always moves through
 *   them the way the eye does. That means the order in the document changes with the width
 *   of the window: least to most prominent in a row, most to least in a stack. (Reversing
 *   the stack with CSS would leave Tab running against what is on screen.)
 *
 * Not in a!buttonLayout: a button that gives no `style` is SOLID if primary and OUTLINE if
 * secondary, so prominence shows as well as being placed, and `share` makes the buttons
 * split the row between them. Sailwind has no ButtonLayout of its own, so this is local to
 * the pattern.
 */
export const ButtonLayout: React.FC<{
  primaryButtons?: ButtonWidgetProps[]
  secondaryButtons?: ButtonWidgetProps[]
  accessibilityText?: string
  size: 'SMALL' | 'STANDARD'
  share?: boolean
}> = ({ primaryButtons = [], secondaryButtons = [], accessibilityText, size, share = false }) => {
  const isWide = useIsWide()

  // Least to most prominent: the secondary buttons as given, then the primary buttons reversed
  const leastToMost = [
    ...secondaryButtons.map(button => ({ style: 'OUTLINE' as const, ...button })),
    ...[...primaryButtons].reverse().map(button => ({ style: 'SOLID' as const, ...button })),
  ].filter(button => button.showWhen !== false)
  if (leastToMost.length === 0) return null

  const ordered = isWide ? leastToMost : [...leastToMost].reverse()

  // Keyed by label, not position: the order flips with the window, and a button that has
  // focus has to stay the same button when it moves. A repeated label is numbered.
  const seen: Record<string, number> = {}
  const keys = new Map<(typeof leastToMost)[number], string>()
  for (const button of leastToMost) {
    const label = String(button.label ?? '')
    seen[label] = (seen[label] ?? 0) + 1
    keys.set(button, `${label}#${seen[label]}`)
  }
  const keyOf = (button: (typeof leastToMost)[number]) => keys.get(button)
  const sharesRow = share && isWide && ordered.length > 1

  return (
    <div
      // A group with no name tells a screen reader user nothing, so it is only one when named
      role={accessibilityText ? 'group' : undefined}
      aria-label={accessibilityText}
      className={`mt-4 flex gap-1 ${isWide ? 'flex-row flex-wrap items-start justify-center' : 'flex-col items-stretch'}`}
    >
      {ordered.map((button) => (
        <ButtonWidget
          key={keyOf(button)}
          size={size}
          {...button}
          className={sharesRow ? `flex-1 ${button.className ?? ''}` : button.className}
        />
      ))}
    </div>
  )
}

/**
 * EmptyState
 * Not exported from the library: see the note at the top of this file.
 */
export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  image = NO_DATA_IMAGE,
  size = 'LARGE',
  primaryButtons,
  secondaryButtons,
  accessibilityText,
  showWhen = true,
  showBorder = true,
  marginBelow = 'NONE',
}) => {
  if (!showWhen) return null
  const { width, gap, bottom } = LAYOUT[size]
  const isIllustration = 'imageType' in image && image.imageType === 'illustration'

  return (
    <CardLayout
      padding="NONE"
      shape="SEMI_ROUNDED"
      showBorder={showBorder}
      marginBelow={marginBelow}
      className="w-full overflow-hidden text-center"
    >
      {isIllustration ? (
        /* An illustration sits behind the words. It fills the width it is given, up to its own
           size, and fades out toward the bottom so nothing in it runs through the words. */
        <div
          className="pointer-events-none absolute inset-x-0 top-0 mx-auto"
          style={{ width: `min(100%, ${width}px)`, maskImage: FADE, WebkitMaskImage: FADE }}
        >
          <ImageField images={[image]} size="FIT" align="CENTER" marginBelow="NONE" />
        </div>
      ) : (
        /* Any other image sits above the words, in the flow, held to a height */
        <div className={`px-4 pt-6 ${IMAGE_MAX_HEIGHT[size]} [&_img]:w-auto`}>
          <ImageField images={[image]} size="FIT" align="CENTER" marginBelow="NONE" />
        </div>
      )}

      {/* The words start under the centre of an illustration, wherever it has scaled to, or
          under any other image */}
      <div
        className={`relative px-4 ${bottom}`}
        style={isIllustration ? { paddingTop: `calc(min(100%, ${width}px) * ${CENTRE} + ${gap}px)` } : { paddingTop: 20 }}
      >
        <RichTextDisplayField
          align="CENTER"
          marginBelow="NONE"
          value={[<TextItem key="primary" text={title} style="STRONG" />]}
        />
        {description && (
          <RichTextDisplayField
            align="CENTER"
            marginAbove="EVEN_LESS"
            marginBelow="NONE"
            className="mx-auto max-w-sm"
            value={[<TextItem key="secondary" text={description} color="SECONDARY" />]}
          />
        )}
        <ButtonLayout
          primaryButtons={primaryButtons}
          secondaryButtons={secondaryButtons}
          accessibilityText={accessibilityText}
          size={size === 'SMALL' ? 'SMALL' : 'STANDARD'}
          share={size === 'SMALL'}
        />
      </div>
    </CardLayout>
  )
}

/* -------------------------------------------------------------------------- */
/* In a popover                                                                */
/* -------------------------------------------------------------------------- */

/**
 * EmptyStatePopover
 * The SMALL empty state where it is made for: the contents of a 320px popover that opens
 * from a button and has nothing to list yet. The popover is a plain disclosure (button
 * with `aria-expanded`, Escape and an outside click close it), so the pattern adds no
 * dependency. Start closed; open it from the trigger.
 */
export const EmptyStatePopover: React.FC<{
  primaryButtons?: ButtonWidgetProps[]
  secondaryButtons?: ButtonWidgetProps[]
}> = ({
  primaryButtons = [{ label: 'Save filters', color: 'ACCENT' }],
  secondaryButtons,
}) => {
  const [open, setOpen] = React.useState(false)
  const rootRef = React.useRef<HTMLDivElement>(null)
  const triggerRef = React.useRef<HTMLButtonElement>(null)
  const panelId = React.useId()
  const triggerId = React.useId()

  React.useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      setOpen(false)
      // The panel is about to unmount, so hand focus back to the button that opened it
      triggerRef.current?.focus()
    }
    const onPointerDown = (event: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) setOpen(false)
    }
    // Tabbing out of the panel closes it too, as it would for a menu
    const onFocusIn = (event: FocusEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('focusin', onFocusIn)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('focusin', onFocusIn)
    }
  }, [open])

  return (
    <div ref={rootRef} className="relative inline-block">
      {/* A native button rather than ButtonWidget, which has no way to carry aria-expanded and
          aria-controls. It is drawn to match a SMALL OUTLINE ButtonWidget. */}
      <button
        id={triggerId}
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        onClick={() => setOpen(current => !current)}
        className="inline-flex items-center gap-1.5 rounded-sm border border-blue-500 bg-white px-3 py-2 text-sm leading-none font-medium text-blue-500 cursor-pointer hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-blue-700"
      >
        Saved filters
        <ChevronDown className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`} aria-hidden="true" />
      </button>
      {open && (
        <div
          id={panelId}
          role="region"
          aria-labelledby={triggerId}
          className="absolute left-0 top-full z-10 mt-1 w-80 overflow-hidden rounded-sm border border-gray-200 bg-white shadow-md"
        >
          <EmptyState
            size="SMALL"
            image={NO_DATA_IMAGE}
            title="No saved filters yet"
            description="Choose some filters, then save them to come back to this view whenever you like."
            primaryButtons={primaryButtons}
            secondaryButtons={secondaryButtons}
            showBorder={false}
          />
        </div>
      )}
    </div>
  )
}
