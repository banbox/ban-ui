<script setup lang="ts">

import {definePageMeta, getDateStr} from "#imports";
import {useCurApi} from "~/composables/dash/api";
import {useDashStore} from "~/stores/dash";
import type {BanOrder, InoutStatus, OpenOrder, OrderStatus} from "~/composables/types";

definePageMeta({
  layout: 'dash',
})

const {getApi, postApi} = useCurApi()
const store = useDashStore()
store.menu_id = 'order'

const tab_name = ref('bot') //bot/exchange/position
const banod_list = reactive<BanOrder[]>([])
const exgod_list = reactive<Record<string, any>[]>([])
const exgpos_list = reactive<Record<string, any>[]>([])
const loading = ref(false)
const page_size = ref(15)
const limit_size = ref(30)
const cur_page = ref(1)
const banod_num = ref(0)
const exgod_num = ref(0)
const ban_od = ref<BanOrder|null>(null)
const ex_od = ref<Record<string, any>|null>(null)
const showOdDetail = ref(false)
const showExOdDetail = ref(false)
const showOpenOrder = ref(false)
const openingOd = ref(false)  // 正在创建订单
const showCloseExg = ref(false)  // 显示关闭交易所仓位对话框
const closingExgPos = ref(false)  // 正在关闭交易所仓位
const ex_filter = ref('')
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

const closeExgPos = reactive({
  symbol: '',
  side: '',
  init_amount: 0,
  amount: 0,
  percent: 100,
  order_type: '',
  price: undefined,
})


const searchData = reactive({
  status: '',
  symbol: '',
  start_time: '',
  stop_time: ''
})

function getQuoteCode(symbol: string){
  const arr = symbol.split('/')
  if(arr.length !== 2)return ''
  let quote = arr[1];
  quote = quote.split('.')[0]
  return quote.split(':')[0]
}

async function loadData(page: number) {
  cur_page.value = page
  const data: Record<string, any> = {...toRaw(searchData)}
  data['start_time'] = toUTCStamp(data['start_time'])
  data['stop_time'] = toUTCStamp(data['stop_time'])
  data['source'] = tab_name.value
  if(tab_name.value == 'bot') {
    data['limit'] = page_size.value
    data['offset'] = page_size.value * (page - 1)
  }else if(tab_name.value == 'exchange'){
    data['limit'] = limit_size.value
  }
  const rsp = await getApi('/orders', data)
  let res = rsp.data ?? []
  ex_filter.value = ''
  if(tab_name.value == 'bot'){
    banod_list.splice(0, banod_list.length, ...res)
  }
  else if(tab_name.value == 'exchange'){
    if(searchData.status){
      const old_num = res.length
      const req_valid = searchData.status == 'valid'
      res = res.filter((od: any) => od.filled)
      ex_filter.value = `已筛选：${res.length}/${old_num}`
    }
    exgod_list.splice(0, exgod_list.length, ...res)
  }
  else {
    exgpos_list.splice(0, exgpos_list.length, ...res)
  }
}

onMounted(() => {
  loadData(1)
})

function onPosAmountChg(percent: number){
  closeExgPos.amount = parseFloat((closeExgPos.init_amount * percent / 100).toFixed(5))
}

function onTabChange(name: string) {
  tab_name.value = name
  if (name == 'position' && !exgpos_list.length) {
    loadData(1)
  }
}

function showOrder(idx: number) {
  if (tab_name.value == 'bot') {
    ban_od.value = banod_list[idx]
    showOdDetail.value = true
  } else if (tab_name.value == 'exchange') {
    ex_od.value = exgod_list[idx]
    showExOdDetail.value = true
  } else if (tab_name.value == 'position') {
    ex_od.value = exgpos_list[idx]
    showExOdDetail.value = true
  }
}


async function closeOrder(order_id: string) {
  try {
    await ElMessageBox.confirm('确定要立刻平仓吗？', '提示')
  } catch (e) {
    return
  }
  const rsp = await postApi('/forceexit', {order_id})
  const close_num = rsp.close_num ?? 0
  ElMessage.success({message: `已关闭${close_num}个仓位`})
  await loadData(1)
}

function clickCloseExgPos(index: number){
  const item = exgpos_list[index]
  closeExgPos.symbol = item.symbol
  closeExgPos.amount = item.contracts
  closeExgPos.side = item.side
  closeExgPos.init_amount = item.contracts
  closeExgPos.percent = 100
  closeExgPos.order_type = 'market'
  showCloseExg.value = true
}

