import { defineNuxtPlugin } from '#app'
import mitt from 'mitt'
import {AddDelInd} from "~/composables/kline/coms";

type AppEvents = {
  'set_ind': AddDelInd
}

export default defineNuxtPlugin(() => {
  const emitter = mitt<AppEvents>()
  return {
    provide: {
      on: emitter.on,
      emit: emitter.emit,
    }
  }
})