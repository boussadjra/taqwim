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
