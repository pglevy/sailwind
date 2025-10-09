import type { SAILSemanticColor } from '../../types/sail'

/**
 * Props for individual tag items
 * Maps to SAIL's a!tagItem() function
 */
export interface TagItemProps {
  /** Text to display within the tag (max 40 characters in SAIL) */
  text: string
  /** Background color - hex value or semantic color name */
  backgroundColor?: string | SAILSemanticColor
  /** Text color - hex value or "STANDARD" */
  textColor?: string | "STANDARD"
  /** Tooltip text to display on hover */
  tooltip?: string
  /** Controls tag visibility */
  showWhen?: boolean
  /** Link to apply to the tag (href string for React implementation) */
  link?: string
}

/**
 * TagItem component
 * This is a data structure component - it doesn't render independently.
 * TagItems must be used within a TagField component.
 */
export const TagItem = (_props: TagItemProps): null => {
  // This component is only for type definition
  // Actual rendering happens in TagField
  return null
}
