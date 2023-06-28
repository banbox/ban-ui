# 项目介绍
本项目是banbot交易机器人的网站端**前台UI项目**，需要配合启动后端项目banweb  


# 技术架构
本项目使用[Next 3](https://nuxt.com/docs/getting-started/introduction)和[VUE 3](https://vuejs.org/guide/introduction.html)


# K线图
主要UI从[KLineChart Pro](https://pro.klinecharts.com/getting-started.html)改写(KLineChart Pro使用Solid-js，本项目改写为vue)  
K线UI工具栏可参考：[AICoin](https://www.aicoin.com/chart/okcoinfutures_btcquarter)  

# 其他注意
 **多语言i18n**  
不要使用nuxt官方的i18n模块，使用[这个](https://vue-i18n.intlify.dev/guide/integrations/nuxt3.html)  


# Nuxt 3 配置

### 安装项目
```bash
yarn install
```
### 开发模式运行
```bash
yarn dev
```
### 打包部署到生产环境
Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
