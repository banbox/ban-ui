<script setup lang="ts">
import type {BotTask, TaskSymbol} from "~/composables/types";
import type {BanOrder, TradeInfo} from "~/composables/types";
import type {Chart, OverlayCreate} from "klinecharts";
import {fmtDuration, tf_to_secs} from "~/composables/dateutil";
import {useKlineLocal} from "~/stores/klineLocal";
import {useKlineStore} from "~/stores/kline";
import {Delete, Refresh} from "@element-plus/icons-vue"
import {useSymbols} from "~/composables/kline/coms";
useHead({
  script: [
    {src: `/js/papaparse.min.js`, async: true},
  ],
});

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
const task_symbols = reactive<TaskSymbol[]>([])
const inputFile = ref<HTMLInputElement>()
const trade_gp = 'ban_trades';
const loadingTask = ref(false);
const showSymbols = ref(false);
const showItemMenu = ref(false);
const file_exchange = ref('');
let loadingOrders = false;
const menuPos = reactive({
  top: '0px', left: '0px'
})
const klocal = useKlineLocal()
const main = useKlineStore()
const {loadSymbols} = useSymbols()
const show_num = 1000

async function loadData(){
  const rsp = await getApi('/dev/task_list')
  task_list.splice(0, task_list.length, ...(rsp.data ?? []))
}

const cur_tasks = computed(() => {
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
  loadSymbols()
})

function clickMode(mode: string){
  if (mode == 'file'){
    inputFile.value?.click()
    return
  }
  if(allow_modes.includes(mode)){
    allow_modes.splice(allow_modes.indexOf(mode), 1)
  }
  else {
    allow_modes.push(mode)
  }
}

function onSelFile(event: any){
  const file = event.target.files[0];
  const exg_name = file.name.split('.')[0];
  if (!main.all_exgs.has(exg_name)){
    ElMessage.error({message: 'invalid exchange, csv name must be [exchange].[market].csv'})
    console.error('valid exchanges:', toRaw(main.all_exgs))
    return;
  }
  file_exchange.value = exg_name;
  window.Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
    complete: (res: any) => {
      trade_list.splice(0, trade_list.length)
      let group = {} as { [symbol: string]: TaskSymbol }
      res.data.forEach((r: Record<string, string>) => {
        if (!r['entAt'])return
        const entMS = new Date(r['entAt'] + 'Z').getTime()
        const exitMS = new Date(r['exitAt'] + 'Z').getTime()
        const entPrice = parseFloat(r['entPrice']);
        const entAmount = parseFloat(r['entAmount']);
        const exitAmount = parseFloat(r['exitAmount']);
        const profit = parseFloat(r['profit']);
        const exitPrice = parseFloat(r['exitPrice']);
        const od = {
          id: 0,
          task_id: -1,
          symbol: r['symbol'],
          sid: parseInt(r['sid']),
          timeframe: r['timeframe'],
          short: r['direction'] == 'short',
          status: 4,
          enter_tag: r['entTag'],
          init_price: entPrice,
          quote_cost: parseFloat(r['entCost']),
          exit_tag: r['exitTag'],
          leverage: parseFloat(r['leverage']),
          enter_at: entMS,
          exit_at: exitMS,
          strategy: '',
          stg_ver: 0,
          profit_rate: parseFloat(r['profitRate']),
          profit: profit,
          enter_cost: parseFloat(r['entCost']),
          duration: 0,
          enter_id: 0,
          enter_task_id: 0,
          enter_inout_id: 0,
          enter_order_type: '',
          enter_order_id: '',
          enter_side: 'buy',
          enter_create_at: entMS,
          enter_price: entPrice,
          enter_average: entPrice,
          enter_amount: entAmount,
          enter_filled:  entAmount,
          enter_status: 2,
          enter_fee: parseFloat(r['entFee']),
          enter_fee_type: '',
          enter_update_at: entMS,
          info: '',
          exit_side: 'sell',
          exit_create_at: exitMS,
          exit_price: exitPrice,
          exit_average: exitPrice,
          exit_amount: exitAmount,
          exit_filled: exitAmount,
          exit_status: 2,
          exit_fee: parseFloat(r['exitFee']),
          exit_update_at: exitMS,
        } as BanOrder
        if (od.short){
          od.enter_side = 'sell'
          od.exit_side = 'buy'
        }
        trade_list.push(od)
        const symbol = r['symbol']
        if (!group[symbol]){
          group[symbol] = {
            symbol: symbol,
            timeframe: r['timeframe'],
            start_ms: entMS,
            stop_ms: exitMS,
            order_num: 1,
            tot_profit: profit,
          }
        }else{
          const old = group[symbol];
          old.start_ms = Math.min(old.start_ms, entMS)
          old.stop_ms = Math.max(old.stop_ms, exitMS)
          old.order_num += 1
          old.tot_profit += profit;
        }
      })
      task_symbols.splice(0, task_symbols.length);
      for (let k in group) {
        task_symbols.push(group[k])
      }
      console.log('load trades from csv done, symbols:', task_symbols.length, ', trades:', trade_list.length)
      showSymbols.value = true;
    }
  });
}

