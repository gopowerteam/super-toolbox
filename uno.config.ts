import { FileSystemIconLoader } from '@iconify/utils/lib/loader/node-loaders'
import presetIcons from '@unocss/preset-icons'
import { defineConfig } from 'unocss'
import { presetUni } from '@uni-helper/unocss-preset-uni'

function importSvgIcons() {
  return FileSystemIconLoader(
    './src/assets/svgs',
    svg => svg.replace(/#fff/, 'currentColor'),
  )
}

export default defineConfig({
  presets: [
    presetUni({
      attributify: {
        prefix: 'css:',
        prefixedOnly: true,
        nonValuedAttribute: true,
      },
    }),
    presetIcons({
      prefix: 'icon-',
      collections: {
        'park-outline': () => import('@iconify-json/icon-park-outline').then(i => i.icons),
        'park-solid': () => import('@iconify-json/icon-park-solid').then(i => i.icons),
        'park': () => import('@iconify-json/icon-park').then(i => i.icons),
        'svg': importSvgIcons(),
      },
      extraProperties: {
        'display': 'inline-block',
        'vertical-align': 'middle',
      },
    }),
  ],
  shortcuts: [
    ['flex-center', 'flex justify-center items-center'],
  ],
  safelist: [
    ...[
      'icon-svg:calculation',
      'icon-svg:shulte',
      'icon-svg:snake',
      'icon-svg:time',
    ],
    ...Array.from({ length: 10 }, (_, i) => `space-x-${i + 1}`),
    ...Array.from({ length: 10 }, (_, i) => `space-y-${i + 1}`),
  ],
})
