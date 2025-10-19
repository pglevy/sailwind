# Image Component Examples

## Basic Usage

```tsx
<ImageField
  label="Project Screenshots"
  instructions="Sample images from the project"
  images={[
    { document: "screenshot1.png", altText: "Main dashboard", caption: "Dashboard overview" },
    { document: "screenshot2.png", altText: "Settings panel", caption: "User settings" }
  ]}
  size="MEDIUM"
/>
```

## Avatar Style (Circular Images)

```tsx
<ImageField
  label="Team Members"
  images={[
    { document: "avatar1.jpg", altText: "John Doe", caption: "Project Manager" },
    { document: "avatar2.jpg", altText: "Jane Smith", caption: "Developer" },
    { document: "avatar3.jpg", altText: "Bob Johnson", caption: "Designer" }
  ]}
  size="SMALL_PLUS"
  style="AVATAR"
  align="CENTER"
/>
```

## Gallery Layout

```tsx
<ImageField
  label="Product Gallery"
  images={[
    { document: "product1.jpg", altText: "Product view 1" },
    { document: "product2.jpg", altText: "Product view 2" },
    { document: "product3.jpg", altText: "Product view 3" },
    { document: "product4.jpg", altText: "Product view 4" }
  ]}
  size="GALLERY"
  align="CENTER"
/>
```

## With Click Actions

```tsx
<ImageField
  label="Clickable Images"
  images={[
    { 
      document: "report.png", 
      altText: "Monthly report", 
      caption: "Click to view full report",
      link: () => window.open('/reports/monthly.pdf')
    },
    { 
      document: "chart.png", 
      altText: "Performance chart", 
      caption: "Click to view interactive chart",
      link: () => navigateToChart()
    }
  ]}
  size="MEDIUM"
  isThumbnail={true}
/>
```

## Different Sizes

```tsx
{/* Icon size for status indicators */}
<ImageField
  label="Status Icons"
  images={[
    { document: "success.svg", altText: "Success" },
    { document: "warning.svg", altText: "Warning" },
    { document: "error.svg", altText: "Error" }
  ]}
  size="ICON_PLUS"
/>

{/* Large images for hero sections */}
<ImageField
  label="Hero Image"
  images={[
    { document: "hero-banner.jpg", altText: "Welcome banner", caption: "Main landing image" }
  ]}
  size="FIT"
  align="CENTER"
/>
```

## SAIL Translation

**React:**
```tsx
<ImageField
  label="Project Screenshots"
  instructions="Sample images from the project"
  images={[
    { document: "screenshot1.png", altText: "Main dashboard", caption: "Dashboard overview" },
    { document: "screenshot2.png", altText: "Settings panel", caption: "User settings" }
  ]}
  size="MEDIUM"
  align="CENTER"
/>
```

**SAIL:**
```sail
a!imageField(
  label: "Project Screenshots",
  instructions: "Sample images from the project",
  images: {
    a!documentImage(
      document: cons!SCREENSHOT_1,
      altText: "Main dashboard",
      caption: "Dashboard overview"
    ),
    a!documentImage(
      document: cons!SCREENSHOT_2,
      altText: "Settings panel", 
      caption: "User settings"
    )
  },
  size: "MEDIUM",
  align: "CENTER"
)
```

## Size Reference

| SAIL Size | Dimensions | Use Case |
|-----------|------------|----------|
| `"ICON"` | 20x20px | Small status icons |
| `"ICON_PLUS"` | 40x40px | Larger icons |
| `"TINY"` | 60x120px | Thumbnails |
| `"EXTRA_SMALL"` | 80x160px | Small previews |
| `"SMALL"` | 100x200px | Profile pictures |
| `"SMALL_PLUS"` | 150x300px | Medium previews |
| `"MEDIUM"` | 200x400px | Standard images |
| `"MEDIUM_PLUS"` | 300x500px | Large previews |
| `"LARGE"` | 400x600px | Hero images |
| `"LARGE_PLUS"` | 600x800px | Full-width images |
| `"EXTRA_LARGE"` | 800x1000px | Maximum size |
| `"GALLERY"` | 240x80px | Horizontal gallery |
| `"FIT"` | Natural size | Responsive images |

## Style Options

