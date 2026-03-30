#!/usr/bin/env npx tsx
/**
 * Generate a W3C DTCG-compliant tokens.json from Sailwind source files.
 *
 * Reads:
 *   - src/index.css   (color palette, typography overrides, spacing/radius)
 *   - src/types/sail.ts (SAIL enum types for semantic tokens)
 *
 * Writes:
 *   - dist/tokens.json
 *
 * Run standalone:  npx tsx scripts/generate-tokens.ts
 * Or via build:    npm run build:tokens
 */

import fs from 'node:fs';
import path from 'node:path';

// ── Types ────────────────────────────────────────────────────────────

interface DTCGToken {
  $value: unknown;
  $type: string;
  $description?: string;
}

interface DTCGGroup {
  [key: string]: DTCGToken | DTCGGroup;
}

interface RawColor {
  name: string;
  value: string;
  family: string;
  step: number;
}

interface Alias {
  name: string;
  target: string;
}

// ── CSS Parsing ──────────────────────────────────────────────────────

function extractThemeBlock(css: string): string | null {
  const start = css.indexOf('@theme');
  if (start === -1) return null;
  const braceStart = css.indexOf('{', start);
  if (braceStart === -1) return null;

  let depth = 1;
  let i = braceStart + 1;
  while (i < css.length && depth > 0) {
    if (css[i] === '{') depth++;
    if (css[i] === '}') depth--;
    i++;
  }
  return depth === 0 ? css.slice(braceStart + 1, i - 1) : null;
}

function parseColors(theme: string): { colors: RawColor[]; aliases: Alias[] } {
  const colors: RawColor[] = [];
  const aliases: Alias[] = [];

  // Concrete hex colors: --color-{family}-{step}: #{hex}
  const hexRe = /--color-([a-z]+)-(\d+)\s*:\s*(#[0-9A-Fa-f]{6})/g;
  let m: RegExpExecArray | null;
  while ((m = hexRe.exec(theme)) !== null) {
    colors.push({ name: `${m[1]}-${m[2]}`, value: m[3], family: m[1], step: parseInt(m[2], 10) });
  }

  // Alias colors: --color-{name}: var(--color-{family}-{step})
  const aliasRe = /--color-([a-z]+)\s*:\s*var\(--color-([a-z]+-\d+)\)/g;
  while ((m = aliasRe.exec(theme)) !== null) {
    const target = colors.find(c => c.name === m![2]);
    colors.push({ name: m[1], value: target?.value ?? `var(--color-${m[2]})`, family: m[1], step: 0 });
    aliases.push({ name: m[1], target: m[2] });
  }

  return { colors, aliases };
}

function parseTextTokens(theme: string): Array<{ name: string; value: string; dtcgType: string }> {
  const tokens: Array<{ name: string; value: string; dtcgType: string }> = [];
  const re = /--text-([a-zA-Z0-9]+)\s*:\s*([^;]+)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(theme)) !== null) {
    tokens.push({ name: `text-${m[1]}`, value: m[2].trim(), dtcgType: 'dimension' });
  }
  return tokens;
}

function parseSpacingTokens(theme: string): Array<{ name: string; value: string }> {
  const tokens: Array<{ name: string; value: string }> = [];

  const spacingRe = /--spacing-([a-zA-Z0-9\\.]+)\s*:\s*([^;]+)/g;
  let m: RegExpExecArray | null;
  while ((m = spacingRe.exec(theme)) !== null) {
    tokens.push({ name: `spacing-${m[1].replace(/\\/g, '').replace(/\./g, '_')}`, value: m[2].trim() });
  }

  const radiusRe = /--radius-([a-zA-Z0-9\\.]+)\s*:\s*([^;]+)/g;
  while ((m = radiusRe.exec(theme)) !== null) {
    tokens.push({ name: `radius-${m[1].replace(/\\/g, '')}`, value: m[2].trim() });
  }

  return tokens;
}

