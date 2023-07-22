import {defineNuxtPlugin} from "#app";
import {useMainStore} from "~/stores/main";

export default defineNuxtPlugin(nuxtApp => {
  const store = useMainStore()

  nuxtApp.hook('i18n:localeSwitched', ({oldLocale, newLocale}) => {
    store.setLocale(newLocale)
  })
})