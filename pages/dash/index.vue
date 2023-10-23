<script setup lang="ts">
import {definePageMeta, getApi, setTimezone} from "#imports";
import {useDashLocal} from "~/stores/dashLocal";
import {useDashStore} from "~/stores/dash";
import {useI18n} from "vue-i18n";
import {BotInfo, TradeBot} from "~/composables/dash/types";
import {Delete} from "@element-plus/icons-vue";
import {useLocalePath} from "#i18n";
import {useApi} from "~/composables/dash/api";

const {t} = useI18n()

definePageMeta({
  layout: false,
})

interface BotCount{
  open_num: number
  max_num: number
  total_cost: number
}

const local = useDashLocal()
const store = useDashStore()
const showAdd = ref(false)
const localPath = useLocalePath()
const counts = reactive<Record<string, BotCount>>({})

function loginOk(info: TradeBot){
  const message = `${t('add_bot_ok')}：${info.name}`
  ElMessage.success({message})
  showAdd.value = false
}

function clickBot(index: number){
  local.cur_id = index
  navigateTo(localPath('/dash/board'))
}

async function delBot(index: number) {
  try {
    await ElMessageBox.confirm(t('confirm_logout_bot'), t('delete'))
  } catch (e) {
    return
  }
  local.all_bots.splice(index, 1)
  if (local.cur_id > local.all_bots.length) {
    local.cur_id = 0
  }
}

async function loadData(bot: TradeBot){
  const {getApi} = useApi(bot)
  const rsp = await getApi('/count')
  counts[bot.url] = (rsp as unknown) as BotCount
}

onMounted(() => {
  setTimezone('UTC', false)
  local.all_bots.forEach(bot => {
    loadData(bot)
  })
})

</script>

<template>
  <div class="main-body">
    <img src="/logo_200.png">
    <h1>{{$t('dash_h1')}}</h1>
    <p>{{$t('dash_desc')}}</p>
    <p>
      <span>{{$t('dash_help')}}</span>
      <el-link type="primary" @click="store.showContact = true">{{$t('contact-us')}}</el-link>
    </p>
    <div class="all-bots" v-if="local.all_bots.length > 0">
      <div class="item" v-for="(item, index) in local.all_bots" :key="index" @click="clickBot(index)"
        :class="{active: index == local.cur_id}">
        <div class="title">{{item.name}}</div>
        <div class="right-acts">
          <template v-if="counts[item.url]">
            <div class="num">Open: {{counts[item.url].open_num}}</div>
            <div class="cost">Cost: {{(counts[item.url].total_cost ?? 0).toFixed(4)}}</div>
          </template>
          <div class="status" :class="[item.avaiable ? 'ok': 'fail']"
               :title="$t(item.avaiable ? 'online':'offline')"/>
          <el-switch v-model="item.auto_refresh" :title="$t('auto_refresh')"/>
          <el-icon size="20px" color="#F56C6CFF" @click.prevent="delBot(index)"
                   :title="$t('delete')"><Delete /></el-icon>
        </div>
      </div>
    </div>
    <el-button class="show-add" size="large" type="primary" v-if="!showAdd"
               @click="showAdd = true">{{$t('login_bot')}}</el-button>
    <DashAddBot v-else @add="loginOk"/>
  </div>
</template>

<style scoped lang="scss">
.main-body{
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  h1{
    margin: 30px 0;
  }
  p{
    font-size: 14px;
    margin-bottom: 15px;
    color: var(--el-color-info);
    display: flex;
    flex-direction: row;
    justify-content: center;
  }
  .show-add{
    margin-top: 30px;
  }
}
.all-bots{
  margin: 30px 0;
  min-width: 500px;
  max-width: 700px;
  border-top: 1px solid var(--el-border-color);
  .item{
    cursor: pointer;
    height: 50px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    border-bottom: 1px solid var(--el-border-color);
    &.active{
      border: 1px solid var(--el-color-primary);
      color: var(--el-color-primary);
    }
    &:hover{
      background-color: #ffffff;
      color: var(--el-color-primary);
      border-bottom: 1px solid var(--el-color-primary);
    }

    .right-acts{
      width: 330px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
    }
    .status{
      width: 24px;
      height: 24px;
      border-radius: 15px;
      &.ok{
        background-color: var(--el-color-success);
      }
      &.fail{
        background-color: var(--el-color-danger);
      }
    }

  }
}
</style>