// https://nuxt.com/docs/api/configuration/nuxt-config

const backendHost = process.env.inter_aipp_host || 'http://127.0.0.1:9000'
const defaultLocale = process.env.NODE_ENV == 'production' ? 'en-US': 'zh-CN'


export default defineNuxtConfig({
  devtools: {enabled: true},

  // @ts-ignore
  modules: [
    '@nuxtjs/i18n',
    '@element-plus/nuxt',
    '@pinia/nuxt',
    '@pinia-plugin-persistedstate/nuxt',
    'nuxt-lodash',
    'dayjs-nuxt',
    '@nuxtjs/device',
    "@sidebase/nuxt-auth"
  ],

  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
    }
  },

  nitro: {
    devProxy: {
      '/api': {
        // https://github.com/http-party/node-http-proxy#options
        target: backendHost,
        changeOrigin: true
      }
    }
  },

  auth: {
    isEnabled: true,
    provider: {
      type: 'local',
      endpoints: {
        signIn: false,
        signOut: false,
        signUp: false,
        getSession: false,
      }
    },
    sessionDataType: {
      id: 'string | number',
      userName: 'string'
    }
  },

  elementPlus: {
    importStyle: 'scss'
  },

  lodash: {
    prefix: "_",
    prefixSkip: ["string"],
    upperAfterPrefix: false,
    exclude: ["map"],
    alias: [
      ["camelCase", "stringToCamelCase"], // => stringToCamelCase
      ["kebabCase", "stringToKebab"], // => stringToKebab
      ["isDate", "isLodashDate"], // => _isLodashDate
    ],
  },

  i18n: {
    strategy: 'prefix_and_default',
    defaultLocale,
    langDir: 'locales',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'all',
    },
    locales: [
      {code: 'zh-CN', name: '简体中文', file: 'zh-CN.json'},
      {code: 'zh-TW', name: '繁体中文', file: 'zh-TW.json'},
      {code: 'en-US', name: 'English', file: 'en-US.json'},
    ]
  },

  piniaPersistedstate: {
    // pinia默认使用cookie进行持久化
    cookieOptions: {
      sameSite: 'strict',
    },
    storage: 'cookies'
  },

  runtimeConfig:{
    public: {
      gtagId: 'G-FS4QCSW076'  // 谷歌统计
    }
  },

  routeRules: {
    '/dash/**': {ssr: false},
    '/api/**': {
      // 用于开发者以生产模式运行，生产环境不会走这里
      proxy: { to: `${backendHost}/**`, },
    }
  },

  dayjs: {
    locales: ['zh-cn', 'en'],
    defaultLocale: 'zh-cn',
    plugins: ['relativeTime', 'utc', 'timezone'],
    defaultTimezone: 'UTC'
  },

  build: {
    transpile: ['klinecharts']
  },

  compatibilityDate: '2024-08-19',
})