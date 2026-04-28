import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn, userEvent, within, expect, waitFor } from 'storybook/test'
import { ChatFeedback } from './ChatFeedback'

const feedbackOptions = {
  positive: [
    { id: 'accurate', label: 'Accurate information' },
    { id: 'helpful', label: 'Helpful response' },
    { id: 'clear', label: 'Clear and concise' },
    { id: 'complete', label: 'Complete answer' },
    { id: 'other', label: 'Other' },
  ],
  negative: [
    { id: 'incorrect', label: 'Incorrect information' },
    { id: 'incomplete', label: 'Incomplete answer' },
    { id: 'unclear', label: 'Unclear or confusing' },
    { id: 'irrelevant', label: 'Not relevant to my question' },
    { id: 'other', label: 'Other' },
  ],
}

const meta = {
  title: 'Components/Chat/ChatFeedback',
  component: ChatFeedback,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: {
    onFeedbackSubmit: fn(),
    feedbackOptions,
  },
} satisfies Meta<typeof ChatFeedback>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const AgentEvaluationVariant: Story = {
  args: {
    variant: 'AGENT_EVALUATION',
  },
}

export const DialogWithCustomization: Story = {
  args: {
    variant: 'AGENT_EVALUATION',
    showDetailsDialog: true,
    showCheckboxOptions: true,
    dialogConfig: {
      title: 'Provide feedback',
      description: 'Help us improve',
      placeholder: 'Please provide additional details...',
      submitText: 'Submit',
      cancelText: 'Cancel',
    },
  },
}

export const DefaultInteraction: Story = {
  tags: ['test-only', '!autodocs'],
  parameters: { chromatic: { disableSnapshot: true } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const body = within(document.body)

    const thumbsUpButton = canvas.getByLabelText('Helpful')
    await userEvent.click(thumbsUpButton)
    await body.findByRole('dialog')

    const dialogTitle = body.getByText('Feedback')
    await expect(dialogTitle).toBeInTheDocument()

    const accurateCheckbox = body.getByLabelText('Accurate information')
    await expect(accurateCheckbox).toBeInTheDocument()
    await userEvent.click(accurateCheckbox)
    await expect(accurateCheckbox).toBeChecked()

    const commentField = body.getByPlaceholderText('Enter your feedback...')
    await userEvent.type(commentField, 'Great response!')

    const submitButton = body.getByRole('button', { name: 'Submit' })
    await userEvent.click(submitButton)

    await waitFor(() => {
      expect(body.queryByRole('dialog')).not.toBeInTheDocument()
    })
  },
}

export const AgentEvaluationInteraction: Story = {
  args: {
    variant: 'AGENT_EVALUATION',
  },
  tags: ['test-only', '!autodocs'],
  parameters: { chromatic: { disableSnapshot: true } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const body = within(document.body)

    const thumbsDownButton = canvas.getByLabelText('Not helpful')
    await userEvent.click(thumbsDownButton)
    await body.findByRole('dialog')

    const incorrectCheckbox = body.getByLabelText('Incorrect information')
    await expect(incorrectCheckbox).toBeInTheDocument()

    const otherCheckbox = body.getByLabelText('Other')
    await userEvent.click(otherCheckbox)
    await expect(otherCheckbox).toBeChecked()

    const commentLabel = body.getByText(/Additional comments/)
    await expect(commentLabel).toBeInTheDocument()
    await expect(commentLabel.textContent).toContain('*')

    const submitButton = body.getByRole('button', { name: 'Submit' })
    await userEvent.click(submitButton)
    await expect(body.getByRole('dialog')).toBeInTheDocument()

    const commentField = body.getByPlaceholderText('Enter your feedback...')
    await userEvent.type(commentField, 'The information was outdated')

    await userEvent.click(submitButton)

    await waitFor(() => {
      expect(body.queryByRole('dialog')).not.toBeInTheDocument()
    })
  },
}
