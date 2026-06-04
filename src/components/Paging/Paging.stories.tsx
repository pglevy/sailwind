import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { useState } from 'react'
import { Paging } from './Paging'

const meta = {
  title: 'Components/Paging',
  component: Paging,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    pagingControls: {
      control: 'select',
      options: ['STANDARD', 'ROW_COUNT'],
    },
  },
} satisfies Meta<typeof Paging>

export default meta
type Story = StoryObj<typeof meta>

export const Standard: Story = {
  args: {
    totalCount: 50,
    pageSize: 10,
    currentPage: 1,
    pagingControls: 'STANDARD',
    onPageChange: fn(),
  },
  render: (args) => {
    const [currentPage, setCurrentPage] = useState(args.currentPage)
    return (
      <Paging
        {...args}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    )
  },
}

export const RowCount: Story = {
  args: {
    totalCount: 50,
    pageSize: 10,
    currentPage: 1,
    pagingControls: 'ROW_COUNT',
    onPageChange: fn(),
  },
  render: (args) => {
    const [currentPage, setCurrentPage] = useState(args.currentPage)
    return (
      <Paging
        {...args}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    )
  },
}

export const TwoPages: Story = {
  args: {
    totalCount: 15,
    pageSize: 10,
    currentPage: 1,
    pagingControls: 'ROW_COUNT',
    onPageChange: fn(),
  },
  render: (args) => {
    const [currentPage, setCurrentPage] = useState(args.currentPage)
    return (
      <Paging
        {...args}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    )
  },
}
