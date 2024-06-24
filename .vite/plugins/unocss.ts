export default async () => {
  const UnoCSS = (await import('unocss/vite')).default

  return UnoCSS()
}
