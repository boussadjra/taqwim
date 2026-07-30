import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite-plus'

const afterDeps = [{ task: 'build', from: 'dependencies' as const }]

export default defineConfig({
  plugins: [react()],
  server: { port: 5174 },
  preview: { port: 5174 },
  run: { tasks: { build: { command: 'vite build', dependsOn: afterDeps, output: ['dist/**'] } } },
})
