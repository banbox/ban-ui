
import {navigateTo, defineNuxtRouteMiddleware} from '#app'
import {useDevice} from "~/composables/device";

export default defineNuxtRouteMiddleware((to) => {
  if(to.path.startsWith('/m/') || to.path === '/m'){
    return
  }
  const device = useDevice()
  if(device.isMobile){
    return navigateTo('/m')
  }
})
