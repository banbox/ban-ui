/**
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at

 * http://www.apache.org/licenses/LICENSE-2.0

 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {OverlayFigure, OverlayTemplate} from 'klinecharts'
import kc from 'klinecharts'

const barSignal: OverlayTemplate = {
  name: 'barSignal',
  totalStep: 2,
  createPointFigures: ({ overlay, coordinates }) => {
    let {postion, text, bgColor} = overlay.extendData;
    const styles = bgColor ? {color: bgColor}: {}
    const textStyles = bgColor ? {backgroundColor: bgColor, borderColor: bgColor} : {}
    let result: OverlayFigure[] = []
    coordinates.forEach(coord => {
      const plusFlag = postion === 'bottom' ? 1 : -1;
      const startX = coord.x
      const horzEndX = startX + 200
      const startY = coord.y + 3 * plusFlag
      const lineEndY = startY + 50 * plusFlag
      const arrowEndY = lineEndY + 5 * plusFlag
      result.push(
        {
          type: 'line',
          attrs: { coordinates: [{ x: startX, y: startY }, { x: startX, y: lineEndY }] },
          ignoreEvent: true
        },
        {
          type: 'line',
          attrs: { coordinates: [{ x: startX, y: coord.y }, { x: horzEndX, y: coord.y }] },
          ignoreEvent: true,
          styles: {...styles, style: kc.LineType.Dashed}
        },
        {
          type: 'polygon',
          attrs: { coordinates: [{ x: startX, y: lineEndY }, { x: startX - 4, y: arrowEndY }, { x: startX + 4, y: arrowEndY }] },
          ignoreEvent: true,
          styles
        },
        {
          type: 'rectText',
          attrs: { x: startX, y: arrowEndY, text: text ?? '', align: 'center', baseline: 'bottom' },
          ignoreEvent: true,
          styles: textStyles
        }
      )
    })
    return result
  }
}

export default barSignal
