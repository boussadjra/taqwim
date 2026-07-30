import { svelte } from '@sveltejs/vite-plugin-svelte'
import { defineConfig } from 'vite-plus'

const afterDeps = [{ task: 'build', from: 'dependencies' as const }]

export default defineConfig({
  plugins: [svelte()],
  server: { port: 5175 },
  preview: { port: 5175 },
  run: { tasks: { build: { command: 'vite build', dependsOn: afterDeps, output: ['dist/**'] } } },
})
