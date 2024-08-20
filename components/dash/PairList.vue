<script setup lang="ts">

import {defineProps} from "@vue/runtime-core";
import {computed, defineEmits} from "vue";
import type {ApiResult} from "~/utils/netio";
import {useCurApi} from "~/composables/dash/api";

const {getApi, postApi} = useCurApi()

const props = defineProps<{
  modelValue: boolean,
  is_white: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const title = computed(() => {
  return props.is_white ? '白名单': '黑名单'
})


const showModal = computed({
  get(){
    return props.modelValue
  },
  set(value){
    emit('update:modelValue', value)
  }
})

const showInput = ref(false)
const input_val = ref('')
const loading = ref(false)


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
  const data = {for_white: props.is_white, deletes: [tag]}
  const rsp = await postApi(`/pairlist`, data)
  loading.value = false
  onOptionResult(rsp)
}

async function onInputTag(){
  if(loading.value)return
  loading.value = true
  showInput.value = false
  if(!input_val.value)return
  const data = {for_white: props.is_white, adds: [input_val.value]}
  const rsp = await postApi(`/pairlist`, data)
  loading.value = false
  onOptionResult(rsp)
}

</script>

<template>
  <el-dialog v-model="showModal" :title="title" width="600">
    <div class="pair-list">
      <el-tag v-for="(item, index) in pair_list" :key="index" closable @close="delItem(item)"
            :type="is_white ? 'success' : 'danger'">{{item}}</el-tag>
      <div class="add-box">
        <el-input v-if="showInput" ref="inputRef" v-model="input_val" size="small"
                  @keyup.enter="onInputTag" @blur="onInputTag"/>
        <el-button v-else size="small" @click="showInput = true">添加</el-button>
      </div>
    </div>
  </el-dialog>
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
</style>