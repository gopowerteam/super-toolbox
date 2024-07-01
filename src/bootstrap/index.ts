import { setup } from './setup'
import { launch } from './launch'

export async function bootstrap() {
  const store = useStore()
  // 基础配置
  await setup()
  // 启动逻辑
  await launch()
  // 准备完毕
  store.app.setReady()
}
