import { defineStore } from 'pinia'
import { useAppStore } from './app.store'

export const useStore = defineStore('index', () => {
  const app = useAppStore()

  return {
    app,
  }
})
