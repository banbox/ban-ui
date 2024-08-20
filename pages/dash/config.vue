<script setup lang="ts">

import {definePageMeta} from "#imports";
import {useCurApi} from "~/composables/dash/api";
import {useDashStore} from "~/stores/dash";

definePageMeta({
  layout: 'dash',
})

const {getApi, postApi} = useCurApi()
const store = useDashStore()
store.menu_id = 'config'
const content = ref('')

async function loadData(){
  const rsp = await getApi('/config')
  content.value = rsp.data ?? 'no data'
}

onMounted(() => {
  loadData()
})

async function reloadConfig() {
  const rsp = await postApi('/config', {data: content.value})
  if (rsp.code == 200) {
    ElMessage.success({message: '加载成功'})
  } else {
    ElMessage.error({message: JSON.stringify(rsp)})
  }
  await loadData()
}
</script>

<template>
  <el-button type="primary" @click="reloadConfig">应用修改后的配置</el-button>
  <pre>{{content}}</pre>
</template>

<style scoped lang="scss">

</style>