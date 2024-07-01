import { onLoad, onUnload } from '@dcloudio/uni-app'
import queryString from 'query-string'
import type { ComponentInternalInstance } from 'vue'
// import type { pages } from 'virtual:uni-pages'

const ROUTER_BACK_EVENT = '__ROUTER_BACK_EVENT__'
// 路由表
const routers = new WeakMap<any, Router>()

// 路由动态参数表
// const routerParams = new Map<string, any>()

// 当前页面列表
type RouterPages = NavigateToOptions['url']

// 支持导航类型
type NavigateMode = 'push' | 'redirect' | 'relaunch'

// type ArrElement<ArrType> = ArrType extends readonly (infer ElementType)[]
//   ? ElementType
//   : never

/**
 * 路由导航配置
 */
interface NavigateOptions {
  query?: { [key: string]: any }
  params?: { [key: string]: any }
  events?: { [key: string | 'back']: (...params: any[]) => void }
}

interface NavigateBackOptionsWithMode extends NavigateOptions {
  mode: NavigateMode
}

/**
 * Router类
 */
class Router {
  // 当前组件实例
  private readonly _instance: ComponentInternalInstance | null
  // 当前页面实例
  private readonly _page
  // 当前页面参数
  private routerParams: AnyObject[] = []

  private get page() {
    return this._page.$page
  }

  private get instance() {
    return this._instance
  }

  public getRouterParams() {
    return this.routerParams.pop() || {}
  }

  public query: {
    [key: string]: string | number
  } = {}

  public params: {
    [key: string]: AnyObject
  } = {}

  constructor(instance: ComponentInternalInstance | null, page: any) {
    this._instance = instance
    this._page = page

    this.onRouterInit()
  }

  /**
   * 注册页面路由
   */
  register() {
    // 处理重复注册
    if (routers.has(this._page)) {
      return
    }

    // 添加路由
    routers.set(this._page, this)
    // 自动卸载
    onUnload(() => routers.delete(this._page))
  }

  /**
   * 页面路由初始化
   */
  private onRouterInit() {
    const setQuery = (query: AnyObject) => {
      this.query = this.decodeQuery(query)
      if (this.page) {
        this.page.query = this.query
      }
    }

    const setParams = () => {
      const [_, beforePage] = getCurrentPages().reverse()
      //   const [page, beforePage] = getCurrentPages().reverse()
      if (beforePage) {
        const params = routers.get(beforePage)?.getRouterParams()
        this.params = params || {}
      }
    }

    onLoad((query: AnyObject = {}) => {
      setParams()
      setQuery(query)
    })
  }

  public getFullPath() {
    if (this.page) {
      const { router, fullPath } = this.page || {}
      return `/${(router || fullPath || '').replace(
        /^\//,
        '',
      )}`
    }
  }

  public getPagePath() {
    return this.getFullPath()?.replace(/\?.*$/, '') as RouterPages
  }

  public getOpenerEventChannel() {
    // TODO: check getOpenerEventChannel
    if (this.instance && this.instance.proxy) {
      const getOpenerEventChannel
        = (this.instance.proxy as any)?.getOpenerEventChannel

      return getOpenerEventChannel && getOpenerEventChannel()
    }
  }

  // private validatePage(page: ArrElement<typeof pages>) {
  //   const store = useStore(store => store.user)

  //   // 验证页面
  //   if (page?.meta?.needLogin !== true) {
  //     return
  //   }

  //   // 页面需要登陆
  //   return !!store.current
  // }

  // private onNeedLogin() {
  //   const login = useLogin()
  //   return login.show()
  // }

  private getQueryString(query?: AnyObject) {
    if (query) {
      const result = queryString.stringify(this.encodeQuery(query), {
        skipEmptyString: true,
        encode: false,
      })

      return result ? `?${result}` : ''
    }
    else {
      return ''
    }
  }

  private safeDecodeURIComponent(value: string) {
    let decodeStr = decodeURIComponent(value)

    while (decodeStr !== decodeURIComponent(decodeStr)) {
      decodeStr = decodeURIComponent(decodeStr)
    }

    return decodeStr
  }

  private decodeQuery(query: AnyObject = {}) {
    return Object.entries(query).reduce<AnyObject>(
      (result, [key, value]) => {
        if (typeof value === 'string' && value.startsWith('__object__')) {
          result[key] = JSON.parse(
            this.safeDecodeURIComponent(
              value.replace(/^__object__/g, ''),
            ),
          )
        }
        else {
          result[key] = value
        }

        return result
      },
      {},
    )
  }

