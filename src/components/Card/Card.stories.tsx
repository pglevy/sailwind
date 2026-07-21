import type { Meta, StoryObj } from "@storybook/react-vite";
import { CardLayout } from "./CardLayout";
import { HeadingField } from "../Heading/HeadingField";
import { RichTextDisplayField } from "../RichText/RichTextDisplayField";
import { ButtonWidget } from "../Button/ButtonWidget";

const meta = {
  title: "Components/Card",
  component: CardLayout,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  argTypes: {
    shape: {
      control: "select",
      options: ["SQUARED", "SEMI_ROUNDED", "ROUNDED"],
    },
    padding: {
      control: "select",
      options: ["NONE", "EVEN_LESS", "LESS", "STANDARD", "MORE", "EVEN_MORE"],
    },
    style: {
      control: "select",
      options: [
        "NONE",
        "ACCENT",
        "SUCCESS",
        "WARN",
        "ERROR",
        "INFO",
        "CHARCOAL_SCHEME",
      ],
    },
    decorativeBarPosition: { control: "select", options: ["TOP", "START"] },
    decorativeBarColor: {
      control: "select",
      options: ["ACCENT", "SUCCESS", "WARN", "ERROR", "INFO"],
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
} satisfies Meta<typeof CardLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    shape: "SEMI_ROUNDED",
    padding: "STANDARD",
    showBorder: true,
    children: (
      <div>
        <h4 className="text-base font-semibold text-gray-900 mb-1">
          Default Card
        </h4>
        <p className="text-sm text-gray-700">
          A standard card with border and semi-rounded corners.
        </p>
      </div>
    ),
  },
};

export const DecorativeBarTop: Story = {
  args: {
    shape: "SQUARED",
    padding: "STANDARD",
    showBorder: true,
    decorativeBarPosition: "TOP",
    decorativeBarColor: "ACCENT",
    borderColor: "#9191F8",
    children: (
      <div>
        <h4 className="text-base font-semibold text-gray-900 mb-1">
          Reference Information
        </h4>
        <p className="text-sm text-gray-700">
          This card uses a top decorative bar to indicate reference content.
        </p>
      </div>
    ),
  },
};

export const DecorativeBarStart: Story = {
  args: {
    shape: "SQUARED",
    padding: "STANDARD",
    showBorder: true,
    decorativeBarPosition: "START",
    decorativeBarColor: "WARN",
    borderColor: "#FFE47F",
    children: (
      <div>
        <h4 className="text-base font-semibold text-gray-900 mb-1">Warning</h4>
        <p className="text-sm text-gray-700">
          This card uses a start decorative bar.
        </p>
      </div>
    ),
  },
};

export const DecorativeBarColors: Story = {
  args: { children: null },
  render: () => (
    <div className="flex flex-col gap-4 w-80">
      <CardLayout
        shape="SQUARED"
        padding="STANDARD"
        showBorder={true}
        decorativeBarPosition="TOP"
        decorativeBarColor="ACCENT"
        borderColor="#9191F8"
      >
        <p className="text-sm text-gray-700">Accent bar</p>
      </CardLayout>
      <CardLayout
        shape="SQUARED"
        padding="STANDARD"
        showBorder={true}
        decorativeBarPosition="TOP"
        decorativeBarColor="SUCCESS"
        borderColor="#A6D7A8"
      >
        <p className="text-sm text-gray-700">Success bar</p>
      </CardLayout>
      <CardLayout
        shape="SQUARED"
        padding="STANDARD"
        showBorder={true}
        decorativeBarPosition="TOP"
        decorativeBarColor="WARN"
        borderColor="#FFE47F"
      >
        <p className="text-sm text-gray-700">Warn bar</p>
      </CardLayout>
      <CardLayout
        shape="SQUARED"
        padding="STANDARD"
        showBorder={true}
        decorativeBarPosition="TOP"
        decorativeBarColor="ERROR"
        borderColor="#EF809B"
      >
        <p className="text-sm text-gray-700">Error bar</p>
      </CardLayout>
      <CardLayout
        shape="SQUARED"
        padding="STANDARD"
        showBorder={true}
        decorativeBarPosition="TOP"
        decorativeBarColor="INFO"
        borderColor="#81D4FA"
      >
        <p className="text-sm text-gray-700">Info bar</p>
      </CardLayout>
    </div>
  ),
};

