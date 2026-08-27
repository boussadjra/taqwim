import { defineConfig } from 'vite-plus'

// Astro owns the build; this file only declares the `vp run` task graph so the
// docs rebuild when the packages they document do.
const afterDeps = [{ task: 'build', from: 'dependencies' as const }]

export default defineConfig({
  run: {
    tasks: {
      build: {
        /*
         * Two content directories are generated before Astro sees them: the
         * token reference from @taqwim/themes, and the API reference from
         * @taqwim/core via TypeDoc.
         *
         * The TypeDoc step used to be missing, and the build only worked
         * because `src/content/docs/api` was left on disk by a manual
         * `pnpm api:build`. That directory is gitignored, so every clean
         * checkout — CI, Vercel, a new contributor's first clone — died in
         * `prepare-api-docs.js` with an ENOENT on a directory nothing had
         * created yet. The build has to be self-contained.
         *
         * `pnpm -w exec` runs it from the workspace root, which is where
         * typedoc.json lives and what its `entryPoints` and `out` paths are
         * relative to.
         */
        command: [
          'node scripts/generate-tokens-page.js',
          'pnpm -w exec typedoc --excludeNotDocumented',
          'node scripts/prepare-api-docs.js',
          'astro build',
        ],
        dependsOn: afterDeps,
        input: ['src/**', 'astro.config.mjs', 'scripts/**', 'package.json'],
        output: ['dist/**'],
      },
    },
  },
})
