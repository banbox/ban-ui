<template>
  <MHeader/>
  <MPopup v-model="showContact" :title="$t('contact-us')" :tip_msg="$t('contact-tip')">
    <div class="cont-item">
      <div class="li-left">
        <div class="icon">
          <svg width="10.2vw" height="10.2vw" t="1689686419294" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1837"><path d="M862.805333 0c59.989333 0 108.373333 48.512 111.232 105.6V1024l-114.218666-96.981333-62.72-57.088-68.437334-59.648 28.586667 94.08H158.293333c-59.818667 0-108.373333-45.44-108.373333-105.642667V105.813333C49.92 48.725333 98.56 0.128 158.506667 0.128h704L862.805333 0z m-261.034666 242.474667h-1.28l-8.618667 8.533333c88.448 25.6 131.242667 65.578667 131.242667 65.578667-57.002667-28.501333-108.373333-42.752-159.744-48.512-37.12-5.76-74.24-2.730667-105.6 0h-8.533334c-20.053333 0-62.72 8.533333-119.893333 31.36-19.925333 8.661333-31.36 14.336-31.36 14.336s42.752-42.752 136.96-65.578667l-5.76-5.76s-71.338667-2.730667-148.352 54.186667c0 0-77.013333 134.144-77.013333 299.52 0 0 42.666667 74.24 159.701333 77.056 0 0 17.066667-22.741333 34.346667-42.752-65.706667-19.968-91.306667-59.904-91.306667-59.904s5.717333 2.816 14.293333 8.533333h2.56c1.28 0 1.877333 0.64 2.56 1.28v0.256c0.682667 0.682667 1.28 1.28 2.56 1.28 14.08 5.802667 28.16 11.52 39.68 17.066667a349.013333 349.013333 0 0 0 76.8 22.869333c39.68 5.76 85.162667 8.533333 136.96 0 25.6-5.76 51.2-11.392 76.8-22.826667 16.64-8.533333 37.12-17.066667 59.605334-31.445333 0 0-25.6 39.936-94.08 59.904 14.08 19.882667 33.92 42.666667 33.92 42.666667 117.077333-2.56 162.56-76.8 165.12-73.642667 0-165.12-77.44-299.52-77.44-299.52-69.76-51.797333-135.04-53.76-146.56-53.76l2.389333-0.853333z m7.168 188.288c29.994667 0 54.186667 25.6 54.186666 56.96 0 31.573333-24.32 57.173333-54.186666 57.173333-29.866667 0-54.186667-25.6-54.186667-56.917333 0.085333-31.573333 24.448-57.088 54.186667-57.088z m-193.834667 0c29.866667 0 54.016 25.6 54.016 56.96 0 31.573333-24.32 57.173333-54.186667 57.173333-29.866667 0-54.186667-25.6-54.186666-56.917333 0-31.573333 24.32-57.088 54.186666-57.088z" fill="" p-id="1838"></path></svg>
        </div>
        <div class="content">
          <div class="h5">{{$t('discord_offical')}}</div>
          <a class="subtext" target="_blank" :href="discord_link">digochain group</a>
        </div>
      </div>
      <a target="_blank" class="btn" :href="discord_link">{{$t('go_to')}}</a>
    </div>
  </MPopup>
  <MPopup v-model="showPcModal" :title="$t('how_open_pc')" :tip_msg="$t('open_in_pc_tip')">
    <div class="down-box">
      <div class="link">www.digochain.com/kline</div>
      <div class="main-btn" @click="setClipboard(pc_url)">{{$t('copy_link_open_pc')}}</div>
    </div>
  </MPopup>
  <div class="top-h1">{{$t('m_best_tool')}}</div>
  <div class="main-trade">
    <div class="bg">
      <div class="img-box">
        <img :src="'/img/main-img.png'"/>
      </div>
      <div class="text-box">
        <div class="h3">{{$t('smart_money')}}</div>
        <div class="h3-info">{{$t('why_good')}}</div>
      </div>
      <div class="coin-icon">
        <svg width="16vw" height="16vw" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><defs><linearGradient x1="106.474%" y1="49.099%" x2="22.751%" y2="118.095%" id="icon-bitcoin_svg__a"><stop stop-color="#F8A500" offset="0%"></stop><stop stop-color="#FFD44F" offset="26.1%"></stop><stop stop-color="#F8A500" offset="46.04%"></stop><stop stop-color="#FFD44F" offset="64.51%"></stop><stop stop-color="#FFA607" offset="100%"></stop></linearGradient><linearGradient x1="28.378%" y1="14.29%" x2="41.174%" y2="126.628%" id="icon-bitcoin_svg__b"><stop stop-color="#FFD44F" offset=".289%"></stop><stop stop-color="#FFA607" offset="100%"></stop></linearGradient><linearGradient x1="-.944%" y1="50.058%" x2="101.111%" y2="50.058%" id="icon-bitcoin_svg__c"><stop stop-color="#FFA607" offset="0%"></stop><stop stop-color="#FFD44F" offset="100%"></stop></linearGradient></defs><g fill="none" fill-rule="evenodd"><path d="M109.87 36.62l.13-17.011-5.953.515h-4.659c-20.317-10.567-60.435-9.15-83.34 1.419L.128 25.408 0 41.646v1.03c.518 8.377 12.553 15.722 32.612 18.3 39.342 5.155 77-9.665 77.259-24.357z" fill="url(#icon-bitcoin_svg__a)" fill-rule="nonzero" transform="translate(6 29)"></path><path d="M32.62 44.577C4.88 40.928-7.564 28.157 4.75 16.167c17.759-17.333 72.72-21.893 96.311-7.95 29.166 16.941-18.147 43.006-68.442 36.36z" fill="url(#icon-bitcoin_svg__b)" fill-rule="nonzero" transform="translate(6 29)"></path><path d="M97.521 28.898c-1.828 1.648-3.585 2.942-5.272 3.882l-.531-.937.601.895-.019.012c-.55.364-1.017.64-1.398.83l-.485-.962.546.929c-1.273.737-3.1 1.577-5.477 2.52l-.03.012-.03.01c-.235.077-.6.219-1.097.424-.544.225-.96.384-1.244.479l-.343-1.02.368 1.01c-4.709 1.686-9.934 2.993-15.676 3.921l-.02.004-1.615.2-1.527.188-.134-1.067.165 1.062c-1.158.177-2.965.352-5.422.526-7.321.548-14.334.373-21.038-.523-5.587-.74-10.457-1.907-14.612-3.5-4.09-1.57-7.23-3.45-9.416-5.645-2.305-2.312-3.396-4.799-3.274-7.46.125-2.716 1.519-5.36 4.183-7.933 2.555-2.467 6.078-4.67 10.571-6.609 4.29-1.85 9.178-3.343 14.667-4.477 5.471-1.13 11.12-1.817 16.947-2.061 6.034-.253 11.83-.012 17.39.725 8.302 1.08 14.9 3.062 19.795 5.947 4.383 2.484 6.9 5.395 7.551 8.734.666 3.415-.705 6.706-4.112 9.873l-.012.011zm-1.47-1.58c2.825-2.626 3.98-5.258 3.466-7.896-.525-2.693-2.702-5.124-6.53-7.294-4.64-2.734-10.965-4.622-18.976-5.664-5.434-.72-11.104-.956-17.01-.709-5.71.24-11.242.913-16.597 2.019-5.343 1.103-10.09 2.551-14.244 4.343-4.25 1.835-7.558 3.894-9.924 6.178-2.254 2.178-3.43 4.341-3.53 6.49-.093 2.035.79 3.986 2.65 5.852 1.97 1.976 4.855 3.693 8.657 5.15 3.995 1.533 8.701 2.658 14.12 3.376 6.553.876 13.418 1.046 20.594.509 2.398-.17 4.147-.339 5.246-.506l.016-.003 1.542-.19 1.595-.197.134 1.067-.175-1.061c5.61-.907 10.706-2.18 15.289-3.821l.012-.005.013-.004c.235-.077.6-.219 1.097-.424.544-.225.96-.384 1.244-.479l.343 1.02-.403-.998c2.28-.904 4.01-1.698 5.191-2.38l.03-.018.031-.016c.301-.15.69-.381 1.166-.696l.019-.012.034-.023.036-.02c1.544-.86 3.17-2.06 4.876-3.598l-.012.01z" fill="url(#icon-bitcoin_svg__c)" fill-rule="nonzero" transform="translate(6 29)"></path><path d="M46.576 62.544c1.664.13 3.33.13 5.121.261.64-1.176 1.28-2.483 1.664-3.66 1.28 0 2.562.13 3.842.13-.64 1.177-1.152 2.354-1.794 3.53 1.666 0 3.202.131 4.738.131.64-1.438 1.153-2.353 1.665-3.399.128-.261.256-.261.64-.261 2.56.13 4.994 0 7.554-.262 2.176-.261 4.097-.653 5.633-1.308 1.28-.523 2.176-1.177 2.818-1.961.512-.654.896-1.438.768-2.092-.512-1.83-4.098-2.353-5.378-2.614.896-.262 2.048-.392 3.2-.915 1.666-.655 2.306-1.44 2.562-2.355.896-2.614-3.586-3.53-9.22-4.052-.383 0-.511-.131-.383-.262.128-.13 1.664-3.139 1.792-3.53-1.664 0-3.2-.132-4.736-.132-.514 1.31-1.154 2.486-1.794 3.662-1.28 0-2.56-.13-3.84-.13.512-1.308 1.152-2.486 1.792-3.662-1.792 0-3.457 0-5.121-.131-.384.784-1.408 2.747-1.792 3.531-.128.261-.128.261-.77.261-3.456-.13-7.041-.261-8.833-.392-.256.654-.64 1.438-1.024 2.092 1.28 0 2.304.13 3.456.13 1.537.131 2.69.393 2.177 1.308-1.537 3.007-2.945 5.884-4.481 8.89-.256.524-.64.654-2.304.654-1.026 0-1.922-.13-2.946-.13-.384 0-.512 0-.64.13-.512.523-.64.654-2.176 2.355 3.2.13 6.402.261 9.602.523-.512 1.307-1.152 2.483-1.792 3.66zm13.699-16.605c-.64 1.438-1.408 2.745-2.048 4.054 1.792.13 5.633.13 7.425 0 5.378-.394 5.762-2.747 2.946-3.4-2.69-.523-5.89-.523-8.323-.654zm-3.2 6.276c-.768 1.438-1.538 3.007-2.306 4.576l1.377.035c4.367.114 6.843.178 9.634-.297 1.666-.261 2.69-.784 3.202-1.438.512-.784.128-1.438-1.152-1.83-2.434-.915-7.683-1.046-10.627-1.046 0-.06 0-.091-.012-.097-.015-.007-.046.026-.116.097z" fill="#FFF"></path></g></svg>
      </div>
    </div>
  </div>
  <div class="fix-btm">
    <div class="main-btn" @click="showPcModal = true">
      <svg width="6.26vw" height="6.26vw" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 47 47"><path d="M41.159 6H5.835C4.275 6 3 7.3 3 8.89v21.623c0 1.59 1.275 2.89 2.835 2.89H22.32a1.68 1.68 0 00-.251.204l-5.324 5.421h-3.809c-.802 0-1.457.668-1.457 1.486S12.133 42 12.935 42h21.66c.802 0 1.457-.668 1.457-1.486s-.655-1.486-1.458-1.486h-5.141l-5.261-5.37a1.172 1.172 0 00-.307-.267h17.28c1.56 0 2.835-1.3 2.835-2.89V8.891C43.994 7.3 42.719 6 41.159 6z" fill="#FFF" fill-rule="nonzero"></path></svg>
      <span>{{$t('pc')}}</span>
    </div>
    <div class="main-btn" @click="showContact = true">
      <svg width="6.26vw" height="6.26vw" xmlns="http://www.w3.org/2000/svg" class="CommonNavHeaderH5_header_icon_active__1lkII" viewBox="0 0 30 30"><g fill="#ffffff" fill-rule="nonzero"><path d="M15.294 28.242a1.152 1.152 0 010-2.304c3.894 0 7.47-2.185 9.336-5.7a1.152 1.152 0 112.035 1.08c-2.266 4.27-6.622 6.924-11.37 6.924zm11.777-12.07a1.152 1.152 0 01-1.152-1.151c0-6.02-4.766-10.917-10.625-10.917-5.858 0-10.623 4.897-10.623 10.917a1.152 1.152 0 01-2.304 0c0-7.29 5.8-13.221 12.928-13.221 7.128 0 12.928 5.93 12.928 13.22 0 .637-.516 1.153-1.152 1.153z"></path><path d="M3.518 22.207A2.922 2.922 0 01.6 19.29v-2.502a2.922 2.922 0 012.918-2.918c1.61 0 2.919 1.309 2.919 2.918v2.502a2.922 2.922 0 01-2.919 2.918zm0-6.034a.615.615 0 00-.614.614v2.501a.615.615 0 001.229 0v-2.501a.615.615 0 00-.615-.614zM12.94 27.09c0-.667.54-1.207 1.207-1.207h2.297a1.207 1.207 0 110 2.414h-2.297c-.666 0-1.207-.54-1.207-1.207zm13.543-4.883a2.922 2.922 0 01-2.919-2.918v-2.502a2.922 2.922 0 012.919-2.918c1.609 0 2.918 1.309 2.918 2.918v2.502a2.922 2.922 0 01-2.918 2.918zm0-6.034a.615.615 0 00-.615.614v2.501a.615.615 0 001.229 0v-2.501a.615.615 0 00-.614-.614zM15.294 20.397c-1.79 0-3.43-.58-4.39-1.55a1.152 1.152 0 111.64-1.619c.394.4 1.351.865 2.75.865 1.4 0 2.357-.466 2.751-.865a1.152 1.152 0 111.64 1.62c-.96.97-2.6 1.55-4.39 1.55z"></path></g></svg>
      <span>{{$t('kf')}}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {ref} from "vue";
