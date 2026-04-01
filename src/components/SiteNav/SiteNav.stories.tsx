import type { Meta, StoryObj } from '@storybook/react-vite'
import { SiteNav } from './SiteNav'
import type { SiteNavPage } from './SiteNav'
import {
  Home,
  List,
  Inbox,
  FolderOpen,
  FileText,
  BarChart3,
  Search,
  MessagesSquare,
} from 'lucide-react'

const meta = {
  title: 'Components/SiteNav',
  component: SiteNav,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story) => (
      <div style={{ height: '100vh', display: 'flex' }}>
        <Story />
        <div style={{ flex: 1, background: '#f5f5f5', padding: '1rem' }}>
          <p style={{ color: '#666' }}>Page content area</p>
        </div>
      </div>
    ),
  ],
} satisfies Meta<typeof SiteNav>

export default meta
type Story = StoryObj<typeof meta>

const sitePages: SiteNavPage[] = [
  { label: 'Home', icon: Home },
  { label: 'Records', icon: List, isSelected: true },
  { label: 'Inbox', icon: Inbox, badge: '(3)' },
  {
    label: 'Directory',
    icon: FolderOpen,
    isGroup: true,
    children: [
      { label: 'People' },
      { label: 'Teams' },
    ],
  },
  { label: 'Reports', icon: BarChart3 },
  { label: 'Search', icon: Search },
  { label: 'Chat', icon: MessagesSquare },
]

export const Default: Story = {
  args: {
    displayName: 'My Application',
    pages: sitePages,
    userName: 'Jane Doe',
  },
}

export const Collapsed: Story = {
  args: {
    displayName: 'My Application',
    pages: sitePages,
    collapsed: true,
    userName: 'Jane Doe',
  },
}

export const WithGroupExpanded: Story = {
  args: {
    displayName: 'My Application',
    pages: [
      { label: 'Home', icon: Home },
      { label: 'Records', icon: List },
      {
        label: 'Directory',
        icon: FolderOpen,
        isGroup: true,
        children: [
          { label: 'People', isSelected: true },
          { label: 'Teams' },
        ],
      },
      { label: 'Reports', icon: BarChart3 },
    ],
    userName: 'Jane Doe',
  },
}

export const MinimalPages: Story = {
  args: {
    displayName: 'My Application',
    pages: [
      { label: 'Home', icon: Home, isSelected: true },
      { label: 'Documents', icon: FileText },
    ],
    userName: 'Alex Brown',
  },
}


export const Hidden: Story = {
  args: {
    displayName: 'My Application',
    pages: sitePages,
    showNavigation: false,
    userName: 'Jane Doe',
  },
}
