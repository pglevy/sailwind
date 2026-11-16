import { chmodSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { CliError, createGitlabRepo, parse, rewriteStarterPackage, validateName } from '../../bin/lib.mjs'

describe('parse', () => {
  it('collects positionals and boolean flags', () => {
    const o = parse(['new', 'my-app', '--gitlab', '--no-install', '--json'])
    expect(o._).toEqual(['new', 'my-app'])
    expect(o).toMatchObject({ gitlab: true, noInstall: true, json: true })
  })

  it('reads value flags', () => {
    const o = parse(['new', 'x', '--gitlab', '--group', 'team', '--dest', '/tmp/p', '--ref', 'v1'])
    expect(o).toMatchObject({ group: 'team', dest: '/tmp/p', ref: 'v1' })
  })

  it.each(['--group', '--dest', '--ref'])('rejects %s without a value', (flag) => {
    expect(() => parse(['new', 'x', '--gitlab', flag])).toThrow(CliError)
    expect(() => parse(['new', 'x', '--gitlab', flag, '--json'])).toThrow(/needs a value/)
  })

  it('maps --no-push and --private', () => {
    expect(parse(['new', 'x', '--gitlab', '--no-push', '--private'])).toMatchObject({ noPush: true, private: true })
  })

  it.each([['--private'], ['--no-push'], ['--group', 'team']])('rejects %s without --gitlab', (...flags) => {
    expect(() => parse(['new', 'x', ...flags])).toThrow(/only apply with --gitlab/)
  })

  it('rejects unknown options as usage errors', () => {
    expect(() => parse(['--nope'])).toThrow(expect.objectContaining({ usage: true }))
  })

  it('accepts --help alongside other flags', () => {
    expect(parse(['new', '--private', '--help']).help).toBe(true)
  })
})

describe('validateName', () => {
  it.each(['my-app', 'app2', 'a.b_c-d', 'A'])('accepts %s', (n) => {
    expect(() => validateName(n)).not.toThrow()
  })

  it.each(['', undefined, '../x', 'a b', '-x', '.hidden', 'a/b'])('rejects %j', (n) => {
    expect(() => validateName(n)).toThrow(CliError)
  })
})

describe('rewriteStarterPackage', () => {
  it('names the project and pins the library to the CLI version', () => {
    const out = rewriteStarterPackage({ name: 'starter', dependencies: { '@pglevy/sailwind': '^0.1.0', react: '^19' } }, 'my-app', '0.22.1')
    expect(out.name).toBe('my-app')
    expect(out.dependencies).toEqual({ '@pglevy/sailwind': '^0.22.1', react: '^19' })
  })

  it('does not add the dependency when the starter lacks it', () => {
    const out = rewriteStarterPackage({ name: 'starter', dependencies: { react: '^19' } }, 'my-app', '0.22.1')
    expect(out.dependencies).toEqual({ react: '^19' })
  })

  it('does not mutate its input', () => {
    const input = { name: 'starter', dependencies: { '@pglevy/sailwind': '^0.1.0' } }
    rewriteStarterPackage(input, 'my-app', '0.22.1')
    expect(input.dependencies['@pglevy/sailwind']).toBe('^0.1.0')
  })
})

describe('createGitlabRepo', () => {
  let root, dest, bare, binDir, glabLog, env

  const git = (args, cwd = dest) => {
    const r = spawnSync('git', args, { cwd, encoding: 'utf8' })
    if (r.status !== 0) throw new Error(`git ${args.join(' ')}: ${r.stderr}`)
    return r.stdout.trim()
  }

  // A stand-in for glab that records how it was called. Set FAKE_GLAB_USER_FAIL=1 to make `api user` fail.
  const fakeGlab = `#!/bin/sh
echo "NO_PROMPT=$GLAB_NO_PROMPT HOST=$GITLAB_HOST :: $*" >> "$FAKE_GLAB_LOG"
if [ "$1" = "api" ]; then
  [ -n "$FAKE_GLAB_USER_FAIL" ] && exit 1
  echo '{"username":"tester"}'
fi
exit 0
`

  beforeEach(() => {
    root = mkdtempSync(join(tmpdir(), 'sailwind-cli-test-'))
    dest = join(root, 'project')
    bare = join(root, 'remote.git')
    binDir = join(root, 'bin')
    glabLog = join(root, 'glab.log')
    for (const d of [dest, binDir]) mkdirSync(d)
    writeFileSync(join(binDir, 'glab'), fakeGlab)
    chmodSync(join(binDir, 'glab'), 0o755)
    writeFileSync(glabLog, '')
    git(['init', '-q', '--bare', bare], root)
    git(['init', '-q', '-b', 'main'])
    git(['config', 'user.email', 't@example.com'])
    git(['config', 'user.name', 'Test'])
    writeFileSync(join(dest, 'README.md'), 'hi\n')
    git(['add', '.'])
    git(['commit', '-q', '-m', 'init'])
    // Redirect the SSH remote to the local bare repo so a push can be verified offline.
    git(['config', `url.${bare}.insteadOf`, 'git@gitlab.test:tester/my-app.git'])
    env = { ...process.env, PATH: `${binDir}:${process.env.PATH}`, FAKE_GLAB_LOG: glabLog }
  })

  afterEach(() => rmSync(root, { recursive: true, force: true }))

  const calls = () => readFileSync(glabLog, 'utf8').trim().split('\n').filter(Boolean)
  const create = (opts = {}) => createGitlabRepo({ dest, name: 'my-app', host: 'gitlab.test', env, ...opts })

  it('creates an internal repo with GLAB_NO_PROMPT and --skipGitInit, then pushes', () => {
    const url = create()
    expect(url).toBe('https://gitlab.test/tester/my-app')
    const createCall = calls().find((c) => c.includes('repo create'))
    expect(createCall).toContain('NO_PROMPT=1')
    expect(createCall).toContain('HOST=gitlab.test')
    expect(createCall).toContain('repo create tester/my-app --internal --defaultBranch main --skipGitInit')
    expect(git(['remote', 'get-url', '--push', 'origin'])).toBe(bare)
    expect(git(['rev-parse', 'main'], bare)).toBe(git(['rev-parse', 'main']))
  })

  it('uses --private when asked', () => {
    create({ private: true })
    expect(calls().find((c) => c.includes('repo create'))).toContain('--private')
  })

  it('uses the group as namespace and skips the user lookup', () => {
    const url = create({ group: 'team', noPush: true })
    expect(url).toBe('https://gitlab.test/team/my-app')
    expect(calls().some((c) => c.includes(':: api'))).toBe(false)
    expect(calls().find((c) => c.includes('repo create'))).toContain('repo create team/my-app')
  })

  it('sets origin but does not push with noPush', () => {
    create({ noPush: true })
    expect(git(['remote', 'get-url', 'origin'])).toBe(bare)
    expect(spawnSync('git', ['rev-parse', 'main'], { cwd: bare }).status).not.toBe(0)
  })

  it('replaces an existing origin', () => {
    git(['remote', 'add', 'origin', 'git@example.com:old/old.git'])
    create({ noPush: true })
    expect(git(['remote', 'get-url', 'origin'])).toBe(bare)
  })

  it('fails with a manual-fix hint when the namespace cannot be resolved', () => {
    expect(() => create({ env: { ...env, FAKE_GLAB_USER_FAIL: '1' } })).toThrow(/git remote add origin git@gitlab\.test:<namespace>\/my-app\.git/)
    expect(calls().some((c) => c.includes('repo create'))).toBe(false)
  })
})
