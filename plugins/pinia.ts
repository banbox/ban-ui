import {defineNuxtPlugin} from "#app";
import {Pinia} from "pinia";
import {useKlineStore} from "~/stores/kline";


export default defineNuxtPlugin(({ $pinia }) => {
  const main = useKlineStore($pinia as Pinia)
  return {
    provide: {
      main
    }
  }
})
