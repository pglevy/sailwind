import * as React from 'react'
import { Upload } from 'lucide-react'
import { FieldWrapper } from '../shared/FieldWrapper'
import { ButtonWidget } from '../Button/ButtonWidget'
import { FileCard } from '../Chat/FileCard'
import type { SAILLabelPosition, SAILMarginSize, SAILSize, SAILColorInput } from '../../types/sail'
import { formatFileSize } from '../../utils/formatFileSize'
import { useI18n, useLocale, KEYS, interpolateNodes } from '../../i18n'

type DropZoneStyle = "COMPACT" | "EXPANDED"
type ButtonDisplay = "LABEL" | "ICON" | "LABEL_AND_ICON"
type ButtonStyle = "OUTLINE" | "GHOST" | "LINK" | "SOLID"
type ButtonSize = Extract<SAILSize, "SMALL" | "STANDARD" | "LARGE">

/**
 * A file in a FileUploadField's value. SAIL's value is a List of Document;
 * Sailwind uses the name and size, which native `File` objects already have.
 * Files the user adds are saved as native `File` objects, so prototypes can
 * read their contents if they need to.
 */
export interface FileUploadFile {
  /** File name, including extension */
  name: string
  /** File size in bytes */
  size: number
}

/**
 * Displays a button and drop zone for uploading files
 * Maps to SAIL's a!fileUploadField()
 *
 * Files never leave the browser: the field only tracks the selected files,
 * so prototypes work without a server. Not implemented: target, fileNames,
 * fileDescriptions, documentActions, uploadMethods, showBorder,
 * showVirusScanMessage.
 */
export interface FileUploadFieldProps {
  /** Text to display as the field label */
  label?: string
  /** Determines where the label appears */
  labelPosition?: SAILLabelPosition
  /** Supplemental text about this field */
  instructions?: string
  /** Displays a help icon with tooltip text */
  helpTooltip?: string
  /** Text to display when no file is uploaded. Replaces "Drop or paste files here" (COMPACT) or "drop them here" (EXPANDED) */
  placeholder?: string
  /** Files associated with this field */
  value?: FileUploadFile[]
  /** Callback with the updated file list when files are added or removed. Removing all files saves an empty list */
  saveInto?: (value: FileUploadFile[]) => void
  /** Callback with the updated file list (React-style alias for saveInto) */
  onChange?: (value: FileUploadFile[]) => void
  /** Maximum number of files. Once reached, further uploads are blocked until a file is removed */
  maxSelections?: number
  /** Determines if a value is required to submit the form */
  required?: boolean
  /** Custom message when field is required and not provided */
  requiredMessage?: string
  /** Determines if the field should display as grayed out. Uploaded files cannot be removed */
  disabled?: boolean
  /** Validation errors to display below the field */
  validations?: string[]
  /** Validation group name (no spaces) */
  validationGroup?: string
  /** Size of the drop zone and whether the button appears inline (COMPACT) or centered in a larger area (EXPANDED) */
  dropZoneStyle?: DropZoneStyle
  /** Determines whether the upload button shows a label, an icon, or both */
  buttonDisplay?: ButtonDisplay
  /** Determines the style of the upload button */
  buttonStyle?: ButtonStyle
  /** Determines the color of the upload button (hex or semantic) */
  buttonColor?: "ACCENT" | "NEGATIVE" | "SECONDARY" | SAILColorInput
  /** Determines the size of the upload button */
  buttonSize?: ButtonSize
  /** Additional text for screen readers */
  accessibilityText?: string
  /** Determines whether component is displayed */
  showWhen?: boolean
  /** Space added above component */
  marginAbove?: SAILMarginSize
  /** Space added below component */
  marginBelow?: SAILMarginSize
  /**
   * Not in SAIL. File extensions to accept (e.g. ["pdf", "docx"]). Limits the
   * file picker and rejects other dropped or pasted files with an inline error.
   * In SAIL, check fv!files.extension in validations instead.
   */
  allowedExtensions?: string[]
  /**
   * Not in SAIL. Maximum size per file, in bytes. Larger files are rejected
   * with an inline error. In SAIL, check fv!files.size in validations instead.
   */
  maxFileSize?: number
  /** Additional Tailwind classes for prototype-specific styling (not part of SAIL API) */
  className?: string
}

const getExtension = (fileName: string): string => {
  const dot = fileName.lastIndexOf('.')
  return dot > 0 ? fileName.slice(dot + 1).toLowerCase() : ''
}

