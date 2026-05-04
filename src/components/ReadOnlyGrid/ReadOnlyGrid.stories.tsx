import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'
import { ReadOnlyGrid } from './ReadOnlyGrid'
import { GridColumn } from './GridColumn'

const employees = [
  { id: 1, name: "Alice Johnson", department: "Engineering", salary: 95000, startDate: "2020-03-15" },
  { id: 2, name: "Bob Smith", department: "Marketing", salary: 72000, startDate: "2019-07-22" },
  { id: 3, name: "Charlie Brown", department: "Engineering", salary: 88000, startDate: "2021-01-10" },
  { id: 4, name: "Diana Prince", department: "Design", salary: 82000, startDate: "2020-11-05" },
  { id: 5, name: "Eve Wilson", department: "Marketing", salary: 68000, startDate: "2022-02-28" },
  { id: 6, name: "Frank Miller", department: "Engineering", salary: 105000, startDate: "2018-06-01" },
  { id: 7, name: "Grace Lee", department: "Design", salary: 78000, startDate: "2021-09-14" },
  { id: 8, name: "Henry Davis", department: "Engineering", salary: 92000, startDate: "2019-12-03" },
  { id: 9, name: "Iris Chen", department: "Marketing", salary: 75000, startDate: "2022-05-20" },
  { id: 10, name: "Jack Taylor", department: "Design", salary: 85000, startDate: "2020-08-17" },
  { id: 11, name: "Kate Adams", department: "Engineering", salary: 98000, startDate: "2019-04-11" },
  { id: 12, name: "Leo Martinez", department: "Marketing", salary: 71000, startDate: "2021-07-30" },
]

const meta = {
  title: 'Components/ReadOnlyGrid',
  component: ReadOnlyGrid,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    borderStyle: { control: 'select', options: ['STANDARD', 'LIGHT'] },
    spacing: { control: 'select', options: ['STANDARD', 'DENSE'] },
    height: { control: 'select', options: ['SHORT', 'SHORT_PLUS', 'MEDIUM', 'MEDIUM_PLUS', 'TALL', 'TALL_PLUS', 'EXTRA_TALL', 'AUTO'] },
    selectionStyle: { control: 'select', options: ['CHECKBOX', 'ROW_HIGHLIGHT', 'CHECKBOX_SUBTLE_HIGHLIGHT', 'SUBTLE_HIGHLIGHT'] },
    pagingControls: { control: 'select', options: ['STANDARD', 'ROW_COUNT'] },
    labelPosition: { control: 'select', options: ['ABOVE', 'ADJACENT', 'COLLAPSED', 'JUSTIFIED'] },
    marginAbove: { control: 'select', options: ['NONE', 'EVEN_LESS', 'LESS', 'STANDARD', 'MORE', 'EVEN_MORE'] },
    marginBelow: { control: 'select', options: ['NONE', 'EVEN_LESS', 'LESS', 'STANDARD', 'MORE', 'EVEN_MORE'] },
  },
} satisfies Meta<typeof ReadOnlyGrid>

export default meta
type Story = StoryObj<typeof meta>

/** 1. Default — Basic grid with employee data */
export const Default: Story = {
  args: {
    data: employees.slice(0, 5),
    borderStyle: 'LIGHT',
  },
  render: (args) => (
    <ReadOnlyGrid {...args}>
      <GridColumn label="Name" value="name" sortField="name" />
      <GridColumn label="Department" value="department" />
      <GridColumn label="Salary" value="salary" sortField="salary" />
      <GridColumn label="Start Date" value="startDate" />
    </ReadOnlyGrid>
  ),
}

/** 2. EmptyState — Empty data with custom message */
export const EmptyState: Story = {
  args: {
    data: [],
    emptyGridMessage: 'No employees found matching your criteria.',
  },
  render: (args) => (
    <ReadOnlyGrid {...args}>
      <GridColumn label="Name" value="name" />
      <GridColumn label="Department" value="department" />
      <GridColumn label="Salary" value="salary" />
    </ReadOnlyGrid>
  ),
}

