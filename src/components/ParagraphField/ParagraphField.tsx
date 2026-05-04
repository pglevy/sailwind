import * as React from 'react'
import { AlertTriangle } from 'lucide-react'
import { FieldWrapper } from '../shared/FieldWrapper'
import type { SAILLabelPosition, SAILMarginSize } from '../../types/sail'

type RefreshAfter = "KEYPRESS" | "UNFOCUS"
type ParagraphHeight = "SHORT" | "MEDIUM" | "TALL" | "EXTRA_TALL"
type ParagraphWidth = "NARROW" | "MEDIUM" | "FULL"

export interface ParagraphFieldProps {
  /** Text to display as the field label */
  label?: string
  /** Supplemental text about this field */
  instructions?: string
  /** Determines if a value is required to submit the form */
  required?: boolean
  /** Determines if the field should display as not editable */
  readOnly?: boolean
  /** Determines if the field should display as potentially editable but grayed out */
  disabled?: boolean
  /** Text to display in the paragraph field */
  value?: string
  /** Validation errors to display below the field when the value is not null */
  validations?: string[]
  /** Callback when the user changes the text */
  saveInto?: (value: string) => void
  /** Callback when the user changes the text (React-style alias for saveInto) */
  onChange?: (value: string) => void
  /** Determines when the interface is refreshed with the saved value */
  refreshAfter?: RefreshAfter
  /** When present, the requiredness of the field is only evaluated when a button in the same validation group is pressed */
  validationGroup?: string
  /** Custom message to display when the field's value is required and not provided */
  requiredMessage?: string
  /** Determines where the label appears */
  labelPosition?: SAILLabelPosition
  /** Text to display in the field when it is empty */
  placeholder?: string
  /** Displays a help icon with the specified text as a tooltip */
  helpTooltip?: string
  /** Additional text to be announced by screen readers */
  accessibilityText?: string
  /** Determines whether the component is displayed on the interface */
  showWhen?: boolean
  /** Determines the maximum number of characters */
  characterLimit?: number
  /** Determines if the character count displays on the field */
  showCharacterCount?: boolean
  /** Determines how much space is added above the component */
  marginAbove?: SAILMarginSize
  /** Determines how much space is added below the component */
  marginBelow?: SAILMarginSize
  /** Determines the height of the paragraph field */
  height?: ParagraphHeight
  /** Determines the width of the paragraph field */
  width?: ParagraphWidth
  /** Determines if URLs in read-only mode are automatically converted to links */
  linkify?: boolean
  /** Removes border and background for embedding inside custom containers */
  borderless?: boolean
  /** Keyboard event handler passed through to the textarea */
  onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void
  /** Additional Tailwind classes for prototype-specific styling (not part of SAIL API) */
  className?: string
}

export const ParagraphField: React.FC<ParagraphFieldProps> = ({
  label,
  instructions,
  required = false,
  readOnly = false,
  disabled = false,
  value = "",
  validations = [],
  saveInto,
  onChange,
  validationGroup,
  requiredMessage,
  labelPosition = "ABOVE",
  placeholder,
  helpTooltip,
  accessibilityText,
  showWhen = true,
  characterLimit,
  showCharacterCount = true,
  marginAbove = "NONE",
  marginBelow = "STANDARD",
  height = "MEDIUM",
  width,
  linkify = false,
  borderless = false,
  onKeyDown,
  className
}) => {
  const inputId = React.useMemo(() => `paragraphfield-${Math.random().toString(36).substr(2, 9)}`, [])

  if (!showWhen) return null

  const heightMap: Record<ParagraphHeight, string> = {
    SHORT: 'min-h-20',
    MEDIUM: 'min-h-32',
    TALL: 'min-h-48',
    EXTRA_TALL: 'min-h-64',
  }

  const widthMap: Record<ParagraphWidth, string> = {
    NARROW: 'max-w-xs',
    MEDIUM: 'max-w-md',
    FULL: 'w-full',
  }

  const inputClasses = [
    'w-full text-base resize-y',
    heightMap[height],
    !borderless && 'px-3 py-2 border border-gray-300 rounded-sm bg-white',
    !borderless && 'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
    borderless && 'px-3 py-2 border-0 bg-transparent resize-none focus:outline-none',
    disabled && 'bg-gray-100 text-gray-700 cursor-not-allowed',
    disabled && borderless && '!bg-transparent opacity-50 cursor-not-allowed',
    validations.length > 0 && !borderless && 'border-red-700 focus:ring-red-700'
  ].filter(Boolean).join(' ')

  const wrapperClasses = [
    width && widthMap[width],
    className,
  ].filter(Boolean).join(' ') || undefined

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const handler = onChange || saveInto
    if (handler) handler(e.target.value)
  }

  const showValidations = validations.length > 0 && value !== ""
  const showRequiredMessage = required && !value && requiredMessage && validations.length === 0

  const linkifyText = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g
    const parts = text.split(urlRegex)
    return parts.map((part, i) =>
      urlRegex.test(part)
        ? <a key={i} href={part} className="text-blue-500 underline" target="_blank" rel="noopener noreferrer">{part}</a>
        : part
    )
  }

  const inputElement = readOnly ? (
    <div
      id={inputId}
      className="text-base whitespace-pre-wrap"
      aria-label={accessibilityText || (labelPosition === "COLLAPSED" ? label : undefined)}
      aria-describedby={instructions ? `${inputId}-instructions` : undefined}
    >
      {linkify ? linkifyText(value) : value}
    </div>
  ) : (
    <div className="relative">
      <textarea
        id={inputId}
        value={value}
        onChange={handleChange}
        onKeyDown={onKeyDown}
        placeholder={readOnly ? undefined : placeholder}
        disabled={disabled}
        readOnly={readOnly}
        maxLength={characterLimit}
        className={inputClasses}
        aria-invalid={validations.length > 0}
        aria-describedby={
          validations.length > 0
            ? `${inputId}-error`
            : instructions
              ? `${inputId}-instructions`
              : undefined
        }
        aria-label={accessibilityText || (labelPosition === "COLLAPSED" ? label : undefined)}
        data-validation-group={validationGroup}
      />
      {characterLimit && showCharacterCount && !readOnly && (() => {
        const exceeded = value.length > characterLimit
        return (
          <span className={`absolute right-3 bottom-3 text-xs pointer-events-none flex items-center gap-1 ${exceeded ? 'text-red-700' : 'text-gray-700'}`}>
            {exceeded && <AlertTriangle size={12} />}
            {value.length} / {characterLimit}
          </span>
        )
      })()}
    </div>
  )

  const footerContent = (
    <>
      {showValidations && (
        <div id={`${inputId}-error`} className="mt-2" role="alert">
          {validations.map((validation, i) => (
            <p key={i} className="text-base text-red-700">{validation}</p>
          ))}
        </div>
      )}
      {showRequiredMessage && (
        <p className="text-base text-red-700 mt-2" role="alert">
          {requiredMessage}
        </p>
      )}
    </>
  )

  return (
    <FieldWrapper
      label={label}
      labelPosition={labelPosition}
      required={required}
      instructions={instructions}
      helpTooltip={helpTooltip}
      accessibilityText={accessibilityText}
      inputId={inputId}
      marginAbove={marginAbove}
      marginBelow={marginBelow}
      footer={footerContent}
      className={wrapperClasses}
    >
      {inputElement}
    </FieldWrapper>
  )
}
