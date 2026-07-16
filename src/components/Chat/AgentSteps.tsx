import * as React from 'react'
import { CheckCircle, Circle, XCircle, FileText, Database, Plus, LoaderCircle, GitBranch, RotateCcw } from 'lucide-react'
import { mergeClasses } from '../../utils/classNames'
import { ButtonWidget } from '../Button/ButtonWidget'
import { TextItem } from '../RichText/TextItem'

const iconMap = {
  circle: Circle,
  xCircle: XCircle,
  file: FileText,
  database: Database,
  plus: Plus,
  loaderCircle: LoaderCircle,
  gitBranch: GitBranch,
  rotateCcw: RotateCcw,
} as const

type AgentStepStatus = "COMPLETED" | "ACTIVE" | "PENDING" | "ERROR"

type AgentStepActionStyle = "SOLID" | "OUTLINE" | "GHOST" | "LINK"

type AgentStepsSize = "SMALL" | "STANDARD" | "LARGE"

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
  /** Lucide icon key to display (used when status is PENDING; other statuses use fixed status icons) */
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
  /** Size of step text: SMALL (12px), STANDARD (14px), LARGE (18px) */
  size?: AgentStepsSize
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
  const sailClasses = 'relative'
  const finalClasses = mergeClasses(sailClasses, className)

  return (
    <div className={finalClasses} role="list" aria-label="Agent steps">
      {steps.map((step, index) => (
        <AgentStepItem
          key={step.id}
          step={step}
          isLast={index === steps.length - 1}
          size={size}
        />
      ))}
    </div>
  )
}

interface AgentStepItemProps {
  step: AgentStep
  isLast: boolean
  size: AgentStepsSize
}

const sizeConfig: Record<AgentStepsSize, { titleSize: 'SMALL' | 'STANDARD' | 'MEDIUM'; subtitleSize: 'SMALL' | 'STANDARD'; iconSize: string; iconMt: string; lineTop: string }> = {
  SMALL: { titleSize: 'SMALL', subtitleSize: 'SMALL', iconSize: 'size-3.5', iconMt: 'mt-0.5', lineTop: 'top-4' },
  STANDARD: { titleSize: 'STANDARD', subtitleSize: 'SMALL', iconSize: 'size-4', iconMt: 'mt-0.5', lineTop: 'top-5' },
  LARGE: { titleSize: 'MEDIUM', subtitleSize: 'STANDARD', iconSize: 'size-5', iconMt: 'mt-1', lineTop: 'top-7' },
}

const AgentStepItem: React.FC<AgentStepItemProps> = ({ step, isLast, size }) => {
  const config = sizeConfig[size]

  const renderIcon = () => {
    if (step.status === "COMPLETED") {
      return <CheckCircle className={`${config.iconSize} text-blue-500`} aria-hidden="true" />
    }

    if (step.status === "ERROR") {
      return <XCircle className={`${config.iconSize} text-red-700`} aria-hidden="true" />
    }

    if (step.status === "ACTIVE") {
      return <LoaderCircle className={`${config.iconSize} text-blue-500 animate-spin`} aria-hidden="true" />
    }

    // PENDING — use custom icon if provided, otherwise default circle
    if (step.icon) {
      const IconComponent = iconMap[step.icon]
      return <IconComponent className={`${config.iconSize} text-gray-500`} aria-hidden="true" />
    }

    return <Circle className={`${config.iconSize} text-gray-500`} aria-hidden="true" />
  }

  return (
    <div className="relative flex items-start gap-3 pb-6" role="listitem">
      {/* Connector line */}
      {!isLast && (
        <div
          className={`absolute left-[7px] ${config.lineTop} bottom-0 w-0.5 bg-gray-200`}
          aria-hidden="true"
        />
      )}

      {/* Icon */}
      <div className={`relative z-10 flex items-center justify-center ${config.iconSize} ${config.iconMt} shrink-0 bg-white`}>
        {renderIcon()}
        <span className="sr-only">{statusLabel(step.status)}</span>
      </div>

      {/* Content — negative margin for optical alignment with icon */}
      <div className="relative flex-1 min-w-0 -mt-[0.1rem]">
        <div className="leading-none">
          <TextItem text={step.title} style="PLAIN" size={config.titleSize} color="STANDARD" />
        </div>

        {step.subtitle && (
          <div className="leading-normal">
            <TextItem text={step.subtitle} size={config.subtitleSize} color="SECONDARY" />
          </div>
        )}

        {step.actions && step.actions.length > 0 && (
          <div className="absolute top-0 right-0 flex items-center gap-1">
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
    xCircle: 'x-circle',
    file: 'file-text',
    database: 'database',
    plus: 'plus',
    loaderCircle: 'loader-circle',
    gitBranch: 'git-branch',
    rotateCcw: 'rotate-ccw',
  }
  return nameMap[key]
}

/**
 * Returns a human-readable status label for screen readers.
 */
function statusLabel(status: AgentStepStatus): string {
  const labels: Record<AgentStepStatus, string> = {
    COMPLETED: 'Completed',
    ACTIVE: 'In progress',
    PENDING: 'Pending',
    ERROR: 'Error',
  }
  return labels[status]
}