export const FileUploadField: React.FC<FileUploadFieldProps> = ({
  label,
  labelPosition = "ABOVE",
  instructions,
  helpTooltip,
  placeholder,
  value = [],
  saveInto,
  onChange,
  maxSelections,
  required = false,
  requiredMessage,
  disabled = false,
  validations = [],
  validationGroup: _validationGroup,
  dropZoneStyle = "COMPACT",
  buttonDisplay = "LABEL",
  buttonStyle = "OUTLINE",
  buttonColor = "SECONDARY",
  buttonSize = "SMALL",
  accessibilityText,
  showWhen = true,
  marginAbove = "NONE",
  marginBelow = "STANDARD",
  allowedExtensions,
  maxFileSize,
  className
}) => {
  const { t } = useI18n()
  const { locale } = useLocale()
  const inputId = `fileuploadfield-${React.useId()}`
  const inputRef = React.useRef<HTMLInputElement>(null)
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = React.useState(false)
  const [uploadErrors, setUploadErrors] = React.useState<string[]>([])
  // Where focus should go after the next render, when the focused control
  // (a remove button, or the upload button once the limit is hit) disappears
  const pendingFocus = React.useRef<'upload' | number | null>(null)

  React.useEffect(() => {
    const target = pendingFocus.current
    const container = containerRef.current
    if (target === null || !container) return
    pendingFocus.current = null
    const removeButtons = container.querySelectorAll<HTMLButtonElement>('[data-file-list] button')
    const uploadButton = container.querySelector<HTMLButtonElement>('[data-upload-button] button')
    if (typeof target === 'number' && removeButtons.length > 0) {
      removeButtons[Math.min(target, removeButtons.length - 1)].focus()
    } else {
      uploadButton?.focus()
    }
  })

  // Visibility control
  if (!showWhen) return null

  const normalizedExtensions = allowedExtensions?.map(ext => ext.replace(/^\./, '').toLowerCase())
  const isFull = maxSelections !== undefined && value.length >= maxSelections
  const canUpload = !disabled && !isFull

  // Focus is only moved when it was already in this field, so dropping files
  // while working in another field doesn't pull the user away
  const focusIsInside = () => !!containerRef.current?.contains(document.activeElement)

  const handleChange = (newValue: FileUploadFile[]) => {
    const handler = onChange || saveInto
    if (handler) {
      handler(newValue)
    }
  }

  // Validate incoming files, add the ones that pass, and report the rest inline
  const addFiles = (incoming: File[]) => {
    if (!canUpload || incoming.length === 0) return

    const errors: string[] = []
    const accepted: File[] = []

    for (const file of incoming) {
      if (normalizedExtensions && !normalizedExtensions.includes(getExtension(file.name))) {
        const extensionList = new Intl.ListFormat(locale, { type: 'disjunction' })
          .format(normalizedExtensions.map(ext => ext.toUpperCase()))
        errors.push(t(KEYS.fileUploadTypeNotAllowed, file.name, extensionList))
      } else if (maxFileSize !== undefined && file.size > maxFileSize) {
        errors.push(t(KEYS.fileUploadFileTooLarge, file.name, formatFileSize(maxFileSize)))
      } else {
        accepted.push(file)
      }
    }

    let toAdd = accepted
    if (maxSelections !== undefined) {
      const room = Math.max(0, maxSelections - value.length)
      if (accepted.length > room) {
        errors.push(t(KEYS.fileUploadTooManyFiles, maxSelections))
        toAdd = accepted.slice(0, room)
      }
    }

    setUploadErrors(errors)
    if (toAdd.length > 0) {
      const newValue = [...value, ...toAdd]
      // The drop zone goes away when the limit is reached
      if (maxSelections !== undefined && newValue.length >= maxSelections && focusIsInside()) {
        pendingFocus.current = newValue.length - 1
      }
      handleChange(newValue)
    }
  }

  const removeFile = (index: number) => {
    if (disabled) return
    if (focusIsInside()) {
      pendingFocus.current = value.length > 1 ? index : 'upload'
    }
    setUploadErrors([])
    handleChange(value.filter((_, i) => i !== index))
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    addFiles(Array.from(e.target.files ?? []))
    // Reset so selecting the same file again still fires a change event
    e.target.value = ''
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = canUpload ? 'copy' : 'none'
    if (canUpload && !isDragging) setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    // Ignore leave events fired when moving between children of the drop zone
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
      setIsDragging(false)
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    addFiles(Array.from(e.dataTransfer.files))
  }

  // Pasting works while focus is on the drop zone or the upload button
  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    const pasted = Array.from(e.clipboardData.files)
    if (pasted.length > 0) {
      e.preventDefault()
      addFiles(pasted)
    }
  }

  const isExpanded = dropZoneStyle === "EXPANDED"
  const uploadLabel = t(KEYS.fileUploadButton)
  const uploadButton = (
    <span data-upload-button className={isExpanded ? 'mx-1 inline-flex align-middle' : 'inline-flex shrink-0'}>
      <ButtonWidget
        label={buttonDisplay === "ICON" ? undefined : uploadLabel}
        icon={buttonDisplay === "LABEL" ? undefined : 'upload'}
        accessibilityText={buttonDisplay === "ICON" ? uploadLabel : undefined}
        style={buttonStyle}
        color={buttonColor}
        size={buttonSize}
        disabled={disabled}
        onClick={() => inputRef.current?.click()}
      />
    </span>
  )

  const dropZoneClasses = [
    'rounded-sm border border-dashed transition-colors',
    isExpanded
      ? 'flex flex-col items-center justify-center gap-3 px-4 py-8 text-center'
      : 'flex flex-wrap items-center gap-3 p-2',
    // Disabled uses a muted surface rather than opacity so the placeholder keeps readable contrast
    disabled
      ? 'border-gray-300 bg-gray-100 cursor-not-allowed'
      : isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-400 bg-white focus:border-blue-500',
    'focus:outline-none'
  ].join(' ')

  // The upload button is the keyboard control. The drop zone takes focus on click
  // (tabIndex -1, so no extra tab stop) so users can click it and paste files
  const dropZone = !isFull && (
    <div
      data-drop-zone
      tabIndex={disabled ? undefined : -1}
      className={dropZoneClasses}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onPaste={handlePaste}
    >
      {isExpanded ? (
        <>
          <Upload size={32} className="text-gray-500" aria-hidden="true" />
          <p className="text-base leading-loose text-gray-700">
            {interpolateNodes(t(KEYS.fileUploadExpandedPrompt), [
              uploadButton,
              <span key="placeholder">{placeholder ?? t(KEYS.fileUploadPlaceholderExpanded)}</span>
            ])}
          </p>
        </>
      ) : (
        <>
          {uploadButton}
          <span className="text-base text-gray-700">
            {placeholder ?? t(KEYS.fileUploadPlaceholderCompact)}
          </span>
        </>
      )}
    </div>
  )

  const fileList = value.length > 0 && (
    <ul data-file-list className={['flex flex-col gap-2', !isFull && 'mt-2'].filter(Boolean).join(' ')}>
      {value.map((file, index) => (
        <li key={`${index}-${file.name}`}>
          <FileCard
            fileName={file.name}
            fileSize={file.size}
            showRemove={!disabled}
            onRemove={() => removeFile(index)}
            maxWidth="100%"
          />
        </li>
      ))}
    </ul>
  )

  // Show validation errors (consumer validations plus this field's own upload errors)
  const allErrors = [...uploadErrors, ...validations]
  const showValidations = allErrors.length > 0

  // Show required message
  const showRequiredMessage = required && !value.length && requiredMessage

  // The group is named by the label plus "required", since aria-required isn't
  // allowed on a group. accessibilityText is extra description, not a
  // replacement name, unless there's no label.
  const nameId = `${inputId}-name`
  const requiredId = `${inputId}-required`
  const accessibilityTextId = `${inputId}-accessibility-text`
  const groupName = label || accessibilityText
  const labelledBy = [
    groupName && nameId,
    required && requiredId
  ].filter(Boolean).join(' ') || undefined
  const describedBy = [
    label && accessibilityText && accessibilityTextId,
    instructions && `${inputId}-instructions`,
    showValidations && `${inputId}-error`
  ].filter(Boolean).join(' ') || undefined

  const uploadElement = (
    <div
      ref={containerRef}
      role="group"
      aria-labelledby={labelledBy}
      aria-describedby={describedBy}
    >
      {groupName && <span id={nameId} hidden>{groupName}</span>}
      {required && <span id={requiredId} hidden>{t(KEYS.fieldRequired)}</span>}
      {label && accessibilityText && <span id={accessibilityTextId} hidden>{accessibilityText}</span>}
      <input
        ref={inputRef}
        id={inputId}
        type="file"
        hidden
        multiple={maxSelections !== 1}
        accept={normalizedExtensions?.map(ext => `.${ext}`).join(',')}
        disabled={!canUpload}
        onChange={handleInputChange}
      />
      {dropZone}
      {fileList}
    </div>
  )

  // Footer content (validations and required message)
  const footerContent = (
    <>
      {showValidations && (
        <div id={`${inputId}-error`} className="mt-2" role="alert">
          {allErrors.map((validation, i) => (
            <p key={i} className="text-sm text-red-700">{validation}</p>
          ))}
        </div>
      )}

      {showRequiredMessage && (
        <p className="text-sm text-red-700 mt-2" role="alert">
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
      className={className}
    >
      {uploadElement}
    </FieldWrapper>
  )
}
