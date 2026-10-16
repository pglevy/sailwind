#!/usr/bin/env node
/**
 * validate-designer-bundles.mjs
 *
 * Packaging-validation gate for Appian Designer_Translation bundles
 * (component-i18n task 14.2, Requirement 7.3). It FAILS the build when any
 * component-version folder under appian-plugin/i18n/designer/ is missing a
 * COMPLETE default (`_en_US`) designer bundle, printing the offending component
 * version and exactly what is missing, and exiting non-zero. On success it
 * prints a concise OK summary and exits 0.
 *
 * ── What is validated ────────────────────────────────────────────────
 * Each immediate sub-directory of appian-plugin/i18n/designer/ is treated as a
 * component-version folder (README.md and other loose files are ignored). For
 * each folder the script locates the required default bundle file:
 *   1. `<folder>_en_US.properties`  (preferred; rule-name should match folder)
 *   2. failing that, any single `*_en_US.properties` file in the folder
 * If neither exists → VIOLATION (missing `_en_US` designer bundle).
 *
 * ── Definition of "complete" ─────────────────────────────────────────
 * A default bundle is COMPLETE when all of the following hold:
 *   • a non-empty `name`        entry (component display name)   — Req 7.2
 *   • a non-empty `description` entry (component description)     — Req 7.2
 *   • every parameter is fully documented — it has BOTH a display name AND a
 *     description — honoring Appian's input-output pairing convention (see the
 *     "Key convention" section of appian-plugin/i18n/designer/README.md):
 *       – Simple parameter `p`:
 *           `parameter.p.name`  AND  `parameter.p.description`  (both non-empty)
 *       – Input-output parameter `p` (paired value / save-into):
 *           `parameter.pValue.name` + `parameter.pSaveInto.name` share a single
 *           `parameter.p.description`. So a `*Value`/`*SaveInto` `.name` needs no
 *           own `.description` (the base `p` description covers it), and the base
 *           `p` `.description` needs no own `.name`.
 *   • no `parameter.*.name` / `parameter.*.description` entry is present-but-empty.
 *
 * Rationale: a strict "every `.name` has a matching `.description` and vice
 * versa" rule would false-positive on the documented input-output pattern
 * (e.g. the Read-Only Grid's `selectionValue` / `selectionSaveInto` `.name`
 * entries sharing one `selection.description`), so the pairing convention is
 * modeled explicitly.
 *
 * ── Missing designer directory (documented behavior) ─────────────────
 * If appian-plugin/i18n/designer/ does NOT exist, the script exits 0 with a
 * note: Sailwind is primarily a React library and the designer bundles are an
 * optional downstream artifact, so "no designer packaging present" is not a
 * failure. (A CI job that specifically packages the Appian plug-in should
 * ensure the directory exists before relying on this gate.) A present-but-empty
 * directory likewise exits 0 with a note that there was nothing to validate.
 *
 * ── .properties parsing ──────────────────────────────────────────────
 * Minimal reader: skips blank lines and `#` / `!` comment lines, splits each
 * entry on the first `=` or `:`, trims the key, and trims the value only to test
 * emptiness. Unicode `\uXXXX` decoding and line-continuations are unnecessary
 * for a presence / non-empty check and are intentionally not implemented.
 *
 * ── Usage ────────────────────────────────────────────────────────────
 *   node scripts/validate-designer-bundles.mjs
 *   pnpm run validate:designer-bundles
 *
 * An optional first argument overrides the directory to scan (used only to
 * exercise the failure path against a throwaway fixture without touching the
 * real bundles):
 *   node scripts/validate-designer-bundles.mjs /tmp/some-fixture-dir
 *
 * Exit codes: 0 = all bundles complete (or nothing to validate);
 *             1 = one or more component versions missing a complete bundle.
 */

import fs from 'node:fs';
import path from 'node:path';

const DEFAULT_DESIGNER_DIR = path.resolve(
  import.meta.dirname,
  '..',
  'appian-plugin',
  'i18n',
  'designer',
);

