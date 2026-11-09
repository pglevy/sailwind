import * as React from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import type { SAILMarginSize } from '../../types/sail'
import { mergeClasses } from '../../utils/classNames'
import { marginAboveMap, marginBelowMap } from '../../utils/sailMaps'

/**
 * Width options for dialog sizing.
 *
 * Matches the record action dialog width options in SAIL. The fixed widths are the
 * true SAIL values; `FIT` corresponds to the "Full" option in the record action editor.
 *
 * | Value          | SAIL label   | Width   |
 * | -------------- | ------------ | ------- |
 * | `NARROW`       | Narrow       | 480px   |
 * | `MEDIUM`       | Medium       | 720px   |
 * | `MEDIUM_PLUS`  | Medium plus  | 960px   |
 * | `WIDE`         | Wide         | 1200px  |
 * | `EXTRA_WIDE`   | Extra wide   | 1440px  |
 * | `FIT`          | Full         | 96%     |
 */
export type DialogWidth = "NARROW" | "MEDIUM" | "MEDIUM_PLUS" | "WIDE" | "EXTRA_WIDE" | "FIT"

/**
 * Height options for dialog sizing.
 *
 * The record action dialog in SAIL exposes a Height dropdown whose options are
 * `AUTO`, `SHORT`, `MEDIUM`, and `TALL` (with `AUTO` as the default — the height
 * grows to fit the content). Sailwind keeps those plus two convenience values,
 * `FIT` (content height, capped so a tall form scrolls instead of overflowing)
 * and `EXTRA_TALL` (near-viewport height), that aren't in the SAIL editor but are
 * useful for prototypes.
 */
export type DialogHeight = "AUTO" | "FIT" | "SHORT" | "MEDIUM" | "TALL" | "EXTRA_TALL"

/**
 * Surface treatment for the dialog. Not in SAIL.
 *
 * - `STANDARD` — opaque white card (the default)
 * - `GLASS` — glassmorphism: translucent surface with a blurred backdrop.
 *   Falls back to an opaque surface when the user prefers reduced transparency
 *   or when forced colors (high contrast) mode is active.
 */
export type DialogBackground = "STANDARD" | "GLASS"

/**
 * Displays a modal dialog overlay with customizable content
 * Inspired by SAIL form field patterns (not an official SAIL component)
 *
 * This is a "new SAIL" component - not available in public SAIL but follows
 * the same conventions and patterns for consistency with other Sailwind components.
 */
export interface DialogFieldProps {
  /** Whether the dialog is open */
  open?: boolean
  /** Callback when dialog open state changes */
  onOpenChange?: (open: boolean) => void
  /** Element that triggers the dialog (usually a button) */
  trigger?: React.ReactNode
  /** Dialog title text */
  title?: string
  /** Dialog description text */
  description?: string
  /** Main content of the dialog */
  children: React.ReactNode
  /** Width of the dialog */
  width?: DialogWidth
  /** Height of the dialog */
  height?: DialogHeight
  /** Surface treatment: opaque (STANDARD) or translucent glassmorphism (GLASS). Not in SAIL. */
  background?: DialogBackground
  /** Whether to show the close button */
  showCloseButton?: boolean
  /** Whether clicking outside closes the dialog */
  closeOnOutsideClick?: boolean
  /** Whether pressing escape closes the dialog */
  closeOnEscape?: boolean
  /** Determines whether component is displayed */
  showWhen?: boolean
  /** Space added above component */
  marginAbove?: SAILMarginSize
  /** Space added below component */
  marginBelow?: SAILMarginSize
  /** Callback when dialog is closed */
  onClose?: () => void
  /** Additional Tailwind classes for prototype-specific styling (not part of SAIL API) */
  className?: string
}

