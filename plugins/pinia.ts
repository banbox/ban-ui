import { useKlineCookie } from '~/stores/klineCookie'
import {defineNuxtPlugin} from "#app";
import {Pinia} from "pinia";


export default defineNuxtPlugin(({ $pinia }) => {
  const main = useKlineCookie($pinia as Pinia)
  // store.$patch({})
  return {
    provide: {
      main
    }
  }
})
