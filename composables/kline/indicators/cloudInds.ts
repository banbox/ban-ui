import kc,{
  IndicatorTemplate,IndicatorDrawParams
} from "klinecharts";
import {postApi} from "#imports";
import {drawInOutFigure, InoutData} from "~/composables/kline/indicators/common";


/**
 * 按传入的参数生成云端指标。
 * 支持自定义图形：
 * inout: 买卖点显示，做多时值为正数的价格，做空时值为负数的价格。
 * @param params
 */
export const makeCloudInds = (params: Record<string, any>[]): IndicatorTemplate[] => {
  return params.map((args): IndicatorTemplate => {
    const my_figure_types = ['inout']  // 支持的figure类型
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
      draw: ({ctx, kLineDataList, indicator, visibleRange, defaultStyles, xAxis, yAxis}: IndicatorDrawParams) => {
        const figures = indicator.figures
        const my_figures = figures.filter(fg => fg.type && my_figure_types.includes(fg.type))
        // 不包含自定义figure，退出执行默认绘制
        if (!my_figures.length) return false
        // 指标计算结果
        const result = indicator.result;
        // 显示范围内的K线
        const inouts: InoutData[] = []
        const upColor = kc.utils.formatValue(indicator.styles, 'bars[0].upColor', (defaultStyles.bars)[0].upColor) as string
        const downColor = kc.utils.formatValue(indicator.styles, 'bars[0].downColor', (defaultStyles.bars)[0].downColor) as string
        for (let i = visibleRange.from; i < visibleRange.to; i++) {
          const ind = result[i];
          if (!ind || !Object.keys(ind).length) continue
          const kLineData = kLineDataList[i]
          const x = xAxis.convertToPixel(i)
          const item: InoutData = {dataIndex: i, x, data: kLineData, tags: []}
          const key_map: Record<string, string> = {}
          Object.keys(ind).forEach(k => {
            const arr = k.split(':')
            key_map[arr[0]] = k
          })
          my_figures.forEach(fig => {
            if (fig.type == 'inout') {
              const baseVal = fig.baseValue ?? 0
              const color = baseVal >= 0 ? upColor : downColor
              const ind_key = key_map[fig.key]
              const price = ind[ind_key]
              const text = ind_key;
              item.tags.push({price, direction: -baseVal, color, text})
            }
          })
          if (!item.tags.length) continue
          inouts.push(item)
        }
        drawInOutFigure(inouts, ctx, yAxis)
        return my_figures.length === figures.length
      }
    }
  })
}

export default makeCloudInds
