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
  // Pinned like the other four, so `pnpm dev` and the Playwright project agree
  // on the port instead of relying on Vite's default.
  server: { port: 5173 },
  preview: { port: 5173 },
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
        // Declared so the task caches: `--build` writes a tsbuildinfo under
        // node_modules/.tmp, and with no `input` vp treats that as the task
        // rewriting its own inputs and refuses to cache it.
        input: ['src/**', 'env.d.ts', 'tsconfig*.json', 'package.json'],
      },
    },
  },
})
