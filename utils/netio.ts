import {$fetch, $Fetch, FetchOptions, SearchParameters, FetchError} from "ofetch";
import _ from "lodash"

export type ApiResult = Record<string, any> & {
  code: number,
  msg?: string
}


const requestApi = async function(method: string, url: string,
                                  query?: SearchParameters,
                                  body?: RequestInit["body"] | Record<string, any>): Promise<ApiResult> {
  try {
    let rsp = await $fetch('/api' + url, {method, body, query});
    if(!_.isObject(rsp)){
      return {code: 200, data: rsp}
    }
    const data = rsp as Record<string, any>
    return {code: 200, msg: '', ...data}
  }catch (e){
    const err = (e as FetchError)
    const msg = err.data && err.data.detail ? `${err.status}: ${err.data.detail}` : err.toString()
    return {code: err.status ?? 400, msg}
  }
}


export async function getApi(url: string, query?: SearchParameters): Promise<ApiResult> {
  return requestApi('GET', url, query)
}

export async function postApi(url: string, body: RequestInit["body"] | Record<string, any>,
                              query?: SearchParameters): Promise<ApiResult> {
  return requestApi('POST', url, query, body)
}
