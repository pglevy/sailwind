import type { Meta, StoryObj } from '@storybook/react-vite'
import tokens from '../../public/tokens.json'

// ─── helpers ────────────────────────────────────────────────────────────────

function resolveAlias(value: string): string {
  // e.g. "{color.blue.500}" → tokens.color.blue["500"].$value
  const match = value.match(/^\{(.+)\}$/)
  if (!match) return value
  const parts = match[1].split('.')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let node: any = tokens
  for (const p of parts) node = node?.[p]
  return node?.['$value'] ?? value
}

function isLight(hex: string): boolean {
  const c = hex.replace('#', '')
  const r = parseInt(c.slice(0, 2), 16)
  const g = parseInt(c.slice(2, 4), 16)
  const b = parseInt(c.slice(4, 6), 16)
  return (r * 299 + g * 587 + b * 114) / 1000 > 155
}

// ─── sub-components ─────────────────────────────────────────────────────────

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 style={{ fontFamily: 'Open Sans, system-ui, sans-serif', fontSize: 20, fontWeight: 600, margin: '32px 0 16px', color: '#222' }}>
      {children}
    </h2>
  )
}

function SubTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 style={{ fontFamily: 'Open Sans, system-ui, sans-serif', fontSize: 13, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#6C6C75', margin: '24px 0 10px' }}>
      {children}
    </h3>
  )
}

// ─── Color palette ───────────────────────────────────────────────────────────

// Derive color families and steps dynamically from tokens
const COLOR_FAMILIES = Object.keys(tokens.color).filter(k => k !== 'semantic' && k !== 'black')
const STEPS = Object.keys(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (tokens.color as any)[COLOR_FAMILIES[0]] ?? {}
).sort((a, b) => Number(a) - Number(b))

