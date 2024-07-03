import { CalculationMode, CalculationRange, CalculationType } from './enum.config'

export const CalculationTypeDict = new Map([
  [CalculationType.Add, '加法'],
  [CalculationType.Subtract, '减法'],
  [CalculationType.Multiply, '乘法'],
  [CalculationType.Divide, '除法'],
])

export const CalculationRangeDict = new Map([
  [CalculationRange.Ten, '10以内'],
  [CalculationRange.Hundred, '100以内'],
  [CalculationRange.Thousand, '1000以内'],
])

export const CalculationModeDict = new Map([
  [CalculationMode.Select, '选择'],
  [CalculationMode.Input, '输入'],
])
