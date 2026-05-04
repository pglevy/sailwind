import * as React from 'react'
import { useState } from 'react'
import { mergeClasses } from '../../utils/classNames'
import { ButtonWidget } from '../Button/ButtonWidget'

export interface ChatConfirmationAction {
  label: string
  onClick: () => void
}

export interface ChatConfirmationProps {
  /** Confirmation message to display */
  message: string
  /** Primary action button */
  primaryAction: ChatConfirmationAction
  /** Optional secondary action button */
  secondaryAction?: ChatConfirmationAction
  /** Whether the confirmation has been acted on */
  completed?: boolean
  /** Additional Tailwind classes for prototype-specific styling (not part of SAIL API) */
  className?: string
}

export const ChatConfirmation: React.FC<ChatConfirmationProps> = ({
  message,
  primaryAction,
  secondaryAction,
  completed: controlledCompleted,
  className,
}) => {
  const [internalCompleted, setInternalCompleted] = useState(false)
  const isControlled = controlledCompleted !== undefined
  const completed = isControlled ? controlledCompleted : internalCompleted

  const handleClick = (action: ChatConfirmationAction) => {
    if (!isControlled) setInternalCompleted(true)
    action.onClick()
  }

  const sailClasses = `bg-blue-50 border-l-4 px-5 py-4${completed ? ' border-blue-200' : ' border-blue-500'}`

  return (
    <div role="alert" className={mergeClasses(sailClasses, className)}>
      <p className={`text-base ${completed ? 'text-gray-700' : 'text-gray-900'}`}>{message}</p>
      <div className="flex gap-2 mt-2">
        <ButtonWidget
          label={primaryAction.label}
          style="SOLID"
          color="ACCENT"
          disabled={completed}
          onClick={() => handleClick(primaryAction)}
        />
        {secondaryAction && (
          <ButtonWidget
            label={secondaryAction.label}
            style="OUTLINE"
            color="SECONDARY"
            disabled={completed}
            onClick={() => handleClick(secondaryAction)}
          />
        )}
      </div>
    </div>
  )
}