const DESIGNER_DIR = process.argv[2]
  ? path.resolve(process.argv[2])
  : DEFAULT_DESIGNER_DIR;

const IO_SUFFIXES = ['Value', 'SaveInto'];

/** Path relative to CWD for friendlier messages. */
function rel(p) {
  return path.relative(process.cwd(), p) || p;
}

/** Parse a .properties file into a Map<key, rawValue> (last-write-wins). */
function parseProperties(text) {
  const entries = new Map();
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trimStart();
    if (trimmed === '' || trimmed.startsWith('#') || trimmed.startsWith('!')) {
      continue;
    }
    const eq = line.indexOf('=');
    const colon = line.indexOf(':');
    let sep;
    if (eq === -1) sep = colon;
    else if (colon === -1) sep = eq;
    else sep = Math.min(eq, colon);
    if (sep === -1) continue; // key with no separator — ignore
    const key = line.slice(0, sep).trim();
    if (key === '') continue;
    entries.set(key, line.slice(sep + 1));
  }
  return entries;
}

function isNonEmpty(v) {
  return typeof v === 'string' && v.trim() !== '';
}

/** If `p` ends with an input-output suffix, return its base name, else null. */
function stripIoSuffix(p) {
  for (const s of IO_SUFFIXES) {
    if (p.endsWith(s) && p.length > s.length) return p.slice(0, -s.length);
  }
  return null;
}

/**
 * Assess a parsed bundle for completeness.
 * Returns an array of human-readable problem strings (empty array = complete).
 */
function findIncompleteness(entries) {
  const problems = [];

  // Component-level name + description.
  if (!isNonEmpty(entries.get('name'))) {
    problems.push(
      entries.has('name')
        ? 'component `name` entry is present but empty'
        : 'missing component `name` entry',
    );
  }
  if (!isNonEmpty(entries.get('description'))) {
    problems.push(
      entries.has('description')
        ? 'component `description` entry is present but empty'
        : 'missing component `description` entry',
    );
  }

  // Collect parameter name/description owners; flag present-but-empty entries.
  const nameOwners = new Set(); // x from parameter.x.name
  const descOwners = new Set(); // y from parameter.y.description
  for (const [key, value] of entries) {
    const nameMatch = /^parameter\.(.+)\.name$/.exec(key);
    if (nameMatch) {
      const p = nameMatch[1];
      nameOwners.add(p);
      if (!isNonEmpty(value)) {
        problems.push(`parameter \`${p}\` has an empty \`.name\` entry`);
      }
      continue;
    }
    const descMatch = /^parameter\.(.+)\.description$/.exec(key);
    if (descMatch) {
      const p = descMatch[1];
      descOwners.add(p);
      if (!isNonEmpty(value)) {
        problems.push(`parameter \`${p}\` has an empty \`.description\` entry`);
      }
    }
  }

  // Every name-owner needs a description (its own, or the shared base
  // description when it is an input-output *Value/*SaveInto half).
  for (const p of nameOwners) {
    if (descOwners.has(p)) continue;
    const base = stripIoSuffix(p);
    if (base && descOwners.has(base)) continue;
    problems.push(`parameter \`${p}\` has a \`.name\` but no matching \`.description\``);
  }

  // Every description-owner needs a name (its own, or it is the shared base of
  // an input-output pair whose halves carry the display names).
  for (const p of descOwners) {
    if (nameOwners.has(p)) continue;
    if (IO_SUFFIXES.some((s) => nameOwners.has(`${p}${s}`))) continue;
    problems.push(`parameter \`${p}\` has a \`.description\` but no matching \`.name\``);
  }

  return problems;
}

/** Count distinct parameter identities (union of name- and description-owners). */
function countParameters(entries) {
  const params = new Set();
  for (const key of entries.keys()) {
    const m = /^parameter\.(.+)\.(?:name|description)$/.exec(key);
    if (m) {
      const base = stripIoSuffix(m[1]);
      params.add(base ?? m[1]);
    }
  }
  return params.size;
}

/**
 * Locate the required default (`_en_US`) bundle in a component-version folder.
 * Returns null when no `*_en_US.properties` file is present.
 */
