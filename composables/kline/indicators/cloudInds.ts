import {IndicatorTemplate} from "klinecharts";
import {postApi} from "#imports";

export const makeCloudInds = (params: Record<string, any>[]): IndicatorTemplate[] => {
  return params.map(args => {
    const figures = args['figures'] ?? []
    if(args['figure_tpl'] && args['calcParams']){
      for(let period of args['calcParams']){
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
      }
    }
  })
}

export default makeCloudInds
