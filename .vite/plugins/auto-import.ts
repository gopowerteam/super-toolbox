import autoImport from 'unplugin-auto-import/vite'

export default autoImport({
  dts: 'types/generated/auto-import.d.ts',
  include: [/\.tsx?$/, /\.vue$/],
  imports: [
    'vue',
    {
      '@/router': ['useRouter'],
      '@/store': ['useStore'],
    },
  ],
  dirs: [
    'src/composables/define/**',
    'src/composables/hooks/**',
    'src/composables/lifecycle/**',
  ],
  vueTemplate: true,
  injectAtEnd: true,
  eslintrc: {
    enabled: true,
  },
})
