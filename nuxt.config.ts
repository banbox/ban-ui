// https://nuxt.com/docs/api/configuration/nuxt-config
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'url'
import VueI18nVitePlugin from '@intlify/unplugin-vue-i18n/vite'

const backendHost = process.env.inter_aipp_host || 'http://127.0.0.1:8000'
const defaultLocale = process.env.NODE_ENV == 'production' ? 'en-US': 'zh-CN'


export default defineNuxtConfig({
  // @ts-ignore
  modules: [
    '@nuxtjs/i18n',
    '@element-plus/nuxt',
    '@pinia/nuxt',
    '@pinia-plugin-persistedstate/nuxt',
    'nuxt-lodash'
  ],
  // @ts-ignore
  vite: {
    plugins: [
      VueI18nVitePlugin({
        include: [
          resolve(dirname(fileURLToPath(import.meta.url)), '~/locales/*.json')
        ]
      })
    ]
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
    legacy: false,
    strategy: 'prefix',
    defaultLocale,
    langDir: 'locales',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'all',
    },
    locales: [
      {code: 'zh-CN', name: '简体中文', file: 'zh-CN.json'},
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
  routeRules: {
    '/dash/**': {ssr: false}
  }
})
