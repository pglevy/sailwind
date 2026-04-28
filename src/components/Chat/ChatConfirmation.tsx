import * as React from 'react'
import { useState } from 'react'
import { mergeClasses } from '../../utils/classNames'

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
  const completed = controlledCompleted ?? internalCompleted

  const handleClick = (action: ChatConfirmationAction) => {
    setInternalCompleted(true)
    action.onClick()
  }

  const sailClasses = `bg-blue-50 border-l-4 px-5 py-4${completed ? ' border-blue-200' : ' border-blue-500'}`

  return (
    <div role="alert" className={mergeClasses(sailClasses, className)}>
      <p className={`text-base ${completed ? 'text-gray-700' : 'text-gray-900'}`}>{message}</p>
      <div className="flex gap-2 mt-2">
        <button
          onClick={() => handleClick(primaryAction)}
          disabled={completed}
          className={`px-4 py-2 text-base font-medium rounded-sm transition-colors ${completed ? 'bg-blue-500 text-white opacity-50 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-700'}`}
        >
          {primaryAction.label}
        </button>
        {secondaryAction && (
          <button
            onClick={() => handleClick(secondaryAction)}
            disabled={completed}
            className={`px-4 py-2 text-base font-medium rounded-sm border transition-colors ${completed ? 'border-gray-200 text-gray-700 bg-white opacity-50 cursor-not-allowed' : 'border-gray-200 text-gray-700 bg-white hover:bg-gray-100'}`}
          >
            {secondaryAction.label}
          </button>
        )}
      </div>
    </div>
  )
}
