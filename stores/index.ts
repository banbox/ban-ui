import { defineStore } from 'pinia'
export const useKlineState = defineStore('kline', {
  state: () => ({
    inds: [] as string[]
  }),
  actions: {
    increment() {
      // `this` is the store instance
      this.inds.push('test');
    },
  },
})
