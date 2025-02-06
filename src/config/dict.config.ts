import { CalculationMode, CalculationRange, CalculationType, MemoryCardMode, ShulteMode } from './enum.config'

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

export const ShulteModeDict = new Map([
  [ShulteMode.Positive, '正序'],
  [ShulteMode.Reverse, '倒序'],
  [ShulteMode.Random, '随机'],
])

export const MemoryCardModeDict = new Map([
  [MemoryCardMode.Number, '数字模式'],
  [MemoryCardMode.Image, '图片模式'],
])
