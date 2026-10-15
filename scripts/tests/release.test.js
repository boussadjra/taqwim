import assert from 'node:assert/strict'
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { basename, dirname, join, resolve } from 'node:path'
import { test } from 'node:test'
import { parseArgs, publishPackages, tagFor } from '../publish.js'
import { releaseManifests } from '../release-manifests.js'
import { versionWorkspace } from '../version.js'
import { prepareApiDocs } from '../../docs/scripts/prepare-api-docs.js'

const VERSION = '0.1.0-beta.8'
const NAMES = ['@taqwim/core', '@taqwim/calendar-core', '@taqwim/themes']

function fixture(t) {
  const root = mkdtempSync(join(tmpdir(), 'taqwim-release-'))
  t.after(() => {
    // Every recursive cleanup stays inside the temporary directory we created.
    assert.equal(dirname(root), resolve(tmpdir()))
    assert.ok(basename(root).startsWith('taqwim-release-'))
    rmSync(root, { recursive: true, force: true })
  })
  t.mock.method(console, 'log', () => {})
  t.mock.method(console, 'warn', () => {})

  function write(relativePath, json) {
    const path = join(root, relativePath)
    mkdirSync(dirname(path), { recursive: true })
    writeFileSync(path, `${JSON.stringify(json, null, 2)}\n`)
  }

  write('.changeset/config.json', { fixed: [NAMES] })
  for (const name of NAMES) {
    write(`packages/${name.slice('@taqwim/'.length)}/package.json`, { name, version: VERSION, private: false })
  }
  write('package.json', { name: 'taqwim', version: VERSION, private: true })
  write('docs/package.json', { name: 'taqwim-docs', version: VERSION, private: true })
  write('legacy/taqwim-core-utils/package.json', { name: 'taqwim-core-utils', version: '2.0.0' })
  return { root, write }
}

test('publish arguments reject empty values, semver ranges and shell syntax', () => {
  for (const value of ['', '1.0.0', 'v1', 'beta&echo', 'beta next', 'beta;echo', '$(echo)']) {
    assert.throws(() => parseArgs([`--tag=${value}`]), /valid dist-tag/)
  }
  for (const args of [['--tag'], ['--tag', '--dry-run'], ['--otp'], ['--otp='], ['--otp=123&echo']]) {
    assert.throws(() => parseArgs(args), /needs/)
  }
  assert.deepEqual(parseArgs(['--tag', 'beta', '--otp', '123456', '--dry-run']), {
    tag: 'beta',
    otp: '123456',
    dryRun: true,
    help: false,
  })
})

test('prerelease tags protect stable latest, including versions with build metadata', () => {
  assert.equal(tagFor('0.1.0-beta.9', new Set([VERSION])), 'latest')
  assert.equal(tagFor('1.1.0-beta.1+build.1', new Set(['1.0.0+build.2'])), 'beta')
  assert.equal(tagFor('1.1.0-1', new Set(['1.0.0'])), 'next')
  assert.equal(tagFor('1.1.0', new Set(['1.0.0'])), 'latest')
})

test('release manifests reject ambiguous groups and package paths', t => {
  const { root, write } = fixture(t)
  for (const fixed of [[], [NAMES, ['@taqwim/vue']], [[NAMES[0], NAMES[0]]], [['../../legacy']]]) {
    write('.changeset/config.json', { fixed })
    assert.throws(() => releaseManifests(root), /fixed|duplicate|invalid lockstep/)
  }
})

test('release manifests reject mismatched identity, invalid versions and private packages', t => {
  const { root, write } = fixture(t)
  for (const fields of [{ name: '@taqwim/wrong' }, { version: 'garbage' }, { private: true }, { private: undefined }]) {
    write('packages/core/package.json', { name: NAMES[0], version: VERSION, private: false, ...fields })
    assert.throws(() => releaseManifests(root), /expected name|valid semver|private: false/)
  }
})

