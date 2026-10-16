import type { IllustrationName } from './illustrations/illustrationSpecs'

export type { IllustrationName }

export interface IllustrationImageProps {
  /** Discriminator to identify this as an illustration image */
  imageType: 'illustration'
  /** Which illustration to draw */
  illustration: IllustrationName
  /** Whether the illustration draws itself in when it appears */
  showAnimation?: boolean
  /** Controls visibility of the image, as for the other image types */
  showWhen?: boolean
}

/**
 * Illustration image interface for use within ImageField. Not in SAIL.
 *
 * This is not a React component - it's a data structure
 * that gets processed by ImageField for rendering
 *
 * Use this for one of the pre-baked line drawings, such as the picture at the top of an empty
 * state. It is decorative, so it has no altText, caption or link, and it takes its size from
 * ImageField's `size` alone: `style`, `shape` and `isThumbnail` do not apply to it. Its outer
 * rings are clipped at the edge of the picture, so it never spills over what is beside it.
 */
