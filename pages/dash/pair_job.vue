<script setup lang="ts">

import {definePageMeta} from "#imports";
import {useCurApi} from "~/composables/dash/api";
import {PairPerf, PairStgyTf, StgyVer} from "~/composables/dash/types";
import * as diagnostics_channel from "diagnostics_channel";
import {useDashStore} from "~/stores/dash";
import {useLocalePath} from "#i18n";

definePageMeta({
  layout: 'dash',
})

const {getApi, postApi} = useCurApi()
const store = useDashStore()
store.menu_id = 'job'
const localPath = useLocalePath()

const tab_name = ref('symbol')
const jobs = reactive<PairStgyTf[]>([])
const stgy_list = reactive<StgyVer[]>([])
const show_code = ref(false)
const isWhitePair = ref(false)
const showPairList = ref(false)
const active_stgy = ref('')
const stgy_content = ref('')

async function loadData(){
  // 显示job列表
  const rsp = await getApi('/pair_jobs')
  const pjobs = rsp.jobs ?? []
  jobs.splice(0, pjobs.length, ...pjobs)
  // 策略列表
  const stgy: Record<string, number> = rsp.stgy ?? {}
  stgy_list.splice(0, stgy_list.length)
  for(const [key, val] of Object.entries(stgy)){
    stgy_list.push({name: key, version: val})
  }
}

function clickPairList(is_white: boolean){
  showPairList.value = true
  isWhitePair.value = is_white
}

function createStrategy(){

}

async function switchChange(job: PairStgyTf, key: string, flag: any){
  const data = {pair: job.pair, tf: job.tf, stgy: job.stgy, key, val: flag}
  const rsp = await postApi('/edit_job', data)
  if(rsp.code != 200){
    const message = rsp.msg ?? '保存失败'
    ElMessage({type: 'error', message})
    return
  }
  await loadData()
}

onMounted(() => {
  loadData()
})

</script>

<template>
  <client-only>
    <el-dialog v-model="show_code" :title="active_stgy" width="80%">
      <pre class="stgy-code">{{stgy_content}}</pre>
    </el-dialog>
    <DashPairList :is_white="isWhitePair" v-model="showPairList"/>
  </client-only>
  <div class="page-head">
    <el-menu mode="horizontal" :default-active="tab_name">
      <el-menu-item index="symbol">交易对</el-menu-item>
      <el-menu-item index="strategy">策略</el-menu-item>
    </el-menu>
    <div class="head-btns" v-if="tab_name == 'symbol'">
      <el-button type="primary" @click="clickPairList(true)">白名单</el-button>
      <el-button type="danger" @click="clickPairList(false)">黑名单</el-button>
    </div>
    <div class="head-btns" v-else-if="tab_name == 'strategy'">
      <el-button type="primary" @click="createStrategy">新建策略</el-button>
    </div>
  </div>
  <el-table :data="jobs" v-if="tab_name == 'symbol'">
    <el-table-column prop="pair" label="币对" />
    <el-table-column prop="tf" label="周期" width="80" />
    <el-table-column prop="stgy" label="策略" />
    <el-table-column prop="switch" label="开关" >
      <template #default="props">
        <el-switch :model-value="props.row.open_long" width="50" inline-prompt
                   active-text="开多" inactive-text="开多" @change="switchChange(props.row, 'open_long', $event)"/>
        <el-switch :model-value="props.row.open_short" width="50" inline-prompt
                   active-text="开空" inactive-text="开空" @change="switchChange(props.row, 'open_short', $event)"/>
        <el-switch :model-value="props.row.close_long" width="50" inline-prompt
                   active-text="平多" inactive-text="平多" @change="switchChange(props.row, 'close_long', $event)"/>
        <el-switch :model-value="props.row.close_short" width="50" inline-prompt
                   active-text="平空" inactive-text="平空" @change="switchChange(props.row, 'close_short', $event)"/>
        <el-switch :model-value="props.row.exg_stoploss" width="70" inline-prompt
                   active-text="止损单" inactive-text="止损单" @change="switchChange(props.row, 'exg_stoploss', $event)"/>
        <el-switch :model-value="props.row.exg_takeprofit" width="70" inline-prompt
                   active-text="止盈单" inactive-text="止盈单" @change="switchChange(props.row, 'exg_takeprofit', $event)"/>
      </template>
    </el-table-column>
  </el-table>
  <el-table :data="stgy_list" v-else-if="tab_name == 'strategy'">
    <el-table-column prop="name" label="策略" />
    <el-table-column prop="version" label="版本" />
<!--        <el-table-column label="操作" >-->
<!--          <template #default="props">-->
<!--            <el-link @click="showStgyCode(props.row.name)">查看</el-link>-->
<!--          </template>-->
<!--        </el-table-column>-->
  </el-table>
</template>

<style scoped lang="scss">
.stgy-code{
  height: 800px;
  max-height: 63vh;
  overflow-y: auto;
}
.page-head{
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  .el-menu{
    flex-grow: 1;
  }
}
</style>