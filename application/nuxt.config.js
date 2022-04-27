import colors from 'vuetify/es5/util/colors';
// eslint-disable-next-line nuxt/no-cjs-in-config
const path = require('path');

const axiosBaseUrl = '/api/v1';
const port = process.env.NUXT_PORT;

export default {
  watchers: {
    webpack: {
      ignored: /node_modules/,
      poll: true,
    },
  },
  server: {
    host: '0.0.0.0',
    port,
  },
  srcDir: './front',
  serverMiddleware: ['~~/server/'],
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: '%s - no1-company-share',
    title: 'no1-company-share',
    htmlAttrs: {
      lang: 'en',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [],

  router: {
    middleware: ['router'],
  },

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: ['~/plugins/axios/axios.ts'],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
    // storeをtypescriptで$accessインテリセンス可能とするため
    'nuxt-typed-vuex',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    '@nuxtjs/firebase',
  ],

  firebase: {
    config: {
      apiKey: 'AIzaSyCPvuvm4wNrjLlpixP2xyUgsaYnIj2cub0',
      authDomain: 'no1-company-share.firebaseapp.com',
      projectId: 'no1-company-share',
      storageBucket: 'no1-company-share.appspot.com',
      messagingSenderId: '650436262386',
      appId: '1:650436262386:web:9a17e3aacca532fb82d36b',
      measurementId: 'G-ZJVQSKLGQ0',
    },
    services: {
      auth: {
        initialize: {
          onAuthStateChangedAction:
            'firebaseAuthorization/onAuthStateChangedAction',
        },
      },
      analytics: true,
    },
  },

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    // Workaround to avoid enforcing hard-coded localhost:3000: https://github.com/nuxt-community/axios-module/issues/308
    // baseUrlとproxyは同時に使用できないためprefixにしている
    // https://axios.nuxtjs.org/options/#baseurl
    prefix: axiosBaseUrl,
    proxy: true,
  },
  // ssr時のservermiddleware呼び出しはnuxtサーバを指定しないといけない
  // この指定がないとnginxサーバ向けのリクエストになる
  proxy: {
    [`${axiosBaseUrl}/localhost/`]: {
      target: `http://localhost:${port}`,
      pathRewrite: { '/localhost/': '/' },
    },
  },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: false,
      themes: {
        dark: {
          primary: colors.blue.darken3,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3,
        },
        light: {
          primary: '#6D9EEB',
          secondary: colors.grey.darken2,
          accent: '#ECF2FD',
          error: '#E06666',
          success: '#B6D7A8',
          warning: '#FFD966',
          primaryText: '#a4a6a4',
          secondaryText: '#555555',
          accentText: '#555555',
          errorText: colors.grey.darken4,
          successText: colors.grey.darken4,
          warningText: colors.grey.darken4,
          bookmark: colors.red.lighten1,
        },
      },
    },
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    extend(config) {
      config.resolve.alias['@f'] = path.resolve(__dirname, 'front');
      config.resolve.alias['@c'] = path.resolve(__dirname, 'common');
    },
    // storeをtypescriptで$accessインテリセンス可能とするため
    transpile: [/typed-vuex/],
  },
};
