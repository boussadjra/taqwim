import { defineConfig } from 'vite-plus'

// Astro owns the build; this file only declares the `vp run` task graph so the
// docs rebuild when the packages they document do.
const afterDeps = [{ task: 'build', from: 'dependencies' as const }]

export default defineConfig({
  run: {
    tasks: {
      build: {
        // The token reference is generated from @taqwim/themes first.
        command: ['node scripts/generate-tokens-page.js', 'node scripts/prepare-api-docs.js', 'astro build'],
        dependsOn: afterDeps,
        input: ['src/**', 'astro.config.mjs', 'scripts/**', 'package.json'],
        output: ['dist/**'],
      },
    },
  },
})
