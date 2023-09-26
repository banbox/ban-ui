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