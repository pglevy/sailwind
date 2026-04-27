#!/usr/bin/env npx tsx
/**
 * Generate dist/theme.css — a complete Sailwind theme file for consumer
 * Tailwind v4 projects.
 *
 * Consumers import this alongside `@import "tailwindcss"` so their
 * Tailwind instance has the full Sailwind design token theme, base
 * styles (fonts, gradients), and custom utilities.
 *
 * This extracts the @theme, @layer base, and @layer utilities blocks
 * from src/index.css (skipping the @import directives that are only
 * needed for the library's own build).
 *
 * Run standalone:  npx tsx scripts/generate-theme.ts
 * Or via build:    pnpm run build:theme  (runs after vite build)
 */

import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const cssPath = path.join(root, 'src/index.css');
const css = fs.readFileSync(cssPath, 'utf-8');

// Extract the @theme block
const themeMatch = css.match(/@theme\s*\{([\s\S]*?)\n\}/);
if (!themeMatch) {
  throw new Error('Could not find @theme block in src/index.css');
}

// Extract @layer base block
const baseMatch = css.match(/@layer base\s*\{([\s\S]*?)\n\}/);

// Extract @layer utilities block
const utilitiesMatch = css.match(/@layer utilities\s*\{([\s\S]*?)\n\}/);

// Extract the Google Fonts import
const fontImportMatch = css.match(/(@import url\([^)]+\);)/);

const parts: string[] = [
  '/* Auto-generated from src/index.css — do not edit by hand */',
  '/* Import in consumer Tailwind v4 projects: */',
  '/*   @import "tailwindcss";                  */',
  '/*   @import "@pglevy/sailwind/theme.css";   */',
  '',
];

if (fontImportMatch) {
  parts.push(fontImportMatch[1]);
  parts.push('');
}

parts.push(`@theme {${themeMatch[1]}\n}`);

if (baseMatch) {
  parts.push('');
  parts.push(`@layer base {${baseMatch[1]}\n}`);
}

if (utilitiesMatch) {
  parts.push('');
  parts.push(`@layer utilities {${utilitiesMatch[1]}\n}`);
}

parts.push('');

const distDir = path.join(root, 'dist');
fs.mkdirSync(distDir, { recursive: true });
fs.writeFileSync(path.join(distDir, 'theme.css'), parts.join('\n'), 'utf-8');

console.log('✅ Generated dist/theme.css for consumer Tailwind projects');
