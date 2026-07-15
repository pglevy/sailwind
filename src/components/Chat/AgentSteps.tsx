import * as React from 'react'
import { CheckCircle, Circle, XCircle, FileText, Database, Plus, LoaderCircle, GitBranch, RotateCcw } from 'lucide-react'
import { mergeClasses } from '../../utils/classNames'
import { ButtonWidget } from '../Button/ButtonWidget'

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
  /** Lucide icon key to display (overrides default status icon) */
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

const sizeConfig: Record<AgentStepsSize, { text: string; subtitle: string; iconSize: string; iconMt: string; lineTop: string }> = {
  SMALL: { text: 'text-xs leading-4', subtitle: 'text-xs', iconSize: 'size-3.5', iconMt: 'mt-0.5', lineTop: 'top-4' },
  STANDARD: { text: 'text-sm leading-5', subtitle: 'text-xs', iconSize: 'size-4', iconMt: 'mt-0.5', lineTop: 'top-5' },
  LARGE: { text: 'text-lg leading-7', subtitle: 'text-sm', iconSize: 'size-5', iconMt: 'mt-1', lineTop: 'top-7' },
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
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between gap-2">
          <span className={`font-medium text-gray-900 ${config.text}`}>
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
          <p className={`mt-0.5 text-gray-700 ${config.subtitle} leading-relaxed`}>
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
