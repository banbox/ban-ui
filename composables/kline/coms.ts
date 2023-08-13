import {Datafeed, Period, SymbolInfo} from "~/components/kline/types";
import {CandleTooltipCustomCallbackData, CandleStyle} from "klinecharts";
import kc from "klinecharts";
import * as dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import timezone from "dayjs/plugin/timezone"
dayjs.extend(utc)
dayjs.extend(timezone)
export const formatPrecision = kc.utils.formatPrecision
export const formatThousands = kc.utils.formatThousands
export const formatDate = kc.utils.formatDate
export const formatBigNumber = kc.utils.formatBigNumber
const FormatDateType = kc.FormatDateType
const TooltipIconPosition = kc.TooltipIconPosition
export const AllPeriods: Period[] = [
  { multiplier: 1, timespan: 'minute', text: '1m', timeframe: '1m' },
  { multiplier: 5, timespan: 'minute', text: '5m', timeframe: '5m' },
  { multiplier: 15, timespan: 'minute', text: '15m', timeframe: '15m' },
  { multiplier: 1, timespan: 'hour', text: '1H', timeframe: '1h' },
  { multiplier: 2, timespan: 'hour', text: '2H', timeframe: '2h' },
  { multiplier: 4, timespan: 'hour', text: '4H', timeframe: '4h' },
  { multiplier: 1, timespan: 'day', text: 'D', timeframe: '1d' },
  { multiplier: 3, timespan: 'day', text: '3D', timeframe: '3d' },
  { multiplier: 1, timespan: 'week', text: 'W', timeframe: '1w' },
]
export const periodMap = Object.fromEntries(AllPeriods.map(obj => [obj.timeframe, obj]))

export type AddDelInd = {
  is_main: boolean,
  ind_name: string,
  is_add: boolean
}

export function GetNumberDotOffset(value: number){
  value = Math.abs(value)
  if(value >= 1)return 0
  let count = 0;
  while (value < 1){
    value = value * 10;
    count += 1;
  }
  return count;
}

function buildDateTimeFormat (timezone?: string): Intl.DateTimeFormat | null {
  const options: Intl.DateTimeFormatOptions = {
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }
  if (timezone !== undefined) {
    options.timeZone = timezone
  }
  let dateTimeFormat: Intl.DateTimeFormat | null = null
  try {
    dateTimeFormat = new Intl.DateTimeFormat('en', options)
  } catch (e) {
    console.error('', '', 'Timezone is error!!!')
  }
  return dateTimeFormat
}

const dateTimeFormat = buildDateTimeFormat()
export type Translate = (input: string) => string;

function makeCandleTooltipCustom(t: Translate) {
  function CandleTooltipCustom(data: CandleTooltipCustomCallbackData, styles: CandleStyle) {
    const defVal = styles.tooltip.defaultValue
    const current = data.current
    const prevClose = data.prev?.close ?? current.close
    const changeValue = current.close - prevClose
    const thousandsSeparator = ','
    const clow = data.current.low
    const minProce = Math.min(clow, data.prev?.low ?? clow, data.next?.low ?? clow)
    const pricePrecision = GetNumberDotOffset(minProce) + 2
    const volumePrecision = 3

    const volPrecision = formatPrecision(current.volume ?? defVal, volumePrecision)
    const volume = formatThousands(formatBigNumber(volPrecision), thousandsSeparator)
    const change = prevClose === 0 ? defVal : `${formatPrecision(changeValue / prevClose * 100)}%`
    return [
      {title: t('time_'), value: formatDate(dateTimeFormat!, current.timestamp, 'YYYY-MM-DD HH:mm')},
      {title: t('open_'), value: formatThousands(formatPrecision(current.open, pricePrecision), thousandsSeparator)},
      {title: t('high_'), value: formatThousands(formatPrecision(current.high, pricePrecision), thousandsSeparator)},
      {title: t('low_'), value: formatThousands(formatPrecision(current.low, pricePrecision), thousandsSeparator)},
      {title: t('close_'), value: formatThousands(formatPrecision(current.close, pricePrecision), thousandsSeparator)},
      {title: t('volume_'), value: volume},
      {title: t('change_'), value: change}
    ]
  }
  return CandleTooltipCustom
}

export function getDefStyles(t: Translate) {
  return {
    candle: {
      tooltip: {
        custom: makeCandleTooltipCustom(t)
      }
    },
  }
}

/**
 * 将字符串的时间转为13位时间戳
 * @param date_str 10位/13位时间戳、YYYYMMDD YYYYMMDDHHmm YYYYMMDDHHmmss
 */
