import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { userEvent, within, expect } from "storybook/test";
import { BoxLayout } from "./BoxLayout";
import { CardLayout } from "../Card/CardLayout";
import { HeadingField } from "../Heading/HeadingField";
import { RichTextDisplayField } from "../RichText/RichTextDisplayField";
import { TextItem } from "../RichText/TextItem";
import { DropdownField } from "../Dropdown/DropdownField";
import { TextField } from "../TextField/TextField";
import { ParagraphField } from "../ParagraphField/ParagraphField";

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
    // The heading's name is the label alone; open/closed state comes from
    // aria-expanded, so the name doesn't change on toggle.
    await expect(canvas.getByRole("heading", { name: "Account Details" })).toBeInTheDocument();
    // The whole header row is the click target: the button fills it, so a
    // point inside the header's padding hits the button.
    const headerRow = button.parentElement!.parentElement as HTMLElement;
    const buttonRect = button.getBoundingClientRect();
    const headerRect = headerRow.getBoundingClientRect();
    await expect(buttonRect.height).toBe(headerRect.height);
    await expect(buttonRect.width).toBe(headerRect.width);
    await expect(
      document.elementFromPoint(headerRect.left + 4, headerRect.top + 4)
    ).toBe(button);
    // Regression check: while settled closed, the content wrapper must be a
    // true zero-height row, not just visually hidden text — a sliver of
    // cut-off content peeking out below the header was the reported bug.
    const contentId = button.getAttribute("aria-controls");
    const wrapper = canvasElement.querySelector(`#${contentId}`) as HTMLElement;
    await expect(wrapper.getBoundingClientRect().height).toBe(0);
    await userEvent.click(button);
    await expect(button).toHaveAttribute("aria-expanded", "true");
    await expect(canvas.getByRole("heading", { name: "Account Details" })).toBeInTheDocument();
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
          Info style — label color follows the header too.
        </p>
      </BoxLayout>
      <BoxLayout label="Warn" style="WARN" padding="STANDARD">
        <p className="text-sm text-gray-700">Warn style.</p>
      </BoxLayout>
      <BoxLayout label="Error" style="ERROR" padding="STANDARD">
        <p className="text-sm text-gray-700">
          Error style — label color follows the header too.
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
      <BoxLayout
        label="Semi Rounded, collapsed"
        shape="SEMI_ROUNDED"
        isCollapsible
        isInitiallyCollapsed
        padding="STANDARD"
      >
        <p className="text-xs text-gray-700">4px radius</p>
      </BoxLayout>
      <BoxLayout
        label="Rounded, collapsed"
        shape="ROUNDED"
        isCollapsible
        isInitiallyCollapsed
        padding="STANDARD"
      >
        <p className="text-xs text-gray-700">8px radius</p>
      </BoxLayout>
      <BoxLayout
        label="Rounded, no border, collapsed"
        shape="ROUNDED"
        showBorder={false}
        showShadow
        isCollapsible
        isInitiallyCollapsed
        padding="STANDARD"
      >
        <p className="text-xs text-gray-700">8px radius</p>
      </BoxLayout>
    </div>
  ),
  play: async ({ canvasElement }) => {
    // Regression check: the header's own background must be clipped to the
    // same corner radius as the outer border for SEMI_ROUNDED/ROUNDED — a
    // square header background poking out past a rounded border was the
    // reported bug. Checked via computed top-corner radius matching the
    // outer box's, rather than overflow-hidden on the outer container,
    // which would also clip content (e.g. an open dropdown) meant to render
    // outside the box's bounds — see WithFormContent below. A collapsed
    // box's header is also its bottom edge, so its bottom-corner radius must
    // match the outer box's too.
    const grid = canvasElement.querySelector(".grid.grid-cols-3") as HTMLElement;
    // The grid keeps its default stretch on purpose (no items-start), so the
    // height check below tests BoxLayout's own h-fit, not this story's CSS.
    await expect(getComputedStyle(grid).alignItems).toBe("normal");
    const boxes = Array.from(grid.querySelectorAll(":scope > div")) as HTMLElement[];
    for (const box of boxes) {
      const header = box.firstElementChild as HTMLElement;
      const outerStyle = getComputedStyle(box);
      const headerStyle = getComputedStyle(header);
      await expect(headerStyle.borderTopLeftRadius).toBe(outerStyle.borderTopLeftRadius);
      if (box.querySelector('button[aria-expanded="false"]')) {
        await expect(headerStyle.borderBottomLeftRadius).toBe(
          outerStyle.borderBottomLeftRadius
        );
        // A collapsed box must be exactly as tall as its header, even when a
        // taller sibling sets the grid row height.
        const borderY =
          parseFloat(outerStyle.borderTopWidth) + parseFloat(outerStyle.borderBottomWidth);
        await expect(box.getBoundingClientRect().height).toBeCloseTo(
          header.getBoundingClientRect().height + borderY,
          0
        );
      }
    }
  },
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
  // Known a11y failure, exempted until fixed:
  // - color-contrast (label color ignores the hex alpha): https://github.com/pglevy/sailwind/issues/185
  parameters: { a11y: { test: "todo" } },
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
      <CardLayout padding="STANDARD" style="#F5F5F5" showBorder={false}>
        <HeadingField text="Q3 Results" size="MEDIUM" marginBelow="STANDARD" />
        <RichTextDisplayField
          value={[<TextItem text="Revenue is up 12% quarter over quarter." />]}
        />
      </CardLayout>
    ),
  },
};

