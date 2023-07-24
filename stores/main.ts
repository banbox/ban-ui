import {defineStore} from "pinia";
import {ref} from "#imports";


export const useMainStore = defineStore('main', {
    state: () => {
        return{
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            theme: 'light',
        }
    },
    actions: {
        setTimezone(val: string){
            this.timezone = val
        },
        setTheme(val: string){
            this.theme = val
        }
    },
    persist: true,
})