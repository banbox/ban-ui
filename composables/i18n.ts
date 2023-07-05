import {createI18n} from "vue-i18n";
import cn from "~/locales/cn.json";
import en from "~/locales/en.json";

const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: 'cn',
  messages: {
    cn, en
  }
})

export default i18n
