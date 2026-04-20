import type { Meta, StoryObj } from '@storybook/react-vite'
import React, { useEffect, useState } from 'react'

const TOKEN_SERVER = 'http://localhost:3001';

const COLOR_FAMILIES = ['red', 'orange', 'yellow', 'green', 'teal', 'sky', 'blue', 'purple', 'pink', 'gray'] as const;
const COLOR_STEPS = ['50', '100', '200', '500', '700', '900'] as const;

const SEMANTIC_COLORS = [
  { name: 'ACCENT', family: 'blue', step: '500', label: 'Primary actions' },
  { name: 'POSITIVE', family: 'green', step: '500', label: 'Success states' },
  { name: 'NEGATIVE', family: 'red', step: '500', label: 'Error states' },
  { name: 'SECONDARY', family: 'gray', step: '500', label: 'Secondary actions' },
  { name: 'STANDARD', family: 'gray', step: '900', label: 'Default text' },
] as const;

const TEXT_SIZES = [
  { name: 'xs', sail: 'SMALL', cls: 'text-xs' },
  { name: 'sm / base', sail: 'STANDARD', cls: 'text-base' },
  { name: 'lg', sail: 'MEDIUM', cls: 'text-lg' },
  { name: 'xl', sail: 'MEDIUM_PLUS', cls: 'text-xl' },
  { name: '2xl', sail: 'LARGE', cls: 'text-2xl' },
  { name: '3xl', sail: 'LARGE_PLUS', cls: 'text-3xl' },
  { name: '4xl', sail: 'EXTRA_LARGE', cls: 'text-4xl' },
] as const;

const SPACING_SCALE = [
  { name: 'NONE', value: '0' },
  { name: 'EVEN_LESS', value: '0.25rem' },
  { name: 'LESS', value: '0.5rem' },
  { name: 'STANDARD', value: '1rem' },
  { name: 'MORE', value: '1.5rem' },
  { name: 'EVEN_MORE', value: '2rem' },
] as const;

// ── Token data hook ──────────────────────────────────────────────────

interface ColorToken { $value: string; $type: string; $description?: string }
type ColorData = Record<string, Record<string, ColorToken>>

function useColorTokens(): ColorData | null {
  const [data, setData] = useState<ColorData | null>(null);

  useEffect(() => {
    fetch(`${TOKEN_SERVER}/api/tokens/color`)
      .then(r => r.json())
      .then(d => setData(d))
      .catch(() => {
        // Fallback: import the static file
        import('../../../tokens/color.json').then(m => setData(m.default as unknown as ColorData));
      });
  }, []);

  return data;
}

function getHex(data: ColorData | null, family: string, step: string): string {
  return data?.[family]?.[step]?.$value ?? '#ffffff';
}

// ── Color Palette ────────────────────────────────────────────────────

function ColorPalette({ colors }: { colors: ColorData | null }) {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Color Palette</h2>
      <div
        className="gap-1 items-center p-3 rounded-lg"
        style={{
          display: 'grid',
          gridTemplateColumns: `100px repeat(${COLOR_STEPS.length}, 1fr)`,
          background: '#f8f8f8',
        }}
      >
        <div />
        {COLOR_STEPS.map(step => (
          <div key={step} style={{ fontSize: 11, color: '#616161', textAlign: 'center', fontWeight: 600 }}>{step}</div>
        ))}

        {COLOR_FAMILIES.map(family => (
          <React.Fragment key={family}>
            <div style={{ fontSize: 12, fontWeight: 600, textTransform: 'capitalize', color: '#424242' }}>{family}</div>
            {COLOR_STEPS.map(step => (
              <div
                key={step}
                style={{
                  backgroundColor: getHex(colors, family, step),
                  height: 36,
                  borderRadius: 4,
                  border: '1px solid rgba(0,0,0,0.15)',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.06)',
                }}
                title={`${family}-${step}: ${getHex(colors, family, step)}`}
              />
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

// ── Semantic Colors ──────────────────────────────────────────────────

function SemanticColors({ colors }: { colors: ColorData | null }) {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4 mt-8">Semantic Colors</h2>
      <div className="flex gap-4 flex-wrap">
        {SEMANTIC_COLORS.map(({ name, family, step, label }) => (
          <div key={name} className="flex items-center gap-2.5">
            <div
              style={{
                backgroundColor: getHex(colors, family, step),
                width: 40, height: 40, borderRadius: 8,
                border: '1px solid rgba(0,0,0,0.15)',
              }}
            />
            <div>
              <div className="text-sm font-semibold">{name}</div>
              <div className="text-xs text-gray-500">{label}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Type Ramp ────────────────────────────────────────────────────────

function TypeRamp() {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4 mt-8">Typography Scale</h2>
      <div className="flex flex-col gap-2">
        {TEXT_SIZES.map(({ name, sail, cls }) => (
          <div key={name} className="flex items-baseline gap-4">
            <div className="w-30 text-xs text-gray-500 shrink-0">
              text-{name} <span className="text-gray-200">({sail})</span>
            </div>
            <div className={`${cls} text-gray-900`}>
              The quick brown fox
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Spacing Scale ────────────────────────────────────────────────────

function SpacingScale() {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4 mt-8">Spacing Scale</h2>
      <div className="flex flex-col gap-2">
        {SPACING_SCALE.map(({ name, value }) => (
          <div key={name} className="flex items-center gap-4">
            <div className="w-24 text-xs text-gray-500 shrink-0">{name}</div>
            <div
              className="h-6 bg-blue-200 rounded-sm border border-blue-500"
              style={{ width: value, minWidth: value === '0' ? 2 : undefined }}
            />
            <div className="text-xs text-gray-200">{value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Combined Preview ─────────────────────────────────────────────────

function TokenPreview() {
  const colors = useColorTokens();

  return (
    <div className="p-6 font-sans max-w-[900px]">
      <h1 className="text-2xl font-bold mb-2">Design Tokens</h1>
      <p className="text-sm text-gray-500 mb-6">
        Edit values in the 🎨 Tokens panel below. Changes preview live across all stories.
      </p>
      <ColorPalette colors={colors} />
      <SemanticColors colors={colors} />
      <TypeRamp />
      <SpacingScale />
    </div>
  );
}

// ── Story Config ─────────────────────────────────────────────────────

const meta = {
  title: 'Design Tokens/Preview',
  component: TokenPreview,
  parameters: {
    layout: 'fullscreen',
    docs: { disable: true },
  },
} satisfies Meta<typeof TokenPreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllTokens: Story = {};

export const Colors: Story = {
  render: () => {
    const colors = useColorTokens();
    return (
      <div className="p-6 font-sans">
        <ColorPalette colors={colors} />
        <SemanticColors colors={colors} />
      </div>
    );
  },
};

export const Typography: Story = {
  render: () => (
    <div className="p-6 font-sans">
      <TypeRamp />
    </div>
  ),
};

export const Spacing: Story = {
  render: () => (
    <div className="p-6 font-sans">
      <SpacingScale />
    </div>
  ),
};
