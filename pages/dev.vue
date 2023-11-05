<script setup lang="ts">
import {useKlineLocal} from "~/stores/klineLocal";
import {MyDatafeed} from "~/composables/kline/datafeeds";
import type {PairItem} from "~/composables/types";
import BotTaskList from "~/components/BotTaskList.vue";
import {useKlineStore} from "~/stores/kline";
import {setTimezone} from "~/composables/dateutil";
import {useSymbols} from "~/composables/kline/coms";

const klocal = useKlineLocal()
const main = useKlineStore()
const {loadSymbols} = useSymbols()

const slide_tab = ref('max_chg')
const slide_tabs = reactive<PairItem[]>([
  {label: '市场变动', value: 'max_chg'},
  {label: '任务列表', value: 'task_list'},
])

onMounted(() => {
  setTimezone()
  loadSymbols()
})


function setSlideTab(tab_name: string){
  slide_tab.value = tab_name
  main.cur_symbols.splice(0, main.cur_symbols.length)
}

</script>

<template>
  <KlineChart :custom-load="true">
    <div class="aslide-wrap">
      <div class="kline-slide" v-show="klocal.showRight">
        <RangeBigTrends v-if="slide_tab == 'max_chg'"/>
        <BotTaskList v-else-if="slide_tab == 'task_list'"/>
      </div>
      <div class="tab-menu">
        <div class="menu-item" v-for="(item, index) in slide_tabs" :key="index"
          :class="{active: slide_tab == item.value}"
             @click="setSlideTab(item.value)">{{item.label}}</div>
        <div class="grow"></div>
      </div>
    </div>
  </KlineChart>
</template>

<style lang="scss">
@import "~/assets/klinebase.scss";
@import '~/assets/klinefont.css';
#__nuxt{
  --c-aside-width: 325px;
}
</style>

<style scoped lang="scss">

.aslide-wrap{
  width: 325px;
  display: flex;
  flex-direction: row;
}
.kline-slide{
  flex-grow: 1;
}
.tab-menu{
  height: 100%;
  width: 25px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: var(--el-color-info-light-9);
  .grow{
    flex-grow: 1;
  }
}
.menu-item{
  cursor: pointer;
  width: 100%;
  display: flex;
  font-size: 13px;
  writing-mode: vertical-rl;
  text-orientation: upright;
  align-items: center;
  padding: 15px 0;
  background-color: var(--el-color-info-light-7);
  border: 1px solid var(--el-color-info-light-7);
  &.active{
    background-color: var(--el-color-primary-light-9);
    color: var(--el-color-primary);
    border: 1px solid var(--el-color-primary-light-3);
  }
  &:hover{
    color: var(--el-color-primary);
  }
}
</style>