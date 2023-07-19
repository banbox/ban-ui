import {useAppConfig, useNuxtApp, useRequestHeaders, useRuntimeConfig} from '#app'
import type { Device } from './types'
import {reactive} from "vue";
import generateFlags from "~/composables/device/generateFlags";
import {DeviceOptions} from "./types";

export const useDevice = () => {
  const config = useAppConfig().device as DeviceOptions

  const DEFAULT_USER_AGENT = config.defaultUserAgent
  const REFRESH_ON_RESIZE = config.refreshOnResize

  // Server Side
  if (process.server) {
    const headers = useRequestHeaders()

    const userAgent = headers['user-agent'] || DEFAULT_USER_AGENT

    return reactive(generateFlags(headers, userAgent))
  }

  // Client Side
  const userAgent = navigator.userAgent || DEFAULT_USER_AGENT
  const flags = reactive(generateFlags({}, userAgent))

  if (REFRESH_ON_RESIZE) {
    window.addEventListener('resize', () => {
      setTimeout(() => {
        const newFlags = generateFlags({}, navigator.userAgent || DEFAULT_USER_AGENT)
        Object.assign(flags, newFlags)
      }, 50)
    })
  }

  return flags
}

