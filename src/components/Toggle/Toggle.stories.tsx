import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { ToggleField } from './ToggleField'

const meta = {
  title: 'Components/Toggle',
  component: ToggleField,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof ToggleField>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: 'Text Formatting',
    text: 'Bold',
    value: false,
    style: 'OUTLINE',
  },
  render: (args) => {
    const [value, setValue] = useState(args.value)
    return <ToggleField {...args} value={value} saveInto={setValue} />
  },
}

export const WithIcon: Story = {
  args: {
    label: 'Favorite',
    text: 'Add to Favorites',
    icon: 'star',
    value: true,
    color: 'ACCENT',
  },
  render: (args) => {
    const [value, setValue] = useState(args.value)
    return <ToggleField {...args} value={value} saveInto={setValue} />
  },
}

export const StyleSolid: Story = {
  args: {
    label: 'SOLID Style',
    text: 'Toggle Me',
    value: false,
    style: 'SOLID',
    color: 'ACCENT',
  },
  render: (args) => {
    const [value, setValue] = useState(args.value)
    return <ToggleField {...args} value={value} saveInto={setValue} />
  },
}

export const StyleOutline: Story = {
  args: {
    label: 'OUTLINE Style',
    text: 'Toggle Me',
    value: false,
    style: 'OUTLINE',
    color: 'ACCENT',
  },
  render: (args) => {
    const [value, setValue] = useState(args.value)
    return <ToggleField {...args} value={value} saveInto={setValue} />
  },
}

export const StyleGhost: Story = {
  args: {
    label: 'GHOST Style',
    text: 'Toggle Me',
    value: false,
    style: 'GHOST',
    color: 'ACCENT',
  },
  render: (args) => {
    const [value, setValue] = useState(args.value)
    return <ToggleField {...args} value={value} saveInto={setValue} />
  },
}

export const IconAtStart: Story = {
  args: {
    label: 'Icon at START',
    text: 'Filter',
    icon: 'filter',
    iconPosition: 'START',
    value: false,
    style: 'OUTLINE',
  },
  render: (args) => {
    const [value, setValue] = useState(args.value)
    return <ToggleField {...args} value={value} saveInto={setValue} />
  },
}

export const IconAtEnd: Story = {
  args: {
    label: 'Icon at END',
    text: 'Search',
    icon: 'arrow-right',
    iconPosition: 'END',
    value: false,
    style: 'OUTLINE',
  },
  render: (args) => {
    const [value, setValue] = useState(args.value)
    return <ToggleField {...args} value={value} saveInto={setValue} />
  },
}

export const ColorAccent: Story = {
  args: {
    label: 'ACCENT',
    text: 'Accent Color',
    value: false,
    color: 'ACCENT',
    style: 'OUTLINE',
  },
  render: (args) => {
    const [value, setValue] = useState(args.value)
    return <ToggleField {...args} value={value} saveInto={setValue} />
  },
}

export const ColorPositive: Story = {
  args: {
    label: 'POSITIVE',
    text: 'Positive Color',
    value: false,
    color: 'POSITIVE',
    style: 'OUTLINE',
  },
  render: (args) => {
    const [value, setValue] = useState(args.value)
    return <ToggleField {...args} value={value} saveInto={setValue} />
  },
}

export const ColorNegative: Story = {
  args: {
    label: 'NEGATIVE',
    text: 'Negative Color',
    value: false,
    color: 'NEGATIVE',
    style: 'OUTLINE',
  },
  render: (args) => {
    const [value, setValue] = useState(args.value)
    return <ToggleField {...args} value={value} saveInto={setValue} />
  },
}

export const ColorSecondary: Story = {
  args: {
    label: 'SECONDARY',
    text: 'Secondary Color',
    value: false,
    color: 'SECONDARY',
    style: 'OUTLINE',
  },
  render: (args) => {
    const [value, setValue] = useState(args.value)
    return <ToggleField {...args} value={value} saveInto={setValue} />
  },
}

export const Disabled: Story = {
  args: {
    label: 'Disabled Toggle',
    text: "Can't Click Me",
    value: true,
    disabled: true,
  },
}
