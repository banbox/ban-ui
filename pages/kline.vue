<template>
  <KlineChart :has-right="true">
    <div class="kline-slide" v-show="klocal.showRight">
      <TopChange/>
    </div>
  </KlineChart>
</template>

<script setup lang="ts">
import {useKlineLocal} from "~/stores/klineLocal";
import {makePeriod, useSymbols} from "~/composables/kline/coms";
import {useKlineStore} from "~/stores/kline";
import {MyDatafeed} from "~/composables/kline/datafeeds";
import {setTimezone} from "~/composables/dateutil";
const {exg, symbol, period, ind} = useRoute().query

const klocal = useKlineLocal()
const store = useKlineStore()
const {loadSymbols} = useSymbols()
const queryLoaded = ref(false)


function loadQueryInds(){
  if(queryLoaded.value)return
  queryLoaded.value = true
  let ticker = klocal.symbol.ticker;
  if(typeof symbol === 'string' && symbol){
    ticker = symbol
  }
  klocal.setSymbolTicker(ticker, exg as string|null, false)
  if(typeof period === 'string' && period){
    klocal.setPeriod(makePeriod(period))
  }
  if(typeof ind === 'string' && ind){
    const knowns = store.all_inds.reduce((acc: Record<string, boolean>, obj) => {acc[obj.name] = obj.is_main; return acc}, {})
    const added = klocal.save_inds.map(v => v.name)
    ind.split('+').forEach(name => {
      if(added.includes(name))return
      if(name in knowns){
        const pane_id = knowns[name] ? 'candle_pane': `pane_${name}`
        klocal.save_inds.push({name, pane_id})
      }
      else{
        klocal.save_inds.push({name, pane_id: ''})
        console.log('add unknown ind:', name)
      }
    })
  }
}

onMounted(() => {
  setTimezone()
  loadSymbols()
})

watch(() => store.pairs_loading, (loading) => {
  if(loading)return
  loadQueryInds()
})

</script>

<style lang="scss">
.kline-slide{
  .opinion-box{
    flex-grow: 1;
  }
}
</style>