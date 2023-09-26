import kc, {KLineData, OverlayStyle} from "klinecharts";
import {getInOutFigures} from "~/composables/kline/ktools";
const LineType = kc.LineType;
const PolygonType = kc.PolygonType;

export interface InOutTag{
  price: number,
  /**
   * 1表示上面绘制  -1表示下面绘制
   */
  direction: number,
  /**
   * 绘制的颜色
   */
  color: string,
  /**
   * 显示的文本
   */
  text: string,
}


export interface InoutData {
  dataIndex: number
  x: number
  data: KLineData,
  tags: InOutTag[]
}


export function drawInOutFigure(viewKlines: InoutData[], ctx: CanvasRenderingContext2D, yAxis: kc.YAxis) {
  const layStyles = getDefaultOverlayStyle()
  viewKlines.forEach(it => {
    it.tags.forEach(tag => {
      const valueY = yAxis.convertToPixel(tag.price)
      const position = tag.direction <= 0 ? 'bottom' : 'top';
      const color = tag.color;
      const text = tag.text;
      getInOutFigures({x: it.x, y: valueY}, position, text, color).forEach(fg => {
        const {type, styles, attrs} = fg
        const Figure = kc.getFigureClass(type)
        if (Figure == null) return
        const ss = {...layStyles[type], ...styles}
        new Figure({name: type, attrs, styles: ss}).draw(ctx)
      })
    })
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