export function getTimestamp(date_str: string): number{
  if(!date_str)return 0
  date_str = date_str.trim();
  const isNumOnly = /^\d+$/.test(date_str);
  let result: dayjs.Dayjs | null = null
  if(isNumOnly){
    // 是纯数字
    const numLen = date_str.length;
    if(numLen == 4){
      result = dayjs.utc(date_str, 'MMdd')
    }
    else if(numLen == 6){
      result = dayjs.utc(date_str, 'YYMMdd')
    }
    else if(numLen == 8){
      result = dayjs.utc(date_str, 'YYYYMMdd')
    }
    else if(numLen == 10){
      // 秒时间戳
      result = dayjs.unix(parseInt(date_str))
    }
    else if(numLen == 12){
      result = dayjs.utc(date_str, 'YYYYMMddHHmm')
    }
    else if(numLen == 13){
      // 毫秒时间戳
      result = dayjs(parseInt(date_str))
    }
    else if(numLen == 14){
      result = dayjs.utc(date_str, 'YYYYMMddHHmmss')
    }
    else{
      console.error('invalid date format:', date_str)
      return 0;
    }
  }
  else{
    result = dayjs(date_str, ['YYYY/MM/dd', 'YYYY/MM/dd HH:mm', 'YYYY/MM/dd HH:mm:ss',
      'YYYY-MM-dd', 'YYYY-MM-dd HH:mm', 'YYYY-MM-dd HH:mm:ss']).tz('UTC', true)
  }
  if(!result)return 0
  return result.valueOf()
}

export function getDateStr(date_ts: number): string{
  if(date_ts > 1000000000000){
    return dayjs(date_ts).format('YYYY-MM-DD HH:mm:ss')
  }
  return dayjs.unix(date_ts).format('YYYY-MM-DD HH:mm:ss')
}

export function getThemeStyles(theme: string) {
  const color = theme === 'dark' ? '#929AA5' : '#76808F'
  const lineColor = theme === 'dark' ? '#555555' : '#dddddd'
  return {
    grid:{
      horizontal:{
        color: lineColor
      },
      vertical:{
        color: lineColor
      }
    },
    indicator: {
      tooltip: {
        icons: [
          {
            id: 'visible',
            position: TooltipIconPosition.Middle,
            marginLeft: 8,
            marginTop: 7,
            marginRight: 0,
            marginBottom: 0,
            paddingLeft: 0,
            paddingTop: 0,
            paddingRight: 0,
            paddingBottom: 0,
            icon: '\ue903',
            fontFamily: 'icomoon',
            size: 14,
            color: color,
            activeColor: color,
            backgroundColor: 'transparent',
            activeBackgroundColor: 'rgba(22, 119, 255, 0.15)'
          },
          {
            id: 'invisible',
            position: TooltipIconPosition.Middle,
            marginLeft: 8,
            marginTop: 7,
            marginRight: 0,
            marginBottom: 0,
            paddingLeft: 0,
            paddingTop: 0,
            paddingRight: 0,
            paddingBottom: 0,
            icon: '\ue901',
            fontFamily: 'icomoon',
            size: 14,
            color: color,
            activeColor: color,
            backgroundColor: 'transparent',
            activeBackgroundColor: 'rgba(22, 119, 255, 0.15)'
          },
          {
            id: 'setting',
            position: TooltipIconPosition.Middle,
            marginLeft: 6,
            marginTop: 7,
            marginBottom: 0,
            marginRight: 0,
            paddingLeft: 0,
            paddingTop: 0,
            paddingRight: 0,
            paddingBottom: 0,
            icon: '\ue902',
            fontFamily: 'icomoon',
            size: 14,
            color: color,
            activeColor: color,
            backgroundColor: 'transparent',
            activeBackgroundColor: 'rgba(22, 119, 255, 0.15)'
          },
          {
            id: 'close',
            position: TooltipIconPosition.Middle,
            marginLeft: 6,
            marginTop: 7,
            marginRight: 0,
            marginBottom: 0,
            paddingLeft: 0,
            paddingTop: 0,
            paddingRight: 0,
            paddingBottom: 0,
            icon: '\ue900',
            fontFamily: 'icomoon',
            size: 14,
            color: color,
            activeColor: color,
            backgroundColor: 'transparent',
            activeBackgroundColor: 'rgba(22, 119, 255, 0.15)'
          }
        ]
      }
    }
  }
}

