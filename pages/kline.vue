<template>
  <div class="kline-body klinecharts-pro" :data-theme="main.theme">
    <i class="icon-close klinecharts-pro-load-icon"/>
    <LoginBox v-model="showLoginBox"/>
    <KlineSymbolModal v-model="showSymbolModal" :datafeed="datafeed"/>
    <KlineIndSearchModal v-model="showIndSearchModal" @change="setIndicator"/>
    <KlineSettingModal v-model="showSettingModal" :chart="chart"/>
    <KlineScreenshotModal v-model="showScreenShotModal" :url="screenShotUrl" @close="screenShotUrl = ''"/>
    <KlineIndCfgModal v-model="showIndCfgModal" :chart="chart" :indName="editIndName" :paneId="editPaneId"/>
    <KlineTimezoneModal v-model="showTimezoneModal"/>
    <KlineI18nModal v-model="showI18nModal"/>
    <div class="kline-main">
      <KlinePeriodBar :spread="showDrawingBar" v-model:showLogin="showLoginBox"
          @clickSymbol="showSymbolModal = true" @clickPeriod="clickPeriod($event)"
          @clickMenu="showDrawingBar = !showDrawingBar" @clickInd="showIndSearchModal = true"
          @clickSetting="showSettingModal = true" @clickShot="clickScreenShot"
          @clickTZ="showTimezoneModal = true" @clickLang="showI18nModal = true"
          @clickTheme="toggleTheme"/>
      <div class="klinecharts-pro-content">
        <KlineLoading v-if="loadingChart"/>
        <KlineDrawBar ref="drawBar" :chart="chart" v-if="showDrawingBar"/>
        <div ref="chartRef" class='klinecharts-pro-widget' :data-drawing-bar-visible="showDrawingBar"
           @keydown.delete="drawBar.clickRemove()"/>
      </div>
    </div>
    <div class="kline-slide" v-show="store.showRight">
      <TopChange/>
      <OpinionFlow/>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ActionType,
  Chart,
  DomPosition,
  Nullable,
  PaneOptions,
  Styles,
  Indicator,
  OverlayCreate,
  KLineData
} from 'klinecharts'
import kc from 'klinecharts'
import _ from "lodash"
import {MyDatafeed} from "~/composables/kline/datafeeds"
import {PaneInds, Period, SymbolInfo, Datafeed} from '~/components/kline/types'
import {computed, defineProps, onMounted, onUnmounted, reactive, ref, toRaw, watch} from "vue";
import {
  AllPeriods,
  periodMap,
  getDefStyles,
  getThemeStyles,
  adjustFromTo,
  makeFormatDate,
  GetNumberDotOffset,
  build_ohlcvs, tf_to_secs, BarArr
} from "~/composables/kline/coms";
import overlays from '~/composables/kline/overlays'
import figures from '~/composables/kline/figure'
import {useAuthState} from "~/composables/auth";
import {GetIndDefaults} from "~/components/kline/inds";
import {useMainStore} from "~/stores/main";
import {useKlineStore} from "~/stores/kline";
import {useI18n} from "vue-i18n";
import {useRoute} from "#app";
const {t} = useI18n()
const route = useRoute()

overlays.forEach(o => { kc.registerOverlay(o) })
figures.forEach(o => { kc.registerFigure(o) })

const authTimeframes = ['1m', '5m', '15m', '1h', '2h', '4h', '1d']

const main = useMainStore()
const store = useKlineStore()
const {authDoing, authStatus} = useAuthState()
const showSymbolModal = ref(false)
const showIndSearchModal = ref(false)
const showSettingModal = ref(false)
const showScreenShotModal = ref(false)
const showIndCfgModal = ref(false)
const loadingChart = ref(false)
const showDrawingBar = ref(true)
const showLoginBox = ref(false)
const showTimezoneModal = ref(false)
const showI18nModal = ref(false)
const chartRef = ref<HTMLElement>()
const chart = ref<Nullable<Chart>>(null)
const drawBar = ref<any>(null)
const screenShotUrl = ref('')
const editIndName = ref('')
const editPaneId = ref('')
const batch_num = ref(500)
const sigOvers = reactive<OverlayCreate[]>([])
let priceUnitDom: HTMLElement
let loading = false
let tf_msecs = 0