function clickSymbol(idx: number){
  // 点击品种，修改顶部菜单栏
  main.chart?.removeOverlay({groupId: trade_gp})
  const item = task_symbols[idx];
  const cur_pair = item.symbol
  klocal.setSymbolTicker(cur_pair)
  klocal.dt_start = StampToYMD(item.start_ms);
  klocal.dt_stop = StampToYMD(item.stop_ms);
  klocal.setTimeframe(item.timeframe)
  main.stop_ms += item.stop_ms
  main.start_ms = item.start_ms
  main.fireOhlcv += 1
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
  const symbol = klocal.symbol.ticker;
  const show_trades = trade_list.filter(td => td.symbol == symbol && start_ms <= td.enter_at && td.exit_at <= stop_ms);
  if(!show_trades.length)return;
  chartObj.removeOverlay({groupId: trade_gp})
  show_trades.forEach(td => {
    let color = '#1677FF';
    let exit_color = '#01C5C4';
    if(td.short){
      color = '#FF9600';
      exit_color = '#935EBD';
    }
    const in_action = `open ${td.short ? "short" : "long"}`
    const out_action = `close ${td.short ? "short" : "long"}`
    const in_text = `${in_action} ${td.enter_tag}
${td.strategy} lev: ${td.leverage}
Time: ${getDateStr(td.enter_create_at)}
Price: ${td.enter_average.toFixed(5)}
Amount: ${td.enter_amount.toFixed(6)}
Cost: ${td.enter_cost.toFixed(2)}`
    const out_text = `${out_action} ${td.exit_tag}
${td.strategy} lev: ${td.leverage}
Time: ${getDateStr(td.exit_create_at ?? 0)}
Price: ${td.exit_average?.toFixed(5)}
Amount: ${td.exit_amount?.toFixed(6)}
Cost: ${(td.profit_rate * 100).toFixed(1)}% ${td.profit.toFixed(5)}
Dura: ${fmtDuration(td.duration)}`
    chartObj.createOverlay({
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
    } as OverlayCreate)
  })
}

/**
 * 设置K线图的时间范围并显示。
 * 如果当前币种有订单，则显示到最新订单。否则显示到任务结束时间。
 */
function loadTaskKline(){
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
  const task = cur_tasks.value[task_idx];
  Object.assign(cur_task, task)
  // 删除旧的订单覆盖物
  main.chart?.removeOverlay({groupId: trade_gp})
  // 切换到第一个币种
  main.setCurSymbols(task.pairs)
  const cur_pair = task.pairs[0]
  klocal.setSymbolTicker(cur_pair)
  trade_list.splice(0, trade_list.length)
  // 先加载数据，避免获取订单时间太长
  loadTaskKline()
  // 加载任务的所有订单
  const rsp = await getApi('/dev/orders', {task_id: task.task_id})
  const res_ods = (rsp.data || []) as BanOrder[]
  const valid_ods = res_ods.filter(td => td.enter_at && (td.enter_price || td.init_price) && td.enter_filled
      && td.exit_at && td.exit_price)
  trade_list.splice(0, trade_list.length, ...valid_ods)
  // K线显示到此币种订单的最新时间
  loadTaskKline()
}

function itemRightClick(e: PointerEvent, index: number){
  Object.assign(cur_task, cur_tasks.value[index])
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
  loadTaskKline()
})


</script>

<template>
  <div class="list-wrap">
    <div class="head-box">
      <div class="head-tags">
        <input type="file" ref="inputFile" @change="onSelFile" style="display: none"/>
        <el-tag @click="clickMode('non_live')"
          :effect="allow_modes.includes('non_live') ? 'dark':'light'">回测</el-tag>
        <el-tag @click="clickMode('live')"
          :effect="allow_modes.includes('live') ? 'dark':'light'">实时</el-tag>
        <el-tag @click="clickMode('file')"
                :effect="allow_modes.includes('file') ? 'dark':'light'">加载</el-tag>
      </div>
      <div class="head-right">
        <el-icon size="20px" @click="loadData"><Refresh/></el-icon>
      </div>
    </div>
    <div class="task-list" v-if="!showSymbols">
      <div class="item" v-for="(item, index) in cur_tasks" :key="index"
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
    <div class="symbol-list">
      <div class="item" v-for="(item, index) in task_symbols" :key="index" @click="clickSymbol(index)">
        <div class="top">
          <span class="pair">{{item.symbol}}</span>
        </div>
        <div class="info">
          <span class="num">{{item.order_num}}笔</span>
          <span class="profit">{{(item.tot_profit).toFixed(1)}}</span>
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
.task-list, .symbol-list{
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