import * as React from 'react'
import { CheckCircle, Circle, FileText, Database, Plus, LoaderCircle, GitBranch, RotateCcw } from 'lucide-react'
import { mergeClasses } from '../../utils/classNames'
import { ButtonWidget } from '../Button/ButtonWidget'
import type { SAILSize } from '../../types/sail'

const iconMap = {
  circle: Circle,
  file: FileText,
  database: Database,
  plus: Plus,
  loaderCircle: LoaderCircle,
  gitBranch: GitBranch,
  rotateCcw: RotateCcw,
} as const

type AgentStepStatus = "COMPLETED" | "ACTIVE" | "PENDING"

type AgentStepActionStyle = "SOLID" | "OUTLINE" | "GHOST" | "LINK"

export interface AgentStepAction {
  /** Button label */
  label: string
  /** Lucide icon key */
  icon?: keyof typeof iconMap
  /** Button style */
  style?: AgentStepActionStyle
  /** Click handler */
  onClick?: () => void
}

export interface AgentStep {
  /** Unique identifier for the step */
  id: string
  /** Lucide icon key to display */
  icon?: keyof typeof iconMap
  /** Step title text */
  title: string
  /** Optional subtitle/description */
  subtitle?: string
  /** Optional code preview block */
  preview?: {
    type: "code"
    content: string
  }
  /** Optional action buttons */
  actions?: AgentStepAction[]
  /** Step status */
  status: AgentStepStatus
}

export interface AgentStepsProps {
  /** Array of steps to display */
  steps: AgentStep[]
  /** Size of step text */
  size?: SAILSize
  /** Additional Tailwind classes for prototype-specific styling (not part of SAIL API) */
  className?: string
}

/**
 * AgentSteps Component
 * Displays a vertical timeline of agent execution steps with status indicators.
 * Used within chat interfaces to show AI agent progress.
 */
export const AgentSteps: React.FC<AgentStepsProps> = ({
  steps,
  size = "STANDARD",
  className,
}) => {
  const textSizeMap: Record<SAILSize, string> = {
    SMALL: 'text-xs',
    STANDARD: 'text-sm',
    MEDIUM: 'text-base',
    LARGE: 'text-lg',
  }

  const sailClasses = 'relative'
  const finalClasses = mergeClasses(sailClasses, className)

  return (
    <div className={finalClasses} role="list" aria-label="Agent steps">
      {steps.map((step, index) => (
        <AgentStepItem
          key={step.id}
          step={step}
          isLast={index === steps.length - 1}
          textSize={textSizeMap[size]}
        />
      ))}
    </div>
  )
}

interface AgentStepItemProps {
  step: AgentStep
  isLast: boolean
  textSize: string
}

const AgentStepItem: React.FC<AgentStepItemProps> = ({ step, isLast, textSize }) => {
  const statusColorMap: Record<AgentStepStatus, string> = {
    COMPLETED: 'text-blue-500',
    ACTIVE: 'text-gray-500',
    PENDING: 'text-gray-500',
  }

  const renderIcon = () => {
    if (step.status === "COMPLETED") {
      return <CheckCircle className="size-4 text-blue-500" aria-hidden="true" />
    }

    if (step.icon) {
      const IconComponent = iconMap[step.icon]
      return <IconComponent className={`size-4 ${statusColorMap[step.status]}`} aria-hidden="true" />
    }

    return <Circle className="size-4 text-gray-500" aria-hidden="true" />
  }

  return (
    <div className="relative flex items-start gap-3 pb-6" role="listitem">
      {/* Connector line */}
      {!isLast && (
        <div
          className="absolute left-[7px] top-5 bottom-0 w-0.5 bg-gray-200"
          aria-hidden="true"
        />
      )}

      {/* Icon */}
      <div className="relative z-10 flex items-center justify-center size-4 mt-0.5 shrink-0 bg-white">
        {renderIcon()}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <span className={`font-medium text-gray-900 ${textSize}`}>
            {step.title}
          </span>

          {step.actions && step.actions.length > 0 && (
            <div className="flex items-center gap-1 shrink-0">
              {step.actions.map((action, idx) => (
                <ButtonWidget
                  key={idx}
                  label={action.label}
                  icon={action.icon ? mapIconToLucideName(action.icon) : undefined}
                  style={action.style || "GHOST"}
                  color="SECONDARY"
                  size="SMALL"
                  onClick={action.onClick}
                />
              ))}
            </div>
          )}
        </div>

        {step.subtitle && (
          <p className="mt-0.5 text-xs text-gray-500 leading-relaxed">
            {step.subtitle}
          </p>
        )}

        {step.preview && step.preview.type === "code" && (
          <AgentStepPreview content={step.preview.content} />
        )}
      </div>
    </div>
  )
}

interface AgentStepPreviewProps {
  content: string
}

const AgentStepPreview: React.FC<AgentStepPreviewProps> = ({ content }) => {
  return (
    <div className="mt-2 rounded-sm border border-gray-200 bg-gray-50 p-3 font-mono text-xs leading-relaxed">
      <pre className="overflow-x-auto whitespace-pre-wrap break-all text-gray-700">
        {content}
      </pre>
    </div>
  )
}

/**
 * Maps internal icon keys to Lucide kebab-case names for ButtonWidget
 */
function mapIconToLucideName(key: keyof typeof iconMap): string {
  const nameMap: Record<keyof typeof iconMap, string> = {
    circle: 'circle',
    file: 'file-text',
    database: 'database',
    plus: 'plus',
    loaderCircle: 'loader-circle',
    gitBranch: 'git-branch',
    rotateCcw: 'rotate-ccw',
  }
  return nameMap[key]
}
