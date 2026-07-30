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
