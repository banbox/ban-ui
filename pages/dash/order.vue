<script setup lang="ts">

import {definePageMeta} from "#imports";
import {useCurApi} from "~/composables/dash/api";
import {useDashStore} from "~/stores/dash";
import {BanOrder} from "~/composables/dash/types";

definePageMeta({
  layout: 'dash',
})

const {getApi} = useCurApi()
const store = useDashStore()
store.menu_id = '4'

const tab_name = ref('open') //open/his
const od_list = reactive<BanOrder[]>([])
const open_num = ref(-1)
const close_num = ref(-1)
const loading = ref(false)
const page_size = ref(15)
const ban_od = ref<BanOrder|null>(null)
const showOdDetail = ref(false)

async function loadData(page: number) {
  const data: Record<string, any> = {status: tab_name.value}
  if (tab_name.value == 'his') {
    data['limit'] = page_size.value
    data['offset'] = page_size.value * (page - 1)
  }
  const rsp = await getApi('/orders', data)
  const res = rsp.data ?? []
  od_list.splice(0, od_list.length, ...res)
  if (tab_name.value == 'his') {
    close_num.value = rsp.total_num
  } else {
    open_num.value = od_list.length
  }
}

onMounted(() => {
  loadData(1)
})

watch(tab_name, () => {
  loadData(1)
})

function showOrder(idx: number){
  console.log('show order:', idx)
  ban_od.value = od_list[idx]
  showOdDetail.value = true
}
</script>

<template>
  <client-only>
    <el-dialog title="订单详情" v-model="showOdDetail">
      <pre class="od-detail" v-if="ban_od">{{JSON.stringify(ban_od, null, 4)}}</pre>
    </el-dialog>
  </client-only>
  <el-menu mode="horizontal" :default-active="tab_name" @select="tab_name = $event">
    <el-menu-item index="open">打开的订单<span v-if="open_num >= 0">({{open_num}})</span></el-menu-item>
    <el-menu-item index="his">已平仓<span v-if="close_num >= 0">({{close_num}})</span></el-menu-item>
  </el-menu>
  <el-table :data="od_list">
    <el-table-column prop="id" label="ID"/>
    <el-table-column prop="symbol" label="币对"/>
    <el-table-column prop="timeframe" label="时间帧"/>
    <el-table-column prop="short" label="多空">
      <template #default="props">
        <span>{{props.row.short ? '空' : '多'}}</span>
      </template>
    </el-table-column>
    <el-table-column prop="enter_at" label="入场时间">
      <template #default="props">
        <span>{{getDateStr(props.row.enter_at)}}</span>
      </template>
    </el-table-column>
    <el-table-column prop="enter_tag" label="入场标签"/>
    <el-table-column prop="exit_at" label="入场时间" v-if="tab_name == 'his'">
      <template #default="props">
        <span>{{getDateStr(props.row.exit_at)}}</span>
      </template>
    </el-table-column>
    <el-table-column prop="exit_tag" label="出场标签" v-if="tab_name == 'his'"/>
    <el-table-column prop="leverage" label="杠杆"/>
    <el-table-column prop="profit_rate" label="收益"/>
    <el-table-column label="操作" class-name="actions" width="70" align="center">
      <template #default="props">
        <el-link @click="showOrder(props.$index)">查看</el-link>
      </template>
    </el-table-column>
  </el-table>
  <div class="page-box" v-if="close_num > page_size && tab_name == 'his'">
    <el-pagination layout="prev, pager, next" :total="close_num" :page-size="page_size" @current-change="loadData"/>
  </div>
</template>

<style scoped lang="scss">
.od-detail{
  white-space: pre-wrap;
}
</style>