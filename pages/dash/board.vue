<script setup lang="ts">
import {definePageMeta, getApi, getDateStr, setTimezone, toUTCStamp} from "#imports";
import {useDashStore} from "~/stores/dash";
import {useDashLocal} from "~/stores/dashLocal";
import {useCurApi} from "~/composables/dash/api";
import {type BotInfo} from "~/composables/dash/types";
import {getUTCStamp} from "~/composables/dateutil";
import {useLocalePath} from "#i18n";
import {reactive, ref} from "vue";

definePageMeta({
  layout: 'dash',
})

const local = useDashLocal()
const store = useDashStore()
const {getApi, postApi} = useCurApi()

const data = reactive<BotInfo>({
  cpu_pct: 0,
  ram_pct: 0,
  last_process: 0,
  allow_trade_at: 0,
  done_profit_pct_mean: 0,
  done_profit_mean: 0,
  done_profit_pct_sum: 0,
  done_profit_sum: 0,
  all_profit_pct_mean: 0,
  all_profit_mean: 0,
  all_profit_pct_sum: 0,
  all_profit_sum: 0,
  order_num: 0,
  done_order_num: 0,
  first_od_ts: 0,
  last_od_ts: 0,
  avg_duration: '',
  best_pair: '',
  best_profit_pct: 0,
  win_num: 0,
  loss_num: 0,
  profit_factor: 0,
  win_rate: 0,
  expectancy: 0,
  expectancy_ratio: 0,
  max_drawdown_pct: 0,
  max_drawdown_val: 0,
  total_cost: 0,
  bot_start_ms: 0,

  balance_total: 0,
  balance_items: [],

  run_tfs: [],
  exchange: '',
  market: '',
  pairs: []
})

const delay_hours = ref(3)
const value_style = 'cursor: pointer;'
const localPath = useLocalePath()

async function loadData(){
  const item = local.bot
  if(!item.url)return
  // 系统信息：CPU内存，上次处理时间
  let rsp = await getApi('/bot_info')
  Object.assign(data, rsp)
  // 整体详细概况
  rsp = await getApi('/statistics')
  Object.assign(data, rsp)
  // 显示余额情况
  rsp = await getApi('/balance')
  data.balance_total = rsp.total ?? 0
  const items = rsp.items ?? []
  data.balance_items.splice(0, data.balance_items.length, ...items)
}

const show_allow_enter = computed(() => {
  const cur_ms = getUTCStamp()
  if(data.allow_trade_at <= cur_ms){
    return '允许开单'
  }
  const date_str = getDateStr(data.allow_trade_at, 'MM-DD HH:mm')
  return `${date_str}前禁止开单`
})

async function saveAllowEntry(){
  const secs = delay_hours.value * 3600;
  const rsp = await postApi('/delay_entry',{secs})
  if(rsp.code == 200 && rsp.allow_trade_at){
    data.allow_trade_at = rsp.allow_trade_at
    ElMessage.success({message: '设置成功'})
    return
  }
  console.error(rsp)
  ElMessage.error({message: `错误: ${rsp.msg}`})
}

const open_num = computed(() => {
  return data.order_num - data.done_order_num
})

onMounted(() => {
  loadData()
})

</script>

