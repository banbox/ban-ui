<script setup lang="ts">

import {definePageMeta, getDateStr} from "#imports";
import {useCurApi} from "~/composables/dash/api";
import {useDashStore} from "~/stores/dash";

definePageMeta({
  layout: 'dash',
})

const {getApi, postApi} = useCurApi()
const store = useDashStore()
store.menu_id = 'log'
const content = reactive<string[]>([])

async function loadData(){
  const rsp = await getApi('/logs')
  content.splice(0, content.length)
  for(const item of rsp.logs){
    content.push(`${getDateStr(item[0])} ${item[1]} ${item[2]} ${item[3]}`)
  }
}

onMounted(() => {
  loadData()
})

</script>

<template>
  <pre class="log-box">{{content.join('\n')}}</pre>
</template>

<style scoped lang="scss">
  .log-box{
    white-space: pre-wrap;
  }
</style>