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
    icon: 'file',
    title: 'Reading project configuration',
    subtitle: 'package.json, tsconfig.json',
    status: 'COMPLETED',
  },
  {
    id: '2',
    icon: 'database',
    title: 'Analyzing component structure',
    subtitle: 'Identified 12 components across 3 directories',
    status: 'COMPLETED',
  },
  {
    id: '3',
    icon: 'gitBranch',
    title: 'Creating feature branch',
    status: 'ACTIVE',
  },
  {
    id: '4',
    icon: 'plus',
    title: 'Generate new component files',
    status: 'PENDING',
  },
]

export const Default: Story = {
  args: {
    steps: basicSteps,
  },
}

export const WithCodePreview: Story = {
  args: {
    steps: [
      {
        id: '1',
        icon: 'file',
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
        icon: 'file',
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
        icon: 'file',
        title: 'Modified ButtonWidget.tsx',
        subtitle: 'Added loading state support',
        status: 'COMPLETED',
        actions: [
          { label: 'Revert', icon: 'rotateCcw', style: 'GHOST' },
        ],
      },
      {
        id: '2',
        icon: 'file',
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

export const AllCompleted: Story = {
  args: {
    steps: [
      { id: '1', icon: 'file', title: 'Read existing components', status: 'COMPLETED' },
      { id: '2', icon: 'database', title: 'Analyzed dependencies', status: 'COMPLETED' },
      { id: '3', icon: 'plus', title: 'Created new component', status: 'COMPLETED' },
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
