import * as React from 'react'
import type { ButtonWidgetProps } from './ButtonWidget'
import { ButtonWidget } from './ButtonWidget'
import type { SAILAlign, SAILMarginSize } from '../../types/sail'
import { mergeClasses } from '../../utils/classNames'

/**
 * Props for the ButtonArrayLayout component
 * Maps to SAIL's a!buttonArrayLayout() function
 */
export interface ButtonArrayLayoutProps {
  /** Array of button configurations */
  buttons: ButtonWidgetProps[]
  /** Controls layout visibility */
  showWhen?: boolean
  /** Determines alignment of buttons */
  align?: SAILAlign
  /** Space added below the buttons */
  marginBelow?: SAILMarginSize
  /** Additional text for screen readers */
  accessibilityText?: string
  /** Additional Tailwind classes for prototype-specific styling (not part of SAIL API) */
  className?: string
}

/**
 * ButtonArrayLayout Component
 * Displays a list of buttons in the order they are specified
 *
 * In SAIL, a!buttonWidget must be used within a!buttonArrayLayout.
 * This component wraps buttons and provides layout/alignment.
 *
 */
export const ButtonArrayLayout: React.FC<ButtonArrayLayoutProps> = ({
  buttons,
  showWhen = true,
  align = "START",
  marginBelow = "STANDARD",
  accessibilityText,
  className
}) => {
  // Visibility control
  if (!showWhen) return null

  // Filter out hidden buttons
  const visibleButtons = buttons.filter(btn => btn.showWhen !== false)

  // Alignment mappings
  const alignMap: Record<SAILAlign, string> = {
    START: 'justify-start',
    CENTER: 'justify-center',
    END: 'justify-end'
  }

  // Margin mappings - using Tailwind standard classes that map to SAIL values
  const marginBelowMap: Record<SAILMarginSize, string> = {
    NONE: '',           // SAIL NONE: no class needed
    EVEN_LESS: 'mb-1', // SAIL EVEN_LESS: 4px
    LESS: 'mb-2',      // SAIL LESS: 8px
    STANDARD: 'mb-4',  // SAIL STANDARD: 16px
    MORE: 'mb-6',      // SAIL MORE: 24px
    EVEN_MORE: 'mb-8'  // SAIL EVEN_MORE: 32px
  }

  // SAIL behavior: single button renders right-justified, multiple buttons left-justified
  const defaultAlign = visibleButtons.length === 1 ? 'END' : 'START'
  const effectiveAlign = align || defaultAlign

  const sailClasses = [
    'flex flex-wrap gap-1 items-start',
    alignMap[effectiveAlign],
    marginBelowMap[marginBelow]
  ].filter(Boolean).join(' ')

  const finalClasses = mergeClasses(sailClasses, className)

  return (
    <div
      className={finalClasses}
      role="group"
      aria-label={accessibilityText}
    >
      {visibleButtons.map((buttonProps, index) => (
        <ButtonWidget key={index} {...buttonProps} />
      ))}
    </div>
  )
}
