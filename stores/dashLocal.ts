import {defineStore} from "pinia";
import {persistedState, ref} from "#imports";
import {type TradeBot} from "~/composables/dash/types"


export const useDashLocal = defineStore('dashLocal', () => {
  const cur_id = ref(-1)
  const all_bots = ref<TradeBot[]>([])

  const bot = computed(() => {
    return all_bots.value[cur_id.value] ?? {
      url: '',
      account: '',
      password: '',
      auto_refresh: false
    }
  })
  return {cur_id, all_bots, bot}
}, {
  persist: {
      storage: persistedState.localStorage
  }
})