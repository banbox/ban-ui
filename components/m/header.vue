<template>
  <div class="header">
    <img class="logo" src="/logo_horz.png" alt="logo"/>
    <div class="right-area">
      <Select :data-source="langOpts" :value="langMap[$i18n.locale]"
            @change="$i18n.locale = $event.value"/>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Select from "~/components/kline/select.vue"
import i18n, {useUserLang, useLangOpts} from "~/composables/i18n";

const userLang = useUserLang()
const {langMap, langOpts} = useLangOpts()

</script>

<style lang="scss">
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