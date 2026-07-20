export interface WebImageProps {
  /** The external URL of the image */
  source: string
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
 * Web image interface for use within ImageField
 * Maps to SAIL's a!webImage() function
 *
 * This is not a React component - it's a data structure
 * that gets processed by ImageField for rendering
 *
 * Use this to display images from external URLs (CDN, Unsplash, etc.)
 */
