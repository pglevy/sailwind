#!/usr/bin/env npx tsx
/**
 * Generate CSS custom properties from the unified design token source file.
 *
 * Reads:
 *   - tokens/tokens.json  (all design tokens)
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

interface DimensionValue { value: number; unit: string }
interface DTCGToken { $value: unknown; $type: string; $description?: string }
interface TokenGroup { [key: string]: DTCGToken | TokenGroup }

interface TokenFile {
  color: Record<string, Record<string, DTCGToken>>;
  typography: {
    'text-size': Record<string, DTCGToken>;
    'font-family': Record<string, DTCGToken>;
    'font-weight': Record<string, DTCGToken>;
  };
  spacing: {
    spacing: Record<string, DTCGToken>;
    radius: Record<string, DTCGToken>;
    margin: Record<string, DTCGToken>;
    padding: Record<string, DTCGToken>;
  };
  gradient: Record<string, DTCGToken>;
}

// ── Helpers ──────────────────────────────────────────────────────────

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function dimToCSS(v: DimensionValue): string {
  if (v.value === 0) return '0';
  return `${v.value}${v.unit}`;
}

/**
 * Replace content between region markers in a file.
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

function generateColorCSS(colors: TokenFile['color']): string {
  const lines: string[] = [];

  for (const [family, tokens] of Object.entries(colors)) {
    lines.push(`  /* ${capitalize(family)} */`);
    const steps = Object.keys(tokens)
      .filter(k => !k.startsWith('$'))
      .sort((a, b) => parseInt(a) - parseInt(b));
    for (const step of steps) {
      lines.push(`  --color-${family}-${step}: ${(tokens[step] as DTCGToken).$value};`);
    }
    lines.push('');
  }

  // Black — sourced from studio grey-1000
  lines.push(`  --color-black: #171717;`);

  return lines.join('\n');
}

// ── Typography Generation ────────────────────────────────────────────

function generateTypographyCSS(typography: TokenFile['typography']): string {
  const lines: string[] = [];

  // Text sizes
  lines.push('  /* Text sizes */');
  for (const [name, token] of Object.entries(typography['text-size'])) {
    const val = token.$value;
    if (typeof val === 'string' && val.startsWith('{')) {
      // DTCG alias ref like {typography.text-size.sm} → var(--text-sm)
      const ref = val.replace(/^\{typography\.text-size\.([^}]+)\}$/, 'var(--text-$1)');
      lines.push(`  --text-${name}: ${ref};`);
    } else {
      const dim = val as DimensionValue;
      lines.push(`  --text-${name}: ${dimToCSS(dim)};`);
    }
  }

  return lines.join('\n');
}

// ── Spacing Generation ───────────────────────────────────────────────

function generateSpacingCSS(spacing: TokenFile['spacing']): string {
  const lines: string[] = [];

  // Base spacing unit — enables Tailwind multiplier math for all numeric utilities
  lines.push('  /* Base spacing unit (Tailwind multiplier) */');
  lines.push('  --spacing: 0.25rem;');
  lines.push('');

  // Intermediate spacing values
  if (spacing.spacing && Object.keys(spacing.spacing).length > 0) {
    lines.push('  /* Intermediate spacing */');
    for (const [name, token] of Object.entries(spacing.spacing)) {
      const dim = token.$value as DimensionValue;
      // Convert 1_5 → 1.5 for CSS var name
      const cssName = name.replace(/_/g, '\\.');
      lines.push(`  --spacing-${cssName}: ${dimToCSS(dim)};`);
    }
    lines.push('');
  }

  // Border radius
  if (spacing.radius) {
    lines.push('  /* Border radius */');
    for (const [name, token] of Object.entries(spacing.radius)) {
      const dim = token.$value as DimensionValue;
      lines.push(`  --radius-${name}: ${dimToCSS(dim)};`);
    }
  }

  return lines.join('\n');
}

// ── Main ─────────────────────────────────────────────────────────────

function main(): void {
  const cssPath = path.join(root, 'src/index.css');
  const tokenPath = path.join(root, 'tokens/tokens.json');

  const data: TokenFile = JSON.parse(fs.readFileSync(tokenPath, 'utf-8'));
  let css = fs.readFileSync(cssPath, 'utf-8');

  css = replaceRegion(css, 'colors', generateColorCSS(data.color));
  css = replaceRegion(css, 'typography', generateTypographyCSS(data.typography));
  css = replaceRegion(css, 'spacing', generateSpacingCSS(data.spacing));

  fs.writeFileSync(cssPath, css, 'utf-8');

  console.log(`✅ Generated CSS from tokens/tokens.json — colors, typography, spacing`);
}

main();
