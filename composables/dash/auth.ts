import {type TradeBot} from "~/composables/dash/types";
import {$fetch, FetchError} from "ofetch";
import {type ApiResult} from "~/utils/netio";
import {useDashLocal} from "~/stores/dashLocal";

export function parseApiExc(e: unknown){
  const err = (e as FetchError)
  const msg = err.data && err.data.detail ? `${err.status}: ${err.data.detail}` : err.toString()
  return {code: err.status ?? 400, msg}
}


export function useBotAuth(info: TradeBot) {
  const local = useDashLocal()

  function getBizUrl(): string {
    // 这里返回认证后url前缀
    return `${info.url}/api`
  }

  async function login(): Promise<ApiResult> {
    const prefix = info.url
    const bot_ping = `${prefix}/ping`
    try {
      await $fetch(bot_ping);
    } catch (e) {
      return parseApiExc(e)
    }
    const auth_base = window.btoa(info.user_name + ':' + info.password)
    const headers = {Authorization: `Basic ${auth_base}`}
    try {
      const rsp = await $fetch(`${prefix}/login`, {
        method: 'POST', headers
      })
      if (rsp.token) {
        Object.entries(rsp.accounts).forEach(([k, v]) => {
          local.all_bots.push({
            url: info.url,
            user_name: info.user_name,
            password: info.password,
            auto_refresh: info.auto_refresh,
            avaiable: true,
            token: rsp.token,
            name: `${rsp.name}-${k}`,
            account: k,
            role: v as string,
          })
        })
        local.cur_id = local.all_bots.length - 1
        return {code: 200}
      }
      return {code: rsp.code, msg: rsp.detail ?? 'auth fail'}
    } catch (e) {
      return parseApiExc(e)
    }
  }

  return {login, getBizUrl}
}