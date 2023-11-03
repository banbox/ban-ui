import {type TradeBot} from "~/composables/dash/types";
import {$fetch, FetchError} from "ofetch";
import {type ApiResult} from "~/utils/netio";
import {useDashLocal} from "~/stores/dashLocal";

export const APIBASE = '/api/v1'

export function parseApiExc(e: unknown){
  const err = (e as FetchError)
  const msg = err.data && err.data.detail ? `${err.status}: ${err.data.detail}` : err.toString()
  return {code: err.status ?? 400, msg}
}


export function useBotAuth(info: TradeBot) {
  const local = useDashLocal()

  function getBaseUrl(): string {
    return `${info.url}${APIBASE}`
  }

  async function login(): Promise<ApiResult> {
    const prefix = getBaseUrl()
    const bot_ping = `${prefix}/ping`
    try {
      await $fetch(bot_ping);
    } catch (e) {
      return parseApiExc(e)
    }
    const auth_base = window.btoa(info.account + ':' + info.password)
    const headers = {Authorization: `Basic ${auth_base}`}
    try {
      const rsp = await $fetch(`${prefix}/token/login`, {
        method: 'POST', headers
      })
      if (rsp.access_token && rsp.refresh_token) {
        info.access_token = rsp.access_token
        info.refresh_token = rsp.refresh_token
        info.name = rsp.name ?? `bot${local.all_bots.length + 1}`
        return {code: 200}
      }
      return {code: rsp.code, msg: rsp.detail ?? 'auth fail'}
    } catch (e) {
      return parseApiExc(e)
    }
  }

  return {login, getBaseUrl}
}