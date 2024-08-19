<template>
  <KlineModal :title="$t('timezone')" :buttons="['close']" :width="400" class="timezone" v-model="showModal">
    <KlineSelect :data-source="timeZoneOpts" :value="$t(timezone_text)" :translate="true"
            @change="setTimezone($event.key)"/>
  </KlineModal>
</template>

<script setup lang="ts">
import {computed, defineProps, ref, watch} from "vue";
import {translateTimezone, getTimezoneSelectOptions, setTimezone} from "~/composables/dateutil";
import {useKlineLocal} from "~/stores/klineLocal";

const store = useKlineLocal()
const props = defineProps<{
  modelValue: boolean
}>()

const timeZoneOpts = ref(getTimezoneSelectOptions())
const timezone_text = computed(() => {
  return translateTimezone(store.timezone)
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