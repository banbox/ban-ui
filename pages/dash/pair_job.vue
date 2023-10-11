<script setup lang="ts">

import {definePageMeta} from "#imports";
import {useCurApi} from "~/composables/dash/api";
import {PairPerf, PairStgyTf, StgyVer} from "~/composables/dash/types";
import * as diagnostics_channel from "diagnostics_channel";
import {useDashStore} from "~/stores/dash";

definePageMeta({
  layout: 'dash',
})

const {getApi} = useCurApi()
const store = useDashStore()
store.menu_id = 'job'

const tab_name = ref('symbol')
const pairs = reactive<PairPerf[]>([])
const jobs = reactive<PairStgyTf[]>([])
const stgy_list = reactive<StgyVer[]>([])
const show_code = ref(false)
const active_stgy = ref('')
const stgy_content = ref('')

async function loadData(){
  let rsp = await getApi('/performance')
  const cur_pairs = rsp.data ?? []
  pairs.splice(0, pairs.length, ...cur_pairs)
  // 显示job列表
  rsp = await getApi('/pair_stgs')
  const pjobs = rsp.jobs ?? []
  jobs.splice(0, pjobs.length, ...pjobs)
  // 策略列表
  const stgy: Record<string, number> = rsp.stgy ?? {}
  stgy_list.splice(0, stgy_list.length)
  for(const [key, val] of Object.entries(stgy)){
    stgy_list.push({name: key, version: val})
  }
}

// async function showStgyCode(name: string){
//   const rsp = await getApi('/strategy/' + name)
//   stgy_content.value = rsp.data ?? ''
//   active_stgy.value = name
//   show_code.value = true
// }

onMounted(() => {
  loadData()
})

</script>

<template>
  <client-only>
    <el-dialog v-model="show_code" :title="active_stgy" width="80%">
      <pre class="stgy-code">{{stgy_content}}</pre>
    </el-dialog>
  </client-only>
  <el-tabs v-model="tab_name">
    <el-tab-pane name="symbol" label="币对">
      <el-table :data="pairs">
        <el-table-column prop="pair" label="币对" />
        <el-table-column prop="close_num" label="平仓单数" />
        <el-table-column prop="profit_sum" label="总利润" >
          <template #default="scope">{{scope.row.profit_sum.toFixed(5)}}</template>
        </el-table-column>
        <el-table-column prop="profit_pct" label="收益" >
          <template #default="scope">{{(scope.row.profit_pct * 100).toFixed(1)}}%</template>
        </el-table-column>
      </el-table>
    </el-tab-pane>
    <el-tab-pane name="strategy" label="策略">
      <el-table :data="stgy_list">
        <el-table-column prop="name" label="策略" />
        <el-table-column prop="version" label="版本" />
<!--        <el-table-column label="操作" >-->
<!--          <template #default="props">-->
<!--            <el-link @click="showStgyCode(props.row.name)">查看</el-link>-->
<!--          </template>-->
<!--        </el-table-column>-->
      </el-table>
    </el-tab-pane>
    <el-tab-pane name="pair_stgy" label="运行任务">
      <el-table :data="jobs">
        <el-table-column prop="stgy" label="策略" />
        <el-table-column prop="pair" label="币对" />
        <el-table-column prop="tf" label="周期" />
      </el-table>
    </el-tab-pane>
  </el-tabs>
</template>

<style scoped lang="scss">
.stgy-code{
  height: 800px;
  max-height: 63vh;
  overflow-y: auto;
}
</style>