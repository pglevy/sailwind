import type { Meta, StoryObj } from "@storybook/react-vite";
import { userEvent, within, expect } from "storybook/test";
import { BoxLayout } from "./BoxLayout";
import { CardLayout } from "../Card/CardLayout";
import { HeadingField } from "../Heading/HeadingField";
import { RichTextDisplayField } from "../RichText/RichTextDisplayField";
import { TextItem } from "../RichText/TextItem";
import { DropdownField } from "../Dropdown/DropdownField";

const meta = {
  title: "Components/Box",
  component: BoxLayout,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  argTypes: {
    style: {
      control: "select",
      options: ["STANDARD", "ACCENT", "SUCCESS", "INFO", "WARN", "ERROR"],
    },
    shape: {
      control: "select",
      options: ["SQUARED", "SEMI_ROUNDED", "ROUNDED"],
    },
    padding: {
      control: "select",
      options: ["NONE", "EVEN_LESS", "LESS", "STANDARD", "MORE", "EVEN_MORE"],
    },
    labelSize: {
      control: "select",
      options: ["LARGE_PLUS", "LARGE", "MEDIUM_PLUS", "MEDIUM", "SMALL", "EXTRA_SMALL"],
    },
    labelFontWeight: {
      control: "select",
      options: ["LIGHT", "REGULAR", "SEMI_BOLD", "BOLD"],
    },
    borderWeight: {
      control: "select",
      options: ["THIN", "MEDIUM", "THICK"],
    },
    marginAbove: {
      control: "select",
      options: ["NONE", "EVEN_LESS", "LESS", "STANDARD", "MORE", "EVEN_MORE"],
    },
    marginBelow: {
      control: "select",
      options: ["NONE", "EVEN_LESS", "LESS", "STANDARD", "MORE", "EVEN_MORE"],
    },
  },
} satisfies Meta<typeof BoxLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Account Details",
    isCollapsible: true,
    isInitiallyCollapsed: true,
    children: (
      <p className="text-sm text-gray-700">
        This content is collapsed by default. Click the header to expand it.
      </p>
    ),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button", { name: /account details/i });
    await expect(button).toHaveAttribute("aria-expanded", "false");
    await userEvent.click(button);
    await expect(button).toHaveAttribute("aria-expanded", "true");
    await expect(
      canvas.getByText(/this content is collapsed by default/i)
    ).toBeVisible();
  },
};

export const BoxStyles: Story = {
  args: { children: null },
  render: () => (
    <div className="grid grid-cols-3 gap-4 w-[36rem]">
      <BoxLayout label="Standard" style="STANDARD" padding="STANDARD">
        <p className="text-sm text-gray-700">Default style.</p>
      </BoxLayout>
      <BoxLayout label="Accent" style="ACCENT" padding="STANDARD">
        <p className="text-sm text-gray-700">Accent style.</p>
      </BoxLayout>
      <BoxLayout label="Success" style="SUCCESS" padding="STANDARD">
        <p className="text-sm text-gray-700">Success style.</p>
      </BoxLayout>
      <BoxLayout label="Info" style="INFO" padding="STANDARD">
        <p className="text-sm text-gray-700">
          Info style — border and label color follow the header by default.
        </p>
      </BoxLayout>
      <BoxLayout label="Warn" style="WARN" padding="STANDARD">
        <p className="text-sm text-gray-700">Warn style.</p>
      </BoxLayout>
      <BoxLayout label="Error" style="ERROR" padding="STANDARD">
        <p className="text-sm text-gray-700">
          Error style — border and label color follow the header by default.
        </p>
      </BoxLayout>
    </div>
  ),
};

export const Shapes: Story = {
  args: { children: null },
  render: () => (
    <div className="grid grid-cols-3 gap-4 w-[36rem]">
      <BoxLayout label="Squared" shape="SQUARED" padding="STANDARD">
        <p className="text-xs text-gray-700">0 radius</p>
      </BoxLayout>
      <BoxLayout label="Semi Rounded" shape="SEMI_ROUNDED" padding="STANDARD">
        <p className="text-xs text-gray-700">4px radius</p>
      </BoxLayout>
      <BoxLayout label="Rounded" shape="ROUNDED" padding="STANDARD">
        <p className="text-xs text-gray-700">8px radius</p>
      </BoxLayout>
    </div>
  ),
};

export const BorderVisibility: Story = {
  args: { children: null },
  render: () => (
    <div className="grid grid-cols-2 gap-4 w-80">
      <BoxLayout label="With Border" showBorder={true} padding="STANDARD">
        <p className="text-xs text-gray-700">showBorder=true</p>
      </BoxLayout>
      <BoxLayout label="No Border" showBorder={false} padding="STANDARD">
        <p className="text-xs text-gray-700">showBorder=false</p>
      </BoxLayout>
    </div>
  ),
};

