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

export interface FieldArg{
  field: string
  val_type: string
  title: string
  value: any
}

export interface PairStgyTf{
  pair: string
  stgy: string
  tf: string
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
