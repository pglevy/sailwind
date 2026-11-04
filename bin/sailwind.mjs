#!/usr/bin/env node
// sailwind CLI (prototype): scaffold a new Sailwind project from sailwind-starter.
// Zero dependencies; needs Node 18+, plus system `tar` and `git`.
//
//   pnpm dlx @pglevy/sailwind new my-app [--gitlab] [--no-install]
//   sailwind doctor
//
// Designed to be driven by agents: plain output, non-zero exit on failure,
// and --json for machine-readable results.

import { spawnSync } from 'node:child_process'
import { existsSync, mkdtempSync, readFileSync, readdirSync, renameSync, rmSync, writeFileSync } from 'node:fs'
import { homedir, tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const pkg = JSON.parse(readFileSync(join(dirname(fileURLToPath(import.meta.url)), '..', 'package.json'), 'utf8'))
const STARTER_REPO = process.env.SAILWIND_STARTER_REPO || 'pglevy/sailwind-starter'
const GITLAB_HOST = process.env.SAILWIND_GITLAB_HOST || 'gitlab.appian-stratus.com'

const HELP = `sailwind ${pkg.version}

Usage:
  sailwind new <name> [options]   Create a project from sailwind-starter
  sailwind doctor                 Check prerequisites (node, pnpm, git, glab)

Options for "new":
  --dest <dir>      Parent directory (default: ~/Documents)
  --ref <ref>       Starter branch/tag to use (default: main)
  --gitlab          Also create an internal repo on ${GITLAB_HOST} (needs glab) and push
  --no-install      Skip pnpm install
  --json            Print a JSON result on the last line
  -h, --help        Show this help
`

const log = (m) => console.log(m)
const die = (m) => { console.error(`error: ${m}`); process.exit(1) }
const has = (cmd) => spawnSync(cmd, ['--version'], { stdio: 'ignore' }).status === 0
function run(cmd, args, opts = {}) {
  const r = spawnSync(cmd, args, { stdio: 'inherit', ...opts })
  if (r.status !== 0) die(`\`${cmd} ${args.join(' ')}\` failed`)
}

function parse(argv) {
  const o = { _: [] }
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (a === '--dest') o.dest = argv[++i]
    else if (a === '--ref') o.ref = argv[++i]
    else if (['--gitlab', '--no-install', '--json'].includes(a)) o[a.slice(2).replace('no-install', 'noInstall')] = true
    else if (a === '-h' || a === '--help') o.help = true
    else if (a.startsWith('-')) die(`unknown option ${a}\n\n${HELP}`)
    else o._.push(a)
  }
  return o
}

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
  if (!name) die(`missing project name\n\n${HELP}`)
  if (!/^[a-z0-9][a-z0-9._-]*$/i.test(name)) die('name may only contain letters, numbers, ".", "_" and "-"')
  for (const c of ['git', 'tar']) if (!has(c)) die(`${c} not found (run \`sailwind doctor\`)`)
  if (o.gitlab && !has('glab')) die('--gitlab needs glab (run `sailwind doctor`)')

  const parent = resolve((o.dest || join(homedir(), 'Documents')).replace(/^~(?=\/|$)/, homedir()))
  const dest = join(parent, name)
  if (existsSync(dest)) die(`directory already exists: ${dest}`)

  const ref = o.ref || 'main'
  log(`→ Downloading ${STARTER_REPO}@${ref}...`)
  const res = await fetch(`https://codeload.github.com/${STARTER_REPO}/tar.gz/${ref}`)
  if (!res.ok) die(`download failed: HTTP ${res.status}`)
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

  // Keep the starter current: pin the library to the version of this CLI.
  const pj = join(dest, 'package.json')
  const starter = JSON.parse(readFileSync(pj, 'utf8'))
  starter.name = name
  if (starter.dependencies?.['@pglevy/sailwind']) starter.dependencies['@pglevy/sailwind'] = `^${pkg.version}`
  writeFileSync(pj, JSON.stringify(starter, null, 2) + '\n')
  log(`✓ Created ${dest} (@pglevy/sailwind ^${pkg.version})`)

  if (!o.noInstall) {
    if (!has('pnpm')) die('pnpm not found (run `sailwind doctor`), or pass --no-install')
    log('→ pnpm install...')
    run('pnpm', ['install'], { cwd: dest })
  }

  run('git', ['init', '-q', '-b', 'main'], { cwd: dest })
  run('git', ['add', '.'], { cwd: dest })
  run('git', ['commit', '-q', '-m', 'Initial commit from sailwind-starter'], { cwd: dest })

  let remote = null
  if (o.gitlab) {
    const env = { ...process.env, GITLAB_HOST }
    const who = spawnSync('glab', ['api', 'user'], { env, encoding: 'utf8' })
    const ns = who.status === 0 ? JSON.parse(who.stdout).username : null
    if (!ns) die(`could not read GitLab user (glab auth login --hostname ${GITLAB_HOST}; VPN?)`)
    log(`→ Creating ${GITLAB_HOST}/${ns}/${name}...`)
    run('glab', ['repo', 'create', `${ns}/${name}`, '--internal', '--defaultBranch', 'main'], { cwd: dest, env })
    const url = `git@${GITLAB_HOST}:${ns}/${name}.git`
    spawnSync('git', ['remote', 'remove', 'origin'], { cwd: dest, stdio: 'ignore' })
    run('git', ['remote', 'add', 'origin', url], { cwd: dest })
    run('git', ['push', '-u', 'origin', 'main'], { cwd: dest })
    remote = `https://${GITLAB_HOST}/${ns}/${name}`
    log(`✓ ${remote}`)
  }

  log(`\nNext: cd ${dest} && pnpm run dev`)
  if (o.json) log(JSON.stringify({ path: dest, remote, sailwind: pkg.version }))
}

const o = parse(process.argv.slice(2))
const cmd = o._[0]
if (o.help || !cmd) { log(HELP); process.exit(cmd || o.help ? 0 : 1) }
if (cmd === 'doctor') doctor()
else if (cmd === 'new') await scaffold(o)
else die(`unknown command "${cmd}"\n\n${HELP}`)
