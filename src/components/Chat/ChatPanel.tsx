import * as React from 'react'
import type { ReactNode } from 'react'
import type { SAILGridHeight } from '../../types/sail'
import { mergeClasses } from '../../utils/classNames'
import { ButtonWidget } from '../Button/ButtonWidget'

export interface ChatPanelHeaderAction {
  icon: string
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
  /** Height of the panel */
  height?: SAILGridHeight
  /** Additional Tailwind classes for prototype-specific styling (not part of SAIL API) */
  className?: string
}

export const ChatPanel: React.FC<ChatPanelProps> = ({
  title,
  headerActions,
  children,
  footer,
  height = 'AUTO',
  className,
}) => {
  const heightMap: Record<SAILGridHeight, string> = {
    SHORT: 'h-40',
    SHORT_PLUS: 'h-52',
    MEDIUM: 'h-64',
    MEDIUM_PLUS: 'h-80',
    TALL: 'h-96',
    TALL_PLUS: 'h-[28rem]',
    EXTRA_TALL: 'h-[36rem]',
    AUTO: 'h-screen',
  }

  const sailClasses = `flex flex-col bg-white ${heightMap[height]}`

  return (
    <div className={mergeClasses(sailClasses, className)}>
      {(title || headerActions) && (
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 shrink-0">
          {title && <h2 className="text-lg font-semibold text-gray-900">{title}</h2>}
          {headerActions && headerActions.length > 0 && (
            <div className="flex items-center gap-1" role="group" aria-label="Header actions">
              {headerActions.map((action, index) => (
                <ButtonWidget
                  key={index}
                  icon={action.icon}
                  style="GHOST"
                  color="SECONDARY"
                  size="SMALL"
                  accessibilityText={action.label}
                  onClick={action.onClick}
                />
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
