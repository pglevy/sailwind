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
    startIndex: 1,
    endIndex: 10,
    totalCount: 50,
    currentPage: 1,
    totalPages: 5,
    pagingControls: 'STANDARD',
    onPageChange: fn(),
  },
  render: (args) => {
    const [currentPage, setCurrentPage] = useState(args.currentPage)
    const pageSize = args.endIndex - args.startIndex + 1
    const startIndex = (currentPage - 1) * pageSize + 1
    const endIndex = Math.min(currentPage * pageSize, args.totalCount)
    return (
      <Paging
        {...args}
        startIndex={startIndex}
        endIndex={endIndex}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    )
  },
}

export const RowCount: Story = {
  args: {
    startIndex: 1,
    endIndex: 10,
    totalCount: 50,
    currentPage: 1,
    totalPages: 5,
    pagingControls: 'ROW_COUNT',
    onPageChange: fn(),
  },
  render: (args) => {
    const [currentPage, setCurrentPage] = useState(args.currentPage)
    const pageSize = args.endIndex - args.startIndex + 1
    const startIndex = (currentPage - 1) * pageSize + 1
    const endIndex = Math.min(currentPage * pageSize, args.totalCount)
    return (
      <Paging
        {...args}
        startIndex={startIndex}
        endIndex={endIndex}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    )
  },
}

export const TwoPages: Story = {
  args: {
    startIndex: 1,
    endIndex: 10,
    totalCount: 15,
    currentPage: 1,
    totalPages: 2,
    pagingControls: 'ROW_COUNT',
    onPageChange: fn(),
  },
  render: (args) => {
    const [currentPage, setCurrentPage] = useState(args.currentPage)
    const pageSize = args.endIndex - args.startIndex + 1
    const startIndex = (currentPage - 1) * pageSize + 1
    const endIndex = Math.min(currentPage * pageSize, args.totalCount)
    return (
      <Paging
        {...args}
        startIndex={startIndex}
        endIndex={endIndex}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    )
  },
}
