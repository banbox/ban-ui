<template>
  <KlineChart :has-right="true">
    <template>
      <div class="kline-slide" v-show="klocal.showRight">
        <TopChange/>
        <OpinionFlow/>
      </div>
    </template>
  </KlineChart>
</template>

<script setup lang="ts">
import {useKlineLocal} from "~/stores/klineLocal";

const klocal = useKlineLocal()
</script>

<style lang="scss">

</style>