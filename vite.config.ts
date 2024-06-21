import { URL, fileURLToPath } from 'node:url'

import { defineConfig } from 'vite'
import UniPages from '@uni-helper/vite-plugin-uni-pages'
import UniLayouts from '@uni-helper/vite-plugin-uni-layouts'
import UniApp from '@dcloudio/vite-plugin-uni'
import Components from '@uni-helper/vite-plugin-uni-components'
import { NutResolver } from 'nutui-uniapp'

export default defineConfig(async () => {
  const UnoCSS = (await import('unocss/vite')).default

  return {
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    plugins: [
      Components({
        dts: true,
        resolvers: [
          NutResolver(),
        ],
      }),
      // https://github.com/uni-helper/vite-plugin-uni-pages
      UniPages(),
      // https://github.com/uni-helper/vite-plugin-uni-layouts
      UniLayouts(),
      UniApp(),
      UnoCSS(),
    ],
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@import "nutui-uniapp/styles/variables.scss";',
        },
      },
    },
  }
})