const watermark = ref('<img width="432" src="/watermark.png"/>')
const datafeed = new MyDatafeed()

const periods = reactive<Period[]>(AllPeriods)


function setIndicator(is_main: boolean, ind_name: string, is_add: boolean){
  if(!chart.value)return
  const paneId = is_main ? 'candle_pane' : 'pane_' + ind_name
  store.setInd(is_main, ind_name, is_add)
  if(is_add){
    createIndicator(chart.value, ind_name, true, {id: paneId})
  }
  else{
    chart.value?.removeIndicator(paneId, ind_name)
  }
}

function createIndicator (widget: Nullable<Chart>, indicatorName: string, isStack?: boolean, paneOptions?: PaneOptions): Nullable<string> {
  if (indicatorName === 'VOL') {
    paneOptions = { gap: { bottom: 2 }, ...paneOptions }
  }
  return widget?.createIndicator({
    name: indicatorName,
    calcParams: GetIndDefaults(indicatorName),
    // @ts-expect-error
    createTooltipDataSource: ({ indicator, defaultStyles }) => {
      const icon_ids = [indicator.visible ? 1: 0, 2, 3];
      const icons = icon_ids.map(i => defaultStyles.tooltip.icons[i])
      return { icons }
    }
  }, isStack, paneOptions) ?? null
}

function clickScreenShot(){
  let bgColor = main.theme === 'dark' ? '#151517' : '#ffffff'
  screenShotUrl.value = chart.value?.getConvertPictureUrl(true, 'jpeg', bgColor) ?? ''
  showScreenShotModal.value = true
}

function clickPeriod(item: Period){
  if(authStatus.value < 0 && authTimeframes.includes(item.timeframe)){
    showLoginBox.value = true
    return
  }
  store.setPeriod(item)
  chart.value?.setCustomApi({
    formatDate: makeFormatDate(store.period.timespan)
  })
}

function toggleTheme(){
  if(main.theme === 'light'){
    main.setTheme('dark')
  }
  else{
    main.setTheme('light')
  }
}

async function loadKlineData(from: number, to: number, isNewData?: boolean){
  loading = true
  const strategy = route.query.strategy?.toString()
  const kdata = await datafeed.getHistoryKLineData({
    symbol: store.symbol, period: store.period, from, to, strategy})
  if(isNewData){
    kdata.data.forEach(bar => {
      chart.value?.updateData(bar)
    })
  }
  else{
    const more = kdata.data.length > 0
    chart.value?.applyMoreData(kdata.data, more)
  }
  kdata.lays?.forEach(o => {
    const oid = drawBar.value?.addOverlay(o)
    if(o.groupId == 'klineSigs'){
      sigOvers.push({id: oid, name: o.name, extendData: o.extendData})
    }
  })
  loading = false
}


const documentResize = () => {
  chart.value?.resize()
}

onMounted(() => {
  window.addEventListener('resize', documentResize)
  chart.value = kc.init(chartRef.value!, {
    customApi: {
      formatDate: makeFormatDate(store.period.timespan)
    }
  })
  if(chart.value){
    initChart(chart.value)
  }
})

