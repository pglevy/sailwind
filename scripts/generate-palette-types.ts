#!/usr/bin/env npx tsx
/**
 * Generate SAILPaletteColor types and mapping from the source token file.
 *
 * Reads:
 *   - tokens/tokens.json  (source of truth)
 *
 * Writes:
 *   - src/types/palette-colors.generated.ts
 *
 * Each color family + step becomes a SAIL palette token:
 *   "teal" + "700" → "TEAL_700"
 *   "burnt-orange" + "500" → "BURNT_ORANGE_500"
 *
 * The generated file exports:
 *   - SAILPaletteColor union type
 *   - paletteToTailwind() — converts a palette token to a Tailwind class segment
 *
 * Run standalone:  npx tsx scripts/generate-palette-types.ts
 * Or via build:    pnpm run build:tokens
 */

import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');

interface DTCGToken { $value: unknown; $type: string; $description?: string }

function main(): void {
  const tokenPath = path.join(root, 'tokens/tokens.json');
  const tokens = JSON.parse(fs.readFileSync(tokenPath, 'utf-8'));

  const colors: Record<string, Record<string, DTCGToken>> = tokens.color;

  // Collect all palette entries: { sailName: "TEAL_700", tailwindSegment: "teal-700" }
  const entries: { sailName: string; tailwindSegment: string }[] = [];

  for (const [family, steps] of Object.entries(colors)) {
    const stepKeys = Object.keys(steps)
      .filter(k => /^\d+$/.test(k))
      .sort((a, b) => parseInt(a) - parseInt(b));

    for (const step of stepKeys) {
      // "burnt-orange" → "BURNT_ORANGE", "teal" → "TEAL"
      const sailName = `${family.toUpperCase().replace(/-/g, '_')}_${step}`;
      // Tailwind segment keeps the original family name: "burnt-orange-700"
      const tailwindSegment = `${family}-${step}`;
      entries.push({ sailName, tailwindSegment });
    }
  }

  // Build the generated file
  const lines: string[] = [
    '// AUTO-GENERATED — do not edit by hand.',
    '// Source: tokens/tokens.json',
    '// Generator: scripts/generate-palette-types.ts',
    '',
    '/**',
    ' * Union of every palette color token derived from the design token file.',
    ' * Format: FAMILY_STEP  (e.g. TEAL_700, BURNT_ORANGE_50)',
    ' */',
    'export type SAILPaletteColor =',
  ];

  // Write the union members
  for (let i = 0; i < entries.length; i++) {
    const sep = i === entries.length - 1 ? ';' : '';
    lines.push(`  | '${entries[i].sailName}'${sep}`);
  }

  lines.push('');
  lines.push('/**');
  lines.push(' * Map from palette token to its Tailwind class segment.');
  lines.push(' * Usage: `bg-${paletteColorMap[token]}` → `bg-teal-700`');
  lines.push(' */');
  lines.push('export const paletteColorMap: Record<SAILPaletteColor, string> = {');

  for (const entry of entries) {
    lines.push(`  '${entry.sailName}': '${entry.tailwindSegment}',`);
  }

  lines.push('};');
  lines.push('');

  const outPath = path.join(root, 'src/types/palette-colors.generated.ts');
  fs.writeFileSync(outPath, lines.join('\n'), 'utf-8');

  console.log(`Generated palette-colors.generated.ts — ${entries.length} palette color tokens`);
}

main();