function findDefaultBundle(folderPath, folderName) {
  const preferred = `${folderName}_en_US.properties`;
  const preferredPath = path.join(folderPath, preferred);
  if (fs.existsSync(preferredPath) && fs.statSync(preferredPath).isFile()) {
    return { file: preferred, matchesRuleName: true, extras: [] };
  }
  const candidates = fs
    .readdirSync(folderPath, { withFileTypes: true })
    .filter((d) => d.isFile() && d.name.endsWith('_en_US.properties'))
    .map((d) => d.name)
    .sort();
  if (candidates.length > 0) {
    return { file: candidates[0], matchesRuleName: false, extras: candidates.slice(1) };
  }
  return null;
}

function main() {
  if (!fs.existsSync(DESIGNER_DIR)) {
    console.log(
      `\u2139\uFE0F  No designer bundle directory at ${rel(DESIGNER_DIR)} \u2014 nothing to validate.`,
    );
    console.log(
      '   (Designer bundles are an optional downstream Appian plug-in artifact.)',
    );
    process.exit(0);
  }

  const componentFolders = fs
    .readdirSync(DESIGNER_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort();

  if (componentFolders.length === 0) {
    console.log(
      `\u2139\uFE0F  ${rel(DESIGNER_DIR)} contains no component-version folders \u2014 nothing to validate.`,
    );
    process.exit(0);
  }

  const failures = []; // { component, messages: string[] }
  const oks = []; // { component, file, paramCount, warnings: string[] }

  for (const folderName of componentFolders) {
    const folderPath = path.join(DESIGNER_DIR, folderName);
    const found = findDefaultBundle(folderPath, folderName);

    if (!found) {
      failures.push({
        component: folderName,
        messages: [
          `missing required default designer bundle \`${folderName}_en_US.properties\` (no \`*_en_US.properties\` file found)`,
        ],
      });
      continue;
    }

    const warnings = [];
    if (!found.matchesRuleName) {
      warnings.push(
        `default bundle \`${found.file}\` does not match the expected \`${folderName}_en_US.properties\` (rule-name / folder mismatch)`,
      );
    }
    if (found.extras.length > 0) {
      warnings.push(
        `multiple \`*_en_US.properties\` files present (${[found.file, ...found.extras].join(', ')}); validated \`${found.file}\``,
      );
    }

    const text = fs.readFileSync(path.join(folderPath, found.file), 'utf-8');
    const entries = parseProperties(text);
    const problems = findIncompleteness(entries);

    if (problems.length > 0) {
      failures.push({ component: `${folderName} (${found.file})`, messages: problems });
    } else {
      oks.push({
        component: folderName,
        file: found.file,
        paramCount: countParameters(entries),
        warnings,
      });
    }
  }

  // Non-fatal warnings first (naming / duplicate-bundle notes on OK folders).
  for (const ok of oks) {
    for (const w of ok.warnings) console.warn(`\u26A0\uFE0F  ${ok.component}: ${w}`);
  }

  if (failures.length > 0) {
    console.error(
      `\n\u274C Designer bundle validation failed \u2014 ${failures.length} component version(s) missing a complete _en_US designer bundle:\n`,
    );
    for (const f of failures) {
      console.error(`  \u2022 ${f.component}`);
      for (const m of f.messages) console.error(`      - ${m}`);
    }
    console.error(
      `\nEvery component version under ${rel(DESIGNER_DIR)} must ship a complete _en_US designer bundle (Requirement 7.3).`,
    );
    console.error('See appian-plugin/i18n/designer/README.md for the bundle layout and key convention.\n');
    process.exit(1);
  }

  console.log(
    `\u2705 Designer bundles OK \u2014 ${oks.length} component version(s), each shipping a complete _en_US bundle:`,
  );
  for (const ok of oks) {
    console.log(
      `   \u2022 ${ok.component} \u2192 ${ok.file} (${ok.paramCount} parameter${ok.paramCount === 1 ? '' : 's'})`,
    );
  }
  process.exit(0);
}

main();
