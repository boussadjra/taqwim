import { defineConfig } from 'vite-plus'
import solid from 'vite-plugin-solid'

const afterDeps = [{ task: 'build', from: 'dependencies' as const }]

export default defineConfig({
  plugins: [solid()],
  server: { port: 5176 },
  preview: { port: 5176 },
  run: { tasks: { build: { command: 'vite build', dependsOn: afterDeps, output: ['dist/**'] } } },
})