export const DialogField: React.FC<DialogFieldProps> = ({
  open,
  onOpenChange,
  trigger,
  title,
  description,
  children,
  width = "MEDIUM",
  height = "AUTO",
  background = "STANDARD",
  showCloseButton = true,
  closeOnOutsideClick = true,
  closeOnEscape = true,
  showWhen = true,
  marginAbove = "NONE",
  marginBelow = "STANDARD",
  onClose,
  className
}) => {
  // Visibility control
  if (!showWhen) return null

  // Width mappings — true SAIL record action dialog widths.
  // Each fixed width is capped at 90vw so the dialog never exceeds the viewport on
  // smaller screens (SAIL dialogs shrink to fit the same way).
  const widthMap: Record<DialogWidth, string> = {
    NARROW: 'w-[90vw] max-w-[480px]',       // 480px  (SAIL "Narrow")
    MEDIUM: 'w-[90vw] max-w-[720px]',       // 720px  (SAIL "Medium")
    MEDIUM_PLUS: 'w-[90vw] max-w-[960px]',  // 960px  (SAIL "Medium plus")
    WIDE: 'w-[90vw] max-w-[1200px]',        // 1200px (SAIL "Wide")
    EXTRA_WIDE: 'w-[90vw] max-w-[1440px]',  // 1440px (SAIL "Extra wide")
    FIT: 'w-[96%]'                          // 96%    (SAIL "Full")
  }

  // Height mappings
  const heightMap: Record<DialogHeight, string> = {
    AUTO: 'h-auto',                   // Content-based height
    FIT: 'h-auto max-h-[85vh]',      // Content-based with max
    SHORT: 'h-[300px]',              // Fixed short height
    MEDIUM: 'h-[500px]',             // Fixed medium height
    TALL: 'h-[700px]',               // Fixed tall height
    EXTRA_TALL: 'h-[85vh]'           // Very tall, viewport-based
  }

  // Surface (glassmorphism) mappings.
  // Both variants degrade to an opaque surface when the user asks for reduced transparency
  // or is in forced-colors mode, so text never sits on a busy blur.
  // Every class is written out in full: Tailwind only generates classes it can find as
  // complete strings in the source, so none of these can be assembled from a template.
  const overlayBackgroundMap: Record<DialogBackground, string> = {
    STANDARD: 'bg-black/50',
    GLASS: [
      'bg-black/40 backdrop-blur-sm',
      '[@media(prefers-reduced-transparency:reduce)]:bg-black/60 [@media(prefers-reduced-transparency:reduce)]:backdrop-blur-none',
      'forced-colors:bg-black/60 forced-colors:backdrop-blur-none'
    ].join(' ')
  }

  const contentBackgroundMap: Record<DialogBackground, string> = {
    STANDARD: 'bg-white border border-gray-200 shadow-lg',
    GLASS: [
      // 70% white keeps body text (gray-900) above 6:1 contrast over any backdrop
      'bg-white/70 backdrop-blur-xl backdrop-saturate-150',
      'border border-white/60 shadow-2xl ring-1 ring-black/5',
      '[@media(prefers-reduced-transparency:reduce)]:bg-white [@media(prefers-reduced-transparency:reduce)]:backdrop-blur-none',
      '[@media(prefers-reduced-transparency:reduce)]:backdrop-saturate-100 [@media(prefers-reduced-transparency:reduce)]:border-gray-200',
      'forced-colors:bg-[Canvas] forced-colors:backdrop-blur-none forced-colors:border-[CanvasText]'
    ].join(' ')
  }

  // Container classes
  const sailClasses = [
    marginAboveMap[marginAbove],
    marginBelowMap[marginBelow]
  ].filter(Boolean).join(' ')

  const containerClasses = mergeClasses(sailClasses, className)

  // Handle close events
  const handleOpenChange = (newOpen: boolean) => {
    if (onOpenChange) {
      onOpenChange(newOpen)
    }
    if (!newOpen && onClose) {
      onClose()
    }
  }

  const dialogContent = (
    <Dialog.Portal>
      <Dialog.Overlay className={`fixed inset-0 ${overlayBackgroundMap[background]} data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0`} />
      <Dialog.Content
        data-background={background.toLowerCase()}
        className={[
          'fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2',
          'rounded-md',
          contentBackgroundMap[background],
          'p-6',
          widthMap[width],
          heightMap[height],
          'data-[state=open]:animate-in data-[state=closed]:animate-out',
          'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
          'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
          'data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]',
          'data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]',
          'focus-visible:outline-none'
        ].filter(Boolean).join(' ')}
        onPointerDownOutside={closeOnOutsideClick ? undefined : (e) => e.preventDefault()}
        onEscapeKeyDown={closeOnEscape ? undefined : (e) => e.preventDefault()}
      >
        {/* Header */}
        {(title || description || showCloseButton) && (
          <div className="mb-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                {title && (
                  <Dialog.Title className="text-lg font-semibold text-gray-900 mb-2">
                    {title}
                  </Dialog.Title>
                )}
                {description && (
                  <Dialog.Description className={`text-sm ${background === "GLASS" ? 'text-gray-900' : 'text-gray-700'}`}>
                    {description}
                  </Dialog.Description>
                )}
              </div>
              {showCloseButton && (
                <Dialog.Close asChild>
                  <button
                    className={[
                      'ml-4 p-1 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
                      background === "GLASS"
                        ? 'text-gray-900 hover:bg-white/70'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                    ].join(' ')}
                    aria-label="Close dialog"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </Dialog.Close>
              )}
            </div>
          </div>
        )}

        {/* Content */}
        <div className={height !== "AUTO" && height !== "FIT" ? "overflow-y-auto" : ""}>
          {children}
        </div>
      </Dialog.Content>
    </Dialog.Portal>
  )

  // If no trigger provided, return controlled dialog
  if (!trigger) {
    return (
      <div className={containerClasses}>
        <Dialog.Root open={open} onOpenChange={handleOpenChange}>
          {dialogContent}
        </Dialog.Root>
      </div>
    )
  }

  // Return dialog with trigger
  return (
    <div className={containerClasses}>
      <Dialog.Root open={open} onOpenChange={handleOpenChange}>
        <Dialog.Trigger asChild>
          {trigger}
        </Dialog.Trigger>
        {dialogContent}
      </Dialog.Root>
    </div>
  )
}
