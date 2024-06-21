export default async () => {
  const UnoCSS = (await import('unocss/vite')).default
  const PresetUni = (await import('@uni-helper/unocss-preset-uni'))

  return UnoCSS({
    presets: [
      () => PresetUni,
    ],
  })
}
