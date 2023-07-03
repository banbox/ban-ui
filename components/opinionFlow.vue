<template>
  <div class="opinion-box">
    <div class="item" v-for="(item, index) in data_list" :key="index">
      <div class="op-head">
        <span class="nick">{{item.user_name}}</span>
        <span class="date">{{item.create_at}}</span>
      </div>
      <div class="op-content" v-html="item.content"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {onMounted, reactive} from "vue";
import {getApi} from "#imports";

type Opinion = {
  user_name: string,
  create_at: string,
  content: string
}

const data_list = reactive<Opinion[]>([])

async function loadOpinions(){
  const rsp = await getApi('/kline/opinion_flow');
  const flow = (rsp.data ?? []) as Opinion[]
  data_list.splice(0, data_list.length, ...flow)
}

onMounted(()=>{
  loadOpinions()
})

</script>

<style lang="scss">
@import "~/assets/klinebase.scss";

.opinion-box{
  overflow-y: scroll;
  border: 1px solid #eee;
  margin-bottom: 20px;
  .item{
    padding: 5px 15px;
    border-bottom: 1px solid #eee;
  }
}
.op-head{
  font-size: 12px;
  height: 30px;
  line-height: 30px;
  .nick{
    color: #{$c-active-color};
  }
  .date{
    color: #888;
    margin-left: 10px;
  }
}

.op-content{
  font-size: 14px;
  color: #444;
  img{
    width: 100%;
  }
}
</style>