import {
  IndicatorTemplate,
  KLineData,
  OverlayStyle,
  LineType,
  PolygonType,
} from "klinecharts";
import kc from "klinecharts";
import {postApi} from "#imports";
import {getInOutFigures} from "~/composables/kline/ktools";
interface VisibleData {
  dataIndex: number
  x: number
  data: KLineData,
  ind: any
}

/**
 * 按传入的参数生成云端指标。
 * 支持自定义图形：
 * inout: 买卖点显示，做多时值为正数的价格，做空时值为负数的价格。
 * @param params
 */
export const makeCloudInds = (params: Record<string, any>[]): IndicatorTemplate[] => {
  const my_figure_types = ['inout']  // 支持的figure类型
  return params.map((args): IndicatorTemplate => {
    const figures = args['figures'] ?? []
    if (args['figure_tpl'] && args['calcParams']) {
      for (let period of args['calcParams']) {
        const key = args['figure_tpl'].replace(/\{period\}/g, period)
        const plot_type = args['figure_type'] ?? 'line'
        figures.push({key, title: `${key.toUpperCase()}: `, type: plot_type})
      }
    }
    return {
      ...args,
      name: args['name'],
      figures,
      calc: async (dataList, {name, calcParams, extendData}) => {
        const params = calcParams;
        const kwargs = extendData;
        const kline = dataList.map(d => [d.timestamp, d.open, d.high, d.low, d.close, d.volume]);
        const rsp = await postApi('/kline/calc_ind', {name, params, kline, kwargs})
        if (rsp.code != 200 || !rsp.data) {
          console.error('calc ind fail:', rsp)
          return dataList.map(d => {
            return {}
          })
        }
        return rsp.data ?? []
      },
      /**
       * 云端指标的自定义绘制。对复杂的figure则进行绘制，如果有简单的figure则返回false继续执行默认绘制逻辑，否则返回true中断后续默认绘制
       * @param ctx
       * @param kLineDataList
       * @param indicator
       * @param visibleRange
       * @param bounding
       * @param barSpace
       * @param defaultStyles
       * @param xAxis
       * @param yAxis
       */
      draw({ctx, kLineDataList, indicator, visibleRange,
             bounding, barSpace, defaultStyles, xAxis, yAxis}) {
        const figures = indicator.figures
        const my_figures = figures.filter(fg => fg.type && my_figure_types.includes(fg.type))
        // 不包含自定义figure，退出执行默认绘制
        if(!my_figures.length)return false
        const result = indicator.result;
        const viewKlines: VisibleData[] = []
        for (let i = visibleRange.from; i < visibleRange.to; i++) {
          const kLineData = kLineDataList[i]
          const x = xAxis.convertToPixel(i)
          viewKlines.push({dataIndex: i, x, data: kLineData, ind: result[i]})
        }
        const upColor = kc.utils.formatValue(indicator.styles, 'bars[0].upColor', (defaultStyles.bars)[0].upColor) as string
        const downColor = kc.utils.formatValue(indicator.styles, 'bars[0].downColor', (defaultStyles.bars)[0].downColor) as string
        const layStyles = getDefaultOverlayStyle()
        my_figures.forEach(figure => {
          if(figure.type == 'inout'){
            viewKlines.filter(it => it.ind[figure.key]).forEach(it => {
              const indValue = it.ind[figure.key]
              const price = Math.abs(indValue)
              const valueY = yAxis.convertToPixel(price)
              const position = indValue > 0 ? 'top': 'bottom';
              const text = indValue > 0 ? `buy:${price}`: `sell:${price}`;
              const color = indValue > 0 ? upColor : downColor
              getInOutFigures({x: it.x, y: valueY}, position, text, color).forEach(fg => {
                const { type, styles, attrs } = fg
                const Figure = kc.getFigureClass(type)
                if(Figure == null)return
                const ss = {...layStyles[type], ...styles}
                new Figure({name: type, attrs, styles: ss}).draw(ctx)
              })
            })
          }
          else{
            console.error('unsupport custom figure:', figure.type)
          }
        })
        return my_figures.length === figures.length
      }
    }
  })
}

function getDefaultOverlayStyle (): OverlayStyle {
  return {
    point: {
      color: '#1677FF',
      borderColor: 'rgba(22, 119, 255, 0.35)',
      borderSize: 1,
      radius: 5,
      activeColor: '#1677FF',
      activeBorderColor: 'rgba(22, 119, 255, 0.35)',
      activeBorderSize: 3,
      activeRadius: 5
    },
    line: {
      style: LineType.Solid,
      smooth: false,
      color: '#1677FF',
      size: 1,
      dashedValue: [2, 2]
    },
    rect: {
      style: PolygonType.Fill,
      color: 'rgba(22, 119, 255, 0.25)',
      borderColor: '#1677FF',
      borderSize: 1,
      borderRadius: 0,
      borderStyle: LineType.Solid,
      borderDashedValue: [2, 2]
    },
    polygon: {
      style: PolygonType.Fill,
      color: '#1677FF',
      borderColor: '#1677FF',
      borderSize: 1,
      borderStyle: LineType.Solid,
      borderDashedValue: [2, 2]
    },
    circle: {
      style: PolygonType.Fill,
      color: 'rgba(22, 119, 255, 0.25)',
      borderColor: '#1677FF',
      borderSize: 1,
      borderStyle: LineType.Solid,
      borderDashedValue: [2, 2]
    },
    arc: {
      style: LineType.Solid,
      color: '#1677FF',
      size: 1,
      dashedValue: [2, 2]
    },
    text: {
      color: '#1677FF',
      size: 12,
      family: 'Helvetica Neue',
      weight: 'normal'
    },
    rectText: {
      style: PolygonType.Fill,
      color: '#FFFFFF',
      size: 12,
      family: 'Helvetica Neue',
      weight: 'normal',
      borderStyle: LineType.Solid,
      borderDashedValue: [2, 2],
      borderSize: 1,
      borderRadius: 2,
      borderColor: '#1677FF',
      paddingLeft: 4,
      paddingRight: 4,
      paddingTop: 4,
      paddingBottom: 4,
      backgroundColor: '#1677FF'
    }
  }
}

export default makeCloudInds