<template>
  <el-row>
    <el-col :span="3">
      <el-statistic title="监听币种" :value="data.pairs.length" :value-style="value_style"
                    @click="navigateTo(localPath('/dash/pair_job'))"/>
    </el-col>
    <el-col :span="4">
      <el-statistic title="打开/平仓数量" :value="open_num">
        <template #suffix>/ {{ data.done_order_num }}</template>
      </el-statistic>
    </el-col>
    <el-col :span="5">
      <el-statistic title="盈利/亏损/胜率" :value="data.loss_num">
        <template #prefix>{{ data.win_num }} /</template>
        <template #suffix>/ {{ (data.win_rate * 100).toFixed(1) }}%</template>
      </el-statistic>
    </el-col>
    <el-col :span="4">
      <el-statistic title="盈利因子" :value="data.profit_factor"/>
    </el-col>
    <el-col :span="4">
      <el-statistic title="期望盈利/利润" :value="data.expectancy">
        <template #suffix>/ {{data.expectancy_ratio.toFixed(3)}}</template>
      </el-statistic>
    </el-col>
  </el-row>
  <el-form style="margin-top: 30px">
    <el-form-item label="开单状态">
      <span>{{show_allow_enter}}</span>
      <el-input class="allow-entry" v-model="delay_hours" type="number" :min="0" :max="9999" :step="0.1" style="width: 270px"
          title="设为0表示立刻允许">
        <template #prepend>禁止开单(小时)</template>
        <template #append><el-button @click="saveAllowEntry">保存</el-button></template>
      </el-input>
    </el-form-item>
    <el-form-item label="系统信息">
      <span>CPU： {{data.cpu_pct.toFixed(1)}}%</span>
      <span style="margin-left: 30px">内存： {{data.ram_pct.toFixed(1)}}%</span>
    </el-form-item>
  </el-form>
  <el-descriptions border :column="2">
    <el-descriptions-item label="市场" align="center">{{data.exchange}}.{{data.market}}</el-descriptions-item>
    <el-descriptions-item label="时间周期" align="center">{{data.run_tfs.join(', ')}}</el-descriptions-item>
    <el-descriptions-item label="启动时间" align="center">{{ getDateStr(data.bot_start_ms) }}</el-descriptions-item>
    <el-descriptions-item label="最近活跃时间" align="center">{{getDateStr(data.last_process)}}</el-descriptions-item>
  </el-descriptions>
  <el-descriptions border title="" :column="4">
    <el-descriptions-item label="第一笔" align="center">{{ getDateStr(data.first_od_ts) }}</el-descriptions-item>
    <el-descriptions-item label="最新一笔" align="center">{{ getDateStr(data.last_od_ts) }}</el-descriptions-item>
    <el-descriptions-item label="平均持仓" align="center">{{fmtDuration(data.avg_duration)}}</el-descriptions-item>
    <el-descriptions-item label="交易量" align="center">{{data.total_cost?.toFixed(5)}}</el-descriptions-item>

    <el-descriptions-item label="最佳交易" align="center">{{data.best_pair}}</el-descriptions-item>
    <el-descriptions-item label="最佳利润" align="center">{{ (data.best_profit_pct * 100).toFixed(1) }}%</el-descriptions-item>
    <el-descriptions-item label="最大回撤" align="center">{{ (data.max_drawdown_pct * 100).toFixed(1) }}%</el-descriptions-item>
    <el-descriptions-item label="最大回撤金额" align="center">{{ data.max_drawdown_val.toFixed(5) }}</el-descriptions-item>
  </el-descriptions>
  <el-descriptions border title="全部订单" :column="4">
    <el-descriptions-item label="平均收益率" align="center">{{ data.all_profit_pct_mean.toFixed(1) }}%</el-descriptions-item>
    <el-descriptions-item label="平均收益" align="center">{{ data.all_profit_mean.toFixed(5) }}</el-descriptions-item>
    <el-descriptions-item label="总收益率" align="center">{{ data.all_profit_pct_sum.toFixed(1) }}%</el-descriptions-item>
    <el-descriptions-item label="总收益" align="center">{{ data.all_profit_sum.toFixed(5) }}</el-descriptions-item>
  </el-descriptions>
  <el-descriptions border title="已完成订单" :column="4">
    <el-descriptions-item label="平均收益率" align="center">{{ data.done_profit_pct_mean.toFixed(1) }}%</el-descriptions-item>
    <el-descriptions-item label="平均收益" align="center">{{ data.done_profit_mean.toFixed(5) }}</el-descriptions-item>
    <el-descriptions-item label="总收益率" align="center">{{ data.done_profit_pct_sum.toFixed(1) }}%</el-descriptions-item>
    <el-descriptions-item label="总收益" align="center">{{ data.done_profit_sum.toFixed(5) }}</el-descriptions-item>
  </el-descriptions>
  <div class="balance">
    <h3>钱包余额</h3>
    <div class="blnc-list">
      <div class="item" v-if="data.balance_items.length > 1">
        <span class="label">总计：</span>
        <span>{{data.balance_total.toFixed(4)}}</span>
      </div>
      <div class="item" v-for="(item, index) in data.balance_items" :key="index">
        <span class="label">{{item.symbol}}</span>
        <span class="ok" title="可用">{{item.free.toFixed(6)}}</span>
        <span class="used" title="已用" v-if="item.used > 0">/ {{item.used.toFixed(6)}}</span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.allow-entry{
  margin-left: 30px;
}
.balance h3{
  line-height: 3;
}
.el-descriptions{
  padding-bottom: 20px;
}
.blnc-list{
  display: flex;
  flex-direction: row;
  font-size: 14px;
  .item{
    border: 1px solid var(--el-color-primary);
    border-radius: 5px;
    margin-right: 20px;
    span{
      display: inline-block;
      padding: 5px 10px;
    }
    .label{
      color: #ffffff;
      background-color: var(--el-color-primary);
    }
    .ok{
      color: var(--el-color-primary);
    }
    .used{
      color: var(--el-color-info);
    }
  }
}
</style>