export const WithFormContent: Story = {
  // Known a11y failure, exempted until fixed:
  // - color-contrast (Dropdown placeholder): https://github.com/pglevy/sailwind/issues/185
  parameters: { a11y: { test: "todo" } },
  args: {
    label: "Request Details",
    isCollapsible: true,
    isInitiallyCollapsed: false,
    padding: "STANDARD",
    children: null,
  },
  render: (args) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    return (
      <div className="w-96">
        <BoxLayout {...args}>
          <TextField label="Title" value={title} saveInto={setTitle} />
          <ParagraphField
            label="Description"
            value={description}
            saveInto={setDescription}
          />
          {/* Keep the dropdown last: the play function checks that its open
              menu, which extends past the box's bottom edge, isn't clipped. */}
          <DropdownField
            label="Priority"
            choiceLabels={["Low", "Medium", "High"]}
            choiceValues={["LOW", "MEDIUM", "HIGH"]}
            marginBelow="NONE"
          />
        </BoxLayout>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("button", { name: /priority/i });
    await userEvent.click(trigger);
    const listbox = canvas.getByRole("listbox");
    await expect(listbox).toBeVisible();
    // Regression check: the box's rounded-corner fix (header-only top
    // radius, not overflow-hidden on the outer container) must not clip
    // this dropdown menu, which renders below the box's own bottom edge.
    const options = canvas.getAllByRole("option");
    await expect(options[options.length - 1]).toBeVisible();
  },
};

// Demonstrates that keyboard focus never enters collapsed, `inert` content.
// The play function runs in real Chromium (the storybook Vitest project), and
// Chromium refuses focus on inert content. storybook/test's userEvent.tab() is
// simulated: it picks the next focusable element in JS and calls .focus() on
// it, without checking `inert`. So rather than asserting where Tab lands, this
// asserts that focus never moves into the collapsed content, which only holds
// because the browser blocks focus there. Expanding the box and tabbing again
// is the positive control.
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
      name: "Collapsed Section",
    });
    const content = document.getElementById(
      headerButton.getAttribute("aria-controls")!
    )!;
    const innerButton = within(content).getByText("Inside collapsed content");

    headerButton.focus();
    await expect(headerButton).toHaveFocus();

    // Native inert focus blocking: the browser refuses to focus it.
    innerButton.focus();
    await expect(innerButton).not.toHaveFocus();
    await expect(headerButton).toHaveFocus();

    // Tab from the header never moves focus into the collapsed content.
    headerButton.focus();
    await userEvent.tab();
    await expect(innerButton).not.toHaveFocus();
    await expect(content.contains(document.activeElement)).toBe(false);

    // Positive control: once expanded, the same Tab reaches the inner button.
    await userEvent.click(headerButton);
    await expect(headerButton).toHaveAttribute("aria-expanded", "true");
    headerButton.focus();
    await userEvent.tab();
    await expect(innerButton).toHaveFocus();
  },
};
