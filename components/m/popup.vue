<template>
  <div class="popup-box" v-if="showModal">
    <div class="bg" @click="showModal = false"></div>
    <div class="popup-cont">
      <div class="box-hd">
        <div class="h3">{{title}}</div>
        <div class="h3-info" v-if="tip_msg">{{tip_msg}}</div>
        <div class="close" @click="showModal = false">
          <svg width="4.533333333333333vw" height="4.533333333333333vw" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 34 34"><path d="M19.686 17l8.868 8.828c.714.718.73 1.872.036 2.61a1.77 1.77 0 01-2.55.038l-8.94-8.902-8.94 8.902a1.771 1.771 0 01-2.55-.036 1.877 1.877 0 01.036-2.61L14.514 17 5.646 8.173a1.877 1.877 0 01-.036-2.61 1.77 1.77 0 012.55-.039l8.94 8.903 8.94-8.903a1.771 1.771 0 012.55.036 1.877 1.877 0 01-.036 2.61L19.686 17z" fill="#656472" fill-rule="nonzero" opacity="0.501"></path></svg>
        </div>
      </div>
      <slot/>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {computed, defineProps} from "@vue/runtime-core";
import {defineEmits} from "vue";

const props = defineProps<{
  modelValue: boolean,
  title: string,
  tip_msg: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const showModal = computed({
  get(){
    return props.modelValue
  },
  set(value){
    emit('update:modelValue', value)
  }
})
</script>

<style lang="scss">

.popup-box{
  position: fixed;
  top: 0;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  .bg{
    width: 100vw;
    height: 100vh;
    background: #121127;
    opacity: .3;
  }
  .popup-cont{
    position: absolute;
    bottom: 0;
    z-index: 99999;
    width: 100%;
    overflow: hidden;
    background-color: #fff;
    border-radius: 4vw 4vw 0 0;
  }
}

.box-hd{
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 5.3333333333vw 12vw 5.3333333333vw 4vw;
  .h3{
    width: auto;
    height: auto;
    font-family: PingFangSC-Semibold,PingFang SC,sans-serif;
    font-size: 6.6666666667vw;
    font-weight: 600;
    line-height: 9.3333333333vw;
    color: #121127;
  }
  .h3-info{
    width: 84vw;
    height: auto;
    margin-top: 3.2vw;
    font-family: PingFangSC-Regular,PingFang SC,sans-serif;
    font-size: 4vw;
    font-weight: 400;
    line-height: 5.6vw;
    color: #656472;
  }
  .close{
    position: absolute;
    top: 4.5333333333vw;
    right: 4vw;
  }
}
</style>