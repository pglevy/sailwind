import type * as React from 'react'

/** The props ImageField gives the component of an SVG image */
export interface SvgImageComponentProps {
  /** Size, shape and other classes from ImageField. Put them on the component's root `<svg>`. */
  className?: string
}

export interface SvgImageProps {
  /** Discriminator to identify this as an SVG image */
  imageType: 'svg'
  /**
   * The component that draws the SVG: a reference to it, not a URL. ImageField renders it and
   * passes `className`, so it can be a pre-baked illustration, an SVGR import, or your own
   * markup. Because it is a component and not an `<img>`, it keeps full control over its own
   * style and animation.
   */
  component: React.ComponentType<SvgImageComponentProps>
  /** Extra props for the component, for example `{ showAnimation: false }` on a pre-baked illustration */
  componentProps?: Record<string, unknown>
  /** Alternate text for accessibility and screen readers. Leave it out for a decorative image. */
  altText?: string
  /** Optional caption text for mouseover and slideshow mode */
  caption?: string
  /** Link behavior when image is clicked */
  link?: () => void
  /** Controls visibility of the image */
  showWhen?: boolean
}

/**
 * SVG image interface for use within ImageField. Not in SAIL.
 *
 * This is not a React component - it's a data structure
 * that gets processed by ImageField for rendering
 *
 * Use this for an illustration or icon that needs to be styled or animated, which an
 * image from a URL (WebImage, DocumentImage) can't be.
 */
