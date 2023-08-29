<script setup lang="ts">

import {SortDown, SortUp, Switch} from "@element-plus/icons-vue";
import {useKlineLocal} from "~/stores/klineLocal";
import {getApi} from "~/utils/netio";
import {readableNumber, formatPrecision, getDateStr, getTimestamp} from "~/composables/kline/coms";
const title_down = ref(false)
const num_down = ref(true)
const rate_down = ref(true)
const sort_id = ref(0)
// 用于item_list排序
const symbol_down = ref(true)
const chg_down = ref(true)
const vol_down = ref(true)
const item_sort_id = ref(1)

type RangeType = {
  time: number,
  title: string,
  num: number,
  rate: number
}

type TrendItemType = {
  start_dt: string,
  symbol: string,
  base_s: string,
  quote_s: string,
  rate: number,
  quote_vol: number,
  vol_text: string
}

const active_time = ref('')
const range_list = reactive<RangeType[]>([])
const all_items: TrendItemType[] = []
const item_list = reactive<TrendItemType[]>([])
const min_rate = ref(1.5)  // 最小变化率
const klocal = useKlineLocal()

onMounted(async () => {
  await updateData()
})

async function updateData(){
  if(!klocal.showRight)return
  const start_ms = getTimestamp(klocal.dt_start)
  const stop_ms = getTimestamp(klocal.dt_stop)
  const data = {from: start_ms, to: stop_ms, timeframe: '4h', min_rate: min_rate.value * 0.01}
  const rsp = await getApi('/kline/big_trends', data)
  const new_list = (rsp.data ?? []) as any[]
  const date_gps: Record<string, number[]> = {}
  const map_list = new_list.map(row => {
    const [base_s, quote_s] = row[0].split('/');
    const vol_text = readableNumber(formatPrecision(row[3], 2), 1)
    const date_str = getDateStr(row[1], 'UTC');
    if(!date_gps[date_str]){
      date_gps[date_str] = []
    }
    date_gps[date_str].push(row[2])
    return {
      start_dt: date_str,
      symbol: row[0],
      base_s, quote_s,
      rate: row[2],
      quote_vol: row[3],
      vol_text,
    } as TrendItemType
  })
  all_items.splice(0, all_items.length, ...map_list)
  // 更新range_list
  range_list.splice(0, range_list.length)
  for(let key in date_gps){
    const chg_arr = date_gps[key]
    chg_arr.sort()
    // 如果上涨的多，取上涨前3的均值；否则取下跌前3的均值
    const num_sum = chg_arr.map(v => v > 0 ? 1: -1).reduce((a, b) => a + b, 0)
    const rates = chg_arr.filter(v => v * num_sum >= 0).map(v => Math.abs(v))
    const big3 = rates.slice(-3)
    const avg_val = big3.reduce((a, b) => a + b, 0) / big3.length
    range_list.push({
      time: getTimestamp(key),
      title: key,
      num: date_gps[key].length,
      rate: avg_val * (num_sum >= 0 ? 1 : -1)
    })
  }
  doRangeSort()
  clickRange(range_list[0].title)
  doItemsSort()
}

function clickRange(range_val: string){
  active_time.value = range_val
  const show_items = all_items.filter(i => i.start_dt == range_val)
  item_list.splice(0, item_list.length, ...show_items)
  doItemsSort()
}

function doRangeSort(){
  const key = sort_id.value
  const flag = [title_down, num_down, rate_down][key].value ? -1: 1;
  if(key === 0){
    range_list.sort((a, b) => flag * (a.time - b.time))
  }
  else if(key === 1){
    range_list.sort((a, b) => flag * (a.num - b.num))
  }
  else if(key === 2){
    range_list.sort((a, b) => flag * (a.rate - b.rate))
  }
}

function clickSort(key: number){
  const is_toggle = sort_id.value == key;
  if(is_toggle){
    const mark = [title_down, num_down, rate_down][key]
    mark.value = !mark.value
  }
  sort_id.value = key
  doRangeSort()
}

