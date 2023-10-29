<script setup lang="ts">

import {definePageMeta, toUTCStamp} from "#imports";
import {useCurApi} from "~/composables/dash/api";
import {useDashStore} from "~/stores/dash";
import {PairPerf, PeriodStat, TagStat} from "~/composables/dash/types";
import {fmtDuration} from "~/composables/dateutil";
import {useLocalePath} from "#i18n";

definePageMeta({
  layout: 'dash',
})

const localPath = useLocalePath()
const {getApi} = useCurApi()
const store = useDashStore()
store.menu_id = 'stat'
const tab_name = ref('days')  // weeks, months, symbols
const stat_list = reactive<PeriodStat[]>([])
const pair_list = reactive<PairPerf[]>([])
const exit_tags = reactive<TagStat[]>([])
const enter_tags = reactive<TagStat[]>([])
const all_pairs = reactive<string[]>([])
const durations = reactive({
  wins: 0,
  draws: 0,
  losses: 0
})

interface SearchType{
  pairs: string[],
  start_time: string,
  stop_time: string
}

const search = reactive<SearchType>({
  pairs: [],
  start_time: '',
  stop_time: ''
})

const tab_labels = [
    {name: 'days', title: '按天'},
    {name: 'weeks', title: '按周'},
    {name: 'months', title: '按月'},
    {name: 'symbols', title: '按币'},
]

async function loadData() {
  const data = {
    group_by: tab_name.value,
    pairs: search.pairs,
    start: toUTCStamp(search.start_time),
    stop: toUTCStamp(search.stop_time),
    limit: 30
  }
  const rsp = await getApi('/performance', data)
  const data_list = rsp.items ?? []
  if (tab_name.value == 'symbols') {
    pair_list.splice(0, pair_list.length, ...data_list)
  } else {
    stat_list.splice(0, stat_list.length, ...data_list)
  }
  exit_tags.splice(0, exit_tags.length, ...(rsp.exit_reasons ?? []))
  Object.assign(durations, rsp.durations)
  enter_tags.splice(0, enter_tags.length, ...(rsp.enter_reasons ?? []))
}

async function loadPairs(){
  const data = {start: toUTCStamp(search.start_time), stop: toUTCStamp(search.stop_time)}
  const rsp = await getApi('/task_pairs', data)
  const items = rsp.pairs ?? []
  const first_load = all_pairs.length === 0
  all_pairs.splice(0, all_pairs.length, ...items)
  if(first_load){
    search.pairs.splice(0, search.pairs.length, ...all_pairs)
  }
}

async function clickLoad(){
  await loadData()
  await loadPairs()
}

onMounted(() => {
  loadData()
  loadPairs()
})

watch(tab_name, () => {
  loadData()
})

</script>

<template>
  <el-menu mode="horizontal" :default-active="tab_name" @select="tab_name = $event">
    <el-menu-item :index="item.name" v-for="item in tab_labels">{{item.title}}</el-menu-item>
  </el-menu>
  <el-checkbox-group v-model="search.pairs" v-if="tab_name !== 'symbols'">
    <el-checkbox :label="item" v-for="item in all_pairs"/>
  </el-checkbox-group>
  <el-row>
    <el-col :span="4">
        <el-form-item label="开始时间">
          <el-input v-model="search.start_time" placeholder="20231012"/>
        </el-form-item>
      </el-col>
      <el-col :span="4" :offset="1">
        <el-form-item label="截止时间">
          <el-input v-model="search.stop_time" placeholder="20231012"/>
        </el-form-item>
      </el-col>
      <el-col :span="4" :offset="1">
        <el-form-item>
          <el-button type="primary" @click="loadData(1)">查询</el-button>
        </el-form-item>
      </el-col>
  </el-row>
  <el-table :data="pair_list" v-if="tab_name == 'symbols'">
    <el-table-column prop="pair" label="币对" />
    <el-table-column prop="close_num" label="平仓单数" />
    <el-table-column prop="profit_sum" label="总利润" >
      <template #default="scope">{{scope.row.profit_sum.toFixed(5)}}</template>
    </el-table-column>
    <el-table-column prop="profit_pct" label="收益" >
      <template #default="scope">{{(scope.row.profit_pct * 100).toFixed(1)}}%</template>
    </el-table-column>
    <el-table-column prop="more" label="操作" >
      <template #default="scope">
        <el-link :href="localPath(`/dash/kline?pair=${scope.row.pair}`)">K线</el-link>
      </template>
    </el-table-column>
  </el-table>
  <el-table :data="stat_list" v-else>
    <el-table-column prop="date_ms" label="日期">
      <template #default="props">{{getDateStr(props.row.date_ms)}}</template>
    </el-table-column>
    <el-table-column prop="start_balance" label="初始余额" />
    <el-table-column prop="order_num" label="订单数" />
    <el-table-column prop="profit_sum" label="总利润" >
      <template #default="scope">{{scope.row.profit_sum.toFixed(5)}}</template>
    </el-table-column>
    <el-table-column prop="profit_pct" label="利润率" >
      <template #default="scope">{{(scope.row.profit_pct * 100).toFixed(1)}}%</template>
    </el-table-column>
  </el-table>
  <el-descriptions title="平均开单时长" border>
    <el-descriptions-item label="盈利时" align="center">{{fmtDuration(durations.wins)}}</el-descriptions-item>
    <el-descriptions-item label="持平时" align="center">{{fmtDuration(durations.draws)}}</el-descriptions-item>
    <el-descriptions-item label="亏损时" align="center">{{fmtDuration(durations.losses)}}</el-descriptions-item>
  </el-descriptions>
  <el-table :data="exit_tags">
    <el-table-column prop="tag" label="平仓原因"/>
    <el-table-column prop="wins" label="盈利单数" />
    <el-table-column prop="losses" label="亏损单数" />
    <el-table-column prop="draws" label="持平单数" />
  </el-table>
  <el-table :data="enter_tags">
    <el-table-column prop="tag" label="开仓原因"/>
    <el-table-column prop="wins" label="盈利单数" />
    <el-table-column prop="losses" label="亏损单数" />
    <el-table-column prop="draws" label="持平单数" />
  </el-table>
</template>

<style scoped lang="scss">
.el-table{
  margin-bottom: 30px;
}
</style>