/** 3. WithPagingStandard — Default STANDARD paging ("of many", no first/last buttons) */
export const WithPagingStandard: Story = {
  args: {
    data: employees,
    pageSize: 5,
    pagingControls: 'STANDARD',
  },
  render: (args) => (
    <ReadOnlyGrid {...args}>
      <GridColumn label="Name" value="name" sortField="name" />
      <GridColumn label="Department" value="department" sortField="department" />
      <GridColumn label="Salary" value="salary" sortField="salary" />
      <GridColumn label="Start Date" value="startDate" />
    </ReadOnlyGrid>
  ),
}

/** 4. WithPagingRowCount — ROW_COUNT paging (shows total count + first/last buttons) */
export const WithPagingRowCount: Story = {
  args: {
    data: employees,
    pageSize: 5,
    pagingControls: 'ROW_COUNT',
  },
  render: (args) => (
    <ReadOnlyGrid {...args}>
      <GridColumn label="Name" value="name" sortField="name" />
      <GridColumn label="Department" value="department" sortField="department" />
      <GridColumn label="Salary" value="salary" sortField="salary" />
      <GridColumn label="Start Date" value="startDate" />
    </ReadOnlyGrid>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Alice Johnson')).toBeVisible()
    const nextButton = canvas.getByRole('button', { name: /next page/i })
    await userEvent.click(nextButton)
    await expect(canvas.getByText('Frank Miller')).toBeVisible()
  },
}

/** 5. WithSorting — Sortable columns with initial sort on salary descending */
export const WithSorting: Story = {
  args: {
    data: employees,
    pageSize: 6,
    initialSorts: [{ field: "salary", ascending: false }],
  },
  render: (args) => (
    <ReadOnlyGrid {...args}>
      <GridColumn label="Name" value="name" sortField="name" />
      <GridColumn label="Department" value="department" sortField="department" />
      <GridColumn label="Salary" value="salary" sortField="salary" />
      <GridColumn label="Start Date" value="startDate" sortField="startDate" />
    </ReadOnlyGrid>
  ),
}

/** 6. WithCheckboxSelection — CHECKBOX selection style (default) */
export const WithCheckboxSelection: Story = {
  args: {
    data: employees.slice(0, 6),
    selectable: true,
    selectionStyle: 'CHECKBOX',
  },
  render: (args) => {
    const [selected, setSelected] = React.useState<(string | number)[]>([])
    return (
      <ReadOnlyGrid {...args} selectionValue={selected} selectionSaveInto={setSelected}>
        <GridColumn label="Name" value="name" />
        <GridColumn label="Department" value="department" />
        <GridColumn label="Salary" value="salary" />
      </ReadOnlyGrid>
    )
  },
}

/** 7. WithCheckboxSubtleHighlightSelection — CHECKBOX_SUBTLE_HIGHLIGHT selection style (26.3) */
export const WithCheckboxSubtleHighlightSelection: Story = {
  args: {
    data: employees.slice(0, 6),
    selectable: true,
    selectionStyle: 'CHECKBOX_SUBTLE_HIGHLIGHT',
  },
  render: (args) => {
    const [selected, setSelected] = React.useState<(string | number)[]>([1, 3])
    return (
      <ReadOnlyGrid {...args} selectionValue={selected} selectionSaveInto={setSelected}>
        <GridColumn label="Name" value="name" />
        <GridColumn label="Department" value="department" />
        <GridColumn label="Salary" value="salary" />
      </ReadOnlyGrid>
    )
  },
}

/** 8. WithSubtleHighlightSelection — SUBTLE_HIGHLIGHT selection style (26.3) */
export const WithSubtleHighlightSelection: Story = {
  args: {
    data: employees.slice(0, 6),
    selectable: true,
    selectionStyle: 'SUBTLE_HIGHLIGHT',
  },
  render: (args) => {
    const [selected, setSelected] = React.useState<(string | number)[]>([2, 4])
    return (
      <ReadOnlyGrid {...args} selectionValue={selected} selectionSaveInto={setSelected}>
        <GridColumn label="Name" value="name" />
        <GridColumn label="Department" value="department" />
        <GridColumn label="Salary" value="salary" />
      </ReadOnlyGrid>
    )
  },
}