function doItemsSort(){
  const key = item_sort_id.value
  const flag = [symbol_down, chg_down, vol_down][key].value ? -1: 1;
  if(key === 0){
    const flag_r = flag * -1;
    item_list.sort((a, b) => (a.symbol > b.symbol) ? flag : (b.symbol > a.symbol) ? flag_r : 0)
  }
  else if(key === 1){
    item_list.sort((a, b) => flag * (a.rate - b.rate))
  }
  else if(key === 2){
    item_list.sort((a, b) => flag * (a.quote_vol - b.quote_vol))
  }
}

function clickItemSort(key: number){
  const is_toggle = item_sort_id.value == key;
  if(is_toggle){
    const mark = [symbol_down, chg_down, vol_down][key]
    mark.value = !mark.value
  }
  item_sort_id.value = key
  doItemsSort()
}

</script>

<template>
  <div class="big-trends-box">
    <div class="tg-row header">
      <div class="field symbol">
        <span>时间段(4H)</span>
        <el-icon :class="{active: sort_id == 0}" @click="clickSort(0)">
          <SortDown v-if="title_down"/><SortUp v-else/>
        </el-icon>
      </div>
      <div class="field price">
        <span>数量</span>
        <el-icon :class="{active: sort_id == 1}" @click="clickSort(1)">
          <SortDown v-if="num_down"/><SortUp v-else/>
        </el-icon>
      </div>
      <div class="field chg">
        <span>Top3</span>
        <el-icon :class="{active: sort_id == 2}" @click="clickSort(2)">
          <SortDown v-if="rate_down"/><SortUp v-else/>
        </el-icon>
      </div>
    </div>
    <div class="list-box">
      <div class="tg-row item" v-for="(item, index) in range_list" :key="index"
           :class="{active: item.title == active_time}" @click="clickRange(item.title)">
        <span class="field title">{{item.title}}</span>
        <span class="field count" >{{item.num}}</span>
        <span class="field main chg">{{(item.rate * 100).toFixed(2)}}%</span>
      </div>
    </div>
  </div>
  <div class="top-chg-box">
    <div class="tg-row header">
      <div class="field symbol">
        <span>{{$t('symbol')}}</span>
        <el-icon :class="{active: item_sort_id == 0}" @click="clickItemSort(0)">
          <SortDown v-if="symbol_down"/><SortUp v-else/>
        </el-icon>
      </div>
      <div class="field price">
        <span>{{$t('up_down')}}</span>
        <el-icon :class="{active: item_sort_id == 1}" @click="clickItemSort(1)">
          <SortDown v-if="chg_down"/><SortUp v-else/>
        </el-icon>
      </div>
      <div class="field chg">
        <span>{{$t('volume')}}</span>
        <el-icon :class="{active: item_sort_id == 2}" @click="clickItemSort(2)">
          <SortDown v-if="vol_down"/><SortUp v-else/>
        </el-icon>
      </div>
    </div>
    <div class="list-box">
      <div class="tg-row item" v-for="(item, index) in item_list" :key="index">
        <span class="field symbol">
          <span class="base">{{item.base_s}}</span>
          <span class="quote">/{{item.quote_s}}</span>
        </span>
        <span class="field count" >{{(item.rate * 100).toFixed(2)}}%</span>
        <span class="field main chg">{{item.vol_text}}</span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "~/assets/klinebase.scss";
.top-chg-box, .big-trends-box{
  padding: 5px 0;
  border: 1px solid var(--klinecharts-pro-border-color);
  height: 50%;
}
.tg-row.header{
  height: 30px;
}
.list-box{
  overflow-y: scroll;
  height: calc(100% - 30px);
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
  .main{
    min-width: 60px;
  }
  &.item{
    cursor: pointer;
  }
  .up{
    color: #{ $c-bar-up-color }
  }
  .down{
    color: #{ $c-bar-down-color }
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
  &.active{
    background-color: $c-hover-background-light;
  }
  &:hover{
    background-color: var(--klinecharts-pro-hover-background-color);
  }
  &.header:hover{
    background-color: var(--klinecharts-pro-background-color);
  }
}
</style>