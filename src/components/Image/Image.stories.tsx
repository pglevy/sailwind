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
