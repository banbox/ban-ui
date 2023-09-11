# 项目介绍
本项目是banbot交易机器人的网站端**前台UI项目**，需要配合启动后端项目banweb  


# 技术架构
本项目使用[Nuxt 3](https://nuxt.com/docs/getting-started/introduction)和[VUE 3](https://vuejs.org/guide/introduction.html)


# K线图
主要UI从[KLineChart Pro](https://pro.klinecharts.com/getting-started.html)改写(KLineChart Pro使用Solid-js，本项目改写为vue)  
K线UI工具栏可参考：[AICoin](https://www.aicoin.com/chart/okcoinfutures_btcquarter)  

# 其他注意
 **多语言i18n**  
[官方文档](https://v8.i18n.nuxtjs.org/)  
目前已知无法根据识别的语言自动跳转，等待i18n更新  
**pinia持久化**  
如果使用`localStorage`时，应注意在component使用`state`时应在`onMounted`中访问，不要直接访问，否则部分内容不会被正确地响应式更新。  
使用@pinia-plugin-persistedstate/nuxt持久化到localStorage时，如果使用reactive以及array.splice，saved_inds在打开页面时不会被正确恢复。
写了个demo测试是正常的，插件官方之前提过类似issue，但状态是已解决。目前暂时使用ref方式引用  
**数据源不同导致Hydration text content mismatch**  
使用固定值初始化，然后浏览器端在onMounted中读取最新值更新。  
**watch与watchEffect**  
尽量使用watch，显示指定依赖。极端情况下，watchEffect收集了不希望监听的依赖，自身执行又会导致依赖对象改变，造成无限循环。  
**导出组件中的函数供父组件调用**  
使用`defineExpose`

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
编译项目到`.output`文件夹：
```shell
yarn build
```
压缩`.output`文件夹到`.output.zip`  
通过`winscp`将`.output.zip`上传到服务器的`/root/ban-ui`目录下  
解压缩得到`.output`文件夹：`unzip -o .output.zip`  
docker启动nodejs：  
```shell
docker rm -f banui || true
docker run -d -it --name banui -v /root:/root -p 3000:3000 banuibase /bin/bash /root/ban-ui/run_server.sh
```
### banuibase基础镜像的构建
```dockerfile
FROM node:18.17.0
RUN apt update
RUN apt install supervisor
```
