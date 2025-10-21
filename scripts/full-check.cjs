/**
 * Full check - comprehensive analysis with JSON output
 */

const { visualCheck } = require('./visual-check.cjs');

const url = process.argv[2] || 'http://localhost:5173';
const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

visualCheck(url, {
  screenshot: `screenshots/full-check-${timestamp}.png`,
  fullPage: true,
  consoleErrors: true,
  pageErrors: true,
  allConsole: true,
  accessibility: true,
  outputFile: `screenshots/results-${timestamp}.json`,
});
