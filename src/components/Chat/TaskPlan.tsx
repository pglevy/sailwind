import * as React from 'react'
import { useState } from 'react'
import { ChevronDown, FileText, Workflow, Database, HardDrive, Layout, Ruler, Calculator, Variable, Users, Globe } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { mergeClasses } from '../../utils/classNames'
import { TextField } from '../TextField/TextField'
import { ParagraphField } from '../ParagraphField/ParagraphField'
import { DropdownField } from '../Dropdown/DropdownField'

/**
 * Object types supported by the icon set.
 */
export type ObjectTypeKey =
  | "document"
  | "processModel"
  | "recordType"
  | "dataStore"
  | "interface"
  | "rule"
  | "expression"
  | "constant"
  | "group"
  | "site"

interface IconConfig {
  icon: LucideIcon
  bg: string
  fg: string
}

const OBJECT_TYPE_ICONS: Record<ObjectTypeKey, IconConfig> = {
  document:     { icon: FileText,   bg: 'bg-green-50',  fg: 'text-green-700' },
  processModel: { icon: Workflow,   bg: 'bg-purple-50', fg: 'text-purple-700' },
  recordType:   { icon: Database,   bg: 'bg-orange-50', fg: 'text-orange-700' },
  dataStore:    { icon: HardDrive,  bg: 'bg-sky-50',    fg: 'text-sky-700' },
  interface:    { icon: Layout,     bg: 'bg-teal-50',   fg: 'text-teal-700' },
  rule:         { icon: Ruler,      bg: 'bg-blue-50',   fg: 'text-blue-700' },
  expression:   { icon: Calculator, bg: 'bg-pink-50',   fg: 'text-pink-700' },
  constant:     { icon: Variable,   bg: 'bg-gray-100',  fg: 'text-gray-700' },
  group:        { icon: Users,      bg: 'bg-blue-50',   fg: 'text-blue-700' },
  site:         { icon: Globe,      bg: 'bg-purple-50', fg: 'text-purple-700' },
}

const OBJECT_TYPE_OPTIONS: { value: ObjectTypeKey; label: string }[] = [
  { value: "recordType", label: "Record Type" },
  { value: "processModel", label: "Process Model" },
  { value: "interface", label: "Interface" },
  { value: "rule", label: "Rule" },
  { value: "expression", label: "Expression" },
  { value: "constant", label: "Constant" },
  { value: "document", label: "Document" },
  { value: "dataStore", label: "Data Store" },
  { value: "group", label: "Group" },
  { value: "site", label: "Site" },
]

function getObjectTypeLabel(objectType: ObjectTypeKey): string {
  return OBJECT_TYPE_OPTIONS.find((o) => o.value === objectType)?.label ?? objectType
}

export interface TaskPlanItem {
  /** Unique identifier */
  id: string
  /** Task name / title */
  taskName: string
  /** Object type for icon display */
  objectType: ObjectTypeKey
  /** Name of the object being created/modified */
  objectName: string
  /** Implementation notes */
  notes: string
}

export interface TaskPlanProps {
  /** The list of task plan items */
  tasks: TaskPlanItem[]
  /** Whether the plan is in edit mode */
  editing?: boolean
  /** Callback when tasks are updated in edit mode */
  onTasksChange?: (tasks: TaskPlanItem[]) => void
  /** Additional Tailwind classes for prototype-specific styling (not part of SAIL API) */
  className?: string
}

/**
 * TaskPlan Component
 * Displays a collapsible list of planned tasks with object type icons and details.
 * Supports read-only and editable modes for plan review workflows.
 */
