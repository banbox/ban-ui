import {defineStore} from "pinia";
import {persistedState, ref} from "#imports";
import {PaneInds, Period, SymbolInfo} from "~/components/kline/types";
import {periodMap} from "~/composables/kline/coms";
import {reactive, toRaw} from "vue";
import _ from "lodash";
import {getDefaults} from "~/config";

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
    const save_inds = reactive<SaveInd[]>([
        {name: 'VOL', pane_id: 'pane_VOL'}
    ])
    const showRight = ref(true)
    const dt_start = ref('20230801')
    const dt_stop = ref('20230820')

    function setPeriod(val: Period){
        Object.assign(period, val)
    }
    function setTimeframe(timeframe: string){
        const val = periodMap[timeframe]
        if(!val){
            throw Error(`unsupport timeframe: ${timeframe}`)
        }
        Object.assign(period, val)
    }
    function setSymbol(val: SymbolInfo){
        Object.assign(symbol, val)
    }
    function setSymbolTicker(ticker: string){
        Object.assign(symbol, {
            ...symbol,
            ticker: ticker,
            name: ticker,
            shortName: ticker
        })
    }
    function setStyleItem(key: string, val: any){
        _.set(chartStyle, key, val)
    }
    function resetStyle(){
        Object.assign(chartStyle, defStyle)
    }

    function removeInd(paneId: string, name?: string) {
        const mat_idx = save_inds.findIndex(d =>
          d.pane_id == paneId && (!name || d.name == name))
        if(mat_idx < 0)return
        save_inds.splice(mat_idx, 1)
    }
    return {period, symbol, chartStyle, save_inds, showRight, dt_start, dt_stop,
        setPeriod, setTimeframe, setSymbol, setSymbolTicker,
        setStyleItem, resetStyle, removeInd}
}, {
    persist: {
        storage: persistedState.localStorage
    }
})