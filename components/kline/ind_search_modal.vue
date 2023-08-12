<template>
  <Modal :title="$t('indicator')" :width="400" v-model="showModal">
    <List class="klinecharts-pro-ind-box">
      <div class="row title">{{$t('main_indicator')}}</div>
      <div class="row" v-for="(item, index) in main_inds" :key="item.name">
        <Checkbox :model-value="checked_inds.includes(item)" :label="$t(item.toLowerCase())"
                  @change="toggleInd(true, item, $event)"/>
      </div>
      <div class="row title">{{$t('sub_indicator')}}</div>
      <div class="row" v-for="(item, index) in sub_inds" :key="item.name">
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
import {Chart} from "klinecharts";
import {useKlineStore} from "~/stores/kline";


const props = defineProps<{
  modelValue: boolean,
}>()


const emit = defineEmits<{
  'change': [is_main: boolean, ind_name: string, is_add: boolean],
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

const store = useKlineStore()

const main_inds = reactive(['MA', 'EMA', 'SMA', 'BOLL', 'SAR', 'BBI', 'TEST'])

const sub_inds = reactive(['VOL', 'MACD', 'KDJ', 'RSI', 'BIAS', 'BRAR',
  'CCI', 'DMI', 'CR', 'PSY', 'DMA', 'TRIX', 'OBV', 'VR', 'WR', 'MTM', 'EMV',
  'SAR', 'ROC', 'PVT', 'AO'])

const checked_inds = computed((): string[] => {
  return [...store.mainInds.split(','), ...store.subInds.split(',')]
})

function toggleInd(is_main: boolean, name: string, val: any){
  emit('change', is_main, name, val as boolean)
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
  }
  .row:hover {
    .checkbox {
      fill: var(--klinecharts-pro-primary-color);
      color: var(--klinecharts-pro-primary-color);
    }
  }
}

.pane-box{
  border: 1px solid $c-text-second-dark;
  border-radius: 10px;
  margin: 10px;
  .title{
    background-color: #eeeeee;
  }
}

.add-pane{
  padding: 0 20px;
  text-align: center;
  height: 40px;
  line-height: 40px;
  color: $c-primary;
  margin: 0 30px;
  border-radius: 30px;
  border: 1px solid $c-primary;
  cursor: pointer;
}

</style>