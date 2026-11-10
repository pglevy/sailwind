import * as React from 'react'
import { Info } from 'lucide-react'
import { useI18n, KEYS } from '../../i18n'

/**
 * Required marker: a visual asterisk hidden from assistive tech, followed by
 * screen-reader-only text. (aria-label on a generic span isn't reliably announced.)
 */
export const RequiredIndicator: React.FC<{ className?: string }> = ({ className = 'ml-1' }) => {
  const { t } = useI18n()
  return (
    <>
      <span className={`text-red-700 ${className}`} aria-hidden="true">*</span>
      <span className="sr-only">{t(KEYS.fieldRequired)}</span>
    </>
  )
}

/**
 * Help icon: role="img" makes the aria-label valid on an icon-only span. `title`
 * stays the hover tooltip and becomes the image's accessible description.
 */
export const HelpIcon: React.FC<{ tooltip: string; className?: string }> = ({ tooltip, className = 'ml-2' }) => {
  const { t } = useI18n()
  return (
    <span
      role="img"
      className={`${className} text-gray-700 cursor-help inline-flex items-center align-middle`}
      title={tooltip}
      aria-label={t(KEYS.fieldHelp)}
    >
      <Info size={14} aria-hidden="true" />
    </span>
  )
}
