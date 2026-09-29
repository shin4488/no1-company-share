import { fileURLToPath } from 'node:url';
import { defineNuxtConfig } from 'nuxt/config';
import { ja } from 'vuetify/locale';

const siteDescription = '福井のNo.1企業を共有しよう！';

export default defineNuxtConfig({
  compatibilityDate: '2026-09-29',
  srcDir: 'front',
  serverDir: 'server',
  dir: { public: 'front/static' },
  devServer: {
    host: '0.0.0.0',
    port: Number(process.env.NUXT_PORT || 3100),
  },
  alias: {
    '@f': fileURLToPath(new URL('./front', import.meta.url)),
    '@c': fileURLToPath(new URL('./common', import.meta.url)),
    '@s': fileURLToPath(new URL('./server', import.meta.url)),
  },
  css: ['@mdi/font/css/materialdesignicons.css'],
  modules: ['vuetify-nuxt-module', '@vite-pwa/nuxt'],
  nitro: {
    esbuild: {
      options: {
        tsconfigRaw: {
          compilerOptions: { experimentalDecorators: true },
        },
      },
    },
  },
  app: {
    head: {
      title: 'No1企業共有アプリ',
      titleTemplate: `F1C - %s | ${siteDescription}`,
      htmlAttrs: { lang: 'ja', prefix: 'og: http://ogp.me/ns#' },
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: '' },
        { name: 'format-detection', content: 'telephone=no' },
        { name: 'twitter:card', content: 'summary' },
        { property: 'og:title', content: 'F1C' },
        { property: 'og:description', content: siteDescription },
        {
          property: 'og:image',
          content:
            'http://illustrain.com/img/work/2016/illustrain04-kaisya01.png',
        },
      ],
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    },
  },
  vuetify: {
    moduleOptions: { importComposables: false },
    vuetifyOptions: {
      locale: { locale: 'ja', messages: { ja } },
      theme: {
        defaultTheme: 'light',
        themes: {
          light: {
            colors: {
              primary: '#6D9EEB',
              secondary: '#616161',
              accent: '#ECF2FD',
              error: '#E06666',
              success: '#B6D7A8',
              warning: '#FFD966',
              primaryText: '#a4a6a4',
              secondaryText: '#555555',
              accentText: '#555555',
              errorText: '#212121',
              successText: '#212121',
              warningText: '#212121',
              bookmark: '#ef5350',
            },
          },
        },
      },
    },
  },
  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'No1企業共有アプリ',
      short_name: 'F1C',
      lang: 'ja',
      start_url: '/home',
      display: 'standalone',
      theme_color: '#6D9EEB',
    },
    workbox: {
      importScripts: ['/firebase-auth-sw.js'],
      navigateFallback: null,
    },
  },
});
