export type PairItem = {
  label: string,
  value: string
}

export interface BotTask{
  task_id: number,
  live: boolean,
  start_ms: number,
  stop_ms: number,
  pairs: string[],
  strategy: string[],
  tfs: string[],
  order_num: number,
  profit_rate: number
}

export interface BanOrder extends Record<string, any>{
  id: number
  task_id: number
  symbol: string
  sid: number
  timeframe: string
  short: boolean
  status: number
  enter_tag: string
  init_price: number
  quote_cost: number
  exit_tag: string
  leverage: number
  enter_at: number
  exit_at: number
  strategy: string
  stg_ver: number
  profit_rate: number
  profit: number
  info: string
  enter_cost: number
  duration: number

  enter_id: number
  enter_task_id: number
  enter_inout_id: number
  enter_symbol: string
  enter_order_type: string
  enter_order_id: string
  enter_side: string
  enter_create_at: number
  enter_price: number
  enter_average: number
  enter_amount: number
  enter_filled: number
  enter_status: number
  enter_fee: number
  enter_fee_type: string
  enter_update_at: number

  exit_id?: number
  exit_task_id?: number
  exit_inout_id?: number
  exit_symbol?: string
  exit_order_type?: string
  exit_order_id?: string
  exit_side?: string
  exit_create_at?: number
  exit_price?: number
  exit_average?: number
  exit_amount?: number
  exit_filled?: number
  exit_status?: number
  exit_fee?: number
  exit_fee_type?: string
  exit_update_at?: number
}

export interface OpenOrder{
  pair: string
  side?: string
  order_type?: string
  price?: number
  stoploss_price?: number
  enter_cost?: number
  enter_tag?: string
  leverage?: number
  strategy?: string
}
