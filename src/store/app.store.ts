import { defineStore } from 'pinia'

export const useAppStore = defineStore('x', () => {
  const ready = ref(false)
  const orientation = ref<'landscape' | 'portrait'>('portrait')

  function setReady() {
    ready.value = true
  }

  function updateOrientation(value: 'landscape' | 'portrait') {
    orientation.value = value
  }

  return {
    ready,
    setReady,
    updateOrientation,
  }
})
