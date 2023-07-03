<template>
  <Modal :title="$t(form_mode)" :width="500" v-model="showModal">
    <div class="login-box">
      <div class="logo-box">
        <img src="/logo_192.png" alt="logo"/>
      </div>
      <el-form v-if="form_mode == 'register'" ref="regFormRef" :model="regForm" :rules="regRules"
        class="form-area" status-icon>
        <el-form-item :required="true" prop="binance_uid">
          <el-input v-model.number="regForm.binance_uid" :placeholder="$t('binance_uid')">
            <template #prepend>
              <el-icon><Connection /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item :required="true" prop="username">
          <el-input v-model="regForm.username" :placeholder="$t('input_username')">
            <template #prepend>
              <el-icon><User /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item :required="true" prop="password">
          <el-input v-model="regForm.password" type="password" autocomplete="off" :show-password="showPwd"
                    :placeholder="$t('input_password')">
            <template #prepend>
              <el-icon><Key/></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item :required="true" prop="password2">
          <el-input v-model="regForm.password2" type="password" autocomplete="off" :placeholder="$t('input_password2')">
            <template #prepend>
              <el-icon><Key/></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-text type="danger" v-if="err_msg">{{err_msg}}</el-text>
        <el-button size="large" type="primary" class="main" :loading="authDoing" @click="submitForm(regFormRef)">
          {{ $t('register') }}
        </el-button>
        <el-link @click="form_mode='login'">{{$t('register_to_login')}}</el-link>
      </el-form>
      <el-form class="form-area" v-else>
        <el-form-item :required="true">
          <el-input v-model="username" :placeholder="$t('input_username')">
            <template #prepend>
              <el-icon><User /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item :required="true">
          <el-input v-model="password" type="password" autocomplete="off" :show-password="showPwd"
                    :placeholder="$t('input_password')">
            <template #prepend>
              <el-icon><Key/></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-text type="danger" v-if="err_msg">{{err_msg}}</el-text>
        <el-button size="large" type="primary" class="main" :loading="authDoing" @click="login">
          {{ $t('login') }}
        </el-button>
        <el-link @click="form_mode='register'">{{$t('login_to_register')}}</el-link>
      </el-form>
      <div class="login-btm">
        <span>{{$t('reg_log_accept')}}</span>
        <el-link target="_blank" href="/user_contact.html">{{$t('user_contract')}}</el-link>
        <span>{{$t('and')}}</span>
        <el-link target="_blank" href="/privacy_policy.html">{{$t('privacy_policy')}}</el-link>
      </div>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import Modal from "~/components/kline/modal.vue"
import {Connection, User, Key, Promotion, Message, View, Hide} from "@element-plus/icons-vue";
import {useAuthState} from "~/composables/auth";
import {computed, defineEmits, defineProps, reactive, ref} from "vue";
import type {FormRules, FormInstance} from "element-plus";
import i18n from "~/composables/i18n"
const t = i18n.global.t

const {authData, authStatus, authToken, authDoing} = useAuthState()
interface RegRuleForm{
  binance_uid: number,
  username: string,
  password: string,
  password2: string
}
const regForm = reactive({
  binance_uid: '',
  username: '',
  password: '',
  password2: ''
})
const validateBUid = (rule: any, value: any, callback: any) => {
  console.log(value, typeof value)
  callback()
}

const validatePass = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error(t('this_is_required')))
  } else {
    if(!/^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d!@#$%^&*()]{10,}$/.test(value)){
      callback(new Error(t('pwd_format_error')))
    }
    else{
      callback()
    }
  }
}

const validatePass2 = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error(t('this_is_required')))
  } else if (value !== regForm.password) {
    callback(new Error(t('two_pwd_not_match')))
  } else {
    callback()
  }
}

const regRules = reactive<FormRules<RegRuleForm>>({
  binance_uid: [
    {required: true, message: t('this_is_required'), trigger: 'blur'},
    {type: 'number', message: t('this_is_number')},
    {validator: validateBUid, trigger: 'blur'}
  ],
  username: [{required: true, message: t('this_is_required'), trigger: 'blur'}],
  password: [{validator: validatePass, trigger: 'blur'}],
  password2: [{validator: validatePass2, trigger: 'blur'}],
})
const err_msg = ref('')
const form_mode = ref('register')
const showPwd = ref(false)
const regFormRef = ref<FormInstance>()
const loginFormRef = ref<FormInstance>()


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


function register(){

}

function login(){

}
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log('submit!')
    } else {
      console.log('error submit!', fields)
    }
  })
}

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}
</script>

<style lang="scss">
@import "~/assets/klinebase.scss";
.login-box{
  display: flex;
  flex-direction: column;
  align-items: center;
}
.logo-box{
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 40px;
  img{
    width: 100px;
  }
}
.form-area{
  width: 70%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .el-form-item{
    width: 100%;
  }

  .el-button.main{
    width: 100%;
    margin: 20px auto;
  }
}
.login-btm{
  text-align: center;
  margin: 50px auto;
  color: #888;
  display: flex;
  align-items: center;
}
</style>