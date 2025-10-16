import * as React from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import type { SAILMarginSize } from '../../types/sail'

/**
 * Width options for dialog sizing
 */
export type DialogWidth = "NARROW" | "MEDIUM" | "MEDIUM_PLUS" | "WIDE" | "FIT"

/**
 * Height options for dialog sizing
 */
export type DialogHeight = "AUTO" | "FIT" | "SHORT" | "MEDIUM" | "TALL" | "EXTRA_TALL"

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
  showCloseButton = true,
  closeOnOutsideClick = true,
  closeOnEscape = true,
  showWhen = true,
  marginAbove = "NONE",
  marginBelow = "STANDARD",
  onClose
}) => {
  // Visibility control
  if (!showWhen) return null

  // Margin mappings
  const marginMap: Record<SAILMarginSize, string> = {
    NONE: '',
    EVEN_LESS: 'mt-1',
    LESS: 'mt-2',
    STANDARD: 'mt-4',
    MORE: 'mt-6',
    EVEN_MORE: 'mt-8'
  }

  const marginBottomMap: Record<SAILMarginSize, string> = {
    NONE: '',
    EVEN_LESS: 'mb-1',
    LESS: 'mb-2',
    STANDARD: 'mb-4',
    MORE: 'mb-6',
    EVEN_MORE: 'mb-8'
  }

  // Width mappings
  const widthMap: Record<DialogWidth, string> = {
    NARROW: 'w-[90vw] max-w-sm',      // ~384px max
    MEDIUM: 'w-[90vw] max-w-md',      // ~448px max
    MEDIUM_PLUS: 'w-[90vw] max-w-lg', // ~512px max
    WIDE: 'w-[90vw] max-w-2xl',       // ~672px max
    FIT: 'w-[95vw]'                   // Full screen width (with small margin)
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

  // Container classes
  const containerClasses = [
    marginMap[marginAbove],
    marginBottomMap[marginBelow]
  ].filter(Boolean).join(' ')

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
      <Dialog.Overlay className="fixed inset-0 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
      <Dialog.Content
        className={[
          'fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2',
          'bg-white rounded-md shadow-lg border border-gray-200',
          'p-6',
          widthMap[width],
          heightMap[height],
          'data-[state=open]:animate-in data-[state=closed]:animate-out',
          'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
          'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
          'data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]',
          'data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]',
          'focus:outline-none'
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
                  <Dialog.Description className="text-sm text-gray-700">
                    {description}
                  </Dialog.Description>
                )}
              </div>
              {showCloseButton && (
                <Dialog.Close asChild>
                  <button
                    className="ml-4 p-1 rounded-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