function parseBaseTypography(css: string): Array<{ name: string; value: string; dtcgType: string }> {
  const tokens: Array<{ name: string; value: string; dtcgType: string }> = [];
  const layerMatch = css.match(/@layer\s+base\s*\{([\s\S]*?)\n\}/);
  if (!layerMatch) return tokens;
  const htmlMatch = layerMatch[1].match(/html\s*\{([\s\S]*?)\}/);
  if (!htmlMatch) return tokens;
  const block = htmlMatch[1];

  const ff = block.match(/font-family\s*:\s*([^;]+)/);
  if (ff) tokens.push({ name: 'font-family-base', value: ff[1].trim(), dtcgType: 'fontFamily' });

  const fw = block.match(/font-weight\s*:\s*([^;]+)/);
  if (fw) tokens.push({ name: 'font-weight-base', value: fw[1].trim(), dtcgType: 'fontWeight' });

  const ffc = block.match(/font-family-code\s*:\s*([^;]+)/);
  if (ffc) tokens.push({ name: 'font-family-code', value: ffc[1].trim(), dtcgType: 'fontFamily' });

  return tokens;
}

// ── Gradient Parsing ─────────────────────────────────────────────────

interface RawGradient {
  name: string;
  stops: Array<{ color: string; position: number }>;
  description: string;
}

/**
 * Parse --gradient-* custom properties from @layer base html block.
 * Format: linear-gradient(90deg, #hex pct%, #hex pct%, ...)
 */
function parseGradients(css: string): RawGradient[] {
  const gradients: RawGradient[] = [];
  const layerMatch = css.match(/@layer\s+base\s*\{([\s\S]*?)\n\}/);
  if (!layerMatch) return gradients;
  const htmlMatch = layerMatch[1].match(/html\s*\{([\s\S]*?)\}/);
  if (!htmlMatch) return gradients;
  const block = htmlMatch[1];

  // Find --gradient-{name}: linear-gradient(...) handling nested parens (e.g. rgba())
  const gradientPropRe = /--gradient-([a-z-]+)\s*:\s*linear-gradient\(/g;
  let m: RegExpExecArray | null;
  while ((m = gradientPropRe.exec(block)) !== null) {
    const name = m[1];
    const startIdx = m.index + m[0].length;
    // Walk forward counting parens to find the matching close
    let depth = 1;
    let i = startIdx;
    while (i < block.length && depth > 0) {
      if (block[i] === '(') depth++;
      if (block[i] === ')') depth--;
      i++;
    }
    const args = block.slice(startIdx, i - 1);
    // Split on commas that aren't inside parens (to handle rgba())
    const parts: string[] = [];
    let current = '';
    let parenDepth = 0;
    for (const ch of args) {
      if (ch === '(') parenDepth++;
      if (ch === ')') parenDepth--;
      if (ch === ',' && parenDepth === 0) {
        parts.push(current.trim());
        current = '';
      } else {
        current += ch;
      }
    }
    if (current.trim()) parts.push(current.trim());
    const stops: Array<{ color: string; position: number }> = [];
    for (let i = 1; i < parts.length; i++) {
      const stopMatch = parts[i].match(/^(.+?)\s+([\d.]+)%$/);
      if (stopMatch) {
        stops.push({ color: stopMatch[1], position: parseFloat(stopMatch[2]) / 100 });
      }
    }
    if (stops.length > 0) {
      gradients.push({ name, stops, description: `--gradient-${name}` });
    }
  }
  return gradients;
}

// ── SAIL Type Parsing ────────────────────────────────────────────────

interface SAILEnum {
  typeName: string;
  values: Record<string, string>;
}

// Margin size → Tailwind spacing unit mapping.
// These correspond to the Tailwind spacing scale used in component implementations:
//   NONE=0, EVEN_LESS=1 (0.25rem), LESS=2 (0.5rem), STANDARD=4 (1rem), MORE=6 (1.5rem), EVEN_MORE=8 (2rem)
// The SAIL enum values come from src/types/sail.ts; the unit numbers are Tailwind's spacing scale.
const MARGIN_SIZE_MAP: Record<string, string> = {
  NONE: '0', EVEN_LESS: '1', LESS: '2', STANDARD: '4', MORE: '6', EVEN_MORE: '8',
};

function parseSAILTypes(content: string): SAILEnum[] {
  const enums: SAILEnum[] = [];
  // Match type aliases — body ends at semicolon OR double-newline (single-line types have no semicolon)
  const re = /export\s+type\s+(SAIL\w+)\s*=\s*((?:[^;](?!\n\n))*[^;]);?/g;
  let m: RegExpExecArray | null;

  while ((m = re.exec(content)) !== null) {
    const typeName = m[1];
    const body = m[2];
    const valueRe = /"([^"]+)"/g;
    const values: Record<string, string> = {};
    let vm: RegExpExecArray | null;
    while ((vm = valueRe.exec(body)) !== null) {
      if (typeName === 'SAILMarginSize') {
        values[vm[1]] = MARGIN_SIZE_MAP[vm[1]] ?? vm[1];
      } else {
        values[vm[1]] = vm[1];
      }
    }
    if (Object.keys(values).length > 0) {
      enums.push({ typeName, values });
    }
  }

  return enums;
}