test('publish lifecycle hooks are rejected before any registry request', async t => {
  const { root, write } = fixture(t)
  write('packages/themes/package.json', {
    name: NAMES[2],
    version: VERSION,
    private: false,
    scripts: { publish: 'pnpm publish' },
  })
  let requested = false
  await assert.rejects(
    publishPackages(
      { dryRun: true },
      {
        rootPath: root,
        versionsFor: async () => {
          requested = true
          return new Set()
        },
      },
    ),
    /remove scripts.publish/,
  )
  assert.equal(requested, false)
})

test('out-of-lockstep publication fails before registry requests', async t => {
  const { root, write } = fixture(t)
  write('packages/themes/package.json', { name: NAMES[2], version: '0.1.0-beta.7', private: false })
  let requested = false
  await assert.rejects(
    publishPackages(
      { dryRun: true },
      {
        rootPath: root,
        versionsFor: async () => {
          requested = true
          return new Set()
        },
      },
    ),
    /not in lockstep/,
  )
  assert.equal(requested, false)
})

test('publish dry runs read registry history but never invoke the publisher', async t => {
  const { root } = fixture(t)
  const requested = []
  await publishPackages(
    { dryRun: true },
    {
      rootPath: root,
      versionsFor: async name => {
        requested.push(name)
        return new Set()
      },
      publishPackage: () => assert.fail('dry run invoked a publisher'),
    },
  )
  assert.deepEqual(requested, NAMES)
})

test('partial releases resume and stable history from any package protects latest', async t => {
  const { root } = fixture(t)
  const published = []
  await publishPackages(
    {},
    {
      rootPath: root,
      versionsFor: async name => new Set(name === NAMES[0] ? [VERSION] : name === NAMES[1] ? ['1.0.0'] : []),
      publishPackage: (name, options) => {
        published.push({ name, tag: options.tag })
        return true
      },
    },
  )
  assert.deepEqual(
    published,
    NAMES.slice(1).map(name => ({ name, tag: 'beta' })),
  )
})

test('a failed publication does not hide outcomes for later packages', async t => {
  const { root } = fixture(t)
  const attempted = []
  await assert.rejects(
    publishPackages(
      {},
      {
        rootPath: root,
        versionsFor: async () => new Set(),
        publishPackage: name => {
          attempted.push(name)
          return name !== NAMES[1]
        },
      },
    ),
    /1 of 3 failed/,
  )
  assert.deepEqual(attempted, NAMES)
})

test('version dry runs preflight the final manifest and failed bumps write nothing', t => {
  const { root } = fixture(t)
  // A valid JSON manifest with unexpected indentation used to fail only after
  // every published package and the workspace root had already been rewritten.
  writeFileSync(join(root, 'docs/package.json'), JSON.stringify({ name: 'taqwim-docs', version: VERSION }))
  const before = readFileSync(join(root, 'packages/core/package.json'), 'utf8')
  for (const dryRun of [true, false]) {
    assert.throws(() => versionWorkspace({ target: 'prerelease', dryRun }, root), /version.*replace/)
    assert.equal(readFileSync(join(root, 'packages/core/package.json'), 'utf8'), before)
    assert.equal(JSON.parse(readFileSync(join(root, 'package.json'), 'utf8')).version, VERSION)
  }
})

test('successful version bumps preserve manifest content and leave legacy versions frozen', t => {
  const { root, write } = fixture(t)
  write('packages/core/package.json', {
    name: NAMES[0],
    version: VERSION,
    private: false,
    config: { version: 'untouched' },
  })
  const path = join(root, 'packages/core/package.json')
  const before = readFileSync(path, 'utf8')
  versionWorkspace({ target: 'prerelease', dryRun: true }, root)
  assert.equal(readFileSync(path, 'utf8'), before)
  versionWorkspace({ target: 'prerelease', dryRun: false }, root)
  assert.equal(readFileSync(path, 'utf8'), before.replace(`"version": "${VERSION}"`, '"version": "0.1.0-beta.9"'))
  for (const relative of ['package.json', 'docs/package.json', 'packages/themes/package.json']) {
    assert.equal(JSON.parse(readFileSync(join(root, relative), 'utf8')).version, '0.1.0-beta.9')
  }
  assert.equal(JSON.parse(readFileSync(join(root, 'legacy/taqwim-core-utils/package.json'), 'utf8')).version, '2.0.0')
})

