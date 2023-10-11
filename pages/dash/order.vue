<script setup lang="ts">

import {definePageMeta} from "#imports";
import {useCurApi} from "~/composables/dash/api";
import {useDashStore} from "~/stores/dash";
import {BanOrder, OpenOrder} from "~/composables/types";

definePageMeta({
  layout: 'dash',
})

const {getApi, postApi} = useCurApi()
const store = useDashStore()
store.menu_id = 'order'

const tab_name = ref('bot') //bot/exchange
const banod_list = reactive<BanOrder[]>([])
const exgod_list = reactive<Record<string, any>[]>([])
const loading = ref(false)
const page_size = ref(15)
const cur_page = ref(1)
const banod_num = ref(0)
const exgod_num = ref(0)
const ban_od = ref<Record<string, any>|null>(null)
const showOdDetail = ref(false)
const showOpenOrder = ref(false)
const openingOd = ref(false)
const openOd = reactive<OpenOrder>({
  pair: '',
  side: 'long',
  order_type: '',
  price: undefined,
  stoploss_price: undefined,
  enter_cost: undefined,
  enter_tag: undefined,
  leverage: undefined,
  strategy: undefined
})

const searchData = reactive({
  status: '',
  symbol: '',
  start_time: '',
  stop_time: ''
})

const quoteSymbol = computed(() => {
  const arr = openOd.pair.split('/')
  if(arr.length !== 2)return ''
  let quote = arr[1];
  quote = quote.split('.')[0]
  return quote.split(':')[0]
})

async function loadData(page: number) {
  cur_page.value = page
  const data: Record<string, any> = {...toRaw(searchData)}
  data['start_time'] = toUTCStamp(data['start_time'])
  data['stop_time'] = toUTCStamp(data['stop_time'])
  data['source'] = tab_name.value
  data['limit'] = page_size.value
  data['offset'] = page_size.value * (page - 1)
  const rsp = await getApi('/orders', data)
  const res = rsp.data ?? []
  if(tab_name.value == 'bot'){
    banod_list.splice(0, banod_list.length, ...res)
  }
  else{
    exgod_list.splice(0, exgod_list.length, ...res)
  }
}

onMounted(() => {
  loadData(1)
})


function showOrder(idx: number){
  if(tab_name.value == 'bot') {
    ban_od.value = banod_list[idx]
  }
  else{
    ban_od.value = exgod_list[idx]
  }
  showOdDetail.value = true
}

async function closeOrder(order_id: string) {
  try {
    await ElMessageBox.confirm('确定要立刻平仓吗？', '提示')
  } catch (e) {
    return
  }
  const rsp = await postApi('/forceexit', {order_id})
  const close_num = rsp.close_num ?? 0
  ElMessage.success({message: `已关闭${close_num}个订单`})
  await loadData(1)
}

function clickShowOpen(){
  showOpenOrder.value = true
}

async function doOpenOrder(){
  openingOd.value = true
  const rsp = await postApi('/forceenter', openOd)
  openingOd.value = false
  console.log('open order res:', rsp)
  if(rsp.code != 200){
    ElMessage.error({message: rsp.msg ?? '开单失败'})
  }
  else{
    ElMessage.success({message: '开单成功'})
    showOpenOrder.value = false
  }
}

async function clickCalcProfits(){
  const rsp = await postApi('/calc_profits', {})
  console.log('calc profits:', rsp)
  if(rsp.code != 200){
    ElMessage.error({message: rsp.msg ?? '更新失败'})
  }
  else{
    ElMessage.success({message: `已更新${rsp.num}个订单`})
    await loadData(cur_page.value)
  }
}
</script>

