export interface TagItemProps {
  text: string
  backgroundColor?: string // hex or semantic color
  textColor?: string // hex or semantic color
  link?: string
  accessibilityText?: string
}

// This is the "item" - doesn't render on its own, just defines the shape
export const TagItem = (_props: TagItemProps) => {
  throw new Error('TagItem must be used within TagField')
}
