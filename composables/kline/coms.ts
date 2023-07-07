import {Period} from "~/components/kline/types";
import {CandleTooltipCustomCallbackData, CandleStyle, FormatDateType} from "klinecharts";
import kc from "klinecharts";
import i18n from "~/composables/i18n"
const t = i18n.global.t
const formatPrecision = kc.utils.formatPrecision
const formatThousands = kc.utils.formatThousands
const formatDate = kc.utils.formatDate
const formatBigNumber = kc.utils.formatBigNumber


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


function CandleTooltipCustom(data: CandleTooltipCustomCallbackData, styles: CandleStyle){
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
    { title: t('time'), value: formatDate(dateTimeFormat!, current.timestamp, 'YYYY-MM-DD HH:mm') },
    { title: t('open'), value: formatThousands(formatPrecision(current.open, pricePrecision), thousandsSeparator) },
    { title: t('high'), value: formatThousands(formatPrecision(current.high, pricePrecision), thousandsSeparator) },
    { title: t('low'), value: formatThousands(formatPrecision(current.low, pricePrecision), thousandsSeparator) },
    { title: t('close'), value: formatThousands(formatPrecision(current.close, pricePrecision), thousandsSeparator)},
    { title: t('volume'), value: volume},
    { title: t('change'), value: change}
  ]
}

export function getDefStyles() {
  return {
    candle: {
      type: 'candle_solid',
      priceMark: {
        last: {
          show: true
        },
        high: {
          show: true
        },
        low: {
          show: true
        }
      },
      tooltip: {
        custom: CandleTooltipCustom
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
  }
}

export function getThemeStyles(theme: string) {
  const color = theme === 'dark' ? '#929AA5' : '#76808F'
  return {
    indicator: {
      tooltip: {
        icons: [
          {
            id: 'visible',
            position: kc.TooltipIconPosition.Middle,
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
            position: kc.TooltipIconPosition.Middle,
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
            position: kc.TooltipIconPosition.Middle,
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
            position: kc.TooltipIconPosition.Middle,
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

export function makeFormatDate(timespan: string) {
  function formatDate(dateTimeFormat: Intl.DateTimeFormat, timestamp: number,
                      format: string, type: FormatDateType) {
    switch (timespan) {
      case 'minute': {
        if (type === FormatDateType.XAxis) {
          return kc.utils.formatDate(dateTimeFormat, timestamp, 'HH:mm')
        }
        return kc.utils.formatDate(dateTimeFormat, timestamp, 'YYYY-MM-DD HH:mm')
      }
      case 'hour': {
        if (type === FormatDateType.XAxis) {
          return kc.utils.formatDate(dateTimeFormat, timestamp, 'MM-DD HH:mm')
        }
        return kc.utils.formatDate(dateTimeFormat, timestamp, 'YYYY-MM-DD HH:mm')
      }
      case 'day':
      case 'week':
        return kc.utils.formatDate(dateTimeFormat, timestamp, 'YYYY-MM-DD')
      case 'month': {
        if (type === FormatDateType.XAxis) {
          return kc.utils.formatDate(dateTimeFormat, timestamp, 'YYYY-MM')
        }
        return kc.utils.formatDate(dateTimeFormat, timestamp, 'YYYY-MM-DD')
      }
      case 'year': {
        if (type === FormatDateType.XAxis) {
          return kc.utils.formatDate(dateTimeFormat, timestamp, 'YYYY')
        }
        return kc.utils.formatDate(dateTimeFormat, timestamp, 'YYYY-MM-DD')
      }
    }
    return kc.utils.formatDate(dateTimeFormat, timestamp, 'YYYY-MM-DD HH:mm')
  }
  return formatDate;
}