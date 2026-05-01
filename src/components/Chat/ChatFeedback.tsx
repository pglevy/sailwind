import * as React from 'react'
import { useState } from 'react'
import { ThumbsUp, ThumbsDown } from 'lucide-react'
import { mergeClasses } from '../../utils/classNames'
import { CheckboxField } from '../Checkbox/CheckboxField'
import { DialogField } from '../Dialog/DialogField'
import { ButtonArrayLayout } from '../Button/ButtonArrayLayout'
import { ParagraphField } from '../ParagraphField/ParagraphField'

export interface FeedbackOption {
  id: string
  label: string
}

export interface FeedbackOptions {
  /** Checkbox options shown when thumbs up is selected */
  positive?: FeedbackOption[]
  /** Checkbox options shown when thumbs down is selected */
  negative?: FeedbackOption[]
}

export interface FeedbackDetails {
  /** The user's positive or negative selection */
  feedback: 'positive' | 'negative'
  /** Optional free-form text feedback */
  comment?: string
  /** Array of selected checkbox option IDs */
  selectedOptions?: string[]
}

type ChatFeedbackStyle = 'DEFAULT' | 'AGENT_EVALUATION'

export interface ChatFeedbackProps {
  /**
   * Color scheme style
   * - "DEFAULT": Blue icon when selected, no background
   * - "AGENT_EVALUATION": Thumbs up uses green, thumbs down uses red with backgrounds
   */
  style?: ChatFeedbackStyle
  /** Whether clicking thumbs up/down should open a dialog for detailed feedback */
  showDetailsDialog?: boolean
  /** Whether to show selectable options in the dialog */
  showFeedbackOptions?: boolean
  /** Selectable options for categorizing feedback */
  feedbackOptions?: FeedbackOptions
  /** Custom dialog configuration */
  dialogConfig?: {
    title?: string
    description?: string
    placeholder?: string
    submitText?: string
    cancelText?: string
  }
  /** Callback when feedback is submitted */
  onFeedbackSubmit?: (details: FeedbackDetails) => void
  /** Additional Tailwind classes for prototype-specific styling (not part of SAIL API) */
  className?: string
}

export const ChatFeedback: React.FC<ChatFeedbackProps> = ({
  style = 'DEFAULT',
  showDetailsDialog = true,
  showFeedbackOptions = true,
  feedbackOptions,
  dialogConfig,
  onFeedbackSubmit,
  className,
}) => {
  const [feedback, setFeedback] = useState<'positive' | 'negative' | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [feedbackComment, setFeedbackComment] = useState('')
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false)

  const handleFeedbackClick = (type: 'positive' | 'negative') => {
    if (showDetailsDialog) {
      setFeedback(type)
      setIsDialogOpen(true)
    } else {
      const newFeedback = feedback === type ? null : type
      setFeedback(newFeedback)
      if (newFeedback && onFeedbackSubmit) {
        onFeedbackSubmit({ feedback: newFeedback })
      }
    }
  }

  const handleSubmitDetails = () => {
    if (!feedback) return
    const isOtherSelected = selectedOptions.includes('other')
    if (isOtherSelected && !feedbackComment.trim()) {
      setHasAttemptedSubmit(true)
      return
    }
    onFeedbackSubmit?.({
      feedback,
      comment: feedbackComment || undefined,
      selectedOptions: selectedOptions.length > 0 ? selectedOptions : undefined,
    })
    setIsDialogOpen(false)
    setFeedbackComment('')
    setSelectedOptions([])
    setHasAttemptedSubmit(false)
  }

  const handleCancel = () => {
    setIsDialogOpen(false)
    setFeedbackComment('')
    setSelectedOptions([])
    setHasAttemptedSubmit(false)
    setFeedback(null)
  }

  const dialogTitle = dialogConfig?.title || 'Feedback'
  const defaultDescription = feedback === 'positive'
    ? 'What was good about this response?'
    : 'What was the issue with this response?'
  const dialogDescription = dialogConfig?.description || defaultDescription
  const placeholder = dialogConfig?.placeholder || 'Enter your feedback...'
  const submitText = dialogConfig?.submitText || 'Submit'
  const cancelText = dialogConfig?.cancelText || 'Cancel'

  const currentCheckboxOptions = feedback === 'positive'
    ? feedbackOptions?.positive
    : feedbackOptions?.negative

  const isOtherSelected = selectedOptions.includes('other')
  const isCommentRequired = isOtherSelected
  const showValidationError = hasAttemptedSubmit && isCommentRequired && !feedbackComment.trim()

  const getButtonClasses = (type: 'positive' | 'negative', isSelected: boolean) => {
    const base = 'p-1.5 rounded-md transition-colors'
    if (!isSelected) return `${base} text-gray-500 hover:text-gray-700 hover:bg-gray-100`
    if (style === 'DEFAULT') return `${base} text-blue-500`
    if (type === 'positive') return `${base} bg-green-50 text-green-700`
    return `${base} bg-red-50 text-red-700`
  }

  const sailClasses = 'flex items-center gap-1 bg-white'

  return (
    <>
      <div className={mergeClasses(sailClasses, className)}>
        <div className="flex gap-1">
          <button
            onClick={() => handleFeedbackClick('positive')}
            aria-label="Helpful"
            className={getButtonClasses('positive', feedback === 'positive')}
          >
            <ThumbsUp size={16} />
          </button>
          <button
            onClick={() => handleFeedbackClick('negative')}
            aria-label="Not helpful"
            className={getButtonClasses('negative', feedback === 'negative')}
          >
            <ThumbsDown size={16} />
          </button>
        </div>
      </div>

      <DialogField
        open={isDialogOpen}
        onOpenChange={(open) => { if (!open) handleCancel() }}
        title={dialogTitle}
        description={dialogDescription}
        width="MEDIUM"
        marginBelow="NONE"
        marginAbove="NONE"
      >
        <div className="space-y-4">
          {showFeedbackOptions && currentCheckboxOptions && currentCheckboxOptions.length > 0 && (
            <CheckboxField
              choiceLabels={currentCheckboxOptions.map(o => o.label)}
              choiceValues={currentCheckboxOptions.map(o => o.id)}
              value={selectedOptions}
              onChange={setSelectedOptions}
              labelPosition="COLLAPSED"
              marginBelow="NONE"
              marginAbove="NONE"
            />
          )}

          <ParagraphField
            label={showFeedbackOptions ? 'Additional comments' : undefined}
            labelPosition={showFeedbackOptions ? 'ABOVE' : 'COLLAPSED'}
            required={isCommentRequired}
            validations={showValidationError ? ['Please provide additional details when selecting "Other"'] : []}
            value={feedbackComment}
            saveInto={setFeedbackComment}
            placeholder={placeholder}
            height="SHORT"
            marginBelow="NONE"
            marginAbove="NONE"
          />

          <ButtonArrayLayout
            align="END"
            buttons={[
              { label: cancelText, style: "OUTLINE", color: "SECONDARY", onClick: handleCancel },
              { label: submitText, style: "SOLID", color: "ACCENT", onClick: handleSubmitDetails },
            ]}
            marginBelow="NONE"
          />
        </div>
      </DialogField>
    </>
  )
}
