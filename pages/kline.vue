<template>
  <el-container class="kline-body">
    <KLineCharPro ref="chart" :datafeed="datafeed" :watermark="watermark" :symbol="symbol" :periods="periods"/>
    <el-aside class="kline-slide">
      <TopChange @select="clickSymbol"/>
      <OpinionFlow/>
    </el-aside>
  </el-container>
</template>

<script setup lang="ts">
import KLineCharPro from "~/components/kline/chart_pro.vue"
import {MyDatafeed} from "~/composables/kline/datafeeds"
import {reactive, ref} from "vue"
import TopChange from "~/components/topChange.vue";
import OpinionFlow from "~/components/opinionFlow.vue";

const watermark = ref('<img width="504" src="/watermark.png"/>')
const datafeed = ref(new MyDatafeed())

const symbol = reactive(datafeed.value.getDefaultSymbol())
const periods = reactive(datafeed.value.getAllPeriods())

function clickSymbol(val: string){
  symbol.ticker = val
}
</script>

<style lang="scss">
@import "~/assets/klinebase.scss";
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
  .klinecharts-pro{
    flex-grow: 1;
  }
}
.kline-slide{
  display: flex;
  flex-direction: column;
  .opinion-box{
    flex-grow: 1;
  }
}
</style>