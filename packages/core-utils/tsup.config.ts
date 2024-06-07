import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/lib/**/*@(ts|tsx)'],

  dts: true,
  format: ['esm'],
  target: 'esnext',
})
