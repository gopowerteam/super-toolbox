import { defineConfig } from 'vite'
import { defineViteCSS } from './.vite/defines/css'
import { defineViteDefine } from './.vite/defines/define'
import { defineVitePlugins } from './.vite/defines/plugins'
import { defineViteResolve } from './.vite/defines/resolve'

export default defineConfig(async () => {
  return {
    ...defineViteResolve(),
    ...defineViteCSS(),
    ...defineViteDefine(),
    ...await defineVitePlugins(),
  }
})
