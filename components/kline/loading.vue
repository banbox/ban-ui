<template>
  <div class="klinecharts-pro-loading">
    <i class="circle1" />
    <i class="circle2" />
    <i class="circle3" />
  </div>
</template>

<script setup lang="ts">

</script>

<style scoped lang="scss">
@import '@/assets/klinebase.scss';

.#{$prefix-cls}-loading {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 50;
  color: var(--klinecharts-pro-primary-color);
  .circle1,
  .circle2,
  .circle3 {
    display: inline-block;
    width: 10px;
    height: 10px;
    pointer-events: none;
    border-radius: 50%;
    background-color: currentColor;
    animation: loading-anim 0.8s ease-in-out alternate infinite;
  }
  .circle1 {
    animation-delay: 0.48s;
  }
  .circle2 {
    margin-left: 0.2em;
    margin-right: 0.2em;
    animation-delay: 0.32s;
  }
  .circle3 {
    animation-delay: 0.16s;
  }
  @keyframes loading-anim {
    0% {
      top: 0em;
    }
    100% {
      margin-top: -2.2em;
    }
  }
}

</style>