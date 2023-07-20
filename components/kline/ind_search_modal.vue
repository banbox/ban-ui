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
import i18n from "~/composables/i18n"
import {an} from "~/.output/public/_nuxt/entry.9543edf0";
let t = i18n.global.t

const props = defineProps<{
  modelValue: boolean,
  panes: PaneInds[]
}>()


const emit = defineEmits<{
  'change': [paneId: string, ind_name: string, is_add: boolean],
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

const main_inds = reactive(['MA', 'EMA', 'SMA', 'BOLL', 'SAR', 'BBI'])

const sub_inds = reactive(['VOL', 'MACD', 'KDJ', 'RSI', 'BIAS', 'BRAR',
  'CCI', 'DMI', 'CR', 'PSY', 'DMA', 'TRIX', 'OBV', 'VR', 'WR', 'MTM', 'EMV',
  'SAR', 'ROC', 'PVT', 'AO'])

const checked_inds = reactive<string[]>([])

function toggleInd(is_main: boolean, name: string, val: any){
  if(val){
    checked_inds.push(name);
  }else{
    const delId = checked_inds.indexOf(name);
    if(delId >= 0){
      checked_inds.splice(delId, 1)
    }
  }
  const pane_name = is_main ? 'candle_pane': `pane_${name}`
  emit('change', pane_name, name, val as boolean)
}

watch(() => props.panes, (new_panes) => {
  checked_inds.splice(0, checked_inds.length)
  new_panes.forEach(p => {
    checked_inds.push(...p.inds)
  })
}, {immediate: true, deep: true})


/**
 * 下面是旧的单窗口多指标处理代码，保留以后可能需要
 *
 */

function paneTitle(pane: PaneInds){
  let result = [];
  if(pane.name == 'candle_pane'){
    result.push(t('main_pane') + ':')
  }
  else {
    result.push(pane.name + ':')
  }
  for(let ind_name of pane.inds){
    result.push(ind_name)
    result.push(' ')
  }
  return result.join('')
}

/**
 * _panes和active_pane是针对单窗口多指标功能开发的，目前暂时不需要
 */
const _panes = reactive(props.panes ?? [])
if(!_panes.find(i => i.name == 'candle_pane')){
  _panes.unshift({name: 'candle_pane', inds: []})
}
const active_pane = ref('candle_pane')

function addActiveInd(ind_name: string){
  for(let pane of _panes){
    if(pane.name == active_pane.value){
      pane.inds.push(ind_name)
      emit('change', active_pane.value, ind_name, true)
      break
    }
  }
}

function clickIndDelete(ind_name: string){
  for(let pane of _panes){
    if(pane.name == active_pane.value){
      pane.inds.splice(pane.inds.indexOf(ind_name), 1)
      emit('change', active_pane.value, ind_name, false)
      break
    }
  }
}

function addSubPane(){
  let last = _panes[_panes.length - 1]
  let cur_id = 1
  if(last.name.startsWith('pane')){
    cur_id = parseInt(last.name.substring(4)) + 1
  }
  let name = 'pane' + cur_id;
  _panes.push({name, inds: []})
  active_pane.value = name
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