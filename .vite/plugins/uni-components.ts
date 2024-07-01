import UniComponents from '@uni-helper/vite-plugin-uni-components'
import { NutResolver } from 'nutui-uniapp'

export default UniComponents({
  dts: 'types/generated/components.d.ts',
  globs: [
    'src/shared/components/page-container/page-container.vue',
  ],
  resolvers: [
    NutResolver(),
  ],
})
