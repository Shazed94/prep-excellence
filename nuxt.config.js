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
    loaderImage: process.env.LOADER_IMAGE,
    wsHost: process.env.BROADCAST_WS_HOST,
    wsPort: process.env.BROADCAST_WS_PORT,
    wsAppKey: process.env.BROADCAST_APP_KEY,
    wsCluster: process.env.BROADCAST_CLUSTER,
    wsTLS: process.env.BROADCAST_TLS,
  },
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'Prep Excellence - Find the Best Course for Your Child',
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
      {
        rel: 'icon',
        type: 'image/x-icon',
        href: '/favicon.png'
      },
      {
        rel: 'stylesheet',
        href: '/css/bootstrap.min.css'
      },
      {
        rel: 'stylesheet',
        href: '/css/style.css'
      }
    ],
    script: [
      /*{
        src: "https://js.stripe.com/v3/"
      },*/
      {
        src: "/js/popper.min.js"
      },
      {
        src: "/js/bootstrap.min.js"
      }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '~/assets/css/style.css',
    '~/assets/scss/theme.scss',
    '~/assets/css/aos.css'
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    {src: '~/plugins/vue-slick-carousel', ssr: true},
    {src: '~/plugins/vue-sweetalert.js', mode: 'client'},
    {src: '~/plugins/vee-validate.js', mode: 'client'},
    {src: '~/plugins/v-toaster.js', mode: 'client'},
    {src: '~/plugins/vue-print-nb.js', mode: 'client'},
    {src: '~/plugins/vue-countdown-timer.js', mode: 'client'},
    //{src: '~/plugins/vue-pdf-app.js', mode: 'client'},
    {src: '~/plugins/phone-input.js', mode: 'client'},

    {src: '~/mixins/mixin.js'},
    {src: '~/mixins/axios.js'},
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/tailwindcss
    // '@nuxtjs/tailwindcss',
    '@nuxtjs/fontawesome',
    ['@nuxtjs/vuetify', {
      customVariables: ['~/assets/scss/vuetify/variables/_index.scss'],
      optionsPath: '~/configs/vuetify.js',
      treeShake: true,
      defaultAssets: {
        font: false
      }
    }],
    '@nuxtjs/moment',
    '@nuxtjs/laravel-echo'
  ],
  echo: {
    plugins: [ '~/plugins/echo.js' ]
  },
  // fontawesome icons
  fontawesome: {
    icons: {
      solid: true,
      brands: true

    }
  },

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/auth-next',
    '@nuxtjs/recaptcha',
  ],
  recaptcha: {
    //hideBadge: Boolean, // Hide badge element (v3 & v2 via size=invisible)
    //language: String,   // Recaptcha language (v2)
    mode: 'base',       // Mode: 'base', 'enterprise'
    siteKey: process.env.RECAPTCHA_SITE_KEY,    // Site key for requests
    version: 2,    // Version
    size: 'normal'        // Size: 'compact', 'normal', 'invisible' (v2)
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
          login: {url: '/frontend/login', method: 'post'},
          logout: false,
          user: {url: '/user', method: 'get'}
        }
      }
    },
    redirect: {
       login: '/',
       logout: '/',
       callback: '/',
       home: '/'
    }
  },
  router: {
    middleware: ['auth']
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    transpile: [
      'defu',
      'vee-validate'
    ],

  }
}
