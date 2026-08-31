/**
 * The CommonJS leg of the runtime matrix: loads the package's `require` entry
 * and runs `checks.mjs` against it.
 *
 * The point of this leg is the interop boundary, not the arithmetic. tsdown
 * emits the CommonJS bundle separately, and a named export can be dropped
 * there while the ESM build stays intact — `checks.mjs` compares the whole
 * export list precisely so that shows up.
 *
 * `checks.mjs` is ESM and stays that way; a dynamic `import()` from CommonJS
 * is supported by both runtimes that run this file. Deno is not one of them:
 * Deno consumers reach the package through `npm:@taqwim/core`, which resolves
 * the `import` condition, so there is no CommonJS story there to test.
 */
const [entryPath, civilPath, tblaPath] = process.argv.slice(2)

async function main() {
  const { exit, report } = await import('./checks.mjs')

  if (!entryPath) {
    console.log('FAIL harness: no entry path was passed; run this through runtimes/run.mjs')
    console.log('RESULT cjs 0 1 0')
    exit(1)
    return
  }

  const taqwim = require(entryPath)
  const civil = require(civilPath)
  const tbla = require(tblaPath)

  exit(report(taqwim, 'cjs', civil, tbla))
}

main()
