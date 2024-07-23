import { defineUniPages } from '@uni-helper/vite-plugin-uni-pages'
import { isH5 } from '@uni-helper/uni-env'

export default defineUniPages({
  pages: [],
  globalStyle: {
    backgroundColor: '@bgColor',
    backgroundColorBottom: '@bgColorBottom',
    backgroundColorTop: '@bgColorTop',
    backgroundTextStyle: '@bgTxtStyle',
    navigationBarBackgroundColor: '@navBgColor',
    navigationBarTextStyle: '@navTxtStyle',
    navigationStyle: isH5 ? 'custom' : 'default',
  },
  subPackages: [],
})
