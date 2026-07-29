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
      },
      'test:e2e': {
        command: 'playwright test',
        dependsOn: afterDeps,
        cache: false,
      },
    },
  },
})
