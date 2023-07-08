<template>
  <div class="top-chg-box">
    <div class="tg-row header">
      <div class="field symbol" @click="clickSort('symbol')">
        <span>{{$t('symbol')}}</span>
        <el-icon :class="{active: sort_key == 'symbol'}">
          <SortDown v-if="symbol_down"/><SortUp v-else/>
        </el-icon>
      </div>
      <div class="field price" @click="clickSort('price')">
        <span>{{$t('price')}}</span>
        <el-icon :class="{active: sort_key == 'price'}">
          <SortDown v-if="price_down"/><SortUp v-else/>
        </el-icon>
      </div>
      <div class="field chg" @click="clickSort('chg')">
        <span>{{$t('up_down')}}</span>
        <el-icon :class="{active: sort_key == 'chg'}">
          <SortDown v-if="chg_down"/><SortUp v-else/>
        </el-icon>
      </div>
    </div>
    <div class="list-box">
      <div class="tg-row item" v-for="(item, index) in data_list" :key="index"
        :class="[item.chg >= 0 ? 'up': 'down', item.symbol === symbol ? 'selected': '']" @click="clickRow(item)">
        <span class="field symbol">
          <span class="base">{{item.base_s}}</span>
          <span class="quote">/{{item.quote_s}}</span>
        </span>
        <span class="field price">{{item.price}}</span>
        <span class="field chg">{{item.chg >= 0 ? '+' : ''}}{{(item.chg * 100).toFixed(2)}}%</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {SortDown, SortUp} from "@element-plus/icons-vue";
import {useNuxtApp} from "#app";
import {defineProps, defineEmits, onMounted, reactive, ref} from "vue";
import {getApi} from "~/utils/netio";
const {t} = useNuxtApp()
const symbol_down = ref(true)
const price_down = ref(true)
const chg_down = ref(true)
const vol_down = ref(true)
const sort_key = ref('chg')
const data_list = reactive<any[]>([])
let loop_timer: ReturnType<typeof setTimeout>

const props = defineProps<{
  symbol: string
}>()

const emit = defineEmits<{
  select: [symbol: string]
}>()


onMounted(async () => {
  await updateWrap()
})

async function updateData(){
  const rsp = await getApi('/kline/top_chg')
  const new_list = (rsp.data ?? []) as any[]
  const map_list = new_list.map(row => {
    const [base_s, quote_s] = row[1].split('/');
    return {
      symbol: row[1],
      base_s, quote_s,
      sid: row[0],
      price: row[2],
      chg: row[3],
      vol: row[4],
      vol_q: row[5]
    }
  })
  data_list.splice(0, data_list.length, ...map_list)
  doArrSort()
}

async function updateWrap(){
  await updateData()
  loop_timer = setTimeout(updateWrap, 60000)
}

function doArrSort(){
  const key = sort_key.value
  if(key === 'symbol'){
    const flag = symbol_down.value ? 1 : -1;
    const flag_r = flag * -1;
    data_list.sort((a, b) => (a.base_s < b.base_s) ? flag : (b.base_s < a.base_s) ? flag_r : 0)
  }
  else if(key === 'price'){
    const flag = price_down.value ? -1 : 1;
    data_list.sort((a, b) => flag * (a.price - b.price))
  }
  else if(key === 'chg'){
    const flag = chg_down.value ? -1 : 1;
    data_list.sort((a, b) => flag * (a.chg - b.chg))
  }
}

function clickSort(key: string){
  const is_toggle = sort_key.value == key;
  if(key === 'symbol'){
    if(is_toggle){
      symbol_down.value = !symbol_down.value
    }
  }
  else if(key === 'price'){
    if(is_toggle){
      price_down.value = !price_down.value
    }
  }
  else if(key === 'chg'){
    if(is_toggle){
      chg_down.value = !chg_down.value
    }
  }
  sort_key.value = key
  doArrSort()
}

function clickRow(row: any){
  emit('select', `${row.base_s}/${row.quote_s}`)
}
</script>

<style scoped lang="scss">
@import "~/assets/klinebase.scss";
.top-chg-box{
  padding: 5px 0;
  border: 1px solid var(--klinecharts-pro-border-color);
}
.tg-row{
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  font-size: 12px;
  height: 24px;
  padding: 0 16px;
  user-select: none;
  .field{
    min-width: 50px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }

  .symbol{
    width: 50%;
    justify-content: flex-start;
    min-width: 120px;
    .base{
      color: var(--klinecharts-pro-text-color)
    }
    .quote{
      color: var(--klinecharts-pro-text-second-color)
    }
  }
  .chg{
    min-width: 60px;
  }
  &.item{
    cursor: pointer;
  }
  &.up{
    .price, .chg{
      color: #{ $c-bar-up-color }
    }
  }
  &.down{
    .price, .chg{
      color: #{ $c-bar-down-color }
    }
  }
  &.header{
    color: var(--klinecharts-pro-text-second-color);
    padding-right: 20px;
    padding-bottom: 5px;
    border-bottom: 1px solid var(--klinecharts-pro-border-color);
    .field{
      cursor: pointer;
    }
    .el-icon.active{
      color: $c-active-color
    }
  }
  &.selected{
    background-color: $c-hover-background-light;
  }
  &:hover{
    background-color: var(--klinecharts-pro-hover-background-color);
  }
  &.header:hover{
    background-color: var(--klinecharts-pro-background-color);
  }
}
.list-box{
  height: 48vh;
  overflow-y: scroll;
}
</style>