function ColorPalette() {
  return (
    <div>
      <SectionTitle>Color Palette</SectionTitle>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(600px, 1fr))', gap: 24 }}>
        {COLOR_FAMILIES.map(family => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const familyTokens = (tokens.color as any)[family]
          return (
            <div key={family}>
              <SubTitle>{family}</SubTitle>
              <div style={{ display: 'flex', borderRadius: 8, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                {STEPS.map(step => {
                  const hex: string = familyTokens[step]?.['$value'] ?? '#ccc'
                  const light = isLight(hex)
                  return (
                    <div
                      key={step}
                      title={`${family}-${step}: ${hex}`}
                      style={{
                        flex: 1,
                        background: hex,
                        padding: '12px 4px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 4,
                      }}
                    >
                      <span style={{ fontSize: 10, fontWeight: 700, color: light ? '#222' : '#fff', fontFamily: 'monospace' }}>{step}</span>
                      <span style={{ fontSize: 9, color: light ? '#444' : 'rgba(255,255,255,0.8)', fontFamily: 'monospace', wordBreak: 'break-all', textAlign: 'center' }}>{hex}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Semantic colors ─────────────────────────────────────────────────────────

const SEMANTIC_LABELS: Record<string, string> = {
  accent: 'ACCENT',
  positive: 'POSITIVE',
  destructive: 'NEGATIVE',
  secondary: 'SECONDARY',
  standard: 'STANDARD',
}

function SemanticColors() {
  return (
    <div>
      <SectionTitle>Semantic Colors</SectionTitle>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        {Object.entries(tokens.color.semantic).map(([key, token]) => {
          const raw = token['$value'] as string
          const hex = resolveAlias(raw)
          const light = isLight(hex)
          // Extract alias path like "blue-500" from "{color.blue.500}"
          const aliasMatch = raw.match(/^\{color\.(.+)\}$/)
          const aliasLabel = aliasMatch ? aliasMatch[1].replace('.', '-') : raw
          return (
            <div key={key} style={{ width: 140 }}>
              <div style={{
                background: hex,
                borderRadius: 8,
                height: 72,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
              }}>
                <span style={{ fontFamily: 'monospace', fontSize: 11, fontWeight: 700, color: light ? '#222' : '#fff' }}>{hex}</span>
              </div>
              <div style={{ marginTop: 6, fontFamily: 'Open Sans, sans-serif', fontSize: 13, fontWeight: 600, color: '#222' }}>{SEMANTIC_LABELS[key] ?? key}</div>
              <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#6C6C75' }}>{aliasLabel}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Gradients ───────────────────────────────────────────────────────────────

function resolveGradientStops(stops: Array<{ color: string; position: number }>): string {
  return stops
    .map(s => `${resolveAlias(s.color)} ${Math.round(s.position * 100)}%`)
    .join(', ')
}

function Gradients() {
  const gradientEntries = Object.entries(tokens.gradient)
  const cssStrings = gradientEntries.map(([, g]) =>
    resolveGradientStops(g['$value'] as Array<{ color: string; position: number }>)
  )

  // Find the bg and overlay gradients for the combined preview
  const bgIndex = gradientEntries.findIndex(([k]) => k === 'header-bg')
  const overlayIndex = gradientEntries.findIndex(([k]) => k === 'header-overlay')
  const bgCss = bgIndex >= 0 ? cssStrings[bgIndex] : cssStrings[0]
  const overlayCss = overlayIndex >= 0 ? cssStrings[overlayIndex] : cssStrings[1]

  return (
    <div>
      <SectionTitle>Gradients</SectionTitle>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* Left: individual gradient swatches (bg only) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {gradientEntries.map(([key, g], i) =>
            key === 'header-overlay' ? null : (
              <div key={key}>
                <SubTitle>{key}</SubTitle>
                <div style={{ height: 80, borderRadius: 8, background: `linear-gradient(to right, ${cssStrings[i]})`, border: '1px solid #E0E0E0', boxShadow: '0 1px 3px rgba(0,0,0,0.12)' }} />
                <div style={{ marginTop: 6, fontFamily: 'monospace', fontSize: 11, color: '#6C6C75' }}>{g['$description']}</div>
              </div>
            )
          )}
        </div>

        {/* Right: combined as seen in ApplicationHeader */}
        <div>
          <SubTitle>Header-BG with Overlay</SubTitle>
          <div style={{
            height: 80,
            borderRadius: 8,
            position: 'relative',
            overflow: 'hidden',
            background: `linear-gradient(to right, ${bgCss})`,
            boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
            border: '1px solid #E0E0E0',
          }}>
            {/* Overlay offset from top by 0.5rem, matching .application-header-gradient::before */}
            <div style={{
              position: 'absolute',
              top: '0.5rem',
              left: 0,
              right: 0,
              bottom: 0,
              background: `linear-gradient(to right, ${overlayCss})`,
            }} />
          </div>
          <div style={{ marginTop: 6, fontFamily: 'monospace', fontSize: 11, color: '#6C6C75' }}>
            --gradient-header-overlay
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Typography ──────────────────────────────────────────────────────────────

function Typography() {
  const { 'text-size': textSize } = tokens.typography

  return (
    <div>
      <SectionTitle>Typography</SectionTitle>

      <SubTitle>Text Size</SubTitle>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {Object.entries(textSize).map(([key, token]) => {
          const raw = token['$value']
          const isAlias = typeof raw === 'string' && raw.startsWith('{')
          const resolvedValue = isAlias
            ? resolveAlias(raw) as unknown as { value: number; unit: string }
            : raw as { value: number; unit: string }
          const desc = token['$description'] as string
          const sailName = desc.split('—')[0].trim().replace(/^[^.]+\./, '')
          // rem values are relative to browser default 16px root
          const px = Math.round(resolvedValue.value * 16)
          const sizeLabel = isAlias
            ? `→ text-${raw.replace(/^\{typography\.text-size\./, '').replace(/\}$/, '')} (${resolvedValue.value}rem / ${px}px)`
            : `${resolvedValue.value}${resolvedValue.unit} / ${px}px`
          return (
            <div key={key} style={{ display: 'flex', alignItems: 'baseline', gap: 16 }}>
              <span style={{ width: 80, fontFamily: 'monospace', fontSize: 11, color: '#6C6C75', flexShrink: 0 }}>text-{key}</span>
              <span style={{ fontSize: `${resolvedValue.value}${resolvedValue.unit}`, fontFamily: 'Open Sans, sans-serif', color: '#222', lineHeight: 1.2 }}>The quick brown fox</span>
              <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#6C6C75' }}>{sizeLabel}</span>
              <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#2322F0' }}>{sailName}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Spacing ─────────────────────────────────────────────────────────────────

function Spacing() {
  const { margin } = tokens.spacing

  return (
    <div>
      <SectionTitle>Spacing</SectionTitle>

      <SubTitle>Margin and Padding Scale</SubTitle>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {Object.entries(margin).map(([key, token]) => {
          const val = token['$value'] as { value: number; unit: string }
          const px = val.unit === 'rem' ? val.value * 16 : val.value
          const width = Math.max(px, 4)
          const desc = (token['$description'] as string).replace(/^[^.]+\./, '')
          return (
            <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 100, fontFamily: 'monospace', fontSize: 12, color: '#222', textAlign: 'right' }}>{key}</div>
              <div style={{ width, height: 20, background: '#2322F0', borderRadius: 3, minWidth: 4 }} />
              <div style={{ fontFamily: 'monospace', fontSize: 11, color: '#6C6C75' }}>{val.value}{val.unit} ({px}px) — {desc}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Shape ────────────────────────────────────────────────────────────────────

function Shape() {
  const { radius } = tokens.spacing

  return (
    <div>
      <SectionTitle>Shape</SectionTitle>

      <SubTitle>Border Radius</SubTitle>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        {Object.entries(radius).map(([key, token]) => {
          const val = token['$value'] as { value: number; unit: string }
          const px = val.value * 16
          return (
            <div key={key} style={{ background: '#F5F5F7', borderRadius: 6, padding: '10px 14px', textAlign: 'center' }}>
              <div style={{ width: 48, height: 48, background: '#2322F0', borderRadius: px, margin: '0 auto 6px' }} />
              <div style={{ fontFamily: 'monospace', fontSize: 11, color: '#222' }}>{key}</div>
              <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#6C6C75' }}>{val.value}{val.unit} ({px}px)</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Full page ────────────────────────────────────────────────────────────────

function DesignTokensPage() {
  return (
    <div style={{ padding: '32px 40px', fontFamily: 'Open Sans, system-ui, sans-serif' }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, color: '#222', margin: '0 0 4px' }}>Design Tokens</h1>
      <p style={{ color: '#6C6C75', fontSize: 14, margin: '0 0 8px' }}>
        Aurora color palette, semantic mappings, typography, spacing, and gradients — sourced from{' '}
        <code style={{ fontFamily: 'monospace', background: '#EDEDF2', padding: '1px 5px', borderRadius: 4 }}>public/tokens.json</code>
      </p>
      <hr style={{ border: 'none', borderTop: '1px solid #E0E0E0', margin: '20px 0 0' }} />
      <ColorPalette />
      <SemanticColors />
      <Gradients />
      <Typography />
      <Spacing />
      <Shape />
    </div>
  )
}

// ─── Story ────────────────────────────────────────────────────────────────────

const meta = {
  title: 'Foundation/Design Tokens',
  component: DesignTokensPage,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof DesignTokensPage>

export default meta
type Story = StoryObj<typeof meta>

export const AllTokens: Story = {}
