export const appConfig = {
  title: '应用名称',
  http: {
    gateway: import.meta.env.VITE_HTTP_GATEWAY as string,
  },
}
