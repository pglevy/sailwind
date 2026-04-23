#!/usr/bin/env npx tsx
/**
 * Generate the distributable DTCG tokens.json from the source token file.
 *
 * Reads:
 *   - tokens/tokens.json  (source of truth)
 *   - src/types/sail.ts    (SAIL enum types for semantic color tokens)
 *
 * Writes:
 *   - dist/tokens.json
 *   - public/tokens.json
 *
 * The source file is mostly passed through. This script adds:
 *   - color.black alias
 *   - color.semantic tokens (derived from SAILSemanticColor enum)
 *
 * Run standalone:  npx tsx scripts/generate-tokens.ts
 * Or via build:    pnpm run build:tokens
 */

import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');

// ── Types ────────────────────────────────────────────────────────────

interface DTCGToken { $value: unknown; $type: string; $description?: string }
interface DTCGGroup { [key: string]: DTCGToken | DTCGGroup }

// ── SAIL Type Parsing ────────────────────────────────────────────────

function parseSAILSemanticColors(content: string): string[] {
  const re = /export\s+type\s+SAILSemanticColor\s*=\s*((?:[^;](?!\n\n))*[^;]);?/;
  const m = re.exec(content);
  if (!m) return [];
  const values: string[] = [];
  const valueRe = /"([^"]+)"/g;
  let vm: RegExpExecArray | null;
  while ((vm = valueRe.exec(m[1])) !== null) {
    values.push(vm[1]);
  }
  return values;
}

// Semantic color → DTCG alias mapping
const SEMANTIC_MAP: Record<string, { path: string; ref: string }> = {
  ACCENT:    { path: 'accent',      ref: '{color.blue.500}' },
  POSITIVE:  { path: 'positive',    ref: '{color.green.500}' },
  NEGATIVE:  { path: 'destructive', ref: '{color.red.500}' },
  SECONDARY: { path: 'secondary',   ref: '{color.gray.500}' },
  STANDARD:  { path: 'standard',    ref: '{color.gray.900}' },
};

// ── Main ─────────────────────────────────────────────────────────────

function main(): void {
  const tokenPath = path.join(root, 'tokens/tokens.json');
  const sailPath = path.join(root, 'src/types/sail.ts');

  // Read source
  const tokens = JSON.parse(fs.readFileSync(tokenPath, 'utf-8'));
  const sailContent = fs.readFileSync(sailPath, 'utf-8');

  // Deep clone for output
  const output = JSON.parse(JSON.stringify(tokens));

  // Add color.black (sourced from studio grey-1000)
  output.color.black = {
    $value: '#171717',
    $type: 'color',
    $description: 'Black — sourced from studio grey-1000',
  };

  // Add semantic color tokens
  const semanticValues = parseSAILSemanticColors(sailContent);
  output.color.semantic = {};
  for (const value of semanticValues) {
    const mapping = SEMANTIC_MAP[value];
    if (mapping) {
      output.color.semantic[mapping.path] = {
        $value: mapping.ref,
        $type: 'color',
        $description: `SAILSemanticColor.${value}`,
      };
    }
  }

  // Write output
  const json = JSON.stringify(output, null, 2) + '\n';

  const distOut = path.join(root, 'dist/tokens.json');
  const publicOut = path.join(root, 'public/tokens.json');

  fs.mkdirSync(path.dirname(distOut), { recursive: true });
  fs.writeFileSync(distOut, json, 'utf-8');
  fs.writeFileSync(publicOut, json, 'utf-8');

  // Count tokens
  const count = (g: DTCGGroup): number => {
    let n = 0;
    for (const v of Object.values(g)) {
      n += '$value' in (v as object) ? 1 : count(v as DTCGGroup);
    }
    return n;
  };
  const c = count(output.color), t = count(output.typography), s = count(output.spacing);
  console.log(`Generated tokens.json — ${c} color, ${t} typography, ${s} spacing tokens`);
}

main();
