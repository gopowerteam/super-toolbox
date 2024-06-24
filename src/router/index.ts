// import { onLoad, onUnload } from '@dcloudio/uni-app'
// import queryString from 'query-string'
// import type { pages } from 'virtual:uni-pages'
// import type { ComponentInternalInstance } from 'vue'

// // 路由表
// const _Routers = new WeakMap<any, Router>()

// // 路由动态参数表
// const _RouterParams = new Map<string, any>()

// // 当前页面列表
// type RouterPages = NavigateToOptions['url']

// // 支持导航类型
// type NavigateMode = 'push' | 'redirect' | 'relaunch'

// type ArrElement<ArrType> = ArrType extends readonly (infer ElementType)[]
//   ? ElementType
//   : never

// /**
//  * 路由导航配置
//  */
// interface navigateOptions {
//   mode?: NavigateMode
//   query?: { [key: string]: any }
//   params?: { [key: string]: any }
//   events?: { [key: string]: (...params: any[]) => void }
// }

// /**
//  * 默认导航配置
//  */
// const defaultNavigateMode: NavigateMode = 'push'

// /**
//  * Router类
//  */
// class Router {
//   // 当前组件实例
//   private readonly _instance: ComponentInternalInstance | null
//   // 当前页面实例
//   private readonly _page
//   // 当前页面参数
//   private routerParams: AnyObject[] = []

//   private get page() {
//     return this._page.$page
//   }

//   private get instance() {
//     return this._instance
//   }

//   public getRouterParams() {
//     return this.routerParams.pop() || {}
//   }

//   private query: {
//     [key: string]: string | number
//   } = {}

//   private params: {
//     [key: string]: AnyObject
//   } = {}

//   constructor(instance: ComponentInternalInstance | null, page: any) {
//     this._instance = instance
//     this._page = page

//     this.onRouterInit()
//   }

//   /**
//    * 页面路由初始化
//    */
//   private onRouterInit() {
//     const setQuery = (query: AnyObject) => {
//       this.query = this.decodeQuery(query)
//       if (this.page) {
//         this.page.query = this.query
//       }
//     }

//     const setParams = () => {
//       // TODO: review
//       const [_, beforePage] = getCurrentPages().reverse()
//       //   const [page, beforePage] = getCurrentPages().reverse()
//       if (beforePage) {
//         const params = routers.get(beforePage)?.getRouterParams()
//         this.params = params || {}
//       }
//       // const eventChannel = this.getOpenerEventChannel()

//       // if (eventChannel && eventChannel.once) {
//       //     this.eventChannel = eventChannel
//       //     eventChannel.once(events.router.params, params => {
//       //         this.params = params
//       //     })
//       // }
//     }

//     onLoad((query: AnyObject = {}) => {
//       setParams()
//       setQuery(query)
//     })
//   }

//   public getFullPath() {
//     if (this.page) {
//       const { router, fullPath } = get(this.page) || {}
//       return `/${(router || fullPath || '').replace(
//         /^\//,
//         '',
//       )}`
//     }
//   }

//   public getPagePath() {
//     return this.getFullPath()?.replace(/\?.*$/, '') as RouterPages
//   }

//   public getOpenerEventChannel() {
//     // TODO: check getOpenerEventChannel
//     if (this.instance && this.instance.proxy) {
//       const getOpenerEventChannel
//         = (this.instance.proxy as any)?.getOpenerEventChannel

//       return getOpenerEventChannel && getOpenerEventChannel()
//     }
//   }

//   /**
//    * 验证页面权限
//    * @param page
//    * @returns
//    */
//   private validatePage(page: ArrElement<typeof pages>) {
//     const store = useStore(store => store.user)

//     // 验证页面牧尘在需要登陆
//     if (page?.meta?.needLogin !== true) {
//       return
//     }

//     // 页面需要登陆
//     return !!store.current
//   }

//   private onNeedLogin() {
//     const login = useLogin()
//     return login.show()
//   }

//   private safeDecodeURIComponent(value: string) {
//     let decodeStr = decodeURIComponent(value)

