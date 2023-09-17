<script setup lang="ts">

import {definePageMeta} from "#imports";
import {useCurApi} from "~/composables/dash/api";
import {useDashStore} from "~/stores/dash";

definePageMeta({
  layout: 'dash',
})

const {getApi, delApi} = useCurApi()
const store = useDashStore()
store.menu_id = '5'
const tab_name = ref('white')
const pair_list = reactive<string[]>([])
const methods = reactive<string[]>([])

async function loadData(){
  const path = tab_name.value == 'white' ? 'whitelist' : 'blacklist'
  const rsp = await getApi(`/${path}`)
  methods.splice(0, methods.length, ...rsp.method)
  pair_list.splice(0, pair_list.length, ...rsp[path])
}

onMounted(() => {
  loadData()
})

watch(tab_name, () => {
  if(tab_name.value == 'method')return
  loadData()
})

async function delItem(tag: string){
  const path = tab_name.value == 'white' ? 'whitelist' : 'blacklist'
  const rsp = await delApi(`/${path}`, null, {pairs: [tag]})
  if(rsp.code == 200){
    ElMessage.success({message: '删除成功'})
  }
  else{
    ElMessage.error({message: JSON.stringify(rsp)})
  }
}
</script>

<template>
  <el-menu :default-active="tab_name" mode="horizontal" @select="tab_name = $event">
    <el-menu-item index="white">允许列表</el-menu-item>
    <el-menu-item index="black">禁止列表</el-menu-item>
    <el-menu-item index="method">筛选器</el-menu-item>
  </el-menu>
  <div class="methods" v-if="tab_name == 'method'">
    <div class="item" v-for="(item, index) in methods" :key="index">
      {{item}}
    </div>
  </div>
  <div class="pair-list" v-else>
    <el-tag v-for="(item, index) in pair_list" :key="index" :closable="tab_name == 'black'" @close="delItem(item)"
            :type="tab_name == 'white' ? 'success' : 'danger'">{{item}}</el-tag>
  </div>

</template>

<style scoped lang="scss">
.pair-list{
  .el-tag{
    margin-top: 10px;
    margin-right: 10px;
  }
}
.methods{
  .item{
    margin: 10px 0;
  }
}
</style>