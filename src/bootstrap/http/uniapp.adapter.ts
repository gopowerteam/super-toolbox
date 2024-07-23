import type {
  AdapterResponse,
  RequestAdapter,
  RequestAdapterOptions,
  RequestSetupConfig,
} from '@gopowerteam/request'
import {
  RequestService,
} from '@gopowerteam/request'
import qs from 'qs'

export class UniappAdapter implements RequestAdapter {
  injectConfig?: ((config: RequestSetupConfig) => void) | undefined

  transformException(response: UniApp.RequestSuccessCallbackResult): AdapterResponse {
    return {
      data: response.data as Record<string, any>,
      status: response.statusCode,
      statusText: '',
      headers: response.header,
    }
  }

  filterEmptyData(data: AnyObject) {
    if (data && typeof data === 'object') {
      Object.entries(data).forEach(([key, value]) => {
        if (value === undefined || value === '' || value === null) {
          delete data[key]
        }
      })
    }

    return data
  }

  stringifyParamsQuery(params?: AnyObject) {
    return qs.stringify(
      params,
      {
        ...RequestService.config.qs,
        addQueryPrefix: true,
      },
    )
  }

  /**
   * 发送请求
   * @returns AxiosResponse
   */
  public request({
    baseURL,
        pathURL,
        headers,
        method,
        paramsQuery,
        paramsBody,
  }: RequestAdapterOptions) {
    const paramQueryStr = this.stringifyParamsQuery(paramsQuery)
    const paramsBodyData = this.filterEmptyData(paramsBody)

    return new Promise((resolve, reject) => {
      uni.request({
        // 默认配置对象
        url: `${baseURL}${pathURL}${paramQueryStr}`,
        method: method.toUpperCase() as UniNamespace.RequestOptions['method'],
        header: headers,
        data: paramsBodyData,
        success(result) {
          if (result.statusCode === 200) {
            resolve(result)
          }
          else {
            reject(result)
          }
        },
        fail(result) {
          reject(result)
        },
      })
    })
  }

  /**
   * 转换Response
   * @param response
   */
  public transformResponse(
    response: UniApp.RequestSuccessCallbackResult,
  ): AdapterResponse {
    return {
      data: response.data as any,
      statusText: '',
      status: response.statusCode,
      headers: response.header,
    }
  }
}
