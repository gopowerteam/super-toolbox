import type { ShulteMode } from '@/config/enum.config'

export interface ShulteOptions {
  order: number
  mode: ShulteMode
}

export interface ShulteResult {
  timeTotal: number
  timeAvg: number
  timeFastest: number
  timeSlowest: number
  counterRight: number
  counterWrong: number
  rightRate: number
}