// ── Semantic Token Mapping ───────────────────────────────────────────

// Semantic color mappings — derived from SAILSemanticColor in src/types/sail.ts.
// The alias targets (blue-500, green-500, etc.) match the component implementations
// in src/components/ where these semantic names resolve to specific palette colors.
const SEMANTIC_COLOR_MAP: Record<string, { name: string; aliasRef: string }> = {
  NEGATIVE: { name: 'semantic/destructive', aliasRef: '{color.red.500}' },
  POSITIVE: { name: 'semantic/positive', aliasRef: '{color.green.500}' },
  ACCENT: { name: 'semantic/accent', aliasRef: '{color.blue.500}' },
  SECONDARY: { name: 'semantic/secondary', aliasRef: '{color.gray.500}' },
  STANDARD: { name: 'semantic/standard', aliasRef: '{color.gray.900}' },
};

// Tailwind spacing unit → rem conversion (standard Tailwind scale)
const TAILWIND_UNIT_TO_REM: Record<string, number> = {
  '0': 0, '1': 0.25, '2': 0.5, '4': 1, '6': 1.5, '8': 2,
};

// Human-readable names for margin tokens in the DTCG output
const MARGIN_NAME_MAP: Record<string, string> = {
  NONE: 'none', EVEN_LESS: 'even-less', LESS: 'less',
  STANDARD: 'standard', MORE: 'more', EVEN_MORE: 'even-more',
};

// ── Tree Builder ─────────────────────────────────────────────────────

