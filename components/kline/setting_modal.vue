<template>
  <KlineModal :title="$t('language')" :width="660" :buttons="['restore_default']"
         v-model="showModal" @click="resetStyle">
    <div class="klinecharts-pro-setting-modal-content">
      <template v-for="(item, index) in options" :key="item.key">
        <span>{{$t(item.text)}}</span>
        <KlineSelect v-if="item.component == 'select'" :data-source="item.dataSource"
                style="width: 120px" :translate="true"
                :value="$t(kc.utils.formatValue(store.chartStyle, item.key))" @change="update(item.key, $event.key)"/>
        <KlineSwitch v-else-if="item.component == 'switch'" :open="!!kc.utils.formatValue(store.chartStyle, item.key)"
                @change="update(item.key, $event)"/>
      </template>
    </div>
  </KlineModal>
</template>

<script setup lang="ts">
import {getOptions} from "~/components/kline/setting_opts";
import {computed, defineEmits, defineProps, reactive, watch} from "vue";
import type {Styles} from "klinecharts";
import * as kc from "klinecharts"
import {useI18n} from "vue-i18n";
import {useKlineLocal} from "~/stores/klineLocal";
import {useKlineStore} from "~/stores/kline";
const {t} = useI18n()
const store = useKlineLocal()
const main = useKlineStore()
const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean],
}>()

const showModal = computed({
  get(){
    return props.modelValue
  },
  set(value){
    emit('update:modelValue', value)
  }
})

const options = reactive(getOptions())

function update(key: string, value: any){
  store.setStyleItem(key, value)
  main.chart?.setStyles(store.chartStyle as Styles)
}

function resetStyle(){
  store.resetStyle()
  main.chart?.setStyles(store.chartStyle as Styles)
}

</script>

<style scoped lang="scss">
@import "@/assets/klinebase.scss";

.#{$prefix-cls}-setting-modal-content {
  display: grid;
  grid-template-columns: auto auto auto auto;
  grid-row-gap: 20px;
  margin-top: 20px;
  margin-bottom: 30px;
  align-items: center;
}

</style>