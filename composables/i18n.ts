import {createI18n} from "vue-i18n";
import cn from "~/locales/cn.json";
import en from "~/locales/en.json";
import {useStorage} from "@vueuse/core";


export const useUserLang = (): string => {
  const lang = useStorage<string | undefined>('lang', undefined)
  if(!lang.value && process.client){
    const nav = navigator as any;
    const userLang: string = nav.language || nav.userLanguage || 'en-US';
    if(userLang.startsWith('zh-')){
      lang.value = 'cn'
    }
    else{
      lang.value = 'en'
    }
  }
  return lang.value ?? 'en'
}


export const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: useUserLang(),
  messages: {
    cn, en
  }
})

export default i18n
