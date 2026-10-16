import * as React from 'react'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'
import { useI18n, useLocale, KEYS, interpolateNodes } from '../../i18n'

export interface PagingProps {
  /** Total number of items */
  totalCount: number
  /** Number of items per page */
  pageSize: number
  /** Current page number (1-based) */
  currentPage: number
  /** Callback when page changes */
  onPageChange: (page: number) => void
  /** Determines if the paging includes the total row count. "STANDARD" hides total count; "ROW_COUNT" shows total count and first/last controls. */
  pagingControls?: 'STANDARD' | 'ROW_COUNT'
  /** Whether the component is displayed */
  showWhen?: boolean
}

export const Paging: React.FC<PagingProps> = ({
  totalCount,
  pageSize,
  currentPage,
  onPageChange,
  pagingControls = 'STANDARD',
  showWhen = true,
}) => {
  const { t } = useI18n()

  // RTL / Text_Direction consumption pattern (Requirement 9.1):
  // Read the active reading direction from the nearest LocaleProvider and apply
  // it CONDITIONALLY to the outer container — `'rtl'` for RTL locales, `undefined`
  // (no `dir` attribute emitted) for LTR. v1 ships only en-us (LTR), so this
  // renders zero DOM change for the shipped locale. Do NOT hardcode `dir="ltr"`.
  // This only wires the direction signal into the DOM; mirroring the control
  // order / spacing for RTL is intentionally out of scope for v1.
  const { direction } = useLocale()
  const dir = direction === 'RTL' ? 'rtl' : undefined

  if (!showWhen) return null

  const totalPages = Math.ceil(totalCount / pageSize)
  if (totalPages <= 1) return null

  const startIndex = (currentPage - 1) * pageSize + 1
  const endIndex = Math.min(currentPage * pageSize, totalCount)
  const hasPreviousPage = currentPage > 1
  const hasNextPage = currentPage < totalPages

  return (
    <div className="flex items-center justify-end gap-2 px-3 py-2 text-sm text-gray-700" dir={dir}>
      {pagingControls === 'ROW_COUNT' && totalPages >= 3 && (
        <button
          onClick={() => onPageChange(1)}
          disabled={!hasPreviousPage}
          aria-label={t(KEYS.pagingFirstPage)}
          title={t(KEYS.pagingFirstPage)}
          className="px-1 py-1 disabled:text-gray-400 disabled:cursor-not-allowed text-blue-700 hover:text-blue-900 cursor-pointer"
        >
          <ChevronsLeft size={18} />
        </button>
      )}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!hasPreviousPage}
        aria-label={t(KEYS.pagingPreviousPage)}
        title={t(KEYS.pagingPreviousPage)}
        className="px-1 py-1 disabled:text-gray-400 disabled:cursor-not-allowed text-blue-700 hover:text-blue-900 cursor-pointer"
      >
        <ChevronLeft size={18} />
      </button>
      {(() => {
        // The "start – end" number-range is its own translatable unit
        // (paging.numberRange) rendered as a single bold node, so it can be
        // substituted as-is into the surrounding phrase below.
        const numberRange = (
          <span className="font-bold">{t(KEYS.pagingNumberRange, startIndex, endIndex)}</span>
        )

        // NOTE: `t(KEYS.pagingRange)` / `t(KEYS.pagingRangeMany)` are called with
        // NO value args on purpose. With no args, the lookup's missing-argument
        // behavior leaves the `{0}`/`{1}` placeholders in the resolved template
        // untouched, so we get back the raw phrase (e.g. "{0} of {1}") instead of
        // a fully-substituted string. `interpolateNodes` then fills those same
        // placeholders with React nodes (the bold `numberRange` above, plus
        // `totalCount`) — this is node-aware interpolation, not concatenation:
        // the phrase (and its word order) still comes from a single translatable
        // string, it's just filled with elements instead of text.
        return pagingControls === 'ROW_COUNT' ? (
          <span>{interpolateNodes(t(KEYS.pagingRange), [numberRange, totalCount])}</span>
        ) : (
          <span>{interpolateNodes(t(KEYS.pagingRangeMany), [numberRange])}</span>
        )
      })()}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasNextPage}
        aria-label={t(KEYS.pagingNextPage)}
        title={t(KEYS.pagingNextPage)}
        className="px-1 py-1 disabled:text-gray-400 disabled:cursor-not-allowed text-blue-700 hover:text-blue-900 cursor-pointer"
      >
        <ChevronRight size={18} />
      </button>
      {pagingControls === 'ROW_COUNT' && totalPages >= 3 && (
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={!hasNextPage}
          aria-label={t(KEYS.pagingLastPage)}
          title={t(KEYS.pagingLastPage)}
          className="px-1 py-1 disabled:text-gray-400 disabled:cursor-not-allowed text-blue-700 hover:text-blue-900 cursor-pointer"
        >
          <ChevronsRight size={18} />
        </button>
      )}
    </div>
  )
}
