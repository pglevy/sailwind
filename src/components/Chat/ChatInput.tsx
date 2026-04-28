import * as React from 'react'
import { useState } from 'react'
import { Send, Paperclip, X, FileText, FileImage, FileVideo, File } from 'lucide-react'
import { mergeClasses } from '../../utils/classNames'

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
  onChange?: (value: string) => void
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
  onChange,
  showUpload = false,
  className,
}) => {
  const [internalValue, setInternalValue] = useState('')
  const [files, setFiles] = useState<ChatInputFile[]>([])

  const isControlled = controlledValue !== undefined
  const value = isControlled ? controlledValue : internalValue

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value
    if (isControlled) {
      onChange?.(newValue)
    } else {
      setInternalValue(newValue)
    }
  }

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

  const sailClasses = 'flex items-end gap-2 pr-1 pb-1 border border-gray-300 rounded-md focus-within:border-blue-500 transition-colors'

  return (
    <div className={mergeClasses(sailClasses, className)}>
      <div className="flex flex-col flex-1">
        {files.length > 0 && (
          <div className="flex flex-col gap-1 px-3 pt-2">
            {files.map((file, index) => {
              const IconComponent = getFileIcon(file.type)
              const iconColor = getFileIconColor(file.type)
              return (
                <div
                  key={index}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-gray-200 bg-white w-fit max-w-full"
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
        <textarea
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          rows={2}
          className="flex-1 min-h-16 resize-none border-0 bg-transparent px-3 py-2 text-base text-gray-900 placeholder:text-gray-500 focus:outline-none disabled:opacity-50"
        />
        {showUpload && (
          <div className="px-1">
            <button
              onClick={handleUploadClick}
              disabled={disabled}
              aria-label="Attach file"
              className="shrink-0 p-2 rounded-md text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Paperclip size={18} />
            </button>
          </div>
        )}
      </div>
      <button
        onClick={handleSubmit}
        disabled={disabled || !value.trim()}
        aria-label="Send message"
        className="shrink-0 p-2 rounded-md text-gray-500 enabled:text-blue-500 enabled:hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <Send size={18} />
      </button>
    </div>
  )
}
