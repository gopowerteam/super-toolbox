import { name, version } from '../../package.json'

export function defineViteDefine(): Record<'define', Record<string, any>> {
  return {
    define: {
      __APP_NAME__: JSON.stringify(name),
      __APP_VERSION__: JSON.stringify(version),
      __APP_BUILD_TIME__: JSON.stringify(new Date().toISOString()),
    },
  }
}
