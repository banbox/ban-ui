import {defineStore} from "pinia";
import {ref} from "#imports";


export const useDashStore = defineStore('dash', () => {
  const menu_id = ref('1')
  const showContact = ref(false)
  return {menu_id, showContact}
})