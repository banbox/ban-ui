<script setup lang="ts">

import {definePageMeta} from "#imports";
import {useCurApi} from "~/composables/dash/api";
import type {PairStgyTf, StgyVer} from "~/composables/dash/types";
import _ from "lodash"
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
const active_stgy = ref('')
const stgy_content = ref('')
const job = reactive<PairStgyTf>({
  pair: '',
  strategy: '',
  tf: '',
  price: 0,
  od_num: 0,
  args: []
})
const showJobEdit = ref(false)


async function loadData(){
  // 显示job列表
  const rsp = await getApi('/stg_jobs')
  const pjobs = rsp.jobs ?? []
  jobs.splice(0, pjobs.length, ...pjobs)
  // 策略列表
  const stgy: Record<string, number> = rsp.stgy ?? {}
  stgy_list.splice(0, stgy_list.length)
  for(const [key, val] of Object.entries(stgy)){
    stgy_list.push({name: key, version: val})
  }
}

function editJobArgs(row: PairStgyTf){
  Object.assign(job, row)
  showJobEdit.value = true
}

function showJobArgs(row: PairStgyTf){
  if(!_.isArrayLike(row.args))return ''
  const result = []
  for(let item of row.args){
    if(!item.value)continue
    result.push(item.title, ', ')
  }
  return result.join('')
}

function createStrategy(){

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
    <DashEditJob v-model="showJobEdit" :job="job" />
  </client-only>
  <div class="page-head">
    <el-menu mode="horizontal" :default-active="tab_name">
      <el-menu-item index="symbol">交易对</el-menu-item>
      <el-menu-item index="strategy">策略</el-menu-item>
    </el-menu>
    <div class="head-btns" v-if="tab_name == 'symbol'">
<!--      <el-button type="primary" @click="clickPairList(true)">白名单</el-button>-->
    </div>
    <div class="head-btns" v-else-if="tab_name == 'strategy'">
      <el-button type="primary" @click="createStrategy">新建策略</el-button>
    </div>
  </div>
  <el-table :data="jobs" v-if="tab_name == 'symbol'">
    <el-table-column prop="pair" label="币对" />
    <el-table-column prop="tf" label="周期" width="80" />
    <el-table-column prop="price" label="价格" width="150" />
    <el-table-column prop="od_num" label="订单数" width="80" />
    <el-table-column prop="strategy" label="策略" />
    <el-table-column prop="info" label="设置" >
      <template #default="props">
        {{showJobArgs(props.row)}}
      </template>
    </el-table-column>
    <el-table-column prop="action" label="操作" >
      <template #default="props">
        <el-link type="primary" v-if="_isArrayLike(props.row.args)" @click="editJobArgs(props.row)">修改</el-link>
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