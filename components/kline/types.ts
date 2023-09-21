
import {KLineData, Styles, DeepPartial, OverlayCreate} from 'klinecharts'

export interface SymbolInfo {
  ticker: string
  name?: string
  shortName?: string
  exchange?: string
  market?: string
  pricePrecision?: number
  volumePrecision?: number
  priceCurrency?: string
  type?: string
  logo?: string
}

export interface Period {
  multiplier: number
  timespan: string
  text: string
  timeframe: string
}

export type PaneInds = {
  name: string,
  inds: string[]
}

export type KData = {
  data: KLineData[],
  lays?: any[]
}

export type DatafeedWatchCallback = (data: any) => void

export type GetKlineArgs = {
  symbol: SymbolInfo,
  period: Period,
  from: number,
  to: number,
  strategy?: string
}

export interface Datafeed {
  getSymbols (): Promise<SymbolInfo[]>
  getHistoryKLineData (args: GetKlineArgs): Promise<KData>
  subscribe (symbol: SymbolInfo, callback: DatafeedWatchCallback): void
  unsubscribe (symbol: SymbolInfo): void
}

export interface ChartProOptions {
  container: string | HTMLElement
  styles?: DeepPartial<Styles>
  watermark?: string | Node
  theme?: string
  locale?: string
  drawingBarVisible?: boolean
  symbol: SymbolInfo
  period: Period
  periods?: Period[]
  timezone?: string
  mainIndicators?: string[]
  subIndicators?: string[]
  datafeed: Datafeed
}

export interface ChartPro {
  setTheme(theme: string): void
  getTheme(): string
  setStyles(styles: DeepPartial<Styles>): void
  getStyles(): Styles
  setLocale(locale: string): void
  getLocale(): string
  setTimezone(timezone: string): void
  getTimezone(): string
  setSymbol(symbol: SymbolInfo): void
  getSymbol(): SymbolInfo
  setPeriod(period: Period): void
  getPeriod(): Period
}
