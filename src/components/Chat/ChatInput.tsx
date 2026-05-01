import * as React from 'react'
import { useState } from 'react'
import { X, FileText, FileImage, FileVideo, File } from 'lucide-react'
import { mergeClasses } from '../../utils/classNames'
import { ButtonWidget } from '../Button/ButtonWidget'
import { ParagraphField } from '../ParagraphField/ParagraphField'

export interface ChatInputFile {
  name: string
  type?: string
}

export interface ChatInputProps {
  /** Placeholder text for the input */
  placeholder?: string
  /** Callback when message is submitted */
  onSubmit?: (message: string) => void
  /** Whether the input is disabled */
  disabled?: boolean
  /** Value of the input (controlled) */
  value?: string
  /** Callback when value changes (controlled) */
  saveInto?: (value: string) => void
  /** Whether to show the upload/attach button */
  showUpload?: boolean
  /** Additional Tailwind classes for prototype-specific styling (not part of SAIL API) */
  className?: string
}

const getFileIcon = (type?: string) => {
  if (!type) return File
  if (type.startsWith('image/')) return FileImage
  if (type.startsWith('video/')) return FileVideo
  if (type === 'application/pdf' || type.startsWith('text/')) return FileText
  return File
}

const getFileIconColor = (type?: string) => {
  if (!type) return 'text-gray-500'
  if (type.startsWith('image/')) return 'text-blue-500'
  if (type.startsWith('video/')) return 'text-red-500'
  if (type === 'application/pdf') return 'text-red-700'
  if (type.startsWith('text/')) return 'text-blue-700'
  return 'text-gray-500'
}

export const ChatInput: React.FC<ChatInputProps> = ({
  placeholder = 'Type a message...',
  onSubmit,
  disabled = false,
  value: controlledValue,
  saveInto,
  showUpload = false,
  className,
}) => {
  const [internalValue, setInternalValue] = useState('')
  const [files, setFiles] = useState<ChatInputFile[]>([])

  const isControlled = controlledValue !== undefined
  const value = isControlled ? controlledValue : internalValue

  const handleSubmit = () => {
    if (value.trim() && onSubmit) {
      onSubmit(value)
      if (!isControlled) {
        setInternalValue('')
      }
      setFiles([])
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const handleUploadClick = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.multiple = true
    input.onchange = (e) => {
      const selected = (e.target as HTMLInputElement).files
      if (selected) {
        const newFiles = Array.from(selected).map(f => ({ name: f.name, type: f.type }))
        setFiles(prev => [...prev, ...newFiles])
      }
    }
    input.click()
  }

  const sailClasses = 'border border-gray-300 rounded-sm focus-within:border-blue-500 transition-colors'

  return (
    <div className={mergeClasses(sailClasses, className)}>
      <div className="flex flex-col flex-1">
        {files.length > 0 && (
          <div className="flex flex-col gap-1 px-3 pt-3">
            {files.map((file, index) => {
              const IconComponent = getFileIcon(file.type)
              const iconColor = getFileIconColor(file.type)
              return (
                <div
                  key={index}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-sm border border-gray-200 bg-white w-fit max-w-full"
                >
                  <IconComponent size={16} className={`shrink-0 ${iconColor}`} />
                  <span className="text-sm text-gray-900 truncate max-w-[200px]">{file.name}</span>
                  <button
                    onClick={() => setFiles(prev => prev.filter((_, i) => i !== index))}
                    aria-label={`Remove ${file.name}`}
                    className="shrink-0 p-0.5 rounded-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              )
            })}
          </div>
        )}
        <ParagraphField
          value={value}
          saveInto={(v) => {
            if (isControlled) {
              saveInto?.(v)
            } else {
              setInternalValue(v)
            }
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          borderless
          height="SHORT"
          labelPosition="COLLAPSED"
          label={placeholder}
          marginBelow="NONE"
          marginAbove="NONE"
          className="flex-1 min-h-16"
        />
        <div className="flex items-center justify-between px-1 pb-1">
          <div>
            {showUpload && (
              <ButtonWidget
                icon="plus"
                style="GHOST"
                color="SECONDARY"
                size="SMALL"
                disabled={disabled}
                accessibilityText="Attach file"
                onClick={handleUploadClick}
              />
            )}
          </div>
          <ButtonWidget
            icon="send"
            style="GHOST"
            color="ACCENT"
            size="SMALL"
            disabled={disabled || !value.trim()}
            accessibilityText="Send message"
            onClick={handleSubmit}
          />
        </div>
      </div>
    </div>
  )
}
