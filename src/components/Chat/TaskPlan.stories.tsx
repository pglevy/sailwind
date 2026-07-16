import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { TaskPlan } from './TaskPlan'
import type { TaskPlanItem } from './TaskPlan'
import { ButtonWidget } from '../Button/ButtonWidget'

const meta = {
  title: 'Components/Chat/TaskPlan',
  component: TaskPlan,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof TaskPlan>

export default meta
type Story = StoryObj<typeof meta>

const sampleTasks: TaskPlanItem[] = [
  {
    id: '1',
    taskName: 'Create Group for Independence Team',
    objectType: 'group',
    objectName: 'RSM Independence Team',
    notes:
      'Create a group to represent Independence Team members. Use this group for assigning read-only access and role-based visibility. Add the group as a member of the application\'s viewers group.',
  },
  {
    id: '2',
    taskName: 'Update Submissions record type with user filters and search',
    objectType: 'recordType',
    objectName: 'RSM Board Committee Submission',
    notes:
      'Update the submission record type to support user filters and search on partner name, submission date, and organization name to enable efficient querying in dashboards and record lists.',
  },
  {
    id: '3',
    taskName: 'Create Independence Team Dashboard Interface',
    objectType: 'interface',
    objectName: 'RSM_BC_IndependenceTeamDashboard',
    notes:
      'Build a landing dashboard for Independence Team members with key KPIs (total submissions, active memberships, submissions this month, total partners), a filterable grid of recent submissions across all partners, navigation links, and an export-to-Excel option.',
  },
  {
    id: '4',
    taskName: 'Add Independence Team Dashboard Page to Site',
    objectType: 'site',
    objectName: 'Boards & Committees site',
    notes:
      'Add the Independence Team dashboard interface as a page in the site. Configure it as the default landing page and restrict visibility to Independence Team members only.',
  },
]

export const Default: Story = {
  args: {
    tasks: sampleTasks,
  },
}

export const Editing: Story = {
  args: {
    tasks: sampleTasks,
    editing: true,
    onTasksChange: () => {},
  },
}

export const SingleTask: Story = {
  args: {
    tasks: [sampleTasks[0]],
  },
}

export const InChatContext: Story = {
  render: function InChatContextRender() {
    const [editing, setEditing] = useState(false)
    const [tasks, setTasks] = useState<TaskPlanItem[]>(sampleTasks)

    return (
      <div className="max-w-2xl flex flex-col gap-4">
        <p className="text-sm text-gray-900">
          Here&apos;s the plan for adding the Independence Team dashboard.
          What do you think?
        </p>
        <TaskPlan
          tasks={tasks}
          editing={editing}
          onTasksChange={setTasks}
        />
        <div className="flex gap-2">
          {editing ? (
            <ButtonWidget
              label="Save changes"
              style="SOLID"
              color="ACCENT"
              size="SMALL"
              onClick={() => setEditing(false)}
            />
          ) : (
            <>
              <ButtonWidget
                label="Looks good, proceed"
                style="SOLID"
                color="ACCENT"
                size="SMALL"
                onClick={() => {}}
              />
              <ButtonWidget
                label="Edit plan"
                style="OUTLINE"
                color="SECONDARY"
                size="SMALL"
                onClick={() => setEditing(true)}
              />
            </>
          )}
        </div>
      </div>
    )
  },
  args: {
    tasks: sampleTasks,
  },
}
