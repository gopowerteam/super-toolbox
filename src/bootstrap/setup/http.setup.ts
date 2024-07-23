import { setup } from '@gopowerteam/request'
import type { AdapterResponse, ResponseInterceptor } from '@gopowerteam/request'
import { UniappAdapter } from '../http/uniapp.adapter'
import { appConfig } from '@/config/app.config'

class StatusInterceptors implements ResponseInterceptor {
  exec(respone: AdapterResponse) {
    return respone.status === 200
  }
}

class SuccessInterceptors implements ResponseInterceptor {
  exec(response: AdapterResponse) {
    return response.data
  }
}

class ErrorInterceptors implements ResponseInterceptor {
  exec(response: AdapterResponse) {
    return response.data
  }
}

class ExceptionInterceptors implements ResponseInterceptor {
  onStateCode400(response: AdapterResponse) {
    const toast = useToast()
    const { message } = response?.data || ({} as any)

    if (message) {
      toast.error(message)
    }
  }

  exec(response: AdapterResponse) {
    switch (response.status) {
      case 400:
        this.onStateCode400(response)
        break
    }
  }
}

export function httpSetup() {
  // const { miniProgram } = uni.getAccountInfoSync()

  //   置服务端信息
  setup({
    gateway: appConfig.http.gateway,
    adapter: new UniappAdapter(),
    qs: {
      arrayFormat: 'repeat',
      skipNulls: true,
      allowDots: true,
      encodeValuesOnly: true,
      encode: true,
    },
    interceptors: {
      status: new StatusInterceptors(),
      success: new SuccessInterceptors(),
      error: new ErrorInterceptors(),
      exception: new ExceptionInterceptors(),
    },
    plugins: [],
  })
}