function initChart(chartObj: Chart){
  const watermarkContainer = chartObj.getDom('candle_pane', DomPosition.Main)
  if (watermarkContainer) {
    let elt = document.createElement('div')
    elt.className = 'klinecharts-pro-watermark'
    if (kc.utils.isString(watermark.value)) {
      const str = (watermark.value as string).replace(/(^\s*)|(\s*$)/g, '')
      elt.innerHTML = str
    } else {
      elt.appendChild(watermark.value as Node)
    }
    watermarkContainer.appendChild(elt)
  }
  const priceUnitContainer = chartObj.getDom('candle_pane', DomPosition.YAxis)
  priceUnitDom = document.createElement('span')
  priceUnitDom.className = 'klinecharts-pro-price-unit'
  priceUnitContainer?.appendChild(priceUnitDom)

  store.mainInds.split(',').forEach(ind => {
    createIndicator(chartObj, ind, true, {id: 'candle_pane'})
  })
  store.subInds.split(',').forEach(ind => {
    createIndicator(chartObj, ind, true, {id: 'pane_' + ind})
  })
  const styles = toRaw(store.chartStyle)
  _.merge(styles, getDefStyles(t))
  _.merge(styles, getThemeStyles(main.theme))
  chartObj.setStyles(styles as Styles)

  chartObj.setTimezone(main.timezone)

  chartObj.loadMore(timestamp => {
    const [to] = adjustFromTo(store.period, timestamp!, 1)
    const [from] = adjustFromTo(store.period, to, batch_num.value)
    loadKlineData(from, to)
  })

  chartObj.subscribeAction(ActionType.OnTooltipIconClick, data => {
    if (data.indicatorName) {
      switch (data.iconId) {
        case 'visible': {
          chartObj.overrideIndicator({ name: data.indicatorName, visible: true }, data.paneId)
          break
        }
        case 'invisible': {
          chartObj.overrideIndicator({ name: data.indicatorName, visible: false }, data.paneId)
          break
        }
        case 'setting': {
          editIndName.value = data.indicatorName
          editPaneId.value = data.paneId
          showIndCfgModal.value = true
          break
        }
        case 'close': {
          setIndicator(data.paneId, data.indicatorName, false)
        }
      }
    }
  })
}

onUnmounted(() => {
  window.removeEventListener('resize', documentResize)
  if(chartRef.value){
    kc.dispose(chartRef.value!)
  }
})

function loadSymbolPeriod(symbol_chg: boolean, period_chg: boolean){
  const s = store.symbol
  const p = store.period
  loading = true
  loadingChart.value = true
  const get = async () => {
    const curTime = new Date().getTime()
    const [from, to] = adjustFromTo(p, curTime, batch_num.value)
    const strategy = route.query.strategy?.toString()
    const kdata = await datafeed.getHistoryKLineData({
      symbol: s, period: p, from, to: curTime, strategy})
    const klines = kdata.data
    if(klines.length > 0){
      const pricePrec = GetNumberDotOffset(Math.min(klines[0].low, klines[klines.length - 1].low)) + 3
      chart.value?.setPriceVolumePrecision(pricePrec, 0)
    }
    sigOvers.splice(0, sigOvers.length)
    const delArgs: Partial<Pick<kc.Overlay, "id" | "groupId" | "name">> = {}
    if(!symbol_chg){
      delArgs.groupId = 'klineSigs'
    }
    chart.value?.removeOverlay(delArgs)
    chart.value?.applyNewData(klines, klines.length > 0)
    kdata.lays?.forEach(o => {
      const oid = drawBar.value?.addOverlay(o)
      if(o.groupId == 'klineSigs') {
        sigOvers.push({id: oid, name: o.name, extendData: o.extendData})
      }
    })
    tf_msecs = tf_to_secs(store.period.timeframe) * 1000
    datafeed.subscribe(s, p, result => {
      if(!chart.value)return
      const kline = chart.value.getDataList()
      const last = kline[kline.length - 1]
      const lastBar: BarArr | null = last && last.timestamp ? [
          last.timestamp, last.open, last.high, last.low, last.close, last.volume ?? 0
      ] : null
      const ohlcvArr = build_ohlcvs(result.bars, result.secs * 1000, tf_msecs, lastBar)
      ohlcvArr.forEach((row: any) => {
        chart.value?.updateData({
          timestamp: row[0],
          open: row[1],
          high: row[2],
          low: row[3],
          close: row[4],
          volume: row[5]
        })
      })
    })
    loading = false
    loadingChart.value = false
  }
  get()
}

watch(store.period, (new_period, prev_period) => {
  if(loading)return
  loadSymbolPeriod(false, true)
})

function updateSymbolPriceUnit(new_val: SymbolInfo){
  if(!priceUnitDom)return
  if (new_val.priceCurrency) {
    priceUnitDom.innerHTML = new_val.priceCurrency.toLocaleUpperCase()
    priceUnitDom.style.display = 'flex'
  } else {
    priceUnitDom.style.display = 'none'
  }
}

