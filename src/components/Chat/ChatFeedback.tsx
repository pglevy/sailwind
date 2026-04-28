import * as React from 'react'
import { useState } from 'react'
import { ThumbsUp, ThumbsDown } from 'lucide-react'
import { mergeClasses } from '../../utils/classNames'
import { CheckboxField } from '../Checkbox/CheckboxField'
import { DialogField } from '../Dialog/DialogField'
import { ButtonWidget } from '../Button/ButtonWidget'

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
  /** The user's thumbs up or down selection */
  feedback: 'up' | 'down'
  /** Optional free-form text feedback */
  comment?: string
  /** Array of selected checkbox option IDs */
  selectedOptions?: string[]
}

type ChatFeedbackVariant = 'DEFAULT' | 'AGENT_EVALUATION'

export interface ChatFeedbackProps {
  /**
   * Color scheme variant
   * - "DEFAULT": Blue icon when selected, no background
   * - "AGENT_EVALUATION": Thumbs up uses green, thumbs down uses red with backgrounds
   */
  variant?: ChatFeedbackVariant
  /** Whether clicking thumbs up/down should open a dialog for detailed feedback */
  showDetailsDialog?: boolean
  /** Whether to show checkbox options in the dialog */
  showCheckboxOptions?: boolean
  /** Predefined checkbox options for categorizing feedback */
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
  variant = 'DEFAULT',
  showDetailsDialog = true,
  showCheckboxOptions = true,
  feedbackOptions,
  dialogConfig,
  onFeedbackSubmit,
  className,
}) => {
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [feedbackComment, setFeedbackComment] = useState('')
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false)

  const handleFeedbackClick = (type: 'up' | 'down') => {
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
  const defaultDescription = feedback === 'up'
    ? 'What was good about this response?'
    : 'What was the issue with this response?'
  const dialogDescription = dialogConfig?.description || defaultDescription
  const placeholder = dialogConfig?.placeholder || 'Enter your feedback...'
  const submitText = dialogConfig?.submitText || 'Submit'
  const cancelText = dialogConfig?.cancelText || 'Cancel'

  const currentCheckboxOptions = feedback === 'up'
    ? feedbackOptions?.positive
    : feedbackOptions?.negative

  const isOtherSelected = selectedOptions.includes('other')
  const isCommentRequired = isOtherSelected
  const showValidationError = hasAttemptedSubmit && isCommentRequired && !feedbackComment.trim()

  const getButtonClasses = (type: 'up' | 'down', isSelected: boolean) => {
    const base = 'p-1.5 rounded-md transition-colors'
    if (!isSelected) return `${base} text-gray-500 hover:text-gray-700 hover:bg-gray-100`
    if (variant === 'DEFAULT') return `${base} text-blue-500`
    if (type === 'up') return `${base} bg-green-50 text-green-700`
    return `${base} bg-red-50 text-red-700`
  }

  const sailClasses = 'flex items-center gap-1 bg-white'

  return (
    <>
      <div className={mergeClasses(sailClasses, className)}>
        <div className="flex gap-1">
          <button
            onClick={() => handleFeedbackClick('up')}
            aria-label="Helpful"
            className={getButtonClasses('up', feedback === 'up')}
          >
            <ThumbsUp size={16} />
          </button>
          <button
            onClick={() => handleFeedbackClick('down')}
            aria-label="Not helpful"
            className={getButtonClasses('down', feedback === 'down')}
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
          {showCheckboxOptions && currentCheckboxOptions && currentCheckboxOptions.length > 0 && (
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

          <div className="space-y-2">
            {showCheckboxOptions && (
              <label htmlFor="feedback-comment" className="text-sm font-medium text-gray-900">
                Additional comments{isCommentRequired && <span className="text-red-700 ml-1">*</span>}
              </label>
            )}
            <textarea
              id="feedback-comment"
              value={feedbackComment}
              onChange={(e) => setFeedbackComment(e.target.value)}
              placeholder={placeholder}
              rows={4}
              required={isCommentRequired}
              aria-required={isCommentRequired}
              aria-describedby={showValidationError ? 'feedback-comment-error' : undefined}
              aria-invalid={showValidationError}
              className="w-full min-h-32 resize-none rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
            {showValidationError && (
              <p id="feedback-comment-error" role="alert" className="text-xs text-red-700">
                Please provide additional details when selecting &quot;Other&quot;
              </p>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <ButtonWidget
              label={cancelText}
              style="OUTLINE"
              color="SECONDARY"
              onClick={handleCancel}
            />
            <ButtonWidget
              label={submitText}
              style="SOLID"
              color="ACCENT"
              onClick={handleSubmitDetails}
            />
          </div>
        </div>
      </DialogField>
    </>
  )
}
