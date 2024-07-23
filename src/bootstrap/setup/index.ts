import { dayjsSetup } from './dayjs.setup'
import { httpSetup } from './http.setup'

export async function setup() {
  dayjsSetup()
  httpSetup()
}
