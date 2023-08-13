<template>
  <Modal :title="$t('indicator')" :width="400" v-model="showModal">
    <List class="klinecharts-pro-ind-box">
      <div class="row title">{{$t('main_indicator')}}</div>
      <div class="row" v-for="(item, index) in main_inds" :key="index">
        <Checkbox :model-value="checked_inds.includes(item)" :label="$t(item.toLowerCase())"
                  @change="toggleInd(true, item, $event)"/>
      </div>
      <div class="row" v-for="(item, index) in main_cloud_inds" :key="index">
        <Checkbox :model-value="checked_inds.includes(item)" :label="item"
                  @change="toggleInd(true, item, $event)"/>
      </div>
      <div class="row title">{{$t('sub_indicator')}}</div>
      <div class="row" v-for="(item, index) in sub_inds" :key="index">
        <Checkbox :model-value="checked_inds.includes(item)" :label="$t(item.toLowerCase())"
                  @change="toggleInd(false, item, $event)"/>
      </div>
    </List>
  </Modal>
</template>

<script setup lang="ts">
import Modal from "~/components/kline/modal.vue"
import List from "~/components/kline/list.vue"
import Checkbox from "~/components/kline/checkbox.vue"
import {PaneInds} from "~/components/kline/types";
import {computed, defineEmits, defineProps, reactive, watch} from "vue";
import kc, {Chart} from "klinecharts";
import {useKlineLocal} from "~/stores/klineLocal";
import {awaitExpression} from "@babel/types";
import makeCloudInds from "~/composables/kline/indicators/cloudInds";
import {useNuxtApp} from "#app"


const props = defineProps<{
  modelValue: boolean,
}>()


const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const showModal = computed({
  get(){
    return props.modelValue
  },
  set(value){
    emit('update:modelValue', value)
  }
})

const {$emit} = useNuxtApp()
const store = useKlineLocal()

const main_inds = reactive(['MA', 'EMA', 'SMA', 'BOLL', 'SAR', 'BBI'])
const main_cloud_inds = reactive<string[]>([])

const sub_inds = reactive(['VOL', 'MACD', 'KDJ', 'RSI', 'BIAS', 'BRAR',
  'CCI', 'DMI', 'CR', 'PSY', 'DMA', 'TRIX', 'OBV', 'VR', 'WR', 'MTM', 'EMV',
  'SAR', 'ROC', 'PVT', 'AO'])


async function loadCloudInds() {
  const rsp = await getApi('/kline/all_stgy')
  if (!rsp.data) {
    console.error('load cloud inds fail')
    return
  }
  const stg_names = rsp.data.map((d: any) => d.name)
  main_cloud_inds.splice(0, main_cloud_inds.length, ...stg_names)
  makeCloudInds(rsp.data).forEach(o => { kc.registerIndicator(o) })
}
loadCloudInds()

const checked_inds = computed((): string[] => {
  return [...store.mainInds.split(','), ...store.subInds.split(',')]
})

function toggleInd(is_main: boolean, name: string, val: any){
  $emit('set_ind', {is_main, ind_name: name, is_add: val as boolean})
}

</script>

<style lang="scss">
@import '~/assets/klinebase.scss';

.#{$prefix-cls}-ind-box {
  min-height: 0;
  max-height: 500px;
  margin: 0 -20px;
  .title {
    position: sticky;
    top: 0;
    font-size: 16px;
    color: var(--klinecharts-pro-text-color);
    background-color: var(--klinecharts-pro-popover-background-color);
    font-weight: 400;
  }
  .row{
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 40px;
    padding: 0 20px;
    box-sizing: border-box;
    cursor: pointer;
    justify-content: space-between;
    .#{$prefix-cls}-checkbox{
      flex-grow: 1;
    }
  }
  .row:hover {
    background: var(--klinecharts-pro-hover-background-color);
    .checkbox {
      fill: var(--klinecharts-pro-primary-color);
      color: var(--klinecharts-pro-primary-color);
    }
  }
}

</style>