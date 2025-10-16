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