export function adjustFromTo(period: Period, toTimestamp: number, count: number) {
  let to = toTimestamp
  let from = to
  switch (period.timespan) {
    case 'minute': {
      to = to - (to % (60 * 1000))
      from = to - count * period.multiplier * 60 * 1000
      break
    }
    case 'hour': {
      to = to - (to % (60 * 60 * 1000))
      from = to - count * period.multiplier * 60 * 60 * 1000
      break
    }
    case 'day': {
      to = to - (to % (60 * 60 * 1000))
      from = to - count * period.multiplier * 24 * 60 * 60 * 1000
      break
    }
    case 'week': {
      const date = new Date(to)
      const week = date.getDay()
      const dif = week === 0 ? 6 : week - 1
      to = to - dif * 60 * 60 * 24
      const newDate = new Date(to)
      to = new Date(`${newDate.getFullYear()}-${newDate.getMonth() + 1}-${newDate.getDate()}`).getTime()
      from = count * period.multiplier * 7 * 24 * 60 * 60 * 1000
      break
    }
    case 'month': {
      const date = new Date(to)
      const year = date.getFullYear()
      const month = date.getMonth() + 1
      to = new Date(`${year}-${month}-01`).getTime()
      from = count * period.multiplier * 30 * 24 * 60 * 60 * 1000
      const fromDate = new Date(from)
      from = new Date(`${fromDate.getFullYear()}-${fromDate.getMonth() + 1}-01`).getTime()
      break
    }
    case 'year': {
      const date = new Date(to)
      const year = date.getFullYear()
      to = new Date(`${year}-01-01`).getTime()
      from = count * period.multiplier * 365 * 24 * 60 * 60 * 1000
      const fromDate = new Date(from)
      from = new Date(`${fromDate.getFullYear()}-01-01`).getTime()
      break
    }
  }
  return [from, to]
}

export type BarArr = [number, number, number, number, number, number]

export function tf_to_secs(timeframe?: string): number{
  if(!timeframe)return 0
  const unit = timeframe.substring(timeframe.length - 1);
  const amount = parseInt(timeframe.substring(0, timeframe.length - 1))
  let scale = 0
  if(unit == 'y'){
    scale = 31536000 // 60 * 60 * 24 * 365
  }
  else if(unit == 'M'){
    scale = 2592000  // 60 * 60 * 24 * 30
  }
  else if(unit == 'w'){
    scale = 604800 // 60 * 60 * 24 * 7
  }
  else if(unit == 'd'){
    scale = 86400 // 60 * 60 * 24
  }
  else if(unit == 'h'){
    scale = 3600
  }
  else if(unit == 'm'){
    scale = 60
  }
  else if(unit == 's'){
    scale = 1
  }
  else{
    throw Error(`unsupport timeframe: ${timeframe}`)
  }
  return scale * amount
}

export function build_ohlcvs(details: BarArr[], in_msecs: number, tf_msecs: number, last_bar: BarArr | null = null): BarArr[] {
  if(last_bar){
    last_bar[0] = Math.floor(last_bar[0] / tf_msecs) * tf_msecs
  }
  if(in_msecs == tf_msecs){
    if(last_bar && details[0][0] > last_bar[0]){
      details.splice(0, 0, last_bar)
    }
    return details
  }
  const result: BarArr[] = last_bar ? [last_bar] : []
  let lastIdx = result.length - 1
  details.forEach((row: BarArr, index: number) => {
    row[0] = Math.floor(row[0] / tf_msecs) * tf_msecs
    if(lastIdx < 0 || row[0] > result[lastIdx][0]){
      result.push(row)
      lastIdx += 1
    }
    else{
      const prow = result[lastIdx]
      prow[2] = Math.max(prow[2], row[2])
      prow[3] = Math.min(prow[3], row[3])
      prow[4] = row[4]
      prow[5] += row[5]
    }
  })
  return result
}

export function makeFormatDate(timespan: string) {
  function doFormatDate(dateTimeFormat: Intl.DateTimeFormat, timestamp: number,
                      format: string, type: kc.FormatDateType) {
    switch (timespan) {
      case 'minute': {
        if (type === FormatDateType.XAxis) {
          return formatDate(dateTimeFormat, timestamp, 'HH:mm')
        }
        return formatDate(dateTimeFormat, timestamp, 'YYYY-MM-DD HH:mm')
      }
      case 'hour': {
        if (type === FormatDateType.XAxis) {
          return formatDate(dateTimeFormat, timestamp, 'MM-DD HH:mm')
        }
        return formatDate(dateTimeFormat, timestamp, 'YYYY-MM-DD HH:mm')
      }
      case 'day':
      case 'week':
        return formatDate(dateTimeFormat, timestamp, 'YYYY-MM-DD')
      case 'month': {
        if (type === FormatDateType.XAxis) {
          return formatDate(dateTimeFormat, timestamp, 'YYYY-MM')
        }
        return formatDate(dateTimeFormat, timestamp, 'YYYY-MM-DD')
      }
      case 'year': {
        if (type === FormatDateType.XAxis) {
          return formatDate(dateTimeFormat, timestamp, 'YYYY')
        }
        return formatDate(dateTimeFormat, timestamp, 'YYYY-MM-DD')
      }
    }
    return formatDate(dateTimeFormat, timestamp, 'YYYY-MM-DD HH:mm')
  }
  return doFormatDate;
}

export function useSymbols(feeder: Datafeed){
  const symbols = ref<SymbolInfo[]>([])
  const error = ref(null)
  const loading = ref(false)

  function doFetch(){
    loading.value = true
    symbols.value = []
    error.value = null
    feeder.getSymbols().then(res => {
      symbols.value = res
      loading.value = false
    })
    .catch(err => {
      error.value = err
      loading.value = false
    })
  }

  doFetch()
  return {symbols, error, loading}
}