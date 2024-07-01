import { defineStore } from 'pinia'

export const useAppStore = defineStore('x', () => {
  const ready = ref(false)

  function setReady() {
    ready.value = true
  }

  return {
    ready,
    setReady,
  }
})
