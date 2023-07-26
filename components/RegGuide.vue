<template>
  <div class="guide-warp" v-if="showModal">
    <div class="guide-box">
      <div class="guide-info">
        <div class="main-head">
          <h2>{{$t('guide_title')}}</h2>
          <div class="guild-tip">{{$t('guide_tip')}}</div>
        </div>
        <div class="step-box">
          <div class="step-item">
            <div class="img-box">
              <svg width="80" height="80" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M30 45l10 10 10-10v25H30V45z" fill="url(#paint0_linear_1288_31960)"/><path d="M39.998 38.334c-8.284 0-15-6.716-15-15 0-8.284 6.715-15 15-15 8.284 0 15 6.716 15 15 0 8.285-6.716 15-15 15z" fill="url(#paint1_linear_1288_31960)"/><path opacity=".2" d="M64.166 38.334l3.333 3.333 3.334-3.334L67.499 35l-3.333 3.334zm-47.5-31.667l2.5 2.5 2.5-2.5-2.5-2.5-2.5 2.5zm-10 24.166L8.333 32.5l1.666-1.667-1.666-1.666-1.667 1.666z" fill="#76808F"/><path d="M30 45h-6.667C15.97 45 10 50.97 10 58.333V70h20V45z" fill="url(#paint2_linear_1288_31960)"/><path d="M50 70h20V58.333C70 50.97 64.03 45 56.667 45H50v25z" fill="url(#paint3_linear_1288_31960)"/><defs><linearGradient id="paint0_linear_1288_31960" x1="40" y1="70" x2="40" y2="45" gradientUnits="userSpaceOnUse"><stop stop-color="#F0B90B"/><stop offset="1" stop-color="#F8D33A"/></linearGradient><linearGradient id="paint1_linear_1288_31960" x1="39.998" y1="38.334" x2="39.998" y2="8.334" gradientUnits="userSpaceOnUse"><stop stop-color="#F0B90B"/><stop offset="1" stop-color="#F8D33A"/></linearGradient><linearGradient id="paint2_linear_1288_31960" x1="40" y1="45" x2="40" y2="70" gradientUnits="userSpaceOnUse"><stop stop-color="#929AA5"/><stop offset="1" stop-color="#76808F"/></linearGradient><linearGradient id="paint3_linear_1288_31960" x1="40" y1="45" x2="40" y2="70" gradientUnits="userSpaceOnUse"><stop stop-color="#929AA5"/><stop offset="1" stop-color="#76808F"/></linearGradient></defs></svg>
            </div>
            <div class="step-info">
              <h4>{{$t('reg_step1')}}</h4>
              <div class="step-tip">{{$t('step1_tip')}}</div>
            </div>
          </div>
          <div class="step-item">
            <div class="img-box">
              <svg width="80" height="80" fill="none" xmlns="http://www.w3.org/2000/svg"><path opacity=".2" d="M55 6.667L58.333 10l3.334-3.333-3.334-3.334L55 6.667zM34.166 75.833l2.5 2.5 2.5-2.5-2.5-2.5-2.5 2.5zm-22.5-3.333h2.5V70h-2.5v2.5z" fill="#76808F"/><path fill-rule="evenodd" clip-rule="evenodd" d="M5 15h70v24.167h5V42.5H0v-3.333h5V15zm6.666 24.167h20V25.833h-20v13.334z" fill="#76808F"/><path opacity=".2" d="M5 40.833h70V65H5V40.833zm6.666-15h20v13.334h-20V25.833z" fill="#76808F"/><path d="M11.666 45.833v10h20v-10h-5.833L21.665 50 17.5 45.833h-5.833z" fill="url(#paint0_linear_1288_31969)"/><path d="M37.5 25.833h15.833v3.334H37.5v-3.334z" fill="url(#paint1_linear_1288_31969)"/><path d="M37.5 35.833h30.833v3.334H37.5v-3.334z" fill="url(#paint2_linear_1288_31969)"/><path fill="#76808F" d="M37.5 45.833h30.833v3.333H37.5zm0 6.667h30.833v3.333H37.5z"/><path d="M26.937 39.167a5.834 5.834 0 10-10.544 0h10.544z" fill="url(#paint3_linear_1288_31969)"/><path d="M21.735 42.5h-.14a5.414 5.414 0 00.14 0z" fill="url(#paint4_linear_1288_31969)"/><defs><linearGradient id="paint0_linear_1288_31969" x1="21.666" y1="45.833" x2="21.666" y2="55.833" gradientUnits="userSpaceOnUse"><stop stop-color="#929AA5"/><stop offset="1" stop-color="#76808F"/></linearGradient><linearGradient id="paint1_linear_1288_31969" x1="37.5" y1="32.5" x2="68.333" y2="32.5" gradientUnits="userSpaceOnUse"><stop stop-color="#F0B90B"/><stop offset="1" stop-color="#F8D33A"/></linearGradient><linearGradient id="paint2_linear_1288_31969" x1="37.5" y1="32.5" x2="68.333" y2="32.5" gradientUnits="userSpaceOnUse"><stop stop-color="#F0B90B"/><stop offset="1" stop-color="#F8D33A"/></linearGradient><linearGradient id="paint3_linear_1288_31969" x1="21.665" y1="30.834" x2="21.665" y2="42.501" gradientUnits="userSpaceOnUse"><stop stop-color="#F0B90B"/><stop offset="1" stop-color="#F8D33A"/></linearGradient><linearGradient id="paint4_linear_1288_31969" x1="21.665" y1="30.834" x2="21.665" y2="42.501" gradientUnits="userSpaceOnUse"><stop stop-color="#F0B90B"/><stop offset="1" stop-color="#F8D33A"/></linearGradient></defs></svg>
            </div>
            <div class="step-info">
              <h4>{{$t('reg_step2')}}</h4>
              <div class="step-tip">{{$t('step2_tip')}}</div>
            </div>
          </div>
          <div class="step-item">
            <div class="img-box">
              <svg width="80" height="80" fill="none" xmlns="http://www.w3.org/2000/svg"><circle r="19.583" transform="matrix(1 0 0 -1 51.25 28.75)" fill="url(#paint0_linear_1288_31983)"/><circle cx="51.25" cy="28.75" r="13.781" fill="#76808F"/><path d="M44.2 28.75l7.05-7.05 7.05 7.05-7.05 7.05-7.05-7.05z" fill="#929AA5"/><circle r="19.583" transform="matrix(1 0 0 -1 28.75 51.25)" fill="#F8D33A"/><circle transform="matrix(1 0 0 -1 28.75 51.25)" fill="url(#paint1_linear_1288_31983)" r="13.781"/><path d="M21.7 51.25l7.05 7.05 7.05-7.05-7.05-7.05-7.05 7.05z" fill="#F0B90B"/><path opacity=".2" d="M25.834 18.75l2.083-2.083 2.084 2.083-2.084 2.083-2.083-2.083zm25 37.916l3.333-3.333 3.334 3.334L54.167 60l-3.333-3.334zM5 39.167L6.667 37.5l1.666 1.667-1.666 1.666L5 39.167zM30 10H10v20l20-20zm20 60h20V50L50 70z" fill="#76808F"/><defs><linearGradient id="paint0_linear_1288_31983" x1="19.583" y1="0" x2="19.583" y2="39.167" gradientUnits="userSpaceOnUse"><stop stop-color="#929AA5"/><stop offset="1" stop-color="#76808F"/></linearGradient><linearGradient id="paint1_linear_1288_31983" x1="13.781" y1="0" x2="13.781" y2="27.562" gradientUnits="userSpaceOnUse"><stop stop-color="#F0B90B"/><stop offset="1" stop-color="#F8D33A"/></linearGradient></defs></svg>
            </div>
            <div class="step-info">
              <h4>{{$t('reg_step3')}}</h4>
              <div class="step-tip">{{$t('step3_tip')}}</div>
            </div>
          </div>
        </div>
        <div class="btm-box">
          <el-button size="large" type="primary" @click="showModal = false">{{$t('start_using')}}</el-button>
        </div>
      </div>
      <div class="main-img">
        <img src="/img/portfolio.png"/>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {computed, defineEmits, defineProps} from "vue";

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean],
}>()

const showModal = computed({
  get(){
    return props.modelValue
  },
  set(value){
    emit('update:modelValue', value)
  }
})
</script>

<style scoped lang="scss">
.guide-warp{
    position: absolute;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  background-color: rgba(0, 0, 0, .2);
  z-index: 100;
}
.guide-box{
  width: 700px;
  background-color: var(--klinecharts-pro-popover-background-color);
  box-shadow: 0 6px 12px 0 rgba(0, 0, 0, .3);
  border-radius: 4px;
  padding: 35px 50px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.main-head{
  h2{
    margin-top: 0;
  }
}
.guide-info{
  height: 450px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.step-box{
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  margin: 20px 0;
}
.step-item{
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  margin: 7px 0;
  .img-box{
    width: 80px;
    margin-right: 20px;
  }
}
.step-info{
  flex-grow: 1;
  h4{
    margin-top: 0;
    margin-bottom: 10px;
  }
  .step-tip{
    line-height: 1.7;
    font-size: 13px;
  }
}
.main-img{
  width: 300px;
  margin-left: 30px;
  img{
    width: 100%;
  }
}
</style>