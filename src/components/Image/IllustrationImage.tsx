import type { IllustrationName } from './illustrations/illustrationSpecs'

export type { IllustrationName }

export interface IllustrationImageProps {
  /** Discriminator to identify this as an illustration image */
  imageType: 'illustration'
  /** Which illustration to draw */
  illustration: IllustrationName
  /** Whether the illustration draws itself in when it appears */
  showAnimation?: boolean
}

/**
 * Illustration image interface for use within ImageField. Not in SAIL.
 *
 * This is not a React component - it's a data structure
 * that gets processed by ImageField for rendering
 *
 * Use this for one of the pre-baked line drawings, such as the picture at the top of an empty
 * state. It is decorative, and takes its size from ImageField's `size`.
 */
