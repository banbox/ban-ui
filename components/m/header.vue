<template>
  <div class="header">
    <img class="logo" src="/logo_horz.png" alt="logo"/>
    <div class="right-area">
      <KlineSelect :data-source="locales" :value="localeMap[locale]" value_key="name" @change="setLocale($event.code)"/>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {useI18n} from "vue-i18n"
import {navigateTo} from "#app";
import {type LocaleObject, useSwitchLocalePath} from "#i18n";
import {reactive, ref} from "vue";
const {locale, locales} = useI18n()

const switchLocalePath = useSwitchLocalePath()
const localeMap = reactive(Object.fromEntries(locales.value.map(item => {
  const {code, name} = item as LocaleObject;
  return [code, name]
})))

function setLocale(code: string){
  navigateTo(switchLocalePath(code))
}

</script>

<style scoped lang="scss">
.header{
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
img.logo{
  height: 23px;
}
.klinecharts-pro-select{
  transform: scale(0.8);
  -webkit-transform-origin-x: 0;
  transform-origin: 100% 50%
}
</style>