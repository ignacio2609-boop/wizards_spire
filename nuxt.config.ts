// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite';
import { DICE_BOX_ASSET_PATH } from './shared/dice-box';

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@nuxt/eslint',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@nuxtjs/i18n',
    'pinia-plugin-persistedstate/nuxt',
  ],
  i18n: {
    defaultLocale: 'en',
    locales: [
      { code: 'en', file: 'en.json', name: 'English' },
      { code: 'es', file: 'es.json', name: 'Español' },
    ],
  },
  css: ['~/assets/css/global.css'],
  nitro: {
    publicAssets: [
      {
        baseURL: DICE_BOX_ASSET_PATH,
        // Nitro resolves this relative to the server/ directory
        dir: '../node_modules/@3d-dice/dice-box/dist/assets',
      },
    ],
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
