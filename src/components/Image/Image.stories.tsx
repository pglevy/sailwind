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
      { document: 'vite.svg', altText: 'Vite logo', caption: 'Vite build tool logo' },
      { document: 'vite.svg', altText: 'Another Vite logo', caption: 'Second image example' },
    ],
    size: 'MEDIUM',
  },
}

export const SmallIcons: Story = {
  args: {
    label: 'Status Icons',
    images: [
      { document: 'vite.svg', altText: 'Status icon 1' },
      { document: 'vite.svg', altText: 'Status icon 2' },
      { document: 'vite.svg', altText: 'Status icon 3' },
    ],
    size: 'ICON_PLUS',
    align: 'START',
  },
}

export const AvatarStyle: Story = {
  args: {
    label: 'Team Members',
    images: [
      { document: 'vite.svg', altText: 'Team member 1', caption: 'John Doe' },
      { document: 'vite.svg', altText: 'Team member 2', caption: 'Jane Smith' },
      { document: 'vite.svg', altText: 'Team member 3', caption: 'Bob Johnson' },
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
      { document: 'vite.svg', altText: 'Gallery image 1' },
      { document: 'vite.svg', altText: 'Gallery image 2' },
      { document: 'vite.svg', altText: 'Gallery image 3' },
      { document: 'vite.svg', altText: 'Gallery image 4' },
    ],
    size: 'GALLERY',
    align: 'CENTER',
  },
}

export const FitSize: Story = {
  args: {
    label: 'Hero Images',
    images: [
      { document: 'vite.svg', altText: 'Hero image', caption: 'Main banner image' },
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
      { document: 'uifaces-human-avatar.jpg', altText: 'Profile picture', caption: 'User avatar' },
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
        user: { name: 'Jane Smith', photoUrl: 'uifaces-human-avatar.jpg', initials: 'JS' },
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
