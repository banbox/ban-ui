import exp from "constants";

export interface TradeBot{
  url: string
  account: string
  password: string
  auto_refresh: boolean,
  name?: string
  avaiable?: boolean
  last_beat?: number
  access_token?: string
  refresh_token?: string
}

export interface BalanceItem{
  symbol: string,
  total: number,
  free: number,
  used: number,
  total_fiat: number
}

export interface BotInfo{
  cpu_pct: number,
  ram_pct: number,
  last_process: number,
  allow_trade_at: number,
  profit_closed_percent_mean: number
  profit_closed_mean: number
  profit_closed_percent_sum: number
  profit_closed_sum: number
  profit_all_percent_mean: number
  profit_all_mean: number
  profit_all_percent_sum: number
  profit_all_sum: number
  trade_count: number
  closed_trade_count: number
  first_trade_timestamp?: number
  latest_trade_timestamp?: number
  avg_duration: string
  best_pair?: string
  best_pair_profit_pct: number
  winning_trades: number
  losing_trades: number
  profit_factor: number
  winrate: number
  expectancy: number
  expectancy_ratio: number
  max_drawdown: number
  max_drawdown_abs: number
  total_cost?: number
  bot_start_timestamp: number

  balance_total: number
  balance_items: BalanceItem[]

  run_tfs: string[]
  exchange: string
  market: string
  pairs: string[]
}

export interface PairPerf{
  pair: string
  profit_pct: number
  profit_sum: number
  close_num: number
}

export interface PairStgyTf{
  pair: string
  stgy: string
  tf: string
}

export interface StgyVer{
  name: string
  version: number
}

export interface PeriodStat{
  date_ms: number,
  start_balance: number,
  profit_sum: number,
  profit_pct: number,
  order_num: number
}

export interface TagStat{
  tag: string,
  wins: number,
  losses: number,
  draws: number
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
  enter_enter: boolean
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
  exit_enter?: boolean
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