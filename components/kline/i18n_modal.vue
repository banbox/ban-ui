<template>
  <Modal :title="$t('language')" :buttons="['confirm']" :width="400" class="timezone"
         v-model="showModal">
    <Select :data-source="langOpts" :value="langMap[$i18n.locale]"
            @change="$i18n.locale = $event.value"/>
  </Modal>
</template>

<script lang="ts" setup>
import Modal from "~/components/kline/modal.vue"
import Select from "~/components/kline/select.vue"
import {computed, defineProps, reactive, ref} from "vue";
import {defineEmits} from "vue/dist/vue";
import i18n, {useUserLang, useLangOpts} from "~/composables/i18n";
const props = defineProps<{
  modelValue: boolean
}>()
const userLang = useUserLang()
const {langMap, langOpts} = useLangOpts()

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

function setLocale(locale: any){
  i18n.global.locale.value = locale
  userLang.value = locale
}

</script>

<style scoped>

</style>