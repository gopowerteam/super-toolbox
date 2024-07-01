import { onLoad, onShow } from '@dcloudio/uni-app'

interface PageLoadConfig {
  load: (...params: (AnyObject | undefined)[]) => void
  show?: (...params: (AnyObject | undefined)[]) => void
}

export function onPageLoad(config: PageLoadConfig): void
export function onPageLoad(config: (...params: (AnyObject | undefined)[]) => void): void
export function onPageLoad(config: ((...params: (AnyObject | undefined)[]) => void) | PageLoadConfig) {
  const store = useStore()
  let pageInitialize = false

  const loadCallback = typeof config === 'function' ? config : config?.load
  const showCallback = typeof config === 'object' ? config?.show : undefined

  const execPageLoad = (params?: AnyObject) => {
    if (store.app.ready) {
      loadCallback(params)
    }
    else {
      return false
    }
  }

  onLoad((params) => {
    if (execPageLoad(params) === false) {
      const unsubscribe = store.app.$subscribe(() => {
        execPageLoad(params) && unsubscribe()
      })
    }

    if (showCallback) {
      onShow(() => {
        if (pageInitialize) {
          showCallback(params)
        }

        pageInitialize = true
      })
    }
  })
}
