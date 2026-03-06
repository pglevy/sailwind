/**
 * A11y audit script — visits each component story in a running Storybook
 * and runs axe-core to find accessibility violations.
 *
 * Usage: node scripts/a11y-audit.cjs [storybookUrl]
 * Default URL: http://localhost:6006
 *
 * Requires: playwright (already a devDependency)
 * axe-core is loaded from CDN into each story iframe
 */
const { chromium } = require('playwright')

const STORYBOOK_URL = process.argv[2] || 'http://localhost:6006'
const AXE_CDN = 'https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.10.2/axe.min.js'

async function getStoryIds(page) {
  const resp = await page.goto(`${STORYBOOK_URL}/index.json`, { timeout: 15000 })
  if (!resp.ok()) {
    throw new Error(`Could not fetch story index: ${resp.status()}`)
  }
  const data = await resp.json()
  const entries = Object.values(data.entries || data.stories || {})
  // Only actual stories, not docs pages
  return entries
    .filter(e => e.type === 'story')
    .map(e => ({ id: e.id, title: e.title, name: e.name }))
}

async function runAxeOnStory(page, storyId) {
  const iframeUrl = `${STORYBOOK_URL}/iframe.html?id=${storyId}&viewMode=story`
  await page.goto(iframeUrl, { waitUntil: 'load', timeout: 15000 })
  await page.waitForTimeout(1000)

  // Inject axe-core
  await page.addScriptTag({ url: AXE_CDN })
  await page.waitForTimeout(500)

  const results = await page.evaluate(() => {
    return new Promise((resolve, reject) => {
      if (!window.axe) {
        reject(new Error('axe-core not loaded'))
        return
      }
      const root = document.getElementById('storybook-root') || document.body
      window.axe.run(root, {
        runOnly: ['wcag2a', 'wcag2aa', 'best-practice'],
      }).then(resolve).catch(reject)
    })
  })

  return results.violations
}

async function main() {
  console.log(`\nA11y Audit — Storybook at ${STORYBOOK_URL}\n`)

  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext()
  const page = await context.newPage()

  let stories
  try {
    stories = await getStoryIds(page)
  } catch (err) {
    console.error('Could not connect to Storybook. Is it running?')
    console.error(`  Tried: ${STORYBOOK_URL}`)
    console.error(`  Error: ${err.message}`)
    await browser.close()
    process.exit(1)
  }

  console.log(`Found ${stories.length} stories\n`)

  const allViolations = []
  let storiesWithViolations = 0

  for (const story of stories) {
    try {
      const violations = await runAxeOnStory(page, story.id)
      if (violations.length > 0) {
        storiesWithViolations++
        for (const v of violations) {
          allViolations.push({
            story: `${story.title} / ${story.name}`,
            storyId: story.id,
            rule: v.id,
            impact: v.impact,
            description: v.description,
            helpUrl: v.helpUrl,
            nodes: v.nodes.length,
            targets: v.nodes.map(n => n.target.join(', ')).slice(0, 5),
          })
        }
        console.log(`  FAIL ${story.title} / ${story.name} — ${violations.length} violation(s)`)
      } else {
        console.log(`  PASS ${story.title} / ${story.name}`)
      }
    } catch (err) {
      console.log(`  SKIP ${story.title} / ${story.name} — ${err.message}`)
    }
  }

  await browser.close()

  // Summary
  console.log('\n' + '='.repeat(70))
  console.log(`SUMMARY: ${allViolations.length} violation(s) across ${storiesWithViolations} of ${stories.length} stories`)
  console.log('='.repeat(70))

  if (allViolations.length > 0) {
    // Group by rule
    const byRule = {}
    for (const v of allViolations) {
      if (!byRule[v.rule]) {
        byRule[v.rule] = {
          impact: v.impact,
          description: v.description,
          helpUrl: v.helpUrl,
          stories: [],
          targets: [],
        }
      }
      byRule[v.rule].stories.push(v.story)
      byRule[v.rule].targets.push(...v.targets)
    }

    console.log('\nViolations by rule:\n')
    for (const [rule, info] of Object.entries(byRule)) {
      console.log(`  [${(info.impact || 'unknown').toUpperCase()}] ${rule}`)
      console.log(`    ${info.description}`)
      console.log(`    Help: ${info.helpUrl}`)
      console.log(`    Affected stories (${info.stories.length}):`)
      for (const s of info.stories) {
        console.log(`      - ${s}`)
      }
      // Show unique targets
      const uniqueTargets = [...new Set(info.targets)].slice(0, 8)
      if (uniqueTargets.length > 0) {
        console.log(`    Sample selectors:`)
        for (const t of uniqueTargets) {
          console.log(`      ${t}`)
        }
      }
      console.log()
    }

    process.exit(1)
  } else {
    console.log('\nNo accessibility violations found!\n')
    process.exit(0)
  }
}

main().catch(err => {
  console.error('Fatal error:', err)
  process.exit(1)
})
