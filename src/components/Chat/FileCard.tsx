import * as React from 'react'
import { X, File, FileImage, FileCode, FileText } from 'lucide-react'
import { mergeClasses } from '../../utils/classNames'

export interface FileCardProps {
  /** The file name to display */
  fileName: string
  /** The file size in bytes */
  fileSize: number
  /** Whether to show the remove button */
  showRemove?: boolean
  /** Callback when the remove button is clicked */
  onRemove?: () => void
  /** Optional file type override (inferred from fileName if not provided) */
  fileType?: string
  /** Maximum width of the component (CSS value) */
  maxWidth?: string
  /** Additional Tailwind classes */
  className?: string
}

function getFileExtension(filename: string): string {
  const ext = filename.split('.').pop()
  return ext ? ext.toUpperCase() : 'FILE'
}

function getFileIcon(filename: string) {
  const ext = filename.split('.').pop()?.toLowerCase()
  if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(ext || ''))
    return <FileImage size={20} className="shrink-0 text-blue-500" />
  if (ext === 'pdf')
    return <File size={20} className="shrink-0 text-red-500" />
  if (['js', 'ts', 'jsx', 'tsx', 'py', 'java', 'cpp', 'c', 'html', 'css', 'json', 'xml'].includes(ext || ''))
    return <FileCode size={20} className="shrink-0 text-purple-500" />
  return <FileText size={20} className="shrink-0 text-gray-700" />
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export const FileCard: React.FC<FileCardProps> = ({
  fileName,
  fileSize,
  showRemove = false,
  onRemove,
  fileType,
  maxWidth = '320px',
  className,
}) => {
  const extension = fileType || getFileExtension(fileName)
  const icon = getFileIcon(fileName)
  const formattedSize = formatFileSize(fileSize)

  const baseClasses = `flex items-center gap-2 rounded-sm border border-gray-300 bg-white py-2 ${showRemove ? 'pl-3 pr-2' : 'pl-3 pr-4'}`

  return (
    <div className={mergeClasses(baseClasses, className)} style={{ maxWidth }}>
      {icon}
      <div className="flex-1 min-w-0">
        <div className="truncate text-sm font-semibold text-gray-900">{fileName}</div>
        <div className="text-xs text-gray-700">{extension} • {formattedSize}</div>
      </div>
      {showRemove && (
        <button
          onClick={onRemove}
          aria-label={`Remove ${fileName}`}
          className="shrink-0 p-1 rounded-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
        >
          <X size={16} />
        </button>
      )}
    </div>
  )
}