/** 9. WithRowHighlightSelection — ROW_HIGHLIGHT selection style */
export const WithRowHighlightSelection: Story = {
  args: {
    data: employees.slice(0, 6),
    selectable: true,
    selectionStyle: 'ROW_HIGHLIGHT',
  },
  render: (args) => {
    const [selected, setSelected] = React.useState<(string | number)[]>([])
    return (
      <ReadOnlyGrid {...args} selectionValue={selected} selectionSaveInto={setSelected}>
        <GridColumn label="Name" value="name" />
        <GridColumn label="Department" value="department" />
        <GridColumn label="Salary" value="salary" />
      </ReadOnlyGrid>
    )
  },
}

/** 10. StyledGrid — borderStyle, shadeAlternateRows, dense spacing */
export const StyledGrid: Story = {
  args: {
    data: employees.slice(0, 8),
    borderStyle: 'STANDARD',
    shadeAlternateRows: true,
    spacing: 'DENSE',
  },
  render: (args) => (
    <ReadOnlyGrid {...args}>
      <GridColumn label="Name" value="name" />
      <GridColumn label="Department" value="department" />
      <GridColumn label="Salary" value="salary" />
      <GridColumn label="Start Date" value="startDate" />
    </ReadOnlyGrid>
  ),
}

/** 11. FixedHeight — MEDIUM height to show scrolling behavior */
export const FixedHeight: Story = {
  args: {
    data: employees,
    height: 'MEDIUM',
  },
  render: (args) => (
    <ReadOnlyGrid {...args}>
      <GridColumn label="Name" value="name" />
      <GridColumn label="Department" value="department" />
      <GridColumn label="Salary" value="salary" />
      <GridColumn label="Start Date" value="startDate" />
    </ReadOnlyGrid>
  ),
}

/** 12. WithLabelAndValidations — label, instructions, validations, helpTooltip */
export const WithLabelAndValidations: Story = {
  args: {
    label: 'Employee Directory',
    instructions: 'Review the employee list below. Contact HR for updates.',
    helpTooltip: 'This grid shows all active employees.',
    validations: ['Please select at least one employee.', 'Salary data may be outdated.'],
    data: employees.slice(0, 4),
  },
  render: (args) => (
    <ReadOnlyGrid {...args}>
      <GridColumn label="Name" value="name" />
      <GridColumn label="Department" value="department" />
      <GridColumn label="Salary" value="salary" />
    </ReadOnlyGrid>
  ),
}

/** 13. ColumnWidthsAndAlignment — Various column widths and alignments */
export const ColumnWidthsAndAlignment: Story = {
  args: {
    data: employees.slice(0, 5),
  },
  render: (args) => (
    <ReadOnlyGrid {...args}>
      <GridColumn label="ID" value="id" width="ICON_PLUS" align="CENTER" />
      <GridColumn label="Name" value="name" width="WIDE" align="START" />
      <GridColumn label="Department" value="department" width="MEDIUM" align="CENTER" />
      <GridColumn label="Salary" value="salary" width="NARROW_PLUS" align="END" />
    </ReadOnlyGrid>
  ),
}

/** 14. ComputedColumns — Using function value accessors for computed columns */
export const ComputedColumns: Story = {
  args: {
    data: employees.slice(0, 6),
  },
  render: (args) => (
    <ReadOnlyGrid {...args}>
      <GridColumn label="Name" value="name" />
      <GridColumn
        label="Formatted Salary"
        value={(row: any) => `${row.salary.toLocaleString()}`}
        align="END"
      />
      <GridColumn
        label="Tenure"
        value={(row: any) => {
          const years = new Date().getFullYear() - new Date(row.startDate).getFullYear()
          return `${years} yr${years !== 1 ? 's' : ''}`
        }}
        align="CENTER"
      />
      <GridColumn
        label="Senior?"
        value={(row: any) => (row.salary >= 90000 ? '✅ Yes' : '—')}
        align="CENTER"
      />
    </ReadOnlyGrid>
  ),
}
