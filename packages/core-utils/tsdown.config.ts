import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['src/lib/**/*@(ts|tsx)'],

  dts: true,
  format: ['esm', 'commonjs'],
  target: 'esnext',
})
