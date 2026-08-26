import react from '@astrojs/react'
import solid from '@astrojs/solid-js'
import starlight from '@astrojs/starlight'
import svelte from '@astrojs/svelte'
import vue from '@astrojs/vue'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'astro/config'

/**
 * Starlight rather than VitePress, because the docs have to render live
 * examples in five frameworks on one page — Astro islands make that possible,
 * a Vue-only site does not.
 *
 * The examples are the real components from the real packages, not a
 * reimplementation: `src/components/demos/<framework>/` imports
 * `@taqwim/<framework>-styled` the way a reader's app would. If an adapter
 * breaks, the docs break with it.
 */
export default defineConfig({
  site: 'https://boussadjra.github.io',
  base: '/taqwim',
  vite: {
    resolve: {
      /*
       * Every styled package starts with `import '@taqwim/themes'`, which
       * resolves to a `.css` file. In the dev SSR pass that import is the one
       * specifier Vite leaves bare: it resolves fine, but the rewrite to
       * `/@fs/…` that `@taqwim/react` and friends get does not happen for a
       * CSS target, so the module runner hands the raw id to `fetchModule`.
       * That function externalises *any* bare specifier it is given — it
       * passes `noExternal: []` explicitly and skips the check that would
       * reject a non-JS file — so Node's ESM loader is asked to import the
       * stylesheet and throws `ERR_UNKNOWN_FILE_EXTENSION`, failing every
       * island on the page. `noExternal` below cannot prevent it, because
       * that code path never consults it.
       *
       * Aliasing the bare entry to the file it already resolves to keeps the
       * specifier from ever reaching that branch, and Vite serves the CSS the
       * way it does for the client. Exact-match on purpose: the subpaths
       * (`@taqwim/themes/names`) are real JS and must keep resolving normally.
       * Only dev is affected; `astro build` bundles the CSS correctly.
       */
      alias: [
        {
          find: /^@taqwim\/themes$/,
          replacement: fileURLToPath(new URL('../packages/themes/dist/index.css', import.meta.url)),
        },
      ],
      /*
       * The styled packages must still be bundled rather than externalised,
       * or the SSR pass loads their published `dist` through Node and loses
       * Vite's transforms entirely.
       */
      noExternal: [/^@taqwim\//],
      /*
       * …and once they are bundled, each one resolves `vue` (or `solid-js`, …)
       * from its own `node_modules`, which under pnpm is a different copy from
       * the docs'. Two copies of Vue means `renderSlot` reads a
       * `currentRenderingInstance` that the other copy set, and every calendar
       * dies on `Cannot read properties of null`. Solid fails the same way,
       * more quietly: its islands simply render nothing.
       */
      dedupe: ['vue', 'react', 'react-dom', 'svelte', 'solid-js'],
    },
  },
  integrations: [
    /*
     * React and Solid both claim `.tsx`, so each is scoped to its own demo
     * directory. Without the scoping the first one registered swallows the
     * other's components and they fail to hydrate.
     */
    react({ include: ['**/demos/react/**'] }),
    /*
     * Solid's filter has to reach the adapter as well as the demo.
     * `@taqwim/solid*` publishes uncompiled JSX under the `solid` export
     * condition — `dist/source/*.jsx` — and Vite resolves that here. Left out
     * of the filter, nobody runs the Solid transform over it and the island
     * server-renders to nothing at all, silently.
     */
    solid({
      include: ['**/demos/solid/**', '**/packages/solid/dist/source/**', '**/packages/solid-styled/dist/source/**'],
    }),
    vue(),
    svelte(),
    starlight({
      title: 'Taqwim',
      logo: { src: './public/logo.svg', alt: 'Taqwim' },
      description: 'Hijri date utilities and accessible calendar components for Vue, React, Svelte, Solid and Angular.',
      social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/boussadjra/taqwim' }],
      editLink: { baseUrl: 'https://github.com/boussadjra/taqwim/edit/main/docs/' },
      customCss: ['./src/styles/theme.css', './src/styles/demo.css'],
      head: [
        {
          /*
           * The framework choice has to land on <html> before first paint, or
           * the page renders every framework's examples and then collapses to
           * one. Inline and blocking on purpose: it is three lines, and the
           * module script in `FrameworkSwitcher.astro` is deferred.
           */
          tag: 'script',
          content: `try{document.documentElement.dataset.framework=localStorage.getItem('taqwim-framework')||'vue'}catch(e){document.documentElement.dataset.framework='vue'}`,
        },
      ],
      components: {
        // Adds the framework switcher above every page's content.
        PageTitle: './src/components/PageTitle.astro',
      },
      sidebar: [
        {
          label: 'Guide',
          items: [
            { label: 'Getting started', slug: 'guide/getting-started' },
            { label: 'Migrating to 1.0', slug: 'guide/migration' },
            { label: 'Theming', slug: 'guide/theming' },
            { label: 'Accessibility and keyboard', slug: 'guide/accessibility' },
            { label: 'Server rendering', slug: 'guide/ssr' },
          ],
        },
        {
          label: 'Frameworks',
          items: [
            { label: 'Vue', slug: 'frameworks/vue' },
            { label: 'React', slug: 'frameworks/react' },
            { label: 'Svelte', slug: 'frameworks/svelte' },
            { label: 'Solid', slug: 'frameworks/solid' },
            { label: 'Angular', slug: 'frameworks/angular' },
          ],
        },
        {
          label: 'Reference',
          items: [
            { label: 'Calendar options', slug: 'reference/options' },
            { label: 'Data attributes', slug: 'reference/attributes' },
            { label: 'Design tokens', slug: 'reference/tokens' },
          ],
        },
        {
          label: 'API',
          // Generated from @taqwim/core by TypeDoc; see typedoc.json.
          items: [{ autogenerate: { directory: 'api' } }],
        },
      ],
    }),
  ],
})
