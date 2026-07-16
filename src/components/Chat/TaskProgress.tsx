import * as React from 'react'
import { useState } from 'react'
import { ChevronDown, Check, Circle } from 'lucide-react'
import { mergeClasses } from '../../utils/classNames'
import { ProgressBar } from '../ProgressBar/ProgressBar'

type TaskStatus = "COMPLETED" | "ACTIVE" | "TODO"

export interface Task {
  /** Unique identifier for the task */
  id: string
  /** Task description */
  label: string
  /** Task status */
  status: TaskStatus
}

export interface TaskProgressProps {
  /** Section title displayed in the collapsible header */
  title?: string
  /** Array of tasks to display */
  tasks: Task[]
  /** Whether the task list starts expanded */
  defaultOpen?: boolean
  /** Additional Tailwind classes for prototype-specific styling (not part of SAIL API) */
  className?: string
}

/**
 * TaskProgress Component
 * Displays a collapsible list of tasks with a progress bar summarizing completion.
 * Used in chat interfaces to visualize multi-step task execution state.
 */
export const TaskProgress: React.FC<TaskProgressProps> = ({
  title = "Task Progress",
  tasks,
  defaultOpen = true,
  className,
}) => {
  const [open, setOpen] = useState(defaultOpen)

  const completedCount = tasks.filter((t) => t.status === "COMPLETED").length
  const totalCount = tasks.length
  const progressValue = totalCount > 0 ? (completedCount / totalCount) * 100 : 0

  const sailClasses = 'border border-gray-200 rounded-md overflow-hidden bg-white'

  return (
    <div className={mergeClasses(sailClasses, className)}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
      >
        <ChevronDown
          className={`size-4 text-gray-500 shrink-0 transition-transform ${open ? 'rotate-0' : '-rotate-90'}`}
          aria-hidden="true"
        />
        <div className="flex items-center justify-between gap-4 flex-1 min-w-0">
          <span className="font-semibold text-sm text-gray-900 shrink-0">{title}</span>
          <div className="flex items-center gap-3 flex-1 min-w-0 max-w-[33%]">
            <span className="text-sm text-gray-700 shrink-0" aria-hidden="true">
              <span className="font-medium">{completedCount}</span> / {totalCount}
            </span>
            <div className="flex-1 min-w-0">
              <ProgressBar
                percentage={progressValue}
                showPercentage={false}
                labelPosition="COLLAPSED"
                accessibilityText={`Task progress: ${completedCount} of ${totalCount} completed`}
                marginAbove="NONE"
                marginBelow="NONE"
              />
            </div>
          </div>
        </div>
      </button>

      {open && (
        <div className="border-t border-gray-200">
          <ul role="list" aria-label={`${title} tasks`} className="py-1">
            {tasks.map((task) => (
              <TaskItem key={task.id} task={task} />
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

interface TaskItemProps {
  task: Task
}

const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
  const statusIcon = () => {
    if (task.status === "COMPLETED") {
      return <Check className="size-4 text-gray-600" aria-hidden="true" />
    }
    return (
      <Circle
        className={`size-4 ${task.status === "ACTIVE" ? 'text-gray-900' : 'text-gray-400'}`}
        aria-hidden="true"
      />
    )
  }

  const labelClasses = (() => {
    switch (task.status) {
      case "COMPLETED":
        return 'text-sm line-through text-gray-600'
      case "ACTIVE":
        return 'text-sm font-medium text-gray-900'
      case "TODO":
        return 'text-sm text-gray-600'
    }
  })()

  return (
    <li role="listitem" className="flex items-center gap-3 px-4 py-1.5">
      <span className="shrink-0 flex items-center justify-center size-4">
        {statusIcon()}
        <span className="sr-only">{statusLabel(task.status)}</span>
      </span>
      <span className={labelClasses}>{task.label}</span>
    </li>
  )
}

/**
 * Returns a human-readable status label for screen readers.
 */
function statusLabel(status: TaskStatus): string {
  const labels: Record<TaskStatus, string> = {
    COMPLETED: 'Completed',
    ACTIVE: 'In progress',
    TODO: 'To do',
  }
  return labels[status]
}