export const Shapes: Story = {
  args: { children: null },
  render: () => (
    <div className="grid grid-cols-3 gap-4">
      <CardLayout shape="SQUARED" padding="STANDARD" showBorder={true}>
        <h4 className="text-base font-semibold text-gray-900 mb-1">Squared</h4>
        <p className="text-xs text-gray-700">0 radius</p>
      </CardLayout>
      <CardLayout shape="SEMI_ROUNDED" padding="STANDARD" showBorder={true}>
        <h4 className="text-base font-semibold text-gray-900 mb-1">
          Semi Rounded
        </h4>
        <p className="text-xs text-gray-700">4px radius</p>
      </CardLayout>
      <CardLayout shape="ROUNDED" padding="STANDARD" showBorder={true}>
        <h4 className="text-base font-semibold text-gray-900 mb-1">Rounded</h4>
        <p className="text-xs text-gray-700">8px radius</p>
      </CardLayout>
    </div>
  ),
};

export const BorderOnly: Story = {
  args: {
    shape: "SEMI_ROUNDED",
    padding: "STANDARD",
    showBorder: true,
    showShadow: false,
    children: (
      <div>
        <h4 className="text-base font-semibold text-gray-900 mb-1">
          Border Only
        </h4>
        <p className="text-xs text-gray-700">No shadow</p>
      </div>
    ),
  },
};

export const ShadowOnly: Story = {
  args: {
    shape: "SEMI_ROUNDED",
    padding: "STANDARD",
    showBorder: false,
    showShadow: true,
    children: (
      <div>
        <h4 className="text-base font-semibold text-gray-900 mb-1">
          Shadow Only
        </h4>
        <p className="text-xs text-gray-700">No border</p>
      </div>
    ),
  },
};

export const BorderAndShadow: Story = {
  args: {
    shape: "SEMI_ROUNDED",
    padding: "STANDARD",
    showBorder: true,
    showShadow: true,
    children: (
      <div>
        <h4 className="text-base font-semibold text-gray-900 mb-1">
          Border and Shadow
        </h4>
        <p className="text-xs text-gray-700">Both border and shadow</p>
      </div>
    ),
  },
};

