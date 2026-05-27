import * as React from 'react'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'

export interface PagingProps {
  /** 1-based index of the first visible item */
  startIndex: number
  /** Index of the last visible item on the current page */
  endIndex: number
  /** Total number of items (used when pagingControls is "ROW_COUNT") */
  totalCount: number
  /** Current page number (1-based) */
  currentPage: number
  /** Total number of pages */
  totalPages: number
  /** Determines if the paging includes the total row count. "STANDARD" hides total count; "ROW_COUNT" shows total count and first/last controls. */
  pagingControls?: 'STANDARD' | 'ROW_COUNT'
  /** Callback when page changes */
  onPageChange: (page: number) => void
  /** Whether the component is displayed */
  showWhen?: boolean
}

export const Paging: React.FC<PagingProps> = ({
  startIndex,
  endIndex,
  totalCount,
  currentPage,
  totalPages,
  pagingControls = 'STANDARD',
  onPageChange,
  showWhen = true,
}) => {
  if (!showWhen) return null
  if (totalPages <= 1) return null

  const hasPreviousPage = currentPage > 1
  const hasNextPage = currentPage < totalPages

  return (
    <div className="flex items-center justify-end gap-2 px-3 py-2 text-sm text-gray-700">
      {pagingControls === 'ROW_COUNT' && totalPages >= 3 && (
        <button
          onClick={() => onPageChange(1)}
          disabled={!hasPreviousPage}
          aria-label="First page"
          title="First page"
          className="px-1 py-1 disabled:text-gray-400 disabled:cursor-not-allowed text-blue-700 hover:text-blue-900 cursor-pointer"
        >
          <ChevronsLeft size={18} />
        </button>
      )}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!hasPreviousPage}
        aria-label="Previous page"
        title="Previous page"
        className="px-1 py-1 disabled:text-gray-400 disabled:cursor-not-allowed text-blue-700 hover:text-blue-900 cursor-pointer"
      >
        <ChevronLeft size={18} />
      </button>
      {pagingControls === 'ROW_COUNT' ? (
        <span>
          <span className="font-bold">{startIndex} – {endIndex}</span>
          {' '}of {totalCount}
        </span>
      ) : (
        <span>
          <span className="font-bold">{startIndex} – {endIndex}</span>
          {' '}of many
        </span>
      )}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasNextPage}
        aria-label="Next page"
        title="Next page"
        className="px-1 py-1 disabled:text-gray-400 disabled:cursor-not-allowed text-blue-700 hover:text-blue-900 cursor-pointer"
      >
        <ChevronRight size={18} />
      </button>
      {pagingControls === 'ROW_COUNT' && totalPages >= 3 && (
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={!hasNextPage}
          aria-label="Last page"
          title="Last page"
          className="px-1 py-1 disabled:text-gray-400 disabled:cursor-not-allowed text-blue-700 hover:text-blue-900 cursor-pointer"
        >
          <ChevronsRight size={18} />
        </button>
      )}
    </div>
  )
}