export const ShadowVisibility: Story = {
  args: { children: null },
  render: () => (
    <div className="grid grid-cols-2 gap-4 w-80">
      <BoxLayout label="Shadow On" showShadow={true} padding="STANDARD">
        <p className="text-xs text-gray-700">showShadow=true</p>
      </BoxLayout>
      <BoxLayout label="Shadow Off" showShadow={false} padding="STANDARD">
        <p className="text-xs text-gray-700">showShadow=false</p>
      </BoxLayout>
    </div>
  ),
};

export const LabelSizes: Story = {
  args: { children: null },
  render: () => (
    <div className="flex flex-col gap-3 w-96">
      <BoxLayout label="Large Plus" labelSize="LARGE_PLUS" padding="STANDARD" />
      <BoxLayout label="Large" labelSize="LARGE" padding="STANDARD" />
      <BoxLayout label="Medium Plus" labelSize="MEDIUM_PLUS" padding="STANDARD" />
      <BoxLayout label="Medium" labelSize="MEDIUM" padding="STANDARD" />
      <BoxLayout label="Small" labelSize="SMALL" padding="STANDARD" />
      <BoxLayout label="Extra Small" labelSize="EXTRA_SMALL" padding="STANDARD" />
    </div>
  ),
};

export const LabelFontWeights: Story = {
  args: { children: null },
  render: () => (
    <div className="flex flex-col gap-3 w-96">
      <BoxLayout label="Light" labelFontWeight="LIGHT" padding="STANDARD" />
      <BoxLayout label="Regular" labelFontWeight="REGULAR" padding="STANDARD" />
      <BoxLayout label="Semi Bold" labelFontWeight="SEMI_BOLD" padding="STANDARD" />
      <BoxLayout label="Bold" labelFontWeight="BOLD" padding="STANDARD" />
    </div>
  ),
};

export const CustomColors: Story = {
  args: { children: null },
  render: () => (
    <div className="grid grid-cols-2 gap-4 w-[32rem]">
      <BoxLayout
        label="Hex with Alpha"
        style="#4B2E8380"
        borderColor="#4B2E83"
        padding="STANDARD"
      >
        <p className="text-sm">Header uses a semi-transparent hex background.</p>
      </BoxLayout>
      <BoxLayout
        label="Palette Token"
        style="TEAL_700"
        borderColor="TEAL_700"
        padding="STANDARD"
      >
        <p className="text-sm">Header uses the TEAL_700 palette token.</p>
      </BoxLayout>
    </div>
  ),
};

export const WithCardContent: Story = {
  args: {
    label: "Project Summary",
    padding: "STANDARD",
    children: (
      <CardLayout padding="STANDARD" showShadow={true}>
        <HeadingField text="Q3 Results" size="MEDIUM" marginBelow="STANDARD" />
        <RichTextDisplayField
          value={[<TextItem text="Revenue is up 12% quarter over quarter." />]}
        />
      </CardLayout>
    ),
  },
};

export const WithDropdownContent: Story = {
  args: {
    label: "Filters",
    isCollapsible: true,
    isInitiallyCollapsed: false,
    padding: "STANDARD",
    children: (
      <DropdownField
        label="Status"
        choiceLabels={["Open", "In Progress", "Closed"]}
        choiceValues={["OPEN", "IN_PROGRESS", "CLOSED"]}
      />
    ),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("button", { name: /status/i });
    await userEvent.click(trigger);
    const listbox = canvas.getByRole("listbox");
    await expect(listbox).toBeVisible();
  },
};

// Demonstrates that collapsed content doesn't take up layout space and that
// its header button is focusable. The behavioral proof that native Tab
// navigation actually skips the collapsed, `inert` content (rather than just
// looking collapsed) lives in BoxLayout.browser.test.tsx, which uses
// vitest/browser's real-Chromium userEvent.tab(). That API is only available
// inside Vitest's own browser-mode test runner, not in a module Storybook's
// plain dev server loads, so it can't live here or in this file's play
// functions without breaking `pnpm run storybook` for every Box story.
export const CollapsedTabSkip: Story = {
  args: {
    label: "Collapsed Section",
    isCollapsible: true,
    isInitiallyCollapsed: true,
    padding: "STANDARD",
    children: (
      <button type="button" className="text-sm text-blue-700">
        Inside collapsed content
      </button>
    ),
  },
  render: (args) => (
    <div className="flex flex-col gap-4 w-80">
      <BoxLayout {...args} />
      <button type="button" className="text-sm text-gray-900 underline">
        Sibling button after box
      </button>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const headerButton = canvas.getByRole("button", {
      name: /collapsed section/i,
    });
    headerButton.focus();
    await expect(headerButton).toHaveFocus();
  },
};
