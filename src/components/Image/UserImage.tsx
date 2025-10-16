/**
 * Mock User type - in production, this would come from your data layer
 * For prototyping, we just need a way to represent user data
 */
export interface User {
  /** User's full name for display */
  name?: string
  /** URL to user's profile photo */
  photoUrl?: string
  /** User's initials for fallback display */
  initials?: string
}

export interface UserImageProps {
  /** Discriminator to identify this as a user image */
  imageType: 'user'
  /** The user whose profile photo will be shown */
  user?: User
  /** Alternate text for accessibility and screen readers */
  altText?: string
  /** Optional caption text for mouseover (tooltip) */
  caption?: string
  /** Link behavior when image is clicked */
  link?: () => void
  /** Controls visibility of the image */
  showWhen?: boolean
}

/**
 * User image interface for use within ImageField
 * Maps to SAIL's a!userImage() function
 *
 * This is not a React component - it's a data structure
 * that gets processed by ImageField for rendering with Radix Avatar
 *
 * @example
 * <ImageField
 *   label="Assigned To"
 *   images={[
 *     {
 *       imageType: 'user',
 *       user: { name: "John Smith", photoUrl: "/avatars/john.jpg", initials: "JS" },
 *       altText: "John Smith profile photo",
 *       caption: "Click to view profile"
 *     }
 *   ]}
 *   style="AVATAR"
 *   size="MEDIUM"
 * />
 */
