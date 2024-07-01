export function onPageReady(onReady: () => void) {
  const store = useStore()

  const execPageReady = () => {
    if (store.app.ready) {
      onReady()
    }
    else {
      return false
    }
  }

  onMounted(() => {
    if (execPageReady() === false) {
      const unsubscribe = store.$subscribe(() => {
        execPageReady() && unsubscribe()
      })
    }
  })
}
