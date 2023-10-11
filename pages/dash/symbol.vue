<script setup lang="ts">

import {ApiResult, definePageMeta} from "#imports";
import {useCurApi} from "~/composables/dash/api";
import {useDashStore} from "~/stores/dash";

definePageMeta({
  layout: 'dash',
})

const {getApi, postApi} = useCurApi()
const store = useDashStore()
store.menu_id = 'pair'
const tab_name = ref('white')
const whitelist = reactive<string[]>([])
const blacklist = reactive<string[]>([])
const methods = reactive<string[]>([])
const showInput = ref(false)
const input_val = ref('')
const loading = ref(false)


function applyResult(rsp: ApiResult){
  methods.splice(0, methods.length, ...rsp.method)
  blacklist.splice(0, blacklist.length, ...rsp.blacklist)
  whitelist.splice(0, whitelist.length, ...rsp.whitelist)
}


async function loadData(){
  const rsp = await getApi(`/pairlist`)
  applyResult(rsp)
}

onMounted(() => {
  loadData()
})

const pair_list = computed(() => {
  return tab_name.value == 'white' ? whitelist : blacklist
})

function onOptionResult(rsp: ApiResult){
  let type = 'success';
  let message = '操作成功'
  if(rsp.code !== 200){
    type = 'error'
    message = JSON.stringify(rsp)
  }
  else if(rsp.errors && Object.keys(rsp.errors).length){
    type = 'error'
    message = JSON.stringify(rsp.errors)
  }
  ElMessage({type, message})
  if(rsp.code == 200){
    applyResult(rsp)
  }
}

async function delItem(tag: string){
  if(loading.value)return
  loading.value = true
  const data = {for_white: tab_name.value == 'white', deletes: [tag]}
  const rsp = await postApi(`/pairlist`, data)
  loading.value = false
  onOptionResult(rsp)
}

async function onInputTag(){
  if(loading.value)return
  loading.value = true
  showInput.value = false
  if(!input_val.value)return
  const data = {for_white: tab_name.value == 'white', adds: [input_val.value]}
  const rsp = await postApi(`/pairlist`, data)
  loading.value = false
  onOptionResult(rsp)
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
    <el-tag v-for="(item, index) in pair_list" :key="index" closable @close="delItem(item)"
            :type="tab_name == 'white' ? 'success' : 'danger'">{{item}}</el-tag>
    <div class="add-box">
      <el-input v-if="showInput" ref="inputRef" v-model="input_val" size="small"
                @keyup.enter="onInputTag" @blur="onInputTag"/>
      <el-button v-else size="small" @click="showInput = true">添加</el-button>
    </div>
  </div>

</template>

<style scoped lang="scss">
.pair-list{
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  .el-tag, .add-box{
    margin-top: 10px;
    margin-right: 10px;
  }
  .add-box{
    width: 100px;
    display: inline-block;
  }
}
.methods{
  .item{
    margin: 10px 0;
  }
}
</style>