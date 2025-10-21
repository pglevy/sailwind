/**
 * Visual Check Script for Sailwind
 * 
 * Usage:
 *   node scripts/visual-check.js '{"url": "http://localhost:5173", "checks": {...}}'
 * 
 * Or use npm scripts:
 *   npm run check-page
 *   npm run check-page:full
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function visualCheck(url, checks = {}) {
  console.log(`🔍 Checking: ${url}`);
  
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  // Collect console messages
  const consoleMessages = [];
  page.on('console', msg => {
    consoleMessages.push({
      type: msg.type(),
      text: msg.text(),
    });
  });
  
  // Collect errors
  const pageErrors = [];
  page.on('pageerror', error => {
    pageErrors.push({
      message: error.message,
      stack: error.stack,
    });
  });
  
  try {
    await page.goto(url, { waitUntil: 'networkidle' });
    
    const results = {
      url,
      timestamp: new Date().toISOString(),
      success: true,
    };
    
    // Take screenshot
    if (checks.screenshot !== false) {
      const screenshotPath = checks.screenshot || 'screenshots/page.png';
      
      // Ensure directory exists
      const dir = path.dirname(screenshotPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      await page.screenshot({ 
        path: screenshotPath, 
        fullPage: checks.fullPage !== false // Default to full page
      });
      
      results.screenshot = screenshotPath;
      console.log(`📸 Screenshot saved: ${screenshotPath}`);
    }
    
    // Get page title
    results.title = await page.title();
    
    // Check console errors
    if (checks.consoleErrors !== false) {
      const errors = consoleMessages.filter(msg => msg.type === 'error');
      results.consoleErrors = errors;
      
      if (errors.length > 0) {
        console.log(`⚠️  Found ${errors.length} console error(s)`);
        errors.forEach((err, i) => {
          console.log(`  ${i + 1}. ${err.text}`);
        });
      } else {
        console.log('✅ No console errors');
      }
    }
    
    // Check page errors
    if (checks.pageErrors !== false) {
      results.pageErrors = pageErrors;
      
      if (pageErrors.length > 0) {
        console.log(`❌ Found ${pageErrors.length} page error(s)`);
        pageErrors.forEach((err, i) => {
          console.log(`  ${i + 1}. ${err.message}`);
        });
      } else {
        console.log('✅ No page errors');
      }
    }
    
    // Check if specific element exists
    if (checks.elementExists) {
      const selector = checks.elementExists;
      const count = await page.locator(selector).count();
      results.elementFound = count > 0;
      results.elementCount = count;
      
      if (count > 0) {
        console.log(`✅ Element found: "${selector}" (${count} instance${count > 1 ? 's' : ''})`);
      } else {
        console.log(`❌ Element NOT found: "${selector}"`);
      }
    }
    
    // Get all console messages if requested
    if (checks.allConsole) {
      results.allConsoleMessages = consoleMessages;
      console.log(`📋 Captured ${consoleMessages.length} console message(s)`);
    }
    
    // Check network requests
    if (checks.network) {
      const requests = [];
      page.on('request', request => {
        requests.push({
          url: request.url(),
          method: request.method(),
          resourceType: request.resourceType(),
        });
      });
      results.networkRequests = requests;
    }
    
    // Get accessibility snapshot
    if (checks.accessibility) {
      results.accessibility = await page.accessibility.snapshot();
      console.log('♿ Accessibility snapshot captured');
    }
    
    await browser.close();
    
    // Write results to file if requested
    if (checks.outputFile) {
      const outputPath = checks.outputFile;
      const dir = path.dirname(outputPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
      console.log(`💾 Results saved: ${outputPath}`);
    }
    
    return results;
    
  } catch (error) {
    console.error('❌ Error during check:', error.message);
    await browser.close();
    return {
      url,
      timestamp: new Date().toISOString(),
      success: false,
      error: error.message,
      stack: error.stack,
    };
  }
}

// CLI usage
if (require.main === module) {
  const configArg = process.argv[2];
  
  if (!configArg) {
    console.log('Usage: node scripts/visual-check.js \'{"url": "http://localhost:5173", "checks": {...}}\'');
    console.log('\nExample checks:');
    console.log('  screenshot: "screenshots/custom.png" - Custom screenshot path');
    console.log('  fullPage: true/false - Full page or viewport only');
    console.log('  consoleErrors: true/false - Check for console errors');
    console.log('  pageErrors: true/false - Check for page errors');
    console.log('  elementExists: "selector" - Check if element exists');
    console.log('  allConsole: true/false - Capture all console messages');
    console.log('  accessibility: true/false - Get accessibility snapshot');
    console.log('  outputFile: "path/to/results.json" - Save full results to file');
    process.exit(1);
  }
  
  try {
    const config = JSON.parse(configArg);
    visualCheck(config.url, config.checks || {}).then(results => {
      console.log('\n✨ Check complete!');
      if (!config.checks?.outputFile) {
        console.log('\nResults summary:');
        console.log(JSON.stringify({
          title: results.title,
          screenshot: results.screenshot,
          consoleErrors: results.consoleErrors?.length || 0,
          pageErrors: results.pageErrors?.length || 0,
          elementFound: results.elementFound,
        }, null, 2));
      }
    });
  } catch (error) {
    console.error('Error parsing config:', error.message);
    process.exit(1);
  }
}

module.exports = { visualCheck };
