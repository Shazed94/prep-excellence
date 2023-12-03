import config from './configs'
const {locale, availableLocales, fallbackLocale} = config.locales
const {gaId} = config.analytics
export default {
  ssr: true,
  // Target: https://go.nuxtjs.dev/config-target
  target: 'server',
  server: {
    port: process.env.APP_PORT
  },
  publicRuntimeConfig: {
    apiResource: process.env.API_URL_RESOURCE,
    apiUrl: process.env.API_URL,
    frontendUrl: process.env.FRONTEND_URL,
    wsHost: process.env.BROADCAST_WS_HOST,
    wsPort: process.env.BROADCAST_WS_PORT,
    wsAppKey: process.env.BROADCAST_APP_KEY,
    wsCluster: process.env.BROADCAST_CLUSTER,
    wsTLS: process.env.BROADCAST_TLS,
  },
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'prepexcellence',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600;700&display=swap'},
      ...config.icons.map((href) => ({rel: 'stylesheet', href})),
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '~/assets/scss/theme.scss',
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    {src: '~/plugins/animate.js', mode: 'client'},
    {src: '~/plugins/clipboard.js', mode: 'client'},
    {src: '~/plugins/vue-shortkey.js', mode: 'client'},
    {src: '~/plugins/vue-sweetalert.js', mode: 'client'},
    {src: '~/plugins/vee-validate.js', mode: 'client'},
    {src: '~/plugins/v-toaster.js', mode: 'client'},
    {src: '~/plugins/vue-print-nb.js', mode: 'client'},
    {src: '~/plugins/filters.js'},
    {src: '~/plugins/dragable.js', mode: 'client'},
    {src: '~/filters/formatCurrency.js'},
    {src: '~/mixins/mixin.js'},
    {src: '~/mixins/axios.js'},
    {src: '~/mixins/can.js'},
    //{src: '~/plugins/echo.js' , mode: 'client'}
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/tailwindcss
    '@nuxtjs/tailwindcss',
    ['@nuxtjs/vuetify', {
      customVariables: ['~/assets/scss/vuetify/variables/_index.scss'],
      optionsPath: '~/configs/vuetify.js',
      treeShake: true,
      defaultAssets: {
        font: false,
      }
    }],
    '@nuxtjs/laravel-echo',
  ],
  echo: {
    plugins: [ '~/plugins/echo.js' ]
  },

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/auth-next',
    '@nuxtjs/i18n',
    "vue2-editor/nuxt",

  ],
  i18n: {
    detectBrowserLanguage: {
      useCookie: true,
        cookieKey: 'i18n_redirected'
    },
    locales: availableLocales,
      lazy: true,
      langDir: 'translations/',
      defaultLocale: locale,
      vueI18n: {
      fallbackLocale
    }
  },
  axios: {
    baseURL: process.env.API_URL ? process.env.API_URL : process.env.API_URL,
    timeout: 15000000,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  },
  auth: {
    strategies: {
      auth: {
        scheme: '~/schemes/auth',
        token: {
          property: 'token',
          global: true,
          required: true,
          type: 'Bearer'
        },
        user: {
          property: 'user',
          autoFetch: true
        },
        endpoints: {
          login: {url: 'login', method: 'post'},
          logout: false,
          user: {url: 'user', method: 'get'}
        }
      }
    },
    redirect: {
      login: '/auth/signin',
      logout: '/auth/signin',
      callback: '/auth/signin',
      home: '/'
    }
  },
  router: {
    middleware: ['auth']
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    transpile: [
      'vee-validate'
    ]
  }
}
