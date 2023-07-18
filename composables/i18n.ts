import {createI18n} from "vue-i18n";
import zhCN from "~/locales/zh-CN.json";
import enUS from "~/locales/en-US.json";
import {useStorage} from "@vueuse/core";
import {Ref} from "@vue/reactivity";
import {useState, watch} from "#build/imports";
import {reactive} from "vue";


function getUserLang(): string | undefined{
  if(process.client){
    const nav = navigator as any;
    //https://stackoverflow.com/questions/5580876/navigator-language-list-of-all-languages
    return nav.language || nav.userLanguage || 'en-US';
  }
  return undefined
}


export const useUserLang = (): Ref<string | undefined> => {
  const _rawLang = useStorage<string | undefined>('lang', undefined)
  const lang = useState('lang', () => {
    if(!_rawLang.value || _rawLang.value == 'undefined'){
      _rawLang.value = getUserLang()
    }
    return _rawLang.value
  })
  watch(lang, () => { _rawLang.value = lang.value })
  return lang
}

export type SelOption = {
  value: string,
  text: string
}

export const useLangOpts = () => {
  const langMap = reactive<Record<string, string>>({
    'en-US': 'English',
    'zh-CN': '简体中文'
  })

  const langOpts = reactive<SelOption[]>(Object.entries(langMap).map(([value, text]) => ({ value, text })))

  return {langMap, langOpts}
}

export const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: 'en-US',
  messages: {
    'zh-CN': zhCN, 'en-US': enUS
  }
})

export default i18n
