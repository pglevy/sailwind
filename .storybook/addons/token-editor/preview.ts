/**
 * Preview-side decorator that listens for token override events
 * from the Token Editor panel and applies them as CSS custom properties.
 * This affects ALL stories — so edits in the panel are visible everywhere.
 */
import { addons } from 'storybook/preview-api';

const CHANNEL_EVENT = 'sailwind/token-overrides';

let currentOverrides: Record<string, string> = {};

function applyOverrides(overrides: Record<string, string>) {
  const root = document.documentElement;

  // Remove previous overrides
  for (const varName of Object.keys(currentOverrides)) {
    root.style.removeProperty(varName);
  }

  // Apply new overrides
  for (const [varName, value] of Object.entries(overrides)) {
    root.style.setProperty(varName, value);
  }

  currentOverrides = { ...overrides };
}

// Listen for override events from the manager panel
try {
  const channel = addons.getChannel();
  channel.on(CHANNEL_EVENT, (overrides: Record<string, string>) => {
    applyOverrides(overrides);
  });
} catch {
  // Channel not ready yet — will connect on next render
}
