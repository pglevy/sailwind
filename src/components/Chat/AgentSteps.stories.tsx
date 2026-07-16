import type { Meta, StoryObj } from '@storybook/react-vite'
import { AgentSteps } from './AgentSteps'
import type { AgentStep } from './AgentSteps'

const meta = {
  title: 'Components/Chat/AgentSteps',
  component: AgentSteps,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof AgentSteps>

export default meta
type Story = StoryObj<typeof meta>

const basicSteps: AgentStep[] = [
  {
    id: '1',
    title: 'Reading project configuration',
    subtitle: 'package.json, tsconfig.json',
    status: 'COMPLETED',
  },
  {
    id: '2',
    title: 'Analyzing component structure',
    subtitle: 'Identified 12 components across 3 directories',
    status: 'COMPLETED',
  },
  {
    id: '3',
    title: 'Creating feature branch',
    status: 'ACTIVE',
  },
  {
    id: '4',
    title: 'Generate new component files',
    status: 'PENDING',
  },
]

export const Default: Story = {
  args: {
    steps: basicSteps,
  },
}

export const AllStatuses: Story = {
  args: {
    steps: [
      { id: '1', title: 'Completed step', subtitle: 'Finished successfully', status: 'COMPLETED' },
      { id: '2', title: 'Active step', subtitle: 'Currently processing...', status: 'ACTIVE' },
      { id: '3', title: 'Pending step', subtitle: 'Waiting to start', status: 'PENDING' },
      { id: '4', title: 'Error step', subtitle: 'Build failed with 3 errors', status: 'ERROR' },
    ],
  },
}

export const WithCodePreview: Story = {
  args: {
    steps: [
      {
        id: '1',
        title: 'Created AgentSteps.tsx',
        subtitle: 'New component with timeline layout',
        status: 'COMPLETED',
        preview: {
          type: 'code',
          content: `export const AgentSteps: React.FC<AgentStepsProps> = ({
  steps,
  size = "STANDARD",
  className,
}) => {
  // ...
}`,
        },
      },
      {
        id: '2',
        title: 'Updated Chat/index.ts',
        subtitle: 'Added barrel export',
        status: 'COMPLETED',
      },
      {
        id: '3',
        title: 'Running type check',
        status: 'ACTIVE',
      },
    ],
  },
}

export const WithActions: Story = {
  args: {
    steps: [
      {
        id: '1',
        title: 'Modified ButtonWidget.tsx',
        subtitle: 'Added loading state support',
        status: 'COMPLETED',
        actions: [
          { label: 'Revert', icon: 'rotateCcw', style: 'GHOST' },
        ],
      },
      {
        id: '2',
        title: 'Modified TagField.tsx',
        subtitle: 'Updated color resolution logic',
        status: 'COMPLETED',
        actions: [
          { label: 'Revert', icon: 'rotateCcw', style: 'GHOST' },
        ],
      },
      {
        id: '3',
        title: 'Waiting for confirmation',
        status: 'PENDING',
      },
    ],
  },
}

export const WithError: Story = {
  args: {
    steps: [
      { id: '1', title: 'Read existing components', status: 'COMPLETED' },
      { id: '2', title: 'Generated migration script', status: 'COMPLETED' },
      { id: '3', title: 'Running database migration', subtitle: 'Connection refused: ECONNREFUSED 127.0.0.1:5432', status: 'ERROR' },
      { id: '4', title: 'Verify migration results', status: 'PENDING' },
    ],
  },
}

export const AllCompleted: Story = {
  args: {
    steps: [
      { id: '1', title: 'Read existing components', status: 'COMPLETED' },
      { id: '2', title: 'Analyzed dependencies', status: 'COMPLETED' },
      { id: '3', title: 'Created new component', status: 'COMPLETED' },
      { id: '4', title: 'Verified build passes', status: 'COMPLETED' },
    ],
  },
}

export const SmallSize: Story = {
  args: {
    steps: basicSteps,
    size: 'SMALL',
  },
}

export const LargeSize: Story = {
  args: {
    steps: basicSteps,
    size: 'LARGE',
  },
}
