import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite-plus'

// The library is bundled by tsdown (tsdown.config.ts). This file provides the
// React plugin for Vitest, plus the `vp run` task graph.
const afterDeps = [{ task: 'build', from: 'dependencies' as const }]

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    include: ['tests/**/*.test.tsx'],
  },
  run: {
    tasks: {
      /*
       * publint checks the export map and the files list; attw checks that the
       * types resolve under every module resolution a consumer might use.
       * With thirteen packages this is the likeliest shipping bug, and neither
       * the build nor the tests would notice one.
       *
       * The two ignored rules are artefacts of packing a workspace package
       * whose @taqwim/* siblings are not on npm yet, so their types cannot
       * resolve from inside the tarball. Remove them after the first publish —
       * at that point they would be reporting something real.
       */
      'verify-package': {
        command: ['publint --strict', 'attw --pack . --ignore-rules internal-resolution-error no-resolution'],
        dependsOn: ['build'],
        input: ['dist/**', 'package.json'],
      },
      build: {
        command: 'tsdown',
        dependsOn: afterDeps,
        input: ['src/**', 'tsdown.config.ts', 'tsconfig.json', 'package.json'],
        output: ['dist/**'],
      },
      test: {
        command: 'vitest run',
        dependsOn: afterDeps,
        input: ['src/**', 'tests/**', 'vite.config.ts', 'package.json'],
      },
    },
  },
})