<template>
  <client-only>
    <el-dialog title="订单详情" v-model="showOdDetail">
      <pre class="od-detail" v-if="ban_od">{{JSON.stringify(ban_od, null, 4)}}</pre>
    </el-dialog>
    <el-dialog title="手动开单" v-model="showOpenOrder" width="600px">
      <el-form v-model="openOd" label-width="100px" style="margin: 0 30px">
        <el-form-item prop="pair" label="交易对" required>
          <el-input v-model="openOd.pair" placeholder="请输入监听的币种代码"/>
        </el-form-item>
        <el-form-item prop="side" label="方向">
          <el-select v-model="openOd.side">
            <el-option value="long" label="开多" />
            <el-option value="short" label="开空" />
          </el-select>
        </el-form-item>
        <el-form-item prop="enter_cost" label="名义价值" required>
          <el-input v-model="openOd.enter_cost" type="number">
            <template #append>{{quoteSymbol}}</template>
          </el-input>
        </el-form-item>
        <el-form-item prop="order_type" label="订单类型">
          <el-select v-model="openOd.order_type">
            <el-option value="market" label="市价单" />
            <el-option value="limit" label="限价单" />
          </el-select>
        </el-form-item>
        <el-form-item prop="price" label="价格" v-if="openOd.order_type != 'market'">
          <el-input v-model="openOd.price" type="number"/>
        </el-form-item>
        <el-form-item prop="stoploss_price" label="止损价格" v-if="openOd.order_type != 'market'">
          <el-input v-model="openOd.stoploss_price" type="number"/>
        </el-form-item>
        <el-form-item prop="enter_tag" label="入场原因">
          <el-input v-model="openOd.enter_tag" />
        </el-form-item>
        <el-form-item prop="leverage" label="杠杆倍数">
          <el-input v-model="openOd.leverage" type="number" step="1" min="1" max="200"/>
        </el-form-item>
        <el-form-item prop="strategy" label="策略">
          <el-input v-model="openOd.strategy" placeholder="请输入在运行的策略代码"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="openingOd" @click="doOpenOrder">保存</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </client-only>
  <div class="page-head">
    <el-menu mode="horizontal" :default-active="tab_name" @select="tab_name = $event">
      <el-menu-item index="bot">机器人订单</el-menu-item>
      <el-menu-item index="exchange">交易所订单</el-menu-item>
    </el-menu>
    <div class="head-btns" v-if="tab_name == 'bot'">
      <el-button type="primary" @click="clickCalcProfits">更新利润</el-button>
      <el-button type="primary" @click="clickShowOpen">开单</el-button>
      <el-button type="danger" @click="closeOrder('all')">全部平仓</el-button>
    </div>
  </div>
  <el-form :inline="true" :model="searchData">
    <el-row>
      <el-col :span="4">
        <el-form-item label="状态" v-if="tab_name == 'bot'" >
          <el-select v-model="searchData.status">
            <el-option value="">不限</el-option>
            <el-option value="open">开启</el-option>
            <el-option value="his">已平仓</el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="4">
        <el-form-item label="币种" :required="tab_name != 'bot'">
          <el-input v-model="searchData.symbol"/>
        </el-form-item>
      </el-col>
      <el-col :span="4">
        <el-form-item label="开始时间" :required="tab_name != 'bot'">
          <el-input v-model="searchData.start_time" placeholder="20231012"/>
        </el-form-item>
      </el-col>
      <el-col :span="4">
        <el-form-item label="截止时间" v-if="tab_name == 'bot'">
          <el-input v-model="searchData.stop_time" placeholder="20231012"/>
        </el-form-item>
      </el-col>
      <el-col :span="4">
        <el-form-item>
          <el-button type="primary" @click="loadData(1)">查询</el-button>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
  <el-table :data="banod_list" v-if="tab_name == 'bot'">
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
    <el-table-column prop="exit_at" label="出场时间">
      <template #default="props">
        <span>{{getDateStr(props.row.exit_at)}}</span>
      </template>
    </el-table-column>
    <el-table-column prop="exit_tag" label="出场标签"/>
    <el-table-column prop="leverage" label="杠杆"/>
    <el-table-column prop="profit_rate" label="收益率">
      <template #default="props">{{(props.row.profit_rate * 100).toFixed(1)}}%</template>
    </el-table-column>
    <el-table-column label="收益">
      <template #default="props">{{(props.row.profit).toFixed(5)}}</template>
    </el-table-column>
    <el-table-column label="操作" class-name="actions" width="150" align="center">
      <template #default="props">
        <el-link @click="showOrder(props.$index)">查看</el-link>
        <el-link @click="closeOrder(props.row.id.toString())" v-if="props.row.status != 4">平仓</el-link>
      </template>
    </el-table-column>
  </el-table>
  <el-table :data="exgod_list" v-else>
    <el-table-column prop="id" label="订单ID"/>
    <el-table-column prop="clientOrderId" label="Clent ID"/>
    <el-table-column prop="symbol" label="币对"/>
    <el-table-column prop="timestamp" label="时间">
      <template #default="props">
        <span>{{getDateStr(props.row.timestamp)}}</span>
      </template>
    </el-table-column>
    <el-table-column prop="side" label="多空"/>
    <el-table-column prop="price" label="价格"/>
    <el-table-column prop="amount" label="数量"/>
    <el-table-column prop="status" label="状态"/>
    <el-table-column label="操作" class-name="actions" width="150" align="center">
      <template #default="props">
        <el-link @click="showOrder(props.$index)">查看</el-link>
      </template>
    </el-table-column>
  </el-table>
  <div class="page-box">
    <template v-if="banod_num > page_size && tab_name == 'bot'">
      <el-pagination layout="prev, pager, next" :total="banod_num" :page-size="page_size" @current-change="loadData"/>
    </template>
  </div>
</template>

<style scoped lang="scss">
.od-detail{
  white-space: pre-wrap;
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
.el-table{
  .actions{
    .el-link{
      margin-right: 10px;
    }
  }
}
</style>