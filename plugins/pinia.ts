import { useMainStore } from '~/stores/main'
import {defineNuxtPlugin} from "#app";
import {Pinia} from "pinia";


export default defineNuxtPlugin(({ $pinia }) => {
  const store = useMainStore($pinia as Pinia)
  // store.$patch({})
  return {
    provide: {
      store
    }
  }
})