import i18n from "~/composables/i18n";
const t = i18n.global.t

const showContact = ref(false)
const showPcModal = ref(false)
const discord_link = ref('https://discord.gg/KzEjgHCa')
const pc_url = ref('www.digochain.com/kline')

function setClipboard(text: string){
  if (!navigator.clipboard) {
    alert(t('copy_not_support'));
  } else {
    // 调用writeText方法将文本内容复制到剪贴板
    navigator.clipboard.writeText(text)
      .then(function() {
        alert(t('copy_success'));
      })
      .catch(function(err) {
        console.error("set clipboard fail:", err);
        alert(t('copy_fail'));
      });
  }
}

</script>

<style lang="scss">
@import "~/assets/klinebase.scss";
@import '~/assets/klinefont.css';
body{
  margin: 0;
  min-height: 100vh;
}
#__nuxt {
  --klinecharts-pro-primary-color: #{$c-primary};
  --klinecharts-pro-hover-background-color: #{$c-hover-background-light};
  --klinecharts-pro-background-color: #{$c-background-light};
  --klinecharts-pro-popover-background-color: #{$c-popover-background-light};
  --klinecharts-pro-text-color: #{$c-text-light};
  --klinecharts-pro-text-second-color: #{$c-text-second-light};
  --klinecharts-pro-border-color: #{$c-border-light};
  --klinecharts-pro-selected-color: fade(#{ $c-primary }, 15%);

  &[data-theme="dark"] {
    --klinecharts-pro-hover-background-color: #{$c-hover-background-dark};
    --klinecharts-pro-background-color: #{$c-background-dark};
    --klinecharts-pro-popover-background-color: #{$c-popover-background-dark};
    --klinecharts-pro-text-color: #{$c-text-dark};
    --klinecharts-pro-text-second-color: #{$c-text-second-dark};
    --klinecharts-pro-border-color: #{$c-border-dark};
  }
}
.header{
  padding: 10px 10px 0;
}

