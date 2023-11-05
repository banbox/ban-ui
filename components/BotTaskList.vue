<script setup lang="ts">
import type {BotTask} from "~/composables/types";
import type {BanOrder, TradeInfo} from "~/composables/types";
import {ActionType, Chart, type OverlayCreate} from "klinecharts";
import {fmtDuration, tf_to_secs} from "~/composables/dateutil";
import {useKlineLocal} from "~/stores/klineLocal";
import {useKlineStore} from "~/stores/kline";
import {Delete, Refresh} from "@element-plus/icons-vue"

const empty_task = {
  task_id: 0,
  live: false,
  start_ms: 0,
  stop_ms: 0,
  pairs: [],
  strategy: [],
  tfs: [],
  order_num: 0,
  profit_rate: 0
}

const task_list = reactive<BotTask[]>([])
const allow_modes = reactive<string[]>(['live', 'non_live'])
const cur_task = reactive<BotTask>({...empty_task})
const trade_list = reactive<BanOrder[]>([])
const trade_gp = 'ban_trades';
const loadingTask = ref(false);
const showItemMenu = ref(false);
let loadingOrders = false;
const menuPos = reactive({
  top: '0px', left: '0px'
})
const klocal = useKlineLocal()
const main = useKlineStore()
const show_num = 1000

async function loadData(){
  const rsp = await getApi('/dev/task_list')
  task_list.splice(0, task_list.length, ...(rsp.data ?? []))
}

const cur_list = computed(() => {
  if(!allow_modes.length){
    return [] as BotTask[]
  }
  if(allow_modes.length == 2){
    return task_list
  }
  const live_req = allow_modes.includes('live')
  return task_list.filter(t => t.live == live_req)
})

onMounted(() => {
  loadData()
})

function clickMode(mode: string){
  if(allow_modes.includes(mode)){
    allow_modes.splice(allow_modes.indexOf(mode), 1)
  }
  else {
    allow_modes.push(mode)
  }
}

/**
 * 为当前可见区域显示订单
 * 订阅chart的onVisibleRangeChange事件，调用此方法
 */
function loadVisiableTrades(){
  if(!main.chart)return
  const chartObj = main.chart as Chart;
  const dataList = chartObj.getDataList();
  if(!dataList.length)return;
  const start_ms = dataList[0].timestamp;
  const stop_ms = dataList[dataList.length - 1].timestamp;
  const show_trades = trade_list.filter(td => start_ms <= td.enter_at && td.exit_at <= stop_ms);
  if(!show_trades.length)return;
  chartObj.removeOverlay({groupId: trade_gp})
  const cur_ols = show_trades.map(td => {
    let color = '#1677FF';
    let exit_color = '#01C5C4';
    if(td.short){
      color = '#FF9600';
      exit_color = '#935EBD';
    }
    const in_action = `开${td.short ? "空" : "多"}`
    const out_action = `平${td.short ? "空" : "多"}`
    const in_text = `${in_action} ${td.enter_tag} ${td.leverage}倍
${td.strategy}
下单：${getDateStr(td.enter_at)}
入场：${getDateStr(td.enter_create_at)}
价格：${td.enter_average.toFixed(5)}
数量：${td.enter_amount.toFixed(6)}
花费：${td.enter_cost.toFixed(2)}`
    const out_text = `${out_action} ${td.exit_tag} ${td.leverage}倍
${td.strategy}
下单：${getDateStr(td.exit_at)}
出场：${getDateStr(td.exit_create_at ?? 0)}
价格：${td.exit_average?.toFixed(5)}
数量：${td.exit_amount?.toFixed(6)}
利润：${(td.profit_rate * 100).toFixed(1)}% ${td.profit.toFixed(5)}
持有：${fmtDuration(td.duration)}`
    return {
      name: 'trade',
      groupId: trade_gp,
      points: [
        {timestamp: td.enter_create_at, value: td.enter_average ?? td.init_price},
        {timestamp: td.exit_create_at, value: td.exit_average}
      ],
      extendData: {
        line_color: color,
        in_color: color,
        in_text: in_text,
        out_color: exit_color,
        out_text: out_text
      } as TradeInfo
    } as OverlayCreate
  })
  cur_ols.forEach(ol => {
    chartObj.createOverlay(ol)
  })
}

/**
 * 设置K线图的时间范围并显示。
 * 如果当前币种有订单，则显示到最新订单。否则显示到任务结束时间。
 */
function loadDataRange(){
  if(cur_task.task_id == 0)return
  let timeframe = cur_task.tfs[0]
  const cur_pair = klocal.symbol.ticker
  const last = trade_list.findLast(od => od.symbol == cur_pair)
  if(last){
    timeframe = last.timeframe
    main.stop_ms = last.exit_at
  }
  else{
    main.stop_ms = cur_task.stop_ms
  }
  klocal.setTimeframe(timeframe)
  const tf_msecs = tf_to_secs(timeframe) * 1000;
  main.stop_ms += tf_msecs * 10
  main.start_ms = main.stop_ms - tf_msecs * show_num
  main.fireOhlcv += 1
}

