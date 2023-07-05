<template>
  <Modal :title="$t('timezone')" :buttons="['confirm']" :width="400" class="timezone"
         v-model="showModal" @click="clickModal">
    <Select :data-source="timeZoneOpts" :value="timezone_text" @change="clickTimeZone"/>
  </Modal>
</template>

<script setup lang="ts">
import Modal from "~/components/kline/modal.vue"
import Select from "~/components/kline/select.vue"
import {computed, defineProps, ref} from "vue";
import {defineEmits} from "vue/dist/vue";
import {translateTimezone, getTimezoneSelectOptions} from "~/components/kline/timezone_opts";
import {Chart} from "klinecharts";

const props = defineProps<{
  chart: Chart,  // 绘图对象
  timezone: string,
  modelValue: boolean
}>()

const timeZoneOpts = ref(getTimezoneSelectOptions())
const timezone_ = ref(props.timezone)
const timezone_text = computed(() => {
  return translateTimezone(timezone_.value)
})

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

function clickTimeZone(item: any){
  timezone_.value = item.key
}

function clickModal(from: string){
  if(from !== 'confirm')return;
  props.chart.setTimezone(timezone_.value)
  showModal.value = false
}

</script>

<style lang="scss">
.timezone {
  .content-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 70px;

    .klinecharts-pro-select {
      width: 70%;
    }
  }
}
</style>