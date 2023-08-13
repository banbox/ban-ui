import {defineStore} from "pinia";
import {ref} from "#imports";


export const useKlineCookie = defineStore('kcookie', () => {
    const timezone = ref(Intl.DateTimeFormat().resolvedOptions().timeZone)
    const theme = ref('light')
    return {timezone, theme}
}, {persist: true})
