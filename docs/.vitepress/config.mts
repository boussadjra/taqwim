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
        text: 'Core',
        items: [
          { text: 'Getting Started', link: '/guide/get-started' },
          { text: 'Convert to Hijri', link: '/guide/to-hijri' },
          { text: 'Convert to Gregorian', link: '/guide/to-gregorian' },
        ],
      },
      {
        text: 'Vue',
        items: [
          { text: 'Getting Started', link: '/guide/vue/get-started' },
          {
            text: 'Components',
            link: '/guide/vue/components',
            items: [
              {
                text: 'DatePicker',
                link: '/guide/vue/datepicker',
                items: [
                  { text: 'Props', link: '/guide/vue/datepicker/props' },
                  { text: 'Slots', link: '/guide/vue/datepicker/slots' },
                  { text: 'Events', link: '/guide/vue/datepicker/events' },
                ],
              },
            ],
          },
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
