#!/usr/bin/env npx tsx
/**
 * Generate CSS custom properties from design token source files.
 *
 * Reads:
 *   - tokens/color.json  (color palette + aliases)
 *
 * Writes into marked regions in:
 *   - src/index.css
 *
 * Region markers:
 *   /* BEGIN GENERATED:<section> * /
 *   /* END GENERATED:<section> * /
 *
 * Run standalone:  npx tsx scripts/generate-css.ts
 * Or via build:    pnpm run generate:css
 */

import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');

// ── Types ────────────────────────────────────────────────────────────

interface ColorToken {
  $value: string;
  $type: string;
  $description?: string;
}

interface ColorFile {
  $description?: string;
  $aliases?: Record<string, { $ref: string; $description?: string }>;
  [family: string]: Record<string, ColorToken> | string | Record<string, { $ref: string; $description?: string }> | undefined;
}

// ── Helpers ──────────────────────────────────────────────────────────

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/**
 * Replace content between region markers in a file.
 * Markers look like: /* BEGIN GENERATED:colors * / and /* END GENERATED:colors * /
 */
function replaceRegion(content: string, section: string, replacement: string): string {
  const beginMarker = `/* BEGIN GENERATED:${section} */`;
  const endMarker = `/* END GENERATED:${section} */`;

  const beginIdx = content.indexOf(beginMarker);
  const endIdx = content.indexOf(endMarker);

  if (beginIdx === -1 || endIdx === -1) {
    throw new Error(
      `Missing region markers for "${section}" in index.css.\n` +
      `Expected:\n  ${beginMarker}\n  ...\n  ${endMarker}`
    );
  }

  const before = content.slice(0, beginIdx + beginMarker.length);
  const after = content.slice(endIdx);

  return before + '\n' + replacement + '\n  ' + after;
}

// ── Color Generation ─────────────────────────────────────────────────

function generateColorCSS(tokenPath: string): string {
  const raw = fs.readFileSync(tokenPath, 'utf-8');
  const data: ColorFile = JSON.parse(raw);

  const lines: string[] = [];

  // Process each color family
  for (const [key, group] of Object.entries(data)) {
    if (key.startsWith('$')) continue; // skip $description, $aliases

    const family = key;
    const tokens = group as Record<string, ColorToken>;

    lines.push(`  /* ${capitalize(family)} */`);

    // Sort steps numerically
    const steps = Object.keys(tokens)
      .filter(k => !k.startsWith('$'))
      .sort((a, b) => parseInt(a) - parseInt(b));

    for (const step of steps) {
      const token = tokens[step];
      lines.push(`  --color-${family}-${step}: ${token.$value};`);
    }

    lines.push('');
  }

  // Process aliases
  if (data.$aliases) {
    for (const [name, alias] of Object.entries(data.$aliases)) {
      const [family, step] = alias.$ref.split('-');
      const comment = alias.$description ? ` /* ${alias.$description} */` : '';
      lines.push(`  --color-${name}: var(--color-${family}-${step});${comment}`);
    }
  }

  return lines.join('\n');
}

// ── Main ─────────────────────────────────────────────────────────────

function main(): void {
  const cssPath = path.join(root, 'src/index.css');
  const colorTokenPath = path.join(root, 'tokens/color.json');

  let css = fs.readFileSync(cssPath, 'utf-8');

  // Generate and inject colors
  const colorCSS = generateColorCSS(colorTokenPath);
  css = replaceRegion(css, 'colors', colorCSS);

  fs.writeFileSync(cssPath, css, 'utf-8');

  // Count families
  const colorData = JSON.parse(fs.readFileSync(colorTokenPath, 'utf-8'));
  const families = Object.keys(colorData).filter(k => !k.startsWith('$'));
  console.log(`✅ Generated CSS colors from tokens — ${families.length} families: ${families.join(', ')}`);
}

main();
