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
    logo: 'https://raw.githubusercontent.com/boussadjra/taqwim/main/docs/assets/logo.svg',
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guide/get-started' },
      { text: 'Playground', link: '/guide/playground' },
      { text: 'API', link: '/api/globals' },
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
        text: 'Vue Components',
        items: [
          { text: 'Getting Started', link: '/guide/vue/get-started' },
          { text: 'Interactive Demo', link: '/guide/playground' },
          {
            text: 'Calendar Components',
            items: [
              { text: 'HijriCalendarRoot', link: '/guide/vue/calendar/root' },
              { text: 'HijriCalendarHeader', link: '/guide/vue/calendar/header' },
              { text: 'HijriCalendarGrid', link: '/guide/vue/calendar/grid' },
              { text: 'Theming System', link: '/guide/themes' },
            ],
          },
          {
            text: 'DatePicker Components',
            items: [
              { text: 'Props', link: '/guide/vue/datepicker/props' },
              { text: 'Slots', link: '/guide/vue/datepicker/slots' },
              { text: 'Events', link: '/guide/vue/datepicker/events' },
            ],
          },
        ],
      },
      {
        text: 'Themes & Playground',
        items: [
          { text: 'Theme System', link: '/guide/themes' },
          { text: 'Interactive Playground', link: '/guide/playground' },
          { text: 'Brutalist Theme', link: '/themes/default' },
          { text: 'Islamic Royal Themes', link: '/themes/islamic' },
          { text: 'Vercel Inspired', link: '/themes/modern' },
          { text: 'Custom Themes', link: '/themes/custom' },
        ],
      },
      {
        text: 'API Reference',
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
  vue: {
    // Enable Vue components in markdown
    template: {
      compilerOptions: {
        isCustomElement: tag => tag.includes('-'),
      },
    },
  },
})
