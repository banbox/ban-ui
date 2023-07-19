import { defineNuxtPlugin, useRuntimeConfig, useRequestHeaders } from '#app'
import { reactive } from 'vue'
import {useDevice} from "~/composables/device"

export default defineNuxtPlugin((nuxtApp) => {
  const device = useDevice()

  return {
    provide: {device}
  }

})