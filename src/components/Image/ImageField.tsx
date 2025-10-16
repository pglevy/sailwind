import * as React from 'react'
import * as Avatar from '@radix-ui/react-avatar'
import { FieldWrapper } from '../shared/FieldWrapper'
import type { SAILLabelPosition, SAILMarginSize, SAILAlign } from '../../types/sail'
import type { DocumentImageProps } from './DocumentImage'
import type { UserImageProps } from './UserImage'

// Union type for all image types supported by ImageField
type ImageFieldImage = DocumentImageProps | UserImageProps

// Type guard to check if an image is a UserImage
function isUserImage(image: ImageFieldImage): image is UserImageProps {
  return 'imageType' in image && image.imageType === 'user'
}

type ImageSize = 
  | "ICON" 
  | "ICON_PLUS" 
  | "TINY" 
  | "EXTRA_SMALL" 
  | "SMALL" 
  | "SMALL_PLUS" 
  | "MEDIUM" 
  | "MEDIUM_PLUS" 
  | "LARGE" 
  | "LARGE_PLUS" 
  | "EXTRA_LARGE" 
  | "FIT" 
  | "GALLERY"

type ImageStyle = "STANDARD" | "AVATAR"

export interface ImageFieldProps {
  /** Text to display as the field label */
  label?: string
  /** Determines where the label appears */
  labelPosition?: SAILLabelPosition
  /** Supplemental text about this field */
  instructions?: string
  /** Help tooltip text (max 500 characters) */
  helpTooltip?: string
  /** Array of images to display (supports both document and user images) */
  images: ImageFieldImage[]
  /** Controls visibility of the component */
  showWhen?: boolean
  /** Determines how the images are sized */
  size?: ImageSize
  /** Determines whether images can be viewed larger when clicked */
  isThumbnail?: boolean
  /** Determines how the images are rendered */
  style?: ImageStyle
  /** Determines alignment of the images */
  align?: SAILAlign
  /** Additional text for screen readers */
  accessibilityText?: string
  /** Margin above the component */
  marginAbove?: SAILMarginSize
  /** Margin below the component */
  marginBelow?: SAILMarginSize
}

/**
 * Displays an array of images from document management or web
 * Maps to SAIL's a!imageField() function
 */
