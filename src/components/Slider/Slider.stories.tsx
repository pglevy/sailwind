import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { SliderField } from './SliderField'

const meta = {
  title: 'Components/Slider',
  component: SliderField,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof SliderField>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: 'Volume Level',
    instructions: 'Adjust the audio volume',
    value: 75,
    min: 0,
    max: 100,
    step: 1,
    showValue: true,
    formatValue: (val: number) => `${val}%`,
    color: 'ACCENT',
    size: 'STANDARD',
  },
  render: (args) => {
    const [value, setValue] = useState(args.value)
    return (
      <div style={{ width: 320 }}>
        <SliderField {...args} value={value} saveInto={(v) => setValue(v as number)} />
      </div>
    )
  },
}

export const SingleValuePositive: Story = {
  args: {
    label: 'Brightness',
    instructions: 'Control screen brightness',
    value: 50,
    min: 0,
    max: 100,
    step: 5,
    showValue: true,
    formatValue: (val: number) => `${val}%`,
    color: 'POSITIVE',
    size: 'MEDIUM',
  },
  render: (args) => {
    const [value, setValue] = useState(args.value)
    return (
      <div style={{ width: 320 }}>
        <SliderField {...args} value={value} saveInto={(v) => setValue(v as number)} />
      </div>
    )
  },
}

export const RangeSlider: Story = {
  args: {
    label: 'Price Range',
    instructions: 'Select your budget range',
    value: [25, 75],
    min: 0,
    max: 100,
    step: 1,
    showValue: true,
    formatValue: (val: number) => `$${val}`,
    color: 'ACCENT',
    size: 'STANDARD',
  },
  render: (args) => {
    const [value, setValue] = useState(args.value)
    return (
      <div style={{ width: 320 }}>
        <SliderField {...args} value={value} saveInto={(v) => setValue(v as number[])} />
      </div>
    )
  },
}

export const RangeSliderNegative: Story = {
  args: {
    label: 'Temperature Range',
    instructions: 'Set comfortable temperature range',
    value: [68, 72],
    min: 60,
    max: 80,
    step: 1,
    showValue: true,
    formatValue: (val: number) => `${val}°F`,
    color: 'NEGATIVE',
    size: 'STANDARD',
  },
  render: (args) => {
    const [value, setValue] = useState(args.value)
    return (
      <div style={{ width: 320 }}>
        <SliderField {...args} value={value} saveInto={(v) => setValue(v as number[])} />
      </div>
    )
  },
}

export const VerticalOrientation: Story = {
  args: {
    label: 'Vertical Volume',
    instructions: 'Vertical orientation example',
    value: 75,
    min: 0,
    max: 100,
    step: 1,
    showValue: true,
    formatValue: (val: number) => `${val}%`,
    color: 'ACCENT',
    size: 'STANDARD',
    orientation: 'VERTICAL',
  },
  render: (args) => {
    const [value, setValue] = useState(args.value)
    return <SliderField {...args} value={value} saveInto={(v) => setValue(v as number)} />
  },
}

export const SizeSmall: Story = {
  args: {
    label: 'Small Slider',
    value: 50,
    min: 0,
    max: 100,
    color: 'ACCENT',
    size: 'SMALL',
  },
  render: (args) => (
    <div style={{ width: 320 }}>
      <SliderField {...args} saveInto={() => {}} />
    </div>
  ),
}

export const SizeStandard: Story = {
  args: {
    label: 'Standard Slider',
    value: 50,
    min: 0,
    max: 100,
    color: 'ACCENT',
    size: 'STANDARD',
  },
  render: (args) => (
    <div style={{ width: 320 }}>
      <SliderField {...args} saveInto={() => {}} />
    </div>
  ),
}

export const SizeMedium: Story = {
  args: {
    label: 'Medium Slider',
    value: 50,
    min: 0,
    max: 100,
    color: 'ACCENT',
    size: 'MEDIUM',
  },
  render: (args) => (
    <div style={{ width: 320 }}>
      <SliderField {...args} saveInto={() => {}} />
    </div>
  ),
}

export const SizeLarge: Story = {
  args: {
    label: 'Large Slider',
    value: 50,
    min: 0,
    max: 100,
    color: 'ACCENT',
    size: 'LARGE',
  },
  render: (args) => (
    <div style={{ width: 320 }}>
      <SliderField {...args} saveInto={() => {}} />
    </div>
  ),
}

export const ColorAccent: Story = {
  args: {
    label: 'Accent Color',
    value: 50,
    min: 0,
    max: 100,
    color: 'ACCENT',
  },
  render: (args) => (
    <div style={{ width: 320 }}>
      <SliderField {...args} saveInto={() => {}} />
    </div>
  ),
}

export const ColorPositive: Story = {
  args: {
    label: 'Positive Color',
    value: 50,
    min: 0,
    max: 100,
    color: 'POSITIVE',
  },
  render: (args) => (
    <div style={{ width: 320 }}>
      <SliderField {...args} saveInto={() => {}} />
    </div>
  ),
}

export const ColorNegative: Story = {
  args: {
    label: 'Negative Color',
    value: 50,
    min: 0,
    max: 100,
    color: 'NEGATIVE',
  },
  render: (args) => (
    <div style={{ width: 320 }}>
      <SliderField {...args} saveInto={() => {}} />
    </div>
  ),
}

export const ColorCustomHex: Story = {
  args: {
    label: 'Custom Hex Color',
    value: 50,
    min: 0,
    max: 100,
    color: '#9333EA',
  },
  render: (args) => (
    <div style={{ width: 320 }}>
      <SliderField {...args} saveInto={() => {}} />
    </div>
  ),
}

export const Disabled: Story = {
  args: {
    label: 'Disabled Slider',
    value: 50,
    min: 0,
    max: 100,
    disabled: true,
    color: 'ACCENT',
  },
  render: (args) => (
    <div style={{ width: 320 }}>
      <SliderField {...args} saveInto={() => {}} />
    </div>
  ),
}
