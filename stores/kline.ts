import {defineStore} from "pinia";
import {ref} from "#imports";
import {BanInd} from "~/composables/kline/coms";


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

  const local_mains = ['MA', 'EMA', 'SMA', 'BOLL', 'SAR', 'BBI']
  const local_subs = ['VOL', 'MACD', 'KDJ', 'RSI', 'BIAS', 'BRAR',
    'CCI', 'DMI', 'CR', 'PSY', 'DMA', 'TRIX', 'OBV', 'VR', 'WR', 'MTM', 'EMV',
    'SAR', 'ROC', 'PVT', 'AO']

  // 所有的指标列表
  const all_inds = reactive<BanInd[]>([])
  for(let name of local_mains){
    all_inds.push({name, title: name.toLowerCase(), cloud: false, is_main: true})
  }
  for(let name of local_subs){
    all_inds.push({name, title: name.toLowerCase(), cloud: false, is_main: false})
  }

  return {showLogin, showDrawBar, modalIndCfg, editPaneId, editIndName, authTFList, fireOhlcv,
      start_ms, stop_ms, fireKRange, all_inds}
})