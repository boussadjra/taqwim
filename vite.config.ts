import { defineConfig } from 'vite-plus'

// Workspace-root config. Per-package task graphs live in each package's
// own vite.config.ts — `dependsOn` may only reference that package's deps.
export default defineConfig({
  // Carried over from the previous .prettierrc so the migration to oxfmt
  // doesn't rewrite the entire codebase's style.
  fmt: {
    printWidth: 120,
    tabWidth: 2,
    useTabs: false,
    semi: false,
    singleQuote: true,
    jsxSingleQuote: false,
    quoteProps: 'as-needed',
    trailingComma: 'all',
    arrowParens: 'avoid',
    proseWrap: 'preserve',
    endOfLine: 'lf',
    ignore: ['**/dist/**', '**/.vitepress/cache/**', '**/test-results/**', 'docs/api/**', 'pnpm-lock.yaml'],
  },
  run: {
    // package.json scripts that aren't declared in a `tasks` map are
    // uncached by default; opt them in so `vp run` can skip repeat work.
    cache: { tasks: true },
  },
  // Replaces lint-staged; run by .husky/pre-commit via `vp staged`.
  staged: {
    '*.{js,jsx,ts,tsx,vue,mjs,cjs,json,css,md}': 'vp check --fix',
  },
})
