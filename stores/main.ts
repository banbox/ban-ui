import {defineStore} from "pinia";
import {ref} from "#imports";

export const useMainStore = defineStore('main', () => {
    const locale = ref('en-US')

    function setLocale(val: string){
        locale.value = val
    }
    return {locale, setLocale}
})