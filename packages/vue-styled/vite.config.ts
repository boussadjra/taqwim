import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite-plus'

// The library is bundled by tsdown (tsdown.config.ts). This file provides the
// Vue plugin for Vitest, plus the `vp run` task graph.
const afterDeps = [{ task: 'build', from: 'dependencies' as const }]

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'jsdom',
    include: ['tests/**/*.test.ts'],
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
        command: [
          'publint --strict',
          'attw --pack . --profile esm-only --ignore-rules internal-resolution-error no-resolution',
        ],
        dependsOn: ['build'],
        input: ['dist/**', 'package.json'],
      },
      build: {
        // tsdown first (it cleans dist/), then vue-tsc emits .d.ts into dist/types.
        command: ['tsdown', 'vue-tsc -p tsconfig.build.json'],
        dependsOn: afterDeps,
        input: ['src/**', 'env.d.ts', 'tsdown.config.ts', 'tsconfig*.json', 'package.json'],
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
