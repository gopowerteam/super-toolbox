import { appLaunch } from './app.launch'
import { userLaunch } from './user.launch'

export async function launch() {
  const store = useStore()

  await appLaunch()
  await userLaunch()

  store.app.setReady()
}
