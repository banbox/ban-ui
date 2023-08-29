<script setup lang="ts">
import {useKlineLocal} from "~/stores/klineLocal";

const klocal = useKlineLocal()
</script>

<template>
  <KlineChart :custom-load="true">
    <div class="kline-slide" v-show="klocal.showRight">
      <RangeBigTrends/>
    </div>
  </KlineChart>
</template>

<style scoped lang="scss">

</style>