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

export const useKlineStore = defineStore('kline', () => {
    const period = reactive<Period>(defaults.period)
    const symbol = reactive<SymbolInfo>(defaults.symbol)
    const chartStyle = reactive(defStyle)
    const mainInds = ref<string>('')
    const subInds = ref<string>('VOL')
    const showRight = ref(true)

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
    function setInd(is_main: boolean, ind_name: string, is_add: boolean) {
        const pane = is_main ? mainInds : subInds;
        const old_idx = pane.value.indexOf(ind_name);
        if (is_add && old_idx < 0) {
            if (pane.value) {
                pane.value += ','
            }
            pane.value += ind_name
        } else if (!is_add && old_idx >= 0) {
            let result = ''
            if (old_idx > 0) {
                result = pane.value.substring(0, old_idx - 1)
            }
            result += pane.value.substring(old_idx + ind_name.length)
            pane.value = result
        }
    }
    return {period, symbol, chartStyle, mainInds, subInds, showRight,
        setPeriod, setTimeframe, setSymbol, setSymbolTicker,
        setStyleItem, resetStyle, setInd}
}, {
    persist: {
        storage: persistedState.localStorage
    }
})