/**
 * 关闭交易所仓位
 * @param symbol
 */
async function closeExgPosition(all: boolean = false){
  let data = toRaw(closeExgPos)
  if(all === true) {
    try {
      await ElMessageBox.confirm('确定要关闭所有交易所仓位吗？', '提示')
    } catch (e) {
      return
    }
    data.symbol = 'all'
  }
  const rsp = await postApi('/close_pos', data)
  const close_num = rsp.close_num ?? 0
  const done_num = rsp.done_num ?? 0
  let message = `已关闭${close_num}个订单`
  if (done_num) {
    message += `，已成交${done_num}个订单`
  }
  showCloseExg.value = false
  ElMessage.success({message})
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
      <el-descriptions border :column="2" v-if="ban_od">
        <el-descriptions-item label="ID" align="center">{{ban_od.id}}</el-descriptions-item>
        <el-descriptions-item label="币种" align="center">{{ban_od.symbol}}  {{ban_od.sid}}</el-descriptions-item>
        <el-descriptions-item label="时间周期" align="center">{{ban_od.timeframe}}</el-descriptions-item>
        <el-descriptions-item label="多空" align="center">{{ban_od.short ? '空': '多'}}</el-descriptions-item>
        <el-descriptions-item label="杠杆" align="center">{{ban_od.leverage}}</el-descriptions-item>
        <el-descriptions-item label="策略" align="center">{{ban_od.strategy}}:{{ban_od.stg_ver}}</el-descriptions-item>
        <el-descriptions-item label="状态" align="center">{{InoutStatus[ban_od.status]}}</el-descriptions-item>
        <el-descriptions-item label="持仓时间" align="center">{{fmtDuration(ban_od.duration)}}</el-descriptions-item>
      </el-descriptions>
      <el-descriptions border title="入场订单" :column="2" v-if="ban_od">
        <el-descriptions-item label="入场信号时间" align="center">{{getDateStr(ban_od.enter_at)}}(UTC)</el-descriptions-item>
        <el-descriptions-item label="确认入场时间" align="center">{{getDateStr(ban_od.enter_create_at)}}(UTC)</el-descriptions-item>
        <el-descriptions-item label="入场标签" align="center">{{ban_od.enter_tag}}</el-descriptions-item>
        <el-descriptions-item label="入场信号价格" align="center">{{ban_od.init_price.toFixed(7)}}</el-descriptions-item>
        <el-descriptions-item label="确认入场价格" align="center">{{ban_od.enter_price.toFixed(7)}}</el-descriptions-item>
        <el-descriptions-item label="入场均价" align="center">{{ban_od.enter_average}}</el-descriptions-item>
        <el-descriptions-item label="数量" align="center">{{ban_od.enter_amount.toFixed(5)}}</el-descriptions-item>
        <el-descriptions-item label="已成交数量" align="center">{{ban_od.enter_filled.toFixed(5)}}</el-descriptions-item>
        <el-descriptions-item label="花费" align="center">{{ban_od.enter_cost.toFixed(5)}}</el-descriptions-item>
        <el-descriptions-item label="状态" align="center">{{OrderStatus[ban_od.enter_status]}}</el-descriptions-item>
        <el-descriptions-item label="订单类型" align="center">{{ban_od.enter_order_type}}</el-descriptions-item>
        <el-descriptions-item label="方向" align="center">{{ban_od.enter_side}}</el-descriptions-item>
        <el-descriptions-item label="手续费" align="center">{{ban_od.enter_fee_type}}  {{(ban_od.enter_fee * 100).toFixed(3)}}%</el-descriptions-item>
        <el-descriptions-item label="更新时间" align="center">{{getDateStr(ban_od.enter_update_at)}}(UTC)</el-descriptions-item>
      </el-descriptions>
      <el-descriptions border title="出场订单" :column="2" v-if="ban_od && ban_od.exit_tag">
        <el-descriptions-item label="出场信号时间" align="center">{{getDateStr(ban_od.exit_at)}}(UTC)</el-descriptions-item>
        <el-descriptions-item label="出场标签" align="center">{{ban_od.exit_tag}}</el-descriptions-item>
        <template v-if="ban_od.exit_filled">
          <el-descriptions-item label="确认出场时间" align="center">{{getDateStr(ban_od.exit_create_at)}}(UTC)</el-descriptions-item>
          <el-descriptions-item label="确认出场价格" align="center">{{getDateStr(ban_od.exit_price?.toFixed(7))}}(UTC)</el-descriptions-item>
          <el-descriptions-item label="出场均价" align="center">{{ban_od.exit_average?.toFixed(7)}}</el-descriptions-item>
          <el-descriptions-item label="数量" align="center">{{ban_od.exit_amount?.toFixed(5)}}</el-descriptions-item>
          <el-descriptions-item label="已成交数量" align="center">{{ban_od.exit_filled?.toFixed(5)}}</el-descriptions-item>
          <el-descriptions-item label="状态" align="center">{{OrderStatus[ban_od.exit_status]}}</el-descriptions-item>
          <el-descriptions-item label="订单类型" align="center">{{ban_od.exit_order_type}}</el-descriptions-item>
          <el-descriptions-item label="方向" align="center">{{ban_od.exit_side}}</el-descriptions-item>
          <el-descriptions-item label="手续费" align="center">{{ban_od.exit_fee_type}}  {{(ban_od.exit_fee * 100).toFixed(3)}}%</el-descriptions-item>
          <el-descriptions-item label="更新时间" align="center">{{getDateStr(ban_od.exit_update_at)}}(UTC)</el-descriptions-item>
        </template>
      </el-descriptions>
      <pre class="od-detail" v-if="ban_od && ban_od.info">{{JSON.stringify(ban_od.info, null, 4)}}</pre>
    </el-dialog>
    <el-dialog title="详情" v-model="showExOdDetail">
      <pre class="od-detail" v-if="ex_od">{{JSON.stringify(ex_od, null, 4)}}</pre>
    </el-dialog>
    <el-dialog title="手动开单" v-model="showOpenOrder" width="600px">
      <el-form v-model="openOd" label-width="100px" style="margin: 0 30px">
        <el-form-item prop="pair" label="交易对" required>
          <el-input v-model="openOd.pair" placeholder="请输入监听的币种代码"/>
        </el-form-item>
        <el-form-item prop="side" label="方向">
          <el-radio-group v-model="openOd.side">
            <el-radio label="long">开多</el-radio>
            <el-radio label="short">开空</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="enter_cost" label="名义价值" required>
          <el-input v-model="openOd.enter_cost" type="number">
            <template #append>{{getQuoteCode(openOd.pair)}}</template>
          </el-input>
        </el-form-item>
        <el-form-item prop="order_type" label="订单类型">
          <el-radio-group v-model="openOd.order_type">
            <el-radio label="market">市价单</el-radio>
            <el-radio label="limit">限价单</el-radio>
          </el-radio-group>
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
    <el-dialog title="交易所平仓" v-model="showCloseExg" width="500px">
      <el-form v-model="closeExgPos" label-width="100px" style="margin: 0 30px">
        <el-form-item prop="pair" label="交易对" required>
          <el-input v-model="closeExgPos.symbol" disabled/>
        </el-form-item>
        <el-form-item prop="amount" label="平仓数量" required>
          <el-input v-model="closeExgPos.amount" type="number"/>
        </el-form-item>
        <el-form-item label="">
          <el-slider v-model="closeExgPos.percent" @change="onPosAmountChg"/>
        </el-form-item>
        <el-form-item prop="order_type" label="订单类型">
          <el-radio-group v-model="closeExgPos.order_type">
            <el-radio label="market">市价单</el-radio>
            <el-radio label="limit">限价单</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="price" label="价格" v-if="closeExgPos.order_type != 'market'">
          <el-input v-model="closeExgPos.price" type="number"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="closingExgPos" @click="closeExgPosition">保存</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </client-only>
  <div class="page-head">
    <el-menu mode="horizontal" :default-active="tab_name" @select="onTabChange">
      <el-menu-item index="bot">机器人订单</el-menu-item>
      <el-menu-item index="exchange">交易所订单</el-menu-item>
      <el-menu-item index="position">交易所仓位</el-menu-item>
    </el-menu>
    <div class="head-btns" v-if="tab_name == 'bot'">
      <el-button type="primary" @click="clickCalcProfits">更新利润</el-button>
      <el-button type="primary" @click="clickShowOpen">开单</el-button>
      <el-button type="danger" @click="closeOrder('all')">全部平仓</el-button>
    </div>
    <div class="head-btns" v-if="tab_name == 'position'">
      <el-button type="primary" @click="loadData(1)">刷新</el-button>
      <el-button type="danger" @click="closeExgPosition(true)">全部平仓</el-button>
    </div>
  </div>
  <el-form :inline="true" :model="searchData" v-if="tab_name != 'position'">
    <el-row>
      <el-col :span="4">
        <el-form-item label="状态" v-if="tab_name == 'bot'" >
          <el-select v-model="searchData.status">
            <el-option value="" label="不限"/>
            <el-option value="open" label="开启"/>
            <el-option value="his" label="已平仓"/>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" v-else>
          <el-select v-model="searchData.status">
            <el-option value="" label="不限"/>
            <el-option value="valid" label="有效订单"/>
            <el-option value="invalid" label="无效订单"/>
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
        <el-form-item label="显示个数" v-else>
          <el-input type="number" v-model="limit_size" />
        </el-form-item>
      </el-col>
      <el-col :span="4">
        <el-form-item>
          <el-button type="primary" @click="loadData(1)">查询</el-button>
        </el-form-item>
      </el-col>
      <el-col :span="4">
        {{ex_filter}}
      </el-col>
    </el-row>
  </el-form>
  <el-table :data="banod_list" v-if="tab_name == 'bot'">
    <el-table-column prop="id" label="ID"/>
    <el-table-column prop="symbol" label="币对"/>
    <el-table-column prop="timeframe" label="周期/多空/杠杆">
      <template #default="props">
        <span>{{props.row.timeframe}}/{{props.row.short ? '空' : '多'}}/{{props.row.leverage}}</span>
      </template>
    </el-table-column>
    <el-table-column prop="enter_at" label="入场时间">
      <template #default="props">
        <span>{{getDateStr(props.row.enter_at)}}</span>
      </template>
    </el-table-column>
    <el-table-column prop="enter_tag" label="入场标签"/>
    <el-table-column prop="enter_price" label="入场价格">
      <template #default="props">
        <span>{{(props.row.enter_average ?? props.row.enter_price ?? props.row.init_price).toFixed(7)}}</span>
      </template>
    </el-table-column>
    <el-table-column prop="exit_at" label="出场时间">
      <template #default="props">
        <span>{{getDateStr(props.row.exit_at)}}</span>
      </template>
    </el-table-column>
    <el-table-column prop="exit_tag" label="出场标签"/>
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
  <el-table :data="exgod_list" v-else-if="tab_name == 'exchange'">
    <el-table-column prop="id" label="订单ID"/>
    <el-table-column prop="clientOrderId" label="Clent ID"/>
    <el-table-column prop="symbol" label="币对"/>
    <el-table-column prop="timestamp" label="时间">
      <template #default="props">
        <span>{{getDateStr(props.row.timestamp)}}</span>
      </template>
    </el-table-column>
    <el-table-column prop="side" label="多空"/>
    <el-table-column prop="reduceOnly" label="出入">
      <template #default="props">
        <span>{{props.row.reduceOnly ? '平仓' : '开仓'}}</span>
      </template>
    </el-table-column>
    <el-table-column prop="price" label="价格"/>
    <el-table-column prop="amount" label="数量"/>
    <el-table-column prop="status" label="状态"/>
    <el-table-column label="操作" class-name="actions" width="150" align="center">
      <template #default="props">
        <el-link @click="showOrder(props.$index)">查看</el-link>
      </template>
    </el-table-column>
  </el-table>
  <el-table :data="exgpos_list" v-else>
    <el-table-column prop="symbol" label="币对"/>
    <el-table-column prop="timestamp" label="时间">
      <template #default="props">
        <span>{{getDateStr(props.row.timestamp)}}</span>
      </template>
    </el-table-column>
    <el-table-column prop="side" label="多空"/>
    <el-table-column prop="reduceOnly" label="出入">
      <template #default="props">
        <span>{{props.row.reduceOnly ? '平仓' : '开仓'}}</span>
      </template>
    </el-table-column>
    <el-table-column prop="entryPrice" label="开仓价格"/>
    <el-table-column prop="notional" label="名义价值"/>
    <el-table-column prop="leverage" label="杠杆"/>
    <el-table-column prop="unrealizedPnl" label="未实现盈亏"/>
    <el-table-column label="操作" class-name="actions" width="150" align="center">
      <template #default="props">
        <el-link @click="showOrder(props.$index)">查看</el-link>
        <el-link @click="clickCloseExgPos(props.$index)">平仓</el-link>
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