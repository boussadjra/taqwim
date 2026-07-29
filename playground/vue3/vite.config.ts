import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite-plus'
import vue from '@vitejs/plugin-vue'

const afterDeps = [{ task: 'build', from: 'dependencies' as const }]

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  run: {
    tasks: {
      build: {
        command: 'vite build',
        dependsOn: afterDeps,
        output: ['dist/**'],
      },
      'type-check': {
        command: 'vue-tsc --build --force',
        dependsOn: afterDeps,
      },
    },
  },
})
