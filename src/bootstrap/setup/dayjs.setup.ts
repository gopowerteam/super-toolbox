import dayjs from 'dayjs'
import zhCN from 'dayjs/locale/zh-cn'
import duration from 'dayjs/plugin/duration'

export function dayjsSetup() {
  dayjs.extend(duration)
  dayjs.locale(zhCN)
}
