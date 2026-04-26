import type { Meta, StoryObj } from '@storybook/react-vite'
import { RecordView } from './RecordView'
import type { RecordAction, RecordViewProps } from './RecordView'
import type { SiteNavPage } from '../SiteNav'
import {
  Home,
  List,
  Inbox,
  FolderOpen,
  BarChart3,
  Search,
  MessagesSquare,
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { CardLayout } from '../Card/CardLayout'
import { HeadingField } from '../Heading/HeadingField'
import { RichTextDisplayField } from '../RichText/RichTextDisplayField'
import { TextItem } from '../RichText/TextItem'

/** Shared render function that wires up stateful view switching */
const InteractiveRender = (args: RecordViewProps) => {
  const [viewIndex, setViewIndex] = useState(args.selectedViewIndex ?? 0)

  useEffect(() => {
    setViewIndex(args.selectedViewIndex ?? 0)
  }, [args.selectedViewIndex])

  return (
    <RecordView {...args} selectedViewIndex={viewIndex} onViewChange={setViewIndex} />
  )
}

const meta = {
  title: 'Templates/RecordView',
  component: RecordView,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  render: InteractiveRender,
} satisfies Meta<typeof RecordView>

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

const recordActions: RecordAction[] = [
  { label: 'EDIT' },
  { label: 'APPROVE' },
  { label: 'EXPORT' },
  { label: 'Archive' },
  { label: 'Delete' },
]

const recordViews = [
  { label: 'Summary', content: (
    <div className="p-6">
      <CardLayout padding="STANDARD">
        <HeadingField text="Overview" size="MEDIUM" marginBelow="LESS" fontWeight="SEMI_BOLD" />
        <RichTextDisplayField value={["This is the summary view content."]} />
      </CardLayout>
    </div>
  )},
  { label: 'Details', content: (
    <div className="p-6">
      <CardLayout padding="STANDARD">
        <HeadingField text="Record Details" size="MEDIUM" marginBelow="LESS" fontWeight="SEMI_BOLD" />
        <RichTextDisplayField value={["This is the details view content."]} />
      </CardLayout>
    </div>
  )},
  { label: 'Activity', content: (
    <div className="p-6">
      <RichTextDisplayField value={[<TextItem key="activity" text="No recent activity." color="SECONDARY" />]} />
    </div>
  )},
  { label: 'Documents' },
  { label: 'History' },
]

export const Default: Story = {
  args: {
    displayName: 'My Application',
    pages: sitePages,
    recordTitle: 'REC-001 | Sample Record',
    recordActions,
    views: recordViews,
    userName: 'Jane Doe',
    selectedViewIndex: 0,
  },
}

export const CollapsedNav: Story = {
  args: {
    ...Default.args,
    collapsed: true,
  },
}

export const MinimalRecord: Story = {
  args: {
    displayName: 'My Application',
    pages: [{ label: 'Home', icon: Home, isSelected: true }],
    recordTitle: 'Case #12345',
    recordActions: [{ label: 'EDIT' }],
    views: [{ label: 'Summary' }, { label: 'History' }],
    userName: 'Alex Brown',
    selectedViewIndex: 0,
  },
}

export const NoActions: Story = {
  args: {
    displayName: 'My Application',
    pages: sitePages,
    recordTitle: 'Read-Only Record',
    recordActions: [],
    views: [{ label: 'Summary' }, { label: 'Details' }],
    userName: 'Jane Doe',
    selectedViewIndex: 0,
  },
}

export const ManyActions: Story = {
  args: {
    displayName: 'My Application',
    pages: sitePages,
    recordTitle: 'REC-002 | Record With Many Actions',
    recordActions: [
      { label: 'UPDATE' },
      { label: 'CREATE DOCUMENT' },
      { label: 'UPLOAD DOCUMENTS' },
      { label: 'Submit for Review' },
      { label: 'Submit to Contracting' },
      { label: 'Mark Inactive' },
      { label: 'Copy Record' },
    ],
    views: recordViews,
    userName: 'Jane Doe',
    selectedViewIndex: 0,
  },
}
