import angular from '@analogjs/vite-plugin-angular'
import { defineConfig } from 'vite-plus'

const afterDeps = [{ task: 'build', from: 'dependencies' as const }]

export default defineConfig({
  plugins: [angular({ jit: true })],
  server: { port: 5177 },
  preview: { port: 5177 },
  run: { tasks: { build: { command: 'vite build', dependsOn: afterDeps, output: ['dist/**'] } } },
})
