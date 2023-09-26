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
store.menu_id = '4'

const tab_name = ref('open') //open/his
const od_list = reactive<BanOrder[]>([])
const open_num = ref(-1)
const close_num = ref(-1)
const loading = ref(false)
const page_size = ref(15)
const ban_od = ref<BanOrder|null>(null)
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

const quoteSymbol = computed(() => {
  const arr = openOd.pair.split('/')
  if(arr.length !== 2)return ''
  let quote = arr[1];
  quote = quote.split('.')[0]
  return quote.split(':')[0]
})

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

async function closeOrder(order_id: string) {
  if(open_num.value == 0){
    ElMessage.error({message: '没有打开的订单'})
    return
  }
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
  else if(tab_name.value == 'open'){
    od_list.push((rsp as unknown) as BanOrder)
    ElMessage.success({message: '开单成功'})
    showOpenOrder.value = false
    open_num.value += 1
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
      <el-menu-item index="open">打开的订单<span v-if="open_num >= 0">({{open_num}})</span></el-menu-item>
      <el-menu-item index="his">已平仓<span v-if="close_num >= 0">({{close_num}})</span></el-menu-item>
    </el-menu>
    <div class="head-btns" v-if="tab_name == 'open'">
      <el-button type="primary" @click="clickShowOpen">开单</el-button>
      <el-button type="danger" @click="closeOrder('all')">全部平仓</el-button>
    </div>
  </div>
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
    <el-table-column prop="profit_rate" label="收益率">
      <template #default="props">{{(props.row.profit_rate * 100).toFixed(1)}}%</template>
    </el-table-column>
    <el-table-column label="收益">
      <template #default="props">{{(props.row.profit).toFixed(5)}}</template>
    </el-table-column>
    <el-table-column label="操作" class-name="actions" width="150" align="center">
      <template #default="props">
        <el-link @click="showOrder(props.$index)">查看</el-link>
        <el-link @click="closeOrder(props.row.id.toString())">平仓</el-link>
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