export const ImageField: React.FC<ImageFieldProps> = ({
  label,
  labelPosition = "ABOVE",
  instructions,
  helpTooltip,
  images,
  showWhen = true,
  size = "MEDIUM",
  isThumbnail = false,
  style = "STANDARD",
  align = "START",
  accessibilityText,
  marginAbove = "NONE",
  marginBelow = "STANDARD"
}) => {
  // Visibility control
  if (!showWhen) return null

  const fieldId = `imagefield-${Math.random().toString(36).substr(2, 9)}`

  // Map SAIL size values to CSS dimensions for standard (rectangular) images
  const sizeMap: Record<ImageSize, string> = {
    ICON: 'w-5 h-5', // 20x20px
    ICON_PLUS: 'w-10 h-10', // 40x40px
    TINY: 'w-16 h-32', // ~60x120px
    EXTRA_SMALL: 'w-20 h-40', // ~80x160px
    SMALL: 'w-24 h-48', // ~100x200px
    SMALL_PLUS: 'w-36 h-72', // ~150x300px
    MEDIUM: 'w-48 h-96', // ~200x400px
    MEDIUM_PLUS: 'w-72 h-96', // ~300x500px (limited by h-96)
    LARGE: 'w-96 h-96', // ~400x600px (limited by available classes)
    LARGE_PLUS: 'w-96 h-96', // ~600x800px (limited by available classes)
    EXTRA_LARGE: 'w-96 h-96', // ~800x1000px (limited by available classes)
    GALLERY: 'w-60 h-20', // 240x80px
    FIT: 'max-w-full h-auto' // Natural dimensions
  }

  // Map SAIL size values to CSS dimensions for avatar (square) images
  const avatarSizeMap: Record<ImageSize, string> = {
    ICON: 'w-5 h-5', // 20x20px
    ICON_PLUS: 'w-10 h-10', // 40x40px
    TINY: 'w-16 h-16', // 64x64px
    EXTRA_SMALL: 'w-20 h-20', // 80x80px
    SMALL: 'w-24 h-24', // 96x96px
    SMALL_PLUS: 'w-36 h-36', // 144x144px
    MEDIUM: 'w-48 h-48', // 192x192px
    MEDIUM_PLUS: 'w-72 h-72', // 288x288px
    LARGE: 'w-96 h-96', // 384x384px
    LARGE_PLUS: 'w-96 h-96', // 384x384px (same as LARGE)
    EXTRA_LARGE: 'w-96 h-96', // 384x384px (same as LARGE)
    GALLERY: 'w-20 h-20', // 80x80px (square version of gallery)
    FIT: 'max-w-full h-auto aspect-square' // Natural dimensions, square
  }

  // Map SAIL align values to Tailwind classes
  const alignMap: Record<SAILAlign, string> = {
    START: 'justify-start',
    CENTER: 'justify-center',
    END: 'justify-end'
  }

  // Style-specific classes
  const getImageClasses = () => {
    // Use avatar size map when style is AVATAR
    const activeSizeMap = style === "AVATAR" ? avatarSizeMap : sizeMap

    const baseClasses = [
      activeSizeMap[size],
      'object-cover', // Maintain aspect ratio
      style === "AVATAR" ? 'rounded-full' : 'rounded-sm',
      isThumbnail ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''
    ].filter(Boolean).join(' ')

    return baseClasses
  }

  // Container classes
  const containerClasses = [
    'flex flex-wrap gap-2',
    alignMap[align]
  ].filter(Boolean).join(' ')

  // Filter visible images
  const visibleImages = images.filter(img => img.showWhen !== false)

  // Render images
  const imagesElement = (
    <div className={containerClasses}>
      {visibleImages.map((imageProps, index) => {
        // Check if this is a user image
        if (isUserImage(imageProps)) {
          // Render user image with Radix Avatar
          const { user, altText, caption, link } = imageProps
          const imageAlt = altText || user?.name || 'User profile photo'

          // Use avatar size map for sizing
          const activeSizeMap = avatarSizeMap
          const sizeClasses = activeSizeMap[size]

          // Build fallback content (initials or default icon)
          const fallbackContent = user?.initials ? (
            <span className="font-medium text-gray-700">{user.initials}</span>
          ) : (
            // Default user icon SVG
            <svg className="w-3/5 h-3/5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          )

          return (
            <Avatar.Root
              key={index}
              className={`inline-flex items-center justify-center align-middle overflow-hidden select-none rounded-full bg-gray-100 ${sizeClasses} ${link ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}`}
              title={caption}
              onClick={link}
            >
              <Avatar.Image
                className="w-full h-full object-cover rounded-full"
                src={user?.photoUrl}
                alt={imageAlt}
              />
              <Avatar.Fallback
                className="w-full h-full flex items-center justify-center bg-gray-100"
                delayMs={600}
              >
                {fallbackContent}
              </Avatar.Fallback>
            </Avatar.Root>
          )
        }

        // Render document image (standard approach)
        const imageSrc = imageProps.document.startsWith('/')
          ? imageProps.document
          : `/${imageProps.document}`

        const imageClasses = getImageClasses()

        const handleClick = () => {
          if (imageProps.link) {
            imageProps.link()
          }
        }

        return (
          <div key={index} className="relative">
            <img
              src={imageSrc}
              alt={imageProps.altText || ''}
              title={imageProps.caption}
              className={imageClasses}
              onClick={imageProps.link ? handleClick : undefined}
            />

            {/* Show link indicator if image has link */}
            {imageProps.link && (
              <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 bg-black bg-opacity-20 transition-opacity rounded-sm">
                <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )

  return (
    <FieldWrapper
      label={label}
      labelPosition={labelPosition}
      instructions={instructions}
      helpTooltip={helpTooltip}
      accessibilityText={accessibilityText}
      inputId={fieldId}
      marginAbove={marginAbove}
      marginBelow={marginBelow}
    >
      {imagesElement}
    </FieldWrapper>
  )
}
