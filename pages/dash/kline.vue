<script setup lang="ts">

import {definePageMeta, fmtDuration, tf_to_secs, toUTCStamp} from "#imports";
import {BanOrder} from "~/composables/types";
import {useCurApi} from "~/composables/dash/api";
import {useDashStore} from "~/stores/dash";
import {useKlineLocal} from "~/stores/klineLocal";
import {useKlineStore} from "~/stores/kline";
import {TradeInfo} from "~/composables/types";
import {Chart, OverlayCreate} from "klinecharts";

definePageMeta({
  layout: 'dash',
})

const klocal = useKlineLocal()
const main = useKlineStore()
const show_num = 1000
const {getApi, postApi} = useCurApi()
const store = useDashStore()
store.menu_id = 'kline'

const trade_gp = 'ban_trades';
const trade_list = reactive<BanOrder[]>([])
const symbol = ref('')
const {pair} = useRoute().query

onMounted(() => {
  if(pair) {
    klocal.setSymbolTicker(pair.toString())
  }
})


async function loadVisiableTrades() {
  if (!main.chart) return
  const chartObj = main.chart as Chart;
  // 删除旧的订单覆盖物
  chartObj.removeOverlay({groupId: trade_gp})
  const cur_pair = klocal.symbol.ticker
  if (cur_pair !== symbol.value) {
    const rsp = await getApi('/orders', {symbol: cur_pair})
    if (rsp.code == 200) {
      const new_items = rsp.data ?? []
      trade_list.splice(0, trade_list.length, ...new_items)
    } else {
      ElMessage.error({message: rsp.msg ?? '加载订单失败'})
      return
    }
    symbol.value = cur_pair
  }
  let timeframe = klocal.period.timeframe
  const dataList = chartObj.getDataList();
  if (!dataList.length) return;
  const start_ms = dataList[0].timestamp;
  const stop_ms = dataList[dataList.length - 1].timestamp;
  const show_trades = trade_list.filter(td => start_ms <= td.enter_at && td.exit_at <= stop_ms);
  if (!show_trades.length) return;
  chartObj.removeOverlay({groupId: trade_gp})
  const cur_ols = show_trades.map(td => {
    let color = '#1677FF';
    let exit_color = '#01C5C4';
    if (td.short) {
      color = '#FF9600';
      exit_color = '#935EBD';
    }
    const in_action = `开${td.short ? "空" : "多"}`
    const out_action = `平${td.short ? "空" : "多"}`
    const in_text = `${in_action} ${td.enter_tag} ${td.leverage}倍
${td.strategy}
下单：${getDateStr(td.enter_at)}
入场：${getDateStr(td.enter_create_at)}
价格：${td.enter_average?.toFixed(5)}
数量：${td.enter_amount.toFixed(6)}
花费：${td.enter_cost?.toFixed(2)}`
    let out_text = '';
    let points = [{timestamp: td.enter_create_at, value: td.enter_average ?? td.init_price}]
    if (td.exit_filled) {
      out_text = `${out_action} ${td.exit_tag} ${td.leverage}倍
${td.strategy}
下单：${getDateStr(td.exit_at)}
出场：${getDateStr(td.exit_create_at ?? 0)}
价格：${td.exit_average?.toFixed(5)}
数量：${td.exit_amount?.toFixed(6)}
利润：${(td.profit_rate * 100).toFixed(1)}% ${td.profit.toFixed(5)}
持有：${fmtDuration(td.duration)}`
      points.push({timestamp: td.exit_create_at ?? 0, value: td.exit_average ?? 0})
      // 已平仓，显示入场到出场的线
      return {
        name: 'trade',
        groupId: trade_gp,
        points: points,
        extendData: {
          line_color: color,
          in_color: color,
          in_text: in_text,
          out_color: exit_color,
          out_text: out_text
        } as TradeInfo
      } as OverlayCreate
    }
    else{
      // 尚未平仓，显示入场标签
      return {
        name: 'note',
        groupId: trade_gp,
        points: points,
        extendData: {
          line_color: color,
          in_color: color,
          in_text: in_text,
        } as TradeInfo
      } as OverlayCreate
    }
  })
  cur_ols.forEach(ol => {
    chartObj.createOverlay(ol)
  })
}


watch(() => main.klineLoaded, () => {
  loadVisiableTrades()
})

</script>

<template>
  <KlineChart/>
</template>

<style scoped lang="scss">
.kline-body{
  margin: -30px -25px;
  height: 100%;
}
</style>