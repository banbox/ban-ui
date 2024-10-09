<script setup lang="ts">
import {useDashLocal} from "~/stores/dashLocal";
import {HomeFilled, Memo, List, Calendar, ShoppingTrolley, Setting, TrendCharts, Tickets,
  Refresh, Connection, Fold, Expand, Files} from "@element-plus/icons-vue";
import {useDashStore} from "~/stores/dash";
import {useLocalePath} from "#i18n";
import {setTimezone} from "~/composables/dateutil";

const localPath = useLocalePath()
const local = useDashLocal()
const store = useDashStore()
const collapse = ref(false)
const showAddBot = ref(false)

await setTimezone('UTC', false)

function goPage(path: string){
  return navigateTo(localPath(path))
}

</script>

<template>
  <Head>
    <Title>Digo机器人面板</Title>
  </Head>
  <client-only>
    <el-dialog v-model="showAddBot" :title="$t('login_bot')" width="500px">
      <DashAddBot @add="showAddBot = false"/>
    </el-dialog>
  </client-only>
  <el-container class="root-body">
    <el-menu :collapse="collapse" class="lay-menu" :default-active="store.menu_id">
      <div class="user-box">
        <div class="logo-box" @click="goPage('/dash')">
          <span>Banbot</span>
        </div>
      </div>
      <el-menu-item index="index" @click="goPage('/dash/board')">
        <el-icon><HomeFilled /></el-icon>
        <template #title>首页</template>
      </el-menu-item>
      <el-menu-item index="job" @click="goPage('/dash/pair_job')">
        <el-icon><List /></el-icon>
        <template #title>币对 & 策略</template>
      </el-menu-item>
      <el-menu-item index="kline" @click="goPage('/dash/kline')">
        <el-icon><TrendCharts /></el-icon>
        <template #title>K线</template>
      </el-menu-item>
      <el-menu-item index="stat" @click="goPage('/dash/stat')">
        <el-icon><Calendar /></el-icon>
        <template #title>收益统计</template>
      </el-menu-item>
      <el-menu-item index="order" @click="goPage('/dash/order')">
        <el-icon><Memo /></el-icon>
        <template #title>订单</template>
      </el-menu-item>
      <el-menu-item index="rebate" @click="goPage('/dash/incomes')">
        <el-icon><Files /></el-icon>
        <template #title>账户损益流水</template>
      </el-menu-item>
      <el-menu-item index="config" @click="goPage('/dash/config')">
        <el-icon><Setting /></el-icon>
        <template #title>配置</template>
      </el-menu-item>
<!--      <el-menu-item index="7">-->
<!--        <el-icon><TrendCharts /></el-icon>-->
<!--        <template #title>K线</template>-->
<!--      </el-menu-item>-->
      <el-menu-item index="log" @click="goPage('/dash/logs')">
        <el-icon><Tickets /></el-icon>
        <template #title>日志</template>
      </el-menu-item>
    </el-menu>
    <div class="main-box">
      <el-header class="main-head" height="50px">
        <div class="head-sec">
          <el-icon class="head-item" size="25" @click="collapse = !collapse">
            <Fold v-if="!collapse"/><Expand v-else/>
          </el-icon>
        </div>
        <div class="head-sec right">
          <template v-if="local.all_bots.length > 0">
<!--            <el-switch v-model="local.bot.auto_refresh" inline-prompt :active-text="$t('auto_refresh')"-->
<!--                       :inactive-text="$t('disable_refresh')"/>-->
<!--            <el-button size="small" type="primary" :icon="Refresh" circle></el-button>-->
            <el-select v-model="local.cur_id" style="width: 130px">
              <el-option v-for="(item, index) in local.all_bots" :key="index" :label="item.name" :value="index"/>
            </el-select>
          </template>
          <el-button :icon="Connection" @click="showAddBot = true">新机器人</el-button>
        </div>
      </el-header>
      <div class="main-body">
        <slot/>
      </div>
    </div>
  </el-container>
</template>

<style lang="scss">
html, body{
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
.root-body{
  width: 100%;
  height: 100%;
  flex-grow: 1;
}
.flex-grow{
  flex-grow: 1;
}
.main-box{
  flex-grow: 1;
  background-color: #f4f6f9;
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
}
.lay-menu{
  width: 13%;
  min-height: 100vh;
  min-width: 146px;
  max-width: 240px;
  box-shadow: 0 14px 28px rgba(0,0,0,.25),0 10px 10px rgba(0,0,0,.22)!important;
  color: #c2c7d0 !important;
  --el-menu-text-color: #c2c7d0 !important;
  --el-menu-hover-text-color: #c2c7d0 !important;
  --el-menu-bg-color: rgb(52, 58, 64);
  --el-menu-hover-bg-color: rgb(42, 46, 51);
  --el-menu-level: 0;
  .el-text{
    color: #c2c7d0 !important;
  }
}
.user-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px 0;
}
.logo-box{
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  margin-bottom: 20px;
}
.el-menu--collapse{
  min-width: unset;
  width: calc( var(--el-menu-icon-width) + var(--el-menu-base-level-padding) * 2 );
  .logo-box{
    height: 40px;
  }
  .photo-box{
    width: 35px;
    height: 35px;
  }
}
.main-head{
  padding: 0;
  border-bottom: 1px solid #dee2e6;
  z-index: 1034;
  background: #ffffff;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  .head-item{
    margin-left: 15px;
    display: flex;
    align-items: center;
  }
  .el-select.brand{
    width: 130px;
  }
}
.head-sec{
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  &.right{
    padding-right: 20px;
    > *{
      margin-left: 20px;
    }
    .head-item{
      margin-left: 0;
      margin-right: 15px;
    }
  }
}
.exit-login{
  cursor: pointer;
}
.main-body{
  width: unset;
  margin: 10px;
  min-height: 600px;
  padding: 30px 25px;
  background: #fff;
  box-shadow: 0px 4px 24px 0px rgb(67 84 106 / 8%);
}
.main-title{
  font-size: 20px;
  margin-bottom: 20px;
  color: var(--el-text-color);
}
.main-body, .main-table{
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}
</style>