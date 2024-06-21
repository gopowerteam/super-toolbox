import type { CSSOptions } from 'vite'

export function defineViteCSS(): Record<'css', CSSOptions> {
  return {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@import "nutui-uniapp/styles/variables.scss";',
        },
      },
    },

  }
}
