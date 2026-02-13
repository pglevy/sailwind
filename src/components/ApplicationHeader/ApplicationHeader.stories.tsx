import type { Meta, StoryObj } from '@storybook/react-vite'
import { ApplicationHeader } from './ApplicationHeader'

const meta = {
  title: 'Components/ApplicationHeader',
  component: ApplicationHeader,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof ApplicationHeader>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    name: 'Sailwind Component Library',
    userInitials: 'PL',
    objectType: 'app',
  },
}

export const WithDesignerControls: Story = {
  args: {
    name: 'My Interface',
    userInitials: 'JD',
    objectType: 'interface',
    showDesignerControls: true,
    previewEnabled: false,
    showStoriesView: false,
    onPreviewToggle: (enabled: boolean) => console.log('Preview:', enabled),
    onStoryToggle: () => console.log('Stories toggled'),
    onBackClick: () => console.log('Back clicked'),
  },
}

export const RecordType: Story = {
  args: {
    name: 'Customer Records',
    userInitials: 'AB',
    objectType: 'record-type',
  },
}

export const ExpressionRule: Story = {
  args: {
    name: 'calculateTotal',
    userInitials: 'CD',
    objectType: 'expression-rule',
  },
}

export const PreviewEnabled: Story = {
  args: {
    name: 'My Interface',
    userInitials: 'JD',
    objectType: 'interface',
    showDesignerControls: true,
    previewEnabled: true,
    showStoriesView: false,
    onPreviewToggle: (enabled: boolean) => console.log('Preview:', enabled),
    onStoryToggle: () => console.log('Stories toggled'),
    onBackClick: () => console.log('Back clicked'),
  },
}

export const StoriesViewActive: Story = {
  args: {
    name: 'My Interface',
    userInitials: 'JD',
    objectType: 'interface',
    showDesignerControls: true,
    previewEnabled: false,
    showStoriesView: true,
    onPreviewToggle: (enabled: boolean) => console.log('Preview:', enabled),
    onStoryToggle: () => console.log('Stories toggled'),
    onBackClick: () => console.log('Back clicked'),
  },
}
