import {Period, SymbolInfo} from "~/components/kline/types";

export const getDefaults = () => {
  return {
    symbol: {shortName: 'BTC/USDT.P', ticker: 'BTC/USDT.P', exchange: 'binance'} as SymbolInfo,
    period: { multiplier: 3, timespan: 'day', text: '3D', timeframe: '3d' } as Period
  }
}