.cont-item{
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5.3333333333vw 4.1333333333vw 7.4666666667vw 4vw;
  .li-left{
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    width: 53.3333333333vw;
    .content{
      width: auto;
      margin-left: 5.3333333333vw;
      .h5{
        font-size: 4vw;
        line-height: 5.6vw;
      }
      .subtext{
        height: 5.3333333333vw;
        font-size: 3.7333333333vw;
        line-height: 5.3333333333vw;
        color: #656472;
        text-decoration: underline;
      }
    }
  }
  .btn{
    display: flex;
    align-items: center;
    justify-content: center;
    width: 22.6666666667vw;
    height: 9.8666666667vw;
    background: #1061ff;
    border-radius: 5.0666666667vw;
    font-family: PingFangSC-Regular,PingFang SC,sans-serif;
    font-size: 4vw;
    font-weight: 400;
    line-height: 5.6vw;
    color: #fff;
  }
}

.down-box{
  height: auto;
  padding: 2.9333333333vw 9.3333333333vw 12vw;
  .link{
    width: auto;
    height: 7.4666666667vw;
    margin: 0 7.3333333333vw 6vw;
    font-family: PingFangSC-Regular,PingFang SC,sans-serif;
    font-size: 5.3333333333vw;
    font-weight: 400;
    line-height: 7.4666666667vw;
    color: #1061ff;
  }
  .main-btn{
    width: auto;
    font-family: PingFangSC-Regular,PingFang SC,sans-serif;
    font-size: 5.0666666667vw;
    font-weight: 400;
    line-height: 7.0666666667vw;
    color: #fff;
    text-align: center;
  }
}