test('the fixed group cannot silently omit a public package', t => {
  const { root, write } = fixture(t)
  write('packages/vue/package.json', { name: '@taqwim/vue', version: VERSION, private: false })
  assert.throws(() => releaseManifests(root), /public packages.*disagree/)
})

test('ambiguous duplicate version fields fail before rewriting any manifest', t => {
  const { root } = fixture(t)
  writeFileSync(
    join(root, 'docs/package.json'),
    `{
  "name": "taqwim-docs",
  "version": "${VERSION}",
  "version": "${VERSION}"
}\n`,
  )
  const before = readFileSync(join(root, 'packages/core/package.json'), 'utf8')
  assert.throws(() => versionWorkspace({ target: 'prerelease', dryRun: false }, root), /unambiguously/)
  assert.equal(readFileSync(join(root, 'packages/core/package.json'), 'utf8'), before)
})

test('API generation rewrites identifier routes and fragments, disables editing and is idempotent', t => {
  const { root } = fixture(t)
  const api = join(root, 'api')
  mkdirSync(join(api, 'functions'), { recursive: true })
  mkdirSync(join(api, 'classes'), { recursive: true })
  writeFileSync(join(api, 'README.md'), '# @taqwim/core\n\n[toHijri](functions/toHijri.md#parameters)\n')
  writeFileSync(
    join(api, 'functions/toHijri.md'),
    '# Function: toHijri()\n\n[Home](../README.md)\n[Error](../classes/HijriRangeError.md)\n[Source](https://example.com/README.md)\n',
  )
  writeFileSync(join(api, 'classes/HijriRangeError.md'), "# HijriRangeError's contract\n")

  assert.equal(prepareApiDocs(api), 3)
  assert.match(readFileSync(join(api, 'README.md'), 'utf8'), /\]\(\/api\/functions\/tohijri\/#parameters\)/)
  const functionPage = readFileSync(join(api, 'functions/toHijri.md'), 'utf8')
  assert.match(functionPage, /\]\(\/api\/readme\/\)/)
  assert.match(functionPage, /\]\(\/api\/classes\/hijrirangeerror\/\)/)
  assert.match(functionPage, /editUrl: false/)
  assert.match(functionPage, /https:\/\/example.com\/README\.md/)
  assert.doesNotMatch(functionPage, /^# Function:/m)
  assert.match(readFileSync(join(api, 'classes/HijriRangeError.md'), 'utf8'), /title: 'HijriRangeError''s contract'/)
  assert.equal(prepareApiDocs(api), 0)
  assert.equal(readFileSync(join(api, 'functions/toHijri.md'), 'utf8'), functionPage)
})

test('API generation repairs previously prepared pages without duplicate frontmatter', t => {
  const { root } = fixture(t)
  const api = join(root, 'api')
  mkdirSync(api)
  writeFileSync(
    join(api, 'README.md'),
    '---\ntitle: API\neditUrl: https://example.com/edit\n---\n\n[Home](README.md)\n',
  )
  prepareApiDocs(api)
  assert.equal(
    readFileSync(join(api, 'README.md'), 'utf8'),
    '---\ntitle: API\neditUrl: false\n---\n\n[Home](/api/readme/)\n',
  )
})

test('a broken generated API link fails preflight before any page is rewritten', t => {
  const { root } = fixture(t)
  const api = join(root, 'api')
  mkdirSync(api)
  const first = '# API\n'
  const second = '# Missing\n\n[Missing](not-emitted.md)\n'
  writeFileSync(join(api, 'README.md'), first)
  writeFileSync(join(api, 'z.md'), second)
  assert.throws(() => prepareApiDocs(api), /unresolved generated API link/)
  assert.equal(readFileSync(join(api, 'README.md'), 'utf8'), first)
  assert.equal(readFileSync(join(api, 'z.md'), 'utf8'), second)
})
