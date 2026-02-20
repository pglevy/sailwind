import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
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
} satisfies Meta<typeof ReadOnlyGrid>

export default meta
type Story = StoryObj<typeof meta>

/** 1. Default — Basic grid with employee data */
export const Default: Story = {
  render: () => (
    <ReadOnlyGrid data={employees.slice(0, 5)} borderStyle='LIGHT'>
      <GridColumn label="Name" value="name" sortField="name" />
      <GridColumn label="Department" value="department" />
      <GridColumn label="Salary" value="salary" sortField="salary" />
      <GridColumn label="Start Date" value="startDate" />
    </ReadOnlyGrid>
  ),
}

/** 2. EmptyState — Empty data with custom message */
export const EmptyState: Story = {
  render: () => (
    <ReadOnlyGrid data={[]} emptyGridMessage="No employees found matching your criteria.">
      <GridColumn label="Name" value="name" />
      <GridColumn label="Department" value="department" />
      <GridColumn label="Salary" value="salary" />
    </ReadOnlyGrid>
  ),
}

/** 3. WithPaging — Full dataset with pageSize=5 showing paging controls */
export const WithPaging: Story = {
  render: () => (
    <ReadOnlyGrid data={employees} pageSize={5}>
      <GridColumn label="Name" value="name" sortField="name" />
      <GridColumn label="Department" value="department" sortField="department" />
      <GridColumn label="Salary" value="salary" sortField="salary" />
      <GridColumn label="Start Date" value="startDate" />
    </ReadOnlyGrid>
  ),
}

/** 4. WithSorting — Sortable columns with initial sort on salary descending */
export const WithSorting: Story = {
  render: () => (
    <ReadOnlyGrid
      data={employees}
      pageSize={6}
      initialSorts={[{ field: "salary", ascending: false }]}
    >
      <GridColumn label="Name" value="name" sortField="name" />
      <GridColumn label="Department" value="department" sortField="department" />
      <GridColumn label="Salary" value="salary" sortField="salary" />
      <GridColumn label="Start Date" value="startDate" sortField="startDate" />
    </ReadOnlyGrid>
  ),
}

/** 5. WithCheckboxSelection — Selectable grid with checkbox style */
export const WithCheckboxSelection: Story = {
  render: () => {
    const [selected, setSelected] = React.useState<(string | number)[]>([])
    return (
      <ReadOnlyGrid
        data={employees.slice(0, 6)}
        selectable
        selectionValue={selected}
        selectionSaveInto={setSelected}
      >
        <GridColumn label="Name" value="name" />
        <GridColumn label="Department" value="department" />
        <GridColumn label="Salary" value="salary" />
      </ReadOnlyGrid>
    )
  },
}

/** 6. WithRowHighlightSelection — ROW_HIGHLIGHT selection style */
export const WithRowHighlightSelection: Story = {
  render: () => {
    const [selected, setSelected] = React.useState<(string | number)[]>([])
    return (
      <ReadOnlyGrid
        data={employees.slice(0, 6)}
        selectable
        selectionStyle="ROW_HIGHLIGHT"
        selectionValue={selected}
        selectionSaveInto={setSelected}
      >
        <GridColumn label="Name" value="name" />
        <GridColumn label="Department" value="department" />
        <GridColumn label="Salary" value="salary" />
      </ReadOnlyGrid>
    )
  },
}

/** 7. StyledGrid — borderStyle, shadeAlternateRows, dense spacing */
export const StyledGrid: Story = {
  render: () => (
    <ReadOnlyGrid
      data={employees.slice(0, 8)}
      borderStyle="STANDARD"
      shadeAlternateRows
      spacing="DENSE"
    >
      <GridColumn label="Name" value="name" />
      <GridColumn label="Department" value="department" />
      <GridColumn label="Salary" value="salary" />
      <GridColumn label="Start Date" value="startDate" />
    </ReadOnlyGrid>
  ),
}

/** 8. FixedHeight — MEDIUM height to show scrolling behavior */
export const FixedHeight: Story = {
  render: () => (
    <ReadOnlyGrid data={employees} height="MEDIUM">
      <GridColumn label="Name" value="name" />
      <GridColumn label="Department" value="department" />
      <GridColumn label="Salary" value="salary" />
      <GridColumn label="Start Date" value="startDate" />
    </ReadOnlyGrid>
  ),
}

/** 9. WithLabelAndValidations — label, instructions, validations, helpTooltip */
export const WithLabelAndValidations: Story = {
  render: () => (
    <ReadOnlyGrid
      label="Employee Directory"
      instructions="Review the employee list below. Contact HR for updates."
      helpTooltip="This grid shows all active employees."
      validations={["Please select at least one employee.", "Salary data may be outdated."]}
      data={employees.slice(0, 4)}
    >
      <GridColumn label="Name" value="name" />
      <GridColumn label="Department" value="department" />
      <GridColumn label="Salary" value="salary" />
    </ReadOnlyGrid>
  ),
}

/** 10. ColumnWidthsAndAlignment — Various column widths and alignments */
export const ColumnWidthsAndAlignment: Story = {
  render: () => (
    <ReadOnlyGrid data={employees.slice(0, 5)}>
      <GridColumn label="ID" value="id" width="ICON_PLUS" align="CENTER" />
      <GridColumn label="Name" value="name" width="WIDE" align="START" />
      <GridColumn label="Department" value="department" width="MEDIUM" align="CENTER" />
      <GridColumn label="Salary" value="salary" width="NARROW_PLUS" align="END" />
    </ReadOnlyGrid>
  ),
}

/** 11. FunctionAccessor — Using function value accessors for computed columns */
export const FunctionAccessor: Story = {
  render: () => (
    <ReadOnlyGrid data={employees.slice(0, 6)}>
      <GridColumn label="Name" value="name" />
      <GridColumn
        label="Formatted Salary"
        value={(row: any) => `$${row.salary.toLocaleString()}`}
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
