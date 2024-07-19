import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Taqwim',
  description: 'Docs for taqwim date picker and calendar',
  markdown: {
    theme: {
      light: 'one-light',
      dark: 'one-dark-pro',
    },
  },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: '../assets/logo.svg',
    nav: [
      { text: 'Home', link: '/get-started' },
      { text: 'API', link: '/api/convert' },
    ],

    sidebar: [
      {
        text: 'Guide',
        items: [
          { text: 'Getting Started', link: '/guide/get-started' },
          { text: 'Convert to Hijri', link: '/guide/to-hijri' },
          { text: 'Convert to Gregorian', link: '/guide/to-gregorian' },
        ],
      },
      {
        text: 'API',
        items: [{ text: 'Functions', link: '/api/globals' }],
      },
    ],
    siteTitle: 'Taqwim',
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2024-present Boussadjra Brahim',
    },
    socialLinks: [{ icon: 'github', link: 'https://github.com/boussadjra/taqwim' }],
  },
})