- **`"STANDARD"`** - Normal rectangular images with slight rounding
- **`"AVATAR"`** - Circular images, perfect for profile pictures

## Alignment Options

- **`"START"`** - Left-aligned images
- **`"CENTER"`** - Center-aligned images  
- **`"END"`** - Right-aligned images

## Accessibility Features

- All images require `altText` for screen readers
- Optional `caption` provides additional context
- Proper ARIA labeling when used with labels
- Keyboard navigation support for clickable images
- High contrast hover states for interactive elements

---

# UserImage Component (Radix Avatar-based)

The `UserImage` component provides an enhanced avatar experience using Radix Avatar, with automatic fallback handling for missing profile photos.

## Basic Usage

```tsx
import { UserImage } from './components'

// User with photo
<UserImage
  user={{
    name: "John Smith",
    photoUrl: "/avatars/john.jpg",
    initials: "JS"
  }}
  altText="John Smith profile photo"
  caption="Click to view profile"
  size="MEDIUM"
/>
```

## Automatic Fallbacks

UserImage gracefully handles missing profile photos with two fallback levels:

### 1. Initials Fallback
When no `photoUrl` is provided, displays user initials:

```tsx
<UserImage
  user={{ name: "Jane Doe", initials: "JD" }}
  size="MEDIUM"
/>
```

### 2. Default Icon Fallback
When no `photoUrl` or `initials` are provided, displays a default user icon:

```tsx
<UserImage
  user={{ name: "Anonymous User" }}
  size="MEDIUM"
/>
```

## Sizes

UserImage supports three sizes:

```tsx
{/* Small - 32px */}
<UserImage
  user={{ name: "John", initials: "JS" }}
  size="SMALL"
/>

{/* Medium - 48px (default) */}
<UserImage
  user={{ name: "John", initials: "JS" }}
  size="MEDIUM"
/>

{/* Large - 64px */}
<UserImage
  user={{ name: "John", initials: "JS" }}
  size="LARGE"
/>
```

## With Click Actions

```tsx
<UserImage
  user={{ name: "John Smith", photoUrl: "/avatars/john.jpg", initials: "JS" }}
  caption="View profile"
  link={() => navigateToProfile('john-smith')}
  size="MEDIUM"
/>
```

## Integration with ImageField

You can use UserImage alongside DocumentImage in an ImageField for mixed content:

```tsx
<ImageField
  label="Team Members"
  style="AVATAR"
  size="SMALL_PLUS"
  images={[
    // DocumentImage for static avatars
    { document: "avatar1.jpg", altText: "Team member 1" },
    { document: "avatar2.jpg", altText: "Team member 2" }
  ]}
/>

{/* Or use UserImage standalone for dynamic user data */}
<div className="flex gap-2">
  <UserImage user={{ name: "John", initials: "JS" }} size="MEDIUM" />
  <UserImage user={{ name: "Jane", initials: "JD" }} size="MEDIUM" />
  <UserImage user={{ name: "Bob", initials: "BJ" }} size="MEDIUM" />
</div>
```

## SAIL Translation

**React:**
```tsx
<UserImage
  user={{
    name: "John Smith",
    photoUrl: "/avatars/john.jpg",
    initials: "JS"
  }}
  altText="John Smith profile photo"
  caption="Click to view profile"
/>
```

**SAIL:**
```sail
a!imageField(
  images: {
    a!userImage(
      user: cons!JOHN_SMITH_USER,
      altText: "John Smith profile photo",
      caption: "Click to view profile"
    )
  },
  style: "AVATAR",
  size: "MEDIUM"
)
```

## User Type Reference

```tsx
interface User {
  /** User's full name for display */
  name?: string
  /** URL to user's profile photo */
  photoUrl?: string
  /** User's initials for fallback display (e.g., "JS") */
  initials?: string
}
```

## Key Features

- **Automatic fallbacks** - Radix Avatar handles image loading states gracefully
- **Delay prevention** - 600ms delay prevents flash-of-fallback on slow networks
- **Accessibility** - Proper alt text and ARIA attributes
- **Circular by default** - Always renders as circular avatars
- **Hover states** - Visual feedback for clickable avatars
- **Type-safe** - Full TypeScript support for User objects
