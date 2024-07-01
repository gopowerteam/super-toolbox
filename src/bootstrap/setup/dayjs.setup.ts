import dayjs from 'dayjs'
import zhCN from 'dayjs/locale/zh-cn'

export function dayjsSetup() {
  dayjs.locale(zhCN)
}
