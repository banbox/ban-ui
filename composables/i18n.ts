import {createI18n} from "vue-i18n";
import cn from "~/locales/cn.json";
import en from "~/locales/en.json";
import {useStorage} from "@vueuse/core";
import {Ref} from "@vue/reactivity";
import {useState, watch} from "#build/imports";


function getUserLang(){
  if(process.client){
    const nav = navigator as any;
    //https://stackoverflow.com/questions/5580876/navigator-language-list-of-all-languages
    const userLang: string = nav.language || nav.userLanguage || 'en-US';
    if(userLang.startsWith('zh-')){
      return 'cn'
    }
    return 'en'
  }
  return undefined
}


export const useUserLang = (): Ref<string | undefined> => {
  const _rawLang = useStorage<string | undefined>('lang', undefined)
  const lang = useState('lang', () => {
    if(!_rawLang.value){
      _rawLang.value = getUserLang()
    }
    return _rawLang.value
  })
  watch(lang, () => { _rawLang.value = lang.value })
  return lang
}


export const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: 'en',
  messages: {
    cn, en
  }
})

export default i18n
