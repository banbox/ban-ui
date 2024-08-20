<script setup lang="ts">
import {useI18n} from "vue-i18n";
import {type TradeBot} from "~/composables/dash/types";
import type {FormInstance, FormRules} from "element-plus";
import {useBotAuth} from "~/composables/dash/auth";
const {t} = useI18n()

const emit = defineEmits<{
  add: [TradeBot]
}>()

const model = reactive<TradeBot>({
  name: '',
  url: '',
  user_name: '',
  password: '',
  auto_refresh: true
})

const submiting = ref(false)
const fromRef = ref<HTMLFormElement>()
const error_msg = ref('')

const {login} = useBotAuth(model)

const url_holder = computed(() => {
  const protocol = process.client ? window.location.protocol : 'https:'
  return protocol + '//12.34.56.78'
})

const validateBotUrl = (rule: any, value: any, callback: any) => {
  if(value === ''){
    callback(new Error(t('this_is_required')))
  }
  else if(/^(https?:\/\/)?\S+/.test(value)){
    callback(new Error(t('not_url')))
  }
  else{
    callback()
  }
}

const validateRequired = (rule: any, value: any, callback: any) => {
  if(value === ''){
    callback(new Error(t('this_is_required')))
  }
  else{
    callback()
  }
}

const paperRules = reactive<FormRules<TradeBot>>({
  url: [{validator: validateBotUrl, trigger: 'blur'}],
  user_name: [{validator: validateRequired, trigger: 'blur'}],
  password: [{validator: validateRequired, trigger: 'blur'}],
})


const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  error_msg.value = ''
  submiting.value = true
  await formEl.validate(async (valid, fields) => {
    if (!valid) {
      submiting.value = false
      return
    }
    const res = await login()
    submiting.value = false
    if(res.code == 200){
      emit('add', model)
    }
    else if(res.code == 401){
      error_msg.value = '连接成功，但用户名或密码错误'
    }
    else{
      error_msg.value = `连接失败，请检查 ${model.url}/api/v1/ping 是否可正常访问；`
      if(model.url != window.location.origin){
        error_msg.value += `<br>同时请检查是否将 ${window.location.origin} 添加到机器人配置'CORS_origins'中放行`
      }
    }
  })
}

</script>

<template>
  <div class="add-bot">
    <el-form :model="model" ref="fromRef" :rules="paperRules" status-icon label-width="90px">
      <el-form-item :label="$t('bot_url')" prop="bot_url">
        <el-input req v-model="model.url" :placeholder="url_holder"/>
      </el-form-item>
      <el-form-item :label="$t('user_name')" prop="user_name">
        <el-input v-model="model.user_name" :placeholder="$t('input_username')"/>
      </el-form-item>
      <el-form-item :label="$t('password')" prop="password" type="password">
        <el-input v-model="model.password" :placeholder="$t('input_password')"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="large" :loading="submiting"
                   @click="submitForm(fromRef)">{{$t('login_bot')}}</el-button>
      </el-form-item>
    </el-form>
  </div>
  <div class="end-err" v-if="error_msg" v-html="error_msg"></div>
</template>

<style scoped lang="scss">
.add-bot{
  width: 320px;
  margin: 0 auto;
}
.end-err{
  text-align: center;
  color: var(--el-color-danger);
  font-size: 14px;
  line-height: 1.8;
}
</style>