  private encodeQuery(query: AnyObject = {}) {
    return Object.entries(query).reduce<AnyObject>(
      (result, [key, value]) => {
        if (typeof value === 'object') {
          result[key] = `__object__${encodeURIComponent(JSON.stringify(value))}`
        }
        else {
          result[key] = value
        }

        return result
      },
      {},
    )
  }

  public async push(path: string, options?: NavigateOptions): Promise<AnyObject>
  public async push(path: RouterPages, options?: NavigateOptions): Promise<AnyObject>
  public async push(path: RouterPages | string, options: NavigateOptions = {}): Promise<AnyObject> {
    return this.navigateTo(path, {
      ...options,
      mode: 'push',
    })
  }

  public async redirect(path: string, options?: NavigateOptions): Promise<AnyObject>
  public async redirect(path: RouterPages, options?: NavigateOptions): Promise<AnyObject>
  public async redirect(path: RouterPages | string, options: NavigateOptions = {}): Promise<AnyObject> {
    return this.navigateTo(path, {
      ...options,
      mode: 'redirect',
    })
  }

  public async relaunch(path: string, options?: NavigateOptions): Promise<AnyObject>
  public async relaunch(path: RouterPages, options?: NavigateOptions): Promise<AnyObject>
  public async relaunch(path: RouterPages | string, options: NavigateOptions = {}): Promise<AnyObject> {
    return this.navigateTo(path, {
      ...options,
      mode: 'relaunch',
    })
  }

  // TODO: 添加SwitchTab支持

  /**
   * 路由导航
   * @param path
   * @param options
   * @returns
   */
  private async navigateTo(path: string, options?: NavigateBackOptionsWithMode): Promise<AnyObject>
  private async navigateTo(path: RouterPages, options?: NavigateBackOptionsWithMode): Promise<AnyObject>
  private async navigateTo(path: RouterPages | string, options: NavigateBackOptionsWithMode): Promise<AnyObject> {
    // TODO: 权限验证
    // const [_, subPackageName, pagePath] = path.match(/\/sub-packages\/(\w+)\/(.*)/) || []

    // if (this.validatePage(page) === false) {
    //   await this.onNeedLogin()
    // }

    if (options.params) {
      this.routerParams.push(options.params)
    }

    const navigateToOptions: UniApp.NavigateToOptions = {
      url: `${path}${this.getQueryString(options.query)}`,
    }

    // TODO: 替换Promise
    return new Promise((resolve) => {
      if (options.mode === 'push') {
        navigateToOptions.events = {
          ...(options.events || {}),
          [ROUTER_BACK_EVENT]: (data: AnyObject) => {
            resolve(data)
          },
        }
      }

      switch (options.mode) {
        case 'push':
          uni.navigateTo(navigateToOptions)
          break
        case 'redirect':
          uni.redirectTo(navigateToOptions)
          break
        case 'relaunch':
          uni.reLaunch(navigateToOptions)
          break
      }
    })
  }

  /**
   * 路由返回
   * @param option
   */
  public back(option?: UniApp.NavigateBackOptions & { params?: AnyObject | boolean }) {
    const { params, ...backOption } = option || {}

    if (
      this.instance
      && this.instance.proxy
      && option
      && params !== undefined
    ) {
      const { proxy } = this.instance
      const getOpenerEventChannel = (proxy as any)?.getOpenerEventChannel

      const eventChannel = getOpenerEventChannel()

      eventChannel && eventChannel.emit(ROUTER_BACK_EVENT, params)
    }

    uni.navigateBack(backOption)
  }

  /**
   * 获取Params参数
   * @param key
   * @returns AnyObject
   */
  public getParams(key?: string) {
    if (this.params) {
      return key ? this.params[key] : this.params
    }
  }

  /**
   * 获取Query参数
   * @param key
   * @returns AnyObject
   */
  public getQuery(key?: string) {
    if (this.query) {
      return key ? this.query[key] : this.query
    }
  }
}

export function useRouter() {
  // 当前组件实例
  const instance = getCurrentInstance()
  // 当前页面实例
  const [page] = getCurrentPages().reverse()
  // const cache = routers.get(page)

  // if (cache) {
  //   return cache
  // }

  // 创建页面路由
  const router = new Router(instance, page)
  // 注册页面路由
  router.register()
  // 处理页面传递数据
  return router
}
