import {IndicatorTemplate} from "klinecharts";
import {postApi} from "#imports";

export const makeCloudInds = (params: Record<string, any>[]): IndicatorTemplate[] => {
  return params.map(args => {
    return {
      ...args,
      name: args['name'],
      calc: async (dataList, {name, figures}) => {
        const stgy = name;
        const fields = figures.map(f => f.key);
        const kline = dataList.map(d => [d.timestamp, d.open, d.high, d.low, d.close, d.volume]);
        const rsp = await postApi('/kline/calc_ind', {stgy, fields, kline})
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
