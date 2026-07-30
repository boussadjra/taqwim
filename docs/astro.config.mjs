import starlight from '@astrojs/starlight'
import { defineConfig } from 'astro/config'

/**
 * Starlight rather than VitePress, because the docs have to render live
 * examples in five frameworks on one page — Astro islands make that possible,
 * a Vue-only site does not.
 */
export default defineConfig({
  site: 'https://boussadjra.github.io',
  base: '/taqwim',
  integrations: [
    starlight({
      title: 'Taqwim',
      logo: { src: './public/logo.svg', alt: 'Taqwim' },
      description: 'Hijri date utilities and accessible calendar components for Vue, React, Svelte, Solid and Angular.',
      social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/boussadjra/taqwim' }],
      editLink: { baseUrl: 'https://github.com/boussadjra/taqwim/edit/main/docs/' },
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
