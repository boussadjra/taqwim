import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite-plus'
import vue from '@vitejs/plugin-vue'

// The library itself is bundled by tsdown (tsdown.config.ts). This file
// provides the Vue plugin for Vitest, plus the `vp run` task graph.
const afterDeps = [{ task: 'build', from: 'dependencies' as const }]

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    environment: 'jsdom',
    include: ['tests/**/*.test.ts'],
    exclude: ['tests/e2e/**'],
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
      'type-check': {
        command: 'vue-tsc --build --force',
        dependsOn: afterDeps,
        // Declared so the task caches: `--build` writes a tsbuildinfo and an
        // outDir under node_modules/.tmp, and with no `input` vp treats that
        // as the task rewriting its own inputs and refuses to cache it.
        input: ['src/**', 'tests/**', 'env.d.ts', 'tsconfig*.json', 'package.json'],
      },
    },
  },
})
