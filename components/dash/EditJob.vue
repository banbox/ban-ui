<script setup lang="ts">

import {useCurApi} from "~/composables/dash/api";
import {defineProps} from "@vue/runtime-core";
import {computed} from "vue";
import type {PairStgyTf} from "~/composables/dash/types";

const {getApi, postApi} = useCurApi()

const props = defineProps<{
  modelValue: boolean,
  job: PairStgyTf
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

async function clickSave(){
  const rsp = await postApi('/edit_job', props.job)
  if(rsp.code != 200){
    ElMessage.warning({message: JSON.stringify(rsp)})
    return
  }
  ElMessage.success({message: '保存成功'})
  showModal.value = false
}

function clickCancel(){
  showModal.value = false
}

</script>

<template>
  <el-dialog v-model="showModal" :title="`编辑:${job.pair}-${job.strategy}`" width="500">
    <el-form label-width="120px">
      <el-form-item v-for="item in job.args" :label="item.title">
        <el-switch v-model="item.value" width="50" inline-prompt v-if="item.val_type == 'bool'"/>
        <el-input type="number" v-model="item.value" v-else-if="['float', 'int'].includes(item.val_type)"/>
        <el-text :title="'不支持的类型:' + item.val_type" v-else>{{item.value}}</el-text>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="clickSave">保存</el-button>
        <el-button @click="clickCancel">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<style scoped lang="scss">

</style>