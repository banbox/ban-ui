// https://nuxt.com/docs/api/configuration/nuxt-config
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'url'
import VueI18nVitePlugin from '@intlify/unplugin-vue-i18n/vite'

const backendHost = process.env.inter_aipp_host || 'http://127.0.0.1:8000'


export default defineNuxtConfig({
  // @ts-ignore
  modules: [
    '@nuxtjs/i18n',
    '@element-plus/nuxt',
    '@pinia/nuxt',
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
    strategy: 'prefix_and_default',
    defaultLocale: 'en-US',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root',
    },
    locales: [
      {code: 'en-US', name: 'English'},
      {code: 'zh-CN', name: '简体中文'},
    ]
  }
})
