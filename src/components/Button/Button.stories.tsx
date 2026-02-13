import type { Meta, StoryObj } from '@storybook/react-vite'
import { ButtonWidget } from './ButtonWidget'
import { ButtonArrayLayout } from './ButtonArrayLayout'

const meta = {
  title: 'Components/Button',
  component: ButtonWidget,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof ButtonWidget>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: 'Submit',
    style: 'SOLID',
    color: 'ACCENT',
  },
}

export const SemanticColorsSolid: Story = {
  render: () => (
    <ButtonArrayLayout
      buttons={[
        { label: 'ACCENT', style: 'SOLID', color: 'ACCENT' },
        { label: 'POSITIVE', style: 'SOLID', color: 'POSITIVE' },
        { label: 'NEGATIVE', style: 'SOLID', color: 'NEGATIVE' },
        { label: 'SECONDARY', style: 'SOLID', color: 'SECONDARY' },
        { label: 'STANDARD', style: 'SOLID', color: 'STANDARD' },
      ]}
    />
  ),
}

export const SemanticColorsOutline: Story = {
  render: () => (
    <ButtonArrayLayout
      buttons={[
        { label: 'ACCENT', style: 'OUTLINE', color: 'ACCENT' },
        { label: 'POSITIVE', style: 'OUTLINE', color: 'POSITIVE' },
        { label: 'NEGATIVE', style: 'OUTLINE', color: 'NEGATIVE' },
        { label: 'SECONDARY', style: 'OUTLINE', color: 'SECONDARY' },
        { label: 'STANDARD', style: 'OUTLINE', color: 'STANDARD' },
      ]}
    />
  ),
}

export const ButtonStyles: Story = {
  render: () => (
    <ButtonArrayLayout
      buttons={[
        { label: 'SOLID', style: 'SOLID', color: 'ACCENT', size: 'STANDARD' },
        { label: 'OUTLINE', style: 'OUTLINE', color: 'ACCENT', size: 'STANDARD' },
        { label: 'GHOST', style: 'GHOST', color: 'ACCENT', size: 'STANDARD' },
        { label: 'LINK', style: 'LINK', color: 'ACCENT', size: 'STANDARD' },
      ]}
    />
  ),
}

export const ButtonSizes: Story = {
  render: () => (
    <ButtonArrayLayout
      buttons={[
        { label: 'Small', style: 'SOLID', color: 'ACCENT', size: 'SMALL' },
        { label: 'Standard', style: 'SOLID', color: 'ACCENT', size: 'STANDARD' },
        { label: 'Medium', style: 'SOLID', color: 'ACCENT', size: 'MEDIUM' },
        { label: 'Large', style: 'SOLID', color: 'ACCENT', size: 'LARGE' },
      ]}
    />
  ),
}

export const HexColorsSolid: Story = {
  render: () => (
    <ButtonArrayLayout
      buttons={[
        { label: 'Custom Purple', style: 'SOLID', color: '#8B5CF6' },
        { label: 'Custom Orange', style: 'SOLID', color: '#F97316' },
        { label: 'Custom Pink', style: 'SOLID', color: '#EC4899' },
      ]}
    />
  ),
}

export const HexColorsOutline: Story = {
  render: () => (
    <ButtonArrayLayout
      buttons={[
        { label: 'Custom Purple', style: 'OUTLINE', color: '#8B5CF6' },
        { label: 'Custom Orange', style: 'OUTLINE', color: '#F97316' },
        { label: 'Custom Pink', style: 'OUTLINE', color: '#EC4899' },
      ]}
    />
  ),
}

export const WithActions: Story = {
  render: () => (
    <ButtonArrayLayout
      buttons={[
        { label: 'Add Another', style: 'OUTLINE', color: 'ACCENT', icon: 'plus', tooltip: 'And another one', saveInto: () => alert('Add Another clicked') },
        { label: 'Delete', style: 'SOLID', color: 'NEGATIVE', saveInto: () => alert('Delete clicked') },
      ]}
    />
  ),
}

export const LinkStyle: Story = {
  args: {
    label: 'Cancel',
    style: 'LINK',
    color: 'ACCENT',
  },
}