.top-h1{
  margin-top: 5vw;
  padding: 8.53vw 6vw 10.66vw;
  line-height: 11.2vw;
  text-align: center;
  white-space: pre-line;
  font-family: PingFangSC-Semibold,PingFang SC,sans-serif;
  font-size: 8vw;
  font-weight: 600;
  color: #121127;
}
.main-trade{
  padding: 15.8666666667vw 4vw 13.3333333333vw;
  .bg{
    position: relative;
    width: 92vw;
    height: 80vw;
    background: linear-gradient(135deg,#57c1f2,#561dd5);
    border-radius: 6.6666666667vw;
    .img-box{
      position: absolute;
      top: -19.8666666667vw;
      left: -3.2vw;
      width: 92vw;
      height: 59.7333333333vw;
      img{
        width: 0px;
        height: 0px;
        min-width: 100%;
        max-width: 100%;
        min-height: 100%;
        max-height: 100%;
      }
    }
    .text-box{
      display: flex;
      flex-direction: column;
      padding: 48.0666666667vw 13.3333333333vw 12.4vw 6.6666666667vw;
      color: #fff;
      .h3{
        display: flex;
        align-items: center;
        width: auto;
        height: 10.4vw;
        margin-bottom: 2.6666666667vw;
        font-family: PingFangSC-Semibold,PingFang SC,sans-serif;
        font-size: 7.4666666667vw;
        font-weight: 600;
        line-height: 10.4vw;
      }
      .h3-info{
        width: auto;
        height: 5.6vw;
        font-size: 4vw;
        line-height: 5.6vw;
        font-family: PingFangSC-Regular,PingFang SC,sans-serif;
        font-weight: 400;
      }
    }
    .coin-icon{
      position: absolute;
      right: 5.3333333333vw;
      bottom: -8.2666666667vw;
      width: 16vw;
      height: 16vw;
    }
  }
}
.main-btn{
  display: flex;
  align-items: center;
  justify-content: center;
  height: 13.3333333333vw;
  color: #fff;
  background: #1061ff;
  border-radius: 6.6666666667vw;
}
.fix-btm{
  position: fixed;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: 100%;
  height: 20vw;
  background: #fff;
  background-color: transparent;
  .main-btn{
    width: 44vw;
    height: 13.3333333333vw;
    span{
      margin-left: 2.53vw;
    }
  }
}
</style>