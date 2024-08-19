
import {navigateTo, defineNuxtRouteMiddleware} from '#app'

export default defineNuxtRouteMiddleware((to) => {
  if(to.path.startsWith('/m/') || to.path === '/m'){
    return
  }
  const device = useDevice()
  if(device.isMobile){
    return navigateTo('/m')
  }
})
