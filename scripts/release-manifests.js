import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import semver from 'semver'

export function readManifest(root, relativePath) {
  const path = join(root, relativePath)
  const raw = readFileSync(path, 'utf8')
  return { path, relativePath, raw, json: JSON.parse(raw) }
}

/** Versioning and publishing must operate on exactly the same public set. */
export function releaseManifests(root) {
  const config = readManifest(root, '.changeset/config.json').json
  if (
    !Array.isArray(config.fixed) ||
    config.fixed.length !== 1 ||
    !Array.isArray(config.fixed[0]) ||
    !config.fixed[0].length
  ) {
    throw new Error('expected one non-empty "fixed" group in .changeset/config.json')
  }
  const names = config.fixed[0]
  if (new Set(names).size !== names.length) throw new Error('duplicate packages in the lockstep group')

  const manifests = names.map(name => {
    if (typeof name !== 'string' || !/^@taqwim\/[a-z0-9]+(?:-[a-z0-9]+)*$/.test(name)) {
      throw new Error(`invalid lockstep package name: ${name}`)
    }
    const manifest = readManifest(root, join('packages', name.slice('@taqwim/'.length), 'package.json'))
    if (manifest.json.name !== name) throw new Error(`${manifest.relativePath}: expected name ${name}`)
    if (manifest.json.private !== false) throw new Error(`${name}: release package must declare private: false`)
    if (typeof manifest.json.version !== 'string' || semver.valid(manifest.json.version) !== manifest.json.version) {
      throw new Error(`${name}: not a valid semver version: ${manifest.json.version}`)
    }
    return manifest
  })

  const publicNames = readdirSync(join(root, 'packages'), { withFileTypes: true })
    .filter(entry => entry.isDirectory() && existsSync(join(root, 'packages', entry.name, 'package.json')))
    .map(entry => readManifest(root, join('packages', entry.name, 'package.json')).json)
    .filter(json => json.private !== true)
    .map(json => json.name)
  if (publicNames.length !== names.length || publicNames.some(name => !names.includes(name))) {
    throw new Error('public packages and the changeset lockstep group disagree')
  }
  return manifests
}
