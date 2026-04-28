import * as React from 'react'
import type { ReactNode } from 'react'
import { mergeClasses } from '../../utils/classNames'

export interface ChatPanelHeaderAction {
  icon: ReactNode
  label: string
  onClick?: () => void
}

export interface ChatPanelProps {
  /** Title displayed in the header */
  title?: string
  /** Action buttons displayed in the header */
  headerActions?: ChatPanelHeaderAction[]
  /** Content to display in the scrollable area */
  children: ReactNode
  /** Content to display in the footer (typically ChatInput) */
  footer?: ReactNode
  /** Height of the panel (defaults to full viewport height) */
  height?: string
  /** Additional Tailwind classes for prototype-specific styling (not part of SAIL API) */
  className?: string
}

export const ChatPanel: React.FC<ChatPanelProps> = ({
  title,
  headerActions,
  children,
  footer,
  height = '100vh',
  className,
}) => {
  const sailClasses = 'flex flex-col bg-white'

  return (
    <div className={mergeClasses(sailClasses, className)} style={{ height }}>
      {(title || headerActions) && (
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 shrink-0">
          {title && <h2 className="text-lg font-semibold text-gray-900">{title}</h2>}
          {headerActions && headerActions.length > 0 && (
            <div className="flex items-center gap-1" role="group" aria-label="Header actions">
              {headerActions.map((action, index) => (
                <button
                  key={index}
                  onClick={action.onClick}
                  aria-label={action.label}
                  className="p-1.5 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  {action.icon}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <div
        className="flex-1 overflow-y-auto"
        tabIndex={0}
        role="region"
        aria-label="Chat messages"
      >
        <div className="px-4 py-4 text-base">{children}</div>
      </div>

      {footer && (
        <div className="px-4 py-3 border-t border-gray-200 shrink-0">{footer}</div>
      )}
    </div>
  )
}
