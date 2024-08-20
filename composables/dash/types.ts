export interface TradeBot{
  url: string
  user_name: string
  password: string
  auto_refresh: boolean
  name?: string
  avaiable?: boolean
  token?: string
  account?: string
  role?: string
}

export interface BalanceItem{
  symbol: string,
  total: number,
  free: number,
  used: number,
  upol: number,
  total_fiat: number
}

export interface BotInfo{
  cpu_pct: number,
  ram_pct: number,
  last_process: number,
  allow_trade_at: number,
  done_profit_pct_mean: number
  done_profit_mean: number
  done_profit_pct_sum: number
  done_profit_sum: number
  all_profit_pct_mean: number
  all_profit_mean: number
  all_profit_pct_sum: number
  all_profit_sum: number
  order_num: number
  done_order_num: number
  first_od_ts?: number
  last_od_ts?: number
  avg_duration: string
  best_pair?: string
  best_profit_pct: number
  win_num: number
  loss_num: number
  profit_factor: number
  win_rate: number
  expectancy: number
  expectancy_ratio: number
  max_drawdown_pct: number
  max_drawdown_val: number
  total_cost?: number
  bot_start_ms: number

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

export interface FieldArg{
  field: string
  val_type: string
  title: string
  value: any
}

export interface PairStgyTf{
  pair: string
  strategy: string
  tf: string
  price: number
  od_num: number
  args: FieldArg[]
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
