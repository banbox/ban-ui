import {defineStore} from "pinia";
import {persistedState, ref} from "#imports";
import {type Period, type SymbolInfo} from "~/components/kline/types";
import {reactive} from "vue";
import _ from "lodash";
import {getDefaults} from "~/config";
import {makePeriod} from "~/composables/kline/coms";
import {useKlineStore} from "~/stores/kline";


const defaults = getDefaults();
const defStyle = {
    candle: {
        type: 'candle_solid',
        priceMark: {
            last:{
                show: true
            },
            high:{
                show: true
            },
            low: {
                show: true
            }
        }
    },
    indicator: {
        lastValueMark: {
            show: false
        }
    },
    yAxis: {
        type: 'normal',
        reverse: false
    },
    grid: {
        show: true
    }
}

type SaveInd = {
    name: string,
    pane_id: string
    params?: any[]
}

export const useKlineLocal = defineStore('klocal', () => {
    const period = reactive<Period>(defaults.period)
    const symbol = reactive<SymbolInfo>(defaults.symbol)
    const chartStyle = reactive(defStyle)
    const save_inds = ref<SaveInd[]>([
        {name: 'VOL', pane_id: 'pane_VOL'}
    ])
    const showRight = ref(true)
    const dt_start = ref('20230801')
    const dt_stop = ref('20230820')
    const timezone = ref(Intl.DateTimeFormat().resolvedOptions().timeZone)
    const theme = ref('light')

    const store = useKlineStore()

    function setPeriod(val: Period){
        Object.assign(period, val)
    }
    function setTimeframe(timeframe: string){
        Object.assign(period, makePeriod(timeframe))
    }
    function setSymbol(val: SymbolInfo){
        Object.assign(symbol, val)
    }
    function setSymbolTicker(ticker: string, exchange: string|undefined|null = undefined, raise_err: boolean = true) {
        if (!exchange) {
            exchange = symbol.exchange
        }
        const mats = store.all_symbols.filter(
          s => s.exchange == exchange && (s.ticker == ticker || s.shortName == ticker))
        if (mats.length > 0) {
            Object.assign(symbol, mats[0])
        } else if(raise_err) {
            throw new Error(`no match found: ${exchange}.${ticker}, in ${store.all_symbols.length} symbols`)
        }
    }
    function setStyleItem(key: string, val: any){
        _.set(chartStyle, key, val)
    }
    function resetStyle(){
        Object.assign(chartStyle, defStyle)
    }

    function removeInd(paneId: string, name?: string) {
        const mat_idx = save_inds.value.findIndex((d: any) =>
          d.pane_id == paneId && (!name || d.name == name))
        if(mat_idx < 0)return
        save_inds.value.splice(mat_idx, 1)
    }
    return {period, symbol, chartStyle, save_inds, showRight, dt_start, dt_stop,
        timezone, theme, setPeriod, setTimeframe, setSymbol, setSymbolTicker,
        setStyleItem, resetStyle, removeInd}
}, {
    persist: {
        storage: persistedState.localStorage,
        // beforeRestore({store}){
        //     console.log('before restore', toRaw(store))
        // },
        // afterRestore({store}){
        //     console.log('after restore', toRaw(store))
        // },
        // debug: true
    }
})