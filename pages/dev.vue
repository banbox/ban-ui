<script setup lang="ts">
import {useKlineLocal} from "~/stores/klineLocal";
import {MyDatafeed} from "~/composables/kline/datafeeds";

const klocal = useKlineLocal()
const datafeed = new MyDatafeed()
</script>

<template>
  <KlineChart :datafeed="datafeed" :custom-load="true">
    <div class="kline-slide" v-show="klocal.showRight">
      <RangeBigTrends/>
    </div>
  </KlineChart>
</template>

<style scoped lang="scss">

</style>