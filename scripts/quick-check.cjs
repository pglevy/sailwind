/**
 * Quick check - just screenshot and errors
 */

const { visualCheck } = require('./visual-check.cjs');

const url = process.argv[2] || 'http://localhost:5173';
const outputPath = process.argv[3] || 'screenshots/quick-check.png';

visualCheck(url, {
  screenshot: outputPath,
  fullPage: true,
  consoleErrors: true,
  pageErrors: true,
});