function setToken(root: DTCGGroup, pathSegments: string[], token: DTCGToken): void {
  let current = root;
  for (let i = 0; i < pathSegments.length - 1; i++) {
    const seg = pathSegments[i];
    if (!(seg in current) || '$value' in (current[seg] as object)) {
      current[seg] = {};
    }
    current = current[seg] as DTCGGroup;
  }
  current[pathSegments[pathSegments.length - 1]] = token;
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function splitLastDash(name: string): [string, string] {
  const idx = name.lastIndexOf('-');
  if (idx === -1) return [name, name];
  return [name.slice(0, idx), name.slice(idx + 1)];
}

// ── Main ─────────────────────────────────────────────────────────────

function main(): void {
  const root = path.resolve(import.meta.dirname, '..');
  const cssPath = path.join(root, 'src/index.css');
  const sailPath = path.join(root, 'src/types/sail.ts');

  // Read sources
  const cssContent = fs.readFileSync(cssPath, 'utf-8');
  const sailContent = fs.readFileSync(sailPath, 'utf-8');

  // Parse CSS
  const theme = extractThemeBlock(cssContent);
  if (!theme) throw new Error('No @theme block found in index.css');

  const { colors, aliases } = parseColors(theme);
  const textTokens = parseTextTokens(theme);
  const spacingTokens = parseSpacingTokens(theme);
  const baseTypo = parseBaseTypography(cssContent);
  const gradients = parseGradients(cssContent);
  const allTypo = [...textTokens, ...baseTypo];

  // Parse SAIL types
  const sailEnums = parseSAILTypes(sailContent);

  // Build DTCG tree
  const tree: Record<string, DTCGGroup> = { color: {}, typography: {}, spacing: {}, gradient: {} };
  const aliasMap = new Map(aliases.map(a => [a.name, a.target]));

  // ── Helper: parse "0.375rem" → { value: 0.375, unit: "rem" }
  function parseDimension(raw: string): { value: number; unit: string } {
    const match = raw.match(/^([0-9.]+)(px|rem)$/);
    if (match) return { value: parseFloat(match[1]), unit: match[2] };
    // Bare "0"
    if (raw === '0') return { value: 0, unit: "px" };
    // Fallback — shouldn't happen with well-formed CSS
    return { value: parseFloat(raw), unit: "rem" };
  }

  // ── Helper: parse CSS font-family string → array of font names
  function parseFontFamily(raw: string): string[] {
    return raw.split(',').map(f => f.trim().replace(/^['"]|['"]$/g, ''));
  }

  // Colors
  for (const c of colors) {
    const aliasTarget = aliasMap.get(c.name);
    if (aliasTarget) {
      const [targetFamily, targetStep] = splitLastDash(aliasTarget);
      setToken(tree.color, [c.name], {
        $value: `{color.${targetFamily}.${targetStep}}`,
        $type: 'color',
        $description: `Alias of ${aliasTarget}`,
      });
    } else {
      setToken(tree.color, [c.family, String(c.step)], {
        $value: c.value,
        $type: 'color',
        $description: `${capitalize(c.family)} ${c.step}`,
      });
    }
  }

  // Typography — DTCG-compliant value formats
  for (const t of allTypo) {
    let group: string, name: string;
    if (t.name.startsWith('font-family-')) {
      group = 'font-family'; name = t.name.slice('font-family-'.length);
    } else if (t.name.startsWith('font-weight-')) {
      group = 'font-weight'; name = t.name.slice('font-weight-'.length);
    } else if (t.name.startsWith('text-')) {
      group = 'text-size'; name = t.name.slice('text-'.length);
    } else {
      group = t.name; name = t.name;
    }

    let $value: unknown;
    if (t.dtcgType === 'fontFamily') {
      $value = parseFontFamily(t.value);
    } else if (t.dtcgType === 'fontWeight') {
      $value = parseInt(t.value, 10) || t.value;
    } else {
      // dimension
      $value = parseDimension(t.value);
    }

    setToken(tree.typography, [group, name], {
      $value, $type: t.dtcgType, $description: t.name,
    });
  }

  // Spacing — DTCG dimension objects
  for (const sp of spacingTokens) {
    let group: string, name: string;
    if (sp.name.startsWith('spacing-')) {
      group = 'spacing'; name = sp.name.slice('spacing-'.length);
    } else if (sp.name.startsWith('radius-')) {
      group = 'radius'; name = sp.name.slice('radius-'.length);
    } else {
      group = sp.name; name = sp.name;
    }
    setToken(tree.spacing, [group, name], {
      $value: parseDimension(sp.value), $type: 'dimension', $description: sp.name,
    });
  }

  // Semantic tokens
  for (const enumDef of sailEnums) {
    if (enumDef.typeName === 'SAILSemanticColor') {
      for (const value of Object.keys(enumDef.values)) {
        const mapping = SEMANTIC_COLOR_MAP[value];
        if (mapping) {
          const segs = mapping.name.split('/');
          setToken(tree.color, segs, {
            $value: mapping.aliasRef, $type: 'color', $description: `SAILSemanticColor.${value}`,
          });
        }
      }
    }
    if (enumDef.typeName === 'SAILMarginSize') {
      for (const [value, twUnit] of Object.entries(enumDef.values)) {
        const marginName = MARGIN_NAME_MAP[value];
        const remValue = TAILWIND_UNIT_TO_REM[twUnit];
        if (marginName && remValue !== undefined) {
          setToken(tree.spacing, ['margin', marginName], {
            $value: remValue === 0 ? { value: 0, unit: "px" } : { value: remValue, unit: "rem" },
            $type: 'dimension',
            $description: `SAILMarginSize.${value}`,
          });
        }
      }
    }
  }

  // ── Gradient tokens (parsed from --gradient-* custom properties in CSS) ──
  for (const g of gradients) {
    setToken(tree.gradient, [g.name], {
      $value: g.stops,
      $type: 'gradient',
      $description: g.description,
    });
  }

  // Write output to dist/ (for npm package) and public/ (for raw GitHub access)
  const distOut = path.join(root, 'dist/tokens.json');
  const publicOut = path.join(root, 'public/tokens.json');
  const json = JSON.stringify(tree, null, 2) + '\n';

  fs.mkdirSync(path.dirname(distOut), { recursive: true });
  fs.writeFileSync(distOut, json, 'utf-8');

  fs.mkdirSync(path.dirname(publicOut), { recursive: true });
  fs.writeFileSync(publicOut, json, 'utf-8');

  // Count tokens
  const count = (g: DTCGGroup): number => {
    let n = 0;
    for (const v of Object.values(g)) {
      n += '$value' in (v as object) ? 1 : count(v as DTCGGroup);
    }
    return n;
  };
  const c = count(tree.color), t = count(tree.typography), s = count(tree.spacing);
  console.log(`Generated tokens.json (dist/ + public/) — ${c} color, ${t} typography, ${s} spacing tokens`);
}

main();
