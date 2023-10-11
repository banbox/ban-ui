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
  content.value = rsp.content ?? 'no data'
}

onMounted(() => {
  loadData()
})

async function reloadConfig() {
  try {
    await ElMessageBox.confirm('请确认已登录服务器修改完成配置文件，再在这里点击应用生效', '提示', {
      confirmButtonText: '已修改，应用',
      cancelButtonText: '取消'
    })
  } catch (e) {
    return
  }
  const rsp = await postApi('/reload_config')
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