export const TaskPlan: React.FC<TaskPlanProps> = ({
  tasks,
  editing = false,
  onTasksChange,
  className,
}) => {
  const [openItems, setOpenItems] = useState<Set<string>>(
    new Set(tasks.map((t) => t.id))
  )

  const toggleItem = (id: string) => {
    setOpenItems((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const updateTask = (id: string, updates: Partial<TaskPlanItem>) => {
    if (!onTasksChange) return
    onTasksChange(
      tasks.map((t) => (t.id === id ? { ...t, ...updates } : t))
    )
  }

  const sailClasses = 'flex flex-col gap-2'

  return (
    <div className={mergeClasses(sailClasses, className)} role="list" aria-label="Task plan">
      {tasks.map((task, index) => {
        const isOpen = openItems.has(task.id)
        const iconConfig = OBJECT_TYPE_ICONS[task.objectType]
        const Icon = iconConfig.icon

        return (
          <div
            key={task.id}
            role="listitem"
            className="border border-gray-200 rounded-md overflow-hidden bg-white"
          >
            <button
              type="button"
              onClick={() => toggleItem(task.id)}
              aria-expanded={isOpen}
              aria-label={`${isOpen ? 'Collapse' : 'Expand'} task ${index + 1}: ${task.taskName}`}
              className="w-full flex items-center gap-3 px-3 py-3 hover:bg-gray-50 transition-colors"
            >
              <ChevronDown
                className={`size-4 text-gray-500 shrink-0 transition-transform ${isOpen ? 'rotate-0' : '-rotate-90'}`}
                aria-hidden="true"
              />
              <span
                className={`size-7 rounded-sm flex items-center justify-center shrink-0 ${iconConfig.bg}`}
                aria-hidden="true"
              >
                <Icon className={`size-3.5 ${iconConfig.fg}`} />
              </span>
              <span className="text-sm font-medium text-gray-900 text-left">
                {index + 1}. {task.taskName}
              </span>
            </button>

            {isOpen && (
              <div className="border-t border-gray-200 px-4 pb-4 pt-3">
                {editing ? (
                  <EditableTaskContent
                    task={task}
                    onUpdate={(updates) => updateTask(task.id, updates)}
                  />
                ) : (
                  <ReadOnlyTaskContent task={task} />
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

interface ReadOnlyTaskContentProps {
  task: TaskPlanItem
}

const ReadOnlyTaskContent: React.FC<ReadOnlyTaskContentProps> = ({ task }) => {
  return (
    <div className="flex flex-col gap-3 text-sm">
      <div className="flex flex-col gap-1">
        <span className="text-gray-600 text-xs font-medium uppercase tracking-wide">
          Object Type
        </span>
        <span className="text-gray-900">{getObjectTypeLabel(task.objectType)}</span>
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-gray-600 text-xs font-medium uppercase tracking-wide">
          Object Name
        </span>
        <span className="text-gray-900 font-mono text-xs">{task.objectName}</span>
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-gray-600 text-xs font-medium uppercase tracking-wide">
          Implementation Notes
        </span>
        <p className="text-gray-900 leading-relaxed whitespace-pre-wrap">
          {task.notes}
        </p>
      </div>
    </div>
  )
}

interface EditableTaskContentProps {
  task: TaskPlanItem
  onUpdate: (updates: Partial<TaskPlanItem>) => void
}

const EditableTaskContent: React.FC<EditableTaskContentProps> = ({ task, onUpdate }) => {
  return (
    <div className="flex flex-col gap-1">
      <TextField
        label="Task Name"
        value={task.taskName}
        saveInto={(val) => onUpdate({ taskName: val })}
        marginBelow="LESS"
      />
      <DropdownField
        label="Object Type"
        choiceLabels={OBJECT_TYPE_OPTIONS.map((o) => o.label)}
        choiceValues={OBJECT_TYPE_OPTIONS.map((o) => o.value)}
        value={task.objectType}
        saveInto={(val) => onUpdate({ objectType: val as ObjectTypeKey })}
        marginBelow="LESS"
      />
      <TextField
        label="Object Name"
        value={task.objectName}
        saveInto={(val) => onUpdate({ objectName: val })}
        marginBelow="LESS"
      />
      <ParagraphField
        label="Implementation Notes"
        value={task.notes}
        saveInto={(val) => onUpdate({ notes: val })}
        height="SHORT"
        marginBelow="NONE"
      />
    </div>
  )
}
