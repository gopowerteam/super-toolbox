import UniPages from '@uni-helper/vite-plugin-uni-pages'

export default UniPages({
  exclude: ['**/components/**/**.*'],
  subPackages: ['src/pages-sub'],
  dts: 'types/generated/pages.d.ts',
})
