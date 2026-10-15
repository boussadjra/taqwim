import { defineConfig, devices } from '@playwright/test'

/**
 * One spec directory, five framework projects.
 *
 * Because every adapter binds to the same `@taqwim/calendar-core` store and
 * emits the same `data-*` attributes, `e2e/specs/` is written against the DOM
 * alone and runs unchanged against them. That is what makes cross-framework
 * parity a CI signal rather than a promise.
 *
 * Each project serves its own playground, and each playground implements the
 * same query-string harness contract (`e2e/harness.ts`).
 */

const FRAMEWORKS = [
  { name: 'vue', port: 5173, filter: 'taqwim-playground-vue' },
  { name: 'react', port: 5174, filter: 'taqwim-playground-react' },
  { name: 'svelte', port: 5175, filter: 'taqwim-playground-svelte' },
  { name: 'solid', port: 5176, filter: 'taqwim-playground-solid' },
  { name: 'angular', port: 5177, filter: 'taqwim-playground-angular' },
] as const

export default defineConfig({
  testDir: './e2e/specs',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',

  use: {
    trace: 'on-first-retry',
    ...devices['Desktop Chrome'],
  },

  projects: FRAMEWORKS.map(({ name, port }) => ({
    name,
    use: { baseURL: `http://localhost:${port}` },
  })),

  webServer: FRAMEWORKS.map(({ port, filter }) => ({
    command: `pnpm --filter ${filter} exec vite --port ${port} --strictPort`,
    url: `http://localhost:${port}`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  })),
})
