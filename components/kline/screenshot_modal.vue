<template>
  <KlineModal :title="$t('screenshot')" :buttons="['confirm']" :width="540"
         v-model="showModal" @click="clickModal">
    <img style="width:500px;margin-top: 20px" :src="url"/>
  </KlineModal>
</template>

<script setup lang="ts">
import {computed} from "vue";

const props = defineProps<{
  url: string,
  modelValue: boolean
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

function clickModal(from: string){
  if(from == 'confirm'){
    const a = document.createElement('a')
    a.download = 'screenshot'
    a.href = props.url
    document.body.appendChild(a)
    a.click()
    a.remove()
  }
}

</script>

<style scoped>

</style>