export const VerticalAlignment: Story = {
  args: { children: null },
  parameters: { layout: "padded" },
  render: () => (
    <div className="space-y-8">
      <div>
        <p className="text-sm text-gray-600 mb-3">
          Cards use <code className="bg-gray-100 px-1 rounded text-xs">flex flex-col</code> internally.
          Put <code className="bg-gray-100 px-1 rounded text-xs">mt-auto</code> on your footer element to pin it to the bottom when cards stretch to equal height.
        </p>
      </div>

      {/* Food menu pattern */}
      <div>
        <p className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-2">Variable content, footer pinned to bottom</p>
        <div className="grid grid-cols-4 gap-4">
          <CardLayout padding="STANDARD" showBorder={true} marginBelow="NONE">
            <div className="w-full h-24 bg-gradient-to-br from-green-200 to-green-400 rounded mb-3"></div>
            <HeadingField text="Edamame" size="SMALL" fontWeight="SEMI_BOLD" marginBelow="EVEN_LESS" />
            <RichTextDisplayField value={["Steamed soybeans with sea salt."]} marginBelow="NONE" />
            <div className="flex items-center justify-between mt-auto pt-3">
              <span className="font-bold text-gray-900">$6.99</span>
              <ButtonWidget label="+" style="OUTLINE" color="ACCENT" size="SMALL" />
            </div>
          </CardLayout>

          <CardLayout padding="STANDARD" showBorder={true} marginBelow="NONE">
            <div className="w-full h-24 bg-gradient-to-br from-amber-200 to-amber-400 rounded mb-3"></div>
            <HeadingField text="Gyoza" size="SMALL" fontWeight="SEMI_BOLD" marginBelow="EVEN_LESS" />
            <RichTextDisplayField value={["Pan-fried pork and vegetable dumplings served with a soy-vinegar dipping sauce."]} marginBelow="NONE" />
            <div className="flex items-center justify-between mt-auto pt-3">
              <span className="font-bold text-gray-900">$8.00</span>
              <ButtonWidget label="+" style="OUTLINE" color="ACCENT" size="SMALL" />
            </div>
          </CardLayout>

          <CardLayout padding="STANDARD" showBorder={true} marginBelow="NONE">
            <div className="w-full h-24 bg-gradient-to-br from-yellow-200 to-orange-300 rounded mb-3"></div>
            <HeadingField text="Agedashi Tofu" size="SMALL" fontWeight="SEMI_BOLD" marginBelow="EVEN_LESS" />
            <RichTextDisplayField value={["Lightly fried tofu cubes in warm dashi broth with green onions."]} marginBelow="NONE" />
            <div className="flex items-center justify-between mt-auto pt-3">
              <span className="font-bold text-gray-900">$8.50</span>
              <ButtonWidget label="+" style="OUTLINE" color="ACCENT" size="SMALL" />
            </div>
          </CardLayout>

          <CardLayout padding="STANDARD" showBorder={true} marginBelow="NONE">
            <div className="w-full h-24 bg-gradient-to-br from-gray-700 to-gray-900 rounded mb-3"></div>
            <HeadingField text="Seaweed Salad" size="SMALL" fontWeight="SEMI_BOLD" marginBelow="EVEN_LESS" />
            <RichTextDisplayField value={["Chilled seasoned seaweed with sesame seeds and light vinegar dressing."]} marginBelow="NONE" />
            <div className="flex items-center justify-between mt-auto pt-3">
              <span className="font-bold text-gray-900">$7.00</span>
              <ButtonWidget label="+" style="OUTLINE" color="ACCENT" size="SMALL" />
            </div>
          </CardLayout>
        </div>
      </div>

      {/* Pricing pattern */}
      <div>
        <p className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-2">Variable feature list, button at bottom</p>
        <div className="grid grid-cols-3 gap-4">
          <CardLayout padding="STANDARD" showBorder={true} marginBelow="NONE">
            <HeadingField text="Starter" size="SMALL" fontWeight="SEMI_BOLD" marginBelow="NONE" />
            <HeadingField text="$9/mo" size="LARGE" fontWeight="BOLD" marginBelow="LESS" />
            <ul className="text-sm text-gray-600 space-y-1.5">
              <li>✓ 5 projects</li>
              <li>✓ Basic analytics</li>
            </ul>
            <div className="mt-auto pt-4">
              <ButtonWidget label="Get Started" style="SOLID" color="ACCENT" width="FILL" />
            </div>
          </CardLayout>

          <CardLayout padding="STANDARD" showBorder={true} marginBelow="NONE">
            <HeadingField text="Professional" size="SMALL" fontWeight="SEMI_BOLD" marginBelow="NONE" />
            <HeadingField text="$29/mo" size="LARGE" fontWeight="BOLD" marginBelow="LESS" />
            <ul className="text-sm text-gray-600 space-y-1.5">
              <li>✓ Unlimited projects</li>
              <li>✓ Advanced analytics</li>
              <li>✓ Team collaboration</li>
              <li>✓ Priority support</li>
              <li>✓ Custom integrations</li>
            </ul>
            <div className="mt-auto pt-4">
              <ButtonWidget label="Upgrade" style="SOLID" color="ACCENT" width="FILL" />
            </div>
          </CardLayout>

          <CardLayout padding="STANDARD" showBorder={true} marginBelow="NONE">
            <HeadingField text="Enterprise" size="SMALL" fontWeight="SEMI_BOLD" marginBelow="NONE" />
            <HeadingField text="Custom" size="LARGE" fontWeight="BOLD" marginBelow="LESS" />
            <ul className="text-sm text-gray-600 space-y-1.5">
              <li>✓ Everything in Pro</li>
              <li>✓ SSO & SAML</li>
              <li>✓ Dedicated support</li>
            </ul>
            <div className="mt-auto pt-4">
              <ButtonWidget label="Contact Sales" style="SOLID" color="ACCENT" width="FILL" />
            </div>
          </CardLayout>
        </div>
      </div>
    </div>
  ),
};

export const CardStyles: Story = {
  args: { children: null },
  render: () => (
    <div className="grid grid-cols-4 gap-4">
      <CardLayout style="ACCENT" padding="STANDARD" showBorder={false}>
        <p className="text-sm font-semibold text-gray-900">Accent</p>
      </CardLayout>
      <CardLayout style="SUCCESS" padding="STANDARD" showBorder={false}>
        <p className="text-sm font-semibold text-gray-900">Success</p>
      </CardLayout>
      <CardLayout style="WARN" padding="STANDARD" showBorder={false}>
        <p className="text-sm font-semibold text-gray-900">Warn</p>
      </CardLayout>
      <CardLayout style="ERROR" padding="STANDARD" showBorder={false}>
        <p className="text-sm font-semibold text-gray-900">Error</p>
      </CardLayout>
      <CardLayout style="INFO" padding="STANDARD" showBorder={false}>
        <p className="text-sm font-semibold text-gray-900">Info</p>
      </CardLayout>
      <CardLayout style="CHARCOAL_SCHEME" padding="STANDARD" showBorder={false}>
        <p className="text-sm font-semibold text-white">Charcoal</p>
      </CardLayout>
      <CardLayout style="NAVY_SCHEME" padding="STANDARD" showBorder={false}>
        <p className="text-sm font-semibold text-white">Navy</p>
      </CardLayout>
      <CardLayout style="PLUM_SCHEME" padding="STANDARD" showBorder={false}>
        <p className="text-sm font-semibold text-white">Plum</p>
      </CardLayout>
    </div>
  ),
};