watch(store.symbol, (new_symbol, prev_symbol) => {
  updateSymbolPriceUnit(new_symbol)
  if(loading)return
  datafeed.unsubscribe(prev_symbol!, store.period)
  loadSymbolPeriod(true, false)
}, {immediate: true})

watch(() => main.theme, (new_val) => {
  // 加载新指标时，修改默认颜色
  if(new_val == 'light'){
    datafeed.longColor = 'green'
    datafeed.shortColor = 'red'
  }
  else{
    datafeed.longColor = 'green'
    datafeed.shortColor = 'rgb(255,135,8)'
  }
  // 修改已绘制的指标颜色
  sigOvers.forEach(olay => {
    olay.extendData.bgColor = olay.extendData.postion == 'top' ? datafeed.shortColor: datafeed.longColor;
    chart.value?.overrideOverlay(olay)
  })
  chart.value?.setStyles(getThemeStyles(new_val))
})

watch(() => main.timezone, (new_val) => {
  chart.value?.setTimezone(new_val)
})

watch(() => store.showRight, () => {
  setTimeout(() => {
    documentResize()
  }, 30)
})

</script>

<style lang="scss">
@import "~/assets/klinebase.scss";
@import '~/assets/klinefont.css';
body{
  margin: 0;
  min-height: 100vh;
}
#__nuxt{
  height: 100vh;
}
.#{$prefix-cls}{
  height: 100%;
}
.kline-body{
  height: 100%;
  width: 100%;
  .kline-main{
    flex-grow: 1;
  }
}
.kline-slide{
  width: 300px;
  display: flex;
  flex-direction: column;
  .opinion-box{
    flex-grow: 1;
  }
}

.#{$prefix-cls} {
  --klinecharts-pro-primary-color: #{$c-primary};
  --klinecharts-pro-hover-background-color: #{$c-hover-background-light};
  --klinecharts-pro-background-color: #{$c-background-light};
  --klinecharts-pro-popover-background-color: #{$c-popover-background-light};
  --klinecharts-pro-text-color: #{$c-text-light};
  --klinecharts-pro-text-second-color: #{$c-text-second-light};
  --klinecharts-pro-border-color: #{$c-border-light};
  --klinecharts-pro-selected-color: fade(#{ $c-primary }, 15%);
  &[data-theme="dark"] {
    --klinecharts-pro-hover-background-color: #{$c-hover-background-dark};
    --klinecharts-pro-background-color: #{$c-background-dark};
    --klinecharts-pro-popover-background-color: #{$c-popover-background-dark};
    --klinecharts-pro-text-color: #{$c-text-dark};
    --klinecharts-pro-text-second-color: #{$c-text-second-dark};
    --klinecharts-pro-border-color: #{$c-border-dark};
  }
  position: relative;
  display: flex;
  flex-direction: row;
  color: var(--klinecharts-pro-text-color);
  background-color: var(--klinecharts-pro-background-color);
  font-size: 14px;
  height: 100vh;
  width: 100%;
  &-watermark {
    position: absolute;
    left: 50%;
    top: 50%;
    z-index: 1;
    transform: translateX(-50%) translateY(-50%);
    .logo {
      width: 160px;
      height: 184px;
      fill: var(--klinecharts-pro-border-color);
    }
  }
  &-price-unit {
    display: none;
    position: absolute;
    left: 50%;
    top: 50%;
    z-index: 30;
    top: 4px;
    left: 50%;
    transform: translateX(-50%);
    border-radius: 4px;
    font-size: 10px;
    font-weight: bold;
    padding: 1px 4px;
    color: var(--klinecharts-pro-text-second-color);
    box-shadow: 0 3px 3px 0 rgba(50, 50, 50, .3);
    border: solid 1px var(--klinecharts-pro-border-color);
    background-color: var(--klinecharts-pro-background-color);
  }
  &-load-icon {
    position: absolute;
    left: 0;
    height: 0;
    z-index: -1;
    opacity: 0;
  }
  &-content {
    position: relative;
    display: flex;
    flex-direction: row;
    width: 100%;
    height: $widget-height;
  }
  &-widget {
    width: $widget-width;
    height: 100%;
    margin-left: 0;
    &[data-drawing-bar-visible="false"] {
      width: 100%;
    }
  }
}
</style>