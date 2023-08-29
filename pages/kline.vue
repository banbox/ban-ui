<template>
  <KlineChart :has-right="true">
    <div class="kline-slide" v-show="klocal.showRight">
      <TopChange/>
      <OpinionFlow/>
    </div>
  </KlineChart>
</template>

<script setup lang="ts">
import {useKlineLocal} from "~/stores/klineLocal";

const klocal = useKlineLocal()
</script>

<style lang="scss">
.kline-slide{
  .opinion-box{
    flex-grow: 1;
  }
}
</style>