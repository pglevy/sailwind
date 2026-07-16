import type { Meta, StoryObj } from '@storybook/react-vite'
import { TaskProgress } from './TaskProgress'
import type { Task } from './TaskProgress'

const meta = {
  title: 'Components/Chat/TaskProgress',
  component: TaskProgress,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof TaskProgress>

export default meta
type Story = StoryObj<typeof meta>

const defaultTasks: Task[] = [
  { id: '1', label: 'Create loan application record type', status: 'COMPLETED' },
  { id: '2', label: 'Create document record type', status: 'COMPLETED' },
  { id: '3', label: 'Create brand selection interface', status: 'ACTIVE' },
  { id: '4', label: 'Build loan application form interface', status: 'TODO' },
  { id: '5', label: 'Create document upload component', status: 'TODO' },
]

export const Default: Story = {
  args: {
    title: 'Task Progress',
    tasks: defaultTasks,
    defaultOpen: true,
  },
}

export const Collapsed: Story = {
  args: {
    title: 'Task Progress',
    tasks: defaultTasks,
    defaultOpen: false,
  },
}

export const AllCompleted: Story = {
  args: {
    title: 'Completed Tasks',
    tasks: [
      { id: '1', label: 'Setup project structure', status: 'COMPLETED' },
      { id: '2', label: 'Install dependencies', status: 'COMPLETED' },
      { id: '3', label: 'Create components', status: 'COMPLETED' },
      { id: '4', label: 'Write documentation', status: 'COMPLETED' },
    ],
    defaultOpen: true,
  },
}

export const MostlyTodo: Story = {
  args: {
    title: 'Upcoming Tasks',
    tasks: [
      { id: '1', label: 'Setup project', status: 'COMPLETED' },
      { id: '2', label: 'Design components', status: 'ACTIVE' },
      { id: '3', label: 'Implement authentication', status: 'TODO' },
      { id: '4', label: 'Add database integration', status: 'TODO' },
      { id: '5', label: 'Write tests', status: 'TODO' },
      { id: '6', label: 'Deploy to production', status: 'TODO' },
    ],
    defaultOpen: true,
  },
}

export const CustomTitle: Story = {
  args: {
    title: 'Sprint 3 Progress',
    tasks: [
      { id: '1', label: 'User authentication module', status: 'COMPLETED' },
      { id: '2', label: 'Dashboard layout', status: 'COMPLETED' },
      { id: '3', label: 'API integration', status: 'ACTIVE' },
    ],
    defaultOpen: true,
  },
}
