import React, { useEffect, useState, useCallback } from 'react';
import { addons } from 'storybook/preview-api';
import { FORCE_RE_RENDER } from 'storybook/internal/core-events';

const TOKEN_SERVER = 'http://localhost:3001';
const CHANNEL_EVENT = 'sailwind/token-overrides';

interface ColorToken {
  $value: string;
  $type: string;
  $description?: string;
}

interface ColorData {
  $description?: string;
  $aliases?: Record<string, { $ref: string; $description?: string }>;
  [family: string]: Record<string, ColorToken> | string | Record<string, unknown> | undefined;
}

type Overrides = Record<string, string>; // e.g. { '--color-red-500': '#FF0000' }

export const TokenEditorPanel: React.FC = () => {
  const [colorData, setColorData] = useState<ColorData | null>(null);
  const [overrides, setOverrides] = useState<Overrides>({});
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [serverAvailable, setServerAvailable] = useState(true);

  // Load tokens from server
  const loadTokens = useCallback(async () => {
    try {
      const res = await fetch(`${TOKEN_SERVER}/api/tokens/color`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setColorData(data);
      setError(null);
      setServerAvailable(true);
    } catch {
      setServerAvailable(false);
      setError('Token server not running. Start it with: pnpm run token-server');
    }
  }, []);

  useEffect(() => { loadTokens(); }, [loadTokens]);

  // Emit overrides to preview iframe via channel
  const emitOverrides = useCallback((newOverrides: Overrides) => {
    try {
      const channel = addons.getChannel();
      channel.emit(CHANNEL_EVENT, newOverrides);
      addons.getChannel().emit(FORCE_RE_RENDER);
    } catch {
      // Channel may not be ready
    }
  }, []);

  // Handle color change
  const handleColorChange = useCallback((family: string, step: string, newValue: string) => {
    const varName = `--color-${family}-${step}`;
    const updated = { ...overrides, [varName]: newValue };
    setOverrides(updated);
    emitOverrides(updated);
  }, [overrides, emitOverrides]);

  // Reset all overrides
  const handleReset = useCallback(() => {
    setOverrides({});
    emitOverrides({});
    loadTokens();
    setSaveMessage(null);
  }, [emitOverrides, loadTokens]);

  // Save overrides back to token file
  const handleSave = useCallback(async () => {
    if (!colorData || !serverAvailable) return;
    setSaving(true);
    setSaveMessage(null);

    try {
      // Apply overrides to token data
      const updated = JSON.parse(JSON.stringify(colorData));
      for (const [varName, value] of Object.entries(overrides)) {
        const match = varName.match(/^--color-([a-z]+)-(\d+)$/);
        if (match) {
          const [, family, step] = match;
          if (updated[family]?.[step]) {
            updated[family][step].$value = value;
          }
        }
      }

      const res = await fetch(`${TOKEN_SERVER}/api/tokens/color`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      setColorData(updated);
      setOverrides({});
      emitOverrides({});
      setSaveMessage('Saved! CSS regenerated from tokens.');
    } catch (err) {
      setSaveMessage(`Save failed: ${(err as Error).message}`);
    } finally {
      setSaving(false);
    }
  }, [colorData, overrides, serverAvailable, emitOverrides]);

  if (error) {
    return (
      <div style={{ padding: 16, fontFamily: 'sans-serif' }}>
        <p style={{ color: '#9B0027' }}>⚠️ {error}</p>
        <code style={{ display: 'block', background: '#f5f5f5', padding: 8, borderRadius: 4, fontSize: 13 }}>
          pnpm run token-server
        </code>
      </div>
    );
  }

  if (!colorData) {
    return <div style={{ padding: 16 }}>Loading tokens…</div>;
  }

  const families = Object.entries(colorData).filter(([k]) => !k.startsWith('$'));
  const hasOverrides = Object.keys(overrides).length > 0;

  return (
    <div style={{ padding: 16, fontFamily: 'sans-serif', fontSize: 13, overflowY: 'auto', maxHeight: '100%' }}>
      {/* Toolbar */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, alignItems: 'center' }}>
        <button
          onClick={handleSave}
          disabled={!hasOverrides || saving}
          style={{
            padding: '6px 12px', borderRadius: 4, border: 'none', cursor: hasOverrides ? 'pointer' : 'default',
            background: hasOverrides ? '#2322F0' : '#e0e0e0', color: hasOverrides ? '#fff' : '#999',
            fontWeight: 600, fontSize: 12,
          }}
        >
          {saving ? 'Saving…' : 'Save to tokens'}
        </button>
        <button
          onClick={handleReset}
          disabled={!hasOverrides}
          style={{
            padding: '6px 12px', borderRadius: 4, border: '1px solid #e0e0e0', cursor: hasOverrides ? 'pointer' : 'default',
            background: '#fff', color: hasOverrides ? '#333' : '#999', fontSize: 12,
          }}
        >
          Reset
        </button>
        {hasOverrides && (
          <span style={{ color: '#B36A00', fontSize: 11 }}>
            {Object.keys(overrides).length} unsaved change{Object.keys(overrides).length > 1 ? 's' : ''}
          </span>
        )}
        {saveMessage && (
          <span style={{ color: saveMessage.startsWith('Save failed') ? '#9B0027' : '#357A38', fontSize: 11 }}>
            {saveMessage}
          </span>
        )}
      </div>

      {/* Color families */}
      {families.map(([family, tokens]) => (
        <div key={family} style={{ marginBottom: 16 }}>
          <div style={{ fontWeight: 600, textTransform: 'capitalize', marginBottom: 6, fontSize: 12, color: '#616161' }}>
            {family}
          </div>
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {Object.entries(tokens as Record<string, ColorToken>)
              .filter(([k]) => !k.startsWith('$'))
              .sort(([a], [b]) => parseInt(a) - parseInt(b))
              .map(([step, token]) => {
                const varName = `--color-${family}-${step}`;
                const currentValue = overrides[varName] ?? token.$value;
                const isOverridden = varName in overrides;

                return (
                  <div
                    key={step}
                    style={{
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
                      position: 'relative',
                    }}
                  >
                    <div style={{ position: 'relative' }}>
                      <input
                        type="color"
                        value={currentValue}
                        onChange={(e) => handleColorChange(family, step, e.target.value)}
                        style={{
                          width: 40, height: 32, border: isOverridden ? '2px solid #2322F0' : '1px solid #e0e0e0',
                          borderRadius: 4, padding: 0, cursor: 'pointer', background: 'none',
                        }}
                      />
                    </div>
                    <input
                      type="text"
                      value={currentValue.toUpperCase()}
                      onChange={(e) => {
                        let v = e.target.value;
                        if (!v.startsWith('#')) v = '#' + v;
                        if (/^#[0-9A-Fa-f]{6}$/.test(v)) {
                          handleColorChange(family, step, v);
                        }
                      }}
                      onBlur={(e) => {
                        let v = e.target.value.trim();
                        if (!v.startsWith('#')) v = '#' + v;
                        if (/^#[0-9A-Fa-f]{6}$/.test(v)) {
                          handleColorChange(family, step, v);
                        }
                      }}
                      style={{
                        width: 58, fontSize: 9, textAlign: 'center', fontFamily: 'monospace',
                        border: isOverridden ? '1px solid #2322F0' : '1px solid #e0e0e0',
                        borderRadius: 3, padding: '1px 2px',
                        color: isOverridden ? '#2322F0' : '#666',
                        fontWeight: isOverridden ? 600 : 400,
                      }}
                    />
                    <span style={{ fontSize: 10, color: isOverridden ? '#2322F0' : '#999', fontWeight: isOverridden ? 600 : 400 }}>
                      {step}
                    </span>
                  </div>
                );
              })}
          </div>
        </div>
      ))}
    </div>
  );
};
