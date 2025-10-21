# Visual Check Scripts

Lightweight Playwright scripts for checking pages without the MCP server overhead.

## Setup

Install Playwright (if not already installed):

```bash
npm install -D playwright
npx playwright install chromium
```

## Quick Usage

### Quick Check (screenshot + errors)

```bash
# Check default (http://localhost:5173)
npm run check-page

# Check specific URL
npm run check-page http://localhost:5173/customerdashboard

# Check with custom screenshot name
npm run check-page http://localhost:5173/publications screenshots/publications.png
```

**Output:** 
- Screenshot in `screenshots/quick-check.png` (or custom path)
- Console errors printed to terminal
- Page errors printed to terminal

### Full Check (comprehensive analysis)

```bash
# Full check with all diagnostics
npm run check-page:full

# Full check specific URL
npm run check-page:full http://localhost:5173/patterns/taskdashboard
```

**Output:**
- Screenshot in `screenshots/full-check-[timestamp].png`
- JSON report in `screenshots/results-[timestamp].json`
- Accessibility snapshot
- All console messages
- Error analysis

## Advanced Usage

Use the base script directly with custom configuration:

```bash
node scripts/visual-check.cjs '{
  "url": "http://localhost:5173/customerdashboard",
  "checks": {
    "screenshot": "screenshots/dashboard.png",
    "fullPage": true,
    "consoleErrors": true,
    "pageErrors": true,
    "elementExists": "h1",
    "accessibility": true,
    "outputFile": "screenshots/dashboard-results.json"
  }
}'
```

### Available Checks

| Check | Type | Description |
|-------|------|-------------|
| `screenshot` | string | Path to save screenshot (default: `screenshots/page.png`) |
| `fullPage` | boolean | Full page vs viewport only (default: `true`) |
| `consoleErrors` | boolean | Check for console errors (default: `true`) |
| `pageErrors` | boolean | Check for page errors (default: `true`) |
| `elementExists` | string | CSS selector to verify element exists |
| `allConsole` | boolean | Capture all console messages |
| `accessibility` | boolean | Get accessibility snapshot |
| `network` | boolean | Capture network requests |
| `outputFile` | string | Save full results to JSON file |

## Workflow with Claude

1. **Run check in terminal:**
   ```bash
   npm run check-page http://localhost:5173/mypage screenshots/mypage.png
   ```

2. **Ask Claude to review:**
   > "Check the screenshot at screenshots/mypage.png - does the layout look correct?"

3. **Claude uses filesystem tools** to read the image (no context bloat!)

## Example Checks

**Check for specific element:**
```bash
node scripts/visual-check.cjs '{
  "url": "http://localhost:5173",
  "checks": {
    "screenshot": "screenshots/home.png",
    "elementExists": "[data-testid=\"table-of-contents\"]"
  }
}'
```

**Viewport-only screenshot:**
```bash
node scripts/visual-check.cjs '{
  "url": "http://localhost:5173/patterns/formentry",
  "checks": {
    "screenshot": "screenshots/form-viewport.png",
    "fullPage": false
  }
}'
```

**Debug console issues:**
```bash
node scripts/visual-check.cjs '{
  "url": "http://localhost:5173/problematic-page",
  "checks": {
    "allConsole": true,
    "consoleErrors": true,
    "pageErrors": true,
    "outputFile": "screenshots/debug.json"
  }
}'
```

## Files Created

- `scripts/visual-check.cjs` - Main script with all features
- `scripts/quick-check.cjs` - Wrapper for quick checks
- `scripts/full-check.cjs` - Wrapper for comprehensive checks
- `screenshots/` - Output directory (gitignored)

## Benefits vs MCP Server

✅ Zero context window usage when not in use  
✅ Faster execution (direct Playwright)  
✅ File-based results (Claude reads via filesystem)  
✅ Customizable scripts  
✅ Version controlled  
✅ No server overhead  

## Tips

- Keep dev server running: `npm run dev`
- Screenshots are gitignored automatically
- Use voice dictation to quickly run checks
- JSON output files contain full diagnostic info
- Timestamp-based filenames prevent overwriting
