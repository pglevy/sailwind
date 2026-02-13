import type { Meta, StoryObj } from '@storybook/react-vite'
import { HeadingField } from './HeadingField'

const meta = {
  title: 'Components/Heading',
  component: HeadingField,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: {
    text: 'Heading Text',
  },
} satisfies Meta<typeof HeadingField>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    text: 'Default Heading',
  },
}

export const Sizes: Story = {
  render: () => (
    <div className="space-y-2">
      <HeadingField text="LARGE_PLUS Heading" size="LARGE_PLUS" marginBelow="NONE" />
      <HeadingField text="LARGE Heading" size="LARGE" marginBelow="NONE" />
      <HeadingField text="MEDIUM_PLUS Heading" size="MEDIUM_PLUS" marginBelow="NONE" />
      <HeadingField text="MEDIUM Heading" size="MEDIUM" marginBelow="NONE" />
      <HeadingField text="SMALL Heading" size="SMALL" marginBelow="NONE" />
      <HeadingField text="EXTRA_SMALL Heading" size="EXTRA_SMALL" marginBelow="NONE" />
    </div>
  ),
}

export const SemanticColors: Story = {
  render: () => (
    <div className="space-y-2">
      <HeadingField text="ACCENT Color" color="ACCENT" marginBelow="NONE" />
      <HeadingField text="POSITIVE Color" color="POSITIVE" marginBelow="NONE" />
      <HeadingField text="NEGATIVE Color" color="NEGATIVE" marginBelow="NONE" />
      <HeadingField text="SECONDARY Color" color="SECONDARY" marginBelow="NONE" />
      <HeadingField text="STANDARD Color" color="STANDARD" marginBelow="NONE" />
    </div>
  ),
}

export const CustomHexColor: Story = {
  args: {
    text: 'Custom Hex Color',
    color: '#0a578a',
  },
}

export const FontWeights: Story = {
  render: () => (
    <div className="space-y-2">
      <HeadingField text="Light Weight" fontWeight="LIGHT" marginBelow="NONE" />
      <HeadingField text="Regular Weight" fontWeight="REGULAR" marginBelow="NONE" />
      <HeadingField text="Semi Bold Weight" fontWeight="SEMI_BOLD" marginBelow="NONE" />
      <HeadingField text="Bold Weight" fontWeight="BOLD" marginBelow="NONE" />
    </div>
  ),
}

export const Alignment: Story = {
  render: () => (
    <div className="space-y-2">
      <HeadingField text="Left Aligned (START)" align="START" marginBelow="NONE" />
      <HeadingField text="Center Aligned" align="CENTER" marginBelow="NONE" />
      <HeadingField text="Right Aligned" align="END" marginBelow="NONE" />
    </div>
  ),
}

export const HeadingTags: Story = {
  render: () => (
    <div className="space-y-2">
      <HeadingField text="H1 Tag" headingTag="H1" size="LARGE_PLUS" marginBelow="NONE" />
      <HeadingField text="H2 Tag" headingTag="H2" size="LARGE" marginBelow="NONE" />
      <HeadingField text="H3 Tag" headingTag="H3" size="MEDIUM_PLUS" marginBelow="NONE" />
      <HeadingField text="H4 Tag" headingTag="H4" size="MEDIUM" marginBelow="NONE" />
      <HeadingField text="H5 Tag" headingTag="H5" size="SMALL" marginBelow="NONE" />
      <HeadingField text="H6 Tag" headingTag="H6" size="EXTRA_SMALL" marginBelow="NONE" />
    </div>
  ),
}

export const WithLink: Story = {
  args: {
    text: 'Interactive Heading',
    size: 'MEDIUM',
    color: 'ACCENT',
    link: () => alert('Heading clicked!'),
  },
}
