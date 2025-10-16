export interface DocumentImageProps {
  /** The image file path (relative to public directory) */
  document: string
  /** Alternate text for accessibility and screen readers */
  altText?: string
  /** Optional caption text for mouseover and slideshow mode */
  caption?: string
  /** Link behavior when image is clicked */
  link?: () => void
  /** Controls visibility of the image */
  showWhen?: boolean
}

/**
 * Document image interface for use within ImageField
 * Maps to SAIL's a!documentImage() function
 * 
 * This is not a React component - it's a data structure
 * that gets processed by ImageField for rendering
 */
