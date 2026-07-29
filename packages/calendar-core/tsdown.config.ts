import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['src/index.ts'],
  platform: 'neutral',
  dts: true,
  format: ['esm', 'commonjs'],
  target: 'esnext',
})
