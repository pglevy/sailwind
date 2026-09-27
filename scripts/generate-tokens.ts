#!/usr/bin/env npx tsx
/**
 * Generate the distributable DTCG tokens.json from the source token file.
 *
 * Reads:
 *   - tokens/tokens.json         (source of truth)
 *   - src/utils/derivedTokens.ts (semantic color → palette step, shared with components)
 *
 * Writes:
 *   - dist/tokens.json   — included in the npm package (@pglevy/sailwind/tokens.json)
 *   - public/tokens.json — committed to the repo for versioned CDN access via jsdelivr
 *
 * ⚠️  Do NOT remove the public/ output. External tools (e.g. Kiro skills, Aurora)
 *     fetch tokens from: https://cdn.jsdelivr.net/gh/pglevy/sailwind@main/public/tokens.json
 *
 * The source file is mostly passed through. This script adds:
 *   - $schema (first key)
 *   - color.black alias
 *   - color.semantic aliases (same palette steps components render)
 *
 * Everything in the output comes from this script. Don't edit public/tokens.json
 * by hand; the next build overwrites it and CI fails if the committed copy is stale.
 *
 * Run standalone:  npx tsx scripts/generate-tokens.ts
 * Or via build:    pnpm run build:tokens
 */

import fs from 'node:fs';
import path from 'node:path';
import { addDerivedTokens } from '../src/utils/derivedTokens';

const root = path.resolve(import.meta.dirname, '..');

const DTCG_SCHEMA = 'https://www.designtokens.org/schemas/2025.10/format.json';

// ── Types ────────────────────────────────────────────────────────────

interface DTCGToken { $value: unknown; $type: string; $description?: string }
interface DTCGGroup { [key: string]: DTCGToken | DTCGGroup }

// ── Main ─────────────────────────────────────────────────────────────

function main(): void {
  const tokenPath = path.join(root, 'tokens/tokens.json');

  // Read source
  const tokens = JSON.parse(fs.readFileSync(tokenPath, 'utf-8'));

  // $schema goes first so editors pick it up; derived tokens are added on top of the source
  const output = { $schema: DTCG_SCHEMA, ...addDerivedTokens(tokens) };

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
