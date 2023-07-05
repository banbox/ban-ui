<template>
  <Modal :title="$t('timezone')" :buttons="['confirm']" :width="400" class="timezone"
         v-model="showModal" @click="clickModal">
    <Select :data-source="langDataOpts" :value="langMap[$i18n.locale]"
            @change="$i18n.locale = $event.value"/>
  </Modal>
</template>

<script lang="ts" setup>
import Modal from "~/components/kline/modal.vue"
import Select from "~/components/kline/select.vue"
import {computed, defineProps, reactive, ref} from "vue";
import {defineEmits} from "vue/dist/vue";
import i18n from "~/composables/i18n";
let t = i18n.global.t
const props = defineProps<{
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

type SelOption = {
  value: string,
  text: string
}

const langMap = reactive<Record<string, string>>({
  en: 'English',
  cn: '简体中文'
})

const langDataOpts = reactive<SelOption[]>(Object.entries(langMap).map(([value, text]) => ({ value, text })))

function clickModal(){
  showModal.value = false
}

</script>

<style scoped>

</style>