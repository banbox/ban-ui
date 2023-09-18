<script setup lang="ts">

import {definePageMeta} from "#imports";
import {useCurApi} from "~/composables/dash/api";
import {useDashStore} from "~/stores/dash";
import {PeriodStat, TagStat} from "~/composables/dash/types";

definePageMeta({
  layout: 'dash',
})

const {getApi} = useCurApi()
const store = useDashStore()
store.menu_id = '3'
const tab_name = ref('days')  // weeks, months
const stat_list = reactive<PeriodStat[]>([])
const tag_stats = reactive<TagStat[]>([])
const durations = reactive({
  wins: '',
  draws: '',
  losses: ''
})
const tab_labels = {
  days: '按天',
  weeks: '按周',
  months: '按月'
}

async function loadPeriodStatData(){
  const data = {unit: tab_name.value, limit: 30}
  const rsp = await getApi('/profit_by', data)
  const data_list = rsp.data ?? []
  stat_list.splice(0, stat_list.length, ...data_list)
}

async function loadStat(){
  const rsp = await getApi('/stats')
  const list = rsp.exit_reasons ?? []
  tag_stats.splice(0, tag_stats.length, ...list)
  Object.assign(durations, rsp.durations)
}

onMounted(() => {
  loadPeriodStatData()
  loadStat()
})

watch(tab_name, () => {
  loadPeriodStatData()
})

</script>

<template>
  <el-menu mode="horizontal" :default-active="tab_name" @select="tab_name = $event">
    <el-menu-item index="days">按天</el-menu-item>
    <el-menu-item index="weeks">按周</el-menu-item>
    <el-menu-item index="months">按月</el-menu-item>
  </el-menu>
  <el-table :data="stat_list">
    <el-table-column prop="date_ms" label="日期">
      <template #default="props">{{getDateStr(props.row.date_ms)}}</template>
    </el-table-column>
    <el-table-column prop="start_balance" label="初始余额" />
    <el-table-column prop="order_num" label="订单数" />
    <el-table-column prop="profit_sum" label="总利润" />
    <el-table-column prop="profit_pct" label="利润率" />
  </el-table>
  <el-descriptions title="平均开单时长" border>
    <el-descriptions-item label="盈利时" align="center">{{durations.wins}}</el-descriptions-item>
    <el-descriptions-item label="盈利时" align="center">{{durations.draws}}</el-descriptions-item>
    <el-descriptions-item label="盈利时" align="center">{{durations.losses}}</el-descriptions-item>
  </el-descriptions>
  <el-table :data="tag_stats">
    <el-table-column prop="tag" label="平仓原因"/>
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