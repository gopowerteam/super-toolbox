import type { CalculationMode, CalculationRange, CalculationType } from '@/config/enum.config'

export interface CalculationOptions {
  count: number
  types: CalculationType[]
  range: CalculationRange
}

export interface Question {
  numberA: number
  numberB: number
  text: string
  symbol: string
  answer: number
  options: number[]
}

export interface QuestionRecord {
  question: Question
  time?: number
  answer?: number
}

export interface CalculationResult {
  timeTotal: number
  timeAvg: number
  timeFastest: number
  timeSlowest: number
  counter: number
  counterRight: number
  counterWrong: number
  counterEmpty: number
  rightRate: number
}
