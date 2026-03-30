#!/usr/bin/env npx tsx
/**
 * Validate dist/tokens.json against DTCG 2025.10 format rules.
 * Runs after generate-tokens.ts as part of build:tokens.
 *
 * Checks:
 *   - No dots in token/group names
 *   - Every leaf has $value and $type
 *   - $type is a known DTCG type
 *   - dimension values are { value: number, unit: "px" | "rem" }
 *   - fontFamily values are string or string[]
 *   - fontWeight values are numbers (1-1000) or named strings
 *   - gradient values are arrays of { color, position } stops
 *   - color values are strings (hex or alias refs)
 */

import fs from 'node:fs';
import path from 'node:path';

const VALID_TYPES = new Set([
  'color', 'dimension', 'fontFamily', 'fontWeight', 'duration',
  'cubicBezier', 'number', 'strokeStyle', 'border', 'transition',
  'shadow', 'gradient', 'typography',
]);

const VALID_FONT_WEIGHTS = new Set([
  'thin', 'hairline', 'extra-light', 'ultra-light', 'light',
  'normal', 'regular', 'medium', 'semi-bold', 'demi-bold',
  'bold', 'extra-bold', 'ultra-bold', 'black', 'heavy',
  'extra-black', 'ultra-black',
]);

const errors: string[] = [];

function err(path: string, msg: string) {
  errors.push(`  ${path}: ${msg}`);
}

function isToken(node: unknown): node is Record<string, unknown> {
  return typeof node === 'object' && node !== null && '$value' in node;
}

function validateToken(tokenPath: string, token: Record<string, unknown>) {
  // Must have $type
  if (!('$type' in token)) {
    err(tokenPath, 'missing $type');
    return;
  }

  const type = token.$type as string;
  if (!VALID_TYPES.has(type)) {
    err(tokenPath, `unknown $type "${type}"`);
    return;
  }

  const val = token.$value;

  switch (type) {
    case 'color':
      if (typeof val !== 'string') err(tokenPath, `color $value must be a string, got ${typeof val}`);
      break;

    case 'dimension': {
      if (typeof val !== 'object' || val === null || Array.isArray(val)) {
        err(tokenPath, `dimension $value must be { value, unit }, got ${JSON.stringify(val)}`);
      } else {
        const d = val as Record<string, unknown>;
        if (typeof d.value !== 'number') err(tokenPath, `dimension.value must be a number, got ${typeof d.value}`);
        if (d.unit !== 'px' && d.unit !== 'rem') err(tokenPath, `dimension.unit must be "px" or "rem", got "${d.unit}"`);
      }
      break;
    }

    case 'fontFamily':
      if (typeof val === 'string') break; // single font name is valid
      if (Array.isArray(val)) {
        if (!val.every(v => typeof v === 'string')) err(tokenPath, 'fontFamily array must contain only strings');
      } else {
        err(tokenPath, `fontFamily $value must be string or string[], got ${typeof val}`);
      }
      break;

    case 'fontWeight':
      if (typeof val === 'number') {
        if (val < 1 || val > 1000) err(tokenPath, `fontWeight number must be 1-1000, got ${val}`);
      } else if (typeof val === 'string') {
        if (!VALID_FONT_WEIGHTS.has(val)) err(tokenPath, `fontWeight string "${val}" is not a valid named weight`);
      } else {
        err(tokenPath, `fontWeight $value must be number or named string, got ${typeof val}`);
      }
      break;

    case 'gradient':
      if (!Array.isArray(val)) {
        err(tokenPath, `gradient $value must be an array of stops, got ${typeof val}`);
      } else {
        val.forEach((stop, i) => {
          if (typeof stop !== 'object' || stop === null) {
            err(tokenPath, `gradient stop[${i}] must be an object`);
          } else {
            const s = stop as Record<string, unknown>;
            if (!('color' in s)) err(tokenPath, `gradient stop[${i}] missing "color"`);
            if (!('position' in s)) err(tokenPath, `gradient stop[${i}] missing "position"`);
            if (typeof s.position === 'number' && (s.position < 0 || s.position > 1)) {
              err(tokenPath, `gradient stop[${i}] position must be 0-1, got ${s.position}`);
            }
          }
        });
      }
      break;
  }
}

function walk(node: unknown, currentPath: string) {
  if (typeof node !== 'object' || node === null) return;

  for (const [key, child] of Object.entries(node as Record<string, unknown>)) {
    // Skip DTCG properties
    if (key.startsWith('$')) continue;

    const childPath = currentPath ? `${currentPath}.${key}` : key;

    // Name validation: no dots allowed in key names
    if (key.includes('.')) {
      err(childPath, `name contains a dot — dots are not allowed in DTCG token names`);
    }

    if (isToken(child)) {
      validateToken(childPath, child as Record<string, unknown>);
    } else {
      walk(child, childPath);
    }
  }
}

// ── Main ─────────────────────────────────────────────────────────────

const tokensPath = path.resolve(import.meta.dirname, '..', 'dist', 'tokens.json');
const raw = fs.readFileSync(tokensPath, 'utf-8');
const tokens = JSON.parse(raw);

walk(tokens, '');

if (errors.length > 0) {
  console.error(`\n❌ DTCG validation failed (${errors.length} error${errors.length > 1 ? 's' : ''}):\n`);
  errors.forEach(e => console.error(e));
  console.error('');
  process.exit(1);
} else {
  console.log('✅ tokens.json is valid DTCG 2025.10');
}
