<script setup lang="ts">

import {definePageMeta, getDateStr} from "#imports";
import {useCurApi} from "~/composables/dash/api";
import {useDashStore} from "~/stores/dash";

definePageMeta({
  layout: 'dash',
})

const {getApi, postApi} = useCurApi()
const store = useDashStore()
store.menu_id = 'rebate'

const searchData = reactive({
  intype: 'REFERRAL_KICKBACK',
  symbol: '',
  start_time: '',
  limit: '',
  account: ''
})
const loading = ref(false)
const page_size = ref(15)
const limit_size = ref(30)
const cur_page = ref(1)
const item_list = reactive<Record<string, any>[]>([])
const sta_range = ref('')  // 范围
const sta_total = ref('')  // 总计
const statt = reactive({
  start_date: '',
  stop_date: '',
  num: '',
  assets: ''
})


function calcAssets(items: any[]): string{
  const res: string[] = []
  const data: Record<string, any> = {}
  items.forEach(it => {
    if(data[it.code]){
      data[it.code] += it.amount
    }
    else{
      data[it.code] = it.amount
    }
  })
  for(let k in data){
    res.push(`${k}: ${data[k]}`)
  }
  return res.join('   ')
}


async function loadData(page: number) {
  cur_page.value = page
  const data: Record<string, any> = {...toRaw(searchData)}
  data['start_time'] = toUTCStamp(data['start_time'])
  data['limit'] = limit_size.value
  const rsp = await getApi('/incomes', data)
  let res = [...(rsp.data ?? [])]
  const account = searchData.account
  const org_num = res.length
  // 重置
  statt.start_date = ''
  statt.stop_date = ''
  statt.num = '0'
  statt.assets = ''
  // 显示原始时间范围
  if(res.length) {
    statt.start_date = res[0].timestamp
    statt.stop_date = res[res.length - 1].timestamp
  }
  if(account){
    res = res.filter(it => it.account == account)
  }
  statt.num = `${res.length} (过滤前：${org_num})`
  if(res.length){
    statt.start_date = res[0].timestamp
    statt.stop_date = res[res.length - 1].timestamp
    statt.assets = calcAssets(res)
  }
  item_list.splice(0, item_list.length, ...res)
}

onMounted(() => {
  loadData(1)
})

</script>

<template>
  <el-form :inline="true" :model="searchData">
    <el-row>
      <el-col :span="6">
        <el-form-item>
          <el-select v-model="searchData.intype">
            <el-option value="REALIZED_PNL" label="已实现盈亏"/>
            <el-option value="FUNDING_FEE" label="资金费用"/>
            <el-option value="COMMISSION" label="佣金"/>
            <el-option value="REFERRAL_KICKBACK" label="我推荐得到的返佣"/>
            <el-option value="COMMISSION_REBATE" label="推荐我的人得到的返佣"/>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="账户">
          <el-input v-model="searchData.account"/>
        </el-form-item>
      </el-col>
      <el-col :span="5">
        <el-form-item label="币种">
          <el-input v-model="searchData.symbol"/>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="6">
        <el-form-item label="开始时间" :required="true">
          <el-input v-model="searchData.start_time" placeholder="20231012"/>
        </el-form-item>
      </el-col>
      <el-col :span="4">
        <el-form-item label="显示个数">
          <el-input type="number" v-model="limit_size" />
        </el-form-item>
      </el-col>
      <el-col :span="4" :offset="5">
        <el-form-item>
          <el-button type="primary" @click="loadData(1)">查询</el-button>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
  <el-descriptions border :column="2">
    <el-descriptions-item label="开始时间" align="center">{{statt.start_date}}</el-descriptions-item>
    <el-descriptions-item label="结束时间" align="center">{{statt.stop_date}}</el-descriptions-item>
    <el-descriptions-item label="数量" align="center">{{statt.num}}</el-descriptions-item>
    <el-descriptions-item label="总计" align="center">{{statt.assets}}</el-descriptions-item>
  </el-descriptions>
  <el-table :data="item_list">
    <el-table-column prop="id" label="ID"/>
    <el-table-column prop="symbol" label="币对"/>
    <el-table-column prop="amount" label="金额"/>
    <el-table-column prop="code" label="资产"/>
    <el-table-column prop="timestamp" label="时间戳"/>
    <el-table-column prop="timestamp" label="时间">
      <template #default="props">
        <span>{{getDateStr(props.row.timestamp)}}</span>
      </template>
    </el-table-column>
    <el-table-column prop="account" label="账户"/>
    <el-table-column prop="tradeId" label="交易ID"/>
  </el-table>
</template>

<style scoped lang="scss">

.page-head{
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  .el-menu{
    flex-grow: 1;
  }
}
.el-table{
  .actions{
    .el-link{
      margin-right: 10px;
    }
  }
}
</style>