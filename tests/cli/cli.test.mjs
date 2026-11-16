// Runs the real CLI as a subprocess. These cover the contract agents rely on: exit codes and messages.
import { spawnSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

const BIN = fileURLToPath(new URL('../../bin/sailwind.mjs', import.meta.url))
const cli = (args, opts = {}) => spawnSync(process.execPath, [BIN, ...args], { encoding: 'utf8', ...opts })

describe('sailwind CLI', () => {
  it('prints help and exits 0 for --help', () => {
    const r = cli(['--help'])
    expect(r.status).toBe(0)
    expect(r.stdout).toContain('Usage:')
    expect(r.stdout).toContain('--no-push')
  })

  it('prints help and exits 1 with no command', () => {
    const r = cli([])
    expect(r.status).toBe(1)
    expect(r.stdout).toContain('Usage:')
  })

  it('exits 1 on an unknown command', () => {
    const r = cli(['bogus'])
    expect(r.status).toBe(1)
    expect(r.stderr).toContain('unknown command "bogus"')
  })

  it('exits 1 on an unknown option', () => {
    const r = cli(['new', 'x', '--nope'])
    expect(r.status).toBe(1)
    expect(r.stderr).toContain('unknown option --nope')
  })

  it('exits 1 when the project name is missing', () => {
    const r = cli(['new'])
    expect(r.status).toBe(1)
    expect(r.stderr).toContain('missing project name')
  })

  it('exits 1 on an invalid project name', () => {
    expect(cli(['new', '../escape']).status).toBe(1)
  })

  it('exits 1 when GitLab-only flags are used without --gitlab', () => {
    const r = cli(['new', 'x', '--private'])
    expect(r.status).toBe(1)
    expect(r.stderr).toContain('only apply with --gitlab')
  })

  it('doctor exits 1 and shows fixes when tools are missing', () => {
    const r = cli(['doctor'], { env: { ...process.env, PATH: '' } })
    expect(r.status).toBe(1)
    expect(r.stdout).toContain('✗ git')
    expect(r.stdout).toContain('xcode-select --install')
  })

  describe('new into an existing directory', () => {
    let parent
    beforeEach(() => {
      parent = mkdtempSync(join(tmpdir(), 'sailwind-cli-new-'))
      mkdirSync(join(parent, 'taken'))
    })
    afterEach(() => rmSync(parent, { recursive: true, force: true }))

    it('refuses before downloading anything', () => {
      const r = cli(['new', 'taken', '--dest', parent])
      expect(r.status).toBe(1)
      expect(r.stderr).toContain('directory already exists')
      expect(r.stdout).not.toContain('Downloading')
    })
  })
})
