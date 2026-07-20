import type { Meta, StoryObj } from '@storybook/react-vite'
import { ImageField } from './ImageField'

const meta = {
  title: 'Components/Image',
  component: ImageField,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof ImageField>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: 'Project Screenshots',
    instructions: 'Sample images from the project',
    images: [
      { document: 'images/case-management-studio.webp', altText: 'Case management studio', caption: 'Case Management Studio' },
      { document: 'images/process-modeler.webp', altText: 'Process modeler', caption: 'Process Modeler' },
    ],
    size: 'LARGE_PLUS',
  },
}

export const SmallIcons: Story = {
  args: {
    label: 'Design Object Icons',
    images: [
      { document: 'images/icon-interface.svg', altText: 'Interface icon' },
      { document: 'images/icon-expression-rule.svg', altText: 'Expression rule icon' },
      { document: 'images/icon-record-type.svg', altText: 'Record type icon' },
    ],
    size: 'ICON_PLUS',
    align: 'START',
  },
}

export const AvatarStyle: Story = {
  args: {
    label: 'Team Members',
    images: [
      { document: 'images/uifaces-human-avatar.jpg', altText: 'Team member 1', caption: 'John Doe' },
      { document: 'images/uifaces-popular-avatar1.jpg', altText: 'Team member 2', caption: 'Jane Smith' },
      { document: 'images/uifaces-popular-avatar2.jpg', altText: 'Team member 3', caption: 'Bob Johnson' },
    ],
    size: 'SMALL_PLUS',
    style: 'AVATAR',
    align: 'CENTER',
  },
}

export const GalleryLayout: Story = {
  args: {
    label: 'Image Gallery',
    instructions: 'Horizontal gallery layout',
    images: [
      { document: 'images/case-management-studio.webp', altText: 'Case management' },
      { document: 'images/data-fabric.webp', altText: 'Data fabric' },
      { document: 'images/process-modeler.webp', altText: 'Process modeler' },
      { document: 'images/university_student_dashboard.png', altText: 'Student dashboard' },
    ],
    size: 'GALLERY',
    align: 'CENTER',
  },
}

export const FitSize: Story = {
  args: {
    label: 'Hero Image',
    images: [
      { document: 'images/my-health-site.png', altText: 'My Health site', caption: 'My Health portal' },
    ],
    size: 'FIT',
    align: 'CENTER',
  },
}

export const AdjacentLabel: Story = {
  args: {
    label: 'Profile Picture',
    labelPosition: 'ADJACENT',
    images: [
      { document: 'images/uifaces-popular-avatar3.jpg', altText: 'Profile picture', caption: 'User avatar' },
    ],
    size: 'MEDIUM',
    style: 'AVATAR',
  },
}

export const UserWithPhoto: Story = {
  args: {
    labelPosition: 'COLLAPSED',
    images: [
      {
        imageType: 'user' as const,
        user: { name: 'Jane Smith', photoUrl: 'images/uifaces-popular-avatar1.jpg', initials: 'JS' },
        altText: 'Jane Smith profile photo',
        caption: 'Click to view profile',
      },
    ],
    style: 'AVATAR',
    size: 'MEDIUM',
  },
}

export const UserInitialsFallback: Story = {
  args: {
    labelPosition: 'COLLAPSED',
    images: [
      { imageType: 'user' as const, user: { name: 'Jane Doe', initials: 'JD' } },
      { imageType: 'user' as const, user: { name: 'Bob Johnson', initials: 'BJ' } },
      { imageType: 'user' as const, user: { name: 'Alice Williams', initials: 'AW' } },
    ],
    style: 'AVATAR',
    size: 'TINY',
  },
}

export const UserDefaultIconFallback: Story = {
  args: {
    labelPosition: 'COLLAPSED',
    images: [
      { imageType: 'user' as const, user: { name: 'Anonymous User' } },
    ],
    style: 'AVATAR',
    size: 'SMALL',
  },
}

// --- Issue #113: Custom background colors for avatar fallback ---

export const UserInitialsWithColors: Story = {
  name: 'Avatar with SAIL Color Backgrounds',
  args: {
    label: 'Team Members',
    images: [
      { imageType: 'user' as const, user: { name: 'Jane Doe', initials: 'JD' }, backgroundColor: 'ACCENT' },
      { imageType: 'user' as const, user: { name: 'Bob Johnson', initials: 'BJ' }, backgroundColor: 'POSITIVE' },
      { imageType: 'user' as const, user: { name: 'Alice Williams', initials: 'AW' }, backgroundColor: 'NEGATIVE' },
      { imageType: 'user' as const, user: { name: 'Tom Chen', initials: 'TC' }, backgroundColor: 'TEAL_200' },
      { imageType: 'user' as const, user: { name: 'Sarah Park', initials: 'SP' }, backgroundColor: 'PURPLE_200' },
      { imageType: 'user' as const, user: { name: 'Mike Lee', initials: 'ML' }, backgroundColor: '#E8A87C' },
    ],
    style: 'AVATAR',
    size: 'TINY',
  },
}

// --- Issue #121: WebImage support ---

export const WebImage: Story = {
  name: 'Web Image (External URL)',
  args: {
    label: 'External Images',
    instructions: 'Images loaded from external URLs using a!webImage()',
    images: [
      {
        source: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&h=300&fit=crop',
        altText: 'Mountain landscape',
        caption: 'Beautiful mountain view',
      },
      {
        source: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop',
        altText: 'Nature scene',
        caption: 'Peaceful nature',
      },
    ],
    size: 'MEDIUM_PLUS',
  },
}

export const WebImageAvatar: Story = {
  name: 'Web Image as Avatar',
  args: {
    labelPosition: 'COLLAPSED',
    images: [
      {
        source: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face',
        altText: 'User avatar from web',
      },
    ],
    style: 'AVATAR',
    size: 'SMALL_PLUS',
  },
}

// --- Issue #126: Shape/borderRadius prop ---

export const ShapeSquared: Story = {
  name: 'Shape: SQUARED',
  args: {
    label: 'Squared Images',
    images: [
      { document: 'images/case-management-studio.webp', altText: 'Case management' },
      { document: 'images/process-modeler.webp', altText: 'Process modeler' },
    ],
    size: 'MEDIUM',
    shape: 'SQUARED',
  },
}

export const ShapeRounded: Story = {
  name: 'Shape: ROUNDED',
  args: {
    label: 'Rounded Images',
    images: [
      { document: 'images/case-management-studio.webp', altText: 'Case management' },
      { document: 'images/process-modeler.webp', altText: 'Process modeler' },
    ],
    size: 'MEDIUM',
    shape: 'ROUNDED',
  },
}

export const ShapeCircle: Story = {
  name: 'Shape: CIRCLE',
  args: {
    label: 'Circle Images',
    instructions: 'Circular crop without using avatar style',
    images: [
      { document: 'images/case-management-studio.webp', altText: 'Case management' },
      { document: 'images/process-modeler.webp', altText: 'Process modeler' },
    ],
    size: 'SMALL_PLUS',
    shape: 'CIRCLE',
  },
}
