#!/usr/bin/env node
// sailwind CLI (prototype): scaffold a new Sailwind project from sailwind-starter.
// Zero dependencies; needs Node 18+, plus system `tar` and `git`.
//
//   pnpm dlx @pglevy/sailwind new my-app [--gitlab] [--no-install]
//   sailwind doctor
//
// Designed to be driven by agents: plain output, non-zero exit on failure,
// and --json for machine-readable results.

import { existsSync, mkdtempSync, readFileSync, readdirSync, renameSync, rmSync, writeFileSync } from 'node:fs'
import { homedir, tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { CliError, createGitlabRepo, has, helpText, parse, rewriteStarterPackage, run, validateName } from './lib.mjs'

const pkg = JSON.parse(readFileSync(join(dirname(fileURLToPath(import.meta.url)), '..', 'package.json'), 'utf8'))
const STARTER_REPO = process.env.SAILWIND_STARTER_REPO || 'pglevy/sailwind-starter'
const GITLAB_HOST = process.env.SAILWIND_GITLAB_HOST || 'gitlab.appian-stratus.com'

const HELP = helpText({ version: pkg.version, gitlabHost: GITLAB_HOST })
const log = (m) => console.log(m)

function doctor() {
  const checks = [
    ['node', has('node'), 'brew install node'],
    ['pnpm', has('pnpm'), 'brew install pnpm'],
    ['git', has('git'), 'xcode-select --install'],
    ['tar', has('tar'), 'ships with macOS'],
    ['glab', has('glab'), 'brew install glab (only needed for --gitlab)'],
  ]
  let ok = true
  for (const [name, found, fix] of checks) {
    log(`${found ? '✓' : '✗'} ${name}${found ? '' : `  → ${fix}`}`)
    if (!found && name !== 'glab') ok = false
  }
  process.exit(ok ? 0 : 1)
}

async function scaffold(o) {
  const name = o._[1]
  validateName(name)
  for (const c of ['git', 'tar']) if (!has(c)) throw new CliError(`${c} not found (run \`sailwind doctor\`)`)
  if (o.gitlab && !has('glab')) throw new CliError('--gitlab needs glab (run `sailwind doctor`)')

  const parent = resolve((o.dest || join(homedir(), 'Documents')).replace(/^~(?=\/|$)/, homedir()))
  const dest = join(parent, name)
  if (existsSync(dest)) throw new CliError(`directory already exists: ${dest}`)

  const ref = o.ref || 'main'
  log(`→ Downloading ${STARTER_REPO}@${ref}...`)
  const res = await fetch(`https://codeload.github.com/${STARTER_REPO}/tar.gz/${ref}`)
  if (!res.ok) throw new CliError(`download failed: HTTP ${res.status}`)
  const tmp = mkdtempSync(join(tmpdir(), 'sailwind-new-'))
  try {
    const tarball = join(tmp, 'starter.tar.gz')
    writeFileSync(tarball, Buffer.from(await res.arrayBuffer()))
    run('tar', ['-xzf', tarball, '-C', tmp])
    const top = readdirSync(tmp).find((f) => f !== 'starter.tar.gz')
    renameSync(join(tmp, top), dest)
  } finally {
    rmSync(tmp, { recursive: true, force: true })
  }

  const pj = join(dest, 'package.json')
  const starter = rewriteStarterPackage(JSON.parse(readFileSync(pj, 'utf8')), name, pkg.version)
  writeFileSync(pj, JSON.stringify(starter, null, 2) + '\n')
  log(`✓ Created ${dest} (@pglevy/sailwind ^${pkg.version})`)

  if (!o.noInstall) {
    if (!has('pnpm')) throw new CliError('pnpm not found (run `sailwind doctor`), or pass --no-install')
    log('→ pnpm install...')
    run('pnpm', ['install'], { cwd: dest })
  }

  // Safety net: pnpm install has already run, so never let node_modules get committed.
  const gitignore = join(dest, '.gitignore')
  if (!existsSync(gitignore)) writeFileSync(gitignore, 'node_modules\ndist\n.DS_Store\n')

  run('git', ['init', '-q', '-b', 'main'], { cwd: dest })
  run('git', ['add', '.'], { cwd: dest })
  run('git', ['commit', '-q', '-m', 'Initial commit from sailwind-starter'], { cwd: dest })

  let remote = null
  if (o.gitlab) {
    remote = createGitlabRepo({
      dest, name, host: GITLAB_HOST, group: o.group, private: o.private, noPush: o.noPush, log,
    })
    log(`✓ ${remote}`)
  }

  log(`\nNext: cd ${dest} && pnpm run dev`)
  if (o.json) log(JSON.stringify({ path: dest, remote, sailwind: pkg.version }))
}

try {
  const o = parse(process.argv.slice(2))
  const cmd = o._[0]
  if (o.help || !cmd) { log(HELP); process.exit(cmd || o.help ? 0 : 1) }
  if (cmd === 'doctor') doctor()
  else if (cmd === 'new') await scaffold(o)
  else throw new CliError(`unknown command "${cmd}"`, { usage: true })
} catch (e) {
  if (!(e instanceof CliError)) throw e
  console.error(`error: ${e.message}${e.usage ? `\n\n${HELP}` : ''}`)
  process.exit(1)
}
