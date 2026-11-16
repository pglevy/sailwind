// Testable pieces of the sailwind CLI. No side effects on import; failures throw CliError
// and the entry point (sailwind.mjs) turns them into an error message and exit code.

import { spawnSync } from 'node:child_process'

export class CliError extends Error {
  constructor(message, { usage = false } = {}) {
    super(message)
    this.name = 'CliError'
    this.usage = usage // true → entry point also prints the help text
  }
}

export const NAME_PATTERN = /^[a-z0-9][a-z0-9._-]*$/i

export function helpText({ version, gitlabHost }) {
  return `sailwind ${version}

Usage:
  sailwind new <name> [options]   Create a project from sailwind-starter
  sailwind doctor                 Check prerequisites (node, pnpm, git, glab)

Options for "new":
  --dest <dir>      Parent directory (default: ~/Documents)
  --ref <ref>       Starter branch/tag to use (default: main)
  --gitlab          Also create a repo on ${gitlabHost} (needs glab) and push
  --private         With --gitlab: private instead of internal visibility
  --group <group>   With --gitlab: create under this group instead of your namespace
  --no-push         With --gitlab: create the repo and set origin, but don't push
  --no-install      Skip pnpm install
  --json            Print a JSON result on the last line
  -h, --help        Show this help
`
}

export const has = (cmd) => spawnSync(cmd, ['--version'], { stdio: 'ignore' }).status === 0

export function run(cmd, args, opts = {}) {
  const r = spawnSync(cmd, args, { stdio: 'inherit', ...opts })
  if (r.status !== 0) throw new CliError(`\`${cmd} ${args.join(' ')}\` failed`)
}

const VALUE_FLAGS = { '--dest': 'dest', '--ref': 'ref', '--group': 'group' }
const BOOLEAN_FLAGS = {
  '--gitlab': 'gitlab',
  '--private': 'private',
  '--no-install': 'noInstall',
  '--no-push': 'noPush',
  '--json': 'json',
}
const GITLAB_ONLY = ['--private', '--group', '--no-push']

export function parse(argv) {
  const o = { _: [] }
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (a in VALUE_FLAGS) {
      const value = argv[++i]
      if (value === undefined || value.startsWith('-')) throw new CliError(`${a} needs a value`, { usage: true })
      o[VALUE_FLAGS[a]] = value
    } else if (a in BOOLEAN_FLAGS) o[BOOLEAN_FLAGS[a]] = true
    else if (a === '-h' || a === '--help') o.help = true
    else if (a.startsWith('-')) throw new CliError(`unknown option ${a}`, { usage: true })
    else o._.push(a)
  }
  if (!o.help && !o.gitlab) {
    const stray = GITLAB_ONLY.find((f) => argv.includes(f))
    if (stray) throw new CliError(`${GITLAB_ONLY.join(', ')} only apply with --gitlab`, { usage: true })
  }
  return o
}

export function validateName(name) {
  if (!name) throw new CliError('missing project name', { usage: true })
  if (!NAME_PATTERN.test(name)) throw new CliError('name may only contain letters, numbers, ".", "_" and "-"')
}

// Keep the starter current: name the project and pin the library to the version of this CLI.
export function rewriteStarterPackage(starter, name, version) {
  const next = { ...starter, name }
  if (starter.dependencies?.['@pglevy/sailwind']) {
    next.dependencies = { ...starter.dependencies, '@pglevy/sailwind': `^${version}` }
  }
  return next
}

// Create the GitLab project for an existing local repo in `dest` (on branch main), wire up
// origin, and push unless noPush. Returns the web URL.
export function createGitlabRepo({ dest, name, host, group, private: isPrivate, noPush, env = process.env, log = () => {} }) {
  const glabEnv = { ...env, GITLAB_HOST: host }

  let ns = group
  if (!ns) {
    const who = spawnSync('glab', ['api', 'user'], { env: glabEnv, encoding: 'utf8' })
    try { ns = who.status === 0 ? JSON.parse(who.stdout).username : null } catch { ns = null }
  }
  if (!ns) {
    throw new CliError(
      `could not resolve GitLab namespace (glab auth login --hostname ${host}; VPN?). ` +
      `To finish by hand: git remote add origin git@${host}:<namespace>/${name}.git && git push -u origin main`,
    )
  }

  const visibility = isPrivate ? '--private' : '--internal'
  log(`→ Creating ${host}/${ns}/${name} (${visibility.slice(2)})...`)
  // GLAB_NO_PROMPT skips glab's "Create a local project directory?" question, which it asks
  // even with --skipGitInit; unanswered it hangs non-interactive runs, and "yes" nests a stray repo.
  run('glab', ['repo', 'create', `${ns}/${name}`, visibility, '--defaultBranch', 'main', '--skipGitInit'], {
    cwd: dest,
    env: { ...glabEnv, GLAB_NO_PROMPT: '1' },
  })

  // glab doesn't reliably wire the remote when starting from an existing local repo, so set it explicitly.
  spawnSync('git', ['remote', 'remove', 'origin'], { cwd: dest, stdio: 'ignore' })
  run('git', ['remote', 'add', 'origin', `git@${host}:${ns}/${name}.git`], { cwd: dest })
  if (noPush) log('→ --no-push given. Run: git push -u origin main')
  else run('git', ['push', '-u', 'origin', 'main'], { cwd: dest })

  return `https://${host}/${ns}/${name}`
}
