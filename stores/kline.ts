import {defineStore} from "pinia";
import {ref} from "#imports";


export const useKlineStore = defineStore('kline', () => {
  const showLogin = ref(false)
  const showDrawBar = ref(true)
  const modalIndCfg = ref(false)
  const editPaneId = ref('')
  const editIndName = ref('')
  const authTFList = reactive(['1m', '5m', '15m', '1h', '2h', '4h', '1d'])
  const version = ref(1)
  return {showLogin, showDrawBar, modalIndCfg, editPaneId, editIndName, authTFList, version}
})