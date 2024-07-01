export async function launch() {
  const store = useStore()
  store.app.setReady()
}
