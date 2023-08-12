import {IndicatorTemplate} from "klinecharts";
import {postApi} from "#imports";

const test: IndicatorTemplate = {
  name: "TEST",
  shortName: "TEST",
  figures: [],
  // 当计算参数改变时，希望提示的和参数一样，即title的值需要改变
  regenerateFigures: (params) => {
    return params.map((p, i) => {
      return { key: p, title: `${p}: `, type: 'line' }
    })
  },
  calc: async (dataList, {calcParams, extendData}) => {
    if(!extendData){
      console.error('extendData should be filled with strategy name')
      return dataList.map(d => { return {} })
    }
    const stgy = extendData;
    const fields = calcParams;
    const kline = dataList.map(d => [d.timestamp, d.open, d.high, d.low, d.close, d.volume]);
    const rsp = await postApi('/kline/calc_ind', {stgy, fields, kline})
    if(rsp.code != 200 || !rsp.data) {
      console.error('calc ind fail:', rsp)
      return dataList.map(d => { return {} })
    }
    return rsp.data ?? []
  }
}

export default test
