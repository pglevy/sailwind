import type { Meta, StoryObj } from '@storybook/react-vite'
import { RichTextDisplayField } from './RichTextDisplayField'
import { TextItem } from './TextItem'
import { Icon } from './Icon'

const meta = {
  title: 'Components/RichText',
  component: RichTextDisplayField,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof RichTextDisplayField>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    labelPosition: 'COLLAPSED',
    value: [
      <TextItem text="Hello, " style="PLAIN" />,
      <TextItem text="world!" style="STRONG" />,
    ],
  },
}

export const UserProfileWithIcons: Story = {
  render: () => (
    <RichTextDisplayField
      labelPosition="COLLAPSED"
      value={[
        <TextItem
          text={[<Icon icon="user" caption="Name" />, ' Xavier Jones']}
          size="MEDIUM"
          style="STRONG"
        />,
        '\n',
        <TextItem
          text={[<Icon icon="phone" caption="Phone" />, ' (555) 123-4567']}
          color="SECONDARY"
        />,
        '\n',
        <TextItem
          text={[<Icon icon="building" caption="Location" />, ' Reston, VA']}
          color="SECONDARY"
        />,
      ]}
    />
  ),
}


export const TextStyles: Story = {
  render: () => (
    <RichTextDisplayField
      labelPosition="COLLAPSED"
      value={[
        <TextItem text="Plain, " style="PLAIN" />,
        <TextItem text="Emphasis Small, " style="EMPHASIS" size="SMALL" />,
        <TextItem text="Underline Medium, " style="UNDERLINE" size="MEDIUM" />,
        <TextItem text="Strikethrough Medium_Plus, " style="STRIKETHROUGH" size="MEDIUM_PLUS" />,
        <TextItem text="Strong Large, " style="STRONG" size="LARGE" />,
        <TextItem text="Emphasis Large_Plus " style="EMPHASIS" size="LARGE_PLUS" />,
        <TextItem text="Strong Extra_Large" style="STRONG" size="EXTRA_LARGE" />,
      ]}
    />
  ),
}

export const InteractiveLinks: Story = {
  render: () => (
    <RichTextDisplayField
      value={[
        'In addition to a personal statement, candidates may submit up to three ',
        <TextItem
          text={[<Icon icon="image" />, ' Fine Art']}
          link={() => alert('Fine Art clicked!')}
        />,
        ', ',
        <TextItem
          text={[<Icon icon="headphones" />, ' Audio']}
          link={() => alert('Audio clicked!')}
        />,
        ', or ',
        <TextItem
          text={[<Icon icon="video" />, ' Video']}
          link={() => alert('Video clicked!')}
        />,
        ' media samples.',
      ]}
    />
  ),
}

export const StandaloneNavigationLinks: Story = {
  render: () => (
    <RichTextDisplayField
      value={[
        <TextItem
          text={[<Icon icon="home" />, ' Home']}
          link={() => alert('Home clicked!')}
          linkStyle="STANDALONE"
        />,
        '\n',
        <TextItem
          text={[<Icon icon="square-check" />, ' My Open Requests']}
          link={() => alert('Requests clicked!')}
          linkStyle="STANDALONE"
        />,
        '\n',
        <TextItem
          text={[<Icon icon="fileText" />, ' My Documents']}
          link={() => alert('Documents clicked!')}
          linkStyle="INLINE"
        />,
      ]}
    />
  ),
}

export const ColorVariations: Story = {
  render: () => (
    <RichTextDisplayField
      value={[
        <TextItem text="Semantic Colors: " />,
        <TextItem text="ACCENT " color="ACCENT" style="STRONG" />,
        <TextItem text="POSITIVE " color="POSITIVE" style="STRONG" />,
        <TextItem text="NEGATIVE " color="NEGATIVE" style="STRONG" />,
        <TextItem text="SECONDARY " color="SECONDARY" style="STRONG" />,
        '\n',
        <TextItem text="Custom Colors: " />,
        <TextItem text="Custom Red " color="#FF0000" style="STRONG" />,
        <TextItem text="Custom Blue " color="#0066CC" style="STRONG" />,
      ]}
    />
  ),
}

export const TextAlignment: Story = {
  render: () => (
    <div className="space-y-3">
      <RichTextDisplayField
        label="Left Aligned (Default)"
        align="LEFT"
        value={[<TextItem text="This text is aligned to the left" />]}
      />
      <RichTextDisplayField
        label="Center Aligned"
        align="CENTER"
        value={[<TextItem text="This text is centered" />]}
      />
      <RichTextDisplayField
        label="Right Aligned"
        align="RIGHT"
        value={[<TextItem text="This text is aligned to the right" />]}
      />
    </div>
  ),
}
