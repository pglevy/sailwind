#!/usr/bin/env npx tsx
/**
 * Tiny dev server for reading/writing token files from Storybook.
 * Runs alongside Storybook on port 3001.
 *
 * Endpoints:
 *   GET  /api/tokens/color  → returns tokens/color.json
 *   POST /api/tokens/color  → writes body to tokens/color.json, runs generate:css
 */

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const PORT = 3001;
const root = path.resolve(import.meta.dirname, '..');
const TOKEN_FILES: Record<string, string> = {
  tokens: path.join(root, 'tokens/tokens.json'),
};

function cors(res: http.ServerResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

function json(res: http.ServerResponse, status: number, data: unknown) {
  cors(res);
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

const server = http.createServer((req, res) => {
  cors(res);

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = new URL(req.url ?? '/', `http://localhost:${PORT}`);

  // Root — serve the token editor UI
  if (url.pathname === '/') {
    const editorPath = path.join(root, 'scripts/token-editor.html');
    try {
      const html = fs.readFileSync(editorPath, 'utf-8');
      cors(res);
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(html);
    } catch {
      cors(res);
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Token editor HTML not found');
    }
    return;
  }

  // Favicon — no-op
  if (url.pathname === '/favicon.ico') {
    res.writeHead(204);
    res.end();
    return;
  }

  const match = url.pathname.match(/^\/api\/tokens\/(\w+)$/);

  if (!match) {
    json(res, 404, { error: 'Not found' });
    return;
  }

  const tokenType = match[1];
  const filePath = TOKEN_FILES[tokenType];

  if (!filePath) {
    json(res, 404, { error: `Unknown token type: ${tokenType}` });
    return;
  }

  // GET — read token file
  if (req.method === 'GET') {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      json(res, 200, JSON.parse(content));
    } catch (err) {
      json(res, 500, { error: `Failed to read ${tokenType} tokens` });
    }
    return;
  }

  // POST — write token file and regenerate CSS
  if (req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        // Validate JSON
        const parsed = JSON.parse(body);
        const formatted = JSON.stringify(parsed, null, 2) + '\n';

        // Write token file
        fs.writeFileSync(filePath, formatted, 'utf-8');

        // Regenerate CSS from tokens
        execSync('npx tsx scripts/generate-css.ts', { cwd: root, stdio: 'pipe' });

        json(res, 200, { ok: true, message: `Saved ${tokenType} tokens and regenerated CSS` });
      } catch (err) {
        json(res, 400, { error: `Failed to save: ${(err as Error).message}` });
      }
    });
    return;
  }

  json(res, 405, { error: 'Method not allowed' });
});

server.listen(PORT, () => {
  console.log(`🎨 Token Editor → http://localhost:${PORT}`);
  console.log(`   API: GET/POST /api/tokens/tokens`);
});