//     while (decodeStr !== decodeURIComponent(decodeStr)) {
//       decodeStr = decodeURIComponent(decodeStr)
//     }

//     return decodeStr
//   }

//   private decodeQuery(query: AnyObject = {}) {
//     return Object.entries(query).reduce<AnyObject>(
//       (result, [key, value]) => (
//         (result[key]
//           = typeof value === 'string' && value.startsWith('__object__')
//             ? JSON.parse(
//               // TODO:为了安全转换了两次
//               this.safeDecodeURIComponent(
//                 value.replace(/^__object__/g, ''),
//               ),
//             )
//             : value), result
//       ),
//       {},
//     )
//   }

//   private encodeQuery(query: AnyObject = {}) {
//     return Object.entries(query).reduce<AnyObject>(
//       (result, [key, value]) => (
//         (result[key]
//           = typeof value === 'object'
//             ? `__object__${encodeURIComponent(JSON.stringify(value))}`
//             : value),
//         result
//       ),
//       {},
//     )
//   }

//   /**
//    * 路由导航
//    * @param path
//    * @param options
//    * @returns
//    */
//   public async navigateTo(path: string, options?: navigateOptions): Promise<AnyObject>
//   public async navigateTo(path: RouterPages, options?: navigateOptions): Promise<AnyObject>
//   public async navigateTo(path: RouterPages | string, options: navigateOptions = {}): Promise<AnyObject> {
//     const mode = options.mode ?? defaultNavigateMode
//     const [_, subPackageName, pagePath] = path.match(/\/sub-packages\/(\w+)\/(.*)/) || []

//     if (this.validatePage(page) === false) {
//       await this.onNeedLogin()
//     }

//     this.routerParams.push(options.params)

//     // 获取路由行为
//     const navigateAction = ({
//       push: uni.navigateTo,
//       redirect: uni.redirectTo,
//       relaunch: uni.reLaunch,
//     } as Record<NavigateMode, (options: AnyObject) => void>)[mode]

//     const navigateUrl = `${path}${options.query
//       ? queryString.stringify(this.encodeQuery(options.query), {
//         skipEmptyString: true,
//         encode: false,
//       })
//       : ''
//       }`

//     return new Promise((resolve) => {
//       // 获取路由参数
//       const navigateOption = Object.assign(
//         {
//           url: navigateUrl,
//         },
//         mode === 'push'
//           ? {
//               events: {
//                 ...(options.events || {}),

//                 [events.router.back]: (data: AnyObject) => {
//                   resolve(data)
//                 },
//               },
//             }
//           : {},
//       )

//       // 触发页面导航

//       navigateAction(navigateOption)
//     })
//   }

//   public back(option?: UniApp.NavigateBackOptions & { params?: AnyObject | boolean }) {
//     const { params, ...backOption } = option || {}

//     if (
//       this.instance
//       && this.instance.proxy
//       && option
//       && params !== undefined
//     ) {
//       const { proxy } = this.instance
//       // TODO: check getOpenerEventChannel
//       const getOpenerEventChannel = (proxy as any)?.getOpenerEventChannel

//       const eventChannel = getOpenerEventChannel()

//       eventChannel && eventChannel.emit(events.router.back, params)
//     }

//     uni.navigateBack(backOption)
//   }

//   /**
//    * 获取Params参数
//    * @param key
//    * @returns AnyObject
//    */
//   public getParams(key?: string) {
//     if (this.params) {
//       return key ? this.params[key] : this.params
//     }
//   }

//   /**
//    * 获取Query参数
//    * @param key
//    * @returns AnyObject
//    */
//   public getQuery(key?: string) {
//     if (this.query) {
//       return key ? this.query[key] : this.query
//     }
//   }
// }

// export function useRouter() {
//   const instance = getCurrentInstance()
//   const [page] = getCurrentPages().reverse()
//   const cache = routers.get(page)

//   if (cache) {
//     return cache
//   }

//   const router = new Router(instance, page)
//   routers.set(page, router)

//   onUnload(() => routers.delete(page))

//   // 处理页面传递数据
//   return router
// }
