<template>
  <ul class="klinecharts-pro-list">
    <KlineLoading v-if="loading"/>
    <slot v-else/>
  </ul>
</template>

<script setup lang="ts">
import {defineProps} from "vue";

const props = defineProps<{
  loading?: boolean
}>()


</script>

<style lang="scss">
@import '@/assets/klinebase.scss';

.#{$prefix-cls}-list  {
  position: relative;
  list-style: none;
  margin: 0;
  padding: 0;
  overflow-y: auto;
  font-size: 14px;
  color: var(---klinecharts-pro-text-color);
  min-height: 200px;
  &::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  &::-webkit-scrollbar-thumb {
    width: 8px;
    height: 8px;
    border-radius: 4px;
    background-color: var(--klinecharts-pro-border-color);
  }
  li {
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 40px;
    padding: 0 20px;
    box-sizing: border-box;
    cursor: pointer;
    &:hover {
      background-color: var(--klinecharts-pro-hover-background-color);
    }
  }
}
</style>