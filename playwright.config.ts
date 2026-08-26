import { defineConfig, devices } from '@playwright/test'

/**
 * One spec directory, five framework projects.
 *
 * Because every adapter binds to the same `@taqwim/calendar-core` store and
 * emits the same `data-*` attributes, `e2e/specs/` is written against the DOM
 * alone and runs unchanged against them. That is what makes cross-framework
 * parity a CI signal rather than a promise.
 *
 * Where an adapter does not yet pass, the gap is recorded in e2e/KNOWN-GAPS.md
 * rather than papered over in the spec.
 *
 * Each project serves its own playground, and each playground implements the
 * same query-string harness contract (`e2e/harness.ts`).
 */

const FRAMEWORKS = [
  { name: 'vue', port: 5173, filter: 'taqwim-playground-vue' },
  { name: 'react', port: 5174, filter: 'taqwim-playground-react' },
  { name: 'svelte', port: 5175, filter: 'taqwim-playground-svelte' },
  { name: 'solid', port: 5176, filter: 'taqwim-playground-solid' },
  /*
   * Angular is defined but not in the default run.
   * `@analogjs/vite-plugin-angular` does not compile the app under Vite 8 — it
   * leaves `@Component` decorators for Vite's own transform, so the playground
   * never bootstraps. Until that lands, `@taqwim/angular` is verified by `ngc`
   * with `strictTemplates` on every build, and this project is *not* evidence
   * of DOM-level parity for Angular. Run it explicitly with
   * `playwright test --project=angular` once the plugin catches up.
   */
  { name: 'angular', port: 5177, filter: 'taqwim-playground-angular', default: false },
] as const

const DEFAULT_FRAMEWORKS = FRAMEWORKS.filter(framework => !('default' in framework) || framework.default)

/*
 * Playwright has no notion of a project that is declared but off by default, so
 * the config reads its own command line and only declares Angular when it has
 * been asked for by name. Filtering `webServer` alone was not enough: the
 * Angular project still ran, against a port nothing was listening on, and plain
 * `playwright test` reported 28 failures that said nothing about the adapter.
 */
const ARGV = process.argv.join(' ')
const PROJECTS = /--project[= ]angular\b/.test(ARGV) ? FRAMEWORKS : DEFAULT_FRAMEWORKS

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

  // Angular stays declared so it can be run on demand; only the defaults run in CI.
  projects: PROJECTS.map(({ name, port }) => ({
    name,
    use: { baseURL: `http://localhost:${port}` },
  })),

  webServer: PROJECTS.map(({ port, filter }) => ({
    command: `pnpm --filter ${filter} exec vite --port ${port} --strictPort`,
    url: `http://localhost:${port}`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  })),
})