async function clickTask(task_idx: number){
  if(showItemMenu.value){
    showItemMenu.value = false;
    return
  }
  if(loadingTask.value)return
  loadingTask.value = true;
  const task = cur_list.value[task_idx];
  Object.assign(cur_task, task)
  // 删除旧的订单覆盖物
  main.chart?.removeOverlay({groupId: trade_gp})
  // 切换到第一个币种
  main.setCurSymbols(task.pairs)
  const cur_pair = task.pairs[0]
  klocal.setSymbolTicker(cur_pair)
  trade_list.splice(0, trade_list.length)
  // 先加载数据，避免获取订单时间太长
  loadDataRange()
  // 加载任务的所有订单
  const rsp = await getApi('/dev/orders', {task_id: task.task_id})
  const res_ods = (rsp.data || []) as BanOrder[]
  const valid_ods = res_ods.filter(td => td.enter_at && (td.enter_price || td.init_price) && td.enter_filled
      && td.exit_at && td.exit_price)
  trade_list.splice(0, trade_list.length, ...valid_ods)
  // K线显示到此币种订单的最新时间
  loadDataRange()
}

function itemRightClick(e: PointerEvent, index: number){
  Object.assign(cur_task, cur_list.value[index])
  menuPos.left = `${e.clientX}px`
  menuPos.top = `${e.clientY}px`
  showItemMenu.value = true
}

async function delTask() {
  if (cur_task.task_id == 0) {
    ElMessage.error({message: '请右击任务删除'})
    return
  }
  try {
    await ElMessageBox.confirm('确定要删除此任务全部数据吗？不可撤销！', '警告')
  } catch (e) {
    return
  }
  const rsp = await postApi('/dev/del_task', {task_id: task.task_id})
  if (rsp.code == 200) {
    Object.assign(cur_task, empty_task)
    const task_num = rsp.total > 0 ? 1:0;
    ElMessage.success({message: `已删除${task_num}个任务共${rsp.total}条记录`})
    await loadData()
  } else {
    console.error('del task fail:', rsp)
    ElMessage.error({message: rsp.msg ?? '删除失败'})
  }
}

watch(() => main.klineLoaded, () => {
  loadingTask.value = false
  if(loadingOrders)return
  loadingOrders = true
  loadVisiableTrades()
  loadingOrders = false
}, {immediate: true})


watch(klocal.symbol, () => {
  loadDataRange()
})


</script>

<template>
  <div class="list-wrap">
    <div class="head-box">
      <div class="head-tags">
        <el-tag @click="clickMode('non_live')"
          :effect="allow_modes.includes('non_live') ? 'dark':'light'">回测</el-tag>
        <el-tag @click="clickMode('live')"
          :effect="allow_modes.includes('live') ? 'dark':'light'">实时</el-tag>
      </div>
      <div class="head-right">
        <el-icon size="20px" @click="loadData"><Refresh/></el-icon>
      </div>
    </div>
    <div class="task-list">
      <div class="item" v-for="(item, index) in cur_list" :key="index"
          :class="[item.live ? 'live':'', {active: item.task_id == cur_task.task_id}]" @click="clickTask(index)"
           @contextmenu.prevent="itemRightClick($event, index)">
        <div class="top">
          <span class="stg" v-if="item.strategy.length == 0">无策略</span>
          <span class="stg" v-else-if="item.strategy.length == 1">{{item.strategy[0]}}</span>
          <span class="stg" v-else>{{item.strategy[0] + '等' + item.strategy.length + '个'}}</span>
          <span>{{item.tfs.join(',')}}</span>
          <span class="pair" v-if="item.pairs.length == 0">无策略</span>
          <span class="pair" v-else-if="item.pairs.length == 1">{{item.pairs[0]}}</span>
          <span class="pair" v-else>{{item.pairs[0] + '等' + item.pairs.length + '个'}}</span>
        </div>
        <div class="info">
          <span class="date">{{getDateStr(item.start_ms, 'YYYYMMDD')}}-{{getDateStr(item.stop_ms, 'YYYYMMDD')}}</span>
          <span class="num">{{item.order_num}}笔</span>
          <span class="profit">{{(item.profit_rate * 100).toFixed(1)}}%</span>
        </div>
      </div>
      <div class="item-menu" tabindex="0" v-if="showItemMenu" :style="menuPos" @blur="showItemMenu = false">
        <div class="action" @click="delTask">
          <el-icon><Delete/></el-icon>
          <span>删除</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.list-wrap{
  height: 100%;
}
.head-box{
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.head-right{
  display: flex;
  height: 100%;
  flex-direction: row;
  align-items: center;
  padding: 0 7px;
  .el-icon{
    cursor: pointer;
    color: var(--el-color-primary)
  }
}
.head-tags{
  padding: 3px 7px;
  .el-tag{
    margin-right: 7px;
    cursor: pointer;
  }
}
.task-list{
  border-left: 1px solid var(--el-color-info-light-7);
  border-top: 1px solid var(--el-color-info-light-7);
  overflow-y: auto;
  height: 100%;
  .item{
    cursor: pointer;
    padding: 5px 10px;
    border-bottom: 1px solid var(--el-color-info-light-7);
    .top{
      font-size: 14px;
      line-height: 2;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
    }
    .info{
      font-size: 13px;
      color: var(--el-color-info);
      display: flex;
      flex-direction: row;
      justify-content: space-between;
    }
    &.live{
      background-color: var(--el-color-success-light-9);
    }
    &.active{
      color: var(--el-color-primary);
    }
  }
  .item-menu{
    position: absolute;
    z-index: 100;
    box-shadow: 0px 4px 24px 0px rgb(67 84 106 / 18%);
    .action{
      cursor: pointer;
      background-color: #ffffff;
      width: 130px;
      height: 34px;
      display: flex;
      flex-direction: row;
      align-items: center;
      padding: 0 10px;
      border: 1px solid var(--el-border-color-light);
      .el-icon{
        margin-right: 10px;
      }
    }
  }
}
</style>