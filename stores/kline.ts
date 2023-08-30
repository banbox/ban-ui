import {defineStore} from "pinia";
import {ref} from "#imports";


export const useKlineStore = defineStore('kline', () => {
  const showLogin = ref(false)
  const showDrawBar = ref(true)
  const modalIndCfg = ref(false)
  const editPaneId = ref('')
  const editIndName = ref('')
  const authTFList = reactive(['1m', '5m', '15m', '1h', '2h', '4h', '1d'])
  // 触发K线数据加载。
  const fireOhlcv = ref(1)
  const start_ms = ref(0)
  const stop_ms = ref(0)
  // 触发用户设置K线范围
  const fireKRange = ref(1)
  return {showLogin, showDrawBar, modalIndCfg, editPaneId, editIndName, authTFList, fireOhlcv,
      start_ms, stop_ms, fireKRange}
})