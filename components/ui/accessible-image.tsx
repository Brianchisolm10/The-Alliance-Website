import * as React from 'react'
import Image, { ImageProps } from 'next/image'

interface AccessibleImageProps extends Omit<ImageProps, 'alt'> {
  /**
   * Alternative text for the image.
   * - For informative images: Describe the content/function
   * - For decorative images: Use empty string ""
   * - For functional images: Describe the action
   */
  alt: string
  /**
   * Whether the image is decorative only (no informational value)
   * If true, the image will be hidden from screen readers
   */
  decorative?: boolean
  /**
   * Caption to display below the image
   */
  caption?: string
}

/**
 * Accessible image component that enforces alt text and provides
 * additional accessibility features
 */
export const AccessibleImage = React.forwardRef<HTMLDivElement, AccessibleImageProps>(
  ({ alt, decorative = false, caption, className = '', ...props }, ref) => {
    const imageId = React.useId()
    const captionId = caption ? `${imageId}-caption` : undefined

    if (decorative && alt !== '') {
      console.warn(
        'AccessibleImage: Decorative images should have an empty alt text. ' +
          'Either remove the decorative prop or set alt=""'
      )
    }

    return (
      <figure ref={ref} className={className}>
        <Image
          {...props}
          alt={alt}
          aria-hidden={decorative}
          aria-describedby={captionId}
        />
        {caption && (
          <figcaption id={captionId} className="mt-2 text-sm text-gray-600 text-center">
            {caption}
          </figcaption>
        )}
      </figure>
    )
  }
)

AccessibleImage.displayName = 'AccessibleImage'

/**
 * Icon component for decorative or functional icons
 */
interface AccessibleIconProps extends React.SVGProps<SVGSVGElement> {
  /**
   * Label for the icon (required for functional icons)
   * Leave undefined for decorative icons with adjacent text
   */
  label?: string
  /**
   * Whether the icon is decorative (has adjacent text explaining its purpose)
   */
  decorative?: boolean
  children: React.ReactNode
}

export const AccessibleIcon: React.FC<AccessibleIconProps> = ({
  label,
  decorative = false,
  children,
  ...props
}) => {
  if (!decorative && !label) {
    console.warn(
      'AccessibleIcon: Non-decorative icons must have a label. ' +
        'Either add a label prop or set decorative={true}'
    )
  }

  return (
    <svg
      {...props}
      aria-hidden={decorative}
      aria-label={!decorative ? label : undefined}
      role={!decorative && label ? 'img' : undefined}
    >
      {children}
      {!decorative && label && <title>{label}</title>}
    </svg>
  )
}

/**
 * Avatar component with accessible fallback
 */
interface AccessibleAvatarProps {
  src?: string | null
  alt: string
  fallback?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export const AccessibleAvatar: React.FC<AccessibleAvatarProps> = ({
  src,
  alt,
  fallback,
  size = 'md',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'h-8 w-8 text-sm',
    md: 'h-10 w-10 text-base',
    lg: 'h-12 w-12 text-lg',
  }

  const fallbackText = fallback || alt.charAt(0).toUpperCase()

  if (src) {
    return (
      <div className={`relative overflow-hidden rounded-full ${sizeClasses[size]} ${className}`}>
        <Image src={src} alt={alt} fill className="object-cover" />
      </div>
    )
  }

  return (
    <div
      className={`flex items-center justify-center rounded-full bg-blue-600 text-white font-semibold ${sizeClasses[size]} ${className}`}
      role="img"
      aria-label={alt}
    >
      {fallbackText}
    </div>
  )
}

/**
 * Logo component with accessible text alternative
 */
interface AccessibleLogoProps {
  src?: string
  alt?: string
  width?: number
  height?: number
  className?: string
}

export const AccessibleLogo: React.FC<AccessibleLogoProps> = ({
  src,
  alt = 'AFYA Wellness',
  width = 120,
  height = 40,
  className = '',
}) => {
  if (src) {
    return (
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
        priority
      />
    )
  }

  // Text-based logo fallback
  return (
    <span className={`text-2xl font-bold text-blue-600 ${className}`} role="img" aria-label={alt}>
      AFYA
    </span>
  )
}
