import {type TradeBot} from "~/composables/dash/types";
import {$fetch} from "ofetch";
import {type ApiResult} from "~/utils/netio";
import _ from "lodash"
import {useBotAuth, parseApiExc} from "~/composables/dash/auth";
import {useDashLocal} from "~/stores/dashLocal";


export function useApi(bot: TradeBot){
  const {getBizUrl, login} = useBotAuth(bot)

  async function requestApi(method: 'GET'|'POST', path: string, query: Record<string, any> | null,
                            body: Record<string, any> | null, retry: boolean = true): Promise<ApiResult> {
    const prefix = getBizUrl()
    try {
      if (!bot.url) return {code: 400, msg: 'bot invalid'}
      if (!bot.token) {
        await login()
        if (!bot.token) {
          return {code: 401, msg: 'auth invalid'}
        }
      }
      const headers = {
        Authorization: `Bearer ${bot.token}`,
        'X-Account': bot.account,
      }
      if (!query) {
        query = {}
      }
      const rsp = await $fetch(`${prefix}${path}`, {method, query, headers, body})
      if(_.isArray(rsp) || !_.isObject(rsp)){
        return {code: 200, data: rsp}
      }
      const data = rsp as Record<string, any>
      return {code: 200, msg: '', ...data}
    } catch (e) {
      const res = parseApiExc(e)
      if (res.code == 401 && retry) {
        bot.token = ''
        return await requestApi(method, path, query, body, false)
      }
      return res
    }
  }

  async function getApi(path: string, query: Record<string, any> | null = null){
    return await requestApi('GET', path, query, null)
  }

  async function postApi(path: string, body: Record<string, any> | null,
                         query: Record<string, any> | null = null): Promise<ApiResult>{
    return await requestApi('POST', path, query, body)
  }

  async function delApi(path: string, body: Record<string, any> | null,
                         query: Record<string, any> | null = null): Promise<ApiResult>{
    return await requestApi('POST', path, query, body)
  }

  return {getApi, postApi, delApi}
}

export function useCurApi(){
  return useApi(useDashLocal().bot)
}