import { defineConfig } from 'vite-plus'
import solid from 'vite-plugin-solid'

const afterDeps = [{ task: 'build', from: 'dependencies' as const }]

export default defineConfig({
  plugins: [solid()],
  server: { port: 5176 },
  preview: { port: 5176 },
  run: {
    tasks: {
      build: { command: 'vite build', dependsOn: afterDeps, output: ['dist/**'] },
      'type-check': {
        // Same rules the adapter is held to; see tsconfig.json.
        command: 'tsc --noEmit',
        dependsOn: afterDeps,
        input: ['src/**', 'env.d.ts', 'tsconfig.json', 'package.json'],
      },